import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Download,
  RefreshCw,
  XCircle,
  Calendar,
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
import api from "../../../api/axios";
import "./rejected-bookings.css";

const PAGE_SIZE = 6;

const serviceIcons = {
  "Termite Control": Bug,
  "Cockroach Control": Bug,
  "Rodent Control": Bug,
  "General Pest Control": Shield,
  "Mosquito Control": Bug,
  "Bed Bug Treatment": HomeIcon,
};

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

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "NA";

const formatDate = (value) => {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const formatTime = (value) => {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const getPriority = (preferredDate) => {
  if (!preferredDate) return "Low";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const serviceDate = new Date(`${preferredDate}T00:00:00`);
  const differenceInDays = Math.ceil(
    (serviceDate.getTime() - today.getTime()) / 86400000
  );

  if (differenceInDays <= 1) return "High";
  if (differenceInDays <= 3) return "Medium";
  return "Low";
};

const splitReason = (value) => {
  if (!value) {
    return {
      title: "No reason provided",
      note: "No additional details available.",
    };
  }

  const separatorIndex = value.indexOf(":");

  if (separatorIndex === -1) {
    return {
      title: value,
      note: value,
    };
  }

  return {
    title: value.slice(0, separatorIndex).trim(),
    note:
      value.slice(separatorIndex + 1).trim() ||
      value.slice(0, separatorIndex).trim(),
  };
};

const getErrorMessage = (error) => {
  const responseData = error.response?.data;

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData;
  }

  if (responseData?.message) return responseData.message;
  if (responseData?.error) return responseData.error;

  if (!error.response) {
    return "Unable to connect to the backend.";
  }

  return "Unable to load rejected bookings.";
};

const mapBooking = (booking) => {
  const reason = splitReason(booking.rejectionReason);

  return {
    backendId: booking.id,
    id: `BK-${booking.id}`,
    customer: booking.customerName || "—",
    phone: booking.customerPhone || "—",
    initials: initials(booking.customerName),
    property:
      [booking.propertyType, booking.propertySize]
        .filter(Boolean)
        .join(" - ") || "Property",
    propertyType:
      [booking.city, booking.pincode].filter(Boolean).join(" - ") ||
      booking.serviceAddress ||
      "—",
    service: booking.serviceName || "—",
    serviceArea: booking.serviceType || "—",
    date: formatDate(booking.updatedAt || booking.createdAt),
    time: formatTime(booking.updatedAt || booking.createdAt),
    reason: reason.title,
    reasonNote: reason.note,
    priority: getPriority(booking.preferredDate),
    rejectedBy: "Admin",
    rejectedByName: "PCMS Administrator",
    customerEmail: booking.customerEmail || "",
    rawUpdatedAt: booking.updatedAt || booking.createdAt,
  };
};

export default function RejectedBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [serviceFilter, setServiceFilter] = useState("All Services");
  const [reasonFilter, setReasonFilter] = useState("All Reasons");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRejectedBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/bookings/rejected");

      const realBookings = Array.isArray(response.data)
        ? response.data
            .map(mapBooking)
            .sort(
              (first, second) =>
                new Date(second.rawUpdatedAt) -
                new Date(first.rawUpdatedAt)
            )
        : [];

      setBookings(realBookings);
    } catch (requestError) {
      setBookings([]);
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRejectedBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch =
        search === "" ||
        booking.id.toLowerCase().includes(search) ||
        booking.customer.toLowerCase().includes(search) ||
        booking.phone.toLowerCase().includes(search) ||
        booking.property.toLowerCase().includes(search) ||
        booking.propertyType.toLowerCase().includes(search);

      const matchesService =
        serviceFilter === "All Services" ||
        booking.service === serviceFilter;

      const matchesReason =
        reasonFilter === "All Reasons" ||
        booking.reason === reasonFilter;

      return matchesSearch && matchesService && matchesReason;
    });
  }, [bookings, searchValue, serviceFilter, reasonFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / PAGE_SIZE)
  );

  const visibleBookings = filteredBookings.slice(
    (activePage - 1) * PAGE_SIZE,
    activePage * PAGE_SIZE
  );

  useEffect(() => {
    if (activePage > totalPages) {
      setActivePage(totalPages);
    }
  }, [activePage, totalPages]);

  const serviceOptions = [
    ...new Set(bookings.map((booking) => booking.service).filter(Boolean)),
  ];

  const reasonOptions = [
    ...new Set(bookings.map((booking) => booking.reason).filter(Boolean)),
  ];

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(0, 5);

  const clearFilters = () => {
    setSearchValue("");
    setServiceFilter("All Services");
    setReasonFilter("All Reasons");
    setActivePage(1);
  };

  const openRejectedBooking = (bookingId) => {
    sessionStorage.setItem(
      "pcmsRejectedViewId",
      String(bookingId)
    );

    navigate("/admin/bookings/rejected-bookings/view", {
      state: { bookingId },
    });
  };

  const firstVisibleRecord =
    filteredBookings.length === 0
      ? 0
      : (activePage - 1) * PAGE_SIZE + 1;

  const lastVisibleRecord = Math.min(
    activePage * PAGE_SIZE,
    filteredBookings.length
  );

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
            <p className="rjb-subtitle">
              View all rejected service bookings and reasons
            </p>
          </div>
        </div>

        <div className="rjb-header-actions">
          <button
            type="button"
            className="rjb-btn rjb-btn-outline"
            onClick={() => window.print()}
          >
            <Download size={16} strokeWidth={2} />
            Export
          </button>
          <button
            type="button"
            className="rjb-btn rjb-btn-primary"
            onClick={loadRejectedBookings}
            disabled={loading}
          >
            <RefreshCw size={16} strokeWidth={2} />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </header>

      <section className="rjb-filters-card">
        <div className="rjb-search-wrap">
          <Search size={16} className="rjb-search-icon" />
          <input
            type="text"
            className="rjb-search-input"
            placeholder="Search by booking ID, customer, phone or property..."
            value={searchValue}
            onChange={(event) => {
              setSearchValue(event.target.value);
              setActivePage(1);
            }}
          />
        </div>

        <div className="rjb-filter-field">
          <label className="rjb-filter-label">Service Type</label>
          <div className="rjb-select">
            <select
              value={serviceFilter}
              onChange={(event) => {
                setServiceFilter(event.target.value);
                setActivePage(1);
              }}
            >
              <option>All Services</option>
              {serviceOptions.map((service) => (
                <option key={service}>{service}</option>
              ))}
            </select>
            <ChevronDown size={16} className="rjb-select-caret" />
          </div>
        </div>

        <div className="rjb-filter-field">
          <label className="rjb-filter-label">Reason</label>
          <div className="rjb-select">
            <select
              value={reasonFilter}
              onChange={(event) => {
                setReasonFilter(event.target.value);
                setActivePage(1);
              }}
            >
              <option>All Reasons</option>
              {reasonOptions.map((reason) => (
                <option key={reason}>{reason}</option>
              ))}
            </select>
            <ChevronDown size={16} className="rjb-select-caret" />
          </div>
        </div>

        <div className="rjb-filter-field">
          <label className="rjb-filter-label">Date Range</label>
          <button type="button" className="rjb-date-input">
            <Calendar size={16} strokeWidth={2} />
            All Dates
          </button>
        </div>

        <button
          type="button"
          className="rjb-btn rjb-btn-outline rjb-clear-btn"
          onClick={clearFilters}
        >
          <Filter size={16} strokeWidth={2} />
          Clear Filters
        </button>
      </section>

      <section className="rjb-table-card">
        <div className="rjb-table-scroll">
          <table className="rjb-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>
                    <span className="rjb-th-content">
                      {column.label}
                      <ArrowUpDown size={12} strokeWidth={2} />
                    </span>
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleBookings.map((booking) => {
                const ServiceIcon =
                  serviceIcons[booking.service] || Bug;

                return (
                  <tr key={booking.backendId} className="rjb-row">
                    <td>
                      <span className="rjb-booking-id">
                        {booking.id}
                      </span>
                    </td>

                    <td>
                      <div className="rjb-cell-with-avatar">
                        <span className="rjb-avatar">
                          {booking.initials}
                        </span>
                        <div className="rjb-cell-text">
                          <span className="rjb-cell-primary">
                            {booking.customer}
                          </span>
                          <span className="rjb-cell-secondary">
                            {booking.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="rjb-cell-with-icon">
                        <span className="rjb-cell-icon">
                          <Building2 size={16} strokeWidth={2} />
                        </span>
                        <div className="rjb-cell-text">
                          <span className="rjb-cell-primary">
                            {booking.property}
                          </span>
                          <span className="rjb-cell-secondary">
                            {booking.propertyType}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="rjb-cell-with-icon">
                        <span className="rjb-cell-icon">
                          <ServiceIcon size={16} strokeWidth={2} />
                        </span>
                        <div className="rjb-cell-text">
                          <span className="rjb-cell-primary">
                            {booking.service}
                          </span>
                          <span className="rjb-cell-secondary">
                            {booking.serviceArea}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="rjb-cell-with-icon">
                        <span className="rjb-cell-icon">
                          <Calendar size={16} strokeWidth={2} />
                        </span>
                        <div className="rjb-cell-text">
                          <span className="rjb-cell-primary">
                            {booking.date}
                          </span>
                          <span className="rjb-cell-secondary">
                            <Clock
                              size={12}
                              strokeWidth={2}
                              className="rjb-inline-icon"
                            />
                            {booking.time}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="rjb-reason-cell">
                        <button
                          type="button"
                          className="rjb-reason-select"
                        >
                          {booking.reason}
                          <ChevronDown size={14} strokeWidth={2} />
                        </button>
                        <span className="rjb-reason-note">
                          {booking.reasonNote}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`rjb-badge ${
                          priorityClass[booking.priority]
                        }`}
                      >
                        {booking.priority}
                      </span>
                    </td>

                    <td>
                      <div className="rjb-cell-text">
                        <span className="rjb-cell-primary">
                          {booking.rejectedBy}
                        </span>
                        <span className="rjb-cell-secondary">
                          {booking.rejectedByName}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="rjb-actions-cell">
                        <button
                          type="button"
                          className="rjb-btn rjb-btn-outline rjb-btn-sm"
                          onClick={() =>
                            openRejectedBooking(booking.backendId)
                          }
                        >
                          <Eye size={14} strokeWidth={2} />
                          View
                        </button>

                        <button
                          type="button"
                          className="rjb-icon-btn"
                          aria-label="More actions"
                        >
                          <MoreVertical size={16} strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!loading && visibleBookings.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    style={{ textAlign: "center", padding: "32px" }}
                  >
                    {error || "No rejected bookings found."}
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td
                    colSpan={9}
                    style={{ textAlign: "center", padding: "32px" }}
                  >
                    Loading rejected bookings...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="rjb-table-footer">
          <span className="rjb-showing-text">
            Showing {firstVisibleRecord} to {lastVisibleRecord} of{" "}
            {filteredBookings.length} bookings
          </span>

          <div className="rjb-pagination">
            <button
              type="button"
              className="rjb-page-btn rjb-page-nav"
              disabled={activePage === 1}
              onClick={() =>
                setActivePage((page) => Math.max(1, page - 1))
              }
            >
              <ChevronLeft size={14} strokeWidth={2} />
              Previous
            </button>

            {pages.map((page) => (
              <button
                key={page}
                type="button"
                className={`rjb-page-btn ${
                  activePage === page
                    ? "rjb-page-btn-active"
                    : ""
                }`}
                onClick={() => setActivePage(page)}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className="rjb-page-btn rjb-page-nav"
              disabled={activePage === totalPages}
              onClick={() =>
                setActivePage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
            >
              Next
              <ChevronRight size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}