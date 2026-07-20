import React, { useState } from 'react';
import axios from 'axios';
import {
  ChevronRight,
  X,
  CalendarCheck,
  ClipboardList,
  User,
  Building2,
  SprayCan,
  Bug,
  Flag,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Paperclip,
  UploadCloud,
  UserCircle2,
  ShieldCheck,
} from 'lucide-react';
import './Create-Booking.css';

const SUMMARY_FIELDS = [
  { key: 'serviceType', label: 'Service Type' },
  { key: 'pestType', label: 'Pest Type' },
  { key: 'scheduleDate', label: 'Schedule Date' },
  { key: 'scheduleTime', label: 'Schedule Time' },
  { key: 'technician', label: 'Technician' },
  { key: 'duration', label: 'Estimated Duration' },
];

export default function CreateBooking() {
  const [form, setForm] = useState({
    customerId: '',
    property: '',
    serviceId: '',
    pestType: '',
    priority: '',
    scheduleDate: '',
    scheduleTime: '',
    technicianId: '',
    duration: '',
    address: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const validateForm = () => {
    if (!form.customerId) {
      return 'Please select a customer.';
    }

    if (!form.property.trim()) {
      return 'Please select a property.';
    }

    if (!form.serviceId) {
      return 'Please select a service.';
    }

    if (!form.pestType) {
      return 'Please select a pest type.';
    }

    if (!form.priority) {
      return 'Please select a priority.';
    }

    if (!form.scheduleDate) {
      return 'Please select a schedule date.';
    }

    if (!form.scheduleTime) {
      return 'Please select a schedule time.';
    }

    if (!form.technicianId) {
      return 'Please select a technician.';
    }

    if (!form.address.trim()) {
      return 'Please enter the service address.';
    }

    return '';
  };
  const handleSubmit = async () => {
  console.log("Save button clicked");
  console.log("Form data:", form);

  try {
    const bookingData = {
      customerId: Number(form.customerId),
      property: form.property,
      serviceId: Number(form.serviceId),
      pestType: form.pestType,
      priority: form.priority,
      scheduleDate: form.scheduleDate,
      scheduleTime: form.scheduleTime,
      technicianId: Number(form.technicianId),
      duration: form.duration,
      address: form.address,
      notes: form.notes,
    };

    const response = await axios.post(
      "http://localhost:8080/api/bookings",
      bookingData
    );

    console.log("Backend response:", response.data);
    alert("Booking saved successfully");
  } catch (error) {
    console.error("Booking save error:", error);

    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "Booking could not be saved";

    alert(message);
  }
};

  return (
    <div className="cb-page">
      <div className="cb-breadcrumb">
        <span className="crumb-active">Dashboard</span>
        <ChevronRight size={14} className="crumb-sep" />
        <span>Bookings</span>
        <ChevronRight size={14} className="crumb-sep" />
        <span>Create Booking</span>
      </div>

      <div className="cb-header">
        <div>
          <h1 className="page-title">Create Booking</h1>
          <p className="page-subtitle">Add a new pest control service booking.</p>
        </div>
        <div className="cb-header-actions">
          <button className="btn btn-outline">
            <X size={16} />
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            <CalendarCheck size={17} />
            Save Booking
          </button>
        </div>
      </div>

      <div className="cb-layout">
        <div className="cb-main-col">
          <div className="form-card">
            <div className="form-card-title">
              <span className="title-icon">
                <Calendar size={18} />
              </span>
              Booking Information
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label>
                  Customer <span className="req">*</span>
                </label>
                <div className="input-with-icon">
                  <User size={16} />
                  <select
                    value={form.customerId}
                    onChange={update('customerId')}
                  >
                    <option value="">Select Customer</option>
                    <option value="1">Ramesh Sharma</option>
                    <option value="2">Anita Verma</option>
                    <option value="3">Neha Kapoor</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>
                  Property <span className="req">*</span>
                </label>
                <div className="input-with-icon">
                  <Building2 size={16} />
                  <select value={form.property} onChange={update('property')}>
                    <option value="">Select Property</option>
                    <option>Green Villa</option>
                    <option>City Apartments</option>
                    <option>Kapoor Residence</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>
                  Service Type <span className="req">*</span>
                </label>
                <div className="input-with-icon">
                  <SprayCan size={16} />
                  <select value={form.serviceType} onChange={update('serviceType')}>
                    <option value="">Select Service Type</option>
                    <option value="1">General Pest Control</option>
                    <option value="2">Termite Treatment</option>
                    <option value="3">Rodent Control</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>
                  Pest Type <span className="req">*</span>
                </label>
                <div className="input-with-icon">
                  <Bug size={16} />
                  <select value={form.pestType} onChange={update('pestType')}>
                    <option value="">Select Pest Type</option>
                    <option>Cockroaches</option>
                    <option>Termites</option>
                    <option>Rodents</option>
                    <option>Mosquitoes</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>
                  Priority <span className="req">*</span>
                </label>
                <div className="input-with-icon">
                  <Flag size={16} />
                  <select value={form.priority} onChange={update('priority')}>
                    <option value="">Select Priority</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>
                  Schedule Date <span className="req">*</span>
                </label>
                <div className="input-with-icon">
                  <Calendar size={16} />
                  <input
                    type="date"
                    value={form.scheduleDate}
                    onChange={update('scheduleDate')}
                    placeholder="Select Date"
                  />
                </div>
              </div>

              <div className="form-field">
                <label>
                  Schedule Time <span className="req">*</span>
                </label>
                <div className="input-with-icon">
                  <Clock size={16} />
                  <input type="time" value={form.scheduleTime} onChange={update('scheduleTime')} />
                </div>
              </div>

              <div className="form-field">
                <label>
                  Technician <span className="req">*</span>
                </label>
                <div className="input-with-icon">
                  <User size={16} />
                  <select value={form.technician} onChange={update('technician')}>
                    <option value="">Assign Technician</option>
                    <option value="1">Amit Kumar</option>
                    <option value="2">Vikram Singh</option>
                    <option value="3">Rahul Mehta</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Estimated Duration</label>
                <div className="input-with-icon">
                  <Clock size={16} />
                  <select value={form.duration} onChange={update('duration')}>
                    <option value="">Select Duration</option>
                    <option>1 Hour</option>
                    <option>2 Hours</option>
                    <option>3 Hours</option>
                    <option>4 Hours</option>
                  </select>
                </div>
              </div>

              <div className="form-field span-3">
                <label>
                  Service Address <span className="req">*</span>
                </label>
                <div className="input-with-icon">
                  <MapPin size={16} />
                  <input
                    type="text"
                    placeholder="Enter complete service address"
                    value={form.address}
                    onChange={update('address')}
                  />
                </div>
              </div>

              <div className="form-field span-3">
                <label>Notes (Optional)</label>
                <div>
                  <textarea
                    rows={3}
                    placeholder="Enter any special instructions or notes..."
                    value={form.notes}
                    onChange={update('notes')}
                  />
                </div>
              </div>
            </div>

            <div className="attachments-section">
              <div className="attachments-title">
                <Paperclip size={16} />
                Attachments (Optional)
              </div>
              <div className="upload-dropzone">
                <UploadCloud size={28} />
                <p>Drag and drop files here or click to upload</p>
                <span>Supported formats: JPG, PNG, PDF (Max 5MB)</span>
              </div>
            </div>
          </div>
        </div>

        <aside className="cb-side-col">
          <div className="form-card">
            <div className="form-card-title">
              <span className="title-icon">
                <User size={18} />
              </span>
              Customer Details
            </div>
            {form.customer ? (
              <div className="customer-block">
                <span className="avatar-lg">
                  {form.customer
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
                <div className="customer-name">{form.customer}</div>
              </div>
            ) : (
              <div className="no-customer">
                <UserCircle2 size={40} />
                <div>
                  <div className="no-customer-title">No customer selected</div>
                  <span>Select a customer to view details.</span>
                </div>
              </div>
            )}
          </div>

          <div className="form-card">
            <div className="form-card-title">
              <span className="title-icon">
                <ClipboardList size={18} />
              </span>
              Booking Summary
            </div>
            <div className="summary-list">
              {SUMMARY_FIELDS.map((f) => (
                <div className="summary-row" key={f.key}>
                  <span>{f.label}</span>
                  <span>{form[f.key] || '-'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="note-card">
            <span className="note-icon">
              <ShieldCheck size={18} />
            </span>
            <div>
              <div className="note-title">Important Note</div>
              <p>Ensure all details are correct before saving the booking.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
