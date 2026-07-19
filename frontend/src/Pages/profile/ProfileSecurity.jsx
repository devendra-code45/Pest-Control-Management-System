import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Info,
  LockKeyhole,
  LogOut,
  Mail,
  Monitor,
  Save,
  ShieldCheck,
  Smartphone,
  X,
} from 'lucide-react';
import './ProfileSecurity.css';

const INITIAL_PASSWORDS = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const INITIAL_SESSIONS = [
  {
    id: 1,
    device: 'Windows',
    browser: 'Chrome',
    location: 'Pune, Maharashtra, India',
    dateTime: '16 Jul 2026, 02:47 PM',
    current: true,
  },
  {
    id: 2,
    device: 'Android',
    browser: 'Chrome Mobile',
    location: 'Pune, Maharashtra, India',
    dateTime: '15 Jul 2026, 09:12 AM',
    current: false,
  },
];

function ProfileSecurity() {
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState(INITIAL_PASSWORDS);

  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({
    type: '',
    message: '',
  });

  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [authenticatorEnabled, setAuthenticatorEnabled] = useState(true);
  const [backupEmailEnabled, setBackupEmailEnabled] = useState(true);
  const [authenticatorPanelOpen, setAuthenticatorPanelOpen] =
    useState(false);
  const [backupEmailPanelOpen, setBackupEmailPanelOpen] =
    useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupEmail, setBackupEmail] = useState(
    'manishbhoi@example.com',
  );

  const passwordRequirements = {
    minimumLength: passwords.newPassword.length >= 8,
    uppercase: /[A-Z]/.test(passwords.newPassword),
    lowercase: /[a-z]/.test(passwords.newPassword),
    number: /\d/.test(passwords.newPassword),
    specialCharacter: /[^A-Za-z0-9]/.test(
      passwords.newPassword,
    ),
  };

  const allPasswordRequirementsMet = Object.values(
    passwordRequirements,
  ).every(Boolean);

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswords((currentPasswords) => ({
      ...currentPasswords,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }));

    setFeedback({
      type: '',
      message: '',
    });
  };

  const togglePasswordVisibility = (fieldName) => {
    setPasswordVisibility((currentVisibility) => ({
      ...currentVisibility,
      [fieldName]: !currentVisibility[fieldName],
    }));
  };

  const validatePasswordForm = () => {
    const validationErrors = {};

    if (!passwords.currentPassword.trim()) {
      validationErrors.currentPassword =
        'Current password is required.';
    }

    if (!passwords.newPassword) {
      validationErrors.newPassword = 'New password is required.';
    } else if (!allPasswordRequirementsMet) {
      validationErrors.newPassword =
        'Password must meet all the listed requirements.';
    }

    if (!passwords.confirmPassword) {
      validationErrors.confirmPassword =
        'Confirm your new password.';
    } else if (
      passwords.newPassword !== passwords.confirmPassword
    ) {
      validationErrors.confirmPassword =
        'New password and confirmation do not match.';
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (!validatePasswordForm()) {
      setFeedback({
        type: 'error',
        message:
          'Correct the highlighted password fields before continuing.',
      });

      return;
    }

    setPasswords(INITIAL_PASSWORDS);
    setErrors({});
    setPasswordVisibility({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    });

    setFeedback({
      type: 'success',
      message: 'Password updated successfully.',
    });
  };

  const handlePasswordCancel = () => {
    setPasswords(INITIAL_PASSWORDS);
    setErrors({});
    setPasswordVisibility({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    });

    setFeedback({
      type: '',
      message: '',
    });
  };

  const handleVerifyAuthenticator = () => {
    if (!/^\d{6}$/.test(verificationCode)) {
      setFeedback({
        type: 'error',
        message:
          'Enter the valid six-digit code from your authenticator application.',
      });

      return;
    }

    setAuthenticatorEnabled(true);
    setVerificationCode('');
    setAuthenticatorPanelOpen(false);

    setFeedback({
      type: 'success',
      message: 'Authenticator application verified successfully.',
    });
  };

  const handleDisableAuthenticator = () => {
    const shouldDisable = window.confirm(
      'Are you sure you want to disable authenticator app verification?',
    );

    if (!shouldDisable) {
      return;
    }

    setAuthenticatorEnabled(false);
    setAuthenticatorPanelOpen(false);
    setVerificationCode('');

    setFeedback({
      type: 'success',
      message: 'Authenticator application has been disabled.',
    });
  };

  const handleSaveBackupEmail = () => {
    const isValidEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(backupEmail);

    if (!isValidEmail) {
      setFeedback({
        type: 'error',
        message: 'Enter a valid backup email address.',
      });

      return;
    }

    setBackupEmailEnabled(true);
    setBackupEmailPanelOpen(false);

    setFeedback({
      type: 'success',
      message: 'Backup email updated successfully.',
    });
  };

  const handleDisableBackupEmail = () => {
    const shouldDisable = window.confirm(
      'Are you sure you want to disable backup email verification?',
    );

    if (!shouldDisable) {
      return;
    }

    setBackupEmailEnabled(false);
    setBackupEmailPanelOpen(false);

    setFeedback({
      type: 'success',
      message: 'Backup email verification has been disabled.',
    });
  };

  const handleLogoutSession = (sessionId) => {
    const selectedSession = sessions.find(
      (session) => session.id === sessionId,
    );

    if (!selectedSession || selectedSession.current) {
      return;
    }

    const shouldLogout = window.confirm(
      `Log out the ${selectedSession.device} · ${selectedSession.browser} session?`,
    );

    if (!shouldLogout) {
      return;
    }

    setSessions((currentSessions) =>
      currentSessions.filter(
        (session) => session.id !== sessionId,
      ),
    );

    setFeedback({
      type: 'success',
      message: 'The selected device session has been logged out.',
    });
  };

  const handleLogoutAllOtherSessions = () => {
    const otherSessions = sessions.filter(
      (session) => !session.current,
    );

    if (otherSessions.length === 0) {
      setFeedback({
        type: 'error',
        message: 'There are no other active sessions to log out.',
      });

      return;
    }

    const shouldLogout = window.confirm(
      'Are you sure you want to log out from all other devices?',
    );

    if (!shouldLogout) {
      return;
    }

    setSessions((currentSessions) =>
      currentSessions.filter((session) => session.current),
    );

    setFeedback({
      type: 'success',
      message: 'All other device sessions have been logged out.',
    });
  };

  return (
    <main className="profile-security-page">
      <header className="profile-security-header">
        <div>
          <nav
            className="profile-security-breadcrumb"
            aria-label="Security breadcrumb"
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

            <span aria-current="page">Security</span>
          </nav>

          <h1>Security</h1>

          <p>
            Manage your password and account security settings.
          </p>
        </div>

        <button
          type="button"
          className="profile-security-back-button"
          onClick={() => navigate('/profile')}
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Back to Profile
        </button>
      </header>

      {feedback.message && (
        <div
          className={`profile-security-feedback profile-security-feedback-${feedback.type}`}
          role={feedback.type === 'error' ? 'alert' : 'status'}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 size={19} aria-hidden="true" />
          ) : (
            <Info size={19} aria-hidden="true" />
          )}

          <span>{feedback.message}</span>
        </div>
      )}

      <section className="profile-security-card">
        <div className="profile-security-section-heading">
          <div className="profile-security-section-icon">
            <LockKeyhole size={23} aria-hidden="true" />
          </div>

          <div>
            <h2>Change Password</h2>
            <p>
              Update your password regularly to keep your account
              secure.
            </p>
          </div>
        </div>

        <form
          className="profile-security-password-form"
          onSubmit={handlePasswordSubmit}
          noValidate
        >
          <div className="profile-security-field">
            <label htmlFor="security-current-password">
              Current Password <span>*</span>
            </label>

            <div className="profile-security-password-input">
              <LockKeyhole size={18} aria-hidden="true" />

              <input
                id="security-current-password"
                name="currentPassword"
                type={
                  passwordVisibility.currentPassword
                    ? 'text'
                    : 'password'
                }
                value={passwords.currentPassword}
                placeholder="Enter your current password"
                autoComplete="current-password"
                onChange={handlePasswordChange}
                aria-invalid={Boolean(errors.currentPassword)}
                aria-describedby={
                  errors.currentPassword
                    ? 'security-current-password-error'
                    : undefined
                }
              />

              <button
                type="button"
                className="profile-security-visibility-button"
                aria-label={
                  passwordVisibility.currentPassword
                    ? 'Hide current password'
                    : 'Show current password'
                }
                aria-pressed={
                  passwordVisibility.currentPassword
                }
                onClick={() =>
                  togglePasswordVisibility('currentPassword')
                }
              >
                {passwordVisibility.currentPassword ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
              </button>
            </div>

            {errors.currentPassword && (
              <small
                id="security-current-password-error"
                className="profile-security-error"
              >
                {errors.currentPassword}
              </small>
            )}
          </div>

          <div className="profile-security-field">
            <label htmlFor="security-new-password">
              New Password <span>*</span>
            </label>

            <div className="profile-security-password-input">
              <LockKeyhole size={18} aria-hidden="true" />

              <input
                id="security-new-password"
                name="newPassword"
                type={
                  passwordVisibility.newPassword
                    ? 'text'
                    : 'password'
                }
                value={passwords.newPassword}
                placeholder="Enter your new password"
                autoComplete="new-password"
                onChange={handlePasswordChange}
                aria-invalid={Boolean(errors.newPassword)}
                aria-describedby="security-password-requirements"
              />

              <button
                type="button"
                className="profile-security-visibility-button"
                aria-label={
                  passwordVisibility.newPassword
                    ? 'Hide new password'
                    : 'Show new password'
                }
                aria-pressed={passwordVisibility.newPassword}
                onClick={() =>
                  togglePasswordVisibility('newPassword')
                }
              >
                {passwordVisibility.newPassword ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
              </button>
            </div>

            <ul
              id="security-password-requirements"
              className="profile-security-requirements"
            >
              <li
                className={
                  passwordRequirements.minimumLength
                    ? 'profile-security-requirement-complete'
                    : ''
                }
              >
                <CheckCircle2 size={14} aria-hidden="true" />
                At least 8 characters
              </li>

              <li
                className={
                  passwordRequirements.uppercase
                    ? 'profile-security-requirement-complete'
                    : ''
                }
              >
                <CheckCircle2 size={14} aria-hidden="true" />
                One uppercase letter
              </li>

              <li
                className={
                  passwordRequirements.lowercase
                    ? 'profile-security-requirement-complete'
                    : ''
                }
              >
                <CheckCircle2 size={14} aria-hidden="true" />
                One lowercase letter
              </li>

              <li
                className={
                  passwordRequirements.number
                    ? 'profile-security-requirement-complete'
                    : ''
                }
              >
                <CheckCircle2 size={14} aria-hidden="true" />
                One number
              </li>

              <li
                className={
                  passwordRequirements.specialCharacter
                    ? 'profile-security-requirement-complete'
                    : ''
                }
              >
                <CheckCircle2 size={14} aria-hidden="true" />
                One special character
              </li>
            </ul>

            {errors.newPassword && (
              <small className="profile-security-error">
                {errors.newPassword}
              </small>
            )}
          </div>

          <div className="profile-security-field">
            <label htmlFor="security-confirm-password">
              Confirm New Password <span>*</span>
            </label>

            <div className="profile-security-password-input">
              <LockKeyhole size={18} aria-hidden="true" />

              <input
                id="security-confirm-password"
                name="confirmPassword"
                type={
                  passwordVisibility.confirmPassword
                    ? 'text'
                    : 'password'
                }
                value={passwords.confirmPassword}
                placeholder="Confirm your new password"
                autoComplete="new-password"
                onChange={handlePasswordChange}
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={
                  errors.confirmPassword
                    ? 'security-confirm-password-error'
                    : undefined
                }
              />

              <button
                type="button"
                className="profile-security-visibility-button"
                aria-label={
                  passwordVisibility.confirmPassword
                    ? 'Hide confirmed password'
                    : 'Show confirmed password'
                }
                aria-pressed={
                  passwordVisibility.confirmPassword
                }
                onClick={() =>
                  togglePasswordVisibility('confirmPassword')
                }
              >
                {passwordVisibility.confirmPassword ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <small
                id="security-confirm-password-error"
                className="profile-security-error"
              >
                {errors.confirmPassword}
              </small>
            )}
          </div>

          <div className="profile-security-password-actions">
            <button
              type="button"
              className="profile-security-cancel-button"
              onClick={handlePasswordCancel}
            >
              <X size={18} aria-hidden="true" />
              Cancel
            </button>

            <button
              type="submit"
              className="profile-security-primary-button"
            >
              <Save size={18} aria-hidden="true" />
              Update Password
            </button>
          </div>
        </form>
      </section>

      <section className="profile-security-card">
        <div className="profile-security-section-heading">
          <div className="profile-security-section-icon">
            <ShieldCheck size={23} aria-hidden="true" />
          </div>

          <div>
            <h2>Two-Factor Authentication (2FA)</h2>
            <p>
              Add an extra layer of security to your account by
              enabling two-factor authentication.
            </p>
          </div>
        </div>

        <div className="profile-security-authentication-list">
          <button
            type="button"
            className="profile-security-authentication-row"
            aria-expanded={authenticatorPanelOpen}
            onClick={() => {
              setAuthenticatorPanelOpen((current) => !current);
              setBackupEmailPanelOpen(false);
            }}
          >
            <span className="profile-security-authentication-copy">
              <span className="profile-security-row-icon">
                <Smartphone size={20} aria-hidden="true" />
              </span>

              <span>
                <strong>Authenticator App</strong>
                <small>
                  Get a verification code from an authenticator app
                </small>
              </span>
            </span>

            <span className="profile-security-authentication-action">
              <span
                className={`profile-security-status-badge ${
                  authenticatorEnabled
                    ? 'profile-security-status-enabled'
                    : 'profile-security-status-disabled'
                }`}
              >
                {authenticatorEnabled ? 'Enabled' : 'Disabled'}
              </span>

              <ChevronRight size={19} aria-hidden="true" />
            </span>
          </button>

          {authenticatorPanelOpen && (
            <div className="profile-security-management-panel">
              <div>
                <h3>Authenticator App Setup</h3>
                <p>
                  Enter the six-digit verification code from your
                  authenticator application.
                </p>
              </div>

              <div className="profile-security-management-form">
                <label htmlFor="security-verification-code">
                  Verification Code
                </label>

                <input
                  id="security-verification-code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={verificationCode}
                  placeholder="000000"
                  onChange={(event) =>
                    setVerificationCode(
                      event.target.value.replace(/\D/g, ''),
                    )
                  }
                />

                <div className="profile-security-management-actions">
                  <button
                    type="button"
                    className="profile-security-cancel-button"
                    onClick={() => {
                      setAuthenticatorPanelOpen(false);
                      setVerificationCode('');
                    }}
                  >
                    Cancel
                  </button>

                  {authenticatorEnabled && (
                    <button
                      type="button"
                      className="profile-security-danger-button"
                      onClick={handleDisableAuthenticator}
                    >
                      Disable
                    </button>
                  )}

                  <button
                    type="button"
                    className="profile-security-primary-button"
                    onClick={handleVerifyAuthenticator}
                  >
                    Verify Code
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            className="profile-security-authentication-row"
            aria-expanded={backupEmailPanelOpen}
            onClick={() => {
              setBackupEmailPanelOpen((current) => !current);
              setAuthenticatorPanelOpen(false);
            }}
          >
            <span className="profile-security-authentication-copy">
              <span className="profile-security-row-icon">
                <Mail size={20} aria-hidden="true" />
              </span>

              <span>
                <strong>Backup Email</strong>
                <small>
                  Receive verification codes on your backup email
                </small>
              </span>
            </span>

            <span className="profile-security-authentication-action">
              <span className="profile-security-backup-email">
                {backupEmail}
              </span>

              <span
                className={`profile-security-status-badge ${
                  backupEmailEnabled
                    ? 'profile-security-status-enabled'
                    : 'profile-security-status-disabled'
                }`}
              >
                {backupEmailEnabled ? 'Enabled' : 'Disabled'}
              </span>

              <ChevronRight size={19} aria-hidden="true" />
            </span>
          </button>

          {backupEmailPanelOpen && (
            <div className="profile-security-management-panel">
              <div>
                <h3>Backup Email</h3>
                <p>
                  Enter the email address that should receive backup
                  verification codes.
                </p>
              </div>

              <div className="profile-security-management-form">
                <label htmlFor="security-backup-email">
                  Backup Email Address
                </label>

                <input
                  id="security-backup-email"
                  type="email"
                  value={backupEmail}
                  onChange={(event) =>
                    setBackupEmail(event.target.value)
                  }
                />

                <div className="profile-security-management-actions">
                  <button
                    type="button"
                    className="profile-security-cancel-button"
                    onClick={() =>
                      setBackupEmailPanelOpen(false)
                    }
                  >
                    Cancel
                  </button>

                  {backupEmailEnabled && (
                    <button
                      type="button"
                      className="profile-security-danger-button"
                      onClick={handleDisableBackupEmail}
                    >
                      Disable
                    </button>
                  )}

                  <button
                    type="button"
                    className="profile-security-primary-button"
                    onClick={handleSaveBackupEmail}
                  >
                    Save Email
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="profile-security-card">
        <div className="profile-security-section-heading">
          <div className="profile-security-section-icon">
            <Monitor size={23} aria-hidden="true" />
          </div>

          <div>
            <h2>Active Sessions</h2>
            <p>
              Manage your active sessions across different devices.
            </p>
          </div>
        </div>

        <div className="profile-security-session-list">
          {sessions.map((session) => (
            <article
              className="profile-security-session-row"
              key={session.id}
            >
              <div className="profile-security-session-details">
                <span className="profile-security-row-icon">
                  {session.device === 'Android' ? (
                    <Smartphone size={20} aria-hidden="true" />
                  ) : (
                    <Monitor size={20} aria-hidden="true" />
                  )}
                </span>

                <div>
                  <div className="profile-security-session-title">
                    <strong>
                      {session.device} · {session.browser}
                    </strong>

                    {session.current && (
                      <span className="profile-security-current-badge">
                        Current Session
                      </span>
                    )}
                  </div>

                  <p>
                    {session.location}
                    <span>•</span>
                    {session.dateTime}
                  </p>
                </div>
              </div>

              <div className="profile-security-session-action">
                {session.current ? (
                  <span className="profile-security-this-device">
                    This Device
                  </span>
                ) : (
                  <button
                    type="button"
                    className="profile-security-session-logout"
                    onClick={() =>
                      handleLogoutSession(session.id)
                    }
                  >
                    Log Out
                    <LogOut size={18} aria-hidden="true" />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="profile-security-session-notice">
          <div>
            <Info size={20} aria-hidden="true" />

            <p>
              If you see any suspicious activity, log out from all
              other devices and change your password immediately.
            </p>
          </div>

          <button
            type="button"
            className="profile-security-logout-all-button"
            onClick={handleLogoutAllOtherSessions}
            disabled={
              !sessions.some((session) => !session.current)
            }
          >
            <LogOut size={18} aria-hidden="true" />
            Log Out All Other Sessions
          </button>
        </div>
      </section>
    </main>
  );
}

export default ProfileSecurity;