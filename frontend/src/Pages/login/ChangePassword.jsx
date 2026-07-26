import React, { useMemo, useState } from "react";
import { changePassword } from "../../api/userApi";
import {
  ChevronRight,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  X,
  Cloud,
  AlertTriangle,
} from "lucide-react";
import "./ChangePassword.css";

const tips = [
  "Use at least 8 characters",
  "Include uppercase and lowercase letters",
  "Add numbers and special characters",
  "Avoid using personal information",
  "Change your password regularly",
];

const INITIAL_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function getPasswordStrength(password) {
  if (!password) return { label: "", score: 0 };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { label: "Weak", score: 1 };
  if (score === 3) return { label: "Medium", score: 2 };
  return { label: "Strong", score: 3 };
}

export default function ChangePassword({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [visibility, setVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);

  const strength = useMemo(() => getPasswordStrength(formData.newPassword), [formData.newPassword]);

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

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.currentPassword.trim()) {
      nextErrors.currentPassword = "Current password is required.";
    }

    if (!formData.newPassword.trim()) {
      nextErrors.newPassword = "New password is required.";
    } else if (formData.newPassword.length < 8) {
      nextErrors.newPassword = "Password must be at least 8 characters long.";
    } else if (formData.currentPassword && formData.newPassword === formData.currentPassword) {
      nextErrors.newPassword = "New password must be different from the current password.";
    }

    if (!formData.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Please confirm your new password.";
    } else if (formData.confirmPassword !== formData.newPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    return nextErrors;
  };

  const handleSubmit = async () => {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setBanner({
        type: "error",
        text: "Please fix the errors below and try again.",
      });
      return;
    }

    try {
      await changePassword({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      setBanner({
        type: "success",
        text: "Password updated successfully.",
      });

      setFormData(INITIAL_FORM);
    } catch (error) {
      setBanner({
        type: "error",
        text:
          error.response?.data?.message ||
          error.response?.data ||
          "Unable to change password.",
      });
    }
  };

  const handleCancel = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setBanner(null);
    if (typeof onCancel === "function") {
      onCancel();
    }
  };

  const strengthLabelClass =
    strength.label === "Strong"
      ? "cp-strength-strong"
      : strength.label === "Medium"
        ? "cp-strength-medium"
        : "cp-strength-weak";

  return (
    <div className="cp-page">
      <nav className="cp-breadcrumb" aria-label="Breadcrumb">
        <a href="#" className="cp-breadcrumb-link">
          Dashboard
        </a>
        <ChevronRight size={14} className="cp-breadcrumb-sep" />
        <a href="#" className="cp-breadcrumb-link">
          Profile
        </a>
        <ChevronRight size={14} className="cp-breadcrumb-sep" />
        <span className="cp-breadcrumb-current">Change Password</span>
      </nav>

      <header className="cp-header-pass">
        <span className="cp-header-icon">
          <Lock size={26} strokeWidth={2} />
        </span>
        <div>
          <h1 className="cp-title">Change Password</h1>
          <p className="cp-subtitle">Update your password regularly to keep your account secure.</p>
        </div>
      </header>

      <div className="cp-layout-grid">
        <section className="cp-card">
          <div className="cp-card-heading">
            <h2 className="cp-card-title">Update Your Password</h2>
            <p className="cp-card-desc">Enter your current password and choose a new password.</p>
          </div>

          {banner && (
            <div className={`cp-banner ${banner.type === "success" ? "cp-banner-success" : "cp-banner-error"}`}>
              {banner.type === "success" ? (
                <CheckCircle2 size={16} strokeWidth={2} />
              ) : (
                <AlertTriangle size={16} strokeWidth={2} />
              )}
              <span>{banner.text}</span>
            </div>
          )}

          <div className="cp-form-field">
            <label className="cp-form-label">
              Current Password <span className="cp-required">*</span>
            </label>
            <div className={`cp-input-wrap ${errors.currentPassword ? "cp-field-error" : ""}`}>
              <Lock size={16} className="cp-input-icon" />
              <input
                type={visibility.currentPassword ? "text" : "password"}
                className="cp-input-pass"
                placeholder="Enter your current password"
                value={formData.currentPassword}
                onChange={(e) => updateField("currentPassword", e.target.value)}
              />
              <button
                type="button"
                className="cp-eye-btn"
                onClick={() => toggleVisibility("currentPassword")}
                aria-label={visibility.currentPassword ? "Hide password" : "Show password"}
              >
                {visibility.currentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.currentPassword && <span className="cp-error-text">{errors.currentPassword}</span>}
          </div>

          <div className="cp-form-field">
            <label className="cp-form-label">
              New Password <span className="cp-required">*</span>
            </label>
            <div className={`cp-input-wrap ${errors.newPassword ? "cp-field-error" : ""}`}>
              <Lock size={16} className="cp-input-icon" />
              <input
                type={visibility.newPassword ? "text" : "password"}
                className="cp-input-pass"
                placeholder="Enter your new password"
                value={formData.newPassword}
                onChange={(e) => updateField("newPassword", e.target.value)}
              />
              <button
                type="button"
                className="cp-eye-btn"
                onClick={() => toggleVisibility("newPassword")}
                aria-label={visibility.newPassword ? "Hide password" : "Show password"}
              >
                {visibility.newPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.newPassword ? (
              <span className="cp-error-text">{errors.newPassword}</span>
            ) : (
              <span className="cp-helper-text">
                Password must be at least 8 characters long and include a combination of letters,
                numbers and symbols.
              </span>
            )}

            {formData.newPassword && (
              <div className="cp-strength-row">
                <span className="cp-strength-label">
                  Password Strength: <span className={strengthLabelClass}>{strength.label}</span>
                </span>
                <div className="cp-strength-bar">
                  <span
                    className={`cp-strength-segment ${strength.score >= 1 ? strengthLabelClass : ""}`}
                  />
                  <span
                    className={`cp-strength-segment ${strength.score >= 2 ? strengthLabelClass : ""}`}
                  />
                  <span
                    className={`cp-strength-segment ${strength.score >= 3 ? strengthLabelClass : ""}`}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="cp-form-field">
            <label className="cp-form-label">
              Confirm New Password <span className="cp-required">*</span>
            </label>
            <div className={`cp-input-wrap ${errors.confirmPassword ? "cp-field-error" : ""}`}>
              <Lock size={16} className="cp-input-icon" />
              <input
                type={visibility.confirmPassword ? "text" : "password"}
                className="cp-input-pass"
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
              />
              <button
                type="button"
                className="cp-eye-btn"
                onClick={() => toggleVisibility("confirmPassword")}
                aria-label={visibility.confirmPassword ? "Hide password" : "Show password"}
              >
                {visibility.confirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword ? (
              <span className="cp-error-text">{errors.confirmPassword}</span>
            ) : (
              <span className="cp-helper-text">Re-enter your new password to confirm.</span>
            )}
          </div>

          <div className="cp-form-actions">
            <button type="button" className="cp-btn cp-btn-primary" onClick={handleSubmit}>
              <Lock size={16} strokeWidth={2} />
              Update Password
            </button>
          </div>
        </section>

        <aside className="cp-side-col">
          <section className="cp-card">
            <div className="cp-tips-header">
              <span className="cp-tips-icon">
                <ShieldCheck size={20} strokeWidth={2} />
              </span>
              <h2 className="cp-card-title">Password Tips</h2>
            </div>
            <p className="cp-tips-intro">
              For a stronger and more secure password, follow these tips:
            </p>
            <ul className="cp-tips-list">
              {tips.map((tip) => (
                <li key={tip}>
                  <CheckCircle2 size={16} strokeWidth={2} className="cp-tip-check" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="cp-card cp-illustration-card">
            <div className="cp-illustration">
              <Cloud size={28} strokeWidth={1.5} className="cp-cloud cp-cloud-left" />
              <Cloud size={22} strokeWidth={1.5} className="cp-cloud cp-cloud-right" />
              <span className="cp-dot cp-dot-1" />
              <span className="cp-dot cp-dot-2" />
              <span className="cp-dot cp-dot-3" />
              <span className="cp-dot cp-dot-4" />
              <div className="cp-shield">
                <ShieldCheck size={64} strokeWidth={1.5} className="cp-shield-outline" />
                <Lock size={26} strokeWidth={2} className="cp-shield-lock" />
              </div>
            </div>
            <h3 className="cp-illustration-title">Keep Your Account Secure</h3>
            <p className="cp-illustration-text">
              A strong password helps protect your account and keeps your data safe.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}