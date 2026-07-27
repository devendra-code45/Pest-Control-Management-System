import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineDeviceMobile,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineUserAdd,
  HiOutlineHome,
} from "react-icons/hi";

import { FaLeaf } from "react-icons/fa";

import api from "../../api/axios";
import "./Registration.css";

const INITIAL_FORM = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  acceptedTerms: false,
};

const PestControlIllustration = () => (
  <svg
    viewBox="0 0 760 460"
    className="illustration-svg"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.55" fill="#E7F0E3">
      <ellipse
        cx="560"
        cy="60"
        rx="55"
        ry="20"
      />

      <ellipse
        cx="605"
        cy="50"
        rx="40"
        ry="16"
      />

      <ellipse
        cx="500"
        cy="120"
        rx="45"
        ry="16"
      />

      <ellipse
        cx="540"
        cy="112"
        rx="30"
        ry="12"
      />
    </g>

    <g
      stroke="#9CB89A"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    >
      <path d="M520 150 q8 -10 16 0 q8 -10 16 0" />
      <path d="M560 175 q6 -8 12 0 q6 -8 12 0" />
      <path d="M600 140 q6 -8 12 0 q6 -8 12 0" />
    </g>

    <path
      d="M0 430 Q380 390 760 430 L760 460 L0 460 Z"
      fill="#CFE3C4"
    />

    <path
      d="M0 445 Q380 415 760 445 L760 460 L0 460 Z"
      fill="#BBD8AC"
    />

    <g transform="translate(400,180)">
      <polygon
        points="70,0 170,60 -30,60"
        fill="#2F6B3A"
      />

      <rect
        x="-15"
        y="58"
        width="170"
        height="150"
        fill="#F4EFE1"
      />

      <rect
        x="20"
        y="90"
        width="45"
        height="45"
        fill="#BFE0D6"
        stroke="#2F6B3A"
        strokeWidth="4"
      />

      <line
        x1="42"
        y1="90"
        x2="42"
        y2="135"
        stroke="#2F6B3A"
        strokeWidth="3"
      />

      <line
        x1="20"
        y1="112"
        x2="65"
        y2="112"
        stroke="#2F6B3A"
        strokeWidth="3"
      />

      <rect
        x="95"
        y="150"
        width="40"
        height="58"
        fill="#2F6B3A"
        rx="3"
      />

      <rect
        x="-15"
        y="200"
        width="170"
        height="8"
        fill="#DDD6C1"
      />
    </g>

    <g fill="#4C8A4F">
      <ellipse
        cx="200"
        cy="420"
        rx="70"
        ry="30"
      />

      <ellipse
        cx="270"
        cy="430"
        rx="55"
        ry="24"
      />

      <ellipse
        cx="620"
        cy="420"
        rx="65"
        ry="28"
      />

      <ellipse
        cx="690"
        cy="430"
        rx="45"
        ry="20"
      />
    </g>

    <g fill="#5CA25E">
      <ellipse
        cx="215"
        cy="410"
        rx="45"
        ry="20"
      />

      <ellipse
        cx="635"
        cy="410"
        rx="40"
        ry="18"
      />
    </g>

    <g transform="translate(60,260)">
      <rect
        x="18"
        y="60"
        width="10"
        height="70"
        fill="#6B4A2F"
      />

      <circle
        cx="23"
        cy="45"
        r="42"
        fill="#3E7A45"
      />

      <circle
        cx="0"
        cy="65"
        r="30"
        fill="#4C8A4F"
      />

      <circle
        cx="46"
        cy="65"
        r="30"
        fill="#4C8A4F"
      />
    </g>

    <g transform="translate(300,230)">
      <rect
        x="-46"
        y="30"
        width="34"
        height="70"
        rx="6"
        fill="#F4F4F4"
        stroke="#2A2A2A"
        strokeWidth="2"
      />

      <circle
        cx="-29"
        cy="55"
        r="11"
        fill="#E11D2E"
      />

      <line
        x1="-37"
        y1="47"
        x2="-21"
        y2="63"
        stroke="#E11D2E"
        strokeWidth="3"
      />

      <path
        d="M-46 32 Q-60 40 -55 65"
        fill="none"
        stroke="#1F1F1F"
        strokeWidth="6"
      />

      <path
        d="M-12 34 Q4 40 -2 65"
        fill="none"
        stroke="#1F1F1F"
        strokeWidth="6"
      />

      <rect
        x="-18"
        y="150"
        width="16"
        height="60"
        fill="#3B5B33"
        transform="rotate(8 -10 150)"
      />

      <rect
        x="4"
        y="150"
        width="16"
        height="60"
        fill="#2F4A29"
        transform="rotate(-6 12 150)"
      />

      <ellipse
        cx="-14"
        cy="212"
        rx="14"
        ry="8"
        fill="#1B1B1B"
      />

      <ellipse
        cx="24"
        cy="210"
        rx="14"
        ry="8"
        fill="#1B1B1B"
      />

      <rect
        x="-30"
        y="70"
        width="56"
        height="85"
        rx="14"
        fill="#3F6E37"
      />

      <rect
        x="-30"
        y="70"
        width="56"
        height="20"
        rx="10"
        fill="#355C2E"
      />

      <path
        d="M-30 90 Q-60 105 -66 140"
        stroke="#3F6E37"
        strokeWidth="16"
        fill="none"
        strokeLinecap="round"
      />

      <path
        d="M26 90 Q64 100 82 118"
        stroke="#3F6E37"
        strokeWidth="16"
        fill="none"
        strokeLinecap="round"
      />

      <circle
        cx="-67"
        cy="142"
        r="9"
        fill="#1B1B1B"
      />

      <circle
        cx="84"
        cy="117"
        r="9"
        fill="#1B1B1B"
      />

      <line
        x1="84"
        y1="117"
        x2="140"
        y2="128"
        stroke="#1B1B1B"
        strokeWidth="5"
      />

      <g opacity="0.6" fill="#DCEFEA">
        <circle cx="150" cy="130" r="4" />
        <circle cx="165" cy="140" r="5" />
        <circle cx="180" cy="150" r="6" />
        <circle cx="195" cy="162" r="7" />
        <circle cx="160" cy="118" r="3" />
        <circle cx="178" cy="128" r="4" />
      </g>

      <circle
        cx="-2"
        cy="45"
        r="26"
        fill="#E9B98C"
      />

      <path
        d="M-28 40 Q-2 5 24 40 Q24 20 -2 12 Q-28 20 -28 40Z"
        fill="#3F6E37"
      />

      <rect
        x="-16"
        y="46"
        width="30"
        height="14"
        rx="7"
        fill="#FFFFFF"
        stroke="#CFCFCF"
      />

      <circle
        cx="-4"
        cy="53"
        r="2"
        fill="#333"
      />

      <circle
        cx="10"
        cy="53"
        r="2"
        fill="#333"
      />
    </g>

    <g fill="#3E7A45" opacity="0.9">
      <ellipse
        cx="30"
        cy="440"
        rx="20"
        ry="8"
        transform="rotate(-20 30 440)"
      />

      <ellipse
        cx="10"
        cy="455"
        rx="24"
        ry="9"
        transform="rotate(-10 10 455)"
      />
    </g>
  </svg>
);

const DotGrid = () => (
  <svg
    className="dot-grid"
    viewBox="0 0 60 60"
    xmlns="http://www.w3.org/2000/svg"
  >
    {Array.from({ length: 4 }).map(
      (_, row) =>
        Array.from({ length: 4 }).map(
          (_, column) => (
            <circle
              key={`${row}-${column}`}
              cx={8 + column * 15}
              cy={8 + row * 15}
              r="2.5"
              fill="#BFE0C1"
            />
          )
        )
    )}
  </svg>
);

function getErrorMessage(error) {
  const responseData = error.response?.data;

  if (typeof responseData === "string") {
    return responseData;
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData?.error) {
    return responseData.error;
  }

  if (
    responseData &&
    typeof responseData === "object"
  ) {
    const firstMessage = Object.values(
      responseData
    ).find(
      (value) => typeof value === "string"
    );

    if (firstMessage) {
      return firstMessage;
    }
  }

  if (!error.response) {
    return "Unable to connect to the server.";
  }

  return "Registration failed. Please try again.";
}

const Registration = () => {
  const navigate = useNavigate();

  const [form, setForm] =
    useState(INITIAL_FORM);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const [submitting, setSubmitting] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const updateField = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    let nextValue =
      type === "checkbox" ? checked : value;

    if (name === "phone") {
      nextValue = value
        .replace(/\D/g, "")
        .slice(0, 10);
    }

    setForm((currentForm) => ({
      ...currentForm,
      [name]: nextValue,
    }));

    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
      }));
    }

    if (message) {
      setMessage(null);
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName =
        "Full name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone =
        "Mobile number is required.";
    } else if (
      !/^[0-9]{10}$/.test(form.phone.trim())
    ) {
      nextErrors.phone =
        "Mobile number must contain 10 digits.";
    }

    if (!form.password) {
      nextErrors.password =
        "Password is required.";
    } else if (form.password.length < 6) {
      nextErrors.password =
        "Password must contain at least 6 characters.";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      form.confirmPassword !== form.password
    ) {
      nextErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (!form.acceptedTerms) {
      nextErrors.acceptedTerms =
        "You must accept the Terms and Privacy Policy.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage(null);

    if (!validate()) {
      return;
    }

    const registrationRequest = {
      fullName: form.fullName.trim(),

      email: form.email
        .trim()
        .toLowerCase(),

      phone: form.phone.trim(),

      password: form.password,

      role: "CUSTOMER",
    };

    try {
      setSubmitting(true);

      await api.post(
        "/users/register",
        registrationRequest
      );

      setMessage({
        type: "success",
        text:
          "Registration successful. Please login with your email and password.",
      });

      setForm(INITIAL_FORM);

      window.setTimeout(() => {
        navigate("/login", {
          replace: true,

          state: {
            registrationSuccess: true,
          },
        });
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: getErrorMessage(error),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-left">
        <DotGrid />

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
          Safe Environment,
          <br />

          <span className="hero-heading-accent">
            Healthy Life.
          </span>
        </h2>

        <p className="hero-description">
          Join us to manage pest control services
          efficiently and keep your surroundings
          pest-free.
        </p>

        <div className="feature-list">
          <div className="feature-card">
            <div className="feature-icon">
              <HiOutlineShieldCheck />
            </div>

            <div className="feature-text">
              <h3>Professional Service</h3>

              <p>
                Trained experts for effective pest
                control.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaLeaf />
            </div>

            <div className="feature-text">
              <h3>
                Safe &amp; Eco-Friendly
              </h3>

              <p>
                We use safe methods for your family
                and pets.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <HiOutlineClock />
            </div>

            <div className="feature-text">
              <h3>Timely Support</h3>

              <p>
                Quick response and reliable service
                at every time.
              </p>
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
            Protecting your home, health and
            environment with trusted pest control
            solutions.
          </p>
        </div>
      </div>

      <div className="registration-right">
        <div className="registration-card">
          <div className="registration-card-icon">
            <HiOutlineUserAdd />
          </div>

          <h2 className="welcome-heading">
            Create Your{" "}
            <span className="welcome-heading-accent">
              Account
            </span>
          </h2>

          <p className="welcome-subtitle">
            Register to get started with Pest
            Control Management System
          </p>

          <div className="divider">
            <span className="divider-line" />
            <FaLeaf className="divider-icon" />
            <span className="divider-line" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="registration-form"
            noValidate
          >
            <div className="form-columns">
              {/* LEFT COLUMN */}
              <div className="form-col">

                {/* Full Name */}
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>

                  <div
                    className={`input-wrapper ${errors.fullName ? "input-wrapper-error" : ""
                      }`}
                  >
                    <HiOutlineUser className="input-icon" />

                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={form.fullName}
                      onChange={updateField}
                    />
                  </div>

                  {errors.fullName && (
                    <span className="registration-field-error">
                      {errors.fullName}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>

                  <div
                    className={`input-wrapper ${errors.email ? "input-wrapper-error" : ""
                      }`}
                  >
                    <HiOutlineMail className="input-icon" />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={form.email}
                      onChange={updateField}
                    />
                  </div>

                  {errors.email && (
                    <span className="registration-field-error">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    Confirm Password
                  </label>

                  <div
                    className={`input-wrapper ${errors.confirmPassword
                        ? "input-wrapper-error"
                        : ""
                      }`}
                  >
                    <HiOutlineLockClosed className="input-icon" />

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Confirm your password"
                      value={form.confirmPassword}
                      onChange={updateField}
                    />

                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) => !prev
                        )
                      }
                    >
                      {showConfirmPassword ? (
                        <HiOutlineEyeOff />
                      ) : (
                        <HiOutlineEye />
                      )}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <span className="registration-field-error">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>

              </div>

              {/* RIGHT COLUMN */}
              <div className="form-col">

                {/* Mobile */}
                <div className="form-group">
                  <label htmlFor="phone">
                    Mobile Number
                  </label>

                  <div
                    className={`input-wrapper ${errors.phone ? "input-wrapper-error" : ""
                      }`}
                  >
                    <HiOutlineDeviceMobile className="input-icon" />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      maxLength={10}
                      placeholder="Enter 10-digit mobile number"
                      value={form.phone}
                      onChange={updateField}
                    />
                  </div>

                  {errors.phone && (
                    <span className="registration-field-error">
                      {errors.phone}
                    </span>
                  )}
                </div>

                {/* Password */}
                <div className="form-group">
                  <label htmlFor="password">
                    Password
                  </label>

                  <div
                    className={`input-wrapper ${errors.password ? "input-wrapper-error" : ""
                      }`}
                  >
                    <HiOutlineLockClosed className="input-icon" />

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword ? "text" : "password"
                      }
                      placeholder="Create password"
                      value={form.password}
                      onChange={updateField}
                    />

                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                    >
                      {showPassword ? (
                        <HiOutlineEyeOff />
                      ) : (
                        <HiOutlineEye />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <span className="registration-field-error">
                      {errors.password}
                    </span>
                  )}
                </div>

                {/* Customer Account Card */}
                <div className="registration-info-box">
                  <HiOutlineShieldCheck className="info-icon" />

                  <div>
                    <strong>Customer Account</strong>

                    <span>
                      You can complete your address and profile
                      after registration.
                    </span>
                  </div>
                </div>

              </div>
            </div>

            <label className="checkbox-label terms-row">
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={form.acceptedTerms}
                onChange={updateField}
              />

              <span>
                I agree to the{" "}
                <a href="#terms">
                  Terms &amp; Conditions
                </a>{" "}
                and{" "}
                <a href="#privacy">
                  Privacy Policy
                </a>
              </span>
            </label>

            {errors.acceptedTerms && (
              <span className="registration-field-error registration-terms-error">
                {errors.acceptedTerms}
              </span>
            )}

            {message && (
              <div
                className={`registration-message ${message.type === "success"
                  ? "registration-message-success"
                  : "registration-message-error"
                  }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              <HiOutlineUserAdd />

              {submitting
                ? "Creating Account..."
                : "Register"}
            </button>
          </form>

          <p className="register-text">
            Already have an account?{" "}
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

export default Registration;