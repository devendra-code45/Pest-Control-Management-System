import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  XCircle,
  ArrowLeft,
  Printer,
  Calendar,
  User,
  Phone,
  Mail,
  Building2,
  MapPin,
  Bug,
  Wrench,
  Grid3x3,
  PhoneCall,
  FileText,
  StickyNote,
  Camera,
  MessageSquare,
  CalendarClock,
  ShieldCheck,
  Clock,
  IndianRupee,
  Home,
  History,
  CheckCircle,
  X,
  AlertCircle,
} from "lucide-react";
import api from "../../../api/axios";
import "./RBView.css";

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

const splitReason = (value) => {
  if (!value) {
    return {
      reason: "No reason provided",
      remarks: "No additional remarks provided.",
    };
  }

  const separatorIndex = value.indexOf(":");

  if (separatorIndex === -1) {
    return {
      reason: value,
      remarks: value,
    };
  }

  return {
    reason: value.slice(0, separatorIndex).trim(),
    remarks:
      value.slice(separatorIndex + 1).trim() ||
      value.slice(0, separatorIndex).trim(),
  };
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

  return "Unable to load rejected booking details.";
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="rbd-info-row">
    <span className="rbd-info-icon">
      <Icon size={16} strokeWidth={2} />
    </span>
    <span className="rbd-info-label">{label}</span>
    <span className="rbd-info-colon">:</span>
    <span className="rbd-info-value">{value || "—"}</span>
  </div>
);

export default function RejectedBookingDetails({ onBack, onPrint }) {
  const navigate = useNavigate();
  const location = useLocation();

  const bookingId =
    location.state?.bookingId ||
    Number(sessionStorage.getItem("pcmsRejectedViewId"));

  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) {
        setError("No booking was selected.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        sessionStorage.setItem(
          "pcmsRejectedViewId",
          String(bookingId)
        );

        const response = await api.get(
          `/admin/bookings/${bookingId}`
        );

        setBookingData(response.data);
      } catch (requestError) {
        setBookingData(null);
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId]);

  const rejection = useMemo(
    () => splitReason(bookingData?.rejectionReason),
    [bookingData]
  );

  const booking = useMemo(() => {
    if (!bookingData) return null;

    return {
      id: `BK-${bookingData.id}`,
      status: "Rejected",
      priority: getPriority(bookingData.preferredDate),
      rejectedByRole: "Admin",
      rejectedByName: "PCMS Administrator",
      rejectedAt: formatDateTime(
        bookingData.updatedAt || bookingData.createdAt
      ),
    };
  }, [bookingData]);

  const bookingInfo = useMemo(() => {
    if (!bookingData) return null;

    return {
      customerName: bookingData.customerName || "—",
      phoneNumber: bookingData.customerPhone || "—",
      emailAddress: bookingData.customerEmail || "—",
      propertyName:
        [bookingData.propertyType, bookingData.propertySize]
          .filter(Boolean)
          .join(" - ") || "Property",
      propertyAddress:
        [
          bookingData.serviceAddress,
          bookingData.landmark,
          bookingData.city,
          bookingData.pincode,
        ]
          .filter(Boolean)
          .join(", ") || "—",
      pestType: bookingData.pestType || "—",
      serviceType:
        [bookingData.serviceName, bookingData.serviceType]
          .filter(Boolean)
          .join(" - ") || "—",
      serviceCategory: bookingData.propertyType || "—",
      preferredDateTime:
        `${formatDate(bookingData.preferredDate)} • ${
          bookingData.preferredTimeSlot || "—"
        }`,
      preferredContactMethod: "Not recorded",
    };
  }, [bookingData]);

  const requestDetails = useMemo(() => {
    if (!bookingData) return null;

    return {
      problemDescription:
        bookingData.problemDescription || "—",
      specialNotes: bookingData.landmark
        ? `Landmark: ${bookingData.landmark}`
        : "—",
      imageCount: 0,
    };
  }, [bookingData]);

  const rejectionInfo = useMemo(
    () => ({
      reason: rejection.reason,
      remarks: rejection.remarks,
      alternativeSuggestion:
        "Customer can submit another booking with updated details.",
    }),
    [rejection]
  );

  const serviceSummary = useMemo(() => {
    if (!bookingData) return null;

    return {
      serviceCategory: bookingData.serviceName || "—",
      estimatedDuration: "Not recorded",
      estimatedPrice: `₹${formatAmount(
        bookingData.totalAmount
      )}`,
      applicableFor: bookingData.propertyType || "—",
    };
  }, [bookingData]);

  const timeline = useMemo(() => {
    if (!bookingData) return [];

    return [
      {
        title: "Booking Created",
        date: formatDateTime(bookingData.createdAt),
        by: `By ${bookingData.customerName || "Customer"}`,
        status: "done",
      },
      {
        title: "Admin Reviewed",
        date: formatDateTime(
          bookingData.updatedAt || bookingData.createdAt
        ),
        by: "By PCMS Administrator",
        status: "done",
      },
      {
        title: "Booking Rejected",
        date: formatDateTime(
          bookingData.updatedAt || bookingData.createdAt
        ),
        by: "By PCMS Administrator",
        status: "rejected",
      },
    ];
  }, [bookingData]);

  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
      return;
    }

    navigate("/admin/bookings/rejected");
  };

  const handlePrint = () => {
    if (typeof onPrint === "function") {
      onPrint(booking?.id);
      return;
    }

    window.print();
  };

  if (loading) {
    return (
      <div className="rbd-page">
        <section className="rbd-card">
          Loading rejected booking details...
        </section>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="rbd-page">
        <section className="rbd-card">
          <div className="rbd-card-header">
            <span className="rbd-card-header-icon rbd-icon-danger">
              <AlertCircle size={18} strokeWidth={2} />
            </span>
            <h2 className="rbd-card-title">
              {error || "Booking not found."}
            </h2>
          </div>

          <button
            type="button"
            className="rbd-btn rbd-btn-outline"
            onClick={handleBack}
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Back to Rejected Bookings
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="rbd-page">
      <nav className="rbd-breadcrumb" aria-label="Breadcrumb">
        <a href="#" className="rbd-breadcrumb-link">
          Dashboard
        </a>
        <ChevronRight size={14} className="rbd-breadcrumb-sep" />
        <a href="#" className="rbd-breadcrumb-link">
          Bookings
        </a>
        <ChevronRight size={14} className="rbd-breadcrumb-sep" />
        <a href="#" className="rbd-breadcrumb-link">
          Rejected Bookings
        </a>
        <ChevronRight size={14} className="rbd-breadcrumb-sep" />
        <span className="rbd-breadcrumb-current">View</span>
      </nav>

      <header className="rbd-header">
        <div className="rbd-header-left">
          <span className="rbd-header-icon">
            <XCircle size={26} strokeWidth={2} />
          </span>
          <div>
            <h1 className="rbd-title">Rejected Booking Details</h1>
            <p className="rbd-subtitle">
              View complete information about the rejected booking request.
            </p>
          </div>
        </div>

        <div className="rbd-header-actions">
          <button
            type="button"
            className="rbd-btn rbd-btn-outline"
            onClick={handleBack}
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Back to Rejected Bookings
          </button>
          <button
            type="button"
            className="rbd-btn rbd-btn-outline-primary"
            onClick={handlePrint}
          >
            <Printer size={16} strokeWidth={2} />
            Print Details
          </button>
        </div>
      </header>

      <section className="rbd-summary-card">
        <div className="rbd-summary-field">
          <span className="rbd-summary-label">Booking ID</span>
          <span className="rbd-summary-id">{booking.id}</span>
        </div>

        <div className="rbd-summary-field">
          <span className="rbd-summary-label">Status</span>
          <span className="rbd-badge rbd-badge-danger">
            {booking.status}
          </span>
        </div>

        <div className="rbd-summary-field">
          <span className="rbd-summary-label">Priority</span>
          <span className="rbd-badge rbd-badge-danger">
            {booking.priority}
          </span>
        </div>

        <div className="rbd-summary-field">
          <span className="rbd-summary-label">Rejected By</span>
          <span className="rbd-summary-person">
            <span className="rbd-summary-person-icon">
              <User size={15} strokeWidth={2} />
            </span>
            <span className="rbd-summary-person-text">
              <span className="rbd-summary-person-role">
                {booking.rejectedByRole}
              </span>
              <span className="rbd-summary-person-name">
                {booking.rejectedByName}
              </span>
            </span>
          </span>
        </div>

        <div className="rbd-summary-field">
          <span className="rbd-summary-label">
            Rejected Date &amp; Time
          </span>
          <span className="rbd-summary-date">
            <Calendar size={14} strokeWidth={2} />
            {booking.rejectedAt}
          </span>
        </div>
      </section>

      <div className="rbd-layout">
        <div className="rbd-main-col">
          <section className="rbd-card">
            <div className="rbd-card-header">
              <span className="rbd-card-header-icon">
                <FileText size={18} strokeWidth={2} />
              </span>
              <h2 className="rbd-card-title">Booking Information</h2>
            </div>

            <div className="rbd-info-columns">
              <div className="rbd-info-list">
                <InfoRow
                  icon={User}
                  label="Customer Name"
                  value={bookingInfo.customerName}
                />
                <InfoRow
                  icon={Phone}
                  label="Phone Number"
                  value={bookingInfo.phoneNumber}
                />
                <InfoRow
                  icon={Mail}
                  label="Email Address"
                  value={bookingInfo.emailAddress}
                />
                <InfoRow
                  icon={Building2}
                  label="Property Name"
                  value={bookingInfo.propertyName}
                />
                <InfoRow
                  icon={MapPin}
                  label="Property Address"
                  value={bookingInfo.propertyAddress}
                />
              </div>

              <div className="rbd-info-list">
                <InfoRow
                  icon={Bug}
                  label="Pest Type"
                  value={bookingInfo.pestType}
                />
                <InfoRow
                  icon={Wrench}
                  label="Service Type"
                  value={bookingInfo.serviceType}
                />
                <InfoRow
                  icon={Grid3x3}
                  label="Service Category"
                  value={bookingInfo.serviceCategory}
                />
                <InfoRow
                  icon={Calendar}
                  label="Preferred Date & Time"
                  value={bookingInfo.preferredDateTime}
                />
                <InfoRow
                  icon={PhoneCall}
                  label="Preferred Contact Method"
                  value={bookingInfo.preferredContactMethod}
                />
              </div>
            </div>
          </section>

          <section className="rbd-card">
            <div className="rbd-card-header">
              <span className="rbd-card-header-icon">
                <FileText size={18} strokeWidth={2} />
              </span>
              <h2 className="rbd-card-title">
                Customer Request Details
              </h2>
            </div>

            <div className="rbd-info-list rbd-info-list-wide">
              <InfoRow
                icon={FileText}
                label="Problem Description"
                value={requestDetails.problemDescription}
              />
              <InfoRow
                icon={StickyNote}
                label="Special Notes"
                value={requestDetails.specialNotes}
              />
              <div className="rbd-info-row">
                <span className="rbd-info-icon">
                  <Camera size={16} strokeWidth={2} />
                </span>
                <span className="rbd-info-label">Uploaded Images</span>
                <span className="rbd-info-colon">:</span>
                <div className="rbd-image-gallery">
                  {requestDetails.imageCount > 0 ? (
                    Array.from({
                      length: requestDetails.imageCount,
                    }).map((_, index) => (
                      <div
                        className="rbd-image-thumb"
                        key={index}
                      >
                        <Camera size={20} strokeWidth={1.5} />
                      </div>
                    ))
                  ) : (
                    <span className="rbd-info-value">
                      No images uploaded
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="rbd-card">
            <div className="rbd-card-header">
              <span className="rbd-card-header-icon">
                <History size={18} strokeWidth={2} />
              </span>
              <h2 className="rbd-card-title">Activity Timeline</h2>
            </div>

            <div className="rbd-timeline">
              {timeline.map((step, index) => (
                <React.Fragment key={step.title}>
                  <div className="rbd-timeline-step">
                    <span
                      className={`rbd-timeline-dot ${
                        step.status === "rejected"
                          ? "rbd-timeline-dot-danger"
                          : "rbd-timeline-dot-success"
                      }`}
                    >
                      {step.status === "rejected" ? (
                        <X size={16} strokeWidth={2} />
                      ) : (
                        <CheckCircle size={16} strokeWidth={2} />
                      )}
                    </span>
                    <div className="rbd-timeline-text">
                      <span className="rbd-timeline-title">
                        {step.title}
                      </span>
                      <span className="rbd-timeline-date">
                        {step.date}
                      </span>
                      <span className="rbd-timeline-by">
                        {step.by}
                      </span>
                    </div>
                  </div>
                  {index < timeline.length - 1 && (
                    <span
                      className={`rbd-timeline-connector ${
                        timeline[index + 1].status === "rejected"
                          ? "rbd-connector-danger"
                          : ""
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </section>
        </div>

        <aside className="rbd-side-col">
          <section className="rbd-card">
            <div className="rbd-card-header">
              <span className="rbd-card-header-icon rbd-icon-danger">
                <XCircle size={18} strokeWidth={2} />
              </span>
              <h2 className="rbd-card-title">
                Rejection Information
              </h2>
            </div>

            <div className="rbd-info-list">
              <InfoRow
                icon={XCircle}
                label="Rejection Reason"
                value={
                  <span className="rbd-reason-text">
                    {rejectionInfo.reason}
                  </span>
                }
              />
              <InfoRow
                icon={MessageSquare}
                label="Remarks"
                value={rejectionInfo.remarks}
              />
              <InfoRow
                icon={CalendarClock}
                label="Alternative Suggestion"
                value={rejectionInfo.alternativeSuggestion}
              />
            </div>
          </section>

          <section className="rbd-card">
            <div className="rbd-card-header">
              <span className="rbd-card-header-icon">
                <ShieldCheck size={18} strokeWidth={2} />
              </span>
              <h2 className="rbd-card-title">Service Summary</h2>
            </div>

            <div className="rbd-info-list">
              <InfoRow
                icon={Grid3x3}
                label="Service Category"
                value={serviceSummary.serviceCategory}
              />
              <InfoRow
                icon={Clock}
                label="Estimated Duration"
                value={serviceSummary.estimatedDuration}
              />
              <InfoRow
                icon={IndianRupee}
                label="Estimated Price"
                value={serviceSummary.estimatedPrice}
              />
              <InfoRow
                icon={Home}
                label="Applicable For"
                value={serviceSummary.applicableFor}
              />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}