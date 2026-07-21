import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Copy,
  Edit3,
  MoreHorizontal,
  Plus,
  Shield,
  Bug,
  Flag,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  ClipboardList,
  FileText,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import './Booking-details.css';

const TIMELINE = [
  {
    date: '10 May 2025',
    time: '09:15 AM',
    title: 'Booking Created',
    description: 'Booking has been created successfully.',
    state: 'done',
  },
  {
    date: '10 May 2025',
    time: '09:30 AM',
    title: 'Technician Assigned',
    description: 'Amit Kumar has been assigned.',
    state: 'done',
  },
  {
    date: '11 May 2025',
    time: '02:45 PM',
    title: 'Schedule Confirmed',
    description: 'Schedule confirmed with customer.',
    state: 'done',
  },
  {
    date: '12 May 2025',
    time: '10:00 AM',
    title: 'Service Scheduled',
    description: 'Service is scheduled for today.',
    state: 'upcoming',
  },
  {
    date: '-',
    time: '',
    title: 'Service Completed',
    description: 'Pending',
    state: 'pending',
  },
];

export default function BookingDetails() {
  const navigate = useNavigate();
  return (
    <div className="bd-page">
      <div className="bd-breadcrumb">
        <span className="crumb-active">Dashboard</span>
        <ChevronRight size={14} className="crumb-sep" />
        <span>Bookings</span>
        <ChevronRight size={14} className="crumb-sep" />
        <span>Booking Details</span>
      </div>

      <div className="bd-header">
        <div>
          <h1 className="page-title">Booking Details</h1>
          <p className="page-subtitle">View complete booking information and status.</p>
        </div>
        <div className="bd-header-actions">
          <button className="btn btn-outline" onClick={() => navigate("/edit-booking")}>
            <Edit3 size={16} />
            Edit Booking
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/create-booking")}>
            <Plus size={17} />
            New Booking
          </button>
        </div>
      </div>

      <div className="bd-layout">
        <div className="bd-main-col">
          <div className="form-card overview-card">
            <div className="overview-left">
              <span className="overview-label">Booking ID</span>
              <div className="booking-id-row">
                <span className="booking-id">BK-2025-001</span>
                <button className="icon-btn" title="Copy Booking ID">
                  <Copy size={15} />
                </button>
              </div>
              <span className="status-badge status-scheduled">Scheduled</span>
            </div>

            <div className="overview-grid">
              <div className="overview-item">
                <span className="overview-item-label">
                  <Shield size={14} /> Service Type
                </span>
                <span className="overview-item-value">General Pest Control</span>
              </div>
              <div className="overview-item">
                <span className="overview-item-label">
                  <Bug size={14} /> Pest Type
                </span>
                <span className="overview-item-value">Cockroaches</span>
              </div>
              <div className="overview-item">
                <span className="overview-item-label">
                  <Flag size={14} /> Priority
                </span>
                <span className="priority-badge priority-medium">Medium</span>
              </div>
              <div className="overview-item">
                <span className="overview-item-label">
                  <Calendar size={14} /> Schedule Date
                </span>
                <span className="overview-item-value">12 May 2025</span>
              </div>
              <div className="overview-item">
                <span className="overview-item-label">
                  <Clock size={14} /> Schedule Time
                </span>
                <span className="overview-item-value">10:00 AM</span>
              </div>
              <div className="overview-item">
                <span className="overview-item-label">
                  <Clock size={14} /> Estimated Duration
                </span>
                <span className="overview-item-value">2 Hours</span>
              </div>
            </div>
          </div>

          <div className="form-card">
            <div className="form-card-title">
              <span className="title-icon">
                <Building2 size={18} />
              </span>
              Property &amp; Technician
            </div>
            <div className="property-grid">
              <div className="property-col">
                <span className="mini-label">Property Name</span>
                <span className="mini-value">Green Villa</span>
                <span className="mini-label spaced">Property Address</span>
                <span className="mini-value">123, Green Avenue, New Delhi - 110001</span>
                <span className="mini-label spaced">Property Type</span>
                <span className="mini-value">Residential</span>
              </div>
              <div className="property-col">
                <span className="mini-label">Assigned Technician</span>
                <div className="tech-row">
                  <span className="avatar-lg">AK</span>
                  <div>
                    <div className="tech-name">Amit Kumar</div>
                    <div className="tech-phone">
                      <Phone size={13} /> 9876543221
                    </div>
                  </div>
                </div>
              </div>
              <div className="property-col">
                <span className="mini-label">Service Location</span>
                <span className="mini-value inline">
                  <MapPin size={14} /> On-site
                </span>
                <span className="mini-label spaced">Service Area</span>
                <span className="mini-value">Kitchen, Living Room, Bathroom</span>
              </div>
            </div>
          </div>

          <div className="bd-two-col">
            <div className="form-card">
              <div className="form-card-title">
                <span className="title-icon">
                  <ClipboardList size={18} />
                </span>
                Service Details
              </div>
              <div className="detail-rows">
                <div className="detail-row">
                  <span className="mini-label">Service Description</span>
                  <span className="mini-value">
                    General pest control service for kitchen, living room and bathroom areas.
                  </span>
                </div>
                <div className="detail-row">
                  <span className="mini-label">Treatment Method</span>
                  <span className="mini-value">Chemical Spray</span>
                </div>
                <div className="detail-row">
                  <span className="mini-label">Chemicals Used</span>
                  <span className="mini-value">Alpha Cypermethrin, Imidacloprid</span>
                </div>
                <div className="detail-row">
                  <span className="mini-label">Safety Measures</span>
                  <span className="mini-value">
                    Family and pet safe. Area will be safe after 2 hours of treatment.
                  </span>
                </div>
              </div>
            </div>

            <div className="form-card">
              <div className="form-card-title">
                <span className="title-icon">
                  <FileText size={18} />
                </span>
                Notes
              </div>
              <div className="detail-rows">
                <div className="detail-row">
                  <span className="mini-label">Customer Notes</span>
                  <span className="mini-value">
                    Please focus on kitchen area. Cockroach issue is more near the sink.
                  </span>
                </div>
                <div className="detail-row">
                  <span className="mini-label">Technician Notes</span>
                  <span className="mini-value">
                    Customer is very cooperative. Access to all areas provided.
                  </span>
                </div>
                <div className="detail-row">
                  <span className="mini-label">Internal Notes</span>
                  <span className="mini-value">Customer requested monthly follow-up.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="bd-side-col">
          <div className="form-card">
            <div className="form-card-title">
              <span className="title-icon">
                <User size={18} />
              </span>
              Customer Information
            </div>
            <div className="customer-block">
              <span className="avatar-lg">RS</span>
              <div className="customer-name">Ramesh Sharma</div>
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
                <Clock size={18} />
              </span>
              Booking Timeline
            </div>
            <div className="timeline">
              {TIMELINE.map((item, i) => (
                <div className={`timeline-item timeline-${item.state}`} key={i}>
                  <div className="timeline-marker">
                    {item.state === 'done' ? <CheckCircle2 size={16} /> : <span className="timeline-dot" />}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-date">
                      {item.date} {item.time && `· ${item.time}`}
                    </div>
                    <div className="timeline-title-row">
                      <span className="timeline-title">{item.title}</span>
                      {item.state === 'upcoming' && <span className="upcoming-badge">Upcoming</span>}
                    </div>
                    <p className="timeline-desc">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="note-card">
        <span className="note-icon">
          <ShieldCheck size={18} />
        </span>
        <div>
          <div className="note-title">Important</div>
          <p>Please ensure all safety guidelines are followed during the service.</p>
        </div>
      </div>
    </div>
  );
}
