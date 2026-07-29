import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Download,
  RefreshCw,
  CheckCircle2,
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
  Phone,
  ChevronLeft,
  MoreHorizontal,
  UserPlus,
  XCircle,
  Play,
} from "lucide-react";
import api from "../../../api/axios";
import "./accepted-bookings.css";

const PAGE_SIZE = 6;

const serviceIcons = {
  "Termite Control": Bug,
  "Cockroach Control": Bug,
  "Rodent Control": Bug,
  "General Pest Control": Shield,
  "Mosquito Control": Bug,
  "Bed Bug Treatment": HomeIcon,
};

const priorityClass = {
  High: "ab-badge-danger",
  Medium: "ab-badge-warning",
  Low: "ab-badge-neutral",
};

const statusClass = {
  Accepted: "ab-badge-info",
  Assigned: "ab-badge-success",
  "In Progress": "ab-badge-warning",
  Completed: "ab-badge-success",
};

const statusLabels = {
  ACCEPTED: "Accepted",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const formatDate = (value) => {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
};

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "NA";

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

  if (responseData?.message) return responseData.message;
  if (responseData?.error) return responseData.error;

  if (!error.response) {
    return "Unable to connect to the backend.";
  }

  return "Unable to load accepted bookings.";
};

const mapBooking = (booking) => ({
  backendId: booking.id,
  id: `BK-${booking.id}`,
  customer: booking.customerName || "—",
  phone: booking.customerPhone || "—",
  initials: initials(booking.customerName),
  property: booking.propertyType || "Property",
  propertyType:
    [booking.propertySize, booking.city].filter(Boolean).join(", ") ||
    booking.serviceAddress ||
    "—",
  service: booking.serviceName || "—",
  serviceArea: booking.serviceType || "—",
  date: formatDate(booking.preferredDate),
  time: booking.preferredTimeSlot || "—",
  priority: getPriority(booking.preferredDate),
  amount: Number(booking.totalAmount || 0).toLocaleString("en-IN"),
  status: statusLabels[booking.status] || booking.status || "Accepted",
  technician: {
    name: booking.technicianName || "Not Assigned",
    id: booking.technicianId ? `TECH-${booking.technicianId}` : "—",
    initials: initials(booking.technicianName || "Not Assigned"),
    phone: booking.technicianPhone || "",
  },
});

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

export default function AcceptedBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [serviceFilter, setServiceFilter] = useState("All Services");
  const [technicianFilter, setTechnicianFilter] = useState("All Technicians");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const responses = await Promise.all([
        api.get("/admin/bookings/accepted"),
        api.get("/admin/bookings/assigned"),
        api.get("/admin/bookings/in-progress"),
        api.get("/admin/bookings/completed"),
      ]);

      const realBookings = responses
        .flatMap((response) =>
          Array.isArray(response.data) ? response.data : []
        )
        .sort(
          (first, second) =>
            new Date(second.updatedAt || second.createdAt) -
            new Date(first.updatedAt || first.createdAt)
        )
        .map(mapBooking);

      setBookings(realBookings);
    } catch (requestError) {
      setBookings([]);
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
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

      const matchesTechnician =
        technicianFilter === "All Technicians" ||
        booking.technician.name === technicianFilter;

      const matchesPriority =
        priorityFilter === "All Priorities" ||
        booking.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesService &&
        matchesTechnician &&
        matchesPriority
      );
    });
  }, [
    bookings,
    searchValue,
    serviceFilter,
    technicianFilter,
    priorityFilter,
  ]);

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

  const technicianOptions = [
    ...new Set(
      bookings
        .map((booking) => booking.technician.name)
        .filter((name) => name && name !== "Not Assigned")
    ),
  ];

  const pages = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, index) => index + 1
  );

  const firstVisibleRecord =
    filteredBookings.length === 0
      ? 0
      : (activePage - 1) * PAGE_SIZE + 1;

  const lastVisibleRecord = Math.min(
    activePage * PAGE_SIZE,
    filteredBookings.length
  );

  const clearFilters = () => {
    setSearchValue("");
    setServiceFilter("All Services");
    setTechnicianFilter("All Technicians");
    setPriorityFilter("All Priorities");
    setActivePage(1);
  };

  const openBookingDetails = (bookingId) => {
    sessionStorage.setItem(
      "pcmsSelectedBookingId",
      String(bookingId)
    );

    navigate("/admin/bookings/assigned-bookings-view", {
      state: { bookingId },
    });
  };

  const openAssignTechnician = (bookingId) => {
    sessionStorage.setItem(
      "pcmsAssignBookingId",
      String(bookingId)
    );

    navigate("/admin/bookings/assign-technician", {
      state: { bookingId },
    });
  };

  const openRejectAcceptedBooking = (bookingId) => {
    sessionStorage.setItem(
      "pcmsRejectBookingId",
      String(bookingId)
    );

    navigate("/admin/bookings/rejection-reason", {
      state: { bookingId },
    });
  };

  const startService = async (bookingId) => {
    try {
      await api.put(`/admin/bookings/${bookingId}/start`);
      await loadBookings();
    } catch (requestError) {
      window.alert(
        getErrorMessage(requestError) ||
          "Unable to start the service."
      );
    }
  };

  const completeService = async (bookingId) => {
    try {
      await api.put(`/admin/bookings/${bookingId}/complete`);
      await loadBookings();
    } catch (requestError) {
      window.alert(
        getErrorMessage(requestError) ||
          "Unable to complete the service."
      );
    }
  };

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
          <button
            type="button"
            className="ab-btn ab-btn-outline"
            onClick={() => window.print()}
          >
            <Download size={16} strokeWidth={2} />
            Export
          </button>
          <button
            type="button"
            className="ab-btn ab-btn-primary"
            onClick={loadBookings}
            disabled={loading}
          >
            <RefreshCw size={16} strokeWidth={2} />
            {loading ? "Loading..." : "Refresh"}
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
            value={searchValue}
            onChange={(event) => {
              setSearchValue(event.target.value);
              setActivePage(1);
            }}
          />
        </div>

        <div className="ab-filter-field">
          <label className="ab-filter-label">Service Type</label>
          <div className="ab-select">
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
            <ChevronDown size={16} className="ab-select-caret" />
          </div>
        </div>

        <div className="ab-filter-field">
          <label className="ab-filter-label">Technician</label>
          <div className="ab-select">
            <select
              value={technicianFilter}
              onChange={(event) => {
                setTechnicianFilter(event.target.value);
                setActivePage(1);
              }}
            >
              <option>All Technicians</option>
              {technicianOptions.map((technician) => (
                <option key={technician}>{technician}</option>
              ))}
            </select>
            <ChevronDown size={16} className="ab-select-caret" />
          </div>
        </div>

        <div className="ab-filter-field">
          <label className="ab-filter-label">Priority</label>
          <div className="ab-select">
            <select
              value={priorityFilter}
              onChange={(event) => {
                setPriorityFilter(event.target.value);
                setActivePage(1);
              }}
            >
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
            All Dates
          </button>
        </div>

        <button
          type="button"
          className="ab-btn ab-btn-outline ab-clear-btn"
          onClick={clearFilters}
        >
          <Filter size={16} strokeWidth={2} />
          Clear Filters
        </button>
      </section>

      <section className="ab-table-card">
        <div className="ab-table-scroll">
          <table className="ab-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>
                    <span className="ab-th-content">
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
                  <tr key={booking.backendId}>
                    <td>
                      <span className="ab-booking-id">{booking.id}</span>
                    </td>

                    <td>
                      <div className="ab-cell-with-avatar">
                        <span className="ab-avatar">{booking.initials}</span>
                        <div className="ab-cell-text">
                          <span className="ab-cell-primary">
                            {booking.customer}
                          </span>
                          <span className="ab-cell-secondary">
                            {booking.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="ab-cell-with-icon">
                        <span className="ab-cell-icon">
                          <Building2 size={16} strokeWidth={2} />
                        </span>
                        <div className="ab-cell-text">
                          <span className="ab-cell-primary">
                            {booking.property}
                          </span>
                          <span className="ab-cell-secondary">
                            {booking.propertyType}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="ab-cell-with-icon">
                        <span className="ab-cell-icon">
                          <ServiceIcon size={16} strokeWidth={2} />
                        </span>
                        <div className="ab-cell-text">
                          <span className="ab-cell-primary">
                            {booking.service}
                          </span>
                          <span className="ab-cell-secondary">
                            {booking.serviceArea}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="ab-cell-with-icon">
                        <span className="ab-cell-icon">
                          <Calendar size={16} strokeWidth={2} />
                        </span>
                        <div className="ab-cell-text">
                          <span className="ab-cell-primary">
                            {booking.date}
                          </span>
                          <span className="ab-cell-secondary">
                            <Clock
                              size={12}
                              strokeWidth={2}
                              className="ab-inline-icon"
                            />
                            {booking.time}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`ab-badge ${
                          priorityClass[booking.priority]
                        }`}
                      >
                        {booking.priority}
                      </span>
                    </td>

                    <td>
                      <div className="ab-technician-cell">
                        <span className="ab-tech-avatar">
                          {booking.technician.initials}
                        </span>
                        <div className="ab-cell-text">
                          <span className="ab-cell-primary">
                            {booking.technician.name}
                          </span>
                          <span className="ab-cell-secondary">
                            {booking.technician.id}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="ab-tech-call-btn"
                          aria-label={`Call ${booking.technician.name}`}
                          disabled={!booking.technician.phone}
                          onClick={() => {
                            if (booking.technician.phone) {
                              window.location.href = `tel:${booking.technician.phone}`;
                            }
                          }}
                        >
                          <Phone size={13} strokeWidth={2} />
                        </button>
                      </div>
                    </td>

                    <td>
                      <span className="ab-amount">
                        ₹ {booking.amount}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`ab-badge ${
                          statusClass[booking.status] ||
                          "ab-badge-info"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td>
                      <div className="ab-actions-cell">
                        {booking.status === "Accepted" &&
                          booking.technician.name === "Not Assigned" && (
                            <>
                              <button
                                type="button"
                                className="ab-btn ab-btn-primary ab-btn-sm"
                                onClick={() =>
                                  openAssignTechnician(booking.backendId)
                                }
                              >
                                <UserPlus size={14} strokeWidth={2} />
                                Assign
                              </button>

                              <button
                                type="button"
                                className="ab-btn ab-btn-outline ab-btn-sm"
                                style={{
                                  borderColor: "#dc2626",
                                  color: "#dc2626",
                                }}
                                onClick={() =>
                                  openRejectAcceptedBooking(
                                    booking.backendId
                                  )
                                }
                              >
                                <XCircle size={14} strokeWidth={2} />
                                Reject
                              </button>
                            </>
                          )}

                        {booking.status === "Assigned" && (
                          <button
                            type="button"
                            className="ab-btn ab-btn-primary ab-btn-sm"
                            onClick={() =>
                              startService(booking.backendId)
                            }
                          >
                            <Play size={14} strokeWidth={2} />
                            Start Service
                          </button>
                        )}

                        {booking.status === "In Progress" && (
                          <button
                            type="button"
                            className="ab-btn ab-btn-primary ab-btn-sm"
                            style={{
                              backgroundColor: "#16a34a",
                              borderColor: "#16a34a",
                              color: "#ffffff",
                            }}
                            onClick={() =>
                              completeService(booking.backendId)
                            }
                          >
                            <CheckCircle2 size={14} strokeWidth={2} />
                            Complete
                          </button>
                        )}

                        <button
                          type="button"
                          className="ab-btn ab-btn-outline ab-btn-sm"
                          onClick={() =>
                            openBookingDetails(booking.backendId)
                          }
                        >
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

              {!loading && visibleBookings.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    style={{ textAlign: "center", padding: "32px" }}
                  >
                    {error || "No accepted bookings found."}
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td
                    colSpan={10}
                    style={{ textAlign: "center", padding: "32px" }}
                  >
                    Loading accepted bookings...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="ab-table-footer">
          <span className="ab-showing-text">
            Showing {firstVisibleRecord} to {lastVisibleRecord} of{" "}
            {filteredBookings.length} bookings
          </span>

          <div className="ab-pagination">
            <button
              type="button"
              className="ab-page-btn ab-page-nav"
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
                className={`ab-page-btn ${
                  activePage === page
                    ? "ab-page-btn-active"
                    : ""
                }`}
                onClick={() => setActivePage(page)}
              >
                {page}
              </button>
            ))}

            {totalPages > 5 && (
              <span className="ab-page-ellipsis">
                <MoreHorizontal size={14} strokeWidth={2} />
              </span>
            )}

            <button
              type="button"
              className="ab-page-btn ab-page-nav"
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