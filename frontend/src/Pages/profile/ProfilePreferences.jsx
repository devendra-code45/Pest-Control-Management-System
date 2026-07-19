import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Eye,
  Globe2,
  Languages,
  LayoutDashboard,
  Mail,
  Megaphone,
  Monitor,
  Moon,
  Palette,
  Smartphone,
  Sun,
} from 'lucide-react';
import './ProfilePreferences.css';

const DEFAULT_PREFERENCES = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  marketingNotifications: false,
  theme: 'light',
  language: 'English (US)',
  timeZone: '(GMT+05:30) Asia/Kolkata',
  defaultPage: 'Dashboard',
};

function ProfilePreferences() {
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState(() => {
    try {
      const storedPreferences = localStorage.getItem(
        'pest-control-profile-preferences',
      );

      return storedPreferences
        ? {
            ...DEFAULT_PREFERENCES,
            ...JSON.parse(storedPreferences),
          }
        : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const [feedback, setFeedback] = useState('');

  const savePreferences = (updatedPreferences) => {
    setPreferences(updatedPreferences);

    try {
      localStorage.setItem(
        'pest-control-profile-preferences',
        JSON.stringify(updatedPreferences),
      );
    } catch {
      // The UI continues to work even when browser storage is unavailable.
    }

    setFeedback('Preferences updated successfully.');

    window.clearTimeout(savePreferences.feedbackTimer);

    savePreferences.feedbackTimer = window.setTimeout(() => {
      setFeedback('');
    }, 2500);
  };

  const handleToggle = (fieldName) => {
    savePreferences({
      ...preferences,
      [fieldName]: !preferences[fieldName],
    });
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;

    savePreferences({
      ...preferences,
      [name]: value,
    });
  };

  const handleThemeChange = (theme) => {
    savePreferences({
      ...preferences,
      theme,
    });
  };

  return (
    <main className="profile-preferences-page">
      <header className="profile-preferences-header">
        <div>
          <nav
            className="profile-preferences-breadcrumb"
            aria-label="Preferences breadcrumb"
          >
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>

            <ChevronRight size={15} aria-hidden="true" />

            <button
              type="button"
              onClick={() => navigate('/profile')}
            >
              Profile
            </button>

            <ChevronRight size={15} aria-hidden="true" />

            <span aria-current="page">Preferences</span>
          </nav>

          <h1>Preferences</h1>

          <p>
            Manage your account preferences and customize your
            experience.
          </p>
        </div>

        <button
          type="button"
          className="profile-preferences-back-button"
          onClick={() => navigate('/profile')}
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Back to Profile
        </button>
      </header>

      {feedback && (
        <div
          className="profile-preferences-feedback"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={18} aria-hidden="true" />
          <span>{feedback}</span>
        </div>
      )}

      <section className="profile-preferences-card">
        <div className="profile-preferences-section-heading">
          <div className="profile-preferences-section-icon">
            <Bell size={23} aria-hidden="true" />
          </div>

          <div>
            <h2>Notification Preferences</h2>
            <p>Choose how you want to receive notifications.</p>
          </div>
        </div>

        <div className="profile-preferences-notification-list">
          <div className="profile-preferences-notification-row">
            <div className="profile-preferences-row-copy">
              <div className="profile-preferences-row-icon">
                <Mail size={21} aria-hidden="true" />
              </div>

              <div>
                <h3>Email Notifications</h3>
                <p>
                  Receive important updates and alerts via email.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={preferences.emailNotifications}
              aria-label="Toggle email notifications"
              className={`profile-preferences-switch ${
                preferences.emailNotifications
                  ? 'profile-preferences-switch-active'
                  : ''
              }`}
              onClick={() => handleToggle('emailNotifications')}
            >
              <span />
            </button>
          </div>

          <div className="profile-preferences-notification-row">
            <div className="profile-preferences-row-copy">
              <div className="profile-preferences-row-icon">
                <Smartphone size={21} aria-hidden="true" />
              </div>

              <div>
                <h3>SMS Notifications</h3>
                <p>Receive important updates and alerts via SMS.</p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={preferences.smsNotifications}
              aria-label="Toggle SMS notifications"
              className={`profile-preferences-switch ${
                preferences.smsNotifications
                  ? 'profile-preferences-switch-active'
                  : ''
              }`}
              onClick={() => handleToggle('smsNotifications')}
            >
              <span />
            </button>
          </div>

          <div className="profile-preferences-notification-row">
            <div className="profile-preferences-row-copy">
              <div className="profile-preferences-row-icon">
                <Bell size={21} aria-hidden="true" />
              </div>

              <div>
                <h3>Push Notifications</h3>
                <p>Receive push notifications in your browser.</p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={preferences.pushNotifications}
              aria-label="Toggle push notifications"
              className={`profile-preferences-switch ${
                preferences.pushNotifications
                  ? 'profile-preferences-switch-active'
                  : ''
              }`}
              onClick={() => handleToggle('pushNotifications')}
            >
              <span />
            </button>
          </div>

          <div className="profile-preferences-notification-row">
            <div className="profile-preferences-row-copy">
              <div className="profile-preferences-row-icon">
                <Megaphone size={21} aria-hidden="true" />
              </div>

              <div>
                <h3>Marketing &amp; Promotions</h3>
                <p>
                  Receive updates about new services, offers and
                  promotions.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={preferences.marketingNotifications}
              aria-label="Toggle marketing and promotion notifications"
              className={`profile-preferences-switch ${
                preferences.marketingNotifications
                  ? 'profile-preferences-switch-active'
                  : ''
              }`}
              onClick={() =>
                handleToggle('marketingNotifications')
              }
            >
              <span />
            </button>
          </div>
        </div>
      </section>

      <section className="profile-preferences-card">
        <div className="profile-preferences-section-heading">
          <div className="profile-preferences-section-icon">
            <Palette size={23} aria-hidden="true" />
          </div>

          <div>
            <h2>Theme Preferences</h2>
            <p>Choose your preferred theme for the application.</p>
          </div>
        </div>

        <div
          className="profile-preferences-theme-grid"
          role="radiogroup"
          aria-label="Application theme"
        >
          <button
            type="button"
            role="radio"
            aria-checked={preferences.theme === 'light'}
            className={`profile-preferences-theme-option ${
              preferences.theme === 'light'
                ? 'profile-preferences-theme-option-active'
                : ''
            }`}
            onClick={() => handleThemeChange('light')}
          >
            <span className="profile-preferences-theme-icon">
              <Sun size={25} aria-hidden="true" />
            </span>

            <span className="profile-preferences-theme-copy">
              <strong>Light Mode</strong>
              <small>Use light theme</small>
            </span>

            <span
              className="profile-preferences-radio"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={preferences.theme === 'dark'}
            className={`profile-preferences-theme-option ${
              preferences.theme === 'dark'
                ? 'profile-preferences-theme-option-active'
                : ''
            }`}
            onClick={() => handleThemeChange('dark')}
          >
            <span className="profile-preferences-theme-icon">
              <Moon size={25} aria-hidden="true" />
            </span>

            <span className="profile-preferences-theme-copy">
              <strong>Dark Mode</strong>
              <small>Use dark theme</small>
            </span>

            <span
              className="profile-preferences-radio"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={preferences.theme === 'system'}
            className={`profile-preferences-theme-option ${
              preferences.theme === 'system'
                ? 'profile-preferences-theme-option-active'
                : ''
            }`}
            onClick={() => handleThemeChange('system')}
          >
            <span className="profile-preferences-theme-icon">
              <Monitor size={25} aria-hidden="true" />
            </span>

            <span className="profile-preferences-theme-copy">
              <strong>System Default</strong>
              <small>Use system theme</small>
            </span>

            <span
              className="profile-preferences-radio"
              aria-hidden="true"
            />
          </button>
        </div>
      </section>

      <section className="profile-preferences-card">
        <div className="profile-preferences-section-heading">
          <div className="profile-preferences-section-icon">
            <Globe2 size={23} aria-hidden="true" />
          </div>

          <div>
            <h2>Language &amp; Region</h2>
            <p>
              Select your preferred language and regional settings.
            </p>
          </div>
        </div>

        <div className="profile-preferences-form-grid">
          <div className="profile-preferences-field">
            <label htmlFor="preferences-language">
              Language
            </label>

            <div className="profile-preferences-select-wrapper">
              <Languages size={18} aria-hidden="true" />

              <select
                id="preferences-language"
                name="language"
                value={preferences.language}
                onChange={handleSelectChange}
              >
                <option value="English (US)">English (US)</option>
                <option value="English (India)">
                  English (India)
                </option>
                <option value="Hindi">Hindi</option>
                <option value="Marathi">Marathi</option>
              </select>
            </div>
          </div>

          <div className="profile-preferences-field">
            <label htmlFor="preferences-time-zone">
              Region / Time Zone
            </label>

            <div className="profile-preferences-select-wrapper">
              <Globe2 size={18} aria-hidden="true" />

              <select
                id="preferences-time-zone"
                name="timeZone"
                value={preferences.timeZone}
                onChange={handleSelectChange}
              >
                <option value="(GMT+05:30) Asia/Kolkata">
                  (GMT+05:30) Asia/Kolkata
                </option>
                <option value="(GMT+00:00) UTC">
                  (GMT+00:00) UTC
                </option>
                <option value="(GMT+01:00) Europe/London">
                  (GMT+01:00) Europe/London
                </option>
                <option value="(GMT-05:00) America/New_York">
                  (GMT-05:00) America/New_York
                </option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-preferences-card">
        <div className="profile-preferences-section-heading">
          <div className="profile-preferences-section-icon">
            <Eye size={23} aria-hidden="true" />
          </div>

          <div>
            <h2>Other Preferences</h2>
            <p>Manage other application preferences.</p>
          </div>
        </div>

        <div className="profile-preferences-other-row">
          <div className="profile-preferences-row-copy">
            <div className="profile-preferences-row-icon">
              <ClipboardList size={21} aria-hidden="true" />
            </div>

            <div>
              <h3>Default Page</h3>
              <p>Choose the page you want to see after login.</p>
            </div>
          </div>

          <label className="profile-preferences-default-page">
            <span className="profile-preferences-visually-hidden">
              Default page after login
            </span>

            <LayoutDashboard size={18} aria-hidden="true" />

            <select
              name="defaultPage"
              value={preferences.defaultPage}
              onChange={handleSelectChange}
            >
              <option value="Dashboard">Dashboard</option>
              <option value="Bookings">Bookings</option>
              <option value="Customers">Customers</option>
              <option value="Services">Services</option>
              <option value="Reports">Reports</option>
            </select>
          </label>
        </div>
      </section>
    </main>
  );
}

export default ProfilePreferences;