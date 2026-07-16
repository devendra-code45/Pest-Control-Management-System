import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Save,
  ChevronDown,
  User,
  Users,
  CreditCard,
  Phone,
  Mail,
  Calendar,
  Droplet,
  Building,
  Award,
  Home,
  MapPin,
  Hash,
  Briefcase,
  Target,
  Globe,
  Clock,
  FileText,
  Car,
  Camera,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import './edittechnicianprofile.css';

// ----------------------------------------------------------------------------
// Reference options (would normally come from an API)
// ----------------------------------------------------------------------------

const GENDERS = ['Male', 'Female', 'Other'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const DEPARTMENTS = ['Operations', 'Sales', 'Customer Support', 'Administration'];
const DESIGNATIONS = ['Junior Technician', 'Technician', 'Senior Technician', 'Team Lead', 'Supervisor'];
const MANAGERS = ['Vikram Singh', 'Anita Rao', 'Manoj Verma', 'Kiran Reddy'];
const SKILLS = ['General Pest Control', 'Termite Treatment', 'Rodent Control', 'Fumigation', 'Bed Bug Treatment', 'Mosquito Control'];
const REGIONS = ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone'];
const SHIFTS = ['Day Shift', 'Night Shift', 'Rotational'];
const RELATIONS = ['Father', 'Mother', 'Brother', 'Sister', 'Spouse', 'Friend', 'Other'];
const STATUSES = ['Active', 'Inactive', 'On Leave', 'Suspended'];

const STATUS_DOT_CLASS = {
  Active: 'status-dot--active',
  Inactive: 'status-dot--inactive',
  'On Leave': 'status-dot--leave',
  Suspended: 'status-dot--suspended',
};

const GUIDELINES = [
  'Ensure all information is accurate and up to date.',
  'Phone number and email must be valid.',
  'Update skills and certifications regularly.',
  'Changes will be reflected in technician assignments.',
];

const initialForm = {
  firstName: 'Rahul',
  lastName: 'Sharma',
  employeeId: 'EMP-1004',
  phone: '9876543210',
  email: 'rahul.sharma@example.com',
  dob: '1992-08-12',
  gender: 'Male',
  bloodGroup: 'O+',
  joiningDate: '2019-03-15',
  department: 'Operations',
  designation: 'Senior Technician',
  reportingManager: 'Vikram Singh',
  streetAddress: '123, Green Park',
  city: 'Pune',
  state: 'Maharashtra',
  zip: '411038',
  experience: '5',
  primarySkill: 'General Pest Control',
  secondarySkill: 'Termite Treatment',
  region: 'North Zone',
  shift: 'Day Shift',
  licenseNo: 'PC-2019-MH-1024',
  licenseExpiry: '2025-12-20',
  vehicleNumber: 'MH12 AB 1234',
  emergencyName: 'Ramesh Sharma',
  emergencyRelation: 'Brother',
  emergencyPhone: '9876543200',
  status: 'Active',
  notes: 'Experienced technician with expertise in general pest control and termite treatment.',
};

// ----------------------------------------------------------------------------
// Small reusable field components
// ----------------------------------------------------------------------------

const FieldLabel = ({ children, required }) => (
  <label className="field-label">
    {children}
    {required && <span className="field-label__required">*</span>}
  </label>
);

const IconInput = ({ icon: Icon, ...props }) => (
  <div className="input-shell">
    <Icon size={16} className="input-shell__icon" />
    <input className="input-shell__field" {...props} />
  </div>
);

const IconSelect = ({ icon: Icon, options, ...props }) => (
  <div className="input-shell">
    <Icon size={16} className="input-shell__icon" />
    <select className="input-shell__field input-shell__field--select" {...props}>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <ChevronDown size={15} className="input-shell__chevron" />
  </div>
);

const SectionHeading = ({ icon: Icon, children }) => (
  <div className="section-heading">
    <span className="section-heading__icon">
      <Icon size={15} />
    </span>
    <h2>{children}</h2>
  </div>
);

// ----------------------------------------------------------------------------
// Main component
// ----------------------------------------------------------------------------

const EditTechnicianProfile = () => {
  const [form, setForm] = useState(initialForm);
  const [photoUrl, setPhotoUrl] = useState(null);
  const fileInputRef = useRef(null);

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoUrl(URL.createObjectURL(file));
    }
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire up to API integration here.
  };

  return (
    <div className="edit-technician-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href="#home" className="breadcrumb__link">
          Home
        </a>
        <span className="breadcrumb__separator">/</span>
        <a href="#technicians" className="breadcrumb__link">
          Technicians
        </a>
        <span className="breadcrumb__separator">/</span>
        <a href="#management" className="breadcrumb__link">
          Management
        </a>
        <span className="breadcrumb__separator">/</span>
        <span className="breadcrumb__current">Edit Technician Profile</span>
      </nav>

      {/* Page header */}
      <header className="page-header">
        <div>
          <h1 className="page-header__title">Edit Technician Profile</h1>
          <p className="page-header__subtitle">Update technician information and details.</p>
        </div>
        <div className="page-header__actions">
          <button type="button" className="btn btn--outline">
            <ArrowLeft size={16} />
            Back to Profile
          </button>
          <button type="submit" form="edit-technician-form" className="btn btn--success">
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </header>

      <form id="edit-technician-form" className="form-grid" onSubmit={handleSubmit}>
        {/* Main column */}
        <div className="form-main">
          {/* Personal Information */}
          <section className="form-card">
            <SectionHeading icon={User}>Personal Information</SectionHeading>

            <div className="field-grid field-grid--4">
              <div className="form-field">
                <FieldLabel required>First Name</FieldLabel>
                <IconInput
                  icon={User}
                  type="text"
                  value={form.firstName}
                  onChange={updateField('firstName')}
                />
              </div>
              <div className="form-field">
                <FieldLabel required>Last Name</FieldLabel>
                <IconInput
                  icon={User}
                  type="text"
                  value={form.lastName}
                  onChange={updateField('lastName')}
                />
              </div>
              <div className="form-field">
                <FieldLabel required>Employee ID</FieldLabel>
                <IconInput
                  icon={CreditCard}
                  type="text"
                  value={form.employeeId}
                  onChange={updateField('employeeId')}
                />
              </div>
              <div className="form-field">
                <FieldLabel required>Phone Number</FieldLabel>
                <IconInput
                  icon={Phone}
                  type="tel"
                  value={form.phone}
                  onChange={updateField('phone')}
                />
              </div>
            </div>

            <div className="field-grid field-grid--4">
              <div className="form-field">
                <FieldLabel required>Email Address</FieldLabel>
                <IconInput
                  icon={Mail}
                  type="email"
                  value={form.email}
                  onChange={updateField('email')}
                />
              </div>
              <div className="form-field">
                <FieldLabel required>Date of Birth</FieldLabel>
                <IconInput
                  icon={Calendar}
                  type="date"
                  value={form.dob}
                  onChange={updateField('dob')}
                />
              </div>
              <div className="form-field">
                <FieldLabel required>Gender</FieldLabel>
                <IconSelect icon={User} options={GENDERS} value={form.gender} onChange={updateField('gender')} />
              </div>
              <div className="form-field">
                <FieldLabel>Blood Group</FieldLabel>
                <IconSelect
                  icon={Droplet}
                  options={BLOOD_GROUPS}
                  value={form.bloodGroup}
                  onChange={updateField('bloodGroup')}
                />
              </div>
            </div>

            <div className="field-grid field-grid--4">
              <div className="form-field">
                <FieldLabel required>Joining Date</FieldLabel>
                <IconInput
                  icon={Calendar}
                  type="date"
                  value={form.joiningDate}
                  onChange={updateField('joiningDate')}
                />
              </div>
              <div className="form-field">
                <FieldLabel required>Department</FieldLabel>
                <IconSelect
                  icon={Building}
                  options={DEPARTMENTS}
                  value={form.department}
                  onChange={updateField('department')}
                />
              </div>
              <div className="form-field">
                <FieldLabel required>Designation</FieldLabel>
                <IconSelect
                  icon={Award}
                  options={DESIGNATIONS}
                  value={form.designation}
                  onChange={updateField('designation')}
                />
              </div>
              <div className="form-field form-field--last">
                <FieldLabel>Reporting Manager</FieldLabel>
                <IconSelect
                  icon={Users}
                  options={MANAGERS}
                  value={form.reportingManager}
                  onChange={updateField('reportingManager')}
                />
              </div>
            </div>
          </section>

          {/* Address Information */}
          <section className="form-card">
            <SectionHeading icon={MapPin}>Address Information</SectionHeading>

            <div className="form-field">
              <FieldLabel required>Street Address</FieldLabel>
              <IconInput
                icon={Home}
                type="text"
                value={form.streetAddress}
                onChange={updateField('streetAddress')}
              />
            </div>

            <div className="field-grid field-grid--3">
              <div className="form-field">
                <FieldLabel required>City</FieldLabel>
                <IconInput icon={Building} type="text" value={form.city} onChange={updateField('city')} />
              </div>
              <div className="form-field">
                <FieldLabel required>State</FieldLabel>
                <IconInput icon={MapPin} type="text" value={form.state} onChange={updateField('state')} />
              </div>
              <div className="form-field form-field--last">
                <FieldLabel required>ZIP / Postal Code</FieldLabel>
                <IconInput icon={Hash} type="text" value={form.zip} onChange={updateField('zip')} />
              </div>
            </div>
          </section>

          {/* Professional Details */}
          <section className="form-card">
            <SectionHeading icon={Briefcase}>Professional Details</SectionHeading>

            <div className="field-grid field-grid--4">
              <div className="form-field">
                <FieldLabel required>Experience (Years)</FieldLabel>
                <IconInput
                  icon={Briefcase}
                  type="number"
                  min="0"
                  value={form.experience}
                  onChange={updateField('experience')}
                />
              </div>
              <div className="form-field">
                <FieldLabel required>Primary Skill</FieldLabel>
                <IconSelect
                  icon={Target}
                  options={SKILLS}
                  value={form.primarySkill}
                  onChange={updateField('primarySkill')}
                />
              </div>
              <div className="form-field">
                <FieldLabel>Secondary Skill</FieldLabel>
                <IconSelect
                  icon={Target}
                  options={SKILLS}
                  value={form.secondarySkill}
                  onChange={updateField('secondarySkill')}
                />
              </div>
              <div className="form-field">
                <FieldLabel required>Region</FieldLabel>
                <IconSelect icon={Globe} options={REGIONS} value={form.region} onChange={updateField('region')} />
              </div>
            </div>

            <div className="field-grid field-grid--4">
              <div className="form-field">
                <FieldLabel required>Shift</FieldLabel>
                <IconSelect icon={Clock} options={SHIFTS} value={form.shift} onChange={updateField('shift')} />
              </div>
              <div className="form-field">
                <FieldLabel>License / Certification No.</FieldLabel>
                <IconInput
                  icon={FileText}
                  type="text"
                  value={form.licenseNo}
                  onChange={updateField('licenseNo')}
                />
              </div>
              <div className="form-field">
                <FieldLabel>License Expiry Date</FieldLabel>
                <IconInput
                  icon={Calendar}
                  type="date"
                  value={form.licenseExpiry}
                  onChange={updateField('licenseExpiry')}
                />
              </div>
              <div className="form-field form-field--last">
                <FieldLabel>Vehicle Number</FieldLabel>
                <IconInput
                  icon={Car}
                  type="text"
                  value={form.vehicleNumber}
                  onChange={updateField('vehicleNumber')}
                />
              </div>
            </div>
          </section>

          {/* Emergency Contact */}
          <section className="form-card">
            <SectionHeading icon={Phone}>Emergency Contact</SectionHeading>

            <div className="field-grid field-grid--3">
              <div className="form-field">
                <FieldLabel required>Contact Name</FieldLabel>
                <IconInput
                  icon={User}
                  type="text"
                  value={form.emergencyName}
                  onChange={updateField('emergencyName')}
                />
              </div>
              <div className="form-field">
                <FieldLabel required>Relation</FieldLabel>
                <IconSelect
                  icon={Users}
                  options={RELATIONS}
                  value={form.emergencyRelation}
                  onChange={updateField('emergencyRelation')}
                />
              </div>
              <div className="form-field form-field--last">
                <FieldLabel required>Phone Number</FieldLabel>
                <IconInput
                  icon={Phone}
                  type="tel"
                  value={form.emergencyPhone}
                  onChange={updateField('emergencyPhone')}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar column */}
        <aside className="form-sidebar">
          {/* Profile Photo */}
          <section className="form-card">
            <SectionHeading icon={FileText}>Profile Photo</SectionHeading>

            <div className="photo-upload">
              <button
                type="button"
                className="photo-upload__avatar"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change profile photo"
              >
                {photoUrl ? (
                  <img src={photoUrl} alt="Technician" />
                ) : (
                  <span className="photo-upload__placeholder">
                    <User size={30} />
                  </span>
                )}
                <span className="photo-upload__badge">
                  <Camera size={13} />
                </span>
              </button>
              <p className="photo-upload__hint-title">Click image to change</p>
              <p className="photo-upload__hint">JPG, PNG or JPEG (Max. 2MB)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                hidden
                onChange={handlePhotoChange}
              />
            </div>
          </section>

          {/* Current Status */}
          <section className="form-card">
            <SectionHeading icon={ShieldCheck}>Current Status</SectionHeading>

            <div className="form-field form-field--last">
              <FieldLabel required>Status</FieldLabel>
              <div className="input-shell input-shell--status">
                <span className={`status-dot ${STATUS_DOT_CLASS[form.status]}`} />
                <select
                  className="input-shell__field input-shell__field--select"
                  value={form.status}
                  onChange={updateField('status')}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown size={15} className="input-shell__chevron" />
              </div>
            </div>
          </section>

          {/* Additional Information */}
          <section className="form-card">
            <SectionHeading icon={FileText}>Additional Information</SectionHeading>

            <div className="form-field form-field--last">
              <FieldLabel>Notes</FieldLabel>
              <textarea
                className="textarea-field"
                rows={4}
                value={form.notes}
                onChange={updateField('notes')}
              />
            </div>
          </section>

          {/* Quick Guidelines */}
          <section className="form-card guidelines-card">
            <SectionHeading icon={ShieldCheck}>Quick Guidelines</SectionHeading>

            <ul className="guidelines-list">
              {GUIDELINES.map((tip) => (
                <li key={tip}>
                  <CheckCircle2 size={15} />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        {/* Bottom actions */}
        <div className="form-footer">
          <button type="button" className="btn btn--outline">
            Cancel
          </button>
          <button type="submit" className="btn btn--success">
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTechnicianProfile;