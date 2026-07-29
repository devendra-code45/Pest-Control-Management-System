import React, {
  useMemo,
  useState,
} from "react";

import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  HiOutlineMail,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineLockClosed,
  HiOutlineHome,
  HiOutlineArrowLeft,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineCheckCircle,
  HiOutlineKey,
} from "react-icons/hi";

import { FaLeaf } from "react-icons/fa";

import api from "../../api/axios";
import RecoveryIllustration from "./RecoveryIllustration";
import "./ResetPassword.css";

const RULES = [
  {
    key: "length",
    label: "Minimum 8 characters long",
    test: (value) => value.length >= 8,
  },
  {
    key: "upper",
    label: "At least one uppercase letter",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    key: "lower",
    label: "At least one lowercase letter",
    test: (value) => /[a-z]/.test(value),
  },
  {
    key: "numberOrSpecial",
    label:
      "At least one number or special character",
    test: (value) =>
      /[0-9]/.test(value) ||
      /[^A-Za-z0-9]/.test(value),
  },
];

const STRENGTH_META = {
  1: {
    label: "Weak",
    text: "#dc2626",
    bar: "#dc2626",
  },
  2: {
    label: "Fair",
    text: "#d97706",
    bar: "#d97706",
  },
  3: {
    label: "Good",
    text: "#2563eb",
    bar: "#2563eb",
  },
  4: {
    label: "Strong",
    text: "#15803d",
    bar: "#15803d",
  },
};

function getStrength(password) {
  if (!password) {
    return {
      score: 0,
      label: "",
    };
  }

  const passedRules = RULES.filter((rule) =>
    rule.test(password)
  ).length;

  return {
    score: passedRules,
    label:
      STRENGTH_META[passedRules]?.label ||
      "Weak",
  };
}

function getErrorMessage(error) {
  const data = error.response?.data;

  if (typeof data === "string") {
    return data;
  }

  if (data?.message) {
    return data.message;
  }

  if (data?.error) {
    return data.error;
  }

  if (!error.response) {
    return "Unable to connect to the server.";
  }

  return "Unable to reset password.";
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  const strength = useMemo(
    () => getStrength(password),
    [password]
  );

  const strengthMeta =
    STRENGTH_META[strength.score] || {
      label: "",
      text: "#9ca3af",
      bar: "#e5e7eb",
    };

  const allRulesPassed = RULES.every((rule) =>
    rule.test(password)
  );

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  if (!email || !otp) {
    return (
      <Navigate
        to="/forgot-password"
        replace
      />
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!allRulesPassed) {
      setError(
        "Your password does not meet all requirements."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await api.post("/users/reset-password", {
        email,
        otp,
        newPassword: password,
        confirmPassword,
      });

      navigate("/login", {
        replace: true,
        state: {
          passwordResetSuccess: true,
          message:
            "Password reset successfully. Please login with your new password.",
        },
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-left">
        <div className="brand-row">
          <div className="brand-logo">
            <HiOutlineHome className="brand-logo-icon" />
          </div>

          <div className="brand-text">
            <h1 className="brand-title">
              Pest
              <span className="brand-title-accent">
                Control
              </span>
            </h1>

            <span className="brand-subtitle">
              MANAGEMENT SYSTEM
            </span>
          </div>
        </div>

        <h2 className="hero-heading">
          Recover Your Account
          <br />

          <span className="hero-heading-accent">
            Securely.
          </span>
        </h2>

        <p className="hero-description">
          We use secure verification to protect your
          account and keep your pest management
          services accessible anytime.
        </p>

        <div className="feature-list">
          <div className="feature-card">
            <div className="feature-icon">
              <HiOutlineShieldCheck />
            </div>

            <div className="feature-text">
              <h3>Secure Verification</h3>
              <p>
                We verify your identity to keep your
                account safe.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <HiOutlineMail />
            </div>

            <div className="feature-text">
              <h3>Email Recovery</h3>
              <p>
                Receive reset instructions on your
                registered email.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <HiOutlineClock />
            </div>

            <div className="feature-text">
              <h3>Fast Password Reset</h3>
              <p>
                Reset your password in just a few
                simple steps.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <HiOutlineLockClosed />
            </div>

            <div className="feature-text">
              <h3>Protected User Data</h3>
              <p>
                Your data is encrypted and kept
                secure.
              </p>
            </div>
          </div>
        </div>

        <div className="illustration-wrapper">
          <RecoveryIllustration />
        </div>
      </div>

      <div className="reset-password-right">
        <div className="reset-password-badge">
          <HiOutlineShieldCheck />
          Secure Reset
        </div>

        <div className="reset-password-card">
          <div className="reset-password-card-icon">
            <HiOutlineLockClosed />

            <HiOutlineKey className="reset-password-card-icon-key" />
          </div>

          <h2 className="welcome-heading">
            Reset{" "}
            <span className="welcome-heading-accent">
              Your Password
            </span>
          </h2>

          <p className="welcome-subtitle">
            Enter your new password below.
            <br />
            Make sure it&apos;s strong and secure.
          </p>

          <div className="divider">
            <span className="divider-line" />
            <FaLeaf className="divider-icon" />
            <span className="divider-line" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="reset-password-form"
          >
            <div className="form-group">
              <label htmlFor="password">
                New Password
              </label>

              <div className="input-wrapper">
                <HiOutlineLockClosed className="input-icon" />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <HiOutlineEyeOff />
                  ) : (
                    <HiOutlineEye />
                  )}
                </button>
              </div>

              {password && (
                <div className="strength-row">
                  <div className="strength-bar">
                    <div
                      className="strength-bar-fill"
                      style={{
                        width: `${
                          strength.score * 25
                        }%`,
                        background:
                          strengthMeta.bar,
                      }}
                    />
                  </div>

                  <span
                    className="strength-label"
                    style={{
                      color: strengthMeta.text,
                    }}
                  >
                    Password strength:{" "}
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm New Password
              </label>

              <div className="input-wrapper">
                <HiOutlineLockClosed className="input-icon" />

                <input
                  id="confirmPassword"
                  type={
                    showConfirm
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(
                      event.target.value
                    );

                    setError("");
                  }}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() =>
                    setShowConfirm(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showConfirm
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirm ? (
                    <HiOutlineEyeOff />
                  ) : (
                    <HiOutlineEye />
                  )}
                </button>
              </div>

              {confirmPassword &&
                !passwordsMatch && (
                  <p className="mismatch-text">
                    Passwords do not match.
                  </p>
                )}
            </div>

            <div className="requirements-box">
              {RULES.map((rule) => {
                const passed =
                  rule.test(password);

                return (
                  <div
                    key={rule.key}
                    className={`requirement-item ${
                      passed ? "passed" : ""
                    }`}
                  >
                    <HiOutlineCheckCircle className="requirement-icon" />

                    <span>{rule.label}</span>
                  </div>
                );
              })}
            </div>

            {error && (
              <p className="form-error-text">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              <HiOutlineLockClosed />

              {submitting
                ? "Resetting Password..."
                : "Reset Password"}
            </button>

            <Link
              to="/login"
              className="btn btn-outline"
            >
              <HiOutlineArrowLeft />
              Back to Login
            </Link>
          </form>

          <p className="register-text">
            Remember your password?{" "}
            <Link
              to="/login"
              className="register-link"
            >
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;