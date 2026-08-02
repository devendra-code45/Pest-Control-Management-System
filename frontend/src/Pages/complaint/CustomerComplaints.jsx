import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
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
  AlertCircle,
} from "lucide-react";

import api from "../../api/axios";
import "./CustomerComplaints.css";

const statusClass = {
  Pending: "mc-badge-warning",
  "In Progress": "mc-badge-info",
  Resolved: "mc-badge-success",
  Closed: "mc-badge-danger",
  Rejected: "mc-badge-danger",
};

const PAGE_SIZE = 5;

const formatDate = (value) => {
  if (!value) return { date: "—", time: "" };

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { date: "—", time: "" };
  }

  return {
    date: date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

export default function MyComplaints() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    const loadComplaints = async () => {
      setLoading(true);
      setPageError("");

      try {
        const response = await api.get("/customer/complaints");
        setComplaints(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setPageError(
          error?.response?.data?.message ||
          "Unable to load complaints."
        );
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, []);

  const stats = useMemo(() => [
    {
      label: "Total Complaints",
      sub: "All Time",
      value: complaints.length,
      icon: MessageSquare,
      tone: "neutral",
    },
    {
      label: "Pending",
      sub: "Awaiting Response",
      value: complaints.filter((item) => item.status === "Pending").length,
      icon: Clock,
      tone: "warning",
    },
    {
      label: "In Progress",
      sub: "Being Reviewed",
      value: complaints.filter((item) => item.status === "In Progress").length,
      icon: RefreshCw,
      tone: "info",
    },
    {
      label: "Resolved",
      sub: "Completed",
      value: complaints.filter((item) => item.status === "Resolved").length,
      icon: CheckCircle2,
      tone: "success",
    },
    {
      label: "Closed / Rejected",
      sub: "Completed",
      value: complaints.filter((item) =>
        ["Closed", "Rejected"].includes(item.status)
      ).length,
      icon: XCircle,
      tone: "danger",
    },
  ], [complaints]);

  const categories = useMemo(() => [
    "All Categories",
    ...Array.from(new Set(complaints.map((item) => item.category).filter(Boolean))),
  ], [complaints]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return complaints.filter((complaint) => {
      const matchesSearch =
        !query ||
        complaint.id?.toLowerCase().includes(query) ||
        complaint.bookingId?.toLowerCase().includes(query) ||
        complaint.category?.toLowerCase().includes(query) ||
        complaint.subject?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All Status" ||
        complaint.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All Categories" ||
        complaint.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [complaints, search, statusFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("All Status");
    setCategoryFilter("All Categories");
    setPage(1);
  };

  return (
    <div className="mc-page">
      <nav className="mc-breadcrumb" aria-label="Breadcrumb">
        <span className="mc-breadcrumb-link" onClick={() => navigate("/customer/dashboard")}>Dashboard</span>
        <ChevronRight size={14} className="mc-breadcrumb-sep" />
        <span className="mc-breadcrumb-current">My Complaints</span>
      </nav>

      <header className="mc-header">
        <div className="mc-header-left">
          <span className="mc-header-icon"><MessageSquare size={26} strokeWidth={2} /></span>
          <div>
            <h1 className="mc-title">My Complaints</h1>
            <p className="mc-subtitle">Raise a complaint or track the status of your existing complaints.</p>
          </div>
        </div>
      </header>

      <section className="mc-stats-grid">
        {stats.map(({ label, sub, value, icon: Icon, tone }) => (
          <div className="mc-stat-card" key={label}>
            <span className={`mc-stat-icon mc-stat-icon-${tone}`}><Icon size={22} strokeWidth={2} /></span>
            <div className="mc-stat-text">
              <span className="mc-stat-label">{label}</span>
              <span className="mc-stat-value">{value}</span>
              <span className="mc-stat-sub">{sub}</span>
            </div>
          </div>
        ))}
      </section>

      {pageError && (
        <div className="mc-empty-state">
          <AlertCircle size={16} />
          {pageError}
        </div>
      )}

      <section className="mc-filters-card">
        <div className="mc-search-wrap">
          <Search size={16} className="mc-search-icon" />
          <input
            type="text"
            className="mc-search-input"
            placeholder="Search by complaint ID, booking ID or issue..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="mc-select">
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Closed</option>
            <option>Rejected</option>
          </select>
          <ChevronDown size={16} className="mc-select-caret" />
        </div>

        <div className="mc-select">
          <select
            value={categoryFilter}
            onChange={(event) => {
              setCategoryFilter(event.target.value);
              setPage(1);
            }}
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <ChevronDown size={16} className="mc-select-caret" />
        </div>

        <button type="button" className="mc-date-input" onClick={() => setPage(1)}>
          <Calendar size={16} strokeWidth={2} />
          All Dates
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
              {loading ? (
                <tr><td colSpan={7} className="mc-empty-state">Loading complaints...</td></tr>
              ) : pageItems.length === 0 ? (
                <tr><td colSpan={7} className="mc-empty-state">No complaints match your filters.</td></tr>
              ) : (
                pageItems.map((complaint) => {
                  const submitted = formatDate(complaint.createdAt);
                  const updated = formatDate(complaint.updatedAt);

                  return (
                    <tr key={complaint.id}>
                      <td>
                        <div className="mc-id-cell">
                          <span className="mc-id-icon"><MessageSquare size={16} strokeWidth={2} /></span>
                          <span className="mc-complaint-id">{complaint.id}</span>
                        </div>
                      </td>
                      <td><span className="mc-booking-id">{complaint.bookingId || "Not linked"}</span></td>
                      <td>
                        <div className="mc-cell-text">
                          <span className="mc-cell-primary">{complaint.category}</span>
                          <span className="mc-cell-secondary">{complaint.subject}</span>
                        </div>
                      </td>
                      <td>
                        <div className="mc-cell-with-icon">
                          <Calendar size={14} strokeWidth={2} className="mc-inline-icon" />
                          <div className="mc-cell-text">
                            <span className="mc-cell-primary">{submitted.date}</span>
                            <span className="mc-cell-secondary">{submitted.time}</span>
                          </div>
                        </div>
                      </td>
                      <td><span className={`mc-badge ${statusClass[complaint.status] || "mc-badge-info"}`}>{complaint.status}</span></td>
                      <td>
                        <div className="mc-cell-with-icon">
                          <Calendar size={14} strokeWidth={2} className="mc-inline-icon" />
                          <div className="mc-cell-text">
                            <span className="mc-cell-primary">{updated.date}</span>
                            <span className="mc-cell-secondary">{updated.time}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="mc-btn mc-btn-outline mc-btn-sm"
                          onClick={() => navigate(`/customer/complaints/${complaint.id}`)}
                        >
                          <Eye size={14} strokeWidth={2} />
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mc-table-footer">
          <span className="mc-showing-text">
            Showing {pageItems.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to{" "}
            {(currentPage - 1) * PAGE_SIZE + pageItems.length} of {filtered.length} complaints
          </span>

          <div className="mc-pagination">
            <button type="button" className="mc-page-btn mc-page-nav" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
              <ChevronLeft size={14} strokeWidth={2} />
            </button>

            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index + 1}
                type="button"
                className={`mc-page-btn ${currentPage === index + 1 ? "mc-page-btn-active" : ""}`}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button type="button" className="mc-page-btn mc-page-nav" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
              <ChevronRight size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
