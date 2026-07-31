import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Camera,
  CheckCircle2,
  ChevronRight,
  Info,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  Save,
  User,
  Users,
} from 'lucide-react';
import api from '../../api/axios';
import './profile.css';

const INITIAL_PROFILE = {
  fullName: 'Administrator',
  email: '',
  phone: '',
  role: 'Administrator',
  company: 'Pest Control Management System',
  employeeId: '',
  location: 'Not added',
  department: 'Administration',
  bio: '',
};

function mapUserToProfile(user) {
  return {
    fullName:
      user.fullName || 'Administrator',
    email: user.email || '',
    phone: user.phone || '',
    role:
      user.role === 'ADMIN'
        ? 'Administrator'
        : user.role || 'Administrator',
    company: 'Pest Control Management System',
    employeeId: user.id
      ? `ADMIN-${String(user.id).padStart(4, '0')}`
      : '',
    location:
      [
        user.address,
        user.city,
        user.pincode,
      ]
        .filter(Boolean)
        .join(', ') || 'Not added',
    department: 'Administration',
    bio: '',
  };
}

function Profile() {
  const navigate = useNavigate();
  const imageInputRef = useRef(null);

  const [savedProfile, setSavedProfile] =
    useState(INITIAL_PROFILE);

  const [formData, setFormData] =
    useState(INITIAL_PROFILE);

  const [profileImage, setProfileImage] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [errors, setErrors] =
    useState({});

  const [message, setMessage] = useState({
    type: '',
    text: '',
  });

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          '/users/profile'
        );

        if (cancelled) {
          return;
        }

        const loadedProfile =
          mapUserToProfile(
            response.data || {}
          );

        setSavedProfile(loadedProfile);
        setFormData(loadedProfile);

        setProfileImage(
          response.data?.profileImage || ''
        );

        setMessage({
          type: '',
          text: '',
        });
      } catch (error) {
        if (!cancelled) {
          setMessage({
            type: 'error',
            text:
              error.response?.data?.message ||
              error.response?.data?.error ||
              (typeof error.response?.data ===
              'string'
                ? error.response.data
                : 'Unable to load profile information.'),
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/admin/dashboard');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }));

    setMessage({
      type: '',
      text: '',
    });
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.fullName.trim()) {
      validationErrors.fullName = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      validationErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = 'Enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      validationErrors.phone = 'Phone number is required.';
    }

    if (!formData.role) {
      validationErrors.role = 'Select a role.';
    }

    if (!formData.location.trim()) {
      validationErrors.location = 'Location is required.';
    }

    if (!formData.department) {
      validationErrors.department = 'Select a department.';
    }

    if (formData.bio.length > 250) {
      validationErrors.bio = 'Bio cannot exceed 250 characters.';
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      setMessage({
        type: 'error',
        text: 'Correct the highlighted fields before saving.',
      });

      return;
    }

    setSavedProfile(formData);

    setMessage({
      type: 'success',
      text: 'Personal information saved successfully.',
    });
  };

  const handleImageSelect = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      setMessage({
        type: 'error',
        text: 'Select a valid image file.',
      });

      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfileImage(String(reader.result));

      setMessage({
        type: 'success',
        text: 'Profile image preview updated.',
      });
    };

    reader.onerror = () => {
      setMessage({
        type: 'error',
        text: 'The selected image could not be loaded.',
      });
    };

    reader.readAsDataURL(selectedFile);
    event.target.value = '';
  };

  return (
    <main className="profile-info-page">
      <header className="profile-info-header">
        <div className="profile-info-header-copy">
          <nav
            className="profile-info-breadcrumb"
            aria-label="Profile breadcrumb"
          >
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
            >
              Dashboard
            </button>

            <ChevronRight size={15} aria-hidden="true" />

            <span>Profile</span>

            <ChevronRight size={15} aria-hidden="true" />

            <span aria-current="page">Personal Information</span>
          </nav>

          <div className="profile-info-title-row">
            <div className="profile-info-title-icon">
              <User size={30} aria-hidden="true" />
            </div>

            <div>
              <h1>Personal Information</h1>
              <p>
                Update your personal details and contact information.
              </p>
            </div>
          </div>
        </div>

        <div className="profile-info-header-actions">
          <button
            type="button"
            className="profile-info-outline-button"
            onClick={handleBack}
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Back to Profile
          </button>

          <button
            type="submit"
            form="profile-information-form"
            className="profile-info-primary-button"
          >
            <Save size={18} aria-hidden="true" />
            Save Changes
          </button>
        </div>
      </header>

      {loading && (
        <div
          className="profile-info-message"
          role="status"
        >
          <Info size={18} aria-hidden="true" />
          <span>Loading profile information...</span>
        </div>
      )}

      {message.text && (
        <div
          className={`profile-info-message profile-info-message-${message.type}`}
          role={message.type === 'error' ? 'alert' : 'status'}
        >
          {message.type === 'success' ? (
            <CheckCircle2 size={18} aria-hidden="true" />
          ) : (
            <Info size={18} aria-hidden="true" />
          )}

          <span>{message.text}</span>
        </div>
      )}

      <div className="profile-info-layout">
        <aside
          className="profile-info-summary-card"
          aria-label="Profile summary"
        >
          <div className="profile-info-avatar-section">
            <div className="profile-info-avatar-wrapper">
              <div className="profile-info-avatar">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Selected profile preview"
                  />
                ) : (
                  <span
                    aria-label={`${savedProfile.fullName} initials`}
                  >
                    {savedProfile.fullName
                      .split(' ')
                      .filter(Boolean)
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase() || 'AD'}
                  </span>
                )}
              </div>

              <button
                type="button"
                className="profile-info-camera-button"
                aria-label="Select a new profile image"
                onClick={() => imageInputRef.current?.click()}
              >
                <Camera size={21} aria-hidden="true" />
              </button>

              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="profile-info-hidden-input"
                onChange={handleImageSelect}
              />
            </div>

            <div className="profile-info-identity">
              <div className="profile-info-name">
                <h2>{savedProfile.fullName}</h2>
                <BadgeCheck
                  size={21}
                  aria-label="Verified profile"
                />
              </div>

              <p>{savedProfile.role}</p>

              <div className="profile-info-company">
                <Building2 size={18} aria-hidden="true" />
                <span>{savedProfile.company}</span>
              </div>
            </div>
          </div>

          <div className="profile-info-statistics">
            <div>
              <strong>124</strong>
              <span>Services</span>
            </div>

            <div>
              <strong>98%</strong>
              <span>Rating</span>
            </div>

            <div>
              <strong>2+</strong>
              <span>Years</span>
            </div>
          </div>

          <dl className="profile-info-details">
            <div>
              <dt>
                <Mail size={18} aria-hidden="true" />
                <span>Email</span>
              </dt>
              <dd>{savedProfile.email}</dd>
            </div>

            <div>
              <dt>
                <Phone size={18} aria-hidden="true" />
                <span>Phone</span>
              </dt>
              <dd>{savedProfile.phone}</dd>
            </div>

            <div>
              <dt>
                <BriefcaseBusiness size={18} aria-hidden="true" />
                <span>Employee ID</span>
              </dt>
              <dd>{savedProfile.employeeId}</dd>
            </div>

            <div>
              <dt>
                <User size={18} aria-hidden="true" />
                <span>Role</span>
              </dt>
              <dd>{savedProfile.role}</dd>
            </div>

            <div>
              <dt>
                <MapPin size={18} aria-hidden="true" />
                <span>Location</span>
              </dt>
              <dd>{savedProfile.location}</dd>
            </div>
          </dl>

          <div className="profile-info-account-status">
            <CheckCircle2 size={30} aria-hidden="true" />

            <div>
              <strong>Active Account</strong>
              <span>Last login: 16 Jul 2026, 02:47 PM</span>
            </div>
          </div>
        </aside>

        <section className="profile-info-form-card">
          <div className="profile-info-section-heading">
            <div className="profile-info-section-icon">
              <BriefcaseBusiness size={24} aria-hidden="true" />
            </div>

            <div>
              <h2>Personal Information</h2>
              <p>
                Update your personal details and contact information.
              </p>
            </div>
          </div>

          <form
            id="profile-information-form"
            className="profile-info-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="profile-info-form-grid">
              <div className="profile-info-field">
                <label htmlFor="profile-full-name">
                  Full Name <span>*</span>
                </label>

                <div className="profile-info-input-wrapper">
                  <User size={19} aria-hidden="true" />

                  <input
                    id="profile-full-name"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={
                      errors.fullName
                        ? 'profile-full-name-error'
                        : undefined
                    }
                  />
                </div>

                {errors.fullName && (
                  <small
                    id="profile-full-name-error"
                    className="profile-info-error"
                  >
                    {errors.fullName}
                  </small>
                )}
              </div>

              <div className="profile-info-field">
                <label htmlFor="profile-email">
                  Email Address <span>*</span>
                </label>

                <div className="profile-info-input-wrapper">
                  <Mail size={19} aria-hidden="true" />

                  <input
                    id="profile-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    readOnly
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email
                        ? 'profile-email-error'
                        : undefined
                    }
                  />
                </div>

                {errors.email && (
                  <small
                    id="profile-email-error"
                    className="profile-info-error"
                  >
                    {errors.email}
                  </small>
                )}
              </div>

              <div className="profile-info-field">
                <label htmlFor="profile-phone">
                  Phone Number <span>*</span>
                </label>

                <div className="profile-info-input-wrapper">
                  <Phone size={19} aria-hidden="true" />

                  <input
                    id="profile-phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={
                      errors.phone
                        ? 'profile-phone-error'
                        : undefined
                    }
                  />
                </div>

                {errors.phone && (
                  <small
                    id="profile-phone-error"
                    className="profile-info-error"
                  >
                    {errors.phone}
                  </small>
                )}
              </div>

              <div className="profile-info-field">
                <label htmlFor="profile-role">
                  Role <span>*</span>
                </label>

                <div className="profile-info-input-wrapper">
                  <User size={19} aria-hidden="true" />

                  <select
                    id="profile-role"
                    name="role"
                    value={formData.role}
                    disabled
                    aria-invalid={Boolean(errors.role)}
                    aria-describedby={
                      errors.role
                        ? 'profile-role-error'
                        : undefined
                    }
                  >
                    <option value="">Select role</option>
                    <option value="Administrator">
                      Administrator
                    </option>
                    <option value="Operations Manager">
                      Operations Manager
                    </option>
                    <option value="Service Manager">
                      Service Manager
                    </option>
                    <option value="Technician">Technician</option>
                  </select>
                </div>

                {errors.role && (
                  <small
                    id="profile-role-error"
                    className="profile-info-error"
                  >
                    {errors.role}
                  </small>
                )}
              </div>

              <div className="profile-info-field">
                <label htmlFor="profile-company">Company</label>

                <div className="profile-info-input-wrapper">
                  <Building2 size={19} aria-hidden="true" />

                  <input
                    id="profile-company"
                    name="company"
                    type="text"
                    value={formData.company}
                    readOnly
                  />
                </div>
              </div>

              <div className="profile-info-field">
                <label htmlFor="profile-employee-id">
                  Employee ID
                </label>

                <div className="profile-info-input-wrapper">
                  <BriefcaseBusiness
                    size={19}
                    aria-hidden="true"
                  />

                  <input
                    id="profile-employee-id"
                    name="employeeId"
                    type="text"
                    value={formData.employeeId}
                    readOnly
                  />
                </div>
              </div>

              <div className="profile-info-field">
                <label htmlFor="profile-location">
                  Location <span>*</span>
                </label>

                <div className="profile-info-input-wrapper">
                  <MapPin size={19} aria-hidden="true" />

                  <input
                    id="profile-location"
                    name="location"
                    type="text"
                    value={formData.location}
                    readOnly
                    aria-invalid={Boolean(errors.location)}
                    aria-describedby={
                      errors.location
                        ? 'profile-location-error'
                        : undefined
                    }
                  />
                </div>

                {errors.location && (
                  <small
                    id="profile-location-error"
                    className="profile-info-error"
                  >
                    {errors.location}
                  </small>
                )}
              </div>

              <div className="profile-info-field">
                <label htmlFor="profile-department">
                  Department
                </label>

                <div className="profile-info-input-wrapper">
                  <Users size={19} aria-hidden="true" />

                  <select
                    id="profile-department"
                    name="department"
                    value={formData.department}
                    disabled
                    aria-invalid={Boolean(errors.department)}
                    aria-describedby={
                      errors.department
                        ? 'profile-department-error'
                        : undefined
                    }
                  >
                    <option value="">Select department</option>
                    <option value="Operations">Operations</option>
                    <option value="Administration">
                      Administration
                    </option>
                    <option value="Customer Service">
                      Customer Service
                    </option>
                    <option value="Finance">Finance</option>
                    <option value="Field Services">
                      Field Services
                    </option>
                  </select>
                </div>

                {errors.department && (
                  <small
                    id="profile-department-error"
                    className="profile-info-error"
                  >
                    {errors.department}
                  </small>
                )}
              </div>
            </div>

            <div className="profile-info-field profile-info-bio-field">
              <label htmlFor="profile-bio">Bio / About</label>

              <div className="profile-info-textarea-wrapper">
                <PencilLine size={19} aria-hidden="true" />

                <textarea
                  id="profile-bio"
                  name="bio"
                  rows={4}
                  maxLength={250}
                  value={formData.bio}
                  readOnly
                  aria-invalid={Boolean(errors.bio)}
                  aria-describedby="profile-bio-counter"
                />

                <span
                  id="profile-bio-counter"
                  className="profile-info-character-counter"
                >
                  {formData.bio.length}/250
                </span>
              </div>

              {errors.bio && (
                <small className="profile-info-error">
                  {errors.bio}
                </small>
              )}
            </div>

            <div className="profile-info-form-notice">
              <Info size={20} aria-hidden="true" />
              <span>
                Ensure your information is accurate and up to date.
              </span>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Profile;