import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Hash,
  Home,
  Factory,
  X,
  Save,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";
import "./EditCustomerProfile.css";

const DEFAULT_CUSTOMER = {
  name: "Rahul Sharma",
  email: "rahul.sharma@email.com",
  phone: "+91 98765 43210",
  altPhone: "",
  address: "Flat 302, Green Valley Apartments, Baner",
  city: "Pune",
  state: "Maharashtra",
  pincode: "411045",
  propertyType: "Residential",
};

const PROPERTY_TYPES = [
  { value: "Residential", icon: Home },
  { value: "Commercial", icon: Building2 },
  { value: "Industrial", icon: Factory },
];

const PHONE_REGEX = /^[+]?[\d\s-]{10,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PINCODE_REGEX = /^\d{6}$/;

export default function EditCustomerProfile({ backPath = "/customer/profile", onSave, onCancel }) {
  const navigate = useNavigate();
  const location = useLocation();
  const initialCustomer = (location.state && location.state.customer) || DEFAULT_CUSTOMER;

  const [form, setForm] = useState({
    name: initialCustomer.name || "",
    email: initialCustomer.email || "",
    phone: initialCustomer.phone || "",
    altPhone: initialCustomer.altPhone || "",
    address: initialCustomer.address || "",
    city: initialCustomer.city || "",
    state: initialCustomer.state || "",
    pincode: initialCustomer.pincode || "",
    propertyType: initialCustomer.propertyType || "Residential",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Full name is required";
    if (!form.email.trim()) next.email = "Email address is required";
    else if (!EMAIL_REGEX.test(form.email)) next.email = "Enter a valid email address";
    if (!form.phone.trim()) next.phone = "Mobile number is required";
    else if (!PHONE_REGEX.test(form.phone)) next.phone = "Enter a valid mobile number";
    if (form.altPhone && !PHONE_REGEX.test(form.altPhone)) next.altPhone = "Enter a valid mobile number";
    if (!form.address.trim()) next.address = "Address is required";
    if (!form.city.trim()) next.city = "City is required";
    if (!form.state.trim()) next.state = "State is required";
    if (!form.pincode.trim()) next.pincode = "Pincode is required";
    else if (!PINCODE_REGEX.test(form.pincode)) next.pincode = "Enter a valid 6-digit pincode";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }
    navigate(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    // Simulate an async save; replace with the real API call.
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      if (onSave) onSave(form);
      setTimeout(() => {
        navigate(backPath, { state: { customer: form } });
      }, 900);
    }, 700);
  };

  return (
    <div className="ecp-page">
      <div className="ecp-breadcrumb">
        <span onClick={() => navigate("/dashboard")}>Dashboard</span>
        <ChevronRight size={14} />
        <span onClick={() => navigate("/customers")}>Customers</span>
        <ChevronRight size={14} />
        <span onClick={() => navigate(backPath)}>Profile</span>
        <ChevronRight size={14} />
        <span className="ecp-breadcrumb__current">Edit</span>
      </div>

      <form className="ecp-card" onSubmit={handleSubmit} noValidate>
        <div className="ecp-card__header">
          <span className="ecp-icon-badge">
            <User size={20} />
          </span>
          <div>
            <h2>Edit Profile</h2>
            <p>Update the customer&apos;s personal and service address information</p>
          </div>
        </div>

        <div className="ecp-divider">
          <span className="ecp-divider__leaf">&#127807;</span>
        </div>

        <div className="ecp-grid">
          <div className="ecp-field">
            <label htmlFor="ecp-name">Full Name</label>
            <div className={`ecp-input ${errors.name ? "ecp-input--error" : ""}`}>
              <User size={16} className="ecp-input__icon" />
              <input
                id="ecp-name"
                type="text"
                placeholder="Enter full name"
                value={form.name}
                onChange={handleChange("name")}
              />
            </div>
            {errors.name && <span className="ecp-error-text">{errors.name}</span>}
          </div>

          <div className="ecp-field">
            <label htmlFor="ecp-email">Email Address</label>
            <div className={`ecp-input ${errors.email ? "ecp-input--error" : ""}`}>
              <Mail size={16} className="ecp-input__icon" />
              <input
                id="ecp-email"
                type="email"
                placeholder="name@email.com"
                value={form.email}
                onChange={handleChange("email")}
              />
            </div>
            {errors.email && <span className="ecp-error-text">{errors.email}</span>}
          </div>

          <div className="ecp-field">
            <label htmlFor="ecp-phone">Mobile Number</label>
            <div className={`ecp-input ${errors.phone ? "ecp-input--error" : ""}`}>
              <Phone size={16} className="ecp-input__icon" />
              <input
                id="ecp-phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={handleChange("phone")}
              />
            </div>
            {errors.phone && <span className="ecp-error-text">{errors.phone}</span>}
          </div>

          <div className="ecp-field">
            <label htmlFor="ecp-altphone">Alternate Number <span className="ecp-optional">(optional)</span></label>
            <div className={`ecp-input ${errors.altPhone ? "ecp-input--error" : ""}`}>
              <Phone size={16} className="ecp-input__icon" />
              <input
                id="ecp-altphone"
                type="tel"
                placeholder="+91 90000 00000"
                value={form.altPhone}
                onChange={handleChange("altPhone")}
              />
            </div>
            {errors.altPhone && <span className="ecp-error-text">{errors.altPhone}</span>}
          </div>

          <div className="ecp-field ecp-field--full">
            <label htmlFor="ecp-address">Address</label>
            <div className={`ecp-input ecp-input--textarea ${errors.address ? "ecp-input--error" : ""}`}>
              <MapPin size={16} className="ecp-input__icon" />
              <textarea
                id="ecp-address"
                rows={2}
                placeholder="House / flat no., street, locality"
                value={form.address}
                onChange={handleChange("address")}
              />
            </div>
            {errors.address && <span className="ecp-error-text">{errors.address}</span>}
          </div>

          <div className="ecp-field">
            <label htmlFor="ecp-city">City</label>
            <div className={`ecp-input ${errors.city ? "ecp-input--error" : ""}`}>
              <Building2 size={16} className="ecp-input__icon" />
              <input
                id="ecp-city"
                type="text"
                placeholder="City"
                value={form.city}
                onChange={handleChange("city")}
              />
            </div>
            {errors.city && <span className="ecp-error-text">{errors.city}</span>}
          </div>

          <div className="ecp-field">
            <label htmlFor="ecp-state">State</label>
            <div className={`ecp-input ${errors.state ? "ecp-input--error" : ""}`}>
              <MapPin size={16} className="ecp-input__icon" />
              <input
                id="ecp-state"
                type="text"
                placeholder="State"
                value={form.state}
                onChange={handleChange("state")}
              />
            </div>
            {errors.state && <span className="ecp-error-text">{errors.state}</span>}
          </div>

          <div className="ecp-field">
            <label htmlFor="ecp-pincode">Pincode</label>
            <div className={`ecp-input ${errors.pincode ? "ecp-input--error" : ""}`}>
              <Hash size={16} className="ecp-input__icon" />
              <input
                id="ecp-pincode"
                type="text"
                inputMode="numeric"
                placeholder="411045"
                value={form.pincode}
                onChange={handleChange("pincode")}
              />
            </div>
            {errors.pincode && <span className="ecp-error-text">{errors.pincode}</span>}
          </div>

          <div className="ecp-field">
            <label>Property Type</label>
            <div className="ecp-segmented">
              {PROPERTY_TYPES.map(({ value, icon: Icon }) => (
                <button
                  type="button"
                  key={value}
                  className={`ecp-segmented__option ${form.propertyType === value ? "is-active" : ""}`}
                  onClick={() => setForm((prev) => ({ ...prev, propertyType: value }))}
                >
                  <Icon size={14} />
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="ecp-footer">
          {saved && (
            <span className="ecp-saved-msg">
              <BadgeCheck size={16} />
              Profile updated successfully
            </span>
          )}
          <div className="ecp-footer__actions">
            <button type="button" className="ecp-btn ecp-btn--outline" onClick={handleCancel} disabled={saving}>
              <X size={16} />
              Cancel
            </button>
            <button type="submit" className="ecp-btn ecp-btn--primary" disabled={saving}>
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}