import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Plus,
  MessageSquare,
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Search,
  ChevronDown,
  Filter,
  Calendar,
  Eye,
  ChevronLeft,
} from "lucide-react";
import "./CustomerComplaints.css";

const stats = [
  { label: "Total Complaints", sub: "All Time", value: 12, icon: MessageSquare, tone: "neutral" },
  { label: "Pending", sub: "Awaiting Response", value: 4, icon: Clock, tone: "warning" },
  { label: "Under Review", sub: "Being Reviewed", value: 3, icon: RefreshCw, tone: "info" },
  { label: "Resolved", sub: "Completed", value: 5, icon: CheckCircle2, tone: "success" },
  { label: "Rejected", sub: "Not Approved", value: 0, icon: XCircle, tone: "danger" },
];

const ALL_COMPLAINTS = [
  {
    id: "CMP-2025-0012",
    bookingId: "BK-2025-0102",
    category: "Pest Still Exists",
    type: "Termite Treatment",
    dateSubmitted: "22 May 2025",
    timeSubmitted: "10:15 AM",
    status: "Pending",
    lastUpdated: "22 May 2025",
    lastUpdatedTime: "10:15 AM",
  },
  {
    id: "CMP-2025-0011",
    bookingId: "BK-2025-0098",
    category: "Service Quality",
    type: "Cockroach Control",
    dateSubmitted: "18 May 2025",
    timeSubmitted: "02:30 PM",
    status: "Under Review",
    lastUpdated: "21 May 2025",
    lastUpdatedTime: "04:45 PM",
  },
  {
    id: "CMP-2025-0010",
    bookingId: "BK-2025-0092",
    category: "Technician Behavior",
    type: "General Pest Control",
    dateSubmitted: "15 May 2025",
    timeSubmitted: "11:20 AM",
    status: "Resolved",
    lastUpdated: "19 May 2025",
    lastUpdatedTime: "03:10 PM",
  },
  {
    id: "CMP-2025-0009",
    bookingId: "BK-2025-0088",
    category: "Late Visit",
    type: "Mosquito Control",
    dateSubmitted: "12 May 2025",
    timeSubmitted: "09:05 AM",
    status: "Resolved",
    lastUpdated: "14 May 2025",
    lastUpdatedTime: "01:30 PM",
  },
  {
    id: "CMP-2025-0008",
    bookingId: "BK-2025-0080",
    category: "Payment Issue",
    type: "Termite Treatment",
    dateSubmitted: "08 May 2025",
    timeSubmitted: "04:40 PM",
    status: "Resolved",
    lastUpdated: "10 May 2025",
    lastUpdatedTime: "11:15 AM",
  },
];

const statusClass = {
  Pending: "mc-badge-warning",
  "Under Review": "mc-badge-info",
  Resolved: "mc-badge-success",
  Rejected: "mc-badge-danger",
};

const PAGE_SIZE = 5;

export default function MyComplaints({ onRaiseComplaint, onViewDetails }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return ALL_COMPLAINTS.filter((c) => {
      const matchesSearch =
        !search.trim() ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.bookingId.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All Status" || c.status === statusFilter;
      const matchesCategory = categoryFilter === "All Categories" || c.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [search, statusFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("All Status");
    setCategoryFilter("All Categories");
    setPage(1);
  };

  const handleRaiseComplaint = () => {
    if (typeof onRaiseComplaint === "function") {
      onRaiseComplaint();
    } else {
      console.log("Navigate to Raise New Complaint");
    }
  };

  const handleView = (complaintId) => {
    if (typeof onViewDetails === "function") {
      onViewDetails(complaintId);
    } else {
      console.log("View details for", complaintId);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="mc-page">
      <nav className="mc-breadcrumb" aria-label="Breadcrumb">
        <a href="#" className="mc-breadcrumb-link">
          Dashboard
        </a>
        <ChevronRight size={14} className="mc-breadcrumb-sep" />
        <a href="#" className="mc-breadcrumb-link">
          Complaints
        </a>
        <ChevronRight size={14} className="mc-breadcrumb-sep" />
        <span className="mc-breadcrumb-current">My Complaints</span>
      </nav>

      <header className="mc-header">
        <div className="mc-header-left">
          <span className="mc-header-icon">
            <MessageSquare size={26} strokeWidth={2} />
          </span>
          <div>
            <h1 className="mc-title">My Complaints</h1>
            <p className="mc-subtitle">Raise a new complaint or track the status of your existing complaints.</p>
          </div>
        </div>
      </header>

      <section className="mc-stats-grid">
        {stats.map(({ label, sub, value, icon: Icon, tone }) => (
          <div className="mc-stat-card" key={label}>
            <span className={`mc-stat-icon mc-stat-icon-${tone}`}>
              <Icon size={22} strokeWidth={2} />
            </span>
            <div className="mc-stat-text">
              <span className="mc-stat-label">{label}</span>
              <span className="mc-stat-value">{value}</span>
              <span className="mc-stat-sub">{sub}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="mc-filters-card">
        <div className="mc-search-wrap">
          <Search size={16} className="mc-search-icon" />
          <input
            type="text"
            className="mc-search-input"
            placeholder="Search by complaint ID, booking ID or issue..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="mc-select">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Under Review</option>
            <option>Resolved</option>
            <option>Rejected</option>
          </select>
          <ChevronDown size={16} className="mc-select-caret" />
        </div>

        <div className="mc-select">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
          >
            <option>All Categories</option>
            <option>Pest Still Exists</option>
            <option>Service Quality</option>
            <option>Technician Behavior</option>
            <option>Late Visit</option>
            <option>Payment Issue</option>
          </select>
          <ChevronDown size={16} className="mc-select-caret" />
        </div>

        <button type="button" className="mc-date-input">
          <Calendar size={16} strokeWidth={2} />
          Select Date Range
        </button>

        <button type="button" className="mc-btn mc-btn-outline mc-clear-btn" onClick={handleClearFilters}>
          <Filter size={16} strokeWidth={2} />
          Clear Filters
        </button>
      </section>

      <section className="mc-table-card">
        <div className="mc-table-scroll">
          <table className="mc-table">
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Booking ID</th>
                <th>Issue Category</th>
                <th>Date Submitted</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="mc-empty-state">
                    No complaints match your filters.
                  </td>
                </tr>
              ) : (
                pageItems.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="mc-id-cell">
                        <span className="mc-id-icon">
                          <MessageSquare size={16} strokeWidth={2} />
                        </span>
                        <span className="mc-complaint-id">{c.id}</span>
                      </div>
                    </td>
                    <td>
                      <span className="mc-booking-id">{c.bookingId}</span>
                    </td>
                    <td>
                      <div className="mc-cell-text">
                        <span className="mc-cell-primary">{c.category}</span>
                        <span className="mc-cell-secondary">{c.type}</span>
                      </div>
                    </td>
                    <td>
                      <div className="mc-cell-with-icon">
                        <Calendar size={14} strokeWidth={2} className="mc-inline-icon" />
                        <div className="mc-cell-text">
                          <span className="mc-cell-primary">{c.dateSubmitted}</span>
                          <span className="mc-cell-secondary">{c.timeSubmitted}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`mc-badge ${statusClass[c.status]}`}>{c.status}</span>
                    </td>
                    <td>
                      <div className="mc-cell-with-icon">
                        <Calendar size={14} strokeWidth={2} className="mc-inline-icon" />
                        <div className="mc-cell-text">
                          <span className="mc-cell-primary">{c.lastUpdated}</span>
                          <span className="mc-cell-secondary">{c.lastUpdatedTime}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="mc-btn mc-btn-outline mc-btn-sm"
                        onClick={() => navigate("/customer/complaints/view-details")}
                      >
                        <Eye size={14} strokeWidth={2} />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mc-table-footer">
          <span className="mc-showing-text">
            Showing {pageItems.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
            {(page - 1) * PAGE_SIZE + pageItems.length} of {filtered.length} complaints
          </span>

          <div className="mc-pagination">
            <button
              type="button"
              className="mc-page-btn mc-page-nav"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={14} strokeWidth={2} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                type="button"
                className={`mc-page-btn ${page === i + 1 ? "mc-page-btn-active" : ""}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              className="mc-page-btn mc-page-nav"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}