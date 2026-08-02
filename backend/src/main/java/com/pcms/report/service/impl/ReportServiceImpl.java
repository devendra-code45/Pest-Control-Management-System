package com.pcms.report.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pcms.booking.entity.Booking;
import com.pcms.booking.entity.BookingStatus;
import com.pcms.booking.repository.BookingRepository;
import com.pcms.complaint.entity.Complaint;
import com.pcms.complaint.entity.ComplaintStatus;
import com.pcms.complaint.repository.ComplaintRepository;
import com.pcms.payment.entity.Payment;
import com.pcms.payment.entity.PaymentStatus;
import com.pcms.payment.repository.PaymentRepository;
import com.pcms.report.dto.ReportOverviewResponse;
import com.pcms.report.dto.ReportResponse;
import com.pcms.report.dto.ReportSummaryResponse;
import com.pcms.report.service.ReportService;
import com.pcms.service.entity.PestService;
import com.pcms.service.repository.ServiceRepository;
import com.pcms.technician.entity.Technician;
import com.pcms.technician.repository.TechnicianRepository;
import com.pcms.user.entity.Role;
import com.pcms.user.entity.User;
import com.pcms.user.repository.UserRepository;

@Service
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH);

    private static final DateTimeFormatter DATE_TIME_FORMATTER =
            DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a", Locale.ENGLISH);

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final ComplaintRepository complaintRepository;
    private final ServiceRepository serviceRepository;
    private final TechnicianRepository technicianRepository;
    private final UserRepository userRepository;

    public ReportServiceImpl(
            BookingRepository bookingRepository,
            PaymentRepository paymentRepository,
            ComplaintRepository complaintRepository,
            ServiceRepository serviceRepository,
            TechnicianRepository technicianRepository,
            UserRepository userRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.complaintRepository = complaintRepository;
        this.serviceRepository = serviceRepository;
        this.technicianRepository = technicianRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ReportOverviewResponse getOverview(
            LocalDate startDate,
            LocalDate endDate
    ) {
        DateRange range = resolveRange(startDate, endDate);

        ReportOverviewResponse response =
                new ReportOverviewResponse();

        response.setStartDate(range.startDate());
        response.setEndDate(range.endDate());
        response.setSummary(buildSummary(range));

        List<ReportResponse> reports = new ArrayList<>();
        reports.add(buildRevenueReport(range));
        reports.add(buildServiceReport(range));
        reports.add(buildBookingReport(range));
        reports.add(buildComplaintReport(range));
        reports.add(buildCustomerReport(range));
        reports.add(buildTechnicianReport(range));
        reports.add(buildPaymentReport(range));

        response.setReports(reports);
        return response;
    }

    @Override
    public ReportSummaryResponse getSummary(
            LocalDate startDate,
            LocalDate endDate
    ) {
        return buildSummary(
                resolveRange(startDate, endDate)
        );
    }

    @Override
    public ReportResponse getReport(
            String reportType,
            LocalDate startDate,
            LocalDate endDate
    ) {
        DateRange range = resolveRange(startDate, endDate);
        String normalized = normalizeReportType(reportType);

        return switch (normalized) {
            case "revenue" -> buildRevenueReport(range);
            case "service" -> buildServiceReport(range);
            case "booking" -> buildBookingReport(range);
            case "complaint" -> buildComplaintReport(range);
            case "customer" -> buildCustomerReport(range);
            case "technician" -> buildTechnicianReport(range);
            case "payment" -> buildPaymentReport(range);
            default -> throw new RuntimeException(
                    "Invalid report type."
            );
        };
    }

    private ReportSummaryResponse buildSummary(
            DateRange range
    ) {
        List<Booking> bookings = filteredBookings(range);
        List<Payment> payments = filteredPayments(range);
        List<Complaint> complaints = filteredComplaints(range);

        BigDecimal totalRevenue = payments.stream()
                .map(this::netCollectedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal expectedAmount = payments.stream()
                .filter(payment -> payment.getStatus() != PaymentStatus.FAILED)
                .map(payment -> safeAmount(payment.getAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        double collectionRate = expectedAmount.signum() == 0
                ? 0.0
                : totalRevenue
                        .multiply(BigDecimal.valueOf(100))
                        .divide(expectedAmount, 2, RoundingMode.HALF_UP)
                        .doubleValue();

        long completedServices = bookings.stream()
                .filter(booking -> booking.getStatus() == BookingStatus.COMPLETED)
                .count();

        long openComplaints = complaints.stream()
                .filter(complaint ->
                        complaint.getStatus() == ComplaintStatus.PENDING
                                || complaint.getStatus() == ComplaintStatus.IN_PROGRESS
                )
                .count();

        long totalCustomers = userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() == Role.CUSTOMER)
                .count();

        long activeServices = serviceRepository.findAll()
                .stream()
                .filter(service -> Boolean.TRUE.equals(service.getActive()))
                .count();

        ReportSummaryResponse summary =
                new ReportSummaryResponse();

        summary.setTotalRevenue(
                totalRevenue.setScale(2, RoundingMode.HALF_UP)
        );
        summary.setCompletedServices(completedServices);
        summary.setOpenComplaints(openComplaints);
        summary.setCollectionRate(collectionRate);
        summary.setTotalBookings(bookings.size());
        summary.setTotalCustomers(totalCustomers);
        summary.setTotalTechnicians(technicianRepository.count());
        summary.setTotalPayments(payments.size());
        summary.setActiveServices(activeServices);

        return summary;
    }

    private ReportResponse buildRevenueReport(
            DateRange range
    ) {
        List<Payment> payments = filteredPayments(range);
        List<List<String>> rows = payments.stream()
                .sorted(Comparator.comparing(
                        Payment::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .map(payment -> List.of(
                        safeText(payment.getTransactionId()),
                        customerName(payment.getCustomer()),
                        bookingReference(payment.getBooking()),
                        money(payment.getAmount()),
                        money(payment.getRefundedAmount()),
                        money(netCollectedAmount(payment)),
                        payment.getPaymentMethod() == null
                                ? "—"
                                : payment.getPaymentMethod().name(),
                        payment.getStatus() == null
                                ? "—"
                                : payment.getStatus().name(),
                        formatDateTime(payment.getCreatedAt())
                ))
                .toList();

        return buildReport(
                "revenue",
                "Revenue Summary",
                "Revenue Report",
                range,
                "Collected revenue after refunds for the selected period.",
                List.of(
                        "Transaction ID",
                        "Customer",
                        "Booking ID",
                        "Amount",
                        "Refunded",
                        "Net Revenue",
                        "Method",
                        "Status",
                        "Paid On"
                ),
                rows
        );
    }

    private ReportResponse buildPaymentReport(
            DateRange range
    ) {
        List<Payment> payments = filteredPayments(range);
        List<List<String>> rows = payments.stream()
                .sorted(Comparator.comparing(
                        Payment::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .map(payment -> List.of(
                        String.valueOf(payment.getId()),
                        safeText(payment.getTransactionId()),
                        customerName(payment.getCustomer()),
                        bookingReference(payment.getBooking()),
                        money(payment.getAmount()),
                        payment.getPaymentMethod() == null
                                ? "—"
                                : payment.getPaymentMethod().name(),
                        payment.getStatus() == null
                                ? "—"
                                : payment.getStatus().name(),
                        formatDateTime(payment.getCreatedAt())
                ))
                .toList();

        return buildReport(
                "payment",
                "Payment Transactions",
                "Payment Report",
                range,
                "Payment transactions, methods and payment status for the selected period.",
                List.of(
                        "Payment ID",
                        "Transaction ID",
                        "Customer",
                        "Booking ID",
                        "Amount",
                        "Method",
                        "Status",
                        "Created On"
                ),
                rows
        );
    }

    private ReportResponse buildBookingReport(
            DateRange range
    ) {
        List<Booking> bookings = filteredBookings(range);
        List<List<String>> rows = bookings.stream()
                .sorted(Comparator.comparing(
                        Booking::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .map(booking -> List.of(
                        bookingReference(booking),
                        customerName(booking.getCustomer()),
                        safeText(booking.getServiceName()),
                        booking.getPreferredDate() == null
                                ? "—"
                                : booking.getPreferredDate().format(DATE_FORMATTER),
                        money(booking.getTotalAmount()),
                        safeText(booking.getTechnicianName()),
                        booking.getStatus() == null
                                ? "—"
                                : booking.getStatus().name(),
                        formatDateTime(booking.getCreatedAt())
                ))
                .toList();

        return buildReport(
                "booking",
                "Booking Overview",
                "Booking Report",
                range,
                "Bookings, assigned technicians, amounts and current booking status.",
                List.of(
                        "Booking ID",
                        "Customer",
                        "Service",
                        "Preferred Date",
                        "Amount",
                        "Technician",
                        "Status",
                        "Created On"
                ),
                rows
        );
    }

    private ReportResponse buildComplaintReport(
            DateRange range
    ) {
        List<Complaint> complaints = filteredComplaints(range);
        List<List<String>> rows = complaints.stream()
                .sorted(Comparator.comparing(
                        Complaint::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .map(complaint -> List.of(
                        safeText(complaint.getComplaintNumber()),
                        customerName(complaint.getCustomer()),
                        complaint.getBookingReference() == null
                                ? bookingReference(complaint.getBooking())
                                : complaint.getBookingReference(),
                        safeText(complaint.getSubject()),
                        complaint.getCategory() == null
                                ? "—"
                                : complaint.getCategory().getDisplayName(),
                        complaint.getStatus() == null
                                ? "—"
                                : complaint.getStatus().getDisplayName(),
                        formatDateTime(complaint.getCreatedAt())
                ))
                .toList();

        return buildReport(
                "complaint",
                "Complaint Overview",
                "Complaint Report",
                range,
                "Customer complaints and their current resolution status.",
                List.of(
                        "Complaint ID",
                        "Customer",
                        "Booking ID",
                        "Subject",
                        "Category",
                        "Status",
                        "Submitted On"
                ),
                rows
        );
    }

    private ReportResponse buildServiceReport(
            DateRange range
    ) {
        List<Booking> bookings = filteredBookings(range);
        List<Payment> payments = filteredPayments(range);
        List<PestService> services = serviceRepository.findAll();

        Map<Long, Payment> paymentByBooking = payments.stream()
                .filter(payment -> payment.getBooking() != null)
                .collect(Collectors.toMap(
                        payment -> payment.getBooking().getId(),
                        Function.identity(),
                        (first, second) -> first
                ));

        Map<String, List<Booking>> bookingsByService = bookings.stream()
                .collect(Collectors.groupingBy(
                        booking -> safeText(booking.getServiceName()),
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

        List<List<String>> rows = new ArrayList<>();

        for (PestService service : services) {
            List<Booking> serviceBookings =
                    bookingsByService.getOrDefault(service.getName(), List.of());

            long completed = serviceBookings.stream()
                    .filter(booking -> booking.getStatus() == BookingStatus.COMPLETED)
                    .count();

            BigDecimal revenue = serviceBookings.stream()
                    .map(Booking::getId)
                    .map(paymentByBooking::get)
                    .filter(payment -> payment != null)
                    .map(this::netCollectedAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            rows.add(List.of(
                    safeText(service.getName()),
                    safeText(service.getCategory()),
                    money(service.getPrice()),
                    Boolean.TRUE.equals(service.getActive()) ? "Active" : "Inactive",
                    String.valueOf(serviceBookings.size()),
                    String.valueOf(completed),
                    money(revenue)
            ));
        }

        return buildReport(
                "service",
                "Service Performance",
                "Service Report",
                range,
                "Service usage, completed jobs and collected revenue by service.",
                List.of(
                        "Service",
                        "Category",
                        "Base Price",
                        "Availability",
                        "Bookings",
                        "Completed",
                        "Revenue"
                ),
                rows
        );
    }

    private ReportResponse buildCustomerReport(
            DateRange range
    ) {
        List<User> customers = userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() == Role.CUSTOMER)
                .sorted(Comparator.comparing(
                        User::getFullName,
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                ))
                .toList();

        List<Booking> bookings = filteredBookings(range);
        List<Payment> payments = filteredPayments(range);
        List<Complaint> complaints = filteredComplaints(range);

        Map<Long, List<Booking>> bookingsByCustomer = bookings.stream()
                .filter(booking -> booking.getCustomer() != null)
                .collect(Collectors.groupingBy(
                        booking -> booking.getCustomer().getId()
                ));

        Map<Long, List<Payment>> paymentsByCustomer = payments.stream()
                .filter(payment -> payment.getCustomer() != null)
                .collect(Collectors.groupingBy(
                        payment -> payment.getCustomer().getId()
                ));

        Map<Long, Long> complaintsByCustomer = complaints.stream()
                .filter(complaint -> complaint.getCustomer() != null)
                .collect(Collectors.groupingBy(
                        complaint -> complaint.getCustomer().getId(),
                        Collectors.counting()
                ));

        List<List<String>> rows = new ArrayList<>();

        for (User customer : customers) {
            List<Booking> customerBookings =
                    bookingsByCustomer.getOrDefault(customer.getId(), List.of());

            long completed = customerBookings.stream()
                    .filter(booking -> booking.getStatus() == BookingStatus.COMPLETED)
                    .count();

            BigDecimal paidAmount = paymentsByCustomer
                    .getOrDefault(customer.getId(), List.of())
                    .stream()
                    .map(this::netCollectedAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            rows.add(List.of(
                    safeText(customer.getFullName()),
                    safeText(customer.getEmail()),
                    safeText(customer.getPhone()),
                    String.valueOf(customerBookings.size()),
                    String.valueOf(completed),
                    String.valueOf(complaintsByCustomer.getOrDefault(customer.getId(), 0L)),
                    money(paidAmount),
                    customer.isActive() ? "Active" : "Inactive"
            ));
        }

        return buildReport(
                "customer",
                "Customer Activity",
                "Customer Report",
                range,
                "Customer bookings, completed services, complaints and paid amount.",
                List.of(
                        "Customer",
                        "Email",
                        "Phone",
                        "Bookings",
                        "Completed",
                        "Complaints",
                        "Paid Amount",
                        "Account"
                ),
                rows
        );
    }

    private ReportResponse buildTechnicianReport(
            DateRange range
    ) {
        List<Technician> technicians = technicianRepository.findAll();
        List<Booking> bookings = filteredBookings(range);

        Map<Long, List<Booking>> bookingsByTechnician = bookings.stream()
                .filter(booking -> booking.getTechnicianId() != null)
                .collect(Collectors.groupingBy(Booking::getTechnicianId));

        List<List<String>> rows = technicians.stream()
                .sorted(Comparator.comparing(
                        Technician::getFullName,
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                ))
                .map(technician -> {
                    List<Booking> assigned = bookingsByTechnician
                            .getOrDefault(technician.getId(), List.of());

                    long completed = assigned.stream()
                            .filter(booking -> booking.getStatus() == BookingStatus.COMPLETED)
                            .count();

                    return List.of(
                            safeText(technician.getFullName()),
                            safeText(technician.getPhone()),
                            safeText(technician.getSpecialization()),
                            technician.getStatus() == null
                                    ? "—"
                                    : technician.getStatus().name(),
                            String.valueOf(assigned.size()),
                            String.valueOf(completed)
                    );
                })
                .toList();

        return buildReport(
                "technician",
                "Technician Summary",
                "Technician Report",
                range,
                "Technician availability, assigned jobs and completed jobs.",
                List.of(
                        "Technician",
                        "Phone",
                        "Specialization",
                        "Status",
                        "Assigned Jobs",
                        "Completed Jobs"
                ),
                rows
        );
    }

    private ReportResponse buildReport(
            String id,
            String name,
            String type,
            DateRange range,
            String summary,
            List<String> headers,
            List<List<String>> rows
    ) {
        ReportResponse report = new ReportResponse();
        report.setId(id);
        report.setName(name);
        report.setType(type);
        report.setDateRange(formatDateRange(range));
        report.setGeneratedOn(LocalDateTime.now().format(DATE_TIME_FORMATTER));
        report.setStatus("Completed");
        report.setSummary(summary);
        report.setHeaders(headers);
        report.setRows(rows);
        return report;
    }

    private List<Booking> filteredBookings(
            DateRange range
    ) {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .filter(booking -> inRange(booking.getCreatedAt(), range))
                .toList();
    }

    private List<Payment> filteredPayments(
            DateRange range
    ) {
        return paymentRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .filter(payment -> inRange(payment.getCreatedAt(), range))
                .toList();
    }

    private List<Complaint> filteredComplaints(
            DateRange range
    ) {
        return complaintRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .filter(complaint -> inRange(complaint.getCreatedAt(), range))
                .toList();
    }

    private boolean inRange(
            LocalDateTime value,
            DateRange range
    ) {
        return value != null
                && !value.isBefore(range.startInclusive())
                && value.isBefore(range.endExclusive());
    }

    private BigDecimal netCollectedAmount(
            Payment payment
    ) {
        if (payment == null || payment.getStatus() == null) {
            return BigDecimal.ZERO;
        }

        if (payment.getStatus() == PaymentStatus.PAID) {
            return safeAmount(payment.getAmount());
        }

        if (payment.getStatus() == PaymentStatus.REFUNDED) {
            BigDecimal net = safeAmount(payment.getAmount())
                    .subtract(safeAmount(payment.getRefundedAmount()));

            return net.signum() < 0 ? BigDecimal.ZERO : net;
        }

        return BigDecimal.ZERO;
    }

    private BigDecimal safeAmount(
            BigDecimal amount
    ) {
        return amount == null ? BigDecimal.ZERO : amount;
    }

    private String money(
            BigDecimal amount
    ) {
        return "₹" + safeAmount(amount)
                .setScale(2, RoundingMode.HALF_UP)
                .toPlainString();
    }

    private String customerName(
            User customer
    ) {
        return customer == null
                ? "—"
                : safeText(customer.getFullName());
    }

    private String bookingReference(
            Booking booking
    ) {
        return booking == null || booking.getId() == null
                ? "Not linked"
                : "BK-" + String.format("%04d", booking.getId());
    }

    private String formatDateTime(
            LocalDateTime value
    ) {
        return value == null
                ? "—"
                : value.format(DATE_TIME_FORMATTER);
    }

    private String safeText(
            String value
    ) {
        return value == null || value.isBlank() ? "—" : value;
    }

    private String normalizeReportType(
            String reportType
    ) {
        if (reportType == null || reportType.isBlank()) {
            throw new RuntimeException("Report type is required.");
        }

        return reportType.trim()
                .toLowerCase(Locale.ENGLISH)
                .replace("-report", "")
                .replace("_report", "")
                .replace(" report", "")
                .replace("-", "")
                .replace("_", "")
                .replace(" ", "");
    }

    private DateRange resolveRange(
            LocalDate requestedStart,
            LocalDate requestedEnd
    ) {
        LocalDate endDate = requestedEnd == null
                ? LocalDate.now()
                : requestedEnd;

        LocalDate startDate = requestedStart == null
                ? endDate.withDayOfMonth(1)
                : requestedStart;

        if (endDate.isBefore(startDate)) {
            throw new RuntimeException(
                    "End date cannot be before start date."
            );
        }

        return new DateRange(
                startDate,
                endDate,
                startDate.atStartOfDay(),
                endDate.plusDays(1).atStartOfDay()
        );
    }

    private String formatDateRange(
            DateRange range
    ) {
        return range.startDate().format(DATE_FORMATTER)
                + " - "
                + range.endDate().format(DATE_FORMATTER);
    }

    private record DateRange(
            LocalDate startDate,
            LocalDate endDate,
            LocalDateTime startInclusive,
            LocalDateTime endExclusive
    ) {
    }
}
