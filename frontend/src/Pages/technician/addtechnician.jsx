import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  ChevronRight,
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
  Users,
  Home as HomeIcon,
  Building,
  MapPinned,
  Hash,
  Wrench,
  Star,
  Clock,
  UploadCloud,
  CheckCircle2,
  LoaderCircle,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import api from "../../api/axios";
import "./AddTechnician.css";

const initialFormData = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  dob: "",
  gender: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  experience: "",
  primarySkill: "",
  secondarySkill: "",
  emergencyName: "",
  relation: "",
  emergencyPhone: "",
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

  return "Unable to add technician.";
};

const FieldInput = ({
  label,
  required,
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  error,
  maxLength,
  min,
  max,
}) => (
  <div className="at-field">
    <label className="at-label" htmlFor={name}>
      {label} {required && <span className="at-required">*</span>}
    </label>

    <div className="at-input-wrap">
      {Icon && <Icon size={16} className="at-input-icon" />}

      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`at-input ${error ? "at-input-error" : ""}`}
        maxLength={maxLength}
        min={min}
        max={max}
      />
    </div>

    {error && <span className="at-field-error">{error}</span>}
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
  error,
}) => (
  <div className="at-field">
    <label className="at-label" htmlFor={name}>
      {label} {required && <span className="at-required">*</span>}
    </label>

    <div className="at-input-wrap">
      {Icon && <Icon size={16} className="at-input-icon" />}

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`at-input at-select ${
          error ? "at-input-error" : ""
        }`}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronRight size={15} className="at-select-caret" />
    </div>

    {error && <span className="at-field-error">{error}</span>}
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
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState("Active");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setRequestError("");
    setSuccess("");
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setRequestError("Only JPG, JPEG or PNG images are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setRequestError("Profile photo must be smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPhotoPreview(reader.result);
      setRequestError("");
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFileSelect(event.dataTransfer.files?.[0]);
  };

  const validateForm = () => {
    const newErrors = {};
    const phonePattern = /^\d{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const zipPattern = /^\d{6}$/;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!phonePattern.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Enter a valid 10-digit phone number.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailPattern.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required.";
    } else {
      const selectedDate = new Date(`${formData.dob}T00:00:00`);
      const today = new Date();

      if (
        Number.isNaN(selectedDate.getTime()) ||
        selectedDate >= today
      ) {
        newErrors.dob = "Enter a valid past date.";
      }
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required.";
    }

    if (!formData.street.trim()) {
      newErrors.street = "Street address is required.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required.";
    }

    if (!formData.zip.trim()) {
      newErrors.zip = "Postal code is required.";
    } else if (!zipPattern.test(formData.zip.trim())) {
      newErrors.zip = "Enter a valid 6-digit postal code.";
    }

    if (formData.experience === "") {
      newErrors.experience = "Experience is required.";
    } else {
      const experience = Number(formData.experience);

      if (
        !Number.isInteger(experience) ||
        experience < 0 ||
        experience > 50
      ) {
        newErrors.experience =
          "Experience must be a whole number from 0 to 50.";
      }
    }

    if (!formData.primarySkill.trim()) {
      newErrors.primarySkill = "Primary skill is required.";
    }

    if (!formData.emergencyName.trim()) {
      newErrors.emergencyName = "Contact name is required.";
    }

    if (!formData.relation.trim()) {
      newErrors.relation = "Relationship is required.";
    }

    if (!formData.emergencyPhone.trim()) {
      newErrors.emergencyPhone = "Emergency phone is required.";
    } else if (!phonePattern.test(formData.emergencyPhone.trim())) {
      newErrors.emergencyPhone =
        "Enter a valid 10-digit emergency phone number.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;

    const address = [
      formData.street.trim(),
      formData.city.trim(),
      formData.state.trim(),
      formData.zip.trim(),
    ].join(", ");

    const specialization = [
      formData.primarySkill.trim(),
      formData.secondarySkill.trim(),
    ]
      .filter(Boolean)
      .join(", ");

    const payload = {
      fullName,
      email: formData.email.trim(),
      phone: formData.phoneNumber.trim(),
      dateOfBirth: formData.dob,
      gender: formData.gender,
      profilePhoto: photoPreview || null,
      address,
      specialization,
      experienceYears: Number(formData.experience),
      emergencyContact: formData.emergencyPhone.trim(),
      emergencyContactName: formData.emergencyName.trim(),
      emergencyContactPhone: formData.emergencyPhone.trim(),
      emergencyContactRelationship: formData.relation.trim(),
    };

    try {
      setSaving(true);
      setRequestError("");
      setSuccess("");

      const response = await api.post(
        "/admin/technicians",
        payload
      );

      if (status === "Inactive" && response.data?.id) {
        await api.delete(
          `/admin/technicians/${response.data.id}`
        );
      }

      setSuccess("Technician added successfully.");

      window.setTimeout(() => {
        navigate("/admin/technicians");
      }, 700);
    } catch (error) {
      setRequestError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="at-page">
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

      <div className="at-page-header">
        <div>
          <h1 className="at-title">Add Technician</h1>

          <p className="at-subtitle">
            Create a new technician profile and add details.
          </p>
        </div>

        <div className="at-header-actions">
          <button
            type="submit"
            form="add-technician-form"
            className="at-btn at-btn-primary"
            disabled={saving}
          >
            {saving ? (
              <LoaderCircle size={16} className="at-loading-icon" />
            ) : (
              <Save size={16} />
            )}

            {saving ? "Saving..." : "Save Technician"}
          </button>
        </div>
      </div>

      {requestError && (
        <div className="at-message at-message-error">
          <AlertCircle size={17} />
          {requestError}
        </div>
      )}

      {success && (
        <div className="at-message at-message-success">
          <CheckCircle size={17} />
          {success}
        </div>
      )}

      <form id="add-technician-form" onSubmit={handleSubmit}>
        <div className="at-grid">
          <div className="at-col at-col-main">
            <div className="at-card">
              <SectionHeader icon={User} title="Personal Information" />

              <div className="at-form-grid at-cols-2">
                <FieldInput
                  label="First Name"
                  required
                  icon={User}
                  placeholder="Enter first name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                />

                <FieldInput
                  label="Last Name"
                  required
                  icon={User}
                  placeholder="Enter last name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                />

                <FieldInput
                  label="Phone Number"
                  required
                  icon={Phone}
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  error={errors.phoneNumber}
                  maxLength={10}
                />

                <FieldInput
                  label="Email Address"
                  required
                  icon={Mail}
                  type="email"
                  placeholder="Enter email address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />

                <FieldInput
                  label="Date of Birth"
                  required
                  icon={Calendar}
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  error={errors.dob}
                />

                <FieldSelect
                  label="Gender"
                  required
                  icon={Users}
                  placeholder="Select gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  error={errors.gender}
                  options={["Male", "Female", "Other"]}
                />
              </div>
            </div>

            <div className="at-card">
              <SectionHeader icon={MapPin} title="Address Information" />

              <div className="at-form-grid at-cols-1">
                <FieldInput
                  label="Street Address"
                  required
                  icon={HomeIcon}
                  placeholder="Enter street address"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  error={errors.street}
                />
              </div>

              <div className="at-form-grid at-cols-3">
                <FieldInput
                  label="City"
                  required
                  icon={Building}
                  placeholder="Enter city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                />

                <FieldSelect
                  label="State"
                  required
                  icon={MapPinned}
                  placeholder="Select state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  error={errors.state}
                  options={[
                    "Maharashtra",
                    "Karnataka",
                    "Gujarat",
                    "Delhi",
                    "Madhya Pradesh",
                    "Rajasthan",
                    "Uttar Pradesh",
                  ]}
                />

                <FieldInput
                  label="ZIP / Postal Code"
                  required
                  icon={Hash}
                  placeholder="Enter postal code"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  error={errors.zip}
                  maxLength={6}
                />
              </div>
            </div>

            <div className="at-card">
              <SectionHeader
                icon={Briefcase}
                title="Professional Details"
              />

              <div className="at-form-grid at-cols-3">
                <FieldInput
                  label="Experience (Years)"
                  required
                  icon={Clock}
                  type="number"
                  placeholder="Enter experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  error={errors.experience}
                  min={0}
                  max={50}
                />

                <FieldSelect
                  label="Primary Skill"
                  required
                  icon={Wrench}
                  placeholder="Select primary skill"
                  name="primarySkill"
                  value={formData.primarySkill}
                  onChange={handleChange}
                  error={errors.primarySkill}
                  options={[
                    "General Pest Control",
                    "Termite Treatment",
                    "Rodent Control",
                    "Fumigation",
                    "Bed Bug Treatment",
                    "Cockroach Control",
                  ]}
                />

                <FieldSelect
                  label="Secondary Skill"
                  icon={Star}
                  placeholder="Select secondary skill"
                  name="secondarySkill"
                  value={formData.secondarySkill}
                  onChange={handleChange}
                  options={[
                    "Bird Control",
                    "Wood Borer Treatment",
                    "Sanitization",
                    "General Pest Control",
                    "Termite Treatment",
                    "Rodent Control",
                  ]}
                />
              </div>
            </div>

            <div className="at-card">
              <SectionHeader icon={Phone} title="Emergency Contact" />

              <div className="at-form-grid at-cols-3">
                <FieldInput
                  label="Contact Name"
                  required
                  icon={User}
                  placeholder="Enter contact name"
                  name="emergencyName"
                  value={formData.emergencyName}
                  onChange={handleChange}
                  error={errors.emergencyName}
                />

                <FieldSelect
                  label="Relationship"
                  required
                  icon={Users}
                  placeholder="Select relationship"
                  name="relation"
                  value={formData.relation}
                  onChange={handleChange}
                  error={errors.relation}
                  options={[
                    "Parent",
                    "Spouse",
                    "Sibling",
                    "Friend",
                    "Guardian",
                    "Other",
                  ]}
                />

                <FieldInput
                  label="Phone Number"
                  required
                  icon={Phone}
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  error={errors.emergencyPhone}
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          <div className="at-col at-col-side">
            <div className="at-card">
              <SectionHeader icon={ImageIcon} title="Profile Photo" />

              <div
                className="at-dropzone"
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud size={26} className="at-dropzone-icon" />

                <p className="at-dropzone-text">
                  Drag &amp; drop an image here
                </p>

                <span className="at-dropzone-or">or</span>

                <button
                  type="button"
                  className="at-btn at-btn-primary at-btn-sm"
                >
                  Browse File
                </button>

                <p className="at-dropzone-hint">
                  JPG, PNG or JPEG (Max. 2MB)
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg"
                  hidden
                  onChange={(event) =>
                    handleFileSelect(event.target.files?.[0])
                  }
                />

                <div className="at-avatar-preview">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Technician preview"
                    />
                  ) : (
                    <User size={34} />
                  )}
                </div>
              </div>

              <p className="at-photo-note">
                The selected photo will be saved with the technician profile.
              </p>
            </div>

            <div className="at-card">
              <SectionHeader icon={Info} title="Account Status" />

              <div className="at-field">
                <label className="at-label">
                  Status <span className="at-required">*</span>
                </label>

                <div className="at-input-wrap">
                  <span
                    className={`at-status-dot ${
                      status === "Active"
                        ? "is-active"
                        : "is-inactive"
                    }`}
                  />

                  <select
                    className="at-input at-select at-status-select"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>

                  <ChevronRight
                    size={15}
                    className="at-select-caret"
                  />
                </div>
              </div>
            </div>

            <div className="at-card at-guidelines">
              <SectionHeader
                icon={ShieldCheck}
                title="Quick Guidelines"
              />

              <ul className="at-guideline-list">
                <li>
                  <CheckCircle2 size={15} />
                  <span>All fields marked with * are mandatory.</span>
                </li>

                <li>
                  <CheckCircle2 size={15} />
                  <span>Phone numbers must contain exactly 10 digits.</span>
                </li>

                <li>
                  <CheckCircle2 size={15} />
                  <span>Email and phone must be unique.</span>
                </li>

                <li>
                  <CheckCircle2 size={15} />
                  <span>
                    A new active technician will be available for assignment.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="at-footer-actions">
          <button
            type="button"
            className="at-btn at-btn-outline"
            onClick={() => navigate("/admin/technicians")}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="at-btn at-btn-primary"
            disabled={saving}
          >
            {saving ? (
              <LoaderCircle size={16} className="at-loading-icon" />
            ) : (
              <Save size={16} />
            )}

            {saving ? "Saving..." : "Save Technician"}
          </button>
        </div>
      </form>
    </div>
  );
}