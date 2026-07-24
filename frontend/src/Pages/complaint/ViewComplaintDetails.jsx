import React, { useState } from "react";
import {
  ChevronRight,
  MessageSquare,
  ArrowLeft,
  Printer,
  Copy,
  Check,
  Calendar,
  User,
  Phone,
  Mail,
  Building2,
  MapPin,
  Info,
  FileText,
  Camera,
  History,
  CheckCircle,
} from "lucide-react";
import "./ViewComplaintDetails.css";

const complaint = {
  id: "CMP-2025-0012",
  bookingId: "BK-2025-0102",
  status: "Pending",
  priority: "High",
  dateSubmitted: "22 May 2025, 10:15 AM",
  lastUpdated: "22 May 2025, 10:15 AM",
};

const customer = {
  name: "Rahul Sharma",
  phone: "9876543210",
  email: "rahul.sharma@email.com",
  propertyName: "Green Valley Apartments",
  propertyAddress: "Pune, Maharashtra - 411001",
};

const complaintInfo = {
  category: "Pest Still Exists",
  type: "Termite Treatment",
  serviceRelatedTo: "Termite Treatment",
  preferredContactMethod: "Phone Call",
  preferredContactNumber: "9876543210",
  preferredFollowUpDate: "23 May 2025",
};

const description =
  "After the termite treatment on 10 May 2025, I am still seeing termites in the kitchen area. The issue has not been resolved. Please take immediate action.";

const imageCount = 3;

const timeline = [
  { title: "Complaint Submitted", date: "22 May 2025, 10:15 AM", by: "By Rahul Sharma", status: "done" },
  { title: "Under Review", date: "22 May 2025, 11:45 AM", by: "By Admin", status: "active" },
  { title: "In Progress", date: "—", by: "", status: "pending" },
  { title: "Resolved", date: "—", by: "", status: "pending" },
];

const notes = "Our team is reviewing your complaint. We will update you soon.";

const InfoRow = ({ label, value }) => (
  <div className="vcd-info-row">
    <span className="vcd-info-label">{label}</span>
    <span className="vcd-info-colon">:</span>
    <span className="vcd-info-value">{value}</span>
  </div>
);

export default function ViewComplaintDetails({ onBack, onPrint }) {
  const [copied, setCopied] = useState(false);

  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
    } else if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    }
  };

  const handlePrint = () => {
    if (typeof onPrint === "function") {
      onPrint(complaint.id);
    } else if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(complaint.id);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="vcd-page">
      <nav className="vcd-breadcrumb" aria-label="Breadcrumb">
        <a href="#" className="vcd-breadcrumb-link">
          Dashboard
        </a>
        <ChevronRight size={14} className="vcd-breadcrumb-sep" />
        <a href="#" className="vcd-breadcrumb-link">
          Complaints
        </a>
        <ChevronRight size={14} className="vcd-breadcrumb-sep" />
        <span className="vcd-breadcrumb-current">Complaint Details</span>
      </nav>

      <header className="vcd-header">
        <div className="vcd-header-left">
          <span className="vcd-header-icon">
            <MessageSquare size={26} strokeWidth={2} />
          </span>
          <div>
            <h1 className="vcd-title">Complaint Details</h1>
            <p className="vcd-subtitle">View complete details and status of your complaint.</p>
          </div>
        </div>

        <div className="vcd-header-actions">
          <button type="button" className="vcd-btn vcd-btn-outline" onClick={handleBack}>
            <ArrowLeft size={16} strokeWidth={2} />
            Back to My Complaints
          </button>
          <button type="button" className="vcd-btn vcd-btn-outline-primary" onClick={handlePrint}>
            <Printer size={16} strokeWidth={2} />
            Print Complaint
          </button>
        </div>
      </header>

      <section className="vcd-summary-card">
        <div className="vcd-summary-field">
          <span className="vcd-summary-label">Complaint ID</span>
          <span className="vcd-summary-id-row">
            <span className="vcd-summary-id">{complaint.id}</span>
            <button type="button" className="vcd-copy-btn" onClick={handleCopy} aria-label="Copy complaint ID">
              {copied ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2} />}
            </button>
          </span>
        </div>

        <div className="vcd-summary-field">
          <span className="vcd-summary-label">Booking ID</span>
          <span className="vcd-summary-value">{complaint.bookingId}</span>
        </div>

        <div className="vcd-summary-field">
          <span className="vcd-summary-label">Status</span>
          <span className="vcd-badge vcd-badge-warning">{complaint.status}</span>
        </div>

        <div className="vcd-summary-field">
          <span className="vcd-summary-label">Priority</span>
          <span className="vcd-badge vcd-badge-danger">{complaint.priority}</span>
        </div>

        <div className="vcd-summary-field">
          <span className="vcd-summary-label">Date Submitted</span>
          <span className="vcd-summary-value vcd-summary-with-icon">
            <Calendar size={14} strokeWidth={2} />
            {complaint.dateSubmitted}
          </span>
        </div>

        <div className="vcd-summary-field">
          <span className="vcd-summary-label">Last Updated</span>
          <span className="vcd-summary-value vcd-summary-with-icon">
            <Calendar size={14} strokeWidth={2} />
            {complaint.lastUpdated}
          </span>
        </div>
      </section>

      <section className="vcd-grid">
        <div className="vcd-card">
          <div className="vcd-card-header">
            <span className="vcd-card-header-icon">
              <User size={18} strokeWidth={2} />
            </span>
            <h2 className="vcd-card-title">Customer Information</h2>
          </div>
          <div className="vcd-info-list">
            <InfoRow label="Customer Name" value={customer.name} />
            <InfoRow
              label="Phone Number"
              value={
                <span className="vcd-value-with-icon">
                  {customer.phone}
                  <Phone size={13} strokeWidth={2} />
                </span>
              }
            />
            <InfoRow
              label="Email Address"
              value={
                <span className="vcd-value-with-icon">
                  {customer.email}
                  <Mail size={13} strokeWidth={2} />
                </span>
              }
            />
            <InfoRow
              label="Property Name"
              value={
                <span className="vcd-value-with-icon">
                  {customer.propertyName}
                  <Building2 size={13} strokeWidth={2} />
                </span>
              }
            />
            <InfoRow
              label="Property Address"
              value={
                <span className="vcd-value-with-icon">
                  {customer.propertyAddress}
                  <MapPin size={13} strokeWidth={2} />
                </span>
              }
            />
          </div>
        </div>

        <div className="vcd-card">
          <div className="vcd-card-header">
            <span className="vcd-card-header-icon">
              <Info size={18} strokeWidth={2} />
            </span>
            <h2 className="vcd-card-title">Complaint Information</h2>
          </div>
          <div className="vcd-info-list">
            <InfoRow label="Complaint Category" value={complaintInfo.category} />
            <InfoRow label="Complaint Type" value={complaintInfo.type} />
            <InfoRow label="Service Related To" value={complaintInfo.serviceRelatedTo} />
            <InfoRow label="Preferred Contact Method" value={complaintInfo.preferredContactMethod} />
            <InfoRow label="Preferred Contact Number" value={complaintInfo.preferredContactNumber} />
            <InfoRow label="Preferred Date for Follow-up" value={complaintInfo.preferredFollowUpDate} />
          </div>
        </div>

        <div className="vcd-card">
          <div className="vcd-card-header">
            <span className="vcd-card-header-icon">
              <FileText size={18} strokeWidth={2} />
            </span>
            <h2 className="vcd-card-title">Description</h2>
          </div>
          <p className="vcd-description-text">{description}</p>

          <div className="vcd-images-block">
            <span className="vcd-images-label">
              <Camera size={14} strokeWidth={2} />
              Uploaded Images
            </span>
            <div className="vcd-image-gallery">
              {Array.from({ length: imageCount }).map((_, i) => (
                <div className="vcd-image-thumb" key={i}>
                  <Camera size={20} strokeWidth={1.5} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="vcd-card">
          <div className="vcd-card-header">
            <span className="vcd-card-header-icon">
              <History size={18} strokeWidth={2} />
            </span>
            <h2 className="vcd-card-title">Complaint Timeline</h2>
          </div>

          <div className="vcd-timeline">
            {timeline.map((step, index) => (
              <div className="vcd-timeline-step" key={step.title}>
                <div className="vcd-timeline-marker">
                  <span className={`vcd-timeline-dot vcd-timeline-dot-${step.status}`}>
                    {step.status === "done" && <CheckCircle size={13} strokeWidth={2.5} />}
                  </span>
                  {index < timeline.length - 1 && (
                    <span className={`vcd-timeline-line vcd-timeline-line-${step.status}`} />
                  )}
                </div>
                <div className="vcd-timeline-text">
                  <span className={`vcd-timeline-title vcd-timeline-title-${step.status}`}>
                    {step.title}
                  </span>
                  <span className="vcd-timeline-date">{step.date}</span>
                  {step.by && <span className="vcd-timeline-by">{step.by}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="vcd-card vcd-notes-card">
        <div className="vcd-card-header">
          <span className="vcd-card-header-icon">
            <FileText size={18} strokeWidth={2} />
          </span>
          <h2 className="vcd-card-title">Notes &amp; Updates</h2>
        </div>
        <p className="vcd-notes-text">{notes}</p>
      </section>
    </div>
  );
}