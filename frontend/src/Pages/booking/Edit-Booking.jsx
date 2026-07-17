import React, { useState } from 'react';
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
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import './Edit-Booking.css';

export default function EditBooking() {
  const [form, setForm] = useState({
    customer: 'Ramesh Sharma',
    property: 'Green Villa',
    serviceType: 'General Pest Control',
    pestType: 'Cockroaches',
    priority: 'Medium',
    scheduleDate: '2025-05-12',
    scheduleTime: '10:00',
    technician: 'Amit Kumar',
    duration: '2 Hours',
    address: '123, Green Avenue, New Delhi - 110001',
    notes: 'Customer requested special attention in kitchen area.',
  });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="eb-page">
      <div className="eb-breadcrumb">
        <span className="crumb-active">Dashboard</span>
        <ChevronRight size={14} className="crumb-sep" />
        <span>Bookings</span>
        <ChevronRight size={14} className="crumb-sep" />
        <span>Edit Booking</span>
      </div>

      <div className="eb-header">
        <div>
          <h1 className="page-title">Edit Booking</h1>
          <p className="page-subtitle">Update booking information and schedule.</p>
        </div>
        <div className="eb-header-actions">
          <button className="btn btn-outline">
            <X size={16} />
            Cancel
          </button>
          <button className="btn btn-primary">
            <CalendarCheck size={17} />
            Update Booking
          </button>
        </div>
      </div>

      <div className="eb-layout">
        <div className="eb-main-col">
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
                  <select value={form.customer} onChange={update('customer')}>
                    <option>Ramesh Sharma</option>
                    <option>Anita Verma</option>
                    <option>Neha Kapoor</option>
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
                    <option>General Pest Control</option>
                    <option>Termite Treatment</option>
                    <option>Rodent Control</option>
                    <option>Cockroach Control</option>
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
                  <input type="date" value={form.scheduleDate} onChange={update('scheduleDate')} />
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
                    <option>Amit Kumar</option>
                    <option>Vikram Singh</option>
                    <option>Rahul Mehta</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Estimated Duration</label>
                <div className="input-with-icon">
                  <Clock size={16} />
                  <select value={form.duration} onChange={update('duration')}>
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
                  <input type="text" value={form.address} onChange={update('address')} />
                </div>
              </div>

              <div className="form-field span-3">
                <label>Notes (Optional)</label>
                <div className="input-with-icon textarea-wrap">
                  <FileText size={16} />
                  <textarea rows={3} value={form.notes} onChange={update('notes')} />
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

        <aside className="eb-side-col">
          <div className="form-card">
            <div className="form-card-title">
              <span className="title-icon">
                <User size={18} />
              </span>
              Customer Information
            </div>
            <div className="customer-block">
              <span className="avatar-lg">RS</span>
              <div>
                <div className="customer-name">Ramesh Sharma</div>
              </div>
            </div>
            <div className="contact-list">
              <div className="contact-row">
                <Phone size={15} />
                9876543210
              </div>
              <div className="contact-row">
                <Mail size={15} />
                ramesh.sharma@email.com
              </div>
              <div className="contact-row">
                <MapPin size={15} />
                123, Green Avenue, New Delhi - 110001
              </div>
            </div>
            <button className="btn btn-outline full-width">
              <User size={15} />
              View Customer Profile
            </button>
          </div>

          <div className="form-card">
            <div className="form-card-title">
              <span className="title-icon">
                <ClipboardList size={18} />
              </span>
              Booking Summary
            </div>
            <div className="summary-list">
              <div className="summary-row">
                <span>Service Type</span>
                <span>:</span>
                <span>{form.serviceType}</span>
              </div>
              <div className="summary-row">
                <span>Pest Type</span>
                <span>:</span>
                <span>{form.pestType}</span>
              </div>
              <div className="summary-row">
                <span>Schedule Date</span>
                <span>:</span>
                <span>12 May 2025</span>
              </div>
              <div className="summary-row">
                <span>Schedule Time</span>
                <span>:</span>
                <span>10:00 AM</span>
              </div>
              <div className="summary-row">
                <span>Technician</span>
                <span>:</span>
                <span>{form.technician}</span>
              </div>
              <div className="summary-row">
                <span>Estimated Duration</span>
                <span>:</span>
                <span>{form.duration}</span>
              </div>
            </div>
          </div>

          <div className="note-card">
            <span className="note-icon">
              <ShieldCheck size={18} />
            </span>
            <div>
              <div className="note-title">Important Note</div>
              <p>Ensure all details are correct before updating the booking.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
