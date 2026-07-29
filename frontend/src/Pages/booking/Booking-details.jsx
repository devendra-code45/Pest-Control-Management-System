import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Copy,
  ArrowLeft,
  Plus,
  Shield,
  Bug,
  Flag,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  ClipboardList,
  FileText,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import api from "../../api/axios";
import "./Booking-details.css";

const STATUS_LABELS = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

const STATUS_CLASSES = {
  PENDING: "status-pending",
  ACCEPTED: "status-accepted",
  ASSIGNED: "status-assigned",
  IN_PROGRESS: "status-in-progress",
  COMPLETED: "status-completed",
  REJECTED: "status-rejected",
  CANCELLED: "status-cancelled",
};

const formatDate = (value) => {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
};

const formatDateTime = (value) => {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const initials = (name) =>
  String(name || "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "NA";

const getPriority = (preferredDate) => {
  if (!preferredDate) return "Low";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const serviceDate = new Date(`${preferredDate}T00:00:00`);
  const days = Math.ceil(
    (serviceDate.getTime() - today.getTime()) / 86400000
  );

  if (days <= 1) return "High";
  if (days <= 3) return "Medium";
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

const createTimeline = (booking) => {
  if (!booking) return [];

  const createdDate = formatDateTime(booking.createdAt);
  const updatedDate = formatDateTime(
    booking.updatedAt || booking.createdAt
  );

  const items = [
    {
      date: createdDate,
      title: "Booking Created",
      description: "Your booking was submitted successfully.",
      state: "done",
    },
  ];

  if (booking.status === "REJECTED") {
    items.push({
      date: updatedDate,
      title: "Booking Rejected",
      description:
        booking.rejectionReason || "The booking was rejected by the admin.",
      state: "done",
    });

    return items;
  }

  if (booking.status === "CANCELLED") {
    items.push({
      date: updatedDate,
      title: "Booking Cancelled",
      description: "This booking has been cancelled.",
      state: "done",
    });

    return items;
  }

  const acceptedDone = [
    "ACCEPTED",
    "ASSIGNED",
    "IN_PROGRESS",
    "COMPLETED",
  ].includes(booking.status);

  const assignedDone = [
    "ASSIGNED",
    "IN_PROGRESS",
    "COMPLETED",
  ].includes(booking.status);

  const inProgressDone = [
    "IN_PROGRESS",
    "COMPLETED",
  ].includes(booking.status);

  const completedDone = booking.status === "COMPLETED";

  items.push({
    date: acceptedDone ? updatedDate : "Pending",
    title: "Booking Accepted",
    description: acceptedDone
      ? "The admin accepted your booking."
      : "Waiting for admin approval.",
    state: acceptedDone ? "done" : "upcoming",
  });

  items.push({
    date: assignedDone ? updatedDate : "Pending",
    title: "Technician Assigned",
    description: assignedDone
      ? `${booking.technicianName || "A technician"} was assigned.`
      : "A technician will be assigned after acceptance.",
    state: assignedDone
      ? "done"
      : acceptedDone
        ? "upcoming"
        : "pending",
  });

  items.push({
    date: inProgressDone ? updatedDate : "Pending",
    title: "Service In Progress",
    description: inProgressDone
      ? "The pest control service has started."
      : "The service has not started yet.",
    state: inProgressDone
      ? "done"
      : assignedDone
        ? "upcoming"
        : "pending",
  });

  items.push({
    date: completedDone ? updatedDate : "Pending",
    title: "Service Completed",
    description: completedDone
      ? "The pest control service was completed."
      : "Completion is pending.",
    state: completedDone ? "done" : "pending",
  });

  return items;
};

export default function BookingDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const bookingId =
    location.state?.bookingId ||
    Number(sessionStorage.getItem("pcmsCustomerBookingId"));

  const requestedAction =
    location.state?.action || "view";

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestError, setRequestError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setRequestError("No booking was selected.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setRequestError("");

        sessionStorage.setItem(
          "pcmsCustomerBookingId",
          String(bookingId)
        );

        const response = await api.get(
          `/customer/bookings/${bookingId}`
        );

        setBooking(response.data);
      } catch (error) {
        const status = error.response?.status;

        if (status === 401 || status === 403) {
          localStorage.removeItem("pcmsAuth");
          navigate("/login", { replace: true });
          return;
        }

        setRequestError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, navigate]);

  const timeline = useMemo(
    () => createTimeline(booking),
    [booking]
  );

  const statusLabel =
    STATUS_LABELS[booking?.status] ||
    booking?.status ||
    "Not available";

  const statusClass =
    STATUS_CLASSES[booking?.status] ||
    "status-pending";

  const priority = getPriority(
    booking?.preferredDate
  );

  const propertyName =
    [booking?.propertyType, booking?.propertySize]
      .filter(Boolean)
      .join(" - ") || "Property";

  const propertyAddress =
    [
      booking?.serviceAddress,
      booking?.landmark,
      booking?.city,
      booking?.pincode,
    ]
      .filter(Boolean)
      .join(", ") || "Not available";

  const customerInitials = initials(
    booking?.customerName
  );

  const technicianInitials = initials(
    booking?.technicianName
  );

  const handleCopyBookingId = async () => {
    const value = `BK-${booking?.id}`;

    try {
      await navigator.clipboard.writeText(value);
      setCopyMessage("Copied");

      window.setTimeout(() => {
        setCopyMessage("");
      }, 1500);
    } catch {
      setCopyMessage("Copy failed");
    }
  };

  if (loading) {
    return (
      <div className="bd-page">
        <div className="form-card bd-state-card">
          <LoaderCircle
            size={24}
            className="bd-spin"
          />
          Loading booking details...
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bd-page">
        <div className="form-card bd-state-card bd-error-card">
          <AlertCircle size={24} />
          <span>
            {requestError || "Booking not found."}
          </span>

          <button
            type="button"
            className="btn btn-outline"
            onClick={() =>
              navigate("/customer/bookings")
            }
          >
            <ArrowLeft size={16} />
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bd-page">
      <div className="bd-breadcrumb">
        <button
          type="button"
          className="crumb-button crumb-active"
          onClick={() =>
            navigate("/customer/dashboard")
          }
        >
          Dashboard
        </button>

        <ChevronRight
          size={14}
          className="crumb-sep"
        />

        <button
          type="button"
          className="crumb-button"
          onClick={() =>
            navigate("/customer/bookings")
          }
        >
          Bookings
        </button>

        <ChevronRight
          size={14}
          className="crumb-sep"
        />

        <span>Booking Details</span>
      </div>

      <div className="bd-header">
        <div>
          <h1 className="page-title">
            Booking Details
          </h1>

          <p className="page-subtitle">
            View complete booking information and status.
          </p>
        </div>

        <div className="bd-header-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() =>
              navigate("/customer/bookings")
            }
          >
            <ArrowLeft size={16} />
            Back to My Bookings
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              navigate("/customer/create-booking")
            }
          >
            <Plus size={17} />
            New Booking
          </button>
        </div>
      </div>

      {requestedAction !== "view" && (
        <div className="bd-action-message">
          <AlertCircle size={17} />
          {requestedAction === "track" &&
            "Live technician tracking is not connected yet. Current technician details are shown below."}
          {requestedAction === "cancel" &&
            "Online cancellation is not connected yet. Contact support for cancellation."}
          {requestedAction === "reschedule" &&
            "Online rescheduling is not connected yet. Contact support to change the schedule."}
        </div>
      )}

      {copyMessage && (
        <div className="bd-copy-message">
          {copyMessage}
        </div>
      )}

      <div className="bd-layout">
        <div className="bd-main-col">
          <div className="form-card overview-card">
            <div className="overview-left">
              <span className="overview-label">
                Booking ID
              </span>

              <div className="booking-id-row">
                <span className="booking-id">
                  BK-{booking.id}
                </span>

                <button
                  type="button"
                  className="icon-btn"
                  title="Copy Booking ID"
                  onClick={handleCopyBookingId}
                >
                  <Copy size={15} />
                </button>
              </div>

              <span
                className={`status-badge ${statusClass}`}
              >
                {statusLabel}
              </span>
            </div>

            <div className="overview-grid">
              <div className="overview-item">
                <span className="overview-item-label">
                  <Shield size={14} /> Service Type
                </span>
                <span className="overview-item-value">
                  {[booking.serviceName, booking.serviceType]
                    .filter(Boolean)
                    .join(" - ") || "Not available"}
                </span>
              </div>

              <div className="overview-item">
                <span className="overview-item-label">
                  <Bug size={14} /> Pest Type
                </span>
                <span className="overview-item-value">
                  {booking.pestType || "Not available"}
                </span>
              </div>

              <div className="overview-item">
                <span className="overview-item-label">
                  <Flag size={14} /> Priority
                </span>
                <span
                  className={`priority-badge priority-${priority.toLowerCase()}`}
                >
                  {priority}
                </span>
              </div>

              <div className="overview-item">
                <span className="overview-item-label">
                  <Calendar size={14} /> Schedule Date
                </span>
                <span className="overview-item-value">
                  {formatDate(booking.preferredDate)}
                </span>
              </div>

              <div className="overview-item">
                <span className="overview-item-label">
                  <Clock size={14} /> Schedule Time
                </span>
                <span className="overview-item-value">
                  {booking.preferredTimeSlot ||
                    "Not available"}
                </span>
              </div>

              <div className="overview-item">
                <span className="overview-item-label">
                  <Clock size={14} /> Booked On
                </span>
                <span className="overview-item-value">
                  {formatDateTime(booking.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="form-card">
            <div className="form-card-title">
              <span className="title-icon">
                <Building2 size={18} />
              </span>
              Property &amp; Technician
            </div>

            <div className="property-grid">
              <div className="property-col">
                <span className="mini-label">
                  Property Name
                </span>
                <span className="mini-value">
                  {propertyName}
                </span>

                <span className="mini-label spaced">
                  Property Address
                </span>
                <span className="mini-value">
                  {propertyAddress}
                </span>

                <span className="mini-label spaced">
                  Property Type
                </span>
                <span className="mini-value">
                  {booking.propertyType ||
                    "Not available"}
                </span>
              </div>

              <div className="property-col">
                <span className="mini-label">
                  Assigned Technician
                </span>

                {booking.technicianName ? (
                  <div className="tech-row">
                    <span className="avatar-lg">
                      {technicianInitials}
                    </span>

                    <div>
                      <div className="tech-name">
                        {booking.technicianName}
                      </div>

                      <div className="tech-phone">
                        <Phone size={13} />
                        {booking.technicianPhone ||
                          "Phone unavailable"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="mini-value">
                    Not assigned yet
                  </span>
                )}
              </div>

              <div className="property-col">
                <span className="mini-label">
                  Service Location
                </span>

                <span className="mini-value inline">
                  <MapPin size={14} /> On-site
                </span>

                <span className="mini-label spaced">
                  Service Area
                </span>

                <span className="mini-value">
                  {[
                    booking.serviceAddress,
                    booking.city,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Not available"}
                </span>
              </div>
            </div>
          </div>

          <div className="bd-two-col">
            <div className="form-card">
              <div className="form-card-title">
                <span className="title-icon">
                  <ClipboardList size={18} />
                </span>
                Service Details
              </div>

              <div className="detail-rows">
                <div className="detail-row">
                  <span className="mini-label">
                    Service Description
                  </span>
                  <span className="mini-value">
                    {booking.problemDescription ||
                      "Not provided"}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="mini-label">
                    Service Price
                  </span>
                  <span className="mini-value">
                    ₹{formatMoney(booking.servicePrice)}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="mini-label">
                    Inspection Charge
                  </span>
                  <span className="mini-value">
                    ₹{formatMoney(
                      booking.inspectionCharge
                    )}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="mini-label">
                    Total Amount
                  </span>
                  <span className="mini-value">
                    ₹{formatMoney(booking.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="form-card">
              <div className="form-card-title">
                <span className="title-icon">
                  <FileText size={18} />
                </span>
                Notes
              </div>

              <div className="detail-rows">
                <div className="detail-row">
                  <span className="mini-label">
                    Customer Notes
                  </span>
                  <span className="mini-value">
                    {booking.problemDescription ||
                      "Not provided"}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="mini-label">
                    Landmark
                  </span>
                  <span className="mini-value">
                    {booking.landmark ||
                      "Not provided"}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="mini-label">
                    Rejection Reason
                  </span>
                  <span className="mini-value">
                    {booking.rejectionReason ||
                      "Not applicable"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="bd-side-col">
          <div className="form-card">
            <div className="form-card-title">
              <span className="title-icon">
                <User size={18} />
              </span>
              Customer Information
            </div>

            <div className="customer-block">
              <span className="avatar-lg">
                {customerInitials}
              </span>

              <div className="customer-name">
                {booking.customerName ||
                  "Customer"}
              </div>
            </div>

            <div className="contact-list">
              <div className="contact-row">
                <Phone size={15} />
                {booking.customerPhone ||
                  "Phone unavailable"}
              </div>

              <div className="contact-row">
                <Mail size={15} />
                {booking.customerEmail ||
                  "Email unavailable"}
              </div>

              <div className="contact-row">
                <MapPin size={15} />
                {propertyAddress}
              </div>
            </div>
          </div>

          <div className="form-card">
            <div className="form-card-title">
              <span className="title-icon">
                <Clock size={18} />
              </span>
              Booking Timeline
            </div>

            <div className="timeline">
              {timeline.map((item, index) => (
                <div
                  className={`timeline-item timeline-${item.state}`}
                  key={`${item.title}-${index}`}
                >
                  <div className="timeline-marker">
                    {item.state === "done" ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <span className="timeline-dot" />
                    )}
                  </div>

                  <div className="timeline-content">
                    <div className="timeline-date">
                      {item.date}
                    </div>

                    <div className="timeline-title-row">
                      <span className="timeline-title">
                        {item.title}
                      </span>

                      {item.state === "upcoming" && (
                        <span className="upcoming-badge">
                          Upcoming
                        </span>
                      )}
                    </div>

                    <p className="timeline-desc">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div
        className={`note-card ${
          booking.status === "REJECTED"
            ? "note-card-danger"
            : ""
        }`}
      >
        <span className="note-icon">
          <ShieldCheck size={18} />
        </span>

        <div>
          <div className="note-title">
            {booking.status === "REJECTED"
              ? "Booking Rejected"
              : "Important"}
          </div>

          <p>
            {booking.status === "REJECTED"
              ? booking.rejectionReason ||
                "This booking was rejected."
              : "Please ensure all safety guidelines are followed during the service."}
          </p>
        </div>
      </div>
    </div>
  );
}