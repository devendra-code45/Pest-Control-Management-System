import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Home,
  ChevronRight,
  ArrowLeft,
  Save,
  User,
  MapPin,
  Briefcase,
  Phone,
  Image as ImageIcon,
  Info,
  ShieldCheck,
  Mail,
  Calendar,
  IdCard,
  Users,
  Building2,
  Award,
  Droplet,
  Home as HomeIcon,
  Building,
  MapPinned,
  Globe2,
  Hash,
  Wrench,
  Star,
  Compass,
  Clock,
  FileText,
  CalendarClock,
  Car,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";
import "./AddTechnician.css";

/* Reusable field wrapper with icon + label */
const FieldInput = ({
  label,
  required,
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
}) => (
  <div className="at-field">
    <label className="at-label">
      {label} {required && <span className="at-required">*</span>}
    </label>
    <div className="at-input-wrap">
      {Icon && <Icon size={16} className="at-input-icon" />}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="at-input"
      />
    </div>
  </div>
);

const FieldSelect = ({
  label,
  required,
  icon: Icon,
  placeholder,
  value,
  onChange,
  name,
  options = [],
}) => (
  <div className="at-field">
    <label className="at-label">
      {label} {required && <span className="at-required">*</span>}
    </label>
    <div className="at-input-wrap">
      {Icon && <Icon size={16} className="at-input-icon" />}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="at-input at-select"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronRight size={15} className="at-select-caret" />
    </div>
  </div>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="at-section-header">
    <span className="at-section-icon">
      <Icon size={17} />
    </span>
    <h3>{title}</h3>
  </div>
);

export default function AddTechnician() {
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState("Active");
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="at-page">
      {/* Breadcrumb */}
      <div className="at-breadcrumb">
        <Home size={14} />
        <span>Home</span>
        <ChevronRight size={13} className="at-crumb-sep" />
        <span>Technicians</span>
        <ChevronRight size={13} className="at-crumb-sep" />
        <span>Management</span>
        <ChevronRight size={13} className="at-crumb-sep" />
        <span className="at-crumb-active">Add Technician</span>
      </div>

      {/* Page Header */}
      <div className="at-page-header">
        <div>
          <h1 className="at-title">Add Technician</h1>
          <p className="at-subtitle">
            Create a new technician profile and add details.
          </p>
        </div>
        <div className="at-header-actions">
          <button type="button" className="at-btn at-btn-primary">
            <Save size={16} />
            Save Technician
          </button>
        </div>
      </div>

      {/* Body Grid */}
      <div className="at-grid">
        {/* LEFT COLUMN */}
        <div className="at-col at-col-main">
          {/* Personal Information */}
          <div className="at-card">
            <SectionHeader icon={User} title="Personal Information" />
            <div className="at-form-grid at-cols-4">
              <FieldInput
                label="First Name"
                required
                icon={User}
                placeholder="Enter first name"
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleChange}
              />
              <FieldInput
                label="Last Name"
                required
                icon={User}
                placeholder="Enter last name"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
              />
              <FieldInput
                label="Employee ID"
                required
                icon={IdCard}
                placeholder="Enter employee ID"
                name="employeeId"
                value={formData.employeeId || ""}
                onChange={handleChange}
              />
              <FieldInput
                label="Phone Number"
                required
                icon={Phone}
                placeholder="Enter phone number"
                name="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={handleChange}
              />

              <FieldInput
                label="Email Address"
                required
                icon={Mail}
                placeholder="Enter email address"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
              />
              <FieldInput
                label="Date of Birth"
                required
                icon={Calendar}
                type="date"
                placeholder="Select date"
                name="dob"
                value={formData.dob || ""}
                onChange={handleChange}
              />
              <FieldSelect
                label="Gender"
                required
                icon={Users}
                placeholder="Select gender"
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                options={["Male", "Female", "Other"]}
              />
              <FieldSelect
                label="Blood Group"
                icon={Droplet}
                placeholder="Select blood group"
                name="bloodGroup"
                value={formData.bloodGroup || ""}
                onChange={handleChange}
                options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
              />

              <FieldInput
                label="Joining Date"
                required
                icon={Calendar}
                type="date"
                placeholder="Select date"
                name="joiningDate"
                value={formData.joiningDate || ""}
                onChange={handleChange}
              />
              <FieldSelect
                label="Department"
                required
                icon={Building2}
                placeholder="Select department"
                name="department"
                value={formData.department || ""}
                onChange={handleChange}
                options={["Residential Pest Control", "Commercial Services", "Termite Control", "Fumigation"]}
              />
              <FieldSelect
                label="Designation"
                required
                icon={Award}
                placeholder="Select designation"
                name="designation"
                value={formData.designation || ""}
                onChange={handleChange}
                options={["Technician", "Senior Technician", "Team Lead", "Supervisor"]}
              />
              <FieldSelect
                label="Reporting Manager"
                icon={User}
                placeholder="Select manager"
                name="reportingManager"
                value={formData.reportingManager || ""}
                onChange={handleChange}
                options={["Ramesh Iyer", "Sunita Rao", "Vikram Shah"]}
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="at-card">
            <SectionHeader icon={MapPin} title="Address Information" />
            <div className="at-form-grid at-cols-1">
              <FieldInput
                label="Street Address"
                required
                icon={HomeIcon}
                placeholder="Enter street address"
                name="street"
                value={formData.street || ""}
                onChange={handleChange}
              />
            </div>
            <div className="at-form-grid at-cols-3">
              <FieldInput
                label="City"
                required
                icon={Building}
                placeholder="Enter city"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
              />
              <FieldSelect
                label="State"
                required
                icon={MapPinned}
                placeholder="Select state"
                name="state"
                value={formData.state || ""}
                onChange={handleChange}
                options={["Maharashtra", "Karnataka", "Gujarat", "Delhi"]}
              />
              <FieldInput
                label="ZIP / Postal Code"
                required
                icon={Hash}
                placeholder="Enter ZIP / Postal code"
                name="zip"
                value={formData.zip || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Professional Details */}
          <div className="at-card">
            <SectionHeader icon={Briefcase} title="Professional Details" />
            <div className="at-form-grid at-cols-4">
              <FieldInput
                label="Experience (Years)"
                required
                icon={Clock}
                type="number"
                placeholder="Enter years of experience"
                name="experience"
                value={formData.experience || ""}
                onChange={handleChange}
              />
              <FieldSelect
                label="Primary Skill"
                required
                icon={Wrench}
                placeholder="Select primary skill"
                name="primarySkill"
                value={formData.primarySkill || ""}
                onChange={handleChange}
                options={["General Pest Control", "Termite Treatment", "Rodent Control", "Fumigation"]}
              />
              <FieldSelect
                label="Secondary Skill"
                icon={Star}
                placeholder="Select secondary skill"
                name="secondarySkill"
                value={formData.secondarySkill || ""}
                onChange={handleChange}
                options={["Bird Control", "Wood Borer Treatment", "Sanitization"]}
              />
              <FieldSelect
                label="Region"
                required
                icon={Compass}
                placeholder="Select region"
                name="region"
                value={formData.region || ""}
                onChange={handleChange}
                options={["North Zone", "South Zone", "East Zone", "West Zone"]}
              />

              <FieldSelect
                label="Shift"
                required
                icon={Clock}
                placeholder="Select shift"
                name="shift"
                value={formData.shift || ""}
                onChange={handleChange}
                options={["Morning", "Afternoon", "Evening", "Night"]}
              />
              <FieldInput
                label="License / Certification No."
                icon={FileText}
                placeholder="Enter license or certification no."
                name="licenseNo"
                value={formData.licenseNo || ""}
                onChange={handleChange}
              />
              <FieldInput
                label="License Expiry Date"
                icon={CalendarClock}
                type="date"
                placeholder="Select expiry date"
                name="licenseExpiry"
                value={formData.licenseExpiry || ""}
                onChange={handleChange}
              />
              <FieldInput
                label="Vehicle Number"
                icon={Car}
                placeholder="Enter vehicle number"
                name="vehicleNumber"
                value={formData.vehicleNumber || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="at-card">
            <SectionHeader icon={Phone} title="Emergency Contact" />
            <div className="at-form-grid at-cols-3">
              <FieldInput
                label="Contact Name"
                required
                icon={User}
                placeholder="Enter contact name"
                name="emergencyName"
                value={formData.emergencyName || ""}
                onChange={handleChange}
              />
              <FieldSelect
                label="Relation"
                required
                icon={Users}
                placeholder="Select relation"
                name="relation"
                value={formData.relation || ""}
                onChange={handleChange}
                options={["Parent", "Spouse", "Sibling", "Friend"]}
              />
              <FieldInput
                label="Phone Number"
                required
                icon={Phone}
                placeholder="Enter phone number"
                name="emergencyPhone"
                value={formData.emergencyPhone || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="at-col at-col-side">
          {/* Profile Photo */}
          <div className="at-card">
            <SectionHeader icon={ImageIcon} title="Profile Photo" />
            <div
              className="at-dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={26} className="at-dropzone-icon" />
              <p className="at-dropzone-text">Drag &amp; drop an image here</p>
              <span className="at-dropzone-or">or</span>
              <button type="button" className="at-btn at-btn-primary at-btn-sm">
                Browse File
              </button>
              <p className="at-dropzone-hint">JPG, PNG or JPEG (Max. 2MB)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                hidden
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />
              <div className="at-avatar-preview">
                {photoPreview ? (
                  <img src={photoPreview} alt="Technician preview" />
                ) : (
                  <User size={34} />
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="at-card">
            <SectionHeader icon={Info} title="Additional Information" />
            <div className="at-field">
              <label className="at-label">Notes</label>
              <textarea
                className="at-textarea"
                name="notes"
                placeholder="Enter any additional notes..."
                value={formData.notes || ""}
                onChange={handleChange}
                rows={4}
              />
            </div>
            <div className="at-field">
              <label className="at-label">
                Status <span className="at-required">*</span>
              </label>
              <div className="at-input-wrap">
                <span
                  className={`at-status-dot ${
                    status === "Active" ? "is-active" : "is-inactive"
                  }`}
                />
                <select
                  className="at-input at-select at-status-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
                <ChevronRight size={15} className="at-select-caret" />
              </div>
            </div>
          </div>

          {/* Quick Guidelines */}
          <div className="at-card at-guidelines">
            <SectionHeader icon={ShieldCheck} title="Quick Guidelines" />
            <ul className="at-guideline-list">
              <li>
                <CheckCircle2 size={15} />
                <span>All fields marked with * are mandatory.</span>
              </li>
              <li>
                <CheckCircle2 size={15} />
                <span>Ensure phone number and email are valid.</span>
              </li>
              <li>
                <CheckCircle2 size={15} />
                <span>Upload a clear profile photo.</span>
              </li>
              <li>
                <CheckCircle2 size={15} />
                <span>
                  Technician will be able to access the mobile app after
                  account activation.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sticky bottom action bar */}
      <div className="at-footer-actions">
        <button type="button" className="at-btn at-btn-outline" onClick={() => navigate("/admin/technicians")}>
          Cancel
        </button>
        <button type="button" className="at-btn at-btn-primary">
          <Save size={16} />
          Save Technician
        </button>
      </div>
    </div>
  );
}