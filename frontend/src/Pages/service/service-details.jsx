import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Eye,
  Pencil,
  ArrowLeft,
  Bug,
  Calendar,
  ClipboardList,
  Settings,
  Clock,
  RefreshCw,
  IndianRupee,
  Home,
  ShieldCheck,
  Flag,
  Tag,
  Image as ImageIcon,
  Info,
  CheckCircle,
  Camera,
} from "lucide-react";
import "./service-details.css";

const service = {
  name: "Termite Treatment",
  status: "Active",
  description: "Comprehensive termite inspection and treatment to protect your property.",
  serviceId: "SRV-2025-0001",
  createdOn: "10 May 2025",
  lastUpdated: "22 May 2025",
  category: "Termite Control",
  pestType: "Termite",
  serviceType: "Standard Treatment",
  detailedDescription:
    "Our termite treatment service includes a thorough inspection of the property, identification of termite activity, and application of advanced termiticides to eliminate existing colonies and prevent future infestations. We use safe and eco-friendly chemicals that are effective and long-lasting.",
  whatsIncluded: [
    "Inspection of affected areas",
    "Termite treatment application",
    "Barrier protection",
    "Detailed report and recommendations",
  ],
  notes: "Recommended annual inspection for best results.",
};

const details = [
  { icon: Clock, label: "Duration", value: "2 - 3 Hours" },
  { icon: IndianRupee, label: "Price", value: "₹150.00" },
  { icon: Home, label: "Applicable For", value: "Residential, Commercial" },
  { icon: RefreshCw, label: "Service Frequency", value: "One Time Service" },
  { icon: ShieldCheck, label: "Warranty Period", value: "30 Days" },
  { icon: Flag, label: "Priority Level", value: "Medium" },
];

const pricing = {
  basePrice: "₹150.00",
  discount: "₹0.00",
  tax: "₹0.00",
  total: "₹150.00",
};

const statusInfo = {
  currentStatus: "Active",
  availability: "Available",
  createdBy: "John Doe (Administrator)",
};

const timeline = [
  { title: "Service Created", date: "10 May 2025, 10:30 AM", by: "By John Doe" },
  { title: "Service Updated", date: "15 May 2025, 02:15 PM", by: "By John Doe" },
  { title: "Service Activated", date: "22 May 2025, 09:45 AM", by: "By John Doe" },
];

const InfoRow = ({ label, value }) => (
  <div className="sd-info-row">
    <span className="sd-info-label">{label}</span>
    <span className="sd-info-colon">:</span>
    <span className="sd-info-value">{value}</span>
  </div>
);

export default function ServiceDetails({ onEdit, onBack }) {
  const handleEdit = () => {
    if (typeof onEdit === "function") {
      onEdit(service.serviceId);
    } else {
      console.log("Edit Service clicked for", service.serviceId);
    }
  };

  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
    } else if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      console.log("Back to Services clicked");
    }
  };

  const navigate = useNavigate();

  return (
    <div className="sd-page">
      <nav className="sd-breadcrumb" aria-label="Breadcrumb">
        <a href="#" className="sd-breadcrumb-link">
          Admin
        </a>
        <ChevronRight size={14} className="sd-breadcrumb-sep" />
        <a href="#" className="sd-breadcrumb-link">
          Services
        </a>
        <ChevronRight size={14} className="sd-breadcrumb-sep" />
        <span className="sd-breadcrumb-current">View Service</span>
      </nav>

      <header className="sd-header">
        <div className="sd-header-left">
          <span className="sd-header-icon">
            <Eye size={26} strokeWidth={2} />
          </span>
          <div>
            <h1 className="sd-title">Service Details</h1>
            <p className="sd-subtitle">View complete information about this service.</p>
          </div>
        </div>

        <div className="sd-header-actions">
          <button type="button" className="sd-btn sd-btn-outline" onClick={() => navigate("/admin/services/edit")}>
            <Pencil size={16} strokeWidth={2} />
            Edit Service
          </button>
          <button type="button" className="sd-btn sd-btn-outline" onClick={handleBack}>
            <ArrowLeft size={16} strokeWidth={2} />
            Back to Services
          </button>
        </div>
      </header>

      <section className="sd-summary-card">
        <div className="sd-summary-left">
          <span className="sd-summary-icon">
            <Bug size={28} strokeWidth={2} />
          </span>
          <div className="sd-summary-text">
            <div className="sd-summary-name-row">
              <span className="sd-summary-name">{service.name}</span>
              <span className="sd-badge sd-badge-success">{service.status}</span>
            </div>
            <p className="sd-summary-desc">{service.description}</p>
          </div>
        </div>

        <div className="sd-summary-meta">
          <div className="sd-meta-field">
            <span className="sd-meta-label">Service ID</span>
            <span className="sd-meta-value">{service.serviceId}</span>
          </div>
          <div className="sd-meta-field">
            <span className="sd-meta-label">Created On</span>
            <span className="sd-meta-value sd-meta-with-icon">
              <Calendar size={14} strokeWidth={2} />
              {service.createdOn}
            </span>
          </div>
          <div className="sd-meta-field">
            <span className="sd-meta-label">Last Updated</span>
            <span className="sd-meta-value sd-meta-with-icon">
              <Calendar size={14} strokeWidth={2} />
              {service.lastUpdated}
            </span>
          </div>
          <div className="sd-meta-field">
            <span className="sd-meta-label">Status</span>
            <span className="sd-badge sd-badge-success">{service.status}</span>
          </div>
        </div>
      </section>

      <div className="sd-layout">
        <div className="sd-main-col">
          <section className="sd-card">
            <div className="sd-card-header">
              <span className="sd-card-header-icon">
                <ClipboardList size={18} strokeWidth={2} />
              </span>
              <h2 className="sd-card-title">Service Information</h2>
            </div>

            <div className="sd-info-columns">
              <div className="sd-info-list">
                <InfoRow label="Service Name" value={service.name} />
                <InfoRow label="Service Category" value={service.category} />
                <InfoRow label="Pest Type" value={service.pestType} />
                <InfoRow label="Service Type" value={service.serviceType} />
                <InfoRow label="Short Description" value={service.description} />
              </div>

              <div className="sd-info-list">
                <InfoRow label="Detailed Description" value={service.detailedDescription} />
                <InfoRow
                  label="What's Included"
                  value={
                    <ul className="sd-bullet-list">
                      {service.whatsIncluded.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  }
                />
                <InfoRow label="Notes" value={service.notes} />
              </div>
            </div>
          </section>

          <section className="sd-card">
            <div className="sd-card-header">
              <span className="sd-card-header-icon">
                <Settings size={18} strokeWidth={2} />
              </span>
              <h2 className="sd-card-title">Service Details</h2>
            </div>

            <div className="sd-detail-grid">
              {details.map(({ icon: Icon, label, value }) => (
                <div className="sd-detail-item" key={label}>
                  <span className="sd-detail-icon">
                    <Icon size={16} strokeWidth={2} />
                  </span>
                  <div className="sd-detail-text">
                    <span className="sd-detail-label">{label}</span>
                    <span className="sd-detail-value">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="sd-card">
            <div className="sd-card-header">
              <span className="sd-card-header-icon">
                <Clock size={18} strokeWidth={2} />
              </span>
              <h2 className="sd-card-title">Activity Timeline</h2>
            </div>

            <div className="sd-timeline">
              {timeline.map((step, index) => (
                <React.Fragment key={step.title}>
                  <div className="sd-timeline-step">
                    <span className="sd-timeline-dot">
                      <CheckCircle size={16} strokeWidth={2} />
                    </span>
                    <div className="sd-timeline-text">
                      <span className="sd-timeline-title">{step.title}</span>
                      <span className="sd-timeline-date">{step.date}</span>
                      <span className="sd-timeline-by">{step.by}</span>
                    </div>
                  </div>
                  {index < timeline.length - 1 && <span className="sd-timeline-connector" />}
                </React.Fragment>
              ))}
            </div>
          </section>
        </div>

        <aside className="sd-side-col">
          <section className="sd-card">
            <div className="sd-card-header">
              <span className="sd-card-header-icon">
                <Tag size={18} strokeWidth={2} />
              </span>
              <h2 className="sd-card-title">Pricing Information</h2>
            </div>

            <div className="sd-pricing-list">
              <div className="sd-pricing-row">
                <span className="sd-pricing-label">Base Price</span>
                <span className="sd-pricing-colon">:</span>
                <span className="sd-pricing-value">{pricing.basePrice}</span>
              </div>
              <div className="sd-pricing-row">
                <span className="sd-pricing-label">Discount</span>
                <span className="sd-pricing-colon">:</span>
                <span className="sd-pricing-value">{pricing.discount}</span>
              </div>
              <div className="sd-pricing-row">
                <span className="sd-pricing-label">Tax (0%)</span>
                <span className="sd-pricing-colon">:</span>
                <span className="sd-pricing-value">{pricing.tax}</span>
              </div>
            </div>

            <div className="sd-pricing-total-row">
              <span className="sd-pricing-total-label">Total Price</span>
              <span className="sd-pricing-colon">:</span>
              <span className="sd-pricing-total-value">{pricing.total}</span>
            </div>
          </section>

          <section className="sd-card">
            <div className="sd-card-header">
              <span className="sd-card-header-icon">
                <ImageIcon size={18} strokeWidth={2} />
              </span>
              <h2 className="sd-card-title">Service Image</h2>
            </div>

            <div className="sd-image-placeholder">
              <Camera size={32} strokeWidth={1.5} />
              <span>No image uploaded</span>
            </div>
          </section>

          <section className="sd-card">
            <div className="sd-card-header">
              <span className="sd-card-header-icon">
                <Info size={18} strokeWidth={2} />
              </span>
              <h2 className="sd-card-title">Status Information</h2>
            </div>

            <div className="sd-status-list">
              <div className="sd-status-row">
                <span className="sd-status-label">Current Status</span>
                <span className="sd-badge sd-badge-success">{statusInfo.currentStatus}</span>
              </div>
              <div className="sd-status-row">
                <span className="sd-status-label">Service Availability</span>
                <span className="sd-badge sd-badge-success">{statusInfo.availability}</span>
              </div>
              <div className="sd-status-row">
                <span className="sd-status-label">Created By</span>
                <span className="sd-status-value">{statusInfo.createdBy}</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}