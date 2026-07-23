import React from "react";
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
} from "lucide-react";
import "./RBView.css";

const booking = {
  id: "BK-2025-0109",
  status: "Rejected",
  priority: "High",
  rejectedByRole: "Admin",
  rejectedByName: "John Doe",
  rejectedAt: "22 May 2025, 11:30 AM",
};

const bookingInfo = {
  customerName: "Rahul Sharma",
  phoneNumber: "9876543210",
  emailAddress: "rahul.sharma@email.com",
  propertyName: "Green Valley Apartments",
  propertyAddress: "Pune, Maharashtra - 411001",
  pestType: "Termite",
  serviceType: "Termite Control",
  serviceCategory: "Residential",
  preferredDateTime: "22 May 2025, 11:30 AM",
  preferredContactMethod: "Phone Call",
};

const requestDetails = {
  problemDescription: "We are facing termite issues in the kitchen and wooden doors. Need immediate inspection and treatment.",
  specialNotes: "—",
  imageCount: 3,
};

const rejectionInfo = {
  reason: "Service Not Available",
  remarks: "Service not available for the selected date. Please choose another available date.",
  alternativeSuggestion: "Please select a date after 25 May 2025 or contact support for assistance.",
};

const serviceSummary = {
  serviceCategory: "Termite Control",
  estimatedDuration: "2 - 3 Hours",
  estimatedPrice: "₹150.00",
  applicableFor: "Residential",
};

const timeline = [
  { title: "Booking Created", date: "19 May 2025, 10:15 AM", by: "By Rahul Sharma", status: "done" },
  { title: "Admin Reviewed", date: "22 May 2025, 10:45 AM", by: "By John Doe (Admin)", status: "done" },
  { title: "Booking Rejected", date: "22 May 2025, 11:30 AM", by: "By John Doe (Admin)", status: "rejected" },
];

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="rbd-info-row">
    <span className="rbd-info-icon">
      <Icon size={16} strokeWidth={2} />
    </span>
    <span className="rbd-info-label">{label}</span>
    <span className="rbd-info-colon">:</span>
    <span className="rbd-info-value">{value}</span>
  </div>
);

export default function RejectedBookingDetails({ onBack, onPrint }) {
  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
    } else if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    }
  };

  const handlePrint = () => {
    if (typeof onPrint === "function") {
      onPrint(booking.id);
    } else if (typeof window !== "undefined") {
      window.print();
    }
  };

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
          <button type="button" className="rbd-btn rbd-btn-outline" onClick={handleBack}>
            <ArrowLeft size={16} strokeWidth={2} />
            Back to Rejected Bookings
          </button>
          <button type="button" className="rbd-btn rbd-btn-outline-primary" onClick={handlePrint}>
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
          <span className="rbd-badge rbd-badge-danger">{booking.status}</span>
        </div>

        <div className="rbd-summary-field">
          <span className="rbd-summary-label">Priority</span>
          <span className="rbd-badge rbd-badge-danger">{booking.priority}</span>
        </div>

        <div className="rbd-summary-field">
          <span className="rbd-summary-label">Rejected By</span>
          <span className="rbd-summary-person">
            <span className="rbd-summary-person-icon">
              <User size={15} strokeWidth={2} />
            </span>
            <span className="rbd-summary-person-text">
              <span className="rbd-summary-person-role">{booking.rejectedByRole}</span>
              <span className="rbd-summary-person-name">{booking.rejectedByName}</span>
            </span>
          </span>
        </div>

        <div className="rbd-summary-field">
          <span className="rbd-summary-label">Rejected Date &amp; Time</span>
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
                <InfoRow icon={User} label="Customer Name" value={bookingInfo.customerName} />
                <InfoRow icon={Phone} label="Phone Number" value={bookingInfo.phoneNumber} />
                <InfoRow icon={Mail} label="Email Address" value={bookingInfo.emailAddress} />
                <InfoRow icon={Building2} label="Property Name" value={bookingInfo.propertyName} />
                <InfoRow icon={MapPin} label="Property Address" value={bookingInfo.propertyAddress} />
              </div>

              <div className="rbd-info-list">
                <InfoRow icon={Bug} label="Pest Type" value={bookingInfo.pestType} />
                <InfoRow icon={Wrench} label="Service Type" value={bookingInfo.serviceType} />
                <InfoRow icon={Grid3x3} label="Service Category" value={bookingInfo.serviceCategory} />
                <InfoRow icon={Calendar} label="Preferred Date & Time" value={bookingInfo.preferredDateTime} />
                <InfoRow icon={PhoneCall} label="Preferred Contact Method" value={bookingInfo.preferredContactMethod} />
              </div>
            </div>
          </section>

          <section className="rbd-card">
            <div className="rbd-card-header">
              <span className="rbd-card-header-icon">
                <FileText size={18} strokeWidth={2} />
              </span>
              <h2 className="rbd-card-title">Customer Request Details</h2>
            </div>

            <div className="rbd-info-list rbd-info-list-wide">
              <InfoRow icon={FileText} label="Problem Description" value={requestDetails.problemDescription} />
              <InfoRow icon={StickyNote} label="Special Notes" value={requestDetails.specialNotes} />
              <div className="rbd-info-row">
                <span className="rbd-info-icon">
                  <Camera size={16} strokeWidth={2} />
                </span>
                <span className="rbd-info-label">Uploaded Images</span>
                <span className="rbd-info-colon">:</span>
                <div className="rbd-image-gallery">
                  {Array.from({ length: requestDetails.imageCount }).map((_, i) => (
                    <div className="rbd-image-thumb" key={i}>
                      <Camera size={20} strokeWidth={1.5} />
                    </div>
                  ))}
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
                        step.status === "rejected" ? "rbd-timeline-dot-danger" : "rbd-timeline-dot-success"
                      }`}
                    >
                      {step.status === "rejected" ? (
                        <X size={16} strokeWidth={2} />
                      ) : (
                        <CheckCircle size={16} strokeWidth={2} />
                      )}
                    </span>
                    <div className="rbd-timeline-text">
                      <span className="rbd-timeline-title">{step.title}</span>
                      <span className="rbd-timeline-date">{step.date}</span>
                      <span className="rbd-timeline-by">{step.by}</span>
                    </div>
                  </div>
                  {index < timeline.length - 1 && (
                    <span
                      className={`rbd-timeline-connector ${
                        timeline[index + 1].status === "rejected" ? "rbd-connector-danger" : ""
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
              <h2 className="rbd-card-title">Rejection Information</h2>
            </div>

            <div className="rbd-info-list">
              <InfoRow
                icon={XCircle}
                label="Rejection Reason"
                value={<span className="rbd-reason-text">{rejectionInfo.reason}</span>}
              />
              <InfoRow icon={MessageSquare} label="Remarks" value={rejectionInfo.remarks} />
              <InfoRow icon={CalendarClock} label="Alternative Suggestion" value={rejectionInfo.alternativeSuggestion} />
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
              <InfoRow icon={Grid3x3} label="Service Category" value={serviceSummary.serviceCategory} />
              <InfoRow icon={Clock} label="Estimated Duration" value={serviceSummary.estimatedDuration} />
              <InfoRow icon={IndianRupee} label="Estimated Price" value={serviceSummary.estimatedPrice} />
              <InfoRow icon={Home} label="Applicable For" value={serviceSummary.applicableFor} />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}