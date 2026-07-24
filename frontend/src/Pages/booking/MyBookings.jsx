import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Plus,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  XCircle,
  Search,
  ChevronDown,
  Filter,
  Bug,
  PawPrint,
  User,
  Phone,
  RefreshCw,
  Ban,
  RotateCcw,
  MapPin,
  Headphones,
  ChevronLeft,
} from "lucide-react";
import "./MyBookings.css";

const stats = [
  { label: "Total Bookings", sub: "All Time", value: 12, icon: Calendar, tone: "neutral" },
  { label: "Upcoming", sub: "Scheduled Services", value: 3, icon: Clock, tone: "warning" },
  { label: "In Progress", sub: "Currently Active", value: 2, icon: UserCheck, tone: "info" },
  { label: "Completed", sub: "Successfully Completed", value: 6, icon: CheckCircle2, tone: "success" },
  { label: "Cancelled", sub: "Cancelled Bookings", value: 1, icon: XCircle, tone: "danger" },
];

const serviceIcons = {
  "Termite Control": Bug,
  "Cockroach Control": Bug,
  "Mosquito Control": Bug,
  "Rodent Control": PawPrint,
  "Bed Bug Treatment": Bug,
};

const ALL_BOOKINGS = [
  {
    id: "BK-2025-0012",
    bookedOn: "22 May 2025",
    service: "Termite Control",
    serviceArea: "Full Home Treatment",
    date: "28 May 2025",
    time: "10:00 AM",
    status: "Upcoming",
    statusNote: "Scheduled",
    technician: "Rohit Sharma",
    amount: "2,499",
    paymentStatus: "Paid",
  },
  {
    id: "BK-2025-0011",
    bookedOn: "20 May 2025",
    service: "Cockroach Control",
    serviceArea: "Kitchen Area",
    date: "20 May 2025",
    time: "02:30 PM",
    status: "In Progress",
    statusNote: "Technician On Site",
    technician: "Amit Patil",
    amount: "1,299",
    paymentStatus: "Paid",
  },
  {
    id: "BK-2025-0010",
    bookedOn: "18 May 2025",
    service: "Mosquito Control",
    serviceArea: "Monthly Spray",
    date: "18 May 2025",
    time: "09:00 AM",
    status: "Completed",
    statusNote: "Service Completed",
    technician: "Sandeep Kumar",
    amount: "999",
    paymentStatus: "Paid",
  },
  {
    id: "BK-2025-0009",
    bookedOn: "12 May 2025",
    service: "Rodent Control",
    serviceArea: "Rat Treatment",
    date: "12 May 2025",
    time: "11:00 AM",
    status: "Completed",
    statusNote: "Service Completed",
    technician: "Mahesh Yadav",
    amount: "1,499",
    paymentStatus: "Paid",
  },
  {
    id: "BK-2025-0008",
    bookedOn: "07 May 2025",
    service: "Bed Bug Treatment",
    serviceArea: "Bedroom Treatment",
    date: "07 May 2025",
    time: "03:30 PM",
    status: "Cancelled",
    statusNote: "Cancelled by You",
    technician: null,
    amount: "1,799",
    paymentStatus: "Refunded",
  },
];

const statusBadgeClass = {
  Upcoming: "mb-badge-warning",
  "In Progress": "mb-badge-info",
  Completed: "mb-badge-success",
  Cancelled: "mb-badge-danger",
};

const paymentBadgeClass = {
  Paid: "mb-badge-success",
  Refunded: "mb-badge-neutral",
};

const PAGE_SIZE = 5;

export default function MyBookings({
  onBookNewService,
  onReschedule,
  onCancelBooking,
  onTrackTechnician,
  onRebook,
  onCallTechnician,
  onContactSupport,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [serviceFilter, setServiceFilter] = useState("All Services");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return ALL_BOOKINGS.filter((b) => {
      const matchesSearch =
        !search.trim() ||
        b.id.toLowerCase().includes(search.toLowerCase()) ||
        b.service.toLowerCase().includes(search.toLowerCase()) ||
        b.serviceArea.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All Status" || b.status === statusFilter;
      const matchesService = serviceFilter === "All Services" || b.service === serviceFilter;
      return matchesSearch && matchesStatus && matchesService;
    });
  }, [search, statusFilter, serviceFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("All Status");
    setServiceFilter("All Services");
    setPage(1);
  };

  const callHandler = (fn, fallbackLabel) => (bookingId) => {
    if (typeof fn === "function") {
      fn(bookingId);
    } else {
      console.log(fallbackLabel, bookingId);
    }
  };

  const handleBookNewService = () => {
    if (typeof onBookNewService === "function") {
      onBookNewService();
    } else {
      console.log("Navigate to Book New Service");
    }
  };

  const handleReschedule = callHandler(onReschedule, "Reschedule booking");
  const handleCancel = callHandler(onCancelBooking, "Cancel booking");
  const handleTrack = callHandler(onTrackTechnician, "Track technician for");
  const handleRebook = callHandler(onRebook, "Rebook service for");
  const handleCall = callHandler(onCallTechnician, "Call technician for");

  const handleContactSupport = () => {
    if (typeof onContactSupport === "function") {
      onContactSupport();
    } else {
      console.log("Contact support clicked");
    }
  };

  const renderActions = (booking) => {
    switch (booking.status) {
      case "Upcoming":
        return (
          <div className="mb-actions-cell">
            <button
              type="button"
              className="mb-btn mb-btn-outline mb-btn-sm"
              onClick={() => handleReschedule(booking.id)}
            >
              <RefreshCw size={13} strokeWidth={2} />
              Reschedule
            </button>
            <button
              type="button"
              className="mb-icon-btn mb-icon-btn-danger"
              onClick={() => handleCancel(booking.id)}
              aria-label="Cancel booking"
            >
              <Ban size={15} strokeWidth={2} />
            </button>
          </div>
        );
      case "In Progress":
        return (
          <button
            type="button"
            className="mb-btn mb-btn-outline mb-btn-sm"
            onClick={() => handleTrack(booking.id)}
          >
            <MapPin size={13} strokeWidth={2} />
            Track Technician
          </button>
        );
      case "Completed":
      case "Cancelled":
        return (
          <button
            type="button"
            className="mb-btn mb-btn-outline mb-btn-sm"
            onClick={() => handleRebook(booking.id)}
          >
            <RotateCcw size={13} strokeWidth={2} />
            Rebook
          </button>
        );
      default:
        return null;
    }
  };

  const navigate = useNavigate();

  return (
    <div className="mb-page">
      <nav className="mb-breadcrumb" aria-label="Breadcrumb">
        <a href="#" className="mb-breadcrumb-link">
          Dashboard
        </a>
        <ChevronRight size={14} className="mb-breadcrumb-sep" />
        <span className="mb-breadcrumb-current">My Bookings</span>
      </nav>

      <header className="mb-header">
        <div className="mb-header-left">
          <span className="mb-header-icon">
            <Calendar size={26} strokeWidth={2} />
          </span>
          <div>
            <h1 className="mb-title">My Bookings</h1>
            <p className="mb-subtitle">View and track all your pest control service bookings.</p>
          </div>
        </div>

        <button type="button" className="mb-btn mb-btn-primary" onClick={() => navigate("/customer/create-booking")}>
          <Plus size={16} strokeWidth={2} />
          Book New Service
        </button>
      </header>

      <section className="mb-stats-grid">
        {stats.map(({ label, sub, value, icon: Icon, tone }) => (
          <div className="mb-stat-card" key={label}>
            <span className={`mb-stat-icon mb-stat-icon-${tone}`}>
              <Icon size={22} strokeWidth={2} />
            </span>
            <div className="mb-stat-text">
              <span className="mb-stat-label">{label}</span>
              <span className="mb-stat-value">{value}</span>
              <span className="mb-stat-sub">{sub}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="mb-filters-card">
        <div className="mb-search-wrap">
          <Search size={16} className="mb-search-icon" />
          <input
            type="text"
            className="mb-search-input"
            placeholder="Search by booking ID, service or address..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="mb-select">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option>All Status</option>
            <option>Upcoming</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
          <ChevronDown size={16} className="mb-select-caret" />
        </div>

        <div className="mb-select">
          <select
            value={serviceFilter}
            onChange={(e) => {
              setServiceFilter(e.target.value);
              setPage(1);
            }}
          >
            <option>All Services</option>
            <option>Termite Control</option>
            <option>Cockroach Control</option>
            <option>Mosquito Control</option>
            <option>Rodent Control</option>
            <option>Bed Bug Treatment</option>
          </select>
          <ChevronDown size={16} className="mb-select-caret" />
        </div>

        <button type="button" className="mb-date-input">
          <Calendar size={16} strokeWidth={2} />
          Select Date Range
        </button>

        <button type="button" className="mb-btn mb-btn-outline mb-clear-btn" onClick={handleClearFilters}>
          <Filter size={16} strokeWidth={2} />
          Clear Filters
        </button>
      </section>

      <section className="mb-table-card">
        <div className="mb-table-scroll">
          <table className="mb-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Service</th>
                <th>Date &amp; Time</th>
                <th>Status</th>
                <th>Assigned Technician</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="mb-empty-state">
                    No bookings match your filters.
                  </td>
                </tr>
              ) : (
                pageItems.map((b) => {
                  const ServiceIcon = serviceIcons[b.service] || Bug;
                  return (
                    <tr key={b.id}>
                      <td>
                        <div className="mb-id-cell">
                          <span className="mb-id-icon">
                            <Calendar size={16} strokeWidth={2} />
                          </span>
                          <div className="mb-cell-text">
                            <span className="mb-booking-id">{b.id}</span>
                            <span className="mb-cell-secondary">{b.bookedOn}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="mb-cell-with-icon">
                          <span className="mb-service-icon">
                            <ServiceIcon size={18} strokeWidth={1.75} />
                          </span>
                          <div className="mb-cell-text">
                            <span className="mb-cell-primary">{b.service}</span>
                            <span className="mb-cell-secondary">{b.serviceArea}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="mb-cell-with-icon">
                          <Calendar size={14} strokeWidth={2} className="mb-inline-icon" />
                          <div className="mb-cell-text">
                            <span className="mb-cell-primary">{b.date}</span>
                            <span className="mb-cell-secondary">
                              <Clock size={12} strokeWidth={2} className="mb-inline-icon" />
                              {b.time}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="mb-status-cell">
                          <span className={`mb-badge ${statusBadgeClass[b.status]}`}>{b.status}</span>
                          <span className="mb-status-note">{b.statusNote}</span>
                        </div>
                      </td>
                      <td>
                        {b.technician ? (
                          <div className="mb-technician-cell">
                            <span className="mb-tech-avatar">
                              <User size={16} strokeWidth={2} />
                            </span>
                            <div className="mb-cell-text">
                              <span className="mb-cell-primary">{b.technician}</span>
                              <span className="mb-cell-secondary">Technician</span>
                            </div>
                            <button
                              type="button"
                              className="mb-call-btn"
                              onClick={() => handleCall(b.id)}
                              aria-label={`Call ${b.technician}`}
                            >
                              <Phone size={13} strokeWidth={2} />
                            </button>
                          </div>
                        ) : (
                          <div className="mb-technician-cell mb-technician-empty">
                            <span className="mb-tech-avatar mb-tech-avatar-empty">—</span>
                            <span className="mb-cell-secondary">Not Assigned</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="mb-amount-cell">
                          <span className="mb-amount">₹{b.amount}</span>
                          <span className={`mb-badge ${paymentBadgeClass[b.paymentStatus]}`}>
                            {b.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td>{renderActions(b)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mb-table-footer">
          <span className="mb-showing-text">
            Showing {pageItems.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
            {(page - 1) * PAGE_SIZE + pageItems.length} of {filtered.length} bookings
          </span>

          <div className="mb-pagination">
            <button
              type="button"
              className="mb-page-btn mb-page-nav"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={14} strokeWidth={2} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                type="button"
                className={`mb-page-btn ${page === i + 1 ? "mb-page-btn-active" : ""}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              className="mb-page-btn mb-page-nav"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>

      <section className="mb-help-band">
        <div className="mb-help-left">
          <span className="mb-help-icon">
            <Headphones size={20} strokeWidth={2} />
          </span>
          <div>
            <h3 className="mb-help-title">Need help with your booking?</h3>
            <p className="mb-help-desc">Our support team is here to help you with any booking related queries.</p>
          </div>
        </div>
        <button type="button" className="mb-btn mb-btn-outline mb-support-btn" onClick={handleContactSupport}>
          <Headphones size={16} strokeWidth={2} />
          Contact Support
        </button>
      </section>
    </div>
  );
}