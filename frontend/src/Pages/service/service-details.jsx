import React from "react";
import {
  Pencil,
  MoreHorizontal,
  Plus,
  Bug,
  LayoutGrid,
  Clock,
  DollarSign,
  CalendarDays,
  ShieldCheck,
  FileText,
  Info,
  CheckCircle2,
  ClipboardList,
  Image as ImageIcon,
  StickyNote,
  History,
} from "lucide-react";
import "./service-details.css";

const SERVICE = {
  name: "Termite Treatment",
  status: "Active",
  shortDescription: "Comprehensive termite inspection and treatment to protect your property.",
  category: "Termite Control",
  pestType: "Termites",
  duration: "2 - 3 Hours",
  price: 150.0,
  createdOn: "10 May 2025",
  lastUpdated: "12 May 2025 02:35 PM",
  serviceId: "SRV-2025-00124",
  createdBy: "Admin",
  detailedDescription:
    "Our termite treatment service includes a thorough inspection of the property, identification of termite activity, and application of effective treatment methods to eliminate termites and prevent future infestations.",
  benefits: [
    "Eliminates existing termite colonies",
    "Prevents future termite infestations",
    "Safe and eco-friendly treatment options",
    "Protects property structure and value",
    "Long-lasting protection",
  ],
  included: [
    "Detailed property inspection",
    "Termite activity detection",
    "Treatment application",
    "Post-treatment guidance",
  ],
  note: "Ensure the area is accessible for inspection and treatment.",
  activity: [
    { date: "12 May 2025 02:35 PM", title: "Service updated", detail: "Updated by Admin", tone: "active" },
    { date: "10 May 2025 11:20 AM", title: "Service created", detail: "Created by Admin", tone: "active" },
    { date: "10 May 2025 11:15 AM", title: "Initial data added", detail: "Created by System", tone: "muted" },
  ],
};

export default function ServiceDetails() {
  return (
    <div className="service-details-page">
      <div className="sdp-breadcrumb">
        <span className="crumb-active">Dashboard</span>
        <span className="crumb-sep">›</span>
        <span>Services</span>
        <span className="crumb-sep">›</span>
        <span>Service Details</span>
      </div>

      <div className="sdp-header">
        <div>
          <h1>Service Details</h1>
          <p>View complete information about the selected service.</p>
        </div>
        <div className="sdp-header-actions">
          <button className="btn btn-outline">
            <Pencil size={18} />
            Edit Service
          </button>
          <button className="btn btn-outline">
            <MoreHorizontal size={18} />
            More Actions
          </button>
          <button className="btn btn-primary">
            <Plus size={18} />
            Add Service
          </button>
        </div>
      </div>

      <div className="sdp-summary-card">
        <div className="summary-main">
          <div className="summary-icon">
            <Bug size={32} />
          </div>
          <div>
            <div className="summary-title-row">
              <h2>{SERVICE.name}</h2>
              <span className="status-badge status-active">{SERVICE.status}</span>
            </div>
            <p className="summary-desc">{SERVICE.shortDescription}</p>
          </div>
        </div>

        <div className="summary-meta">
          <div className="meta-item">
            <span className="meta-label">
              <LayoutGrid size={14} /> Category
            </span>
            <span className="meta-value">{SERVICE.category}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">
              <Bug size={14} /> Pest Type
            </span>
            <span className="meta-value">{SERVICE.pestType}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">
              <Clock size={14} /> Duration
            </span>
            <span className="meta-value">{SERVICE.duration}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">
              <DollarSign size={14} /> Price (USD)
            </span>
            <span className="meta-value">${SERVICE.price.toFixed(2)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">
              <CalendarDays size={14} /> Created On
            </span>
            <span className="meta-value">{SERVICE.createdOn}</span>
          </div>
        </div>

        <div className="summary-status-card">
          <div className="card-title">
            <span className="card-icon">
              <ShieldCheck size={18} />
            </span>
            Service Status
          </div>
          <div className="status-rows">
            <div className="status-row">
              <span>Status</span>
              <span className="status-badge status-active">{SERVICE.status}</span>
            </div>
            <div className="status-row">
              <span>Created On</span>
              <span>{SERVICE.createdOn}</span>
            </div>
            <div className="status-row">
              <span>Last Updated</span>
              <span>{SERVICE.lastUpdated}</span>
            </div>
            <div className="status-row status-row-divider">
              <span>Service ID</span>
              <span>{SERVICE.serviceId}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sdp-grid">
        <div className="sdp-main">
          <div className="sdp-card">
            <div className="card-title">
              <span className="card-icon">
                <FileText size={18} />
              </span>
              Description
            </div>
            <div className="desc-block">
              <span className="desc-label">Short Description</span>
              <p>{SERVICE.shortDescription}</p>
            </div>
            <div className="desc-block">
              <span className="desc-label">Detailed Description</span>
              <p>{SERVICE.detailedDescription}</p>
            </div>
          </div>

          <div className="sdp-two-col">
            <div className="sdp-card">
              <div className="card-title">
                <span className="card-icon">
                  <ShieldCheck size={18} />
                </span>
                Key Benefits
              </div>
              <ul className="check-list">
                {SERVICE.benefits.map((b) => (
                  <li key={b}>
                    <CheckCircle2 size={16} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sdp-card">
              <div className="card-title">
                <span className="card-icon">
                  <ClipboardList size={18} />
                </span>
                Included In Service
              </div>
              <ul className="check-list">
                {SERVICE.included.map((i) => (
                  <li key={i}>
                    <CheckCircle2 size={16} />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="sdp-card">
            <div className="card-title">
              <span className="card-icon">
                <History size={18} />
              </span>
              Activity History
            </div>
            <div className="activity-timeline">
              {SERVICE.activity.map((a) => (
                <div className="activity-item" key={a.title}>
                  <span className={`activity-dot ${a.tone === "muted" ? "dot-muted" : ""}`} />
                  <div className="activity-body">
                    <span className="activity-date">{a.date}</span>
                    <span className="activity-title">{a.title}</span>
                    <span className="activity-detail">{a.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sdp-side">
          <div className="sdp-card">
            <div className="card-title">
              <span className="card-icon">
                <Info size={18} />
              </span>
              Service Information
            </div>
            <div className="info-rows">
              <div className="info-row">
                <span>Category</span>
                <span>{SERVICE.category}</span>
              </div>
              <div className="info-row">
                <span>Pest Type</span>
                <span>{SERVICE.pestType}</span>
              </div>
              <div className="info-row">
                <span>Duration</span>
                <span>{SERVICE.duration}</span>
              </div>
              <div className="info-row">
                <span>Price (USD)</span>
                <span>${SERVICE.price.toFixed(2)}</span>
              </div>
              <div className="info-row">
                <span>Status</span>
                <span className="text-success">{SERVICE.status}</span>
              </div>
              <div className="info-row">
                <span>Created By</span>
                <span>{SERVICE.createdBy}</span>
              </div>
              <div className="info-row">
                <span>Created On</span>
                <span>{SERVICE.createdOn}</span>
              </div>
              <div className="info-row">
                <span>Last Updated</span>
                <span>{SERVICE.lastUpdated}</span>
              </div>
            </div>
          </div>

          <div className="sdp-card">
            <div className="card-title">
              <span className="card-icon">
                <ImageIcon size={18} />
              </span>
              Service Image
            </div>
            <div className="service-image-frame">
              <Bug size={40} />
            </div>
          </div>

          <div className="sdp-card notes-card">
            <div className="card-title">
              <span className="card-icon">
                <StickyNote size={18} />
              </span>
              Notes
            </div>
            <div className="note-box">
              <Info size={16} />
              <p>{SERVICE.note}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}