import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../api/userApi";
import api from "../../api/axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Lock,
  Clock,
  Pencil,
  Bug,
  Building2,
  Home,
  Wrench,
  CalendarClock,
  ClipboardList,
  BadgeCheck,
  X,
  Eye,
  EyeOff,
  Save,
  ChevronRight,
} from "lucide-react";
import "./CustomerProfile.css";

const DEFAULT_CUSTOMER = {
  id: "",
  name: "Customer",
  status: "Active",
  propertyType: "Residential",
  email: "",
  phone: "",
  joinedOn: "Not available",
  address: "Not added",
  dob: "Not added",
  gender: "Not added",
  profileImage: "",
};

const DEFAULT_ACTIVITY = [];

function formatDate(value) {
  if (!value) {
    return "Not added";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatAddress(user) {
  const address = [
    user.address,
    user.city,
    user.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return address || "Not added";
}

function mapUserToCustomer(user) {
  return {
    id: user.id
      ? `CUST-${String(user.id).padStart(4, "0")}`
      : "",
    name: user.fullName || "Customer",
    status: "Active",
    propertyType: "Residential",
    email: user.email || "",
    phone: user.phone || "",
    joinedOn: "Not available",
    address: formatAddress(user),
    dob: formatDate(user.dateOfBirth),
    gender: user.gender || "Not added",
    profileImage: user.profileImage || "",
  };
}

function StatusBadge({ status }) {
  const isActive = status === "Active";
  return (
    <span className={`cp-badge ${isActive ? "cp-badge--success" : "cp-badge--warning"}`}>
      <span className="cp-badge__dot" />
      {status}
    </span>
  );
}

function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.current) next.current = "Current password is required";
    if (!form.next || form.next.length < 8) next.next = "New password must be at least 8 characters";
    if (form.confirm !== form.next) next.confirm = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);
      setApiError("");

      await changePassword({
        oldPassword: form.current,
        newPassword: form.next,
        confirmPassword: form.confirm,
      });

      setSuccess(true);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to change password."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cp-modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cp-modal__header">
          <div className="cp-modal__title-group">
            <span className="cp-icon-badge">
              <Lock size={18} />
            </span>
            <div>
              <h3>Change Password</h3>
              <p>Keep your account secure with a strong password</p>
            </div>
          </div>
          <button className="cp-icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="cp-modal__success">
            <BadgeCheck size={32} />
            <p>Password updated successfully</p>
          </div>
        ) : (
          <form className="cp-form" onSubmit={handleSubmit}>
            <div className="cp-field">
              <label>Current Password</label>
              <div className={`cp-input ${errors.current ? "cp-input--error" : ""}`}>
                <Lock size={16} className="cp-input__icon" />
                <input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter current password"
                  value={form.current}
                  onChange={handleChange("current")}
                />
                <button
                  type="button"
                  className="cp-input__toggle"
                  onClick={() => setShowCurrent((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.current && <span className="cp-error-text">{errors.current}</span>}
            </div>

            <div className="cp-field">
              <label>New Password</label>
              <div className={`cp-input ${errors.next ? "cp-input--error" : ""}`}>
                <Lock size={16} className="cp-input__icon" />
                <input
                  type={showNext ? "text" : "password"}
                  placeholder="Enter new password"
                  value={form.next}
                  onChange={handleChange("next")}
                />
                <button
                  type="button"
                  className="cp-input__toggle"
                  onClick={() => setShowNext((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showNext ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.next && <span className="cp-error-text">{errors.next}</span>}
            </div>

            <div className="cp-field">
              <label>Confirm New Password</label>
              <div className={`cp-input ${errors.confirm ? "cp-input--error" : ""}`}>
                <Lock size={16} className="cp-input__icon" />
                <input
                  type={showNext ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={form.confirm}
                  onChange={handleChange("confirm")}
                />
              </div>
              {errors.confirm && <span className="cp-error-text">{errors.confirm}</span>}
            </div>

            {apiError && (
              <p className="cp-error-text">{apiError}</p>
            )}

            <div className="cp-modal__actions">
              <button
                type="button"
                className="cp-btn cp-btn--outline"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="cp-btn cp-btn--primary"
                disabled={submitting}
              >
                <Save size={16} />
                {submitting ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CustomerProfile({
  editPath = "/customer/profile/edit-profile",
}) {
  const navigate = useNavigate();

  const [customer, setCustomer] =
    useState(DEFAULT_CUSTOMER);

  const [loading, setLoading] =
    useState(true);

  const [profileError, setProfileError] =
    useState("");

  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [showAllActivity, setShowAllActivity] =
    useState(false);

  const activity = DEFAULT_ACTIVITY;

  const visibleActivity = showAllActivity
    ? activity
    : activity.slice(0, 3);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setProfileError("");

        const response = await api.get(
          "/users/profile"
        );

        if (!cancelled) {
          setCustomer(
            mapUserToCustomer(
              response.data || {}
            )
          );
        }
      } catch (error) {
        if (!cancelled) {
          setProfileError(
            error.response?.data?.message ||
              error.response?.data?.error ||
              (typeof error.response?.data === "string"
                ? error.response.data
                : "Unable to load profile information.")
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleEditProfile = () => {
    navigate(editPath, { state: { customer } });
  };

  return (
    <div className="cp-page">
      <div className="cp-header">
        <div>
          <h1 className="cp-title">Customer Profile</h1>
          <div className="cp-breadcrumb">
            <span onClick={() => navigate("/customer/dashboard")}>Dashboard</span>
            <ChevronRight size={14} />
            <span onClick={() => navigate("/customer/profile")}>Customers</span>
            <ChevronRight size={14} />
            <span className="cp-breadcrumb__current">Profile</span>
          </div>
        </div>
      </div>

      {loading && (
        <div
          className="cp-card"
          style={{ marginBottom: "16px" }}
        >
          Loading profile information...
        </div>
      )}

      {profileError && (
        <div
          className="cp-card"
          style={{
            marginBottom: "16px",
            color: "#dc2626",
          }}
          role="alert"
        >
          {profileError}
        </div>
      )}

      <div className="cpass-layout">
        {/* Left column */}
        <aside className="cp-card cp-sidecard">
          <div className="cp-sidecard__cover">
            <div className="cp-avatar-wrap">
              <div className="cp-avatar">
                {customer.profileImage ? (
                  <img
                    src={customer.profileImage}
                    alt={customer.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <User size={40} />
                )}
              </div>
              <button className="cp-avatar-edit" aria-label="Change photo">
                <Pencil size={13} />
              </button>
            </div>
          </div>

          <div className="cp-sidecard__body">
            <h2 className="cp-customer-name">{customer.name}</h2>
            <div className="cp-sidecard__meta">
              <StatusBadge status={customer.status} />
              <span className="cp-tag">
                {customer.propertyType === "Residential" ? <Home size={12} /> : <Building2 size={12} />}
                {customer.propertyType}
              </span>
            </div>

            <ul className="cp-info-list">
              <li>
                <a href={`mailto:${customer.email}`} className="cp-info-list__link">
                  <Mail size={16} />
                  <span>{customer.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${(customer.phone || "").replace(/\s/g, "")}`} className="cp-info-list__link">
                  <Phone size={16} />
                  <span>{customer.phone}</span>
                </a>
              </li>
              <li>
                <MapPin size={16} />
                <span>{customer.address}</span>
              </li>
            </ul>

            <div className="cp-eco-banner">
              <Bug size={16} />
              <span>Committed to a pest-free environment for a healthier and safer property.</span>
            </div>
          </div>
        </aside>

        {/* Right column */}
        <div className="cp-maincol">
          <section className="cp-card">
            <div className="cp-card__header">
              <div className="cp-card__title">
                <span className="cp-icon-badge">
                  <User size={18} />
                </span>
                <h3>Personal Information</h3>
              </div>
              <button className="cp-btn cp-btn--outline cp-btn--sm" onClick={() => navigate("/customer/profile/edit-profile")}>
                <Pencil size={14} />
                Edit Profile
              </button>
            </div>

            <div className="cp-detail-grid">
              <div className="cp-detail-field">
                <label>Full Name</label>
                <div className="cp-detail-value">{customer.name}</div>
              </div>
              <div className="cp-detail-field">
                <label>Email Address</label>
                <div className="cp-detail-value">{customer.email}</div>
              </div>
              <div className="cp-detail-field">
                <label>Phone Number</label>
                <div className="cp-detail-value">{customer.phone}</div>
              </div>
              <div className="cp-detail-field">
                <label>Date of Birth</label>
                <div className="cp-detail-value">
                  <Calendar size={14} />
                  {customer.dob}
                </div>
              </div>
              <div className="cp-detail-field">
                <label>Gender</label>
                <div className="cp-detail-value">{customer.gender}</div>
              </div>
              <div className="cp-detail-field cp-detail-field--full">
                <label>Address</label>
                <div className="cp-detail-value">
                  <MapPin size={14} />
                  {customer.address}
                </div>
              </div>
            </div>
          </section>

          <div className="cp-twocol">
            <section className="cp-card cp-security-card">
              <div className="cp-card__header">
                <div className="cp-card__title">
                  <span className="cp-icon-badge">
                    <Shield size={18} />
                  </span>
                  <h3>Account Security</h3>
                </div>
              </div>
              <p className="cp-security-text">Keep your account secure by updating your password regularly.</p>
              <button className="cp-btn cp-btn--outline" onClick={() => setShowPasswordModal(true)}>
                <Lock size={16} />
                Change Password
              </button>
            </section>

            <section className="cp-card cp-activity-card">
              <div className="cp-card__header">
                <div className="cp-card__title">
                  <span className="cp-icon-badge">
                    <Clock size={18} />
                  </span>
                  <h3>Recent Activity</h3>
                </div>
                <button className="cp-link-btn" onClick={() => setShowAllActivity((v) => !v)}>
                  {showAllActivity ? "Show Less" : "View All"}
                </button>
              </div>

              {visibleActivity.length > 0 ? (
                <ul className="cp-activity-list">
                  {visibleActivity.map((item) => (
                    <li
                      key={item.id}
                      className="cp-activity-item"
                    >
                      <span className="cp-activity-dot" />
                      <div>
                        <p className="cp-activity-label">
                          {item.label}
                        </p>
                        <p className="cp-activity-meta">
                          {item.meta}
                        </p>
                        <p className="cp-activity-time">
                          {item.time}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="cp-activity-meta">
                  No recent activity is available.
                </p>
              )}
            </section>
          </div>
        </div>
      </div>

      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
    </div>
  );
}