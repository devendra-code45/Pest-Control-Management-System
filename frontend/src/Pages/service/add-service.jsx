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
  LoaderCircle,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import api from "../../api/axios";
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

const initialForm = {
  serviceName: "",
  serviceCategory: "",
  pestType: "",
  serviceType: "",
  shortDescription: "",
  price: "",
  duration: "",
  frequency: "",
  applicableFor: "",
  warrantyPeriod: "",
  priorityLevel: "",
  whatsIncluded: "",
  serviceDescription: "",
  notes: "",
};

const getErrorMessage = (error) => {
  const data = error.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data?.message) return data.message;
  if (data?.error) return data.error;

  if (data && typeof data === "object") {
    const firstMessage = Object.values(data).find(
      (value) => typeof value === "string"
    );

    if (firstMessage) return firstMessage;
  }

  if (!error.response) {
    return "Unable to connect to the backend.";
  }

  return "Unable to add service.";
};

export default function AddService() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [imageName, setImageName] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const updateField = (field) => (event) => {
    const { value } = event.target;

    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));

    setRequestError("");
    setSuccess("");
  };

  const processImage = (file) => {
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setRequestError("Only JPG, JPEG and PNG images are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setRequestError("Service image must be smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImageName(file.name);
      setImagePreview(String(reader.result || ""));
      setRequestError("");
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (event) => {
    processImage(event.target.files?.[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    processImage(event.dataTransfer.files?.[0]);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.serviceName.trim()) {
      newErrors.serviceName = "Service name is required.";
    }

    if (!form.serviceCategory) {
      newErrors.serviceCategory = "Service category is required.";
    }

    if (!form.pestType) {
      newErrors.pestType = "Pest type is required.";
    }

    if (!form.serviceType) {
      newErrors.serviceType = "Service type is required.";
    }

    if (!form.shortDescription.trim()) {
      newErrors.shortDescription = "Short description is required.";
    }

    if (form.price === "") {
      newErrors.price = "Price is required.";
    } else if (Number(form.price) < 0) {
      newErrors.price = "Price cannot be negative.";
    }

    if (!form.duration) {
      newErrors.duration = "Duration is required.";
    }

    if (!form.applicableFor) {
      newErrors.applicableFor = "Applicability is required.";
    }

    if (!form.whatsIncluded.trim()) {
      newErrors.whatsIncluded = "Included items are required.";
    }

    if (!form.serviceDescription.trim()) {
      newErrors.serviceDescription =
        "Service description is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    /*
     * The current Spring Boot ServiceRequest stores:
     * name, category, description, duration, price and active.
     *
     * Service Type is used as the table category because the
     * Services page groups rows by pest-control service type.
     */
    const payload = {
      name: form.serviceName.trim(),
      category: form.serviceType,
      description: form.shortDescription.trim(),
      duration: form.duration,
      price: Number(form.price),
      active: true,
      serviceImage: imagePreview || null,
    };

    try {
      setSaving(true);
      setRequestError("");
      setSuccess("");

      await api.post("/admin/services", payload);

      setSuccess("Service added successfully.");

      window.setTimeout(() => {
        navigate("/admin/services");
      }, 700);
    } catch (error) {
      setRequestError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="as-page">
      <nav className="as-breadcrumb" aria-label="Breadcrumb">
        <button
          type="button"
          className="as-breadcrumb-link as-breadcrumb-button"
          onClick={() => navigate("/admin/dashboard")}
        >
          Admin
        </button>

        <ChevronRight size={14} className="as-breadcrumb-sep" />

        <button
          type="button"
          className="as-breadcrumb-link as-breadcrumb-button"
          onClick={() => navigate("/admin/services")}
        >
          Services
        </button>

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
          <button
            type="button"
            className="as-btn as-btn-outline"
            onClick={() => navigate("/admin/services")}
            disabled={saving}
          >
            <X size={16} strokeWidth={2} />
            Cancel
          </button>

          <button
            type="submit"
            form="add-service-form"
            className="as-btn as-btn-primary"
            disabled={saving}
          >
            {saving ? (
              <LoaderCircle size={16} className="as-loading-icon" />
            ) : (
              <Save size={16} strokeWidth={2} />
            )}

            {saving ? "Saving..." : "Save Service"}
          </button>
        </div>
      </header>

      {requestError && (
        <div className="as-message as-message-error">
          <AlertCircle size={17} />
          {requestError}
        </div>
      )}

      {success && (
        <div className="as-message as-message-success">
          <CheckCircle size={17} />
          {success}
        </div>
      )}

      <form id="add-service-form" onSubmit={handleSubmit}>
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

                    <input
                      type="text"
                      className={`as-input ${
                        errors.serviceName ? "as-input-error" : ""
                      }`}
                      placeholder="Enter service name"
                      value={form.serviceName}
                      onChange={updateField("serviceName")}
                    />
                  </div>

                  {errors.serviceName && (
                    <span className="as-field-error">
                      {errors.serviceName}
                    </span>
                  )}
                </div>

                <div className="as-form-field">
                  <label className="as-form-label">
                    Service Category <span className="as-required">*</span>
                  </label>

                  <div className="as-select-wrap">
                    <Grid3x3 size={16} className="as-input-icon" />

                    <select
                      value={form.serviceCategory}
                      onChange={updateField("serviceCategory")}
                      className={
                        errors.serviceCategory ? "as-input-error" : ""
                      }
                    >
                      <option value="">Select category</option>
                      <option>Residential</option>
                      <option>Commercial</option>
                      <option>Industrial</option>
                    </select>

                    <ChevronDown size={14} className="as-select-caret" />
                  </div>

                  {errors.serviceCategory && (
                    <span className="as-field-error">
                      {errors.serviceCategory}
                    </span>
                  )}
                </div>

                <div className="as-form-field">
                  <label className="as-form-label">
                    Pest Type <span className="as-required">*</span>
                  </label>

                  <div className="as-select-wrap">
                    <Shield size={16} className="as-input-icon" />

                    <select
                      value={form.pestType}
                      onChange={updateField("pestType")}
                      className={errors.pestType ? "as-input-error" : ""}
                    >
                      <option value="">Select pest type</option>
                      <option>Cockroach</option>
                      <option>Termite</option>
                      <option>Rodent</option>
                      <option>Mosquito</option>
                      <option>Bed Bug</option>
                    </select>

                    <ChevronDown size={14} className="as-select-caret" />
                  </div>

                  {errors.pestType && (
                    <span className="as-field-error">
                      {errors.pestType}
                    </span>
                  )}
                </div>

                <div className="as-form-field">
                  <label className="as-form-label">
                    Service Type <span className="as-required">*</span>
                  </label>

                  <div className="as-select-wrap">
                    <Bug size={16} className="as-input-icon" />

                    <select
                      value={form.serviceType}
                      onChange={updateField("serviceType")}
                      className={errors.serviceType ? "as-input-error" : ""}
                    >
                      <option value="">Select service type</option>
                      <option>General Pest Control</option>
                      <option>Termite Control</option>
                      <option>Rodent Control</option>
                      <option>Bed Bug Control</option>
                      <option>Mosquito Control</option>
                      <option>Fumigation</option>
                    </select>

                    <ChevronDown size={14} className="as-select-caret" />
                  </div>

                  {errors.serviceType && (
                    <span className="as-field-error">
                      {errors.serviceType}
                    </span>
                  )}
                </div>

                <div className="as-form-field as-field-span-2">
                  <label className="as-form-label">
                    Short Description <span className="as-required">*</span>
                  </label>

                  <div className="as-input-wrap as-input-wrap-counted">
                    <PenLine size={16} className="as-input-icon" />

                    <input
                      type="text"
                      className={`as-input ${
                        errors.shortDescription ? "as-input-error" : ""
                      }`}
                      placeholder="Brief description about the service"
                      maxLength={LIMITS.shortDescription}
                      value={form.shortDescription}
                      onChange={updateField("shortDescription")}
                    />

                    <span className="as-char-count-inline">
                      {form.shortDescription.length}/
                      {LIMITS.shortDescription}
                    </span>
                  </div>

                  {errors.shortDescription && (
                    <span className="as-field-error">
                      {errors.shortDescription}
                    </span>
                  )}
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

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className={`as-input ${
                        errors.price ? "as-input-error" : ""
                      }`}
                      placeholder="Enter price"
                      value={form.price}
                      onChange={updateField("price")}
                    />
                  </div>

                  {errors.price && (
                    <span className="as-field-error">
                      {errors.price}
                    </span>
                  )}
                </div>

                <div className="as-form-field">
                  <label className="as-form-label">
                    Duration <span className="as-required">*</span>
                  </label>

                  <div className="as-select-wrap">
                    <Clock size={16} className="as-input-icon" />

                    <select
                      value={form.duration}
                      onChange={updateField("duration")}
                      className={errors.duration ? "as-input-error" : ""}
                    >
                      <option value="">Select duration</option>
                      <option>30 Minutes</option>
                      <option>1 Hour</option>
                      <option>1 - 2 Hours</option>
                      <option>2 - 3 Hours</option>
                      <option>2 - 4 Hours</option>
                      <option>Half Day</option>
                    </select>

                    <ChevronDown size={14} className="as-select-caret" />
                  </div>

                  {errors.duration && (
                    <span className="as-field-error">
                      {errors.duration}
                    </span>
                  )}
                </div>

                <div className="as-form-field">
                  <label className="as-form-label">Service Frequency</label>

                  <div className="as-select-wrap">
                    <Calendar size={16} className="as-input-icon" />

                    <select
                      value={form.frequency}
                      onChange={updateField("frequency")}
                    >
                      <option value="">Select frequency</option>
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

                    <select
                      value={form.applicableFor}
                      onChange={updateField("applicableFor")}
                      className={
                        errors.applicableFor ? "as-input-error" : ""
                      }
                    >
                      <option value="">Select applicability</option>
                      <option>Residential</option>
                      <option>Commercial</option>
                      <option>Both</option>
                    </select>

                    <ChevronDown size={14} className="as-select-caret" />
                  </div>

                  {errors.applicableFor && (
                    <span className="as-field-error">
                      {errors.applicableFor}
                    </span>
                  )}
                </div>

                <div className="as-form-field">
                  <label className="as-form-label">Warranty Period</label>

                  <div className="as-select-wrap">
                    <ShieldCheck size={16} className="as-input-icon" />

                    <select
                      value={form.warrantyPeriod}
                      onChange={updateField("warrantyPeriod")}
                    >
                      <option value="">Select warranty</option>
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

                    <select
                      value={form.priorityLevel}
                      onChange={updateField("priorityLevel")}
                    >
                      <option value="">Select priority</option>
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
                      className={`as-input ${
                        errors.whatsIncluded ? "as-input-error" : ""
                      }`}
                      placeholder="List what is included in this service"
                      maxLength={LIMITS.whatsIncluded}
                      value={form.whatsIncluded}
                      onChange={updateField("whatsIncluded")}
                    />

                    <span className="as-char-count-inline">
                      {form.whatsIncluded.length}/{LIMITS.whatsIncluded}
                    </span>
                  </div>

                  {errors.whatsIncluded && (
                    <span className="as-field-error">
                      {errors.whatsIncluded}
                    </span>
                  )}
                </div>

                <div className="as-form-field as-field-span-3">
                  <label className="as-form-label">
                    Service Description <span className="as-required">*</span>
                  </label>

                  <div className="as-textarea-wrap">
                    <PenLine size={16} className="as-textarea-icon" />

                    <textarea
                      className={`as-textarea ${
                        errors.serviceDescription ? "as-input-error" : ""
                      }`}
                      placeholder="Enter detailed description about the service"
                      maxLength={LIMITS.serviceDescription}
                      value={form.serviceDescription}
                      onChange={updateField("serviceDescription")}
                    />

                    <span className="as-char-count">
                      {form.serviceDescription.length}/
                      {LIMITS.serviceDescription}
                    </span>
                  </div>

                  {errors.serviceDescription && (
                    <span className="as-field-error">
                      {errors.serviceDescription}
                    </span>
                  )}
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
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
              >
                <UploadCloud
                  size={40}
                  strokeWidth={1.5}
                  className="as-dropzone-icon"
                />

                <span className="as-dropzone-text">
                  Drag &amp; drop an image here
                </span>

                <span className="as-dropzone-or">or</span>

                <label className="as-btn as-btn-outline as-choose-file-btn">
                  Choose File

                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    hidden
                  />
                </label>

                <span className="as-dropzone-hint">
                  Recommended: 800x600px, JPG/PNG, Max 2MB
                </span>
              </div>

              <div className="as-preview-block">
                <span className="as-preview-label">Image Preview</span>

                <div className="as-preview-box">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt={imageName || "Service preview"}
                      className="as-preview-image"
                    />
                  ) : (
                    <>
                      <SprayCan
                        size={28}
                        strokeWidth={1.5}
                        className="as-preview-icon"
                      />

                      <span className="as-preview-text">
                        No image selected
                      </span>
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
                    <CheckCircle2
                      size={16}
                      strokeWidth={2}
                      className="as-highlight-check"
                    />

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

            <h2 className="as-card-title">
              Additional Information (Optional)
            </h2>
          </div>

          <div className="as-form-field">
            <label className="as-form-label">Notes</label>

            <div className="as-input-wrap as-input-wrap-counted">
              <input
                type="text"
                className="as-input"
                placeholder="Add additional notes or special instructions"
                maxLength={LIMITS.notes}
                value={form.notes}
                onChange={updateField("notes")}
              />

              <span className="as-char-count-inline">
                {form.notes.length}/{LIMITS.notes}
              </span>
            </div>
          </div>
        </section>

        <div className="as-bottom-actions">
          <button
            type="button"
            className="as-btn as-btn-outline"
            onClick={() => navigate("/admin/services")}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="as-btn as-btn-primary"
            disabled={saving}
          >
            {saving ? (
              <LoaderCircle size={16} className="as-loading-icon" />
            ) : (
              <Save size={16} />
            )}

            {saving ? "Saving..." : "Save Service"}
          </button>
        </div>
      </form>
    </div>
  );
}