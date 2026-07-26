import React, { useState } from "react";
import {
  ChevronRight,
  X,
  Save,
  SprayCan,
  FileText,
  Tag,
  Grid3x3,
  Shield,
  Bug,
  PenLine,
  Boxes,
  IndianRupee,
  Clock,
  Calendar,
  Home,
  ShieldCheck,
  Flag,
  ListChecks,
  Info,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import "./edit-service.css";

const LIMITS = {
  shortDescription: 150,
  whatsIncluded: 300,
  serviceDescription: 500,
  notes: 300,
};

const INITIAL_DATA = {
  serviceName: "Cockroach Control",
  serviceCategory: "General Pest Control",
  pestType: "Cockroach",
  serviceType: "Standard Treatment",
  shortDescription: "Effective cockroach control treatment for residential and commercial spaces.",
  price: "1,500",
  duration: "2 Hours",
  serviceFrequency: "One Time Service",
  applicableFor: "Residential",
  warrantyPeriod: "30 Days",
  priorityLevel: "Medium",
  whatsIncluded: "Gel application, surface spray, inspection, basic prevention tips",
  serviceDescription:
    "Our cockroach control service targets all types of cockroaches using safe and effective chemicals. It includes inspection, treatment, and prevention tips to keep your space cockroach-free.",
  notes: "Best results recommended with regular cleaning and moisture control.",
};

const REQUIRED_FIELDS = [
  "serviceName",
  "serviceCategory",
  "pestType",
  "serviceType",
  "shortDescription",
  "price",
  "duration",
  "applicableFor",
  "whatsIncluded",
  "serviceDescription",
];

export default function EditService({ onCancel, onUpdate }) {
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);

  const updateField = (field, value, limit) => {
    if (limit && value.length > limit) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const nextErrors = {};
    REQUIRED_FIELDS.forEach((field) => {
      if (!String(formData[field] || "").trim()) {
        nextErrors[field] = true;
      }
    });
    return nextErrors;
  };

  const handleCancel = () => {
    setFormData(INITIAL_DATA);
    setErrors({});
    setBanner(null);
    if (typeof onCancel === "function") {
      onCancel();
    } else if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    }
  };

  const handleUpdate = () => {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setBanner({ type: "error", text: "Please fill in all required fields before updating." });
      return;
    }

    setBanner({ type: "success", text: "Service updated successfully." });
    if (typeof onUpdate === "function") {
      onUpdate(formData);
    }
  };

  return (
    <div className="es-page">
      <nav className="es-breadcrumb" aria-label="Breadcrumb">
        <a href="#" className="es-breadcrumb-link">
          Admin
        </a>
        <ChevronRight size={14} className="es-breadcrumb-sep" />
        <a href="#" className="es-breadcrumb-link">
          Services
        </a>
        <ChevronRight size={14} className="es-breadcrumb-sep" />
        <span className="es-breadcrumb-current">Edit Service</span>
      </nav>

      <header className="es-header">
        <div className="es-header-left">
          <span className="es-header-icon">
            <SprayCan size={26} strokeWidth={2} />
          </span>
          <div>
            <h1 className="es-title">Edit Service</h1>
            <p className="es-subtitle">Update the service information and save your changes.</p>
          </div>
        </div>

        <div className="es-header-actions">
          <button type="button" className="es-btn es-btn-outline" onClick={handleCancel}>
            <X size={16} strokeWidth={2} />
            Cancel
          </button>
          <button type="button" className="es-btn es-btn-primary" onClick={handleUpdate}>
            <Save size={16} strokeWidth={2} />
            Update Service
          </button>
        </div>
      </header>

      {banner && (
        <div className={`es-banner ${banner.type === "success" ? "es-banner-success" : "es-banner-error"}`}>
          {banner.type === "success" ? (
            <CheckCircle2 size={16} strokeWidth={2} />
          ) : (
            <AlertTriangle size={16} strokeWidth={2} />
          )}
          <span>{banner.text}</span>
        </div>
      )}

      <section className="es-card">
        <div className="es-card-header">
          <span className="es-card-header-icon">
            <FileText size={18} strokeWidth={2} />
          </span>
          <h2 className="es-card-title">Basic Information</h2>
        </div>

        <div className="es-form-grid es-grid-3">
          <div className="es-form-field">
            <label className="es-form-label">
              Service Name <span className="es-required">*</span>
            </label>
            <div className={`es-input-wrap ${errors.serviceName ? "es-field-error" : ""}`}>
              <Tag size={16} className="es-input-icon" />
              <input
                type="text"
                className="es-input"
                placeholder="Enter service name"
                value={formData.serviceName}
                onChange={(e) => updateField("serviceName", e.target.value)}
              />
            </div>
          </div>

          <div className="es-form-field">
            <label className="es-form-label">
              Service Category <span className="es-required">*</span>
            </label>
            <div className={`es-select-wrap ${errors.serviceCategory ? "es-field-error" : ""}`}>
              <Grid3x3 size={16} className="es-input-icon" />
              <select
                value={formData.serviceCategory}
                onChange={(e) => updateField("serviceCategory", e.target.value)}
              >
                <option value="" disabled>
                  Select category
                </option>
                <option>General Pest Control</option>
                <option>Termite Control</option>
                <option>Fumigation</option>
                <option>Rodent Control</option>
              </select>
              <ChevronDown size={14} className="es-select-caret" />
            </div>
          </div>

          <div className="es-form-field">
            <label className="es-form-label">
              Pest Type <span className="es-required">*</span>
            </label>
            <div className={`es-select-wrap ${errors.pestType ? "es-field-error" : ""}`}>
              <Shield size={16} className="es-input-icon" />
              <select value={formData.pestType} onChange={(e) => updateField("pestType", e.target.value)}>
                <option value="" disabled>
                  Select pest type
                </option>
                <option>Cockroach</option>
                <option>Termite</option>
                <option>Rodent</option>
                <option>Mosquito</option>
                <option>Bed Bug</option>
              </select>
              <ChevronDown size={14} className="es-select-caret" />
            </div>
          </div>

          <div className="es-form-field">
            <label className="es-form-label">
              Service Type <span className="es-required">*</span>
            </label>
            <div className={`es-select-wrap ${errors.serviceType ? "es-field-error" : ""}`}>
              <Bug size={16} className="es-input-icon" />
              <select value={formData.serviceType} onChange={(e) => updateField("serviceType", e.target.value)}>
                <option value="" disabled>
                  Select service type
                </option>
                <option>Standard Treatment</option>
                <option>Deep Treatment</option>
                <option>Preventive Treatment</option>
              </select>
              <ChevronDown size={14} className="es-select-caret" />
            </div>
          </div>

          <div className="es-form-field es-field-span-2">
            <label className="es-form-label">
              Short Description <span className="es-required">*</span>
            </label>
            <div
              className={`es-input-wrap es-input-wrap-counted ${
                errors.shortDescription ? "es-field-error" : ""
              }`}
            >
              <input
                type="text"
                className="es-input es-input-no-icon"
                placeholder="Brief description about the service"
                maxLength={LIMITS.shortDescription}
                value={formData.shortDescription}
                onChange={(e) =>
                  updateField("shortDescription", e.target.value, LIMITS.shortDescription)
                }
              />
              <span className="es-char-count-inline">
                {formData.shortDescription.length}/{LIMITS.shortDescription}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="es-card">
        <div className="es-card-header">
          <span className="es-card-header-icon">
            <Boxes size={18} strokeWidth={2} />
          </span>
          <h2 className="es-card-title">Service Details</h2>
        </div>

        <div className="es-form-grid es-grid-3">
          <div className="es-form-field">
            <label className="es-form-label">
              Price (₹) <span className="es-required">*</span>
            </label>
            <div className={`es-input-wrap ${errors.price ? "es-field-error" : ""}`}>
              <IndianRupee size={16} className="es-input-icon" />
              <input
                type="text"
                className="es-input"
                placeholder="Enter price"
                value={formData.price}
                onChange={(e) => updateField("price", e.target.value)}
              />
            </div>
          </div>

          <div className="es-form-field">
            <label className="es-form-label">
              Duration <span className="es-required">*</span>
            </label>
            <div className={`es-select-wrap ${errors.duration ? "es-field-error" : ""}`}>
              <Clock size={16} className="es-input-icon" />
              <select value={formData.duration} onChange={(e) => updateField("duration", e.target.value)}>
                <option value="" disabled>
                  Select duration
                </option>
                <option>30 Minutes</option>
                <option>1 Hour</option>
                <option>2 Hours</option>
                <option>Half Day</option>
              </select>
              <ChevronDown size={14} className="es-select-caret" />
            </div>
          </div>

          <div className="es-form-field">
            <label className="es-form-label">Service Frequency</label>
            <div className="es-select-wrap">
              <Calendar size={16} className="es-input-icon" />
              <select
                value={formData.serviceFrequency}
                onChange={(e) => updateField("serviceFrequency", e.target.value)}
              >
                <option value="" disabled>
                  Select frequency
                </option>
                <option>One Time Service</option>
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
              <ChevronDown size={14} className="es-select-caret" />
            </div>
          </div>

          <div className="es-form-field">
            <label className="es-form-label">
              Applicable For <span className="es-required">*</span>
            </label>
            <div className={`es-select-wrap ${errors.applicableFor ? "es-field-error" : ""}`}>
              <Home size={16} className="es-input-icon" />
              <select
                value={formData.applicableFor}
                onChange={(e) => updateField("applicableFor", e.target.value)}
              >
                <option value="" disabled>
                  Select applicability
                </option>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Both</option>
              </select>
              <ChevronDown size={14} className="es-select-caret" />
            </div>
          </div>

          <div className="es-form-field">
            <label className="es-form-label">Warranty Period</label>
            <div className="es-select-wrap">
              <ShieldCheck size={16} className="es-input-icon" />
              <select
                value={formData.warrantyPeriod}
                onChange={(e) => updateField("warrantyPeriod", e.target.value)}
              >
                <option value="" disabled>
                  Select warranty
                </option>
                <option>No Warranty</option>
                <option>30 Days</option>
                <option>90 Days</option>
                <option>1 Year</option>
              </select>
              <ChevronDown size={14} className="es-select-caret" />
            </div>
          </div>

          <div className="es-form-field">
            <label className="es-form-label">Priority Level</label>
            <div className="es-select-wrap">
              <Flag size={16} className="es-input-icon" />
              <select
                value={formData.priorityLevel}
                onChange={(e) => updateField("priorityLevel", e.target.value)}
              >
                <option value="" disabled>
                  Select priority
                </option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <ChevronDown size={14} className="es-select-caret" />
            </div>
          </div>

          <div className="es-form-field es-field-span-3">
            <label className="es-form-label">
              What's Included <span className="es-required">*</span>
            </label>
            <div
              className={`es-input-wrap es-input-wrap-counted ${
                errors.whatsIncluded ? "es-field-error" : ""
              }`}
            >
              <ListChecks size={16} className="es-input-icon" />
              <input
                type="text"
                className="es-input"
                placeholder="List what is included in this service (chemicals, equipment, inspection, etc.)"
                maxLength={LIMITS.whatsIncluded}
                value={formData.whatsIncluded}
                onChange={(e) => updateField("whatsIncluded", e.target.value, LIMITS.whatsIncluded)}
              />
              <span className="es-char-count-inline">
                {formData.whatsIncluded.length}/{LIMITS.whatsIncluded}
              </span>
            </div>
          </div>

          <div className="es-form-field es-field-span-3">
            <label className="es-form-label">
              Service Description <span className="es-required">*</span>
            </label>
            <div
              className={`es-textarea-wrap ${errors.serviceDescription ? "es-field-error" : ""}`}
            >
              <PenLine size={16} className="es-textarea-icon" />
              <textarea
                className="es-textarea"
                placeholder="Enter detailed description about the service, process, benefits and precautions"
                maxLength={LIMITS.serviceDescription}
                value={formData.serviceDescription}
                onChange={(e) =>
                  updateField("serviceDescription", e.target.value, LIMITS.serviceDescription)
                }
              />
              <span className="es-char-count">
                {formData.serviceDescription.length}/{LIMITS.serviceDescription}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="es-card es-optional-card">
        <div className="es-card-header">
          <span className="es-card-header-icon es-icon-info">
            <Info size={18} strokeWidth={2} />
          </span>
          <h2 className="es-card-title">Additional Information (Optional)</h2>
        </div>

        <div className="es-form-field">
          <label className="es-form-label">Notes</label>
          <div className="es-input-wrap es-input-wrap-counted">
            <input
              type="text"
              className="es-input es-input-no-icon"
              placeholder="Add any additional notes or special instructions"
              maxLength={LIMITS.notes}
              value={formData.notes}
              onChange={(e) => updateField("notes", e.target.value, LIMITS.notes)}
            />
            <span className="es-char-count-inline">
              {formData.notes.length}/{LIMITS.notes}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}