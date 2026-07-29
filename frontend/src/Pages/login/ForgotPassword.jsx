import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineLockClosed,
  HiOutlineHome,
  HiOutlinePaperAirplane,
  HiOutlineArrowLeft,
  HiOutlineInformationCircle,
} from "react-icons/hi";

import { FaLeaf } from "react-icons/fa";

import api from "../../api/axios";
import RecoveryIllustration from "./RecoveryIllustration";
import "./ForgotPassword.css";

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

  return "Unable to send OTP. Please try again.";
}

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    if (!normalizedEmail) {
      setError("Email address is required.");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail
      )
    ) {
      setError("Enter a valid email address.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await api.post("/users/forgot-password", {
        email: normalizedEmail,
      });

      navigate("/verify-otp", {
        state: {
          email: normalizedEmail,
        },
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-left">
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

        <div className="floating-card">
          <div className="floating-card-icon">
            <HiOutlineShieldCheck />
          </div>

          <p>
            Your safety is our priority. Let&apos;s
            continue keeping your environment
            pest-free.
          </p>
        </div>
      </div>

      <div className="forgot-password-right">
        <div className="forgot-password-card">
          <div className="forgot-password-card-icon">
            <HiOutlineLockClosed />
            <HiOutlineMail className="forgot-password-card-icon-mail" />
          </div>

          <h2 className="welcome-heading">
            Forgot Your{" "}
            <span className="welcome-heading-accent">
              Password?
            </span>
          </h2>

          <p className="welcome-subtitle">
            Enter your registered email address.
            <br />
            We&apos;ll send a 6-digit OTP to verify
            your identity.
          </p>

          <div className="divider">
            <span className="divider-line" />
            <FaLeaf className="divider-icon" />
            <span className="divider-line" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="forgot-password-form"
            noValidate
          >
            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <div
                className={`input-wrapper ${
                  error ? "input-wrapper-error" : ""
                }`}
              >
                <HiOutlineUser className="input-icon" />

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your registered email address"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  autoComplete="email"
                />
              </div>

              {error && (
                <p className="form-error-text">
                  {error}
                </p>
              )}
            </div>

            <div className="info-box">
              <HiOutlineInformationCircle className="info-box-icon" />

              <p>
                We&apos;ll send a 6-digit OTP to
                your registered email address.
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              <HiOutlinePaperAirplane />

              {submitting
                ? "Sending OTP..."
                : "Send OTP"}
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

export default ForgotPassword;