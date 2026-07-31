import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ChevronRight,
    ArrowLeft,
    Printer,
    CheckCircle2,
    Flag,
    MapPin,
    Calendar,
    CheckCircle,
    User,
    Phone,
    Building2,
    Bug,
    Clock,
    UserCheck,
    StickyNote,
    AlertCircle,
    RotateCcw,
} from "lucide-react";
import api from "../../../api/axios";
import "./accepted-bookings-view.css";

const STATUS_LABELS = {
    ACCEPTED: "Accepted",
    ASSIGNED: "Assigned",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
};

const formatDate = (value) => {
    if (!value) return "—";

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(`${value}T00:00:00`));
};

const formatDateTime = (value) => {
    if (!value) return "—";

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
};

const formatFrequency = (value) => {
    if (!value) {
        return "One Time";
    }

    return value
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(
            /\b\w/g,
            (letter) => letter.toUpperCase()
        );
};

const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const getPriority = (preferredDate) => {
    if (!preferredDate) return "Low";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const serviceDate = new Date(`${preferredDate}T00:00:00`);
    const differenceInDays = Math.ceil(
        (serviceDate.getTime() - today.getTime()) / 86400000
    );

    if (differenceInDays <= 1) return "High";
    if (differenceInDays <= 3) return "Medium";
    return "Low";
};

const getErrorMessage = (error) => {
    const responseData = error.response?.data;

    if (typeof responseData === "string" && responseData.trim()) {
        return responseData;
    }

    if (responseData?.message) return responseData.message;
    if (responseData?.error) return responseData.error;

    if (!error.response) {
        return "Unable to connect to the backend.";
    }

    return "Unable to load booking details.";
};

const InfoRow = ({ label, value }) => (
    <div className="bd-info-row">
        <span className="bd-info-label">{label}</span>
        <span className="bd-info-colon">:</span>
        <span className="bd-info-value">{value || "—"}</span>
    </div>
);

export default function BookingDetails() {
    const navigate = useNavigate();
    const location = useLocation();

    const bookingId =
        location.state?.bookingId ||
        Number(sessionStorage.getItem("pcmsSelectedBookingId"));

    const [bookingData, setBookingData] = useState(null);
    const [technicianData, setTechnicianData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadBookingDetails = async () => {
        if (!bookingId) {
            setError("No booking was selected.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            sessionStorage.setItem(
                "pcmsSelectedBookingId",
                String(bookingId)
            );

            const bookingResponse = await api.get(
                `/admin/bookings/${bookingId}`
            );

            const currentBooking = bookingResponse.data;
            setBookingData(currentBooking);

            if (currentBooking.technicianId) {
                try {
                    const technicianResponse = await api.get(
                        `/admin/technicians/${currentBooking.technicianId}`
                    );
                    setTechnicianData(technicianResponse.data);
                } catch {
                    setTechnicianData(null);
                }
            } else {
                setTechnicianData(null);
            }
        } catch (requestError) {
            setBookingData(null);
            setTechnicianData(null);
            setError(getErrorMessage(requestError));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookingDetails();
    }, [bookingId]);

    const booking = useMemo(() => {
        if (!bookingData) return null;

        return {
            id: `BK-${bookingData.id}`,
            status:
                STATUS_LABELS[bookingData.status] ||
                bookingData.status ||
                "—",
            bookedOn: formatDateTime(bookingData.createdAt),
            acceptedOn: formatDateTime(bookingData.updatedAt),
            priority: getPriority(bookingData.preferredDate),
        };
    }, [bookingData]);

    const customer = useMemo(() => {
        if (!bookingData) return null;

        return {
            name: bookingData.customerName || "—",
            phone: bookingData.customerPhone || "—",
            email: bookingData.customerEmail || "—",
            address:
                [
                    bookingData.serviceAddress,
                    bookingData.landmark,
                    bookingData.city,
                    bookingData.pincode,
                ]
                    .filter(Boolean)
                    .join(", ") || "—",
        };
    }, [bookingData]);

    const property = useMemo(() => {
        if (!bookingData) return null;

        return {
            name:
                [bookingData.propertyType, bookingData.propertySize]
                    .filter(Boolean)
                    .join(" - ") || "Property",
            type: bookingData.propertyType || "—",
            address:
                [
                    bookingData.serviceAddress,
                    bookingData.landmark,
                    bookingData.city,
                    bookingData.pincode,
                ]
                    .filter(Boolean)
                    .join(", ") || "—",
        };
    }, [bookingData]);

    const service = useMemo(() => {
        if (!bookingData) return null;

        return {
            pestType: bookingData.pestType || "—",
            serviceType:
                [bookingData.serviceName, bookingData.serviceType]
                    .filter(Boolean)
                    .join(" - ") || "—",
            description: bookingData.problemDescription || "—",
            amount: formatAmount(bookingData.totalAmount),
            paymentStatus: "Not Recorded",
        };
    }, [bookingData]);

    const schedule = useMemo(() => {
        if (!bookingData) return null;

        return {
            date: formatDate(bookingData.preferredDate),
            time: bookingData.preferredTimeSlot || "—",
            duration: "—",
            frequency: formatFrequency(
                bookingData.serviceFrequency
            ),
            timeSlot: bookingData.preferredTimeSlot || "—",
        };
    }, [bookingData]);

    const technician = useMemo(() => {
        if (!bookingData) return null;

        return {
            name: bookingData.technicianName || "Not Assigned",
            id: bookingData.technicianId
                ? `TECH-${bookingData.technicianId}`
                : "—",
            phone: bookingData.technicianPhone || "—",
            experience: technicianData
                ? `${technicianData.experienceYears} Years`
                : "—",
            specialization:
                technicianData?.specialization ||
                bookingData.serviceName ||
                "—",
        };
    }, [bookingData, technicianData]);

    const notes = useMemo(() => {
        if (!bookingData) return null;

        return {
            service: bookingData.problemDescription || "—",
            customer: bookingData.landmark
                ? `Landmark: ${bookingData.landmark}`
                : "—",
        };
    }, [bookingData]);

    const timeline = useMemo(() => {
        if (!bookingData) return [];

        const steps = [
            {
                title: "Booking Created",
                date: formatDateTime(bookingData.createdAt),
                by: `By ${bookingData.customerName || "Customer"}`,
            },
        ];

        if (
            ["ACCEPTED", "ASSIGNED", "IN_PROGRESS", "COMPLETED"].includes(
                bookingData.status
            )
        ) {
            steps.push({
                title: "Booking Accepted",
                date: formatDateTime(bookingData.updatedAt),
                by: "By Admin",
            });
        }

        if (
            ["ASSIGNED", "IN_PROGRESS", "COMPLETED"].includes(
                bookingData.status
            )
        ) {
            steps.push({
                title: "Technician Assigned",
                date: formatDateTime(bookingData.updatedAt),
                by: bookingData.technicianName
                    ? `Assigned to ${bookingData.technicianName}`
                    : "By Admin",
            });
        }

        if (
            ["IN_PROGRESS", "COMPLETED"].includes(
                bookingData.status
            )
        ) {
            steps.push({
                title: "Service Started",
                date: formatDateTime(bookingData.updatedAt),
                by: bookingData.technicianName || "Technician",
            });
        }

        if (bookingData.status === "COMPLETED") {
            steps.push({
                title: "Service Completed",
                date: formatDateTime(bookingData.updatedAt),
                by: bookingData.technicianName || "Technician",
            });
        }

        return steps;
    }, [bookingData]);

    if (loading) {
        return (
            <div className="bd-page">
                <section className="bd-card">
                    Loading booking details...
                </section>
            </div>
        );
    }

    if (!bookingData) {
        return (
            <div className="bd-page">
                <section className="bd-card">
                    <div className="bd-card-header">
                        <span className="bd-card-header-icon">
                            <AlertCircle size={18} strokeWidth={2} />
                        </span>
                        <h2 className="bd-card-title">
                            {error || "Booking not found."}
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="bd-btn bd-btn-outline"
                        onClick={() =>
                            navigate("/admin/bookings/accepted")
                        }
                    >
                        <ArrowLeft size={16} strokeWidth={2} />
                        Back to Accepted Bookings
                    </button>
                </section>
            </div>
        );
    }

    return (
        <div className="bd-page">
            <nav className="bd-breadcrumb" aria-label="Breadcrumb">
                Admin
                <ChevronRight size={14} className="bd-breadcrumb-sep" />
                Bookings
                <ChevronRight size={14} className="bd-breadcrumb-sep" />
                Accepted Bookings
                <ChevronRight size={14} className="bd-breadcrumb-sep" />
                <span className="bd-breadcrumb-current">
                    Booking Details
                </span>
            </nav>

            <header className="bd-header">
                <button
                    type="button"
                    className="bd-btn bd-btn-outline"
                    onClick={() =>
                        navigate("/admin/bookings/accepted")
                    }
                >
                    <ArrowLeft size={16} strokeWidth={2} />
                    Back to Accepted Bookings
                </button>

                <button
                    type="button"
                    className="bd-btn bd-btn-outline"
                    onClick={() => window.print()}
                >
                    <Printer size={16} strokeWidth={2} />
                    Print
                </button>
            </header>

            <section className="bd-summary-card">
                <div className="bd-summary-left">
                    <span className="bd-summary-icon">
                        <CheckCircle2 size={28} strokeWidth={2} />
                    </span>

                    <div className="bd-summary-text">
                        <span className="bd-summary-label">
                            Booking ID
                        </span>

                        <div className="bd-summary-id-row">
                            <span className="bd-summary-id">
                                {booking.id}
                            </span>
                            <span className="bd-badge bd-badge-success">
                                {booking.status}
                            </span>
                        </div>

                        <div className="bd-summary-meta">
                            <span className="bd-summary-meta-item">
                                <Calendar size={14} strokeWidth={2} />
                                Booked on: {booking.bookedOn}
                            </span>

                            <span className="bd-summary-meta-item">
                                <CheckCircle size={14} strokeWidth={2} />
                                Last updated: {booking.acceptedOn}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bd-summary-right">
                    <div className="bd-summary-stat">
                        <span className="bd-summary-stat-icon bd-stat-icon-danger">
                            <Flag size={16} strokeWidth={2} />
                        </span>

                        <div className="bd-summary-stat-text">
                            <span className="bd-summary-stat-label">
                                Priority
                            </span>
                            <span className="bd-badge bd-badge-danger">
                                {booking.priority}
                            </span>
                        </div>
                    </div>

                    <div className="bd-summary-stat">
                        <span className="bd-summary-stat-icon bd-stat-icon-accent">
                            <MapPin size={16} strokeWidth={2} />
                        </span>

                        <div className="bd-summary-stat-text">
                            <span className="bd-summary-stat-label">
                                Status
                            </span>
                            <span className="bd-badge bd-badge-success">
                                {booking.status}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bd-grid">
                <div className="bd-card">
                    <div className="bd-card-header">
                        <span className="bd-card-header-icon">
                            <User size={18} strokeWidth={2} />
                        </span>
                        <h2 className="bd-card-title">
                            Customer Information
                        </h2>
                    </div>

                    <div className="bd-info-list">
                        <InfoRow
                            label="Customer Name"
                            value={customer.name}
                        />
                        <InfoRow
                            label="Phone Number"
                            value={
                                <span className="bd-value-with-icon">
                                    {customer.phone}
                                    <Phone
                                        size={13}
                                        strokeWidth={2}
                                        className="bd-value-icon"
                                    />
                                </span>
                            }
                        />
                        <InfoRow
                            label="Email Address"
                            value={customer.email}
                        />
                        <InfoRow
                            label="Address"
                            value={customer.address}
                        />
                    </div>
                </div>

                <div className="bd-card">
                    <div className="bd-card-header">
                        <span className="bd-card-header-icon">
                            <Building2 size={18} strokeWidth={2} />
                        </span>
                        <h2 className="bd-card-title">
                            Property Information
                        </h2>
                    </div>

                    <div className="bd-info-list">
                        <InfoRow
                            label="Property Name"
                            value={property.name}
                        />
                        <InfoRow
                            label="Property Type"
                            value={property.type}
                        />
                        <InfoRow
                            label="Property Address"
                            value={property.address}
                        />
                    </div>
                </div>

                <div className="bd-card">
                    <div className="bd-card-header">
                        <span className="bd-card-header-icon">
                            <Bug size={18} strokeWidth={2} />
                        </span>
                        <h2 className="bd-card-title">
                            Service Information
                        </h2>
                    </div>

                    <div className="bd-info-list">
                        <InfoRow
                            label="Pest Type"
                            value={service.pestType}
                        />
                        <InfoRow
                            label="Service Type"
                            value={service.serviceType}
                        />
                        <InfoRow
                            label="Description"
                            value={service.description}
                        />
                        <InfoRow
                            label="Service Amount"
                            value={`₹ ${service.amount}`}
                        />
                        <InfoRow
                            label="Payment Status"
                            value={
                                <span className="bd-badge bd-badge-success">
                                    {service.paymentStatus}
                                </span>
                            }
                        />
                    </div>
                </div>

                <div className="bd-card">
                    <div className="bd-card-header">
                        <span className="bd-card-header-icon">
                            <Calendar size={18} strokeWidth={2} />
                        </span>
                        <h2 className="bd-card-title">
                            Schedule Information
                        </h2>
                    </div>

                    <div className="bd-info-list">
                        <InfoRow
                            label="Scheduled Date"
                            value={schedule.date}
                        />
                        <InfoRow
                            label="Scheduled Time"
                            value={schedule.time}
                        />
                        <InfoRow
                            label="Estimated Duration"
                            value={schedule.duration}
                        />
                        <InfoRow
                            label="Service Frequency"
                            value={
                                <span className="bd-frequency-badge">
                                    <RotateCcw
                                        size={13}
                                        strokeWidth={2.2}
                                    />

                                    {schedule.frequency}
                                </span>
                            }
                        />
                        <InfoRow
                            label="Preferred Time Slot"
                            value={schedule.timeSlot}
                        />
                    </div>
                </div>

                <div className="bd-card">
                    <div className="bd-card-header">
                        <span className="bd-card-header-icon">
                            <UserCheck size={18} strokeWidth={2} />
                        </span>
                        <h2 className="bd-card-title">
                            Assigned Technician
                        </h2>
                    </div>

                    <div className="bd-technician-block">
                        <span className="bd-technician-avatar">
                            <User size={32} strokeWidth={1.5} />
                        </span>

                        <div className="bd-technician-text">
                            <span className="bd-technician-name">
                                {technician.name}
                            </span>
                            <span className="bd-badge bd-badge-success bd-technician-id">
                                {technician.id}
                            </span>
                            <span className="bd-technician-phone">
                                <Phone size={13} strokeWidth={2} />
                                {technician.phone}
                            </span>
                        </div>
                    </div>

                    <div className="bd-info-list bd-info-list-divided">
                        <InfoRow
                            label="Experience"
                            value={technician.experience}
                        />
                        <InfoRow
                            label="Specialization"
                            value={technician.specialization}
                        />
                    </div>
                </div>

                <div className="bd-card">
                    <div className="bd-card-header">
                        <span className="bd-card-header-icon">
                            <StickyNote size={18} strokeWidth={2} />
                        </span>
                        <h2 className="bd-card-title">Notes</h2>
                    </div>

                    <div className="bd-info-list bd-notes-list">
                        <InfoRow
                            label="Service Notes"
                            value={notes.service}
                        />
                        <InfoRow
                            label="Customer Notes"
                            value={notes.customer}
                        />
                    </div>
                </div>
            </section>

            <section className="bd-card bd-timeline-card">
                <div className="bd-card-header">
                    <span className="bd-card-header-icon">
                        <Clock size={18} strokeWidth={2} />
                    </span>
                    <h2 className="bd-card-title">
                        Booking Timeline
                    </h2>
                </div>

                <div className="bd-timeline">
                    {timeline.map((step, index) => (
                        <React.Fragment key={step.title}>
                            <div className="bd-timeline-step">
                                <span className="bd-timeline-dot">
                                    <CheckCircle
                                        size={16}
                                        strokeWidth={2}
                                    />
                                </span>
                                <span className="bd-timeline-title">
                                    {step.title}
                                </span>
                                <span className="bd-timeline-date">
                                    {step.date}
                                </span>
                                <span className="bd-timeline-by">
                                    {step.by}
                                </span>
                            </div>

                            {index < timeline.length - 1 && (
                                <span className="bd-timeline-connector" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </section>
        </div>
    );
}