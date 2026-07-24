import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  MessageSquare,
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  UploadCloud,
  X,
  ShieldCheck,
  Send,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import "./newcomplaint.css";

const DESCRIPTION_LIMIT = 500;
const MAX_IMAGES = 5;

const INITIAL_FORM = {
  bookingId: "",
  complaintCategory: "",
  complaintType: "",
  preferredDate: "",
  preferredContactMethod: "Phone Call",
  preferredContactNumber: "",
  emailAddress: "",
  description: "",
};

const REQUIRED_FIELDS = [
  "bookingId",
  "complaintCategory",
  "complaintType",
  "preferredContactMethod",
  "preferredContactNumber",
  "description",
];

export default function RaiseNewComplaint({ onBack, onSubmit }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);
  const fileInputRef = useRef(null);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (banner) setBanner(null);
  };

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []).slice(0, MAX_IMAGES - images.length);
    const newImages = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, MAX_IMAGES));
  };

  const handleFileInputChange = (e) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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

  const handleSubmit = () => {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setBanner({ type: "error", text: "Please fill in all required fields before submitting." });
      return;
    }

    setBanner({ type: "success", text: "Your complaint has been submitted successfully." });
    if (typeof onSubmit === "function") {
      onSubmit({ ...formData, images });
    }
  };

  const handleCancel = () => {
    setFormData(INITIAL_FORM);
    setImages([]);
    setErrors({});
    setBanner(null);
    if (typeof onBack === "function") {
      onBack();
    }
  };

  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
    } else if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    }
  };

  const navigate = useNavigate();

  return (
    <div className="rnc-page">
      <nav className="rnc-breadcrumb" aria-label="Breadcrumb">
        <a href="#" className="rnc-breadcrumb-link">
          Dashboard
        </a>
        <ChevronRight size={14} className="rnc-breadcrumb-sep" />
        <a href="#" className="rnc-breadcrumb-link">
          Complaints
        </a>
        <ChevronRight size={14} className="rnc-breadcrumb-sep" />
        <span className="rnc-breadcrumb-current">Raise New Complaint</span>
      </nav>

      <header className="rnc-header">
        <div className="rnc-header-left">
          <span className="rnc-header-icon">
            <MessageSquare size={26} strokeWidth={2} />
          </span>
          <div>
            <h1 className="rnc-title">Raise New Complaint</h1>
            <p className="rnc-subtitle">Submit your complaint and our team will take the necessary action.</p>
          </div>
        </div>

        <button type="button" className="rnc-btn rnc-btn-outline" onClick={handleBack}>
          <ArrowLeft size={16} strokeWidth={2} />
          Back to My Complaints
        </button>
      </header>

      <section className="rnc-card">
        <div className="rnc-card-heading">
          <h2 className="rnc-card-title">Complaint Information</h2>
        </div>

        {banner && (
          <div className={`rnc-banner ${banner.type === "success" ? "rnc-banner-success" : "rnc-banner-error"}`}>
            {banner.type === "success" ? (
              <CheckCircle2 size={16} strokeWidth={2} />
            ) : (
              <AlertTriangle size={16} strokeWidth={2} />
            )}
            <span>{banner.text}</span>
          </div>
        )}

        <div className="rnc-form-grid">
          <div className="rnc-form-field">
            <label className="rnc-form-label">
              Booking ID <span className="rnc-required">*</span>
            </label>
            <div className={`rnc-select-wrap ${errors.bookingId ? "rnc-field-error" : ""}`}>
              <select
                value={formData.bookingId}
                onChange={(e) => updateField("bookingId", e.target.value)}
              >
                <option value="">Select your booking</option>
                <option>BK-2025-0102</option>
                <option>BK-2025-0098</option>
                <option>BK-2025-0092</option>
                <option>BK-2025-0088</option>
                <option>BK-2025-0080</option>
              </select>
              <ChevronDown size={14} className="rnc-select-caret" />
            </div>
          </div>

          <div className="rnc-form-field">
            <label className="rnc-form-label">
              Complaint Category <span className="rnc-required">*</span>
            </label>
            <div className={`rnc-select-wrap ${errors.complaintCategory ? "rnc-field-error" : ""}`}>
              <select
                value={formData.complaintCategory}
                onChange={(e) => updateField("complaintCategory", e.target.value)}
              >
                <option value="">Select category</option>
                <option>Pest Still Exists</option>
                <option>Service Quality</option>
                <option>Technician Behavior</option>
                <option>Late Visit</option>
                <option>Payment Issue</option>
                <option>Other</option>
              </select>
              <ChevronDown size={14} className="rnc-select-caret" />
            </div>
          </div>

          <div className="rnc-form-field">
            <label className="rnc-form-label">
              Complaint Type <span className="rnc-required">*</span>
            </label>
            <div className={`rnc-select-wrap ${errors.complaintType ? "rnc-field-error" : ""}`}>
              <select
                value={formData.complaintType}
                onChange={(e) => updateField("complaintType", e.target.value)}
              >
                <option value="">Select type</option>
                <option>Termite Treatment</option>
                <option>Cockroach Control</option>
                <option>General Pest Control</option>
                <option>Mosquito Control</option>
                <option>Rodent Control</option>
              </select>
              <ChevronDown size={14} className="rnc-select-caret" />
            </div>
          </div>

          <div className="rnc-form-field">
            <label className="rnc-form-label">Preferred Date for Follow-up</label>
            <div className="rnc-input-wrap">
              <Calendar size={16} className="rnc-input-icon" />
              <input
                type="date"
                className="rnc-input"
                value={formData.preferredDate}
                onChange={(e) => updateField("preferredDate", e.target.value)}
              />
            </div>
          </div>

          <div className="rnc-form-field">
            <label className="rnc-form-label">
              Preferred Contact Method <span className="rnc-required">*</span>
            </label>
            <div className="rnc-select-wrap">
              <Phone size={16} className="rnc-input-icon" />
              <select
                value={formData.preferredContactMethod}
                onChange={(e) => updateField("preferredContactMethod", e.target.value)}
                className="rnc-select-with-icon"
              >
                <option>Phone Call</option>
                <option>Email</option>
                <option>WhatsApp</option>
                <option>SMS</option>
              </select>
              <ChevronDown size={14} className="rnc-select-caret" />
            </div>
          </div>

          <div className="rnc-form-field">
            <label className="rnc-form-label">
              Preferred Contact Number <span className="rnc-required">*</span>
            </label>
            <div className={`rnc-input-wrap ${errors.preferredContactNumber ? "rnc-field-error" : ""}`}>
              <Phone size={16} className="rnc-input-icon" />
              <input
                type="tel"
                className="rnc-input"
                placeholder="Enter phone number"
                value={formData.preferredContactNumber}
                onChange={(e) => updateField("preferredContactNumber", e.target.value)}
              />
            </div>
          </div>

          <div className="rnc-form-field">
            <label className="rnc-form-label">Email Address</label>
            <div className="rnc-input-wrap">
              <Mail size={16} className="rnc-input-icon" />
              <input
                type="email"
                className="rnc-input"
                placeholder="Enter email (optional)"
                value={formData.emailAddress}
                onChange={(e) => updateField("emailAddress", e.target.value)}
              />
            </div>
          </div>

          <div className="rnc-form-field rnc-field-span-3">
            <label className="rnc-form-label">
              Description of Issue <span className="rnc-required">*</span>
            </label>
            <div className={`rnc-textarea-wrap ${errors.description ? "rnc-field-error" : ""}`}>
              <textarea
                className="rnc-textarea"
                placeholder="Describe your issue in detail..."
                maxLength={DESCRIPTION_LIMIT}
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
              <span className="rnc-char-count">
                {formData.description.length}/{DESCRIPTION_LIMIT}
              </span>
            </div>
          </div>

          <div className="rnc-form-field rnc-field-span-3">
            <label className="rnc-form-label">Upload Images (Optional)</label>
            <div
              className="rnc-dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={32} strokeWidth={1.5} className="rnc-dropzone-icon" />
              <span className="rnc-dropzone-text">
                <span className="rnc-dropzone-link">Click to upload</span> or drag and drop
              </span>
              <span className="rnc-dropzone-hint">PNG, JPG, JPEG up to 5MB</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                multiple
                hidden
                onChange={handleFileInputChange}
              />
            </div>

            {images.length > 0 && (
              <div className="rnc-image-preview-row">
                {images.map((img, index) => (
                  <div className="rnc-image-thumb" key={img.url}>
                    <img src={img.url} alt={img.name} />
                    <button
                      type="button"
                      className="rnc-image-remove"
                      onClick={() => removeImage(index)}
                      aria-label="Remove image"
                    >
                      <X size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rnc-info-note">
          <ShieldCheck size={16} strokeWidth={2} />
          <span>Your complaint will be reviewed by our team and we will get back to you as soon as possible.</span>
        </div>

        <div className="rnc-form-actions">
          <button type="button" className="rnc-btn rnc-btn-primary" onClick={handleSubmit}>
            <Send size={16} strokeWidth={2} />
            Submit Complaint
          </button>
          <button type="button" className="rnc-btn rnc-btn-outline" onClick={() => navigate("/customer/complaints")}>
            <X size={16} strokeWidth={2} />
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
}