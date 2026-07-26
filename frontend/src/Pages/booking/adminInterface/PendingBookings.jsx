import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"
import {
  ClipboardList,
  Clock,
  CalendarDays,
  AlertTriangle,
  UserX,
  Search,
  Filter,
  Columns,
  Menu,
  Upload,
  RefreshCw,
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  User,
  Bug,
  ShieldCheck,
} from "lucide-react";
import "./PendingBookings.css";

const STAT_CARDS = [
  {
    id: "total",
    label: "Total Pending",
    value: 48,
    caption: "All pending bookings",
    icon: ClipboardList,
    tone: "green",
  },
  {
    id: "today",
    label: "Scheduled Today",
    value: 12,
    caption: "Due for today",
    icon: Clock,
    tone: "amber",
  },
  {
    id: "week",
    label: "Scheduled This Week",
    value: 26,
    caption: "Due this week",
    icon: CalendarDays,
    tone: "green",
  },
  {
    id: "priority",
    label: "High Priority",
    value: 8,
    caption: "Urgent bookings",
    icon: AlertTriangle,
    tone: "red",
  },
  {
    id: "unassigned",
    label: "Unassigned",
    value: 15,
    caption: "Need technician",
    icon: UserX,
    tone: "blue",
  },
];

const BOOKINGS = [
  {
    id: "BK-250515-001",
    requestedOn: "14 May 2025, 04:30 PM",
    customer: "Rajesh Sharma",
    phone: "9876543210",
    email: "rajesh@gmail.com",
    property: "Sharma Residency",
    location: "Pune, Maharashtra",
    pest: "Cockroach",
    service: "General Pest Control",
    date: "15 May 2025",
    time: "10:00 AM",
    priority: "High",
    assignedTo: null,
    remarks: "Severe infestation in kitchen area",
  },
  {
    id: "BK-250515-002",
    requestedOn: "14 May 2025, 03:15 PM",
    customer: "Priya Patel",
    phone: "9876543211",
    email: "priya@gmail.com",
    property: "Patel Villa",
    location: "Pimpri, Pune",
    pest: "Termite",
    service: "Termite Treatment",
    date: "15 May 2025",
    time: "02:00 PM",
    priority: "Medium",
    assignedTo: null,
    remarks: "Pre-construction treatment",
  },
  {
    id: "BK-250515-003",
    requestedOn: "14 May 2025, 02:50 PM",
    customer: "Sunil Gupta",
    phone: "9876543212",
    email: "sunil@gmail.com",
    property: "Gupta Apartments",
    location: "Wakad, Pune",
    pest: "Rodent",
    service: "Rodent Control",
    date: "16 May 2025",
    time: "11:00 AM",
    priority: "High",
    assignedTo: null,
    remarks: "Rat activity in basement",
  },
  {
    id: "BK-250515-004",
    requestedOn: "14 May 2025, 01:40 PM",
    customer: "Anita Singh",
    phone: "9876543213",
    email: "anita@gmail.com",
    property: "Singh Villa",
    location: "Hinjewadi, Pune",
    pest: "Mosquito",
    service: "Mosquito Control",
    date: "16 May 2025",
    time: "03:30 PM",
    priority: "Low",
    assignedTo: null,
    remarks: "Mosquito breeding in garden",
  },
  {
    id: "BK-250515-005",
    requestedOn: "14 May 2025, 12:20 PM",
    customer: "Vikram Mehta",
    phone: "9876543214",
    email: "vikram@gmail.com",
    property: "Mehta House",
    location: "Baner, Pune",
    pest: "Ant",
    service: "General Pest Control",
    date: "17 May 2025",
    time: "09:00 AM",
    priority: "Medium",
    assignedTo: null,
    remarks: "Ants in kitchen and pantry",
  },
];

const PEST_ICONS = {
  Cockroach: Bug,
  Termite: Bug,
  Rodent: Bug,
  Mosquito: Bug,
  Ant: Bug,
};

const TOTAL_RECORDS = 48;
const TOTAL_PAGES = 10;

const PendingBooking = () => {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [pestFilter, setPestFilter] = useState("All Pest Type");
  const [serviceFilter, setServiceFilter] = useState("All Service");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  const filteredBookings = useMemo(() => {
    return BOOKINGS.filter((booking) => {
      const matchesSearch =
        searchValue.trim() === "" ||
        booking.id.toLowerCase().includes(searchValue.toLowerCase()) ||
        booking.customer.toLowerCase().includes(searchValue.toLowerCase()) ||
        booking.pest.toLowerCase().includes(searchValue.toLowerCase());

      const matchesPriority =
        priorityFilter === "All Priority" || booking.priority === priorityFilter;

      const matchesPest =
        pestFilter === "All Pest Type" || booking.pest === pestFilter;

      const matchesService =
        serviceFilter === "All Service" || booking.service === serviceFilter;

      return matchesSearch && matchesPriority && matchesPest && matchesService;
    });
  }, [searchValue, priorityFilter, pestFilter, serviceFilter]);

  const allSelected =
    filteredBookings.length > 0 && selectedRows.length === filteredBookings.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredBookings.map((b) => b.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSearchValue("");
    setStatusFilter("Pending");
    setPriorityFilter("All Priority");
    setPestFilter("All Pest Type");
    setServiceFilter("All Service");
  };

  const handleAccept = (id) => {
    console.log("Accepted booking:", id);
  };

  const handleReject = (id) => {
    console.log("Rejected booking:", id);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= TOTAL_PAGES) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = [1, 2, 3];

  const navigate = useNavigate();

  return (
    <div className="pb-page">
      {/* Page Header */}
      <div className="pb-header">
        <div className="pb-header-left">
          <h1 className="pb-title">Pending Booking</h1>
          <div className="pb-breadcrumb">
            <span>Home</span>
            <ChevronRight size={14} className="pb-breadcrumb-sep" />
            <span>Bookings</span>
            <ChevronRight size={14} className="pb-breadcrumb-sep" />
            <span className="pb-breadcrumb-current">Pending Booking</span>
          </div>
        </div>
        <div className="pb-header-actions">
          <button type="button" className="pb-btn pb-btn-outline">
            <Upload size={16} />
            Export
          </button>
          <button type="button" className="pb-btn pb-btn-primary">
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistic Cards */}
      <div className="pb-stats-grid">
        {STAT_CARDS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="pb-stat-card" key={stat.id}>
              <div className={`pb-stat-icon pb-stat-icon--${stat.tone}`}>
                <Icon size={22} />
              </div>
              <div className="pb-stat-content">
                <span className="pb-stat-label">{stat.label}</span>
                <span className="pb-stat-value">{stat.value}</span>
                <span className="pb-stat-caption">{stat.caption}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="pb-filters-card">
        <div className="pb-search-box">
          <Search size={18} className="pb-search-icon" />
          <input
            type="text"
            placeholder="Search booking ID, customer, pest type..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pb-search-input"
          />
        </div>

        <div className="pb-filter-group">
          <label className="pb-filter-label">Status</label>
          <div className="pb-select-wrapper">
            <select
              className="pb-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
            <ChevronDown size={16} className="pb-select-icon" />
          </div>
        </div>

        <div className="pb-filter-group">
          <label className="pb-filter-label">Priority</label>
          <div className="pb-select-wrapper">
            <select
              className="pb-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option>All Priority</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <ChevronDown size={16} className="pb-select-icon" />
          </div>
        </div>

        <div className="pb-filter-group">
          <label className="pb-filter-label">Pest Type</label>
          <div className="pb-select-wrapper">
            <select
              className="pb-select"
              value={pestFilter}
              onChange={(e) => setPestFilter(e.target.value)}
            >
              <option>All Pest Type</option>
              <option>Cockroach</option>
              <option>Termite</option>
              <option>Rodent</option>
              <option>Mosquito</option>
              <option>Ant</option>
            </select>
            <ChevronDown size={16} className="pb-select-icon" />
          </div>
        </div>

        <div className="pb-filter-group">
          <label className="pb-filter-label">Service Type</label>
          <div className="pb-select-wrapper">
            <select
              className="pb-select"
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
            >
              <option>All Service</option>
              <option>General Pest Control</option>
              <option>Termite Treatment</option>
              <option>Rodent Control</option>
              <option>Mosquito Control</option>
            </select>
            <ChevronDown size={16} className="pb-select-icon" />
          </div>
        </div>

        <div className="pb-filter-group">
          <label className="pb-filter-label">Date Range</label>
          <div className="pb-date-input">
            <Calendar size={16} className="pb-date-icon" />
            <span>01 May 2025 - 31 May 2025</span>
          </div>
        </div>

        <button type="button" className="pb-btn pb-btn-ghost pb-clear-btn" onClick={clearFilters}>
          <RefreshCw size={15} />
          Clear Filters
        </button>
      </div>

      {/* Table Section */}
      <div className="pb-table-card">
        <div className="pb-table-header">
          <div className="pb-table-title-group">
            <h2 className="pb-table-title">Pending Bookings</h2>
            <span className="pb-records-badge">{TOTAL_RECORDS} Records</span>
          </div>
          <div className="pb-table-actions">
            <button type="button" className="pb-btn pb-btn-outline pb-btn-sm">
              <Filter size={15} />
              Filter
            </button>
            <button type="button" className="pb-btn pb-btn-outline pb-btn-sm">
              <Columns size={15} />
              Columns
            </button>
            <button type="button" className="pb-btn pb-btn-icon-only">
              <Menu size={16} />
            </button>
          </div>
        </div>

        <div className="pb-table-scroll">
          <table className="pb-table">
            <thead>
              <tr>
                <th className="pb-th-checkbox">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="pb-checkbox"
                  />
                </th>
                <th>
                  Booking ID <ChevronUp size={12} className="pb-sort-icon" />
                </th>
                <th>
                  Customer Details <ChevronUp size={12} className="pb-sort-icon" />
                </th>
                <th>
                  Property Details <ChevronUp size={12} className="pb-sort-icon" />
                </th>
                <th>
                  Pest Type <ChevronUp size={12} className="pb-sort-icon" />
                </th>
                <th>
                  Service Type <ChevronUp size={12} className="pb-sort-icon" />
                </th>
                <th>
                  Schedule <ChevronUp size={12} className="pb-sort-icon" />
                </th>
                <th>
                  Priority <ChevronUp size={12} className="pb-sort-icon" />
                </th>
                <th>
                  Assigned To <ChevronUp size={12} className="pb-sort-icon" />
                </th>
                <th>Remarks</th>
                <th className="pb-th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const PestIcon = PEST_ICONS[booking.pest] || Bug;
                return (
                  <tr key={booking.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(booking.id)}
                        onChange={() => toggleSelectRow(booking.id)}
                        className="pb-checkbox"
                      />
                    </td>
                    <td>
                      <span className="pb-booking-id">{booking.id}</span>
                      <span className="pb-requested-on">
                        Requested on {booking.requestedOn}
                      </span>
                    </td>
                    <td>
                      <span className="pb-customer-name">{booking.customer}</span>
                      <span className="pb-customer-sub">
                        <Phone size={12} /> {booking.phone}
                      </span>
                      <span className="pb-customer-sub">
                        <Mail size={12} /> {booking.email}
                      </span>
                    </td>
                    <td>
                      <span className="pb-property-name">{booking.property}</span>
                      <span className="pb-customer-sub">
                        {booking.location}
                        <MapPin size={12} />
                      </span>
                    </td>
                    <td>
                      <span className="pb-pest-cell">
                        <PestIcon size={14} />
                        {booking.pest}
                      </span>
                    </td>
                    <td>
                      <span className="pb-service-cell">
                        <ShieldCheck size={14} />
                        {booking.service}
                      </span>
                    </td>
                    <td>
                      <span className="pb-schedule-row">
                        <Calendar size={12} /> {booking.date}
                      </span>
                      <span className="pb-schedule-row">
                        <Clock size={12} /> {booking.time}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`pb-badge pb-badge--${booking.priority.toLowerCase()}`}
                      >
                        {booking.priority}
                      </span>
                    </td>
                    <td>
                      <span className="pb-assigned-cell">
                        <User size={13} />
                        {booking.assignedTo || "Not Assigned"}
                      </span>
                    </td>
                    <td>
                      <span className="pb-remarks-cell">{booking.remarks}</span>
                    </td>
                    <td>
                      <div className="pb-action-cell">
                        <button
                          type="button"
                          className="pb-btn pb-btn-success pb-btn-xs"
                          onClick={() => navigate("/admin/bookings/assign-technician")}
                        >
                          <Check size={14} />
                          Accept
                        </button>
                        <button
                          type="button"
                          className="pb-btn pb-btn-danger-outline pb-btn-xs"
                          onClick={() => navigate("/admin/bookings/rejection-reason")}
                        >
                          <X size={14} />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={11}>
                    <div className="pb-empty-state">
                      <ClipboardList size={40} />
                      <h3>No pending bookings found</h3>
                      <p>Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pb-pagination">
          <span className="pb-pagination-info">
            Showing 1 to {filteredBookings.length} of {TOTAL_RECORDS} entries
          </span>
          <div className="pb-pagination-controls">
            <button
              type="button"
              className="pb-page-btn"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            {pageNumbers.map((page) => (
              <button
                key={page}
                type="button"
                className={`pb-page-btn ${currentPage === page ? "pb-page-btn--active" : ""}`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}
            <span className="pb-page-ellipsis">...</span>
            <button
              type="button"
              className={`pb-page-btn ${currentPage === TOTAL_PAGES ? "pb-page-btn--active" : ""}`}
              onClick={() => goToPage(TOTAL_PAGES)}
            >
              {TOTAL_PAGES}
            </button>
            <button
              type="button"
              className="pb-page-btn"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === TOTAL_PAGES}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingBooking;