import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiArrowRight,
  HiOutlineHome,
} from "react-icons/hi";
import { FaLeaf } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "./Login.css";

/* ------------------------------------------------------------------ */
/* Illustration — built from CSS/SVG shapes to approximate the scene   */
/* (house, worker, trees, clouds, birds) since no source asset file    */
/* was provided. Swap the whole block for an <img /> tag if you have   */
/* the real illustration file at src/assets/pest-control-illustration  */
/* ------------------------------------------------------------------ */
const PestControlIllustration = () => (
  <svg
    viewBox="0 0 760 460"
    className="illustration-svg"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* clouds */}
    <g opacity="0.55" fill="#E7F0E3">
      <ellipse cx="560" cy="60" rx="55" ry="20" />
      <ellipse cx="605" cy="50" rx="40" ry="16" />
      <ellipse cx="500" cy="120" rx="45" ry="16" />
      <ellipse cx="540" cy="112" rx="30" ry="12" />
    </g>

    {/* birds */}
    <g stroke="#9CB89A" strokeWidth="3" fill="none" strokeLinecap="round">
      <path d="M520 150 q8 -10 16 0 q8 -10 16 0" />
      <path d="M560 175 q6 -8 12 0 q6 -8 12 0" />
      <path d="M600 140 q6 -8 12 0 q6 -8 12 0" />
    </g>

    {/* ground */}
    <path d="M0 430 Q380 390 760 430 L760 460 L0 460 Z" fill="#CFE3C4" />
    <path d="M0 445 Q380 415 760 445 L760 460 L0 460 Z" fill="#BBD8AC" />

    {/* house */}
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

    {/* bushes */}
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

    {/* trees */}
    <g transform="translate(60,260)">
      <rect x="18" y="60" width="10" height="70" fill="#6B4A2F" />
      <circle cx="23" cy="45" r="42" fill="#3E7A45" />
      <circle cx="0" cy="65" r="30" fill="#4C8A4F" />
      <circle cx="46" cy="65" r="30" fill="#4C8A4F" />
    </g>

    {/* pest control worker */}
    <g transform="translate(300,230)">
      {/* backpack tank */}
      <rect x="-46" y="30" width="34" height="70" rx="6" fill="#F4F4F4" stroke="#2A2A2A" strokeWidth="2" />
      <circle cx="-29" cy="55" r="11" fill="#E11D2E" />
      <line x1="-37" y1="47" x2="-21" y2="63" stroke="#E11D2E" strokeWidth="3" />
      <path d="M-46 32 Q-60 40 -55 65" fill="none" stroke="#1F1F1F" strokeWidth="6" />
      <path d="M-12 34 Q4 40 -2 65" fill="none" stroke="#1F1F1F" strokeWidth="6" />

      {/* legs */}
      <rect x="-18" y="150" width="16" height="60" fill="#3B5B33" transform="rotate(8 -10 150)" />
      <rect x="4" y="150" width="16" height="60" fill="#2F4A29" transform="rotate(-6 12 150)" />
      <ellipse cx="-14" cy="212" rx="14" ry="8" fill="#1B1B1B" />
      <ellipse cx="24" cy="210" rx="14" ry="8" fill="#1B1B1B" />

      {/* body */}
      <rect x="-30" y="70" width="56" height="85" rx="14" fill="#3F6E37" />
      <rect x="-30" y="70" width="56" height="20" rx="10" fill="#355C2E" />

      {/* arms */}
      <path d="M-30 90 Q-60 105 -66 140" stroke="#3F6E37" strokeWidth="16" fill="none" strokeLinecap="round" />
      <path d="M26 90 Q64 100 82 118" stroke="#3F6E37" strokeWidth="16" fill="none" strokeLinecap="round" />
      <circle cx="-67" cy="142" r="9" fill="#1B1B1B" />
      <circle cx="84" cy="117" r="9" fill="#1B1B1B" />

      {/* spray nozzle + mist */}
      <line x1="84" y1="117" x2="140" y2="128" stroke="#1B1B1B" strokeWidth="5" />
      <g opacity="0.6" fill="#DCEFEA">
        <circle cx="150" cy="130" r="4" />
        <circle cx="165" cy="140" r="5" />
        <circle cx="180" cy="150" r="6" />
        <circle cx="195" cy="162" r="7" />
        <circle cx="160" cy="118" r="3" />
        <circle cx="178" cy="128" r="4" />
      </g>

      {/* head */}
      <circle cx="-2" cy="45" r="26" fill="#E9B98C" />
      <path d="M-28 40 Q-2 5 24 40 Q24 20 -2 12 Q-28 20 -28 40Z" fill="#3F6E37" />
      <rect x="-16" y="46" width="30" height="14" rx="7" fill="#FFFFFF" stroke="#CFCFCF" />
      <circle cx="-4" cy="53" r="2" fill="#333" />
      <circle cx="10" cy="53" r="2" fill="#333" />
    </g>

    {/* foreground leaves */}
    <g fill="#3E7A45" opacity="0.9">
      <ellipse cx="30" cy="440" rx="20" ry="8" transform="rotate(-20 30 440)" />
      <ellipse cx="10" cy="455" rx="24" ry="9" transform="rotate(-10 10 455)" />
    </g>
  </svg>
);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="login-page">
      {/* -------------------------- LEFT SIDE -------------------------- */}
      <div className="login-left">
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
          Safe Environment,
          <br />
          <span className="hero-heading-accent">Healthy Life.</span>
        </h2>

        <p className="hero-description">
          Login to your account and manage pest control services easily and
          efficiently.
        </p>

        <div className="feature-list">
          <div className="feature-card">
            <div className="feature-icon">
              <HiOutlineShieldCheck />
            </div>
            <div className="feature-text">
              <h3>Professional Service</h3>
              <p>Trained experts for effective pest control.</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaLeaf />
            </div>
            <div className="feature-text">
              <h3>Safe &amp; Eco-Friendly</h3>
              <p>We use safe methods for your family and pets.</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <HiOutlineClock />
            </div>
            <div className="feature-text">
              <h3>Timely Support</h3>
              <p>Quick response and reliable service at every time.</p>
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
            Protecting your home, health and environment with trusted pest
            control solutions.
          </p>
        </div>
      </div>

      {/* -------------------------- RIGHT SIDE -------------------------- */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-card-icon">
            <HiOutlineUser />
            <HiOutlineLockClosed className="login-card-icon-lock" />
          </div>

          <h2 className="welcome-heading">
            Welcome <span className="welcome-heading-accent">Back!</span>
          </h2>
          <p className="welcome-subtitle">
            Login to your account to continue
            <br />
            with Pest Control Management System
          </p>

          <div className="divider">
            <span className="divider-line" />
            <FaLeaf className="divider-icon" />
            <span className="divider-line" />
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username or Email</label>
              <div className="input-wrapper">
                <HiOutlineUser className="input-icon" />
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username or email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <HiOutlineLockClosed className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
            </div>

            <div className="form-row">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
              <a href="/forgot-password" className="forgot-link">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="btn btn-primary">
              <HiArrowRight />
              <a href="/dashboard" className="login-link">
                Login
              </a>
            </button>

            <div className="divider divider-or">
              <span className="divider-line" />
              <span className="divider-or-text">OR</span>
              <span className="divider-line" />
            </div>

            <button type="button" className="btn btn-google">
              <FcGoogle />
              Login with Google
            </button>
          </form>

          <p className="register-text">
            Don&apos;t have an account?{" "}
            <a href="/register" className="register-link">
              Register Here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
