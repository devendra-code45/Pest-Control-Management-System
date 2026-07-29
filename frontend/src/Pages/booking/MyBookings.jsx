import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  ChevronRight,
  Plus,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  XCircle,
  Search,
  ChevronDown,
  Filter,
  Bug,
  PawPrint,
  User,
  Phone,
  Ban,
  RotateCcw,
  MapPin,
  Headphones,
  ChevronLeft,
  AlertCircle,
  LoaderCircle,
  Eye,
} from "lucide-react";

import api from "../../api/axios";
import "./MyBookings.css";

const serviceIcons = {
  "Termite Control": Bug,
  "General Pest Control": Bug,
  "Cockroach Control": Bug,
  "Mosquito Control": Bug,
  "Rodent Control": PawPrint,
  "Bed Bug Treatment": Bug,
};

const statusBadgeClass = {
  Pending: "mb-badge-warning",
  Upcoming: "mb-badge-warning",
  Accepted: "mb-badge-info",
  Assigned: "mb-badge-info",
  "In Progress": "mb-badge-info",
  Completed: "mb-badge-success",
  Cancelled: "mb-badge-danger",
  Rejected: "mb-badge-danger",
};

const paymentBadgeClass = {
  Paid: "mb-badge-success",
  Pending: "mb-badge-warning",
  Refunded: "mb-badge-neutral",
};

const PAGE_SIZE = 5;

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not available";
  }

  const date = new Date(`${dateValue}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateValue) {
  if (!dateValue) {
    return "Not available";
  }

  const date = new Date(dateValue);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMoney(amount) {
  const numericAmount = Number(amount || 0);

  return numericAmount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function getDisplayStatus(status) {
  const statusMap = {
    PENDING: "Pending",
    ACCEPTED: "Accepted",
    ASSIGNED: "Assigned",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    REJECTED: "Rejected",
  };

  return statusMap[status] || status || "Pending";
}

function getStatusNote(status) {
  const statusNotes = {
    PENDING: "Waiting for admin approval",
    ACCEPTED: "Booking accepted",
    ASSIGNED: "Technician assigned",
    IN_PROGRESS: "Service currently active",
    COMPLETED: "Service completed",
    CANCELLED: "Booking cancelled",
    REJECTED: "Booking rejected",
  };

  return statusNotes[status] || "Status unavailable";
}

function getPaymentStatus() {
  // The Payment module is not connected yet.
  return "Pending";
}

function transformBooking(booking) {
  return {
    rawId: booking.id,
    id: `BK-${String(booking.id).padStart(4, "0")}`,
    bookedOn: formatDateTime(booking.createdAt),
    service: booking.serviceName || "Service",
    serviceArea:
      booking.serviceType ||
      booking.propertyType ||
      "Not available",
    address: [
      booking.serviceAddress,
      booking.city,
      booking.pincode,
    ]
      .filter(Boolean)
      .join(", "),
    date: formatDate(booking.preferredDate),
    time: booking.preferredTimeSlot || "Not selected",
    backendStatus: booking.status,
    status: getDisplayStatus(booking.status),
    statusNote: getStatusNote(booking.status),
    technician: booking.technicianName || null,
    technicianPhone: booking.technicianPhone || null,
    amount: formatMoney(booking.totalAmount),
    paymentStatus: getPaymentStatus(booking),
    rejectionReason: booking.rejectionReason || null,
  };
}

export default function MyBookings() {
  const navigate = useNavigate();
  const location = useLocation();

  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All Status");
  const [serviceFilter, setServiceFilter] =
    useState("All Services");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [requestError, setRequestError] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState(
      location.state?.bookingCreated
        ? "Your service was booked successfully."
        : ""
    );

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setRequestError("");

        const response = await api.get(
          "/customer/bookings"
        );

        const transformedBookings = Array.isArray(
          response.data
        )
          ? response.data.map(transformBooking)
          : [];

        setBookings(transformedBookings);
      } catch (error) {
        const status = error.response?.status;

        if (status === 401 || status === 403) {
          localStorage.removeItem("pcmsAuth");
          navigate("/login", { replace: true });
          return;
        }

        setRequestError(
          error.response?.data?.message ||
            "Unable to load your bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setSuccessMessage("");
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [successMessage]);

  const serviceOptions = useMemo(() => {
    return [
      ...new Set(
        bookings
          .map((booking) => booking.service)
          .filter(Boolean)
      ),
    ];
  }, [bookings]);

  const stats = useMemo(() => {
    const countByStatuses = (...statuses) =>
      bookings.filter((booking) =>
        statuses.includes(booking.backendStatus)
      ).length;

    return [
      {
        label: "Total Bookings",
        sub: "All Time",
        value: bookings.length,
        icon: Calendar,
        tone: "neutral",
      },
      {
        label: "Upcoming",
        sub: "Scheduled Services",
        value: countByStatuses(
          "PENDING",
          "ACCEPTED",
          "ASSIGNED"
        ),
        icon: Clock,
        tone: "warning",
      },
      {
        label: "In Progress",
        sub: "Currently Active",
        value: countByStatuses("IN_PROGRESS"),
        icon: UserCheck,
        tone: "info",
      },
      {
        label: "Completed",
        sub: "Successfully Completed",
        value: countByStatuses("COMPLETED"),
        icon: CheckCircle2,
        tone: "success",
      },
      {
        label: "Cancelled",
        sub: "Cancelled or Rejected",
        value: countByStatuses(
          "CANCELLED",
          "REJECTED"
        ),
        icon: XCircle,
        tone: "danger",
      },
    ];
  }, [bookings]);

  const filtered = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch =
        !normalizedSearch ||
        booking.id
          .toLowerCase()
          .includes(normalizedSearch) ||
        booking.service
          .toLowerCase()
          .includes(normalizedSearch) ||
        booking.serviceArea
          .toLowerCase()
          .includes(normalizedSearch) ||
        booking.address
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All Status" ||
        booking.status === statusFilter;

      const matchesService =
        serviceFilter === "All Services" ||
        booking.service === serviceFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesService
      );
    });
  }, [
    bookings,
    search,
    statusFilter,
    serviceFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const safePage = Math.min(page, totalPages);

  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("All Status");
    setServiceFilter("All Services");
    setPage(1);
  };

  const openBookingDetails = (
    bookingId,
    action = "view"
  ) => {
    sessionStorage.setItem(
      "pcmsCustomerBookingId",
      String(bookingId)
    );

    navigate("/customer/bookings/details", {
      state: {
        bookingId,
        action,
      },
    });
  };

  const handleViewBooking = (bookingId) => {
    openBookingDetails(bookingId, "view");
  };

  const handleReschedule = (bookingId) => {
    openBookingDetails(bookingId, "reschedule");
  };

  const handleCancel = (bookingId) => {
    openBookingDetails(bookingId, "cancel");
  };

  const handleTrack = (bookingId) => {
    openBookingDetails(bookingId, "track");
  };

  const handleRebook = (bookingId) => {
    navigate(
      `/customer/create-booking?rebook=${bookingId}`
    );
  };

  const handleCallTechnician = (booking) => {
    if (!booking.technicianPhone) {
      setRequestError(
        "Technician phone number is not available."
      );
      return;
    }

    window.location.href = `tel:${booking.technicianPhone}`;
  };

  const handleContactSupport = () => {
    navigate("/customer/contact-support");
  };

  const renderActions = (booking) => {
    switch (booking.backendStatus) {
      case "PENDING":
      case "ACCEPTED":
        return (
          <div className="mb-actions-cell">
            <button
              type="button"
              className="mb-btn mb-btn-outline mb-btn-sm"
              onClick={() =>
                handleViewBooking(booking.rawId)
              }
            >
              <Eye size={13} strokeWidth={2} />
              View
            </button>

            <button
              type="button"
              className="mb-icon-btn mb-icon-btn-danger"
              onClick={() =>
                handleCancel(booking.rawId)
              }
              aria-label="Cancel booking"
            >
              <Ban size={15} strokeWidth={2} />
            </button>
          </div>
        );

      case "ASSIGNED":
        return (
          <div className="mb-actions-cell">
            <button
              type="button"
              className="mb-btn mb-btn-outline mb-btn-sm"
              onClick={() =>
                handleViewBooking(booking.rawId)
              }
            >
              <Eye size={13} strokeWidth={2} />
              View
            </button>

            <button
              type="button"
              className="mb-icon-btn"
              onClick={() =>
                handleCallTechnician(booking)
              }
              aria-label="Call technician"
            >
              <Phone size={15} strokeWidth={2} />
            </button>
          </div>
        );

      case "IN_PROGRESS":
        return (
          <button
            type="button"
            className="mb-btn mb-btn-outline mb-btn-sm"
            onClick={() =>
              handleTrack(booking.rawId)
            }
          >
            <MapPin size={13} strokeWidth={2} />
            Track Technician
          </button>
        );

      case "COMPLETED":
      case "CANCELLED":
      case "REJECTED":
        return (
          <div className="mb-actions-cell">
            <button
              type="button"
              className="mb-btn mb-btn-outline mb-btn-sm"
              onClick={() =>
                handleViewBooking(booking.rawId)
              }
            >
              <Eye size={13} strokeWidth={2} />
              View
            </button>

            <button
              type="button"
              className="mb-icon-btn"
              onClick={() =>
                handleRebook(booking.rawId)
              }
              aria-label="Rebook service"
            >
              <RotateCcw
                size={15}
                strokeWidth={2}
              />
            </button>
          </div>
        );

      default:
        return (
          <button
            type="button"
            className="mb-btn mb-btn-outline mb-btn-sm"
            onClick={() =>
              handleViewBooking(booking.rawId)
            }
          >
            <Eye size={13} strokeWidth={2} />
            View
          </button>
        );
    }
  };

  return (
    <div className="mb-page">
      <nav
        className="mb-breadcrumb"
        aria-label="Breadcrumb"
      >
        <button
          type="button"
          className="mb-breadcrumb-link"
          onClick={() =>
            navigate("/customer/dashboard")
          }
        >
          Dashboard
        </button>

        <ChevronRight
          size={14}
          className="mb-breadcrumb-sep"
        />

        <span className="mb-breadcrumb-current">
          My Bookings
        </span>
      </nav>

      <header className="mb-header">
        <div className="mb-header-left">
          <span className="mb-header-icon">
            <Calendar size={26} strokeWidth={2} />
          </span>

          <div>
            <h1 className="mb-title">
              My Bookings
            </h1>

            <p className="mb-subtitle">
              View and track all your pest control
              service bookings.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="mb-btn mb-btn-primary"
          onClick={() =>
            navigate("/customer/create-booking")
          }
        >
          <Plus size={16} strokeWidth={2} />
          Book New Service
        </button>
      </header>

      {successMessage && (
        <div className="mb-success-message">
          <CheckCircle2 size={17} />
          {successMessage}
        </div>
      )}

      {requestError && (
        <div className="mb-error-message">
          <AlertCircle size={17} />
          {requestError}
        </div>
      )}

      <section className="mb-stats-grid">
        {stats.map(
          ({
            label,
            sub,
            value,
            icon: Icon,
            tone,
          }) => (
            <div
              className="mb-stat-card"
              key={label}
            >
              <span
                className={`mb-stat-icon mb-stat-icon-${tone}`}
              >
                <Icon size={22} strokeWidth={2} />
              </span>

              <div className="mb-stat-text">
                <span className="mb-stat-label">
                  {label}
                </span>

                <span className="mb-stat-value">
                  {value}
                </span>

                <span className="mb-stat-sub">
                  {sub}
                </span>
              </div>
            </div>
          )
        )}
      </section>

      <section className="mb-filters-card">
        <div className="mb-search-wrap">
          <Search
            size={16}
            className="mb-search-icon"
          />

          <input
            type="text"
            className="mb-search-input"
            placeholder="Search by booking ID, service or address..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="mb-select">
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Accepted</option>
            <option>Assigned</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Cancelled</option>
            <option>Rejected</option>
          </select>

          <ChevronDown
            size={16}
            className="mb-select-caret"
          />
        </div>

        <div className="mb-select">
          <select
            value={serviceFilter}
            onChange={(event) => {
              setServiceFilter(event.target.value);
              setPage(1);
            }}
          >
            <option>All Services</option>

            {serviceOptions.map((service) => (
              <option
                key={service}
                value={service}
              >
                {service}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="mb-select-caret"
          />
        </div>

        <button
          type="button"
          className="mb-btn mb-btn-outline mb-clear-btn"
          onClick={handleClearFilters}
        >
          <Filter size={16} strokeWidth={2} />
          Clear Filters
        </button>
      </section>

      <section className="mb-table-card">
        <div className="mb-table-scroll">
          <table className="mb-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Service</th>
                <th>Date &amp; Time</th>
                <th>Status</th>
                <th>Assigned Technician</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="mb-empty-state"
                  >
                    <LoaderCircle
                      size={21}
                      className="mb-loading-icon"
                    />
                    Loading bookings...
                  </td>
                </tr>
              ) : pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="mb-empty-state"
                  >
                    No bookings match your filters.
                  </td>
                </tr>
              ) : (
                pageItems.map((booking) => {
                  const ServiceIcon =
                    serviceIcons[booking.service] ||
                    Bug;

                  return (
                    <tr key={booking.rawId}>
                      <td>
                        <div className="mb-id-cell">
                          <span className="mb-id-icon">
                            <Calendar
                              size={16}
                              strokeWidth={2}
                            />
                          </span>

                          <div className="mb-cell-text">
                            <span className="mb-booking-id">
                              {booking.id}
                            </span>

                            <span className="mb-cell-secondary">
                              {booking.bookedOn}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="mb-cell-with-icon">
                          <span className="mb-service-icon">
                            <ServiceIcon
                              size={18}
                              strokeWidth={1.75}
                            />
                          </span>

                          <div className="mb-cell-text">
                            <span className="mb-cell-primary">
                              {booking.service}
                            </span>

                            <span className="mb-cell-secondary">
                              {booking.serviceArea}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="mb-cell-with-icon">
                          <Calendar
                            size={14}
                            strokeWidth={2}
                            className="mb-inline-icon"
                          />

                          <div className="mb-cell-text">
                            <span className="mb-cell-primary">
                              {booking.date}
                            </span>

                            <span className="mb-cell-secondary">
                              <Clock
                                size={12}
                                strokeWidth={2}
                                className="mb-inline-icon"
                              />
                              {booking.time}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="mb-status-cell">
                          <span
                            className={`mb-badge ${
                              statusBadgeClass[
                                booking.status
                              ] || "mb-badge-neutral"
                            }`}
                          >
                            {booking.status}
                          </span>

                          <span className="mb-status-note">
                            {booking.statusNote}
                          </span>

                          {booking.rejectionReason && (
                            <span className="mb-status-note">
                              {
                                booking.rejectionReason
                              }
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        {booking.technician ? (
                          <div className="mb-technician-cell">
                            <span className="mb-tech-avatar">
                              <User
                                size={16}
                                strokeWidth={2}
                              />
                            </span>

                            <div className="mb-cell-text">
                              <span className="mb-cell-primary">
                                {
                                  booking.technician
                                }
                              </span>

                              <span className="mb-cell-secondary">
                                Technician
                              </span>
                            </div>

                            {booking.technicianPhone && (
                              <button
                                type="button"
                                className="mb-call-btn"
                                onClick={() =>
                                  handleCallTechnician(
                                    booking
                                  )
                                }
                                aria-label={`Call ${booking.technician}`}
                              >
                                <Phone
                                  size={13}
                                  strokeWidth={2}
                                />
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="mb-technician-cell mb-technician-empty">
                            <span className="mb-tech-avatar mb-tech-avatar-empty">
                              —
                            </span>

                            <span className="mb-cell-secondary">
                              Not Assigned
                            </span>
                          </div>
                        )}
                      </td>

                      <td>
                        <div className="mb-amount-cell">
                          <span className="mb-amount">
                            ₹{booking.amount}
                          </span>

                          <span
                            className={`mb-badge ${
                              paymentBadgeClass[
                                booking.paymentStatus
                              ] ||
                              "mb-badge-neutral"
                            }`}
                          >
                            {
                              booking.paymentStatus
                            }
                          </span>
                        </div>
                      </td>

                      <td>
                        {renderActions(booking)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mb-table-footer">
          <span className="mb-showing-text">
            Showing{" "}
            {pageItems.length === 0
              ? 0
              : (safePage - 1) * PAGE_SIZE + 1}{" "}
            to{" "}
            {(safePage - 1) * PAGE_SIZE +
              pageItems.length}{" "}
            of {filtered.length} bookings
          </span>

          <div className="mb-pagination">
            <button
              type="button"
              className="mb-page-btn mb-page-nav"
              disabled={safePage === 1}
              onClick={() =>
                setPage((currentPage) =>
                  Math.max(1, currentPage - 1)
                )
              }
            >
              <ChevronLeft
                size={14}
                strokeWidth={2}
              />
            </button>

            {Array.from({
              length: totalPages,
            }).map((_, index) => (
              <button
                key={index + 1}
                type="button"
                className={`mb-page-btn ${
                  safePage === index + 1
                    ? "mb-page-btn-active"
                    : ""
                }`}
                onClick={() =>
                  setPage(index + 1)
                }
              >
                {index + 1}
              </button>
            ))}

            <button
              type="button"
              className="mb-page-btn mb-page-nav"
              disabled={safePage === totalPages}
              onClick={() =>
                setPage((currentPage) =>
                  Math.min(
                    totalPages,
                    currentPage + 1
                  )
                )
              }
            >
              <ChevronRight
                size={14}
                strokeWidth={2}
              />
            </button>
          </div>
        </div>
      </section>

      <section className="mb-help-band">
        <div className="mb-help-left">
          <span className="mb-help-icon">
            <Headphones
              size={20}
              strokeWidth={2}
            />
          </span>

          <div>
            <h3 className="mb-help-title">
              Need help with your booking?
            </h3>

            <p className="mb-help-desc">
              Our support team is here to help you
              with any booking-related queries.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="mb-btn mb-btn-outline mb-support-btn"
          onClick={handleContactSupport}
        >
          <Headphones
            size={16}
            strokeWidth={2}
          />
          Contact Support
        </button>
      </section>
    </div>
  );
}