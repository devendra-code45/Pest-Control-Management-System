import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  BarChart3,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  IndianRupee,
  Info,
  LoaderCircle,
  MessageCircle,
  PieChart,
  Search,
  ShieldCheck,
  UserCog,
  Users,
  X,
} from "lucide-react";

import api from "../../api/axios";
import "./Reports.css";

const REPORT_CATEGORIES = [
  {
    id: "revenue",
    title: "Revenue Report",
    description: "Revenue and financial analysis",
    icon: BarChart3,
  },
  {
    id: "service",
    title: "Service Report",
    description: "Service performance and completion",
    icon: ShieldCheck,
  },
  {
    id: "booking",
    title: "Booking Report",
    description: "Booking trends and details",
    icon: CalendarRange,
  },
  {
    id: "complaint",
    title: "Complaint Report",
    description: "Complaint analysis and status",
    icon: MessageCircle,
  },
  {
    id: "customer",
    title: "Customer Report",
    description: "Customer insights and activity",
    icon: Users,
  },
  {
    id: "technician",
    title: "Technician Report",
    description: "Technician performance and jobs",
    icon: UserCog,
  },
  {
    id: "payment",
    title: "Payment Report",
    description: "Payments and transactions",
    icon: IndianRupee,
  },
];

const getCurrentMonthRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const toIsoDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return {
    startDate: toIsoDate(firstDay),
    endDate: toIsoDate(today),
  };
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const escapeCsvValue = (value) => {
  const text = String(value ?? "");

  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
};

const slugify = (value) =>
  String(value || "report")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function Notification({ notification, onClose }) {
  if (!notification) return null;

  return (
    <div
      className={`reports-notification reports-notification--${notification.type}`}
      role={notification.type === "error" ? "alert" : "status"}
    >
      <span className="reports-notification__icon">
        {notification.type === "error" ? (
          <AlertCircle size={19} />
        ) : (
          <Info size={19} />
        )}
      </span>

      <span className="reports-notification__message">
        {notification.message}
      </span>

      <button
        type="button"
        className="reports-notification__close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={17} />
      </button>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <article className="reports-stat-card">
      <div className="reports-stat-card__icon">
        <Icon size={29} strokeWidth={1.9} />
      </div>

      <div className="reports-stat-card__content">
        <p className="reports-stat-card__title">{title}</p>
        <strong className="reports-stat-card__value">{value}</strong>
        <div className="reports-stat-card__trend">
          <span className="reports-stat-card__change">Live</span>
          <span>{description}</span>
        </div>
      </div>
    </article>
  );
}

function ReportCategoryCard({ category, active, onClick }) {
  const Icon = category.icon;

  return (
    <button
      type="button"
      className={`reports-category-card ${
        active ? "reports-category-card--active" : ""
      }`}
      onClick={onClick}
    >
      <span className="reports-category-card__icon">
        <Icon size={23} strokeWidth={1.9} />
      </span>

      <span className="reports-category-card__content">
        <strong>{category.title}</strong>
        <span>{category.description}</span>
      </span>

      <ChevronRight className="reports-category-card__arrow" size={19} />
    </button>
  );
}

function ReportDetailsModal({ report, onClose, onDownload }) {
  if (!report) return null;

  return (
    <div
      className="reports-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="reports-modal reports-modal--details" role="dialog" aria-modal="true">
        <header className="reports-modal__header">
          <div>
            <span className="reports-modal__eyebrow">Live report details</span>
            <h2>{report.name}</h2>
          </div>

          <button
            type="button"
            className="reports-icon-button"
            onClick={onClose}
            aria-label="Close report details"
          >
            <X size={20} />
          </button>
        </header>

        <div className="reports-modal__body">
          <dl className="reports-details-grid">
            <div>
              <dt>Report Type</dt>
              <dd>{report.type}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <span className="reports-status reports-status--completed">
                  {report.status}
                </span>
              </dd>
            </div>
            <div>
              <dt>Date Range</dt>
              <dd>{report.dateRange}</dd>
            </div>
            <div>
              <dt>Generated On</dt>
              <dd>{report.generatedOn}</dd>
            </div>
          </dl>

          <div className="reports-summary-box">
            <h3>Report Summary</h3>
            <p>{report.summary}</p>
          </div>

          <div className="reports-info-banner">
            <Info size={19} />
            <p>
              This report contains {report.rows?.length || 0} real database record(s)
              for the selected date range.
            </p>
          </div>
        </div>

        <footer className="reports-modal__footer">
          <button
            type="button"
            className="reports-button reports-button--secondary"
            onClick={onClose}
          >
            Close
          </button>

          <button
            type="button"
            className="reports-button reports-button--primary"
            onClick={() => onDownload(report)}
          >
            <Download size={17} />
            Download CSV
          </button>
        </footer>
      </section>
    </div>
  );
}

function Reports() {
  const navigate = useNavigate();
  const initialRange = useMemo(() => getCurrentMonthRange(), []);
  const datePickerRef = useRef(null);

  const [startDate, setStartDate] = useState(initialRange.startDate);
  const [endDate, setEndDate] = useState(initialRange.endDate);
  const [draftStartDate, setDraftStartDate] = useState(initialRange.startDate);
  const [draftEndDate, setDraftEndDate] = useState(initialRange.endDate);
  const [dateError, setDateError] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const [summary, setSummary] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "information") => {
    setNotification({ message, type });
  };

  useEffect(() => {
    if (!notification) return undefined;

    const timeout = window.setTimeout(() => setNotification(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [notification]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isDatePickerOpen &&
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setIsDatePickerOpen(false);
        setDraftStartDate(startDate);
        setDraftEndDate(endDate);
        setDateError("");
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isDatePickerOpen, startDate, endDate]);

  const loadReports = async (fromDate = startDate, toDate = endDate) => {
    setLoading(true);

    try {
      const response = await api.get("/admin/reports/overview", {
        params: {
          startDate: fromDate,
          endDate: toDate,
        },
      });

      setSummary(response.data?.summary || null);
      setReports(Array.isArray(response.data?.reports) ? response.data.reports : []);
    } catch (error) {
      console.error("Load reports error:", error?.response?.data || error);
      showNotification(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Unable to load reports.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports(initialRange.startDate, initialRange.endDate);
  }, []);

  const visibleReports = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesCategory =
        !selectedCategory || report.type === selectedCategory;

      const matchesSearch =
        !query ||
        report.name?.toLowerCase().includes(query) ||
        report.type?.toLowerCase().includes(query) ||
        report.status?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [reports, selectedCategory, searchQuery]);

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${Number(summary?.totalRevenue || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: IndianRupee,
      description: "net collected amount",
    },
    {
      title: "Completed Services",
      value: summary?.completedServices ?? 0,
      icon: CheckCircle2,
      description: "completed bookings",
    },
    {
      title: "Open Complaints",
      value: summary?.openComplaints ?? 0,
      icon: MessageCircle,
      description: "pending or in progress",
    },
    {
      title: "Collection Rate",
      value: `${Number(summary?.collectionRate || 0).toFixed(2)}%`,
      icon: PieChart,
      description: "revenue collection",
    },
  ];

  const handleApplyDateRange = () => {
    if (!draftStartDate || !draftEndDate) {
      setDateError("Both start and end dates are required.");
      return;
    }

    if (draftEndDate < draftStartDate) {
      setDateError("End date cannot be before start date.");
      return;
    }

    setStartDate(draftStartDate);
    setEndDate(draftEndDate);
    setDateError("");
    setIsDatePickerOpen(false);
    loadReports(draftStartDate, draftEndDate);
  };

  const handleCancelDateRange = () => {
    setDraftStartDate(startDate);
    setDraftEndDate(endDate);
    setDateError("");
    setIsDatePickerOpen(false);
  };

  const downloadReportCsv = (report) => {
    const headers = Array.isArray(report.headers) ? report.headers : [];
    const rows = Array.isArray(report.rows) ? report.rows : [];

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\r\n");

    const blob = new Blob([`﻿${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(report.name)}-${endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification(`${report.name} downloaded successfully.`);
  };

  const handleExportAll = async () => {
    if (visibleReports.length === 0) {
      showNotification("There are no visible reports to export.", "error");
      return;
    }

    setIsExporting(true);

    try {
      visibleReports.forEach((report, index) => {
        window.setTimeout(() => downloadReportCsv(report), index * 250);
      });
    } finally {
      window.setTimeout(() => setIsExporting(false), 500);
    }
  };

  return (
    <main className="reports-page">
      <Notification
        notification={notification}
        onClose={() => setNotification(null)}
      />

      <nav className="reports-breadcrumb" aria-label="Breadcrumb">
        <button
          type="button"
          className="reports-breadcrumb__link"
          onClick={() => navigate("/admin/dashboard")}
        >
          Dashboard
        </button>

        <ChevronRight size={17} />
        <span aria-current="page">Reports</span>
      </nav>

      <header className="reports-header">
        <div className="reports-header__content">
          <h1>Reports</h1>
          <p>View real business reports and performance insights.</p>
        </div>

        <div className="reports-header__actions">
          <div className="reports-date-wrapper" ref={datePickerRef}>
            <button
              type="button"
              className="reports-date-control"
              onClick={() => {
                setDraftStartDate(startDate);
                setDraftEndDate(endDate);
                setDateError("");
                setIsDatePickerOpen((value) => !value);
              }}
            >
              <CalendarDays size={19} />
              <span>
                {formatDate(startDate)} - {formatDate(endDate)}
              </span>
              <ChevronDown size={18} />
            </button>

            {isDatePickerOpen && (
              <div className="reports-date-popover" role="dialog">
                <div className="reports-date-popover__header">
                  <strong>Select Date Range</strong>
                  <button
                    type="button"
                    className="reports-icon-button reports-icon-button--small"
                    onClick={handleCancelDateRange}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="reports-date-popover__fields">
                  <div className="reports-form-field">
                    <label htmlFor="reports-from-date">From Date</label>
                    <input
                      id="reports-from-date"
                      type="date"
                      value={draftStartDate}
                      onChange={(event) => {
                        setDraftStartDate(event.target.value);
                        setDateError("");
                      }}
                    />
                  </div>

                  <div className="reports-form-field">
                    <label htmlFor="reports-to-date">To Date</label>
                    <input
                      id="reports-to-date"
                      type="date"
                      value={draftEndDate}
                      onChange={(event) => {
                        setDraftEndDate(event.target.value);
                        setDateError("");
                      }}
                    />
                  </div>
                </div>

                {dateError && (
                  <div className="reports-date-popover__error">
                    <AlertCircle size={16} />
                    <span>{dateError}</span>
                  </div>
                )}

                <div className="reports-date-popover__actions">
                  <button
                    type="button"
                    className="reports-button reports-button--secondary reports-button--compact"
                    onClick={handleCancelDateRange}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="reports-button reports-button--primary reports-button--compact"
                    onClick={handleApplyDateRange}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className="reports-button reports-button--outline reports-export-button"
            disabled={loading || isExporting}
            onClick={handleExportAll}
          >
            {isExporting ? (
              <LoaderCircle className="reports-spinner" size={18} />
            ) : (
              <Download size={18} />
            )}
            {isExporting ? "Exporting..." : "Export All"}
          </button>
        </div>
      </header>

      <section className="reports-stats-grid" aria-label="Report statistics">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="reports-section-card">
        <header className="reports-section-header">
          <h2>Report Categories</h2>
        </header>

        <div className="reports-category-grid">
          {REPORT_CATEGORIES.map((category) => (
            <ReportCategoryCard
              key={category.id}
              category={category}
              active={selectedCategory === category.title}
              onClick={() =>
                setSelectedCategory((current) =>
                  current === category.title ? "" : category.title
                )
              }
            />
          ))}
        </div>
      </section>

      <section className="reports-section-card reports-recent-section">
        <header className="reports-section-header reports-section-header--recent">
          <div className="reports-section-header__title">
            <h2>Generated Reports</h2>
            {selectedCategory && (
              <div className="reports-active-filter">
                Showing: <strong>{selectedCategory}</strong>
                <button type="button" onClick={() => setSelectedCategory("")}>
                  Clear filter
                </button>
              </div>
            )}
          </div>

          <div className="reports-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search reports"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")}>
                <X size={15} />
              </button>
            )}
          </div>
        </header>

        {loading ? (
          <div className="reports-empty-state">
            <span className="reports-empty-state__icon">
              <LoaderCircle className="reports-spinner" size={28} />
            </span>
            <h3>Loading reports</h3>
            <p>Calculating real values from the database.</p>
          </div>
        ) : visibleReports.length === 0 ? (
          <div className="reports-empty-state">
            <span className="reports-empty-state__icon">
              <FileText size={28} />
            </span>
            <h3>No reports found</h3>
            <p>Change the filter or date range.</p>
          </div>
        ) : (
          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Report Name</th>
                  <th>Report Type</th>
                  <th>Date Range</th>
                  <th>Generated On</th>
                  <th>Records</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {visibleReports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <div className="reports-table__name">
                        <span><FileText size={16} /></span>
                        <strong>{report.name}</strong>
                      </div>
                    </td>
                    <td>{report.type}</td>
                    <td>{report.dateRange}</td>
                    <td>{report.generatedOn}</td>
                    <td>{report.rows?.length || 0}</td>
                    <td>
                      <span className="reports-status reports-status--completed">
                        {report.status}
                      </span>
                    </td>
                    <td>
                      <div className="reports-row-actions">
                        <button
                          type="button"
                          className="reports-view-button"
                          onClick={() => setSelectedReport(report)}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className="reports-icon-button reports-icon-button--table"
                          onClick={() => downloadReportCsv(report)}
                          aria-label={`Download ${report.name}`}
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="reports-info-banner">
          <Info size={20} />
          <p>
            Reports are calculated directly from bookings, payments, complaints,
            customers, services and technicians. No report database table is required.
          </p>
        </div>
      </section>

      <ReportDetailsModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onDownload={downloadReportCsv}
      />
    </main>
  );
}

export default Reports;
