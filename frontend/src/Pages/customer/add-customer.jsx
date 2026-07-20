import React, { useState, useRef } from "react";
import {
  X,
  Save,
  UserPlus,
  Building2,
  MapPin,
  ShieldCheck,
  ChevronDown,
  IdCard,
  User,
  Building,
  FileText,
  Mail,
  Phone,
  Globe,
  Calendar,
  Users,
  Home,
  BookOpen,
  Flag,
  Landmark,
  UploadCloud,
  Trash2,
  Bug,
  Clock,
  Camera,
  StickyNote,
  Settings,
} from "lucide-react";
import "./add-customer.css";

const TOP_SELECTORS = [
  {
    id: "customerType",
    icon: Building2,
    label: "Customer Type",
    placeholder: "Select customer type",
    options: ["Residential", "Commercial", "Industrial"],
  },
  {
    id: "serviceArea",
    icon: MapPin,
    label: "Service Area",
    placeholder: "Select service area",
    options: ["San Jose, CA", "Santa Clara, CA", "Fremont, CA"],
  },
  {
    id: "customerGroup",
    icon: ShieldCheck,
    label: "Customer Group",
    placeholder: "Select customer group",
    options: ["Standard", "Premium", "VIP"],
  },
];

const initialFormState = {
  customerName: "",
  companyName: "",
  gstNumber: "",
  email: "",
  phone: "",
  alternateNumber: "",
  website: "",
  customerSince: "",
  source: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  serviceType: "",
  pestType: "",
  frequency: "",
  preferredTime: "",
  contactName: "",
  designation: "",
  contactNumber: "",
  contactEmail: "",
  notes: "",
};

export default function AddCustomer() {
  const [topSelectors, setTopSelectors] = useState({
    customerType: "",
    serviceArea: "",
    customerGroup: "",
  });
  const [form, setForm] = useState(initialFormState);
  const [uploadedFile, setUploadedFile] = useState({
    name: "logo.png",
    size: "120 KB",
  });
  const [settings, setSettings] = useState({
    sendWelcomeEmail: true,
    addToNewsletter: true,
  });
  const fileInputRef = useRef(null);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateTopSelector = (field, value) => {
    setTopSelectors((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
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
    <div className="add-customer-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-icon">
            <UserPlus size={22} />
          </div>
          <div>
            <h1 className="page-title">Add Customer</h1>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <span className="breadcrumb-item">Home</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item">Customers</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item breadcrumb-active">
                Add Customer
              </span>
            </nav>
          </div>
        </div>

        <div className="page-header-actions">
          <button type="button" className="btn btn-outline">
            <X size={16} />
            Cancel
          </button>
          <button type="button" className="btn btn-primary">
            <Save size={16} />
            Save Customer
          </button>
        </div>
      </div>

      {/* Top Selector Row */}
      <div className="top-selectors">
        {TOP_SELECTORS.map((selector) => {
          const Icon = selector.icon;
          return (
            <div className="top-selector-card" key={selector.id}>
              <div className="top-selector-icon">
                <Icon size={20} />
              </div>
              <div className="top-selector-body">
                <span className="top-selector-label">{selector.label}</span>
                <div className="select-wrapper">
                  <select
                    className="top-selector-select"
                    value={topSelectors[selector.id]}
                    onChange={(e) =>
                      updateTopSelector(selector.id, e.target.value)
                    }
                  >
                    <option value="">{selector.placeholder}</option>
                    {selector.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="select-chevron" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Layout: Form + Sidebar */}
      <div className="form-layout">
        {/* Left Column: Form Sections */}
        <div className="form-main">
          {/* Customer Information */}
          <section className="form-card">
            <div className="section-heading">
              <div className="section-icon">
                <IdCard size={18} />
              </div>
              <h2 className="section-title">Customer Information</h2>
            </div>

            <div className="form-grid form-grid-3">
              <FormField
                label="Customer Name"
                required
                icon={User}
                placeholder="Enter customer name"
                value={form.customerName}
                onChange={(v) => updateField("customerName", v)}
              />
              <FormField
                label="Company Name"
                icon={Building}
                placeholder="Enter company name"
                value={form.companyName}
                onChange={(v) => updateField("companyName", v)}
              />
              <FormField
                label="GST Number"
                icon={FileText}
                placeholder="Enter GST number"
                value={form.gstNumber}
                onChange={(v) => updateField("gstNumber", v)}
              />

              <FormField
                label="Email Address"
                required
                icon={Mail}
                type="email"
                placeholder="Enter email address"
                value={form.email}
                onChange={(v) => updateField("email", v)}
              />
              <FormField
                label="Phone Number"
                required
                icon={Phone}
                type="tel"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={(v) => updateField("phone", v)}
              />
              <FormField
                label="Alternate Number"
                icon={Phone}
                type="tel"
                placeholder="Enter alternate number"
                value={form.alternateNumber}
                onChange={(v) => updateField("alternateNumber", v)}
              />

              <FormField
                label="Website"
                icon={Globe}
                placeholder="Enter website (optional)"
                value={form.website}
                onChange={(v) => updateField("website", v)}
              />
              <FormField
                label="Customer Since"
                icon={Calendar}
                type="date"
                placeholder="Select date"
                value={form.customerSince}
                onChange={(v) => updateField("customerSince", v)}
              />
              <SelectField
                label="Source"
                icon={Users}
                placeholder="Select source"
                value={form.source}
                onChange={(v) => updateField("source", v)}
                options={["Referral", "Google Search", "Social Media", "Walk-in"]}
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

            <div className="form-grid form-grid-3">
              <FormField
                label="Address Line 1"
                required
                icon={Home}
                placeholder="Enter address line 1"
                value={form.addressLine1}
                onChange={(v) => updateField("addressLine1", v)}
              />
              <FormField
                label="Address Line 2"
                icon={BookOpen}
                placeholder="Enter address line 2 (optional)"
                value={form.addressLine2}
                onChange={(v) => updateField("addressLine2", v)}
              />
              <FormField
                label="Landmark"
                icon={Flag}
                placeholder="Enter landmark (optional)"
                value={form.landmark}
                onChange={(v) => updateField("landmark", v)}
              />

              <FormField
                label="City"
                required
                icon={Building}
                placeholder="Enter city"
                value={form.city}
                onChange={(v) => updateField("city", v)}
              />
              <SelectField
                label="State"
                required
                icon={BookOpen}
                placeholder="Select state"
                value={form.state}
                onChange={(v) => updateField("state", v)}
                options={["California", "Nevada", "Arizona", "Oregon"]}
              />
              <FormField
                label="Pincode"
                required
                icon={Landmark}
                placeholder="Enter pincode"
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
                placeholder="Select service type"
                value={form.serviceType}
                onChange={(v) => updateField("serviceType", v)}
                options={["One-time", "Monthly", "Quarterly", "Annual Contract"]}
              />
              <SelectField
                label="Pest Type"
                icon={Bug}
                placeholder="Select pest type"
                value={form.pestType}
                onChange={(v) => updateField("pestType", v)}
                options={["Termites", "Rodents", "Cockroaches", "Bed Bugs", "Mosquitoes"]}
              />
              <SelectField
                label="Preferred Frequency"
                placeholder="Select frequency"
                value={form.frequency}
                onChange={(v) => updateField("frequency", v)}
                options={["Weekly", "Bi-Weekly", "Monthly", "Quarterly"]}
              />
              <SelectField
                label="Preferred Time"
                icon={Clock}
                placeholder="Select preferred time"
                value={form.preferredTime}
                onChange={(v) => updateField("preferredTime", v)}
                options={["Morning", "Afternoon", "Evening"]}
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

            <label className="upload-dropzone" htmlFor="customer-file-upload">
              <UploadCloud size={30} className="upload-icon" />
              <span className="upload-title">
                Drag and drop or click to upload
              </span>
              <span className="upload-subtitle">
                Upload logo, license, or any document
              </span>
              <span className="upload-meta">PNG, JPG, PDF up to 5MB</span>
              <input
                id="customer-file-upload"
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
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="form-field">
      <label className="field-label">
        {label} {required && <span className="required-asterisk">*</span>}
      </label>
      <div className="input-wrapper">
        {Icon && <Icon size={15} className="input-icon" />}
        <input
          type={type}
          className="text-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  required,
  icon: Icon,
  placeholder,
  value,
  onChange,
  options,
}) {
  return (
    <div className="form-field">
      <label className="field-label">
        {label} {required && <span className="required-asterisk">*</span>}
      </label>
      <div className="input-wrapper">
        {Icon && <Icon size={15} className="input-icon" />}
        <select
          className="text-input select-native"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
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