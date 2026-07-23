import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Download,
  RefreshCw,
  CheckCircle2,
  Calendar,
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
  Phone,
  ChevronLeft,
  MoreHorizontal,
} from "lucide-react";
import "./accepted-bookings.css";

const stats = [
  { label: "Total Accepted", sub: "All Time", value: 56, icon: Calendar },
  { label: "Scheduled", sub: "Upcoming", value: 28, icon: Calendar },
  { label: "Assigned", sub: "With Technician", value: 36, icon: User },
  { label: "In Progress", sub: "Ongoing", value: 8, icon: Clock },
  { label: "Completed", sub: "This Month", value: 26, icon: CheckCircle2 },
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
    id: "BK-2025-0142",
    customer: "Rahul Sharma",
    phone: "9876543210",
    initials: "RS",
    property: "Green Valley Apartments",
    propertyType: "Pune",
    service: "Termite Control",
    serviceArea: "Residential",
    date: "22 May 2025",
    time: "10:00 AM - 12:00 PM",
    priority: "High",
    amount: "2,500",
    status: "Assigned",
    technician: { name: "Amit Sharma", id: "TC-1008", initials: "AS" },
  },
  {
    id: "BK-2025-0141",
    customer: "Sneha Patil",
    phone: "9023456781",
    initials: "SP",
    property: "Sai Residency",
    propertyType: "Building A-302",
    service: "Cockroach Control",
    serviceArea: "Kitchen",
    date: "22 May 2025",
    time: "02:00 PM - 04:00 PM",
    priority: "Medium",
    amount: "1,800",
    status: "Scheduled",
    technician: { name: "Rohit Verma", id: "TC-1012", initials: "RV" },
  },
  {
    id: "BK-2025-0140",
    customer: "Vikram Singh",
    phone: "9156784321",
    initials: "VS",
    property: "ABC Corporate Office",
    propertyType: "Baner, Pune",
    service: "Rodent Control",
    serviceArea: "Commercial",
    date: "23 May 2025",
    time: "11:00 AM - 01:00 PM",
    priority: "Medium",
    amount: "2,200",
    status: "In Progress",
    technician: { name: "Karan Patil", id: "TC-1005", initials: "KP" },
  },
  {
    id: "BK-2025-0139",
    customer: "Anita Deshmukh",
    phone: "9898765432",
    initials: "AD",
    property: "Shree Plaza",
    propertyType: "Shop No. 12",
    service: "General Pest Control",
    serviceArea: "Office",
    date: "24 May 2025",
    time: "03:00 PM - 05:00 PM",
    priority: "High",
    amount: "2,000",
    status: "Assigned",
    technician: { name: "Sameer Shaikh", id: "TC-1003", initials: "SS" },
  },
  {
    id: "BK-2025-0138",
    customer: "Neha Joshi",
    phone: "9123456780",
    initials: "NJ",
    property: "Sunrise Villa",
    propertyType: "House No. 45",
    service: "Mosquito Control",
    serviceArea: "Residential",
    date: "24 May 2025",
    time: "10:00 AM - 12:00 PM",
    priority: "Low",
    amount: "1,200",
    status: "Scheduled",
    technician: { name: "Imran Khan", id: "TC-1015", initials: "IK" },
  },
  {
    id: "BK-2025-0137",
    customer: "Sandeep Yadav",
    phone: "9356789012",
    initials: "SY",
    property: "City Homes",
    propertyType: "Block B-101",
    service: "Bed Bug Treatment",
    serviceArea: "Bedroom",
    date: "25 May 2025",
    time: "12:00 PM - 02:00 PM",
    priority: "High",
    amount: "2,800",
    status: "Assigned",
    technician: { name: "Amit Sharma", id: "TC-1008", initials: "AS" },
  },
];

const columns = [
  { key: "id", label: "Booking ID" },
  { key: "customer", label: "Customer" },
  { key: "property", label: "Property" },
  { key: "service", label: "Service" },
  { key: "date", label: "Schedule Date & Time" },
  { key: "priority", label: "Priority" },
  { key: "technician", label: "Assigned Technician" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
];

const priorityClass = {
  High: "ab-badge-danger",
  Medium: "ab-badge-warning",
  Low: "ab-badge-neutral",
};

const statusClass = {
  Assigned: "ab-badge-success",
  Scheduled: "ab-badge-info",
  "In Progress": "ab-badge-warning",
};

const pages = [1, 2, 3, 4, 5];

export default function AcceptedBookings() {
  const [activePage, setActivePage] = useState(1);
  const navigate = useNavigate();

  return (
    <div className="ab-page">
      <nav className="ab-breadcrumb" aria-label="Breadcrumb">
          Admin
        <ChevronRight size={14} className="ab-breadcrumb-sep" />
          Bookings
        <ChevronRight size={14} className="ab-breadcrumb-sep" />
        <span className="ab-breadcrumb-current">Accepted Bookings</span>
      </nav>

      <header className="ab-header">
        <div className="ab-header-left">
          <span className="ab-header-icon">
            <CheckCircle2 size={26} strokeWidth={2} />
          </span>
          <div>
            <h1 className="ab-title">Accepted Bookings</h1>
            <p className="ab-subtitle">
              View all accepted service bookings and their assigned technicians
            </p>
          </div>
        </div>

        <div className="ab-header-actions">
          <button type="button" className="ab-btn ab-btn-outline">
            <Download size={16} strokeWidth={2} />
            Export
          </button>
          <button type="button" className="ab-btn ab-btn-primary">
            <RefreshCw size={16} strokeWidth={2} />
            Refresh
          </button>
        </div>
      </header>

      

      <section className="ab-filters-card">
        <div className="ab-search-wrap">
          <Search size={16} className="ab-search-icon" />
          <input
            type="text"
            className="ab-search-input"
            placeholder="Search by booking ID, customer, phone or property..."
          />
        </div>

        <div className="ab-filter-field">
          <label className="ab-filter-label">Service Type</label>
          <div className="ab-select">
            <select defaultValue="All Services">
              <option>All Services</option>
              <option>Termite Control</option>
              <option>Cockroach Control</option>
              <option>Rodent Control</option>
              <option>General Pest Control</option>
              <option>Mosquito Control</option>
              <option>Bed Bug Treatment</option>
            </select>
            <ChevronDown size={16} className="ab-select-caret" />
          </div>
        </div>

        <div className="ab-filter-field">
          <label className="ab-filter-label">Technician</label>
          <div className="ab-select">
            <select defaultValue="All Technicians">
              <option>All Technicians</option>
              <option>Amit Sharma</option>
              <option>Rohit Verma</option>
              <option>Karan Patil</option>
              <option>Sameer Shaikh</option>
              <option>Imran Khan</option>
            </select>
            <ChevronDown size={16} className="ab-select-caret" />
          </div>
        </div>

        <div className="ab-filter-field">
          <label className="ab-filter-label">Priority</label>
          <div className="ab-select">
            <select defaultValue="All Priorities">
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <ChevronDown size={16} className="ab-select-caret" />
          </div>
        </div>

        <div className="ab-filter-field">
          <label className="ab-filter-label">Date Range</label>
          <button type="button" className="ab-date-input">
            <Calendar size={16} strokeWidth={2} />
            Select Date Range
          </button>
        </div>

        <button type="button" className="ab-btn ab-btn-outline ab-clear-btn">
          <Filter size={16} strokeWidth={2} />
          Clear Filters
        </button>
      </section>

      <section className="ab-table-card">
        <div className="ab-table-scroll">
          <table className="ab-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>
                    <span className="ab-th-content">
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
                  <tr key={b.id}>
                    <td>
                      <span className="ab-booking-id">{b.id}</span>
                    </td>
                    <td>
                      <div className="ab-cell-with-avatar">
                        <span className="ab-avatar">{b.initials}</span>
                        <div className="ab-cell-text">
                          <span className="ab-cell-primary">{b.customer}</span>
                          <span className="ab-cell-secondary">{b.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="ab-cell-with-icon">
                        <span className="ab-cell-icon">
                          <Building2 size={16} strokeWidth={2} />
                        </span>
                        <div className="ab-cell-text">
                          <span className="ab-cell-primary">{b.property}</span>
                          <span className="ab-cell-secondary">{b.propertyType}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="ab-cell-with-icon">
                        <span className="ab-cell-icon">
                          <ServiceIcon size={16} strokeWidth={2} />
                        </span>
                        <div className="ab-cell-text">
                          <span className="ab-cell-primary">{b.service}</span>
                          <span className="ab-cell-secondary">{b.serviceArea}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="ab-cell-with-icon">
                        <span className="ab-cell-icon">
                          <Calendar size={16} strokeWidth={2} />
                        </span>
                        <div className="ab-cell-text">
                          <span className="ab-cell-primary">{b.date}</span>
                          <span className="ab-cell-secondary">
                            <Clock size={12} strokeWidth={2} className="ab-inline-icon" />
                            {b.time}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`ab-badge ${priorityClass[b.priority]}`}>
                        {b.priority}
                      </span>
                    </td>
                    <td>
                      <div className="ab-technician-cell">
                        <span className="ab-tech-avatar">{b.technician.initials}</span>
                        <div className="ab-cell-text">
                          <span className="ab-cell-primary">{b.technician.name}</span>
                          <span className="ab-cell-secondary">{b.technician.id}</span>
                        </div>
                        <button
                          type="button"
                          className="ab-tech-call-btn"
                          aria-label={`Call ${b.technician.name}`}
                        >
                          <Phone size={13} strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className="ab-amount">₹ {b.amount}</span>
                    </td>
                    <td>
                      <span className={`ab-badge ${statusClass[b.status]}`}>{b.status}</span>
                    </td>
                    <td>
                      <div className="ab-actions-cell">
                        <button type="button" className="ab-btn ab-btn-outline ab-btn-sm" onClick={() => navigate("/admin/bookings/assigned-bookings-view")}>
                          <Eye size={14} strokeWidth={2} />
                          View
                        </button>
                        <button
                          type="button"
                          className="ab-icon-btn"
                          aria-label="More actions"
                        >
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

        <div className="ab-table-footer">
          <span className="ab-showing-text">Showing 1 to 6 of 56 bookings</span>

          <div className="ab-pagination">
            <button type="button" className="ab-page-btn ab-page-nav" disabled={activePage === 1}>
              <ChevronLeft size={14} strokeWidth={2} />
              Previous
            </button>
            {pages.map((p) => (
              <button
                key={p}
                type="button"
                className={`ab-page-btn ${activePage === p ? "ab-page-btn-active" : ""}`}
                onClick={() => setActivePage(p)}
              >
                {p}
              </button>
            ))}
            <span className="ab-page-ellipsis">
              <MoreHorizontal size={14} strokeWidth={2} />
            </span>
            <button type="button" className="ab-page-btn ab-page-nav">
              Next
              <ChevronRight size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}