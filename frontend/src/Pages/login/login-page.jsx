import { useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  ShieldCheck,
  Leaf,
  Clock,
  LogIn,
  ShieldPlus,
} from "lucide-react";
import "./login-page.css";

function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 620 520"
      className="hero-illustration"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ground */}
      <ellipse cx="310" cy="480" rx="300" ry="30" fill="#cfe7cd" opacity="0.6" />

      {/* clouds */}
      <g opacity="0.7" fill="#d7e9d4">
        <ellipse cx="120" cy="70" rx="46" ry="18" />
        <ellipse cx="150" cy="60" rx="34" ry="16" />
        <ellipse cx="330" cy="45" rx="40" ry="16" />
        <ellipse cx="360" cy="55" rx="28" ry="13" />
      </g>

      {/* birds */}
      <g stroke="#8fbf8a" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8">
        <path d="M430 90 q10 -12 20 0 q10 -12 20 0" />
        <path d="M470 110 q8 -10 16 0 q8 -10 16 0" />
      </g>

      {/* bushes back */}
      <g fill="#a9d3a3">
        <ellipse cx="60" cy="470" rx="70" ry="40" />
        <ellipse cx="560" cy="465" rx="80" ry="45" />
      </g>

      {/* house */}
      <g>
        <rect x="330" y="270" width="220" height="180" rx="4" fill="#f4f1e6" />
        <polygon points="320,275 440,190 560,275" fill="#1f5c33" />
        <rect x="420" y="205" width="40" height="30" fill="#eef7ea" opacity="0.5" />
        <rect x="355" y="310" width="55" height="60" rx="2" fill="#dff3e0" stroke="#1f5c33" strokeWidth="3" />
        <line x1="382.5" y1="310" x2="382.5" y2="370" stroke="#1f5c33" strokeWidth="3" />
        <line x1="355" y1="340" x2="410" y2="340" stroke="#1f5c33" strokeWidth="3" />
        <rect x="470" y="310" width="55" height="60" rx="2" fill="#dff3e0" stroke="#1f5c33" strokeWidth="3" />
        <line x1="497.5" y1="310" x2="497.5" y2="370" stroke="#1f5c33" strokeWidth="3" />
        <line x1="470" y1="340" x2="525" y2="340" stroke="#1f5c33" strokeWidth="3" />
        <rect x="415" y="380" width="50" height="70" rx="2" fill="#1f5c33" />
        <circle cx="455" cy="415" r="2.5" fill="#f4f1e6" />
        <rect x="405" y="450" width="70" height="10" fill="#d8d3c2" />
        <rect x="412" y="460" width="56" height="10" fill="#c9c3ae" />
      </g>

      {/* worker */}
      <g transform="translate(120,255)">
        <rect x="46" y="150" width="16" height="70" rx="6" fill="#14532d" />
        <rect x="40" y="215" width="26" height="14" rx="4" fill="#111" />
        <rect x="10" y="150" width="16" height="70" rx="6" fill="#166534" />
        <rect x="4" y="215" width="26" height="14" rx="4" fill="#111" />
        <rect x="6" y="70" width="66" height="90" rx="14" fill="#1f7a3f" />
        <rect x="44" y="30" width="34" height="80" rx="8" fill="#eef2ea" stroke="#1f5c33" strokeWidth="3" />
        <circle cx="61" cy="55" r="11" fill="#fff" stroke="#c23b2f" strokeWidth="3" />
        <line x1="53" y1="47" x2="69" y2="63" stroke="#c23b2f" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="57" cy="60" rx="6" ry="3" fill="#2b2b2b" />
        <rect x="40" y="24" width="14" height="10" rx="2" fill="#1f5c33" />
        <line x1="20" y1="72" x2="46" y2="34" stroke="#0f3d24" strokeWidth="6" strokeLinecap="round" />
        <line x1="55" y1="72" x2="70" y2="34" stroke="#0f3d24" strokeWidth="6" strokeLinecap="round" />
        <path d="M64 90 Q95 95 108 78" stroke="#1f7a3f" strokeWidth="14" strokeLinecap="round" fill="none" />
        <circle cx="112" cy="75" r="9" fill="#2b2b2b" />
        <path d="M14 90 Q-10 110 -18 140" stroke="#166534" strokeWidth="14" strokeLinecap="round" fill="none" />
        <circle cx="-19" cy="143" r="8" fill="#2b2b2b" />
        <line x1="112" y1="75" x2="150" y2="70" stroke="#2b2b2b" strokeWidth="5" strokeLinecap="round" />
        <g stroke="#bfe3c4" strokeWidth="3" strokeLinecap="round" opacity="0.85">
          <line x1="150" y1="68" x2="215" y2="35" />
          <line x1="150" y1="72" x2="220" y2="60" />
          <line x1="150" y1="76" x2="215" y2="90" />
          <line x1="150" y1="80" x2="205" y2="115" />
        </g>
        <circle cx="34" cy="40" r="26" fill="#e7b48a" />
        <path d="M8 34 a26 26 0 0 1 52 0 v-6 a26 12 0 0 0 -52 0 z" fill="#166534" />
        <rect x="2" y="26" width="64" height="10" rx="5" fill="#166534" />
        <rect x="16" y="46" width="36" height="18" rx="9" fill="#f2f2f2" stroke="#cfcfcf" strokeWidth="1.5" />
        <circle cx="25" cy="35" r="2.2" fill="#3a2a1c" />
        <circle cx="44" cy="35" r="2.2" fill="#3a2a1c" />
      </g>

      {/* front bushes */}
      <g fill="#8fc989">
        <ellipse cx="150" cy="500" rx="90" ry="26" />
        <ellipse cx="430" cy="505" rx="120" ry="28" />
      </g>
      <g fill="#79b975">
        <ellipse cx="90" cy="495" rx="50" ry="18" />
        <ellipse cx="510" cy="498" rx="60" ry="18" />
      </g>
    </svg>
  );
}

const features = [
  {
    icon: ShieldCheck,
    title: "Professional Service",
    desc: "Trained experts for effective pest control.",
  },
  {
    icon: Leaf,
    title: "Safe & Eco-Friendly",
    desc: "We use safe methods for your family and pets.",
  },
  {
    icon: Clock,
    title: "Timely Support",
    desc: "Quick response and reliable service at every time.",
  },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [form, setForm] = useState({ identifier: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="pc-page">
      <div className="pc-wrapper">
        {/* LEFT CARD */}
        <div className="pc-left">
          <div className="pc-logo">
            <div className="pc-logo-badge">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none">
                <path
                  d="M12 2 L21 6 V12 C21 17 17 20.5 12 22 C7 20.5 3 17 3 12 V6 Z"
                  stroke="#166534"
                  strokeWidth="1.6"
                  fill="none"
                />
                <path
                  d="M9 13 L11 15 L15 10"
                  stroke="#166534"
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <div className="pc-logo-text">
                <span className="pc-logo-dark">Pest</span>
                <span className="pc-logo-green">Control</span>
              </div>
              <div className="pc-logo-sub">MANAGEMENT SYSTEM</div>
            </div>
          </div>

          <h1 className="pc-heading">
            Safe Environment,
            <br />
            <span className="pc-heading-green">Healthy Life.</span>
          </h1>
          <div className="pc-divider-line" />

          <p className="pc-subtext">
            Login to your account and manage pest control services easily and
            efficiently.
          </p>

          <div className="pc-features">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="pc-feature">
                <div className="pc-feature-icon">
                  <Icon size={20} color="#15803d" strokeWidth={2} />
                </div>
                <div>
                  <div className="pc-feature-title">{title}</div>
                  <div className="pc-feature-desc">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pc-illustration-wrap">
            <HeroIllustration />
          </div>

          <div className="pc-banner">
            <div className="pc-banner-icon">
              <ShieldPlus size={18} color="white" strokeWidth={2} />
            </div>
            <p className="pc-banner-text">
              Protecting your home, health and environment with trusted pest
              control solutions.
            </p>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="pc-right">
          <div className="pc-card">
            <div className="pc-card-icon-wrap">
              <div className="pc-card-icon-outer">
                <div className="pc-card-icon-inner">
                  <User size={22} color="#15803d" strokeWidth={2} />
                </div>
              </div>
            </div>

            <h2 className="pc-card-title">
              Welcome <span className="pc-heading-green">Back!</span>
            </h2>
            <p className="pc-card-subtitle">
              Login to your account to continue
              <br /> with Pest Control Management System
            </p>

            <div className="pc-mini-divider">
              <span className="pc-mini-line" />
              <Leaf size={16} color="#16a34a" />
              <span className="pc-mini-line" />
            </div>

            <form onSubmit={handleSubmit} className="pc-form">
              <div className="pc-field">
                <label className="pc-label">Username or Email</label>
                <div className="pc-input-wrap">
                  <User size={18} className="pc-input-icon" />
                  <input
                    type="text"
                    value={form.identifier}
                    onChange={(e) =>
                      setForm({ ...form, identifier: e.target.value })
                    }
                    placeholder="Enter your username or email"
                    className="pc-input"
                  />
                </div>
              </div>

              <div className="pc-field">
                <label className="pc-label">Password</label>
                <div className="pc-input-wrap">
                  <Lock size={18} className="pc-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="Enter your password"
                    className="pc-input pc-input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="pc-eye-btn"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="pc-row-between">
                <label className="pc-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe((r) => !r)}
                    className="pc-checkbox-native"
                  />
                  <span
                    className={
                      "pc-checkbox-box" + (rememberMe ? " pc-checkbox-checked" : "")
                    }
                  >
                    {rememberMe && (
                      <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
                        <path
                          d="M2 6 L5 9 L10 3"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="pc-checkbox-text">Remember me</span>
                </label>
                <a href="#" className="pc-forgot-link">
                  Forgot Password?
                </a>
              </div>

              <button type="submit" className="pc-btn-primary">
                <LogIn size={18} />
                Login
              </button>

              <div className="pc-mini-divider">
                <span className="pc-mini-line" />
                <span className="pc-or-text">OR</span>
                <span className="pc-mini-line" />
              </div>

              <button type="button" className="pc-btn-outline">
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path
                    fill="#FFC107"
                    d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16 4 9.1 8.5 6.3 14.7z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35.4 26.8 36 24 36c-5.2 0-9.6-3.1-11.3-7.6l-6.5 5C9 39.4 15.9 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.7l6.3 5.3C40.9 36.4 44 30.8 44 24c0-1.3-.1-2.7-.4-3.5z"
                  />
                </svg>
                Login with Google
              </button>

              <button type="button" className="pc-btn-ghost">
                <Lock size={16} />
                Change Password
              </button>
            </form>

            <p className="pc-register-text">
              Don't have an account?{" "}
              <a href="#" className="pc-register-link">
                Register Here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}