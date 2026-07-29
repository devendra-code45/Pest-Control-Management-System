import React, {
  useEffect,
  useRef,
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
  HiOutlineInformationCircle,
} from "react-icons/hi";

import { FaLeaf } from "react-icons/fa";

import api from "../../api/axios";
import RecoveryIllustration from "./RecoveryIllustration";
import "./VerifyEmail.css";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

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

  return "OTP verification failed.";
}

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState(
    Array(OTP_LENGTH).fill("")
  );

  const [secondsLeft, setSecondsLeft] =
    useState(RESEND_SECONDS);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [verifying, setVerifying] =
    useState(false);

  const [resending, setResending] =
    useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) =>
        current > 0 ? current - 1 : 0
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  if (!email) {
    return (
      <Navigate
        to="/forgot-password"
        replace
      />
    );
  }

  const formatTime = (seconds) => {
    const minutes = String(
      Math.floor(seconds / 60)
    ).padStart(2, "0");

    const remainingSeconds = String(
      seconds % 60
    ).padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
  };

  const handleChange = (index, value) => {
    const digit = value
      .replace(/\D/g, "")
      .slice(-1);

    const nextOtp = [...otp];
    nextOtp[index] = digit;

    setOtp(nextOtp);
    setError("");
    setMessage("");

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowLeft" &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowRight" &&
      index < OTP_LENGTH - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pastedOtp = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("");

    if (pastedOtp.length === 0) {
      return;
    }

    const nextOtp =
      Array(OTP_LENGTH).fill("");

    pastedOtp.forEach((digit, index) => {
      nextOtp[index] = digit;
    });

    setOtp(nextOtp);
    setError("");

    const focusIndex = Math.min(
      pastedOtp.length,
      OTP_LENGTH
    ) - 1;

    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async (event) => {
    event.preventDefault();

    const code = otp.join("");

    if (code.length !== OTP_LENGTH) {
      setError(
        "Please enter the complete 6-digit OTP."
      );
      return;
    }

    try {
      setVerifying(true);
      setError("");
      setMessage("");

      await api.post("/users/verify-otp", {
        email,
        otp: code,
      });

      navigate("/reset-password", {
        replace: true,
        state: {
          email,
          otp: code,
        },
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || resending) {
      return;
    }

    try {
      setResending(true);
      setError("");
      setMessage("");

      await api.post("/users/forgot-password", {
        email,
      });

      setOtp(Array(OTP_LENGTH).fill(""));
      setSecondsLeft(RESEND_SECONDS);

      setMessage(
        "A new OTP has been sent to your email."
      );

      inputRefs.current[0]?.focus();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verify-email-page">
      <div className="verify-email-left">
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

      <div className="verify-email-right">
        <div className="verify-email-badge">
          <HiOutlineShieldCheck />
          Secure Verification
        </div>

        <div className="verify-email-card">
          <div className="verify-email-card-icon">
            <HiOutlineMail />

            <HiOutlineShieldCheck className="verify-email-card-icon-check" />
          </div>

          <h2 className="welcome-heading">
            Verify{" "}
            <span className="welcome-heading-accent">
              Your Email
            </span>
          </h2>

          <p className="welcome-subtitle">
            We have sent a 6-digit verification code
            to
            <br />

            <span className="email-highlight">
              {email}
            </span>
          </p>

          <div className="divider">
            <span className="divider-line" />
            <FaLeaf className="divider-icon" />
            <span className="divider-line" />
          </div>

          <form
            onSubmit={handleVerify}
            className="verify-email-form"
          >
            <div className="otp-group">
              <label>Enter 6-Digit OTP</label>

              <div
                className="otp-inputs"
                onPaste={handlePaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] =
                        element;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className={`otp-box ${
                      digit ? "filled" : ""
                    } ${
                      error ? "otp-error" : ""
                    }`}
                    value={digit}
                    onChange={(event) =>
                      handleChange(
                        index,
                        event.target.value
                      )
                    }
                    onKeyDown={(event) =>
                      handleKeyDown(index, event)
                    }
                    aria-label={`OTP digit ${
                      index + 1
                    }`}
                  />
                ))}
              </div>

              {error && (
                <p className="otp-error-text">
                  {error}
                </p>
              )}

              {message && (
                <p className="form-success-text">
                  {message}
                </p>
              )}
            </div>

            <p className="resend-text">
              Didn&apos;t receive the code?{" "}

              {secondsLeft > 0 ? (
                <>
                  Resend OTP in{" "}
                  <span className="resend-timer">
                    {formatTime(secondsLeft)}
                  </span>
                </>
              ) : (
                <button
                  type="button"
                  className="resend-link"
                  onClick={handleResend}
                  disabled={resending}
                >
                  {resending
                    ? "Sending..."
                    : "Resend OTP"}
                </button>
              )}
            </p>

            <div className="info-box">
              <HiOutlineInformationCircle className="info-box-icon" />

              <p>
                Please check your inbox and spam
                folder for the verification code.
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={verifying}
            >
              <HiOutlineShieldCheck />

              {verifying
                ? "Verifying OTP..."
                : "Verify OTP"}
            </button>

            <Link
              to="/forgot-password"
              className="btn btn-outline"
            >
              <HiOutlineArrowLeft />
              Back to Forgot Password
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

export default VerifyEmail;