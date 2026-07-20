import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  User,
  Building2,
  Users,
  FileText,
  Mail,
  Phone,
  Globe,
  Calendar,
  CreditCard,
  MapPin,
  Home,
  Flag,
  Building,
  ShieldCheck,
  Bug,
  Clock,
  ChevronDown,
  X,
  Camera,
  UploadCloud,
  Trash2,
  MessageCircle,
  StickyNote,
} from "lucide-react";
import "./edit-customer.css";

const PEST_TYPE_OPTIONS = [
  "Cockroaches",
  "Termites",
  "Rodents",
  "Bed Bugs",
  "Mosquitoes",
  "Ants",
];

const initialForm = {
  customerType: "Corporate",
  customerName: "Green Future Solutions Pvt. Ltd.",
  customerGroup: "Premium Clients",
  gstNumber: "27AABCG1234D1Z5",
  panNumber: "AABCG1234D",
  email: "info@greenfuture.com",
  phone: "+91 98765 43210",
  alternateNumber: "+91 91234 56789",
  website: "www.greenfuture.com",
  customerSince: "2023-01-12",
  source: "Website Enquiry",
  billingPreference: "Monthly",
  address:
    "Eco Tower, 5th Floor, Sector 15,\nCBD Belapur, Navi Mumbai,\nMaharashtra - 400614",
  landmark: "Near Belapur Railway Station",
  city: "Navi Mumbai",
  state: "Maharashtra",
  pincode: "400614",
  serviceType: "General Pest Control",
  frequency: "Monthly",
  preferredTime: "10:00 AM - 02:00 PM",
  specialInstructions: "Access via main gate. Contact security before entry.",
  contactName: "Mr. Ramesh Sharma",
  designation: "Facility Manager",
  contactEmail: "ramesh.sharma@greenfuture.com",
  contactPhone: "+91 98765 43210",
  notes:
    "Prefers morning appointments.\nBuilding access allowed only with prior notice to security.\nContact Mr. Ramesh for any escalations.",
};

export default function EditCustomer() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [pestTypes, setPestTypes] = useState([
    "Cockroaches",
    "Termites",
    "Rodents",
  ]);
  const [uploadedFile, setUploadedFile] = useState({
    name: "logo.png",
    size: "120 KB",
  });
  const fileInputRef = useRef(null);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const removePestType = (type) => {
    setPestTypes((prev) => prev.filter((t) => t !== type));
  };

  const addPestType = (type) => {
    if (type && !pestTypes.includes(type)) {
      setPestTypes((prev) => [...prev, type]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const sizeKb = Math.round(file.size / 1024);
    setUploadedFile({ name: file.name, size: `${sizeKb} KB` });
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="edit-customer-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Customer</h1>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item">Customers</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item">Customer Details</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item breadcrumb-active">
              Edit Customer
            </span>
          </nav>
        </div>
        <div className="page-header-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate("/customer-details")}>
            <ArrowLeft size={16} />
            Back to Details
          </button>
          <button type="button" className="btn btn-primary">
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Main Layout: Form + Sidebar */}
      <div className="form-layout">
        {/* Left Column */}
        <div className="form-main">
          {/* Customer Information */}
          <section className="form-card">
            <div className="section-heading">
              <div className="section-icon">
                <User size={18} />
              </div>
              <h2 className="section-title">Customer Information</h2>
            </div>

            <div className="form-grid form-grid-3">
              <SelectField
                label="Customer Type"
                required
                icon={Building2}
                value={form.customerType}
                onChange={(v) => updateField("customerType", v)}
                options={["Corporate", "Residential", "Commercial", "Industrial"]}
              />
              <FormField
                label="Customer Name"
                required
                icon={User}
                value={form.customerName}
                onChange={(v) => updateField("customerName", v)}
              />
              <SelectField
                label="Customer Group"
                icon={Users}
                value={form.customerGroup}
                onChange={(v) => updateField("customerGroup", v)}
                options={["Standard", "Premium Clients", "VIP"]}
              />

              <FormField
                label="GST Number"
                icon={FileText}
                value={form.gstNumber}
                onChange={(v) => updateField("gstNumber", v)}
              />
              <FormField
                label="PAN Number"
                icon={FileText}
                value={form.panNumber}
                onChange={(v) => updateField("panNumber", v)}
              />
              <FormField
                label="Email Address"
                required
                icon={Mail}
                type="email"
                value={form.email}
                onChange={(v) => updateField("email", v)}
              />

              <FormField
                label="Phone Number"
                required
                icon={Phone}
                type="tel"
                value={form.phone}
                onChange={(v) => updateField("phone", v)}
              />
              <FormField
                label="Alternate Number"
                icon={Phone}
                type="tel"
                value={form.alternateNumber}
                onChange={(v) => updateField("alternateNumber", v)}
              />
              <FormField
                label="Website"
                icon={Globe}
                value={form.website}
                onChange={(v) => updateField("website", v)}
              />

              <FormField
                label="Customer Since"
                icon={Calendar}
                type="date"
                value={form.customerSince}
                onChange={(v) => updateField("customerSince", v)}
              />
              <SelectField
                label="Source"
                icon={Users}
                value={form.source}
                onChange={(v) => updateField("source", v)}
                options={["Website Enquiry", "Referral", "Google Search", "Walk-in"]}
              />
              <SelectField
                label="Billing Preference"
                icon={CreditCard}
                value={form.billingPreference}
                onChange={(v) => updateField("billingPreference", v)}
                options={["Monthly", "Quarterly", "Annually"]}
              />
            </div>
          </section>

          {/* Property / Location Details */}
          <section className="form-card">
            <div className="section-heading">
              <div className="section-icon">
                <MapPin size={18} />
              </div>
              <h2 className="section-title">Property / Location Details</h2>
            </div>

            <div className="form-grid form-grid-2">
              <TextareaField
                label="Address"
                required
                value={form.address}
                onChange={(v) => updateField("address", v)}
                rows={3}
              />
              <TextareaField
                label="Landmark"
                value={form.landmark}
                onChange={(v) => updateField("landmark", v)}
                rows={3}
              />
            </div>

            <div className="form-grid form-grid-3 grid-spaced-top">
              <FormField
                label="City"
                required
                icon={Building}
                value={form.city}
                onChange={(v) => updateField("city", v)}
              />
              <SelectField
                label="State"
                required
                icon={Flag}
                value={form.state}
                onChange={(v) => updateField("state", v)}
                options={["Maharashtra", "Karnataka", "Gujarat", "Delhi"]}
              />
              <FormField
                label="Pincode"
                required
                icon={MapPin}
                value={form.pincode}
                onChange={(v) => updateField("pincode", v)}
              />
            </div>
          </section>

          {/* Service Preferences */}
          <section className="form-card">
            <div className="section-heading">
              <div className="section-icon">
                <ShieldCheck size={18} />
              </div>
              <h2 className="section-title">Service Preferences</h2>
            </div>

            <div className="form-grid form-grid-4">
              <SelectField
                label="Preferred Service Type"
                value={form.serviceType}
                onChange={(v) => updateField("serviceType", v)}
                options={[
                  "General Pest Control",
                  "Termite Control",
                  "Rodent Control",
                  "Fumigation",
                ]}
              />

              <div className="form-field">
                <label className="field-label">Pest Type</label>
                <div className="tag-select-wrapper">
                  <div className="tag-list">
                    {pestTypes.map((type) => (
                      <span className="tag-chip" key={type}>
                        {type}
                        <button
                          type="button"
                          className="tag-remove"
                          aria-label={`Remove ${type}`}
                          onClick={() => removePestType(type)}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <select
                    className="tag-add-select"
                    value=""
                    onChange={(e) => addPestType(e.target.value)}
                  >
                    <option value="">+ Add</option>
                    {PEST_TYPE_OPTIONS.filter(
                      (option) => !pestTypes.includes(option)
                    ).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="input-chevron" />
                </div>
              </div>

              <SelectField
                label="Preferred Frequency"
                value={form.frequency}
                onChange={(v) => updateField("frequency", v)}
                options={["Weekly", "Bi-Weekly", "Monthly", "Quarterly"]}
              />
              <SelectField
                label="Preferred Time"
                icon={Clock}
                value={form.preferredTime}
                onChange={(v) => updateField("preferredTime", v)}
                options={[
                  "10:00 AM - 02:00 PM",
                  "08:00 AM - 12:00 PM",
                  "02:00 PM - 06:00 PM",
                ]}
              />
            </div>

            <div className="form-grid form-grid-1 grid-spaced-top">
              <TextareaField
                label="Special Instructions"
                value={form.specialInstructions}
                onChange={(v) => updateField("specialInstructions", v)}
                rows={2}
                maxLength={500}
                showCounter
              />
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar */}
        <div className="form-sidebar">
          {/* Customer Logo / Document */}
          <section className="form-card">
            <div className="section-heading">
              <div className="section-icon">
                <Camera size={18} />
              </div>
              <h2 className="section-title">Customer Logo / Document</h2>
            </div>

            <label className="upload-dropzone" htmlFor="edit-customer-file-upload">
              <UploadCloud size={30} className="upload-icon" />
              <span className="upload-title">
                Drag and drop or click to upload
              </span>
              <span className="upload-subtitle">
                Upload logo, license, or any document
              </span>
              <span className="upload-meta">PNG, JPG, PDF up to 5MB</span>
              <input
                id="edit-customer-file-upload"
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                hidden
              />
            </label>

            {uploadedFile && (
              <div className="uploaded-file-row">
                <div className="uploaded-file-thumb">
                  <span className="uploaded-file-thumb-text">GREEN</span>
                </div>
                <div className="uploaded-file-info">
                  <span className="uploaded-file-name">{uploadedFile.name}</span>
                  <span className="uploaded-file-size">{uploadedFile.size}</span>
                </div>
                <button
                  type="button"
                  className="uploaded-file-remove"
                  aria-label="Remove file"
                  onClick={handleRemoveFile}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}
          </section>

          {/* Additional Notes */}
          <section className="form-card">
            <div className="section-heading">
              <div className="section-icon">
                <StickyNote size={18} />
              </div>
              <h2 className="section-title">Additional Notes</h2>
            </div>

            <TextareaField
              value={form.notes}
              onChange={(v) => updateField("notes", v)}
              rows={5}
              maxLength={500}
              showCounter
              bare
            />
          </section>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  icon: Icon,
  type = "text",
  value,
  onChange,
}) {
  return (
    <div className="form-field">
      {label && (
        <label className="field-label">
          {label} {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {Icon && <Icon size={15} className="input-icon" />}
        <input
          type={type}
          className="text-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function SelectField({ label, required, icon: Icon, value, onChange, options }) {
  return (
    <div className="form-field">
      {label && (
        <label className="field-label">
          {label} {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {Icon && <Icon size={15} className="input-icon" />}
        <select
          className="text-input select-native"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown size={15} className="input-chevron" />
      </div>
    </div>
  );
}

function TextareaField({
  label,
  required,
  value,
  onChange,
  rows = 3,
  maxLength,
  showCounter,
  bare,
}) {
  return (
    <div className={`form-field ${bare ? "form-field-bare" : ""}`}>
      {label && (
        <label className="field-label">
          {label} {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <div className="textarea-wrapper">
        <textarea
          className="area-input"
          rows={rows}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {showCounter && (
          <span className="textarea-counter">
            {value.length} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
}