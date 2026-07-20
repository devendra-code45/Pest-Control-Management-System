import React, { useState } from "react";
import {
  X,
  Save,
  Briefcase,
  Tag,
  LayoutGrid,
  Bug,
  Clock,
  DollarSign,
  ShieldCheck,
  FileText,
  UploadCloud,
  Eye,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";
import "./edit-service.css";

const CATEGORIES = [
  "Termite Control",
  "General Pest Control",
  "Rodent Control",
  "Bed Bug Control",
  "Mosquito Control",
];

const PEST_TYPES = ["Termites", "Cockroaches", "Rodents", "Bed Bugs", "Mosquitoes", "Ants", "Spiders"];

const DURATIONS = ["Under 1 Hour", "1 - 2 Hours", "2 - 3 Hours", "2 - 4 Hours", "Half Day", "Full Day"];

const TIPS = [
  "Keep the service name clear and specific.",
  "Provide accurate duration for better scheduling.",
  "Set competitive pricing for your services.",
  "Use high quality image for better presentation.",
];

const EXISTING_SERVICE = {
  name: "Termite Treatment",
  category: "Termite Control",
  pestType: "Termites",
  duration: "2 - 3 Hours",
  price: "150.00",
  status: "Active",
  shortDescription: "Comprehensive termite inspection and treatment to protect your property.",
  detailedDescription:
    "Our termite treatment service includes a thorough inspection of the property, identification of termite activity, and application of effective treatment methods to eliminate termites and prevent future infestations.",
  image:
    "https://images.unsplash.com/photo-1632934558790-3ba54a5f2c4c?auto=format&fit=crop&w=400&q=60",
};

export default function EditService() {
  const [form, setForm] = useState(EXISTING_SERVICE);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((f) => ({ ...f, image: URL.createObjectURL(file) }));
    }
  };

  const removeImage = () => setForm((f) => ({ ...f, image: null }));

  return (
    <div className="edit-service-page">
      <div className="esp-breadcrumb">
        <span className="crumb-active">Dashboard</span>
        <span className="crumb-sep">›</span>
        <span>Services</span>
        <span className="crumb-sep">›</span>
        <span>Edit Service</span>
      </div>

      <div className="esp-header">
        <div>
          <h1>Edit Service</h1>
          <p>Update the service details and information.</p>
        </div>
        <div className="esp-header-actions">
          <button className="btn btn-outline">
            <X size={18} />
            Cancel
          </button>
          <button className="btn btn-primary">
            <Save size={18} />
            Update Service
          </button>
        </div>
      </div>

      <div className="esp-grid">
        <div className="esp-card">
          <div className="card-title">
            <span className="card-icon">
              <Briefcase size={18} />
            </span>
            Service Information
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>
                Service Name<span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <Tag size={16} />
                <input type="text" value={form.name} onChange={update("name")} />
              </div>
            </div>

            <div className="form-field">
              <label>
                Category<span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <LayoutGrid size={16} />
                <select value={form.category} onChange={update("category")}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-field">
              <label>
                Pest Type (Applicable)<span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <Bug size={16} />
                <select value={form.pestType} onChange={update("pestType")}>
                  {PEST_TYPES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-field">
              <label>
                Service Duration<span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <Clock size={16} />
                <select value={form.duration} onChange={update("duration")}>
                  {DURATIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-field">
              <label>
                Price (USD)<span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <DollarSign size={16} />
                <input type="number" value={form.price} onChange={update("price")} />
              </div>
            </div>

            <div className="form-field">
              <label>
                Service Status<span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <ShieldCheck size={16} />
                <select value={form.status} onChange={update("status")}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="form-field form-field-full">
              <label>
                Short Description<span className="required">*</span>
              </label>
              <div className="input-with-icon textarea-wrap">
                <FileText size={16} />
                <textarea
                  rows={2}
                  maxLength={150}
                  value={form.shortDescription}
                  onChange={update("shortDescription")}
                />
                <span className="char-count">{form.shortDescription.length}/150</span>
              </div>
            </div>

            <div className="form-field form-field-full">
              <label>
                Detailed Description<span className="required">*</span>
              </label>
              <div className="input-with-icon textarea-wrap">
                <FileText size={16} />
                <textarea
                  rows={5}
                  maxLength={1000}
                  value={form.detailedDescription}
                  onChange={update("detailedDescription")}
                />
                <span className="char-count">{form.detailedDescription.length}/1000</span>
              </div>
            </div>

            <div className="form-field form-field-full">
              <label>Service Image (Optional)</label>
              {form.image ? (
                <div className="dropzone dropzone-filled">
                  <UploadCloud size={24} />
                  <div>
                    <strong>Drag and drop an image here or click to upload</strong>
                    <span>JPG, PNG or WEBP (Max. 2MB)</span>
                  </div>
                  <div className="image-preview-wrap">
                    <img src={form.image} alt="Service" className="dropzone-preview" />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={removeImage}
                      aria-label="Remove image"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <input
                    id="edit-service-image"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    hidden
                    onChange={handleImageUpload}
                  />
                </div>
              ) : (
                <label className="dropzone" htmlFor="edit-service-image">
                  <UploadCloud size={28} />
                  <div>
                    <strong>Drag and drop an image here or click to upload</strong>
                    <span>JPG, PNG or WEBP (Max. 2MB)</span>
                  </div>
                  <input
                    id="edit-service-image"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    hidden
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="esp-side">
          <div className="esp-card">
            <div className="card-title">
              <span className="card-icon">
                <Eye size={18} />
              </span>
              Service Preview
            </div>

            <div className="preview-avatar">
              <Bug size={48} />
            </div>

            <div className="preview-rows">
              <div className="preview-row">
                <span>Service Name</span>
                <span>{form.name || "-"}</span>
              </div>
              <div className="preview-row">
                <span>Category</span>
                <span>{form.category || "-"}</span>
              </div>
              <div className="preview-row">
                <span>Pest Type</span>
                <span>{form.pestType || "-"}</span>
              </div>
              <div className="preview-row">
                <span>Duration</span>
                <span>{form.duration || "-"}</span>
              </div>
              <div className="preview-row">
                <span>Price</span>
                <span>{form.price ? `$${Number(form.price).toFixed(2)}` : "-"}</span>
              </div>
              <div className="preview-row">
                <span>Status</span>
                <span
                  className={`status-badge ${
                    form.status === "Active" ? "status-active" : "status-inactive"
                  }`}
                >
                  {form.status}
                </span>
              </div>
            </div>
          </div>

          <div className="esp-card">
            <div className="card-title">
              <span className="card-icon">
                <Lightbulb size={18} />
              </span>
              Tips
            </div>
            <ul className="tips-list">
              {TIPS.map((tip) => (
                <li key={tip}>
                  <CheckCircle2 size={16} />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}