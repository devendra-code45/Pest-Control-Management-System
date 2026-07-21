import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
  HiOutlineClock,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineHome,
  HiOutlineCog,
  HiOutlineArrowLeft,
} from "react-icons/hi";
import { FaLeaf } from "react-icons/fa";
import "./ChangePassword.css";

/* ------------------------------------------------------------------ */
/* Illustration — same approach as the Login page: built from SVG      */
/* shapes since no source asset file was provided.                     */
/* ------------------------------------------------------------------ */
const PestControlIllustration = () => (
  <svg
    viewBox="0 0 760 460"
    className="illustration-svg"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.55" fill="#E7F0E3">
      <ellipse cx="560" cy="60" rx="55" ry="20" />
      <ellipse cx="605" cy="50" rx="40" ry="16" />
      <ellipse cx="500" cy="120" rx="45" ry="16" />
      <ellipse cx="540" cy="112" rx="30" ry="12" />
    </g>

    <g stroke="#9CB89A" strokeWidth="3" fill="none" strokeLinecap="round">
      <path d="M520 150 q8 -10 16 0 q8 -10 16 0" />
      <path d="M560 175 q6 -8 12 0 q6 -8 12 0" />
      <path d="M600 140 q6 -8 12 0 q6 -8 12 0" />
    </g>

    <path d="M0 430 Q380 390 760 430 L760 460 L0 460 Z" fill="#CFE3C4" />
    <path d="M0 445 Q380 415 760 445 L760 460 L0 460 Z" fill="#BBD8AC" />

    <g transform="translate(400,180)">
      <polygon points="70,0 170,60 -30,60" fill="#2F6B3A" />
      <rect x="-15" y="58" width="170" height="150" fill="#F4EFE1" />
      <rect x="20" y="90" width="45" height="45" fill="#BFE0D6" stroke="#2F6B3A" strokeWidth="4" />
      <line x1="42" y1="90" x2="42" y2="135" stroke="#2F6B3A" strokeWidth="3" />
      <line x1="20" y1="112" x2="65" y2="112" stroke="#2F6B3A" strokeWidth="3" />
      <rect x="95" y="150" width="40" height="58" fill="#2F6B3A" rx="3" />
      <rect x="-15" y="200" width="170" height="8" fill="#DDD6C1" />
      <polygon points="-15,208 0,225 -15,225" fill="#C9C2AA" />
    </g>

    <g fill="#4C8A4F">
      <ellipse cx="200" cy="420" rx="70" ry="30" />
      <ellipse cx="270" cy="430" rx="55" ry="24" />
      <ellipse cx="620" cy="420" rx="65" ry="28" />
      <ellipse cx="690" cy="430" rx="45" ry="20" />
    </g>
    <g fill="#5CA25E">
      <ellipse cx="215" cy="410" rx="45" ry="20" />
      <ellipse cx="635" cy="410" rx="40" ry="18" />
    </g>

    <g transform="translate(60,260)">
      <rect x="18" y="60" width="10" height="70" fill="#6B4A2F" />
      <circle cx="23" cy="45" r="42" fill="#3E7A45" />
      <circle cx="0" cy="65" r="30" fill="#4C8A4F" />
      <circle cx="46" cy="65" r="30" fill="#4C8A4F" />
    </g>

    <g transform="translate(300,230)">
      <rect x="-46" y="30" width="34" height="70" rx="6" fill="#F4F4F4" stroke="#2A2A2A" strokeWidth="2" />
      <circle cx="-29" cy="55" r="11" fill="#E11D2E" />
      <line x1="-37" y1="47" x2="-21" y2="63" stroke="#E11D2E" strokeWidth="3" />
      <path d="M-46 32 Q-60 40 -55 65" fill="none" stroke="#1F1F1F" strokeWidth="6" />
      <path d="M-12 34 Q4 40 -2 65" fill="none" stroke="#1F1F1F" strokeWidth="6" />

      <rect x="-18" y="150" width="16" height="60" fill="#3B5B33" transform="rotate(8 -10 150)" />
      <rect x="4" y="150" width="16" height="60" fill="#2F4A29" transform="rotate(-6 12 150)" />
      <ellipse cx="-14" cy="212" rx="14" ry="8" fill="#1B1B1B" />
      <ellipse cx="24" cy="210" rx="14" ry="8" fill="#1B1B1B" />

      <rect x="-30" y="70" width="56" height="85" rx="14" fill="#3F6E37" />
      <rect x="-30" y="70" width="56" height="20" rx="10" fill="#355C2E" />

      <path d="M-30 90 Q-60 105 -66 140" stroke="#3F6E37" strokeWidth="16" fill="none" strokeLinecap="round" />
      <path d="M26 90 Q64 100 82 118" stroke="#3F6E37" strokeWidth="16" fill="none" strokeLinecap="round" />
      <circle cx="-67" cy="142" r="9" fill="#1B1B1B" />
      <circle cx="84" cy="117" r="9" fill="#1B1B1B" />

      <line x1="84" y1="117" x2="140" y2="128" stroke="#1B1B1B" strokeWidth="5" />
      <g opacity="0.6" fill="#DCEFEA">
        <circle cx="150" cy="130" r="4" />
        <circle cx="165" cy="140" r="5" />
        <circle cx="180" cy="150" r="6" />
        <circle cx="195" cy="162" r="7" />
        <circle cx="160" cy="118" r="3" />
        <circle cx="178" cy="128" r="4" />
      </g>

      <circle cx="-2" cy="45" r="26" fill="#E9B98C" />
      <path d="M-28 40 Q-2 5 24 40 Q24 20 -2 12 Q-28 20 -28 40Z" fill="#3F6E37" />
      <rect x="-16" y="46" width="30" height="14" rx="7" fill="#FFFFFF" stroke="#CFCFCF" />
      <circle cx="-4" cy="53" r="2" fill="#333" />
      <circle cx="10" cy="53" r="2" fill="#333" />
    </g>

    <g fill="#3E7A45" opacity="0.9">
      <ellipse cx="30" cy="440" rx="20" ry="8" transform="rotate(-20 30 440)" />
      <ellipse cx="10" cy="455" rx="24" ry="9" transform="rotate(-10 10 455)" />
    </g>
  </svg>
);

/* Very small heuristic password-strength meter — good enough to drive
   the 6-segment bar shown in the reference design. Replace with your
   real validation logic if you have one. */
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Strong"];
  return { score, label: labels[score] || "" };
};

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="change-password-page">
      {/* -------------------------- LEFT SIDE -------------------------- */}
      <div className="change-password-left">
        <div className="brand-row">
          <div className="brand-logo">
            <HiOutlineHome className="brand-logo-icon" />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">
              Pest<span className="brand-title-accent">Control</span>
            </h1>
            <span className="brand-subtitle">MANAGEMENT SYSTEM</span>
          </div>
        </div>

        <h2 className="hero-heading">
          Keep Your Account
          <br />
          <span className="hero-heading-accent">Secure &amp; Protected.</span>
        </h2>

        <p className="hero-description">
          Regularly update your password to keep your account safe and your
          business protected.
        </p>

        <div className="feature-list">
          <div className="feature-card">
            <div className="feature-icon">
              <HiOutlineShieldCheck />
            </div>
            <div className="feature-text">
              <h3>Stronger Security</h3>
              <p>A strong password helps keep unauthorized access away.</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <HiOutlineLockClosed />
            </div>
            <div className="feature-text">
              <h3>Protect Your Data</h3>
              <p>Your information and customer data stay safe and secure.</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <HiOutlineClock />
            </div>
            <div className="feature-text">
              <h3>Stay Protected</h3>
              <p>Change your password regularly for better protection.</p>
            </div>
          </div>
        </div>

        <div className="illustration-wrapper">
          <PestControlIllustration />
        </div>

        <div className="floating-card">
          <div className="floating-card-icon">
            <HiOutlineShieldCheck />
          </div>
          <p>
            Your security is in your hands. A quick password change today for
            a safer tomorrow.
          </p>
        </div>
      </div>

      {/* -------------------------- RIGHT SIDE -------------------------- */}
      <div className="change-password-right">
        <div className="change-password-card">
          <div className="change-password-card-icon">
            <HiOutlineLockClosed />
            <HiOutlineCog className="change-password-card-icon-cog" />
          </div>

          <h2 className="welcome-heading">
            Change <span className="welcome-heading-accent">Password</span>
          </h2>
          <p className="welcome-subtitle">
            Update your password regularly to keep your account secure.
          </p>

          <div className="divider">
            <span className="divider-line" />
            <FaLeaf className="divider-icon" />
            <span className="divider-line" />
          </div>

          <form onSubmit={handleSubmit} className="change-password-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <div className="input-wrapper">
                <HiOutlineLockClosed className="input-icon" />
                <input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowCurrent((s) => !s)}
                  aria-label="Toggle current password visibility"
                >
                  {showCurrent ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-wrapper">
                <HiOutlineLockClosed className="input-icon" />
                <input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowNew((s) => !s)}
                  aria-label="Toggle new password visibility"
                >
                  {showNew ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>

              {newPassword && (
                <div className="strength-row">
                  <span className="strength-label">Password Strength:</span>
                  <div className="strength-bar">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <span
                        key={i}
                        className={`strength-segment ${
                          i < strength.score ? "filled" : ""
                        }`}
                      />
                    ))}
                  </div>
                  <span className="strength-text">{strength.label}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="input-wrapper">
                <HiOutlineLockClosed className="input-icon" />
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirm((s) => !s)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
            </div>

            <div className="info-box">
              <HiOutlineShieldCheck className="info-box-icon" />
              <p>
                Use a strong password with at least 8 characters, including
                uppercase, lowercase, numbers, and special characters.
              </p>
            </div>

            <button type="submit" className="btn btn-primary">
              <HiOutlineLockClosed />
              Update Password
            </button>

            <Link to="/dashboard" className="btn btn-outline">
              <HiOutlineArrowLeft />
              Back to Dashboard
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;