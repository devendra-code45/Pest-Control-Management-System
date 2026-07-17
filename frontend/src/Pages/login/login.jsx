import React, { useState } from 'react';
import {
  Home,
  ShieldCheck,
  Leaf,
  Clock,
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
} from 'lucide-react';
import './login.css';

// ----------------------------------------------------------------------------
// Small reusable pieces
// ----------------------------------------------------------------------------

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18z"
    />
    <path
      fill="#FBBC05"
      d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33z"
    />
    <path
      fill="#EA4335"
      d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58z"
    />
  </svg>
);

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Professional Service',
    text: 'Trained experts for effective pest control.',
  },
  {
    icon: Leaf,
    title: 'Safe & Eco-Friendly',
    text: 'We use safe methods for your family and pets.',
  },
  {
    icon: Clock,
    title: 'Timely Support',
    text: 'Quick response and reliable service at every time.',
  },
];

// ----------------------------------------------------------------------------
// Decorative scene (original illustration, not a reproduction)
// ----------------------------------------------------------------------------

const PestControlScene = () => (
  <svg className="scene" viewBox="0 0 520 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* sky accents */}
    <circle cx="440" cy="46" r="4" fill="#ffffff" opacity="0.6" />
    <circle cx="466" cy="60" r="3" fill="#ffffff" opacity="0.5" />
    <path d="M60 40 q14 -14 28 0" stroke="#ffffff" strokeWidth="2.5" fill="none" opacity="0.55" strokeLinecap="round" />
    <path d="M96 54 q11 -11 22 0" stroke="#ffffff" strokeWidth="2.5" fill="none" opacity="0.45" strokeLinecap="round" />

    {/* ground */}
    <path d="M0 300 Q260 270 520 300 L520 320 L0 320 Z" fill="#166534" opacity="0.35" />

    {/* house */}
    <g transform="translate(280,110)">
      <polygon points="70,0 150,55 0,55" fill="#f0fdf4" opacity="0.9" />
      <polygon points="70,0 150,55 140,55 70,12 8,55 0,55" fill="#15803d" opacity="0.5" />
      <rect x="14" y="55" width="120" height="95" fill="#ffffff" opacity="0.85" />
      <rect x="30" y="75" width="26" height="26" rx="3" fill="#bbf7d0" />
      <rect x="94" y="75" width="26" height="26" rx="3" fill="#bbf7d0" />
      <rect x="60" y="105" width="30" height="45" rx="2" fill="#166534" opacity="0.7" />
    </g>

    {/* shrubs */}
    <g fill="#22c55e" opacity="0.6">
      <circle cx="330" cy="255" r="16" />
      <circle cx="352" cy="260" r="20" />
      <circle cx="378" cy="255" r="14" />
      <circle cx="470" cy="270" r="18" />
      <circle cx="490" cy="275" r="12" />
    </g>

    {/* technician silhouette */}
    <g transform="translate(120,120)">
      {/* backpack sprayer */}
      <rect x="10" y="30" width="34" height="55" rx="10" fill="#166534" />
      <circle cx="27" cy="24" r="12" fill="#f59e0b" />
      <circle cx="27" cy="24" r="8" fill="#ffffff" opacity="0.9" />
      <path d="M27 16 L27 32 M19 24 L35 24" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />

      {/* body */}
      <rect x="34" y="40" width="46" height="70" rx="14" fill="#15803d" />
      {/* head */}
      <circle cx="57" cy="20" r="16" fill="#d6a27a" />
      <path d="M41 14 a16 16 0 0 1 32 0 v6 h-32 z" fill="#166534" />

      {/* arm holding wand */}
      <rect x="70" y="55" width="46" height="10" rx="5" fill="#166534" transform="rotate(8 70 55)" />
      <circle cx="118" cy="63" r="5" fill="#374151" />
      <path d="M120 63 L155 63" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
      <path d="M156 55 L172 40 M156 63 L176 63 M156 71 L172 86" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

      {/* legs */}
      <rect x="38" y="105" width="16" height="42" rx="6" fill="#166534" />
      <rect x="62" y="105" width="16" height="42" rx="6" fill="#166534" />
      <rect x="34" y="144" width="24" height="12" rx="5" fill="#1f2937" />
      <rect x="58" y="144" width="24" height="12" rx="5" fill="#1f2937" />
    </g>
  </svg>
);

// ----------------------------------------------------------------------------
// Main component
// ----------------------------------------------------------------------------

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [credentials, setCredentials] = useState({ identifier: '', password: '' });

  const updateField = (field) => (e) => {
    setCredentials((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire up to authentication API here.
  };

  return (
    <div className="login-page">
      {/* Left illustration panel */}
      <div className="login-illustration">
        <div className="brand">
          <span className="brand__icon">
            <Home size={22} />
          </span>
          <div className="brand__text">
            <h1>
              Pest<span>Control</span>
            </h1>
            <p>MANAGEMENT SYSTEM</p>
          </div>
        </div>

        <h2 className="illustration-headline">
          Safe Environment,
          <br />
          <span>Healthy Life.</span>
        </h2>
        <p className="illustration-subtext">
          Login to your account and manage pest control services easily and efficiently.
        </p>

        <ul className="feature-list">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <span className="feature-list__icon">
                <Icon size={18} />
              </span>
              <div>
                <p className="feature-list__title">{title}</p>
                <p className="feature-list__text">{text}</p>
              </div>
            </li>
          ))}
        </ul>

        <PestControlScene />

        <div className="illustration-banner">
          <span className="illustration-banner__icon">
            <ShieldCheck size={16} />
          </span>
          <p>Protecting your home, health and environment with trusted pest control solutions.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-form-panel">
        <div className="login-card">
          <div className="login-card__icon">
            <User size={26} />
            <span className="login-card__icon-badge">
              <Lock size={12} />
            </span>
          </div>

          <h2 className="login-card__title">
            Welcome <span>Back!</span>
          </h2>
          <p className="login-card__subtitle">
            Login to your account to continue
            <br />
            with Pest Control Management System
          </p>

          <div className="login-card__divider">
            <Leaf size={14} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="identifier">Username or Email</label>
              <div className="input-shell">
                <User size={17} className="input-shell__icon" />
                <input
                  id="identifier"
                  type="text"
                  placeholder="Enter your username or email"
                  value={credentials.identifier}
                  onChange={updateField('identifier')}
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <div className="input-shell">
                <Lock size={17} className="input-shell__icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={updateField('password')}
                />
                <button
                  type="button"
                  className="input-shell__toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="form-row">
              <label className="checkbox-field">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe((prev) => !prev)}
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot-password" className="link">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="btn btn--primary">
              <LogIn size={17} />
              Login
            </button>

            <div className="or-divider">
              <span>OR</span>
            </div>

            <button type="button" className="btn btn--outline">
              <GoogleIcon />
              Login with Google
            </button>

            <button type="button" className="btn btn--ghost">
              <Lock size={16} />
              Change Password
            </button>

            <p className="register-text">
              Don&apos;t have an account? <a href="#register">Register Here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;