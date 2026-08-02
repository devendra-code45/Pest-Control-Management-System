import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  MessageSquare,
  Download,
  Search,
  Calendar,
  RotateCcw,
  Eye,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
} from "lucide-react";

import api from "../../api/axios";
import "./AdminComplaint.css";

const STATUS_OPTIONS = [
  "All Status",
  "Pending",
  "In Progress",
  "Resolved",
  "Closed",
  "Rejected",
];

const AVATAR_TONES = [
  "av-green",
  "av-purple",
  "av-blue",
  "av-orange",
  "av-pink",
];

const normalizeComplaint = (data = {}) => {
  const customerObject =
    data.customer &&
    typeof data.customer === "object"
      ? data.customer
      : {};

  const bookingObject =
    data.booking &&
    typeof data.booking === "object"
      ? data.booking
      : {};

  const customerName =
    data.customerName ||
    data.fullName ||
    data.name ||
    customerObject.fullName ||
    customerObject.name ||
    [
      customerObject.firstName,
      customerObject.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    (typeof data.customer === "string"
      ? data.customer
      : "");

  const customerEmail =
    data.customerEmail ||
    data.email ||
    customerObject.email ||
    "";

  const customerPhone =
    data.customerPhone ||
    data.phone ||
    data.phoneNumber ||
    customerObject.phone ||
    customerObject.phoneNumber ||
    "";

  const bookingId =
    data.bookingId ||
    data.bookingReference ||
    data.bookingNumber ||
    bookingObject.bookingId ||
    bookingObject.bookingNumber ||
    (typeof data.booking === "string"
      ? data.booking
      : "");

  return {
    ...data,

    id:
      data.id ||
      data.complaintNumber ||
      data.complaintId ||
      "",

    customerName,
    customerEmail,
    customerPhone,
    bookingId,

    createdAt:
      data.createdAt ||
      data.submittedOn ||
      data.submittedAt ||
      data.dateSubmitted ||
      null,

    updatedAt:
      data.updatedAt ||
      data.lastUpdated ||
      data.updatedOn ||
      null,
  };
};

function initials(name = "") {
  const result = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return result || "CU";
}

function avatarTone(name = "") {
  const sum = name
    .split("")
    .reduce(
      (total, character) =>
        total + character.charCodeAt(0),
      0
    );

  return AVATAR_TONES[
    sum % AVATAR_TONES.length
  ];
}

function formatDateTime(value) {
  if (!value) {
    return {
      date: "—",
      time: "",
    };
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      date: "—",
      time: "",
    };
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
}

function StatusBadge({ status }) {
  const toneMap = {
    Pending: "ac-badge--warning",
    "In Progress": "ac-badge--warning",
    Resolved: "ac-badge--success",
    Closed: "ac-badge--danger",
    Rejected: "ac-badge--danger",
  };

  return (
    <span
      className={`ac-badge ${
        toneMap[status] ||
        "ac-badge--neutral"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

export default function AdminComplaint() {
  const navigate = useNavigate();

  const [complaints, setComplaints] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All Status");

  const [category, setCategory] =
    useState("All Categories");

  const [dateFrom, setDateFrom] =
    useState("");

  const [dateTo, setDateTo] =
    useState("");

  const [
    showDatePanel,
    setShowDatePanel,
  ] = useState(false);

  const [page, setPage] =
    useState(1);

  const [rowsPerPage, setRowsPerPage] =
    useState(5);

  const [loading, setLoading] =
    useState(true);

  const [pageError, setPageError] =
    useState("");

  const dateBtnRef = useRef(null);

  useEffect(() => {
    const loadComplaints = async () => {
      setLoading(true);
      setPageError("");

      try {
        const response = await api.get(
          "/admin/complaints"
        );

        const complaintData =
          Array.isArray(response.data)
            ? response.data.map(
                normalizeComplaint
              )
            : [];

        setComplaints(complaintData);
      } catch (error) {
        console.error(
          "Load complaints error:",
          error?.response?.data || error
        );

        setPageError(
          error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Unable to load complaints."
        );
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, []);

  const categories = useMemo(
    () => [
      "All Categories",

      ...Array.from(
        new Set(
          complaints
            .map(
              (complaint) =>
                complaint.category
            )
            .filter(Boolean)
        )
      ),
    ],
    [complaints]
  );

  const filtered = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return complaints.filter(
      (complaint) => {
        const matchesSearch =
          !query ||
          complaint.id
            ?.toLowerCase()
            .includes(query) ||
          complaint.subject
            ?.toLowerCase()
            .includes(query) ||
          complaint.customerName
            ?.toLowerCase()
            .includes(query) ||
          complaint.customerEmail
            ?.toLowerCase()
            .includes(query) ||
          complaint.bookingId
            ?.toLowerCase()
            .includes(query);

        const matchesStatus =
          status === "All Status" ||
          complaint.status === status;

        const matchesCategory =
          category ===
            "All Categories" ||
          complaint.category ===
            category;

        const submitted =
          complaint.createdAt
            ? new Date(
                complaint.createdAt
              )
            : null;

        let matchesDate = true;

        if (
          submitted &&
          !Number.isNaN(
            submitted.getTime()
          )
        ) {
          if (dateFrom) {
            matchesDate =
              matchesDate &&
              submitted >=
                new Date(dateFrom);
          }

          if (dateTo) {
            matchesDate =
              matchesDate &&
              submitted <=
                new Date(
                  `${dateTo}T23:59:59`
                );
          }
        } else if (
          dateFrom ||
          dateTo
        ) {
          matchesDate = false;
        }

        return (
          matchesSearch &&
          matchesStatus &&
          matchesCategory &&
          matchesDate
        );
      }
    );
  }, [
    complaints,
    search,
    status,
    category,
    dateFrom,
    dateTo,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filtered.length / rowsPerPage
    )
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const pageStart =
    (currentPage - 1) * rowsPerPage;

  const paged = filtered.slice(
    pageStart,
    pageStart + rowsPerPage
  );

  const hasActiveFilters =
    search ||
    status !== "All Status" ||
    category !== "All Categories" ||
    dateFrom ||
    dateTo;

  const resetFilters = () => {
    setSearch("");
    setStatus("All Status");
    setCategory("All Categories");
    setDateFrom("");
    setDateTo("");
    setShowDatePanel(false);
    setPage(1);
  };

  const goToPage = (value) => {
    setPage(
      Math.min(
        Math.max(1, value),
        totalPages
      )
    );
  };

  const handleExport = () => {
    const headers = [
      "Complaint ID",
      "Customer",
      "Email",
      "Phone",
      "Booking ID",
      "Subject",
      "Category",
      "Submitted On",
      "Status",
    ];

    const rows = filtered.map(
      (complaint) => [
        complaint.id,
        complaint.customerName,
        complaint.customerEmail,
        complaint.customerPhone,
        complaint.bookingId || "",
        complaint.subject,
        complaint.category,
        complaint.createdAt,
        complaint.status,
      ]
    );

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map(
            (cell) =>
              `"${String(
                cell ?? ""
              ).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `complaints-report-${
        new Date()
          .toISOString()
          .split("T")[0]
      }.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const dateRangeLabel =
    dateFrom || dateTo
      ? `${dateFrom || "…"} - ${
          dateTo || "…"
        }`
      : "Select Date Range";

  return (
    <div className="ac-page">
      <div className="ac-breadcrumb">
        <span
          onClick={() =>
            navigate(
              "/admin/dashboard"
            )
          }
        >
          Dashboard
        </span>

        <span className="ac-breadcrumb__sep">
          &gt;
        </span>

        <span className="ac-breadcrumb__current">
          Complaints
        </span>
      </div>

      <div className="ac-card ac-header-card">
        <div className="ac-header">
          <span className="ac-header-icon">
            <MessageSquare size={22} />
          </span>

          <div>
            <h1 className="ac-title">
              Complaints
            </h1>

            <p className="ac-subtitle">
              View and manage all customer
              complaints
            </p>
          </div>
        </div>

        <button
          className="ac-btn ac-btn--primary"
          onClick={handleExport}
        >
          <Download size={16} />
          Export Report
        </button>
      </div>

      {pageError && (
        <div className="ac-card ac-table__empty">
          <AlertCircle size={16} />
          {pageError}
        </div>
      )}

      <div className="ac-card ac-filters-card">
        <div className="ac-filters">
          <div className="ac-search">
            <Search
              size={16}
              className="ac-search__icon"
            />

            <input
              type="text"
              placeholder="Search by Complaint ID, Subject, Customer or Booking ID"
              value={search}
              onChange={(event) => {
                setSearch(
                  event.target.value
                );

                setPage(1);
              }}
            />
          </div>

          <div className="ac-select">
            <select
              value={status}
              onChange={(event) => {
                setStatus(
                  event.target.value
                );

                setPage(1);
              }}
            >
              {STATUS_OPTIONS.map(
                (option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                )
              )}
            </select>

            <ChevronDown
              size={15}
              className="ac-select__chevron"
            />
          </div>

          <div className="ac-select">
            <select
              value={category}
              onChange={(event) => {
                setCategory(
                  event.target.value
                );

                setPage(1);
              }}
            >
              {categories.map(
                (option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                )
              )}
            </select>

            <ChevronDown
              size={15}
              className="ac-select__chevron"
            />
          </div>

          <div className="ac-daterange">
            <button
              ref={dateBtnRef}
              type="button"
              className={`ac-daterange__trigger ${
                dateFrom || dateTo
                  ? "ac-daterange__trigger--filled"
                  : ""
              }`}
              onClick={() =>
                setShowDatePanel(
                  (current) =>
                    !current
                )
              }
            >
              <Calendar size={15} />

              <span>
                {dateRangeLabel}
              </span>
            </button>

            {showDatePanel && (
              <div className="ac-daterange__panel">
                <div className="ac-daterange__field">
                  <label>From</label>

                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(event) =>
                      setDateFrom(
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="ac-daterange__field">
                  <label>To</label>

                  <input
                    type="date"
                    value={dateTo}
                    onChange={(event) =>
                      setDateTo(
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="ac-daterange__actions">
                  <button
                    type="button"
                    className="ac-btn ac-btn--outline ac-btn--sm"
                    onClick={() => {
                      setDateFrom("");
                      setDateTo("");
                    }}
                  >
                    Clear
                  </button>

                  <button
                    type="button"
                    className="ac-btn ac-btn--primary ac-btn--sm"
                    onClick={() => {
                      setPage(1);
                      setShowDatePanel(
                        false
                      );
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            className="ac-btn ac-btn--outline"
            onClick={resetFilters}
            disabled={
              !hasActiveFilters
            }
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>

        <div className="ac-table-wrap">
          <table className="ac-table">
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Customer</th>
                <th>Booking ID</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Submitted On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="ac-table__empty"
                  >
                    Loading complaints...
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="ac-table__empty"
                  >
                    No complaints match
                    your filters.
                  </td>
                </tr>
              ) : (
                paged.map(
                  (complaint) => {
                    const submitted =
                      formatDateTime(
                        complaint.createdAt
                      );

                    return (
                      <tr
                        key={
                          complaint.id
                        }
                      >
                        <td className="ac-table__id">
                          {complaint.id}
                        </td>

                        <td>
                          <div className="ac-customer">
                            <span
                              className={`ac-avatar ${avatarTone(
                                complaint.customerName
                              )}`}
                            >
                              {initials(
                                complaint.customerName
                              )}
                            </span>

                            <div>
                              <p className="ac-customer__name">
                                {complaint.customerName ||
                                  "—"}
                              </p>

                              <p className="ac-customer__email">
                                {complaint.customerEmail ||
                                  "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td>
                          {complaint.bookingId ||
                            "Not linked"}
                        </td>

                        <td>
                          {complaint.subject ||
                            "—"}
                        </td>

                        <td>
                          {complaint.category ||
                            "—"}
                        </td>

                        <td>
                          <p className="ac-date">
                            {
                              submitted.date
                            }
                          </p>

                          <p className="ac-time">
                            {
                              submitted.time
                            }
                          </p>
                        </td>

                        <td>
                          <StatusBadge
                            status={
                              complaint.status
                            }
                          />
                        </td>

                        <td>
                          <button
                            className="ac-btn ac-btn--outline ac-btn--sm"
                            onClick={() =>
                              navigate(
                                `/admin/complaints/${complaint.id}`
                              )
                            }
                          >
                            <Eye size={14} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="ac-footer">
          <p className="ac-footer__count">
            Showing{" "}
            {filtered.length === 0
              ? 0
              : pageStart + 1}{" "}
            to{" "}
            {Math.min(
              pageStart + rowsPerPage,
              filtered.length
            )}{" "}
            of {filtered.length} complaints
          </p>

          <div className="ac-footer__controls">
            <div className="ac-rows-select">
              <label htmlFor="ac-rows">
                Rows per page:
              </label>

              <div className="ac-select ac-select--compact">
                <select
                  id="ac-rows"
                  value={rowsPerPage}
                  onChange={(event) => {
                    setRowsPerPage(
                      Number(
                        event.target.value
                      )
                    );

                    setPage(1);
                  }}
                >
                  <option value={5}>
                    5
                  </option>

                  <option value={10}>
                    10
                  </option>

                  <option value={20}>
                    20
                  </option>
                </select>

                <ChevronDown
                  size={13}
                  className="ac-select__chevron"
                />
              </div>
            </div>

            <div className="ac-pagination">
              <button
                className="ac-page-btn"
                onClick={() =>
                  goToPage(1)
                }
                disabled={
                  currentPage === 1
                }
                aria-label="First page"
              >
                <ChevronsLeft
                  size={15}
                />
              </button>

              <button
                className="ac-page-btn"
                onClick={() =>
                  goToPage(
                    currentPage - 1
                  )
                }
                disabled={
                  currentPage === 1
                }
                aria-label="Previous page"
              >
                <ChevronLeft
                  size={15}
                />
              </button>

              {Array.from(
                {
                  length:
                    totalPages,
                },
                (_, index) =>
                  index + 1
              ).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    className={`ac-page-btn ${
                      pageNumber ===
                      currentPage
                        ? "ac-page-btn--active"
                        : ""
                    }`}
                    onClick={() =>
                      goToPage(
                        pageNumber
                      )
                    }
                  >
                    {pageNumber}
                  </button>
                )
              )}

              <button
                className="ac-page-btn"
                onClick={() =>
                  goToPage(
                    currentPage + 1
                  )
                }
                disabled={
                  currentPage ===
                  totalPages
                }
                aria-label="Next page"
              >
                <ChevronRight
                  size={15}
                />
              </button>

              <button
                className="ac-page-btn"
                onClick={() =>
                  goToPage(
                    totalPages
                  )
                }
                disabled={
                  currentPage ===
                  totalPages
                }
                aria-label="Last page"
              >
                <ChevronsRight
                  size={15}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}