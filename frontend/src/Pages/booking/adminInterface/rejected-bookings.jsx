import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Download,
  RefreshCw,
  XCircle,
  Calendar,
  AlertCircle,
  User,
  Clock,
  Search,
  ChevronDown,
  Filter,
  ArrowUpDown,
  Bug,
  Shield,
  Home as HomeIcon,
  Building2,
  Eye,
  MoreVertical,
  ChevronLeft,
} from "lucide-react";
import "./rejected-bookings.css";

const stats = [
  { label: "Total Rejected", sub: "All Time", value: 24, icon: Calendar },
  { label: "Rejected This Month", sub: "This Month", value: 12, icon: Calendar },
  { label: "High Priority Rejections", sub: "This Month", value: 6, icon: AlertCircle, danger: true },
  { label: "Affected Customers", sub: "All Time", value: 18, icon: User },
  { label: "Resubmitted Bookings", sub: "This Month", value: 4, icon: Clock },
];

const serviceIcons = {
  "Termite Control": Bug,
  "Cockroach Control": Bug,
  "Rodent Control": Bug,
  "General Pest Control": Shield,
  "Mosquito Control": Bug,
  "Bed Bug Treatment": HomeIcon,
};

const bookings = [
  {
    id: "BK-2025-0109",
    customer: "Rahul Sharma",
    phone: "9876543210",
    initials: "RS",
    property: "Green Valley Apartments",
    propertyType: "Pune",
    service: "Termite Control",
    serviceArea: "Residential",
    date: "22 May 2025",
    time: "11:30 AM",
    reason: "Service Not Available",
    reasonNote: "Service not available for the selected date.",
    priority: "High",
    rejectedBy: "Admin",
    rejectedByName: "John Doe",
  },
  {
    id: "BK-2025-0108",
    customer: "Sneha Patil",
    phone: "9023456781",
    initials: "SP",
    property: "Sai Residency",
    propertyType: "Building A-302",
    service: "Cockroach Control",
    serviceArea: "Kitchen",
    date: "22 May 2025",
    time: "10:15 AM",
    reason: "Invalid Contact Information",
    reasonNote: "Customer phone number is invalid or unreachable.",
    priority: "Medium",
    rejectedBy: "Admin",
    rejectedByName: "John Doe",
  },
  {
    id: "BK-2025-0107",
    customer: "Vikram Singh",
    phone: "9156784321",
    initials: "VS",
    property: "ABC Corporate Office",
    propertyType: "Baner, Pune",
    service: "Rodent Control",
    serviceArea: "Commercial",
    date: "21 May 2025",
    time: "04:00 PM",
    reason: "Duplicate Booking",
    reasonNote: "A booking with the same details already exists.",
    priority: "Medium",
    rejectedBy: "Admin",
    rejectedByName: "John Doe",
  },
  {
    id: "BK-2025-0106",
    customer: "Anita Deshmukh",
    phone: "9898765432",
    initials: "AD",
    property: "Shree Plaza",
    propertyType: "Shop No. 12",
    service: "General Pest Control",
    serviceArea: "Office",
    date: "21 May 2025",
    time: "02:45 PM",
    reason: "Payment Issue",
    reasonNote: "Advance payment is required for this service.",
    priority: "High",
    rejectedBy: "Admin",
    rejectedByName: "John Doe",
  },
  {
    id: "BK-2025-0105",
    customer: "Neha Joshi",
    phone: "9123456780",
    initials: "NJ",
    property: "Sunrise Villa",
    propertyType: "House No. 45",
    service: "Mosquito Control",
    serviceArea: "Residential",
    date: "20 May 2025",
    time: "11:20 AM",
    reason: "Out of Service Area",
    reasonNote: "Service is not available in this location.",
    priority: "Low",
    rejectedBy: "Admin",
    rejectedByName: "John Doe",
  },
  {
    id: "BK-2025-0104",
    customer: "Sandeep Yadav",
    phone: "9356789012",
    initials: "SY",
    property: "City Homes",
    propertyType: "Block B-101",
    service: "Bed Bug Treatment",
    serviceArea: "Bedroom",
    date: "20 May 2025",
    time: "09:10 AM",
    reason: "Customer Cancelled",
    reasonNote: "Customer requested cancellation.",
    priority: "Low",
    rejectedBy: "Admin",
    rejectedByName: "John Doe",
  },
];

const columns = [
  { key: "id", label: "Booking ID" },
  { key: "customer", label: "Customer" },
  { key: "property", label: "Property" },
  { key: "service", label: "Service" },
  { key: "date", label: "Rejected Date & Time" },
  { key: "reason", label: "Reason" },
  { key: "priority", label: "Priority" },
  { key: "rejectedBy", label: "Rejected By" },
];

const priorityClass = {
  High: "rjb-badge-danger",
  Medium: "rjb-badge-warning",
  Low: "rjb-badge-success",
};

const pages = [1, 2, 3, 4];

export default function RejectedBookings() {
  const [activePage, setActivePage] = useState(1);

  const navigate = useNavigate();

  return (
    <div className="rjb-page">
      <nav className="rjb-breadcrumb" aria-label="Breadcrumb">
        <a href="#" className="rjb-breadcrumb-link">
          Dashboard
        </a>
        <ChevronRight size={14} className="rjb-breadcrumb-sep" />
        <a href="#" className="rjb-breadcrumb-link">
          Bookings
        </a>
        <ChevronRight size={14} className="rjb-breadcrumb-sep" />
        <span className="rjb-breadcrumb-current">Rejected Bookings</span>
      </nav>

      <header className="rjb-header">
        <div className="rjb-header-left">
          <span className="rjb-header-icon">
            <XCircle size={26} strokeWidth={2} />
          </span>
          <div>
            <h1 className="rjb-title">Rejected Bookings</h1>
            <p className="rjb-subtitle">View all rejected service bookings and reasons</p>
          </div>
        </div>

        <div className="rjb-header-actions">
          <button type="button" className="rjb-btn rjb-btn-outline">
            <Download size={16} strokeWidth={2} />
            Export
          </button>
          <button type="button" className="rjb-btn rjb-btn-primary">
            <RefreshCw size={16} strokeWidth={2} />
            Refresh
          </button>
        </div>
      </header>

      <section className="rjb-stats-grid">
        {stats.map(({ label, sub, value, icon: Icon, danger }) => (
          <div className="rjb-stat-card" key={label}>
            <span className={`rjb-stat-icon ${danger ? "rjb-stat-icon-danger" : ""}`}>
              <Icon size={22} strokeWidth={2} />
            </span>
            <div className="rjb-stat-text">
              <span className="rjb-stat-label">{label}</span>
              <span className="rjb-stat-value">{value}</span>
              <span className="rjb-stat-sub">{sub}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="rjb-filters-card">
        <div className="rjb-search-wrap">
          <Search size={16} className="rjb-search-icon" />
          <input
            type="text"
            className="rjb-search-input"
            placeholder="Search by booking ID, customer, phone or property..."
          />
        </div>

        <div className="rjb-filter-field">
          <label className="rjb-filter-label">Service Type</label>
          <div className="rjb-select">
            <select defaultValue="All Services">
              <option>All Services</option>
              <option>Termite Control</option>
              <option>Cockroach Control</option>
              <option>Rodent Control</option>
              <option>General Pest Control</option>
              <option>Mosquito Control</option>
              <option>Bed Bug Treatment</option>
            </select>
            <ChevronDown size={16} className="rjb-select-caret" />
          </div>
        </div>

        <div className="rjb-filter-field">
          <label className="rjb-filter-label">Reason</label>
          <div className="rjb-select">
            <select defaultValue="All Reasons">
              <option>All Reasons</option>
              <option>Service Not Available</option>
              <option>Invalid Contact Information</option>
              <option>Duplicate Booking</option>
              <option>Payment Issue</option>
              <option>Out of Service Area</option>
              <option>Customer Cancelled</option>
            </select>
            <ChevronDown size={16} className="rjb-select-caret" />
          </div>
        </div>

        <div className="rjb-filter-field">
          <label className="rjb-filter-label">Date Range</label>
          <button type="button" className="rjb-date-input">
            <Calendar size={16} strokeWidth={2} />
            Select Date Range
          </button>
        </div>

        <button type="button" className="rjb-btn rjb-btn-outline rjb-clear-btn">
          <Filter size={16} strokeWidth={2} />
          Clear Filters
        </button>
      </section>

      <section className="rjb-table-card">
        <div className="rjb-table-scroll">
          <table className="rjb-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>
                    <span className="rjb-th-content">
                      {col.label}
                      <ArrowUpDown size={12} strokeWidth={2} />
                    </span>
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const ServiceIcon = serviceIcons[b.service] || Bug;
                return (
                  <tr key={b.id} className="rjb-row">
                    <td>
                      <span className="rjb-booking-id">{b.id}</span>
                    </td>
                    <td>
                      <div className="rjb-cell-with-avatar">
                        <span className="rjb-avatar">{b.initials}</span>
                        <div className="rjb-cell-text">
                          <span className="rjb-cell-primary">{b.customer}</span>
                          <span className="rjb-cell-secondary">{b.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="rjb-cell-with-icon">
                        <span className="rjb-cell-icon">
                          <Building2 size={16} strokeWidth={2} />
                        </span>
                        <div className="rjb-cell-text">
                          <span className="rjb-cell-primary">{b.property}</span>
                          <span className="rjb-cell-secondary">{b.propertyType}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="rjb-cell-with-icon">
                        <span className="rjb-cell-icon">
                          <ServiceIcon size={16} strokeWidth={2} />
                        </span>
                        <div className="rjb-cell-text">
                          <span className="rjb-cell-primary">{b.service}</span>
                          <span className="rjb-cell-secondary">{b.serviceArea}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="rjb-cell-with-icon">
                        <span className="rjb-cell-icon">
                          <Calendar size={16} strokeWidth={2} />
                        </span>
                        <div className="rjb-cell-text">
                          <span className="rjb-cell-primary">{b.date}</span>
                          <span className="rjb-cell-secondary">
                            <Clock size={12} strokeWidth={2} className="rjb-inline-icon" />
                            {b.time}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="rjb-reason-cell">
                        <button type="button" className="rjb-reason-select">
                          {b.reason}
                          <ChevronDown size={14} strokeWidth={2} />
                        </button>
                        <span className="rjb-reason-note">{b.reasonNote}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`rjb-badge ${priorityClass[b.priority]}`}>{b.priority}</span>
                    </td>
                    <td>
                      <div className="rjb-cell-text">
                        <span className="rjb-cell-primary">{b.rejectedBy}</span>
                        <span className="rjb-cell-secondary">{b.rejectedByName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="rjb-actions-cell">
                        <button type="button" className="rjb-btn rjb-btn-outline rjb-btn-sm" onClick={() => navigate("/admin/bookings/rejected-bookings/view")}>
                          <Eye size={14} strokeWidth={2} />
                          View
                        </button>
                        <button type="button" className="rjb-icon-btn" aria-label="More actions">
                          <MoreVertical size={16} strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="rjb-table-footer">
          <span className="rjb-showing-text">Showing 1 to 6 of 24 bookings</span>

          <div className="rjb-pagination">
            <button type="button" className="rjb-page-btn rjb-page-nav" disabled={activePage === 1}>
              <ChevronLeft size={14} strokeWidth={2} />
              Previous
            </button>
            {pages.map((p) => (
              <button
                key={p}
                type="button"
                className={`rjb-page-btn ${activePage === p ? "rjb-page-btn-active" : ""}`}
                onClick={() => setActivePage(p)}
              >
                {p}
              </button>
            ))}
            <button type="button" className="rjb-page-btn rjb-page-nav">
              Next
              <ChevronRight size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}