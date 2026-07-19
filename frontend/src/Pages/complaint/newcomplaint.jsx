import React, { useState, useRef } from 'react';
import {useNavigate} from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  ChevronDown,
  Search,
  Phone,
  Mail,
  MapPin,
  Tag,
  Bug,
  Calendar,
  Flag,
  Clock,
  Megaphone,
  Upload,
  X,
  User,
  Users,
  FileText,
  Info,
  Building,
  ChevronRight,
} from 'lucide-react';
import './newcomplaint.css';

// ----------------------------------------------------------------------------
// Reference options (would normally come from an API)
// ----------------------------------------------------------------------------

const PROPERTY_TYPES = ['Residential - Apartment', 'Residential - Villa', 'Commercial - Office', 'Commercial - Retail', 'Industrial'];
const PEST_TYPES = ['Cockroach', 'Termite', 'Rodent', 'Mosquito', 'Bed Bug', 'Ant', 'Spider', 'Wasp'];
const SERVICE_CATEGORIES = ['General Pest Control', 'Termite Control', 'Rodent Control', 'Mosquito Control', 'Bed Bug Treatment', 'Fumigation'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Emergency'];
const SOURCES = ['Website', 'Phone Call', 'Referral', 'Social Media', 'Walk-in', 'Existing Customer'];
const TECHNICIANS = ['Suresh Yadav', 'Rakesh Jadhav', 'Manoj Verma', 'Kiran Reddy', 'Arjun Nair'];
const TEAMS = ['Team Alpha', 'Team Bravo', 'Team Charlie', 'Team Delta'];
const STATUSES = ['New', 'Assigned', 'Scheduled'];

const DESCRIPTION_LIMIT = 500;
const NOTES_LIMIT = 300;
const MAX_FILE_SIZE_MB = 5;

const initialForm = {
  customerName: '',
  phone: '',
  email: '',
  property: '',
  propertyType: '',
  unit: '',
  pestType: '',
  serviceCategory: '',
  priority: '',
  description: '',
  preferredDate: '',
  preferredTime: '',
  source: '',
  notes: '',
  technician: '',
  team: '',
  status: 'New',
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

const IconSelect = ({ icon: Icon, options, placeholder, ...props }) => (
  <div className="input-shell">
    <Icon size={16} className="input-shell__icon" />
    <select className="input-shell__field input-shell__field--select" {...props}>
      <option value="">{placeholder}</option>
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

const NewComplaint = () => {
  const [form, setForm] = useState(initialForm);
  const [photos, setPhotos] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const addFiles = (fileList) => {
    const files = Array.from(fileList).filter((file) => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
      return isValidType && isValidSize;
    });

    const newPhotos = files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files?.length) {
      addFiles(e.target.files);
    }
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      addFiles(e.dataTransfer.files);
    }
  };

  const removePhoto = (id) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire up to API integration here.
  };

  return (
    <div className="new-complaint-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
          Dashboard
        <ChevronRight size={13} className="at-crumb-sep" />
          Complaints
        <ChevronRight size={13} className="at-crumb-sep" />
        <span className="breadcrumb__current">New Complaint</span>
      </nav>

      {/* Page header */}
      <header className="page-header">
        <div>
          <h1 className="page-header__title">New Complaint</h1>
          <p className="page-header__subtitle">
            Create a new pest control complaint and assign for quick resolution.
          </p>
        </div>
        <div className="page-header__actions">
          <button type="button" className="btn btn--outline" onClick={() => navigate('/complaint')}>
            <ArrowLeft size={16} />
            Back to Complaints
          </button>
          <button type="submit" form="new-complaint-form" className="btn btn--primary">
            <Save size={16} />
            Save Complaint
            <ChevronDown size={14} />
          </button>
        </div>
      </header>

      <form id="new-complaint-form" className="form-grid" onSubmit={handleSubmit}>
        {/* Main column */}
        <div className="form-main">
          {/* Complaint Information */}
          <section className="form-card">
            <SectionHeading icon={FileText}>Complaint Information</SectionHeading>

            <div className="field-grid field-grid--3">
              <div className="form-field">
                <FieldLabel required>Customer Name</FieldLabel>
                <IconInput
                  icon={Search}
                  type="text"
                  placeholder="Search customer name or ID..."
                  value={form.customerName}
                  onChange={updateField('customerName')}
                />
              </div>
              <div className="form-field">
                <FieldLabel required>Phone Number</FieldLabel>
                <IconInput
                  icon={Phone}
                  type="tel"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={updateField('phone')}
                />
              </div>
              <div className="form-field">
                <FieldLabel>Email</FieldLabel>
                <IconInput
                  icon={Mail}
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={updateField('email')}
                />
              </div>
            </div>

            <div className="field-grid field-grid--3">
              <div className="form-field">
                <FieldLabel required>Property / Location</FieldLabel>
                <IconInput
                  icon={MapPin}
                  type="text"
                  placeholder="Enter property or location"
                  value={form.property}
                  onChange={updateField('property')}
                />
              </div>
              <div className="form-field">
                <FieldLabel required>Property Type</FieldLabel>
                <IconSelect
                  icon={Building}
                  placeholder="Select property type"
                  options={PROPERTY_TYPES}
                  value={form.propertyType}
                  onChange={updateField('propertyType')}
                />
              </div>
              <div className="form-field">
                <FieldLabel>Unit / Floor / Area</FieldLabel>
                <IconInput
                  icon={Tag}
                  type="text"
                  placeholder="Enter unit, floor or area"
                  value={form.unit}
                  onChange={updateField('unit')}
                />
              </div>
            </div>
          </section>

          {/* Complaint Details */}
          <section className="form-card">
            <SectionHeading icon={FileText}>Complaint Details</SectionHeading>

            <div className="field-grid field-grid--3">
              <div className="form-field">
                <FieldLabel required>Pest Type</FieldLabel>
                <IconSelect
                  icon={Bug}
                  placeholder="Select pest type"
                  options={PEST_TYPES}
                  value={form.pestType}
                  onChange={updateField('pestType')}
                />
              </div>
              <div className="form-field">
                <FieldLabel required>Service Category</FieldLabel>
                <IconSelect
                  icon={Calendar}
                  placeholder="Select service category"
                  options={SERVICE_CATEGORIES}
                  value={form.serviceCategory}
                  onChange={updateField('serviceCategory')}
                />
              </div>
              <div className="form-field">
                <FieldLabel required>Priority</FieldLabel>
                <IconSelect
                  icon={Flag}
                  placeholder="Select priority"
                  options={PRIORITIES}
                  value={form.priority}
                  onChange={updateField('priority')}
                />
              </div>
            </div>

            <div className="form-field">
              <FieldLabel required>Complaint Description</FieldLabel>
              <textarea
                className="textarea-field"
                rows={4}
                maxLength={DESCRIPTION_LIMIT}
                placeholder="Describe the pest problem in detail..."
                value={form.description}
                onChange={updateField('description')}
              />
              <span className="char-counter">
                {form.description.length} / {DESCRIPTION_LIMIT}
              </span>
            </div>

            <div className="field-grid field-grid--3">
              <div className="form-field">
                <FieldLabel>Preferred Date</FieldLabel>
                <IconInput
                  icon={Calendar}
                  type="date"
                  value={form.preferredDate}
                  onChange={updateField('preferredDate')}
                />
              </div>
              <div className="form-field">
                <FieldLabel>Preferred Time</FieldLabel>
                <IconInput
                  icon={Clock}
                  type="time"
                  value={form.preferredTime}
                  onChange={updateField('preferredTime')}
                />
              </div>
              <div className="form-field">
                <FieldLabel>How did you hear about us?</FieldLabel>
                <IconSelect
                  icon={Megaphone}
                  placeholder="Select source"
                  options={SOURCES}
                  value={form.source}
                  onChange={updateField('source')}
                />
              </div>
            </div>

            <div className="form-field">
              <FieldLabel>Upload Photos (Optional)</FieldLabel>
              <div className="upload-row">
                <div
                  className={`dropzone ${isDragging ? 'dropzone--active' : ''}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                >
                  <Upload size={22} />
                  <span className="dropzone__title">Drag &amp; drop images here or click to upload</span>
                  <span className="dropzone__hint">
                    Supports: JPG, PNG, JPEG (Max. {MAX_FILE_SIZE_MB}MB each)
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    multiple
                    hidden
                    onChange={handleFileInputChange}
                  />
                </div>

                {photos.length > 0 && (
                  <div className="photo-previews">
                    {photos.map((photo) => (
                      <div className="photo-preview" key={photo.id}>
                        <img src={photo.url} alt="Uploaded complaint" />
                        <button
                          type="button"
                          className="photo-preview__remove"
                          onClick={() => removePhoto(photo.id)}
                          aria-label="Remove photo"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-field">
              <FieldLabel>Additional Notes (Optional)</FieldLabel>
              <textarea
                className="textarea-field"
                rows={3}
                maxLength={NOTES_LIMIT}
                placeholder="Add any additional notes..."
                value={form.notes}
                onChange={updateField('notes')}
              />
              <span className="char-counter">
                {form.notes.length} / {NOTES_LIMIT}
              </span>
            </div>
          </section>
        </div>

        {/* Sidebar column */}
        <aside className="form-sidebar">
          {/* Complaint Summary */}
          <section className="form-card">
            <SectionHeading icon={FileText}>Complaint Summary</SectionHeading>

            <div className="summary-banner">
              <span className="summary-banner__icon">
                <Bug size={20} />
              </span>
              <div>
                <p className="summary-banner__title">New Complaint</p>
                <p className="summary-banner__subtitle">Not Saved Yet</p>
              </div>
            </div>

            <dl className="summary-list">
              <div className="summary-list__row">
                <dt>Customer</dt>
                <dd>{form.customerName || '-'}</dd>
              </div>
              <div className="summary-list__row">
                <dt>Property</dt>
                <dd>{form.property || '-'}</dd>
              </div>
              <div className="summary-list__row">
                <dt>Pest Type</dt>
                <dd>{form.pestType || '-'}</dd>
              </div>
              <div className="summary-list__row">
                <dt>Priority</dt>
                <dd>{form.priority || '-'}</dd>
              </div>
              <div className="summary-list__row">
                <dt>Preferred Date</dt>
                <dd>{form.preferredDate || '-'}</dd>
              </div>
              <div className="summary-list__row">
                <dt>Status</dt>
                <dd>
                  <span className="badge badge--new">{form.status}</span>
                </dd>
              </div>
            </dl>
          </section>

          {/* Assign Technician */}
          <section className="form-card">
            <SectionHeading icon={User}>Assign Technician</SectionHeading>

            <div className="form-field">
              <FieldLabel>Assign To</FieldLabel>
              <IconSelect
                icon={User}
                placeholder="Select technician"
                options={TECHNICIANS}
                value={form.technician}
                onChange={updateField('technician')}
              />
            </div>

            <div className="form-field form-field--last">
              <FieldLabel>Team</FieldLabel>
              <IconSelect
                icon={Users}
                placeholder="Select team"
                options={TEAMS}
                value={form.team}
                onChange={updateField('team')}
              />
            </div>
          </section>

          {/* Status */}
          <section className="form-card">
            <SectionHeading icon={Flag}>Status</SectionHeading>

            <div className="form-field form-field--last">
              <FieldLabel>Initial Status</FieldLabel>
              <IconSelect
                icon={Flag}
                placeholder="Select status"
                options={STATUSES}
                value={form.status}
                onChange={updateField('status')}
              />
            </div>

            <div className="info-note">
              <Info size={15} />
              <p>
                The complaint will be created with '{form.status}' status and can be updated later.
              </p>
            </div>
          </section>

          <div className="sidebar-actions">
            <button type="button" className="btn btn--outline">
              Cancel
            </button>
            <button type="submit" className="btn btn--success">
              <Save size={16} />
              Save Complaint
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default NewComplaint;