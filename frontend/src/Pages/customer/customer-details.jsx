import React from "react";
import {
  ArrowLeft,
  Pencil,
  Plus,
  Mail,
  Phone,
  Globe,
  Calendar,
  Users,
  ShieldCheck,
  User,
  MapPin,
  ClipboardList,
  FileText,
  MessageCircle,
  MoreHorizontal,
  ArrowRight,
} from "lucide-react";
import "./customer-details.css";

const CUSTOMER_INFO = [
  { label: "Customer Type", value: "Corporate", badge: "type" },
  { label: "GST Number", value: "27AABCG1234D1Z5" },
  { label: "PAN Number", value: "AABCG1234D" },
  { label: "Email Address", value: "info@greenfuture.com" },
  { label: "Phone Number", value: "+91 98765 43210" },
  { label: "Alternate Number", value: "+91 91234 56789" },
];

const BILLING_INFO = [
  { label: "Billing Preference", value: "Monthly" },
  { label: "Payment Terms", value: "Net 30 Days" },
  { label: "Credit Limit", value: "₹ 1,00,000" },
  { label: "Payment Status", value: "Paid", badge: "status-paid" },
  { label: "Outstanding", value: "₹ 0.00" },
  { label: "Source", value: "Website Enquiry" },
];

const SERVICE_PREFERENCES = [
  { label: "Preferred Service Type", value: "General Pest Control" },
  { label: "Pest Type", value: "Cockroaches, Termites, Rodents" },
  { label: "Preferred Frequency", value: "Monthly" },
  { label: "Preferred Time", value: "10:00 AM - 02:00 PM" },
  {
    label: "Special Instructions",
    value: "Access via main gate. Contact security before entry.",
  },
];

const RECENT_BOOKINGS = [
  {
    id: "BK-000124",
    serviceType: "General Pest Control",
    pestType: "Cockroaches",
    scheduledDate: "16 May 2025",
    scheduledTime: "10:00 AM",
    technician: "Amit Kumar",
    technicianInitials: "AK",
    status: "Scheduled",
    amount: "₹ 3,250",
  },
];

function DetailRow({ label, value, badge }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-colon">:</span>
      {badge ? (
        <span className={`detail-badge ${badge === "status-paid" ? "badge-paid" : "badge-type"}`}>
          {value}
        </span>
      ) : (
        <span className="detail-value">{value}</span>
      )}
    </div>
  );
}

export default function CustomerDetails() {
  return (
    <div className="customer-details-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Customer Details</h1>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item">Customers</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item breadcrumb-active">
              Customer Details
            </span>
          </nav>
        </div>
        <div className="page-header-actions">
          <button type="button" className="btn btn-outline">
            <ArrowLeft size={16} />
            Back to List
          </button>
          <button type="button" className="btn btn-outline btn-accent-text">
            <Pencil size={16} />
            Edit Customer
          </button>
          <button type="button" className="btn btn-primary">
            <Plus size={16} />
            New Booking
          </button>
        </div>
      </div>

      {/* Profile Summary Card */}
      <div className="profile-card">
        <div className="profile-logo">
          <span className="profile-logo-text">GREEN</span>
          <span className="profile-logo-subtext">FUTURE SOLUTIONS</span>
        </div>

        <div className="profile-main">
          <div className="profile-name-row">
            <h2 className="profile-name">Green Future Solutions Pvt. Ltd.</h2>
            <span className="pill-badge pill-badge-type">Corporate</span>
          </div>
          <div className="profile-contact-row">
            <span className="profile-contact-item">
              <Mail size={14} />
              info@greenfuture.com
            </span>
            <span className="profile-contact-item">
              <Phone size={14} />
              +91 98765 43210
            </span>
            <span className="profile-contact-item">
              <Globe size={14} />
              www.greenfuture.com
            </span>
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <div className="profile-stat-icon">
              <Calendar size={18} />
            </div>
            <div className="profile-stat-text">
              <span className="profile-stat-label">Customer Since</span>
              <span className="profile-stat-value">12 Jan 2023</span>
            </div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-icon">
              <Users size={18} />
            </div>
            <div className="profile-stat-text">
              <span className="profile-stat-label">Customer Group</span>
              <span className="profile-stat-value">Premium Clients</span>
            </div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-icon">
              <ShieldCheck size={18} />
            </div>
            <div className="profile-stat-text">
              <span className="profile-stat-label">Status</span>
              <span className="pill-badge pill-badge-status">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information + Primary Contact Person */}
      <div className="two-col-grid">
        <section className="form-card">
          <div className="section-heading">
            <div className="section-icon">
              <User size={18} />
            </div>
            <h2 className="section-title">Customer Information</h2>
          </div>

          <div className="detail-columns">
            <div className="detail-column">
              {CUSTOMER_INFO.map((item) => (
                <DetailRow key={item.label} {...item} />
              ))}
            </div>
            <div className="detail-column">
              {BILLING_INFO.map((item) => (
                <DetailRow key={item.label} {...item} />
              ))}
            </div>
          </div>
        </section>

        <section className="form-card sidebar-card">
          <div className="section-heading">
            <div className="section-icon">
              <User size={18} />
            </div>
            <h2 className="section-title">Primary Contact Person</h2>
          </div>

          <div className="detail-column">
            <DetailRow label="Contact Name" value="Mr. Ramesh Sharma" />
            <DetailRow label="Designation" value="Facility Manager" />
            <DetailRow
              label="Email Address"
              value="ramesh.sharma@greenfuture.com"
            />
            <DetailRow label="Phone Number" value="+91 98765 43210" />
          </div>

          <div className="contact-action-row">
            <button type="button" className="btn btn-outline btn-sm">
              <Phone size={14} />
              Call
            </button>
            <button type="button" className="btn btn-outline btn-sm">
              <Mail size={14} />
              Email
            </button>
            <button type="button" className="btn btn-outline btn-sm">
              <MessageCircle size={14} />
              WhatsApp
            </button>
          </div>
        </section>
      </div>

      {/* Property, Service Preferences, Notes */}
      <div className="three-col-grid">
        <section className="form-card">
          <div className="section-heading">
            <div className="section-icon">
              <MapPin size={18} />
            </div>
            <h2 className="section-title">Property / Location Details</h2>
          </div>

          <div className="detail-column">
            <div className="detail-row detail-row-multiline">
              <span className="detail-label">Address</span>
              <span className="detail-colon">:</span>
              <span className="detail-value">
                Green Future Solutions Pvt. Ltd.
                <br />
                Eco Tower, 5th Floor, Sector 15,
                <br />
                CBD Belapur, Navi Mumbai,
                <br />
                Maharashtra - 400614
              </span>
            </div>
          </div>

          <div className="map-preview">
            <div className="map-preview-canvas">
              <MapPin size={26} className="map-pin-icon" />
            </div>
          </div>
          <button type="button" className="btn btn-outline btn-sm btn-full">
            <MapPin size={14} />
            View on Map
          </button>

          <div className="detail-column detail-column-spaced">
            <DetailRow label="Landmark" value="Near Belapur Railway Station" />
          </div>
        </section>

        <section className="form-card">
          <div className="section-heading">
            <div className="section-icon">
              <ClipboardList size={18} />
            </div>
            <h2 className="section-title">Service Preferences</h2>
          </div>

          <div className="detail-column">
            {SERVICE_PREFERENCES.map((item) => (
              <DetailRow key={item.label} {...item} />
            ))}
          </div>
        </section>

        <section className="form-card">
          <div className="section-heading">
            <div className="section-icon">
              <FileText size={18} />
            </div>
            <h2 className="section-title">Additional Notes</h2>
          </div>

          <div className="notes-box">
            Prefers morning appointments. Building access allowed only with
            prior notice to security.
          </div>
        </section>
      </div>

      {/* Recent Bookings */}
      <section className="form-card">
        <div className="section-heading">
          <div className="section-icon">
            <ClipboardList size={18} />
          </div>
          <h2 className="section-title">Recent Bookings</h2>
        </div>

        <div className="table-scroll">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Service Type</th>
                <th>Pest Type</th>
                <th>Scheduled Date</th>
                <th>Technician</th>
                <th>Status</th>
                <th>Amount</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_BOOKINGS.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <span className="booking-id">{booking.id}</span>
                  </td>
                  <td>{booking.serviceType}</td>
                  <td>{booking.pestType}</td>
                  <td>
                    <div className="scheduled-cell">
                      <span>{booking.scheduledDate}</span>
                      <span className="scheduled-time">
                        {booking.scheduledTime}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="technician-cell">
                      <div className="technician-avatar">
                        {booking.technicianInitials}
                      </div>
                      <span>{booking.technician}</span>
                    </div>
                  </td>
                  <td>
                    <span className="status-badge status-scheduled">
                      {booking.status}
                    </span>
                  </td>
                  <td className="cell-amount">{booking.amount}</td>
                  <td className="col-actions">
                    <button className="action-icon-btn" aria-label="More options">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <a href="#" className="view-all-link">
            View All Bookings
            <ArrowRight size={14} />
          </a>
        </div>
      </section>
    </div>
  );
}