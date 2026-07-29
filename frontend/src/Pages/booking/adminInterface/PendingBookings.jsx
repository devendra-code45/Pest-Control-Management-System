import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Clock,
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
  Phone,
  Mail,
  MapPin,
  User,
  Bug,
  ShieldCheck,
} from "lucide-react";
import api from "../../../api/axios";
import "./PendingBookings.css";

const PAGE_SIZE = 5;

const PEST_ICONS = {
  Cockroach: Bug,
  Termite: Bug,
  Rodent: Bug,
  Mosquito: Bug,
  Ant: Bug,
};

const formatDate = (value) => {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
};

const formatDateTime = (value) => {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
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

const getErrorMessage = (error) => {
  const responseData = error.response?.data;

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData;
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData?.error) {
    return responseData.error;
  }

  if (!error.response) {
    return "Unable to connect to the backend.";
  }

  return "Unable to load pending bookings.";
};

const mapBooking = (booking) => ({
  backendId: booking.id,
  id: `BK-${booking.id}`,
  requestedOn: formatDateTime(booking.createdAt),
  customer: booking.customerName || "—",
  phone: booking.customerPhone || "—",
  email: booking.customerEmail || "—",
  property:
    [booking.propertyType, booking.propertySize].filter(Boolean).join(" - ") ||
    "Property",
  location:
    [
      booking.serviceAddress,
      booking.landmark,
      booking.city,
      booking.pincode,
    ]
      .filter(Boolean)
      .join(", ") || "—",
  pest: booking.pestType || "Other",
  service:
    [booking.serviceName, booking.serviceType].filter(Boolean).join(" - ") || "—",
  date: formatDate(booking.preferredDate),
  time: booking.preferredTimeSlot || "—",
  priority: getPriority(booking.preferredDate),
  assignedTo: booking.technicianName || null,
  remarks: booking.problemDescription || "—",
});

const PendingBooking = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [pestFilter, setPestFilter] = useState("All Pest Type");
  const [serviceFilter, setServiceFilter] = useState("All Service");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");

  const loadPendingBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/bookings/pending");
      const responseBookings = Array.isArray(response.data)
        ? response.data
        : [];

      setBookings(responseBookings.map(mapBooking));
      setSelectedRows([]);
    } catch (requestError) {
      setBookings([]);
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch =
        search === "" ||
        booking.id.toLowerCase().includes(search) ||
        booking.customer.toLowerCase().includes(search) ||
        booking.phone.toLowerCase().includes(search) ||
        booking.email.toLowerCase().includes(search) ||
        booking.pest.toLowerCase().includes(search);

      const matchesStatus = statusFilter === "Pending";

      const matchesPriority =
        priorityFilter === "All Priority" ||
        booking.priority === priorityFilter;

      const matchesPest =
        pestFilter === "All Pest Type" || booking.pest === pestFilter;

      const matchesService =
        serviceFilter === "All Service" ||
        booking.service.toLowerCase().includes(serviceFilter.toLowerCase());

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesPest &&
        matchesService
      );
    });
  }, [
    bookings,
    searchValue,
    statusFilter,
    priorityFilter,
    pestFilter,
    serviceFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / PAGE_SIZE)
  );

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const allSelected =
    paginatedBookings.length > 0 &&
    paginatedBookings.every((booking) =>
      selectedRows.includes(booking.backendId)
    );

  const toggleSelectAll = () => {
    const pageIds = paginatedBookings.map((booking) => booking.backendId);

    if (allSelected) {
      setSelectedRows((previousRows) =>
        previousRows.filter((id) => !pageIds.includes(id))
      );
      return;
    }

    setSelectedRows((previousRows) => [
      ...new Set([...previousRows, ...pageIds]),
    ]);
  };

  const toggleSelectRow = (id) => {
    setSelectedRows((previousRows) =>
      previousRows.includes(id)
        ? previousRows.filter((rowId) => rowId !== id)
        : [...previousRows, id]
    );
  };

  const clearFilters = () => {
    setSearchValue("");
    setStatusFilter("Pending");
    setPriorityFilter("All Priority");
    setPestFilter("All Pest Type");
    setServiceFilter("All Service");
    setCurrentPage(1);
  };

  const handleAccept = async (bookingId) => {
    try {
      setActionId(bookingId);
      setError("");

      await api.put(`/admin/bookings/${bookingId}/accept`);

      sessionStorage.setItem(
        "pcmsAssignBookingId",
        String(bookingId)
      );

      navigate("/admin/bookings/assign-technician", {
        state: { bookingId },
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setActionId(null);
    }
  };

  const handleReject = (bookingId) => {
    sessionStorage.setItem(
      "pcmsRejectBookingId",
      String(bookingId)
    );

    navigate("/admin/bookings/rejection-reason", {
      state: { bookingId },
    });
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = Array.from(
    { length: Math.min(totalPages, 3) },
    (_, index) => index + 1
  );

  const pestOptions = [
    ...new Set(bookings.map((booking) => booking.pest).filter(Boolean)),
  ];

  const serviceOptions = [
    ...new Set(
      bookings
        .map((booking) => booking.service.split(" - ")[0])
        .filter(Boolean)
    ),
  ];

  const firstVisibleRecord =
    filteredBookings.length === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const lastVisibleRecord = Math.min(
    currentPage * PAGE_SIZE,
    filteredBookings.length
  );

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
          <button
            type="button"
            className="pb-btn pb-btn-outline"
            onClick={() => window.print()}
          >
            <Upload size={16} />
            Export
          </button>
          <button
            type="button"
            className="pb-btn pb-btn-primary"
            onClick={loadPendingBookings}
            disabled={loading}
          >
            <RefreshCw size={16} />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="pb-filters-card">
        <div className="pb-search-box">
          <Search size={18} className="pb-search-icon" />
          <input
            type="text"
            placeholder="Search booking ID, customer, pest type..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setCurrentPage(1);
            }}
            className="pb-search-input"
          />
        </div>

        <div className="pb-filter-group">
          <label className="pb-filter-label">Status</label>
          <div className="pb-select-wrapper">
            <select
              className="pb-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
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
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
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
              onChange={(e) => {
                setPestFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option>All Pest Type</option>
              {pestOptions.map((pest) => (
                <option key={pest}>{pest}</option>
              ))}
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
              onChange={(e) => {
                setServiceFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option>All Service</option>
              {serviceOptions.map((service) => (
                <option key={service}>{service}</option>
              ))}
            </select>
            <ChevronDown size={16} className="pb-select-icon" />
          </div>
        </div>

        <div className="pb-filter-group">
          <label className="pb-filter-label">Date Range</label>
          <div className="pb-date-input">
            <Calendar size={16} className="pb-date-icon" />
            <span>All Dates</span>
          </div>
        </div>

        <button
          type="button"
          className="pb-btn pb-btn-ghost pb-clear-btn"
          onClick={clearFilters}
        >
          <RefreshCw size={15} />
          Clear Filters
        </button>
      </div>

      {/* Table Section */}
      <div className="pb-table-card">
        <div className="pb-table-header">
          <div className="pb-table-title-group">
            <h2 className="pb-table-title">Pending Bookings</h2>
            <span className="pb-records-badge">
              {bookings.length} Records
            </span>
          </div>
          <div className="pb-table-actions">
            <button
              type="button"
              className="pb-btn pb-btn-outline pb-btn-sm"
            >
              <Filter size={15} />
              Filter
            </button>
            <button
              type="button"
              className="pb-btn pb-btn-outline pb-btn-sm"
            >
              <Columns size={15} />
              Columns
            </button>
            <button
              type="button"
              className="pb-btn pb-btn-icon-only"
            >
              <Menu size={16} />
            </button>
          </div>
        </div>

        {error && (
          <div
            className="pb-empty-state"
            style={{ padding: "16px" }}
          >
            <p>{error}</p>
          </div>
        )}

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
                  Booking ID{" "}
                  <ChevronUp
                    size={12}
                    className="pb-sort-icon"
                  />
                </th>
                <th>
                  Customer Details{" "}
                  <ChevronUp
                    size={12}
                    className="pb-sort-icon"
                  />
                </th>
                <th>
                  Property Details{" "}
                  <ChevronUp
                    size={12}
                    className="pb-sort-icon"
                  />
                </th>
                <th>
                  Pest Type{" "}
                  <ChevronUp
                    size={12}
                    className="pb-sort-icon"
                  />
                </th>
                <th>
                  Service Type{" "}
                  <ChevronUp
                    size={12}
                    className="pb-sort-icon"
                  />
                </th>
                <th>
                  Schedule{" "}
                  <ChevronUp
                    size={12}
                    className="pb-sort-icon"
                  />
                </th>
                <th>
                  Priority{" "}
                  <ChevronUp
                    size={12}
                    className="pb-sort-icon"
                  />
                </th>
                <th>
                  Assigned To{" "}
                  <ChevronUp
                    size={12}
                    className="pb-sort-icon"
                  />
                </th>
                <th>Remarks</th>
                <th className="pb-th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((booking) => {
                const PestIcon =
                  PEST_ICONS[booking.pest] || Bug;

                return (
                  <tr key={booking.backendId}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(
                          booking.backendId
                        )}
                        onChange={() =>
                          toggleSelectRow(booking.backendId)
                        }
                        className="pb-checkbox"
                      />
                    </td>
                    <td>
                      <span className="pb-booking-id">
                        {booking.id}
                      </span>
                      <span className="pb-requested-on">
                        Requested on {booking.requestedOn}
                      </span>
                    </td>
                    <td>
                      <span className="pb-customer-name">
                        {booking.customer}
                      </span>
                      <span className="pb-customer-sub">
                        <Phone size={12} /> {booking.phone}
                      </span>
                      <span className="pb-customer-sub">
                        <Mail size={12} /> {booking.email}
                      </span>
                    </td>
                    <td>
                      <span className="pb-property-name">
                        {booking.property}
                      </span>
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
                      <span className="pb-remarks-cell">
                        {booking.remarks}
                      </span>
                    </td>
                    <td>
                      <div className="pb-action-cell">
                        <button
                          type="button"
                          className="pb-btn pb-btn-success pb-btn-xs"
                          onClick={() =>
                            handleAccept(booking.backendId)
                          }
                          disabled={
                            actionId === booking.backendId
                          }
                        >
                          <Check size={14} />
                          {actionId === booking.backendId
                            ? "Accepting..."
                            : "Accept"}
                        </button>
                        <button
                          type="button"
                          className="pb-btn pb-btn-danger-outline pb-btn-xs"
                          onClick={() =>
                            handleReject(booking.backendId)
                          }
                          disabled={
                            actionId === booking.backendId
                          }
                        >
                          <X size={14} />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!loading && paginatedBookings.length === 0 && (
                <tr>
                  <td colSpan={11}>
                    <div className="pb-empty-state">
                      <ClipboardList size={40} />
                      <h3>No pending bookings found</h3>
                      <p>
                        Try adjusting your search or filters to
                        find what you&apos;re looking for.
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={11}>
                    <div className="pb-empty-state">
                      <RefreshCw size={40} />
                      <h3>Loading pending bookings...</h3>
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
            Showing {firstVisibleRecord} to{" "}
            {lastVisibleRecord} of{" "}
            {filteredBookings.length} entries
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
                className={`pb-page-btn ${
                  currentPage === page
                    ? "pb-page-btn--active"
                    : ""
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}

            {totalPages > 3 && (
              <>
                <span className="pb-page-ellipsis">...</span>
                <button
                  type="button"
                  className={`pb-page-btn ${
                    currentPage === totalPages
                      ? "pb-page-btn--active"
                      : ""
                  }`}
                  onClick={() => goToPage(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              type="button"
              className="pb-page-btn"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
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