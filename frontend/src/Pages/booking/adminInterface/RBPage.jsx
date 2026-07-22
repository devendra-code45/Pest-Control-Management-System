import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ArrowLeft,
  Calendar,
  Building2,
  MapPin,
  Bug,
  Shield,
  Clock,
  Flag,
  User,
  XCircle,
  ChevronDown,
  CalendarX,
  LocateFixed,
  Clock3,
  CircleDollarSign,
  FileWarning,
  MoreHorizontal,
  X,
  Bell,
  ShieldCheck,
  CheckCircle2,
  Headphones,
  MessageCircle,
} from "lucide-react";
import "./RBPage.css";

const booking = {
  property: "Sharma Residency",
  location: "Pune, Maharashtra",
  pestType: "Cockroach",
  serviceType: "General Pest Control",
  scheduleDate: "15 May 2025",
  scheduleTime: "10:00 AM",
  priority: "High",
  assignedTo: "Not Assigned",
};

const rejectionReasons = [
  {
    id: "service-not-available",
    icon: Calendar,
    title: "Service Not Available",
    description: "The requested service is currently not available in this area.",
  },
  {
    id: "outside-service-area",
    icon: LocateFixed,
    title: "Outside Service Area",
    description: "This location is outside our serviceable area.",
  },
  {
    id: "schedule-not-available",
    icon: Clock3,
    title: "Schedule Not Available",
    description: "We are unable to accommodate the requested date and time.",
  },
  {
    id: "pricing-not-feasible",
    icon: CircleDollarSign,
    title: "Pricing Not Feasible",
    description: "The service requirement is outside our current pricing structure.",
  },
  {
    id: "incomplete-information",
    icon: FileWarning,
    title: "Incomplete Information",
    description: "Booking details provided by customer are incomplete.",
  },
  {
    id: "other",
    icon: MoreHorizontal,
    title: "Other",
    description: "Any other reason not listed above.",
  },
];

const policyPoints = [
  "Choose an appropriate reason for rejection.",
  "Be clear and specific with the reason.",
  "Customers can create a new booking with updated details.",
];

const NOTES_LIMIT = 250;

export default function RejectBookingPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [selectedReason, setSelectedReason] = useState(null);
  const [notes, setNotes] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectReason = (reason) => {
    setSelectedReason(reason);
    setIsDropdownOpen(false);
  };

  const navigate = useNavigate();

  return (
    <div className="rb-page">
      <nav className="rb-breadcrumb" aria-label="Breadcrumb">
        <a href="#" className="rb-breadcrumb-link">
          Admin
        </a>
        <ChevronRight size={14} className="rb-breadcrumb-sep" />
        <a href="#" className="rb-breadcrumb-link">
          Bookings
        </a>
        <ChevronRight size={14} className="rb-breadcrumb-sep" />
        <a href="#" className="rb-breadcrumb-link">
          Pending
        </a>
        <ChevronRight size={14} className="rb-breadcrumb-sep" />
        <span className="rb-breadcrumb-current">Reject Booking</span>
      </nav>

      <header className="rb-header">
        <div>
          <h1 className="rb-title">Reject Booking</h1>
          <p className="rb-subtitle">
            Select a reason for rejecting this booking. The selected reason will be
            shared with the customer.
          </p>
        </div>
        <button type="button" className="rb-btn rb-btn-outline" onClick={() => navigate("/admin/bookings/pending")}>
          <ArrowLeft size={16} strokeWidth={2} />
          Back to Pending Bookings
        </button>
      </header>

      <div className="rb-layout">
        <div className="rb-main-col">
          <section className="rb-card">
            <div className="rb-card-header">
              <span className="rb-card-header-icon rb-icon-accent">
                <Calendar size={18} strokeWidth={2} />
              </span>
              <h2 className="rb-card-title">Booking Information</h2>
            </div>

            <div className="rb-booking-summary">
              <div className="rb-property-block">
                <span className="rb-property-icon">
                  <Building2 size={24} strokeWidth={2} />
                </span>
                <div className="rb-property-text">
                  <span className="rb-property-name">{booking.property}</span>
                  <span className="rb-property-location">
                    <MapPin size={13} strokeWidth={2} />
                    {booking.location}
                  </span>
                </div>
              </div>

              <div className="rb-summary-field">
                <span className="rb-summary-label">Pest Type</span>
                <span className="rb-summary-value">
                  <Bug size={15} strokeWidth={2} />
                  {booking.pestType}
                </span>
              </div>

              <div className="rb-summary-field">
                <span className="rb-summary-label">Service Type</span>
                <span className="rb-summary-value">
                  <Shield size={15} strokeWidth={2} />
                  {booking.serviceType}
                </span>
              </div>

              <div className="rb-summary-field">
                <span className="rb-summary-label">Schedule</span>
                <span className="rb-summary-value rb-summary-stacked">
                  <span className="rb-summary-line">
                    <Calendar size={14} strokeWidth={2} />
                    {booking.scheduleDate}
                  </span>
                  <span className="rb-summary-line">
                    <Clock size={14} strokeWidth={2} />
                    {booking.scheduleTime}
                  </span>
                </span>
              </div>

              <div className="rb-summary-field">
                <span className="rb-summary-label">Priority</span>
                <span className="rb-priority-badge">
                  <Flag size={12} strokeWidth={2} />
                  {booking.priority}
                </span>
              </div>

              <div className="rb-summary-field">
                <span className="rb-summary-label">Assigned To</span>
                <span className="rb-summary-value rb-summary-muted">
                  <User size={15} strokeWidth={2} />
                  {booking.assignedTo}
                </span>
              </div>
            </div>
          </section>

          <section className="rb-card rb-reason-card">
            <div className="rb-card-header">
              <span className="rb-card-header-icon rb-icon-danger">
                <XCircle size={18} strokeWidth={2} />
              </span>
              <h2 className="rb-card-title">Rejection Reason</h2>
            </div>
            <p className="rb-reason-desc">
              Please select a reason for rejecting this booking. This reason will be
              visible to the customer.
            </p>

            <div className="rb-form-grid">
              <div className="rb-form-field">
                <label className="rb-form-label">
                  Select Reason <span className="rb-required">*</span>
                </label>

                {/* Positioning context lives ONLY on this wrapper, separate from the
                    label, so the menu always anchors directly under the trigger. */}
                <div className="rb-dropdown-field" ref={dropdownRef}>
                  <button
                    type="button"
                    className="rb-dropdown-trigger"
                    aria-haspopup="listbox"
                    aria-expanded={isDropdownOpen}
                    onClick={() => setIsDropdownOpen((open) => !open)}
                  >
                    <span className={selectedReason ? "rb-dropdown-value" : "rb-dropdown-placeholder"}>
                      {selectedReason ? selectedReason.title : "Choose a reason for rejection"}
                    </span>
                    <ChevronDown
                      size={16}
                      strokeWidth={2}
                      className={`rb-dropdown-caret ${isDropdownOpen ? "rb-caret-open" : ""}`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <ul className="rb-dropdown-menu" role="listbox">
                      {rejectionReasons.map((reason) => {
                        const Icon = reason.icon;
                        return (
                          <li key={reason.id}>
                            <button
                              type="button"
                              className={`rb-dropdown-option ${
                                selectedReason?.id === reason.id ? "rb-option-selected" : ""
                              }`}
                              onClick={() => handleSelectReason(reason)}
                            >
                              <span className="rb-option-icon">
                                <Icon size={16} strokeWidth={2} />
                              </span>
                              <span className="rb-option-text">
                                <span className="rb-option-title">{reason.title}</span>
                                <span className="rb-option-desc">{reason.description}</span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>

              <div className="rb-form-field">
                <label className="rb-form-label" htmlFor="rb-notes">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="rb-notes"
                  className="rb-textarea"
                  placeholder="Add any additional notes (optional)"
                  maxLength={NOTES_LIMIT}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <span className="rb-char-count">
                  {notes.length} / {NOTES_LIMIT}
                </span>
              </div>
            </div>

            <div className="rb-form-actions">
              <button type="button" className="rb-btn rb-btn-outline">
                Cancel
              </button>
              <button type="button" className="rb-btn rb-btn-danger" disabled={!selectedReason}>
                <X size={16} strokeWidth={2} />
                Reject Booking
              </button>
            </div>
          </section>
        </div>

        <aside className="rb-side-col">
          <div className="rb-notice-card rb-notice-danger">
            <div className="rb-notice-header">
              <span className="rb-notice-icon">
                <Bell size={18} strokeWidth={2} />
              </span>
              <h3 className="rb-notice-title">Customer Notification</h3>
            </div>
            <p className="rb-notice-text">
              The selected reason will be shared with the customer. You can add
              additional notes if needed.
            </p>
          </div>

          <div className="rb-notice-card rb-notice-success">
            <div className="rb-notice-header">
              <span className="rb-notice-icon">
                <ShieldCheck size={18} strokeWidth={2} />
              </span>
              <h3 className="rb-notice-title">Rejection Policy</h3>
            </div>
            <ul className="rb-policy-list">
              {policyPoints.map((point) => (
                <li key={point}>
                  <CheckCircle2 size={16} strokeWidth={2} className="rb-policy-check" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rb-notice-card rb-notice-neutral">
            <div className="rb-notice-header">
              <span className="rb-notice-icon">
                <Headphones size={18} strokeWidth={2} />
              </span>
              <h3 className="rb-notice-title">Need Help?</h3>
            </div>
            <p className="rb-notice-text">
              If you have any questions, contact the customer support team.
            </p>
            <button type="button" className="rb-btn rb-btn-outline rb-support-btn">
              <MessageCircle size={16} strokeWidth={2} />
              Contact Support
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}