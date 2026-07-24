import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ChevronDown,
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
  Image as ImageIcon,
  UploadCloud,
  Star,
  CheckCircle2,
} from "lucide-react";
import "./add-service.css";

const highlights = [
  "Add clear and descriptive service name",
  "Select the most relevant category and pest type",
  "Provide accurate pricing and duration",
  "Add what's included in the service",
  "Upload a high quality image for better visibility",
];

const LIMITS = {
  shortDescription: 150,
  whatsIncluded: 300,
  serviceDescription: 500,
  notes: 300,
};

export default function AddService() {
  const [shortDescription, setShortDescription] = useState("");
  const [whatsIncluded, setWhatsIncluded] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [imageName, setImageName] = useState(null);
  const navigate = useNavigate();


  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setImageName(file ? file.name : null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setImageName(file.name);
  };

  return (
    <div className="as-page">
      <nav className="as-breadcrumb" aria-label="Breadcrumb">
        <a href="#" className="as-breadcrumb-link">
          Admin
        </a>
        <ChevronRight size={14} className="as-breadcrumb-sep" />
        <a href="#" className="as-breadcrumb-link">
          Services
        </a>
        <ChevronRight size={14} className="as-breadcrumb-sep" />
        <span className="as-breadcrumb-current">Add Service</span>
      </nav>

      <header className="as-header">
        <div className="as-header-left">
          <span className="as-header-icon">
            <SprayCan size={26} strokeWidth={2} />
          </span>
          <div>
            <h1 className="as-title">Add Service</h1>
            <p className="as-subtitle">
              Create a new pest control service and add all required details.
            </p>
          </div>
        </div>

        <div className="as-header-actions">
          <button type="button" className="as-btn as-btn-outline" onClick={() => navigate("/admin/services")}>
            <X size={16} strokeWidth={2} />
            Cancel
          </button>
          <button type="button" className="as-btn as-btn-primary">
            <Save size={16} strokeWidth={2} />
            Save Service
          </button>
        </div>
      </header>

      <div className="as-layout">
        <div className="as-main-col">
          <section className="as-card">
            <div className="as-card-header">
              <span className="as-card-header-icon">
                <FileText size={18} strokeWidth={2} />
              </span>
              <h2 className="as-card-title">Basic Information</h2>
            </div>

            <div className="as-form-grid as-grid-3">
              <div className="as-form-field">
                <label className="as-form-label">
                  Service Name <span className="as-required">*</span>
                </label>
                <div className="as-input-wrap">
                  <Tag size={16} className="as-input-icon" />
                  <input type="text" className="as-input" placeholder="Enter service name" />
                </div>
              </div>

              <div className="as-form-field">
                <label className="as-form-label">
                  Service Category <span className="as-required">*</span>
                </label>
                <div className="as-select-wrap">
                  <Grid3x3 size={16} className="as-input-icon" />
                  <select defaultValue="">
                    <option value="" disabled>
                      Select category
                    </option>
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Industrial</option>
                  </select>
                  <ChevronDown size={14} className="as-select-caret" />
                </div>
              </div>

              <div className="as-form-field">
                <label className="as-form-label">
                  Pest Type <span className="as-required">*</span>
                </label>
                <div className="as-select-wrap">
                  <Shield size={16} className="as-input-icon" />
                  <select defaultValue="">
                    <option value="" disabled>
                      Select pest type
                    </option>
                    <option>Cockroach</option>
                    <option>Termite</option>
                    <option>Rodent</option>
                    <option>Mosquito</option>
                    <option>Bed Bug</option>
                  </select>
                  <ChevronDown size={14} className="as-select-caret" />
                </div>
              </div>

              <div className="as-form-field">
                <label className="as-form-label">
                  Service Type <span className="as-required">*</span>
                </label>
                <div className="as-select-wrap">
                  <Bug size={16} className="as-input-icon" />
                  <select defaultValue="">
                    <option value="" disabled>
                      Select service type
                    </option>
                    <option>General Pest Control</option>
                    <option>Termite Control</option>
                    <option>Fumigation</option>
                  </select>
                  <ChevronDown size={14} className="as-select-caret" />
                </div>
              </div>

              <div className="as-form-field as-field-span-2">
                <label className="as-form-label">
                  Short Description <span className="as-required">*</span>
                </label>
                <div className="as-input-wrap as-input-wrap-counted">
                  <PenLine size={16} className="as-input-icon" />
                  <input
                    type="text"
                    className="as-input"
                    placeholder="Brief description about the service"
                    maxLength={LIMITS.shortDescription}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                  />
                  <span className="as-char-count-inline">
                    {shortDescription.length}/{LIMITS.shortDescription}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="as-card">
            <div className="as-card-header">
              <span className="as-card-header-icon">
                <Boxes size={18} strokeWidth={2} />
              </span>
              <h2 className="as-card-title">Service Details</h2>
            </div>

            <div className="as-form-grid as-grid-3">
              <div className="as-form-field">
                <label className="as-form-label">
                  Price (₹) <span className="as-required">*</span>
                </label>
                <div className="as-input-wrap">
                  <IndianRupee size={16} className="as-input-icon" />
                  <input type="number" className="as-input" placeholder="Enter price" />
                </div>
              </div>

              <div className="as-form-field">
                <label className="as-form-label">
                  Duration <span className="as-required">*</span>
                </label>
                <div className="as-select-wrap">
                  <Clock size={16} className="as-input-icon" />
                  <select defaultValue="">
                    <option value="" disabled>
                      Select duration
                    </option>
                    <option>30 Minutes</option>
                    <option>1 Hour</option>
                    <option>2 Hours</option>
                    <option>Half Day</option>
                  </select>
                  <ChevronDown size={14} className="as-select-caret" />
                </div>
              </div>

              <div className="as-form-field">
                <label className="as-form-label">Service Frequency</label>
                <div className="as-select-wrap">
                  <Calendar size={16} className="as-input-icon" />
                  <select defaultValue="">
                    <option value="" disabled>
                      Select frequency
                    </option>
                    <option>One Time Service</option>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                  </select>
                  <ChevronDown size={14} className="as-select-caret" />
                </div>
              </div>

              <div className="as-form-field">
                <label className="as-form-label">
                  Applicable For <span className="as-required">*</span>
                </label>
                <div className="as-select-wrap">
                  <Home size={16} className="as-input-icon" />
                  <select defaultValue="">
                    <option value="" disabled>
                      Select applicability
                    </option>
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Both</option>
                  </select>
                  <ChevronDown size={14} className="as-select-caret" />
                </div>
              </div>

              <div className="as-form-field">
                <label className="as-form-label">Warranty Period</label>
                <div className="as-select-wrap">
                  <ShieldCheck size={16} className="as-input-icon" />
                  <select defaultValue="">
                    <option value="" disabled>
                      Select warranty
                    </option>
                    <option>No Warranty</option>
                    <option>30 Days</option>
                    <option>90 Days</option>
                    <option>1 Year</option>
                  </select>
                  <ChevronDown size={14} className="as-select-caret" />
                </div>
              </div>

              <div className="as-form-field">
                <label className="as-form-label">Priority Level</label>
                <div className="as-select-wrap">
                  <Flag size={16} className="as-input-icon" />
                  <select defaultValue="">
                    <option value="" disabled>
                      Select priority
                    </option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                  <ChevronDown size={14} className="as-select-caret" />
                </div>
              </div>

              <div className="as-form-field as-field-span-3">
                <label className="as-form-label">
                  What's Included <span className="as-required">*</span>
                </label>
                <div className="as-input-wrap as-input-wrap-counted">
                  <ListChecks size={16} className="as-input-icon" />
                  <input
                    type="text"
                    className="as-input"
                    placeholder="List what is included in this service (chemicals, equipment, inspection, etc.)"
                    maxLength={LIMITS.whatsIncluded}
                    value={whatsIncluded}
                    onChange={(e) => setWhatsIncluded(e.target.value)}
                  />
                  <span className="as-char-count-inline">
                    {whatsIncluded.length}/{LIMITS.whatsIncluded}
                  </span>
                </div>
              </div>

              <div className="as-form-field as-field-span-3">
                <label className="as-form-label">
                  Service Description <span className="as-required">*</span>
                </label>
                <div className="as-textarea-wrap">
                  <PenLine size={16} className="as-textarea-icon" />
                  <textarea
                    className="as-textarea"
                    placeholder="Enter detailed description about the service, process, benefits and precautions"
                    maxLength={LIMITS.serviceDescription}
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                  />
                  <span className="as-char-count">
                    {serviceDescription.length}/{LIMITS.serviceDescription}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="as-side-col">
          <section className="as-card">
            <div className="as-card-header">
              <span className="as-card-header-icon">
                <ImageIcon size={18} strokeWidth={2} />
              </span>
              <h2 className="as-card-title">Service Image</h2>
            </div>

            <div
              className="as-dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <UploadCloud size={40} strokeWidth={1.5} className="as-dropzone-icon" />
              <span className="as-dropzone-text">Drag &amp; drop an image here</span>
              <span className="as-dropzone-or">or</span>
              <label className="as-btn as-btn-outline as-choose-file-btn">
                Choose File
                <input type="file" accept="image/*" onChange={handleFileChange} hidden />
              </label>
              <span className="as-dropzone-hint">Recommended: 800x600px, JPG/PNG, Max 2MB</span>
            </div>

            <div className="as-preview-block">
              <span className="as-preview-label">Image Preview</span>
              <div className="as-preview-box">
                {imageName ? (
                  <span className="as-preview-filename">{imageName}</span>
                ) : (
                  <>
                    <SprayCan size={28} strokeWidth={1.5} className="as-preview-icon" />
                    <span className="as-preview-text">No image selected</span>
                  </>
                )}
              </div>
            </div>
          </section>

          <section className="as-card as-highlights-card">
            <div className="as-card-header">
              <span className="as-card-header-icon">
                <Star size={18} strokeWidth={2} />
              </span>
              <h2 className="as-card-title">Service Highlights</h2>
            </div>
            <ul className="as-highlights-list">
              {highlights.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={16} strokeWidth={2} className="as-highlight-check" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <section className="as-card as-optional-card">
        <div className="as-card-header">
          <span className="as-card-header-icon as-icon-info">
            <Info size={18} strokeWidth={2} />
          </span>
          <h2 className="as-card-title">Additional Information (Optional)</h2>
        </div>

        <div className="as-form-field">
          <label className="as-form-label">Notes</label>
          <div className="as-input-wrap as-input-wrap-counted">
            <input
              type="text"
              className="as-input"
              placeholder="Add any additional notes or special instructions"
              maxLength={LIMITS.notes}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <span className="as-char-count-inline">
              {notes.length}/{LIMITS.notes}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}