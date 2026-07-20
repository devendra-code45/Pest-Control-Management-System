import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  CalendarDays,
  CalendarRange,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  FileText,
  IndianRupee,
  Info,
  LoaderCircle,
  MessageCircle,
  MoreVertical,
  PieChart,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  Users,
  X,
} from 'lucide-react';
import './Reports.css';

const INITIAL_REPORTS = [
  {
    id: 'report-revenue-summary',
    name: 'Revenue Summary',
    type: 'Revenue Report',
    dateRange: '01 Jul 2026 - 19 Jul 2026',
    generatedOn: '19 Jul 2026, 10:30 AM',
    status: 'Completed',
  },
  {
    id: 'report-service-performance',
    name: 'Service Performance',
    type: 'Service Report',
    dateRange: '01 Jul 2026 - 19 Jul 2026',
    generatedOn: '19 Jul 2026, 09:15 AM',
    status: 'Completed',
  },
  {
    id: 'report-technician-summary',
    name: 'Technician Summary',
    type: 'Technician Report',
    dateRange: '01 Jul 2026 - 19 Jul 2026',
    generatedOn: '18 Jul 2026, 06:45 PM',
    status: 'Completed',
  },
  {
    id: 'report-complaint-overview',
    name: 'Complaint Overview',
    type: 'Complaint Report',
    dateRange: '01 Jul 2026 - 19 Jul 2026',
    generatedOn: '18 Jul 2026, 05:20 PM',
    status: 'In Progress',
  },
  {
    id: 'report-booking-overview',
    name: 'Booking Overview',
    type: 'Booking Report',
    dateRange: '01 Jul 2026 - 19 Jul 2026',
    generatedOn: '18 Jul 2026, 04:10 PM',
    status: 'Completed',
  },
];

const STATISTICS = [
  {
    id: 'total-revenue',
    title: 'Total Revenue',
    value: '₹2,48,500',
    change: '18%',
    direction: 'up',
    icon: IndianRupee,
  },
  {
    id: 'completed-services',
    title: 'Completed Services',
    value: '128',
    change: '14%',
    direction: 'up',
    icon: CheckCircle2,
  },
  {
    id: 'open-complaints',
    title: 'Open Complaints',
    value: '7',
    change: '12%',
    direction: 'down',
    icon: AlertTriangle,
  },
  {
    id: 'collection-rate',
    title: 'Collection Rate',
    value: '92.4%',
    change: '5.6%',
    direction: 'up',
    icon: PieChart,
  },
];

const REPORT_CATEGORIES = [
  {
    id: 'revenue',
    title: 'Revenue Report',
    description: 'Revenue and financial analysis',
    icon: BarChart3,
  },
  {
    id: 'service',
    title: 'Service Report',
    description: 'Service performance and completion',
    icon: ShieldCheck,
  },
  {
    id: 'booking',
    title: 'Booking Report',
    description: 'Booking trends and details',
    icon: CalendarRange,
  },
  {
    id: 'complaint',
    title: 'Complaint Report',
    description: 'Complaint analysis and status',
    icon: MessageCircle,
  },
  {
    id: 'customer',
    title: 'Customer Report',
    description: 'Customer insights and activity',
    icon: Users,
  },
  {
    id: 'technician',
    title: 'Technician Report',
    description: 'Technician performance and jobs',
    icon: UserCog,
  },
  {
    id: 'payment',
    title: 'Payment Report',
    description: 'Payments and transactions',
    icon: IndianRupee,
  },
  {
    id: 'custom',
    title: 'Custom Report',
    description: 'Generate custom reports',
    icon: FileText,
    isCustom: true,
  },
];

const CUSTOM_REPORT_TYPES = REPORT_CATEGORIES.filter(
  (category) => !category.isCustom,
).map((category) => category.title);

const DEFAULT_CUSTOM_FORM = {
  name: '',
  type: '',
  startDate: '2026-07-01',
  endDate: '2026-07-19',
};

function createUniqueId(prefix = 'report') {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function parseLocalDate(dateValue) {
  return new Date(`${dateValue}T00:00:00`);
}

function formatDate(dateValue) {
  if (!dateValue) {
    return '';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parseLocalDate(dateValue));
}

function createDateRange(startDate, endDate) {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

function formatCurrentDateTime() {
  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date());

  return formattedDate.replace(/\b(am|pm)\b/gi, (value) =>
    value.toUpperCase(),
  );
}

function escapeCsvValue(value) {
  const text = String(value ?? '');

  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getReportSummary(reportType) {
  const summaries = {
    'Revenue Report':
      'Provides a financial overview of collected revenue, pending amounts, payment performance and revenue trends for the selected period.',
    'Service Report':
      'Summarizes completed, pending and cancelled pest-control services along with service completion performance.',
    'Booking Report':
      'Shows booking activity, scheduled visits, completion trends and customer booking patterns for the selected date range.',
    'Complaint Report':
      'Reviews customer complaints, current resolution status, response performance and unresolved complaint trends.',
    'Customer Report':
      'Provides customer activity insights, service history, repeat bookings and account engagement information.',
    'Technician Report':
      'Summarizes technician assignments, completed jobs, service efficiency and workload distribution.',
    'Payment Report':
      'Provides a transaction summary covering received payments, pending collections, payment methods and collection status.',
  };

  return (
    summaries[reportType] ||
    'Provides a structured summary of the selected pest-control management data for the chosen reporting period.'
  );
}

function StatusBadge({ status }) {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-');

  return (
    <span
      className={`reports-status reports-status--${normalizedStatus}`}
      aria-label={`Report status: ${status}`}
    >
      {status}
    </span>
  );
}

function StatCard({ title, value, change, direction, icon: Icon }) {
  const TrendIcon = direction === 'down' ? ArrowDown : ArrowUp;

  return (
    <article className="reports-stat-card">
      <div className="reports-stat-card__icon" aria-hidden="true">
        <Icon size={29} strokeWidth={1.9} />
      </div>

      <div className="reports-stat-card__content">
        <p className="reports-stat-card__title">{title}</p>
        <strong className="reports-stat-card__value">{value}</strong>

        <div className="reports-stat-card__trend">
          <TrendIcon size={15} strokeWidth={2.2} aria-hidden="true" />
          <span className="reports-stat-card__change">{change}</span>
          <span>from last month</span>
        </div>
      </div>
    </article>
  );
}

function ReportCategoryCard({
  title,
  description,
  icon: Icon,
  isActive,
  onClick,
}) {
  return (
    <button
      type="button"
      className={`reports-category-card ${
        isActive ? 'reports-category-card--active' : ''
      }`}
      aria-pressed={isActive}
      onClick={onClick}
    >
      <span className="reports-category-card__icon" aria-hidden="true">
        <Icon size={23} strokeWidth={1.9} />
      </span>

      <span className="reports-category-card__content">
        <strong>{title}</strong>
        <span>{description}</span>
      </span>

      <ChevronRight
        className="reports-category-card__arrow"
        size={19}
        aria-hidden="true"
      />
    </button>
  );
}

function Notification({ notification, onClose }) {
  if (!notification) {
    return null;
  }

  const Icon =
    notification.type === 'success'
      ? Check
      : notification.type === 'error'
        ? AlertCircle
        : Info;

  const role = notification.type === 'error' ? 'alert' : 'status';

  return (
    <div
      className={`reports-notification reports-notification--${notification.type}`}
      role={role}
      aria-live="polite"
    >
      <span className="reports-notification__icon" aria-hidden="true">
        <Icon size={19} strokeWidth={2.2} />
      </span>

      <span className="reports-notification__message">
        {notification.message}
      </span>

      <button
        type="button"
        className="reports-notification__close"
        aria-label="Close notification"
        onClick={onClose}
      >
        <X size={17} aria-hidden="true" />
      </button>
    </div>
  );
}

function ReportDetailsModal({ report, onClose, onDownload }) {
  if (!report) {
    return null;
  }

  const isDownloadDisabled = report.status === 'In Progress';

  return (
    <div
      className="reports-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="reports-modal reports-modal--details"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reports-details-title"
      >
        <header className="reports-modal__header">
          <div>
            <span className="reports-modal__eyebrow">Report details</span>
            <h2 id="reports-details-title">{report.name}</h2>
          </div>

          <button
            type="button"
            className="reports-icon-button"
            aria-label="Close report details"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
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
                <StatusBadge status={report.status} />
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
            <p>{getReportSummary(report.type)}</p>
          </div>

          {isDownloadDisabled && (
            <div className="reports-modal-message reports-modal-message--warning">
              <AlertCircle size={18} aria-hidden="true" />
              <span>
                This report is still being generated. Download will be
                available after completion.
              </span>
            </div>
          )}
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
            disabled={isDownloadDisabled}
            onClick={() => onDownload(report)}
          >
            <Download size={17} aria-hidden="true" />
            Download CSV
          </button>
        </footer>
      </section>
    </div>
  );
}

function CustomReportModal({
  form,
  errors,
  onChange,
  onSubmit,
  onClose,
}) {
  return (
    <div
      className="reports-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="reports-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reports-custom-title"
      >
        <header className="reports-modal__header">
          <div>
            <span className="reports-modal__eyebrow">
              Custom report generator
            </span>
            <h2 id="reports-custom-title">Generate Custom Report</h2>
          </div>

          <button
            type="button"
            className="reports-icon-button"
            aria-label="Close custom report form"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <form onSubmit={onSubmit} noValidate>
          <div className="reports-modal__body">
            <div className="reports-form-grid">
              <div className="reports-form-field reports-form-field--full">
                <label htmlFor="custom-report-name">Report Name</label>
                <input
                  id="custom-report-name"
                  name="name"
                  type="text"
                  value={form.name}
                  className={errors.name ? 'reports-input--error' : ''}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={
                    errors.name ? 'custom-report-name-error' : undefined
                  }
                  placeholder="Enter report name"
                  onChange={onChange}
                />
                {errors.name && (
                  <span
                    id="custom-report-name-error"
                    className="reports-field-error"
                  >
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="reports-form-field reports-form-field--full">
                <label htmlFor="custom-report-type">Report Type</label>
                <select
                  id="custom-report-type"
                  name="type"
                  value={form.type}
                  className={errors.type ? 'reports-input--error' : ''}
                  aria-invalid={Boolean(errors.type)}
                  aria-describedby={
                    errors.type ? 'custom-report-type-error' : undefined
                  }
                  onChange={onChange}
                >
                  <option value="">Select report type</option>
                  {CUSTOM_REPORT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <span
                    id="custom-report-type-error"
                    className="reports-field-error"
                  >
                    {errors.type}
                  </span>
                )}
              </div>

              <div className="reports-form-field">
                <label htmlFor="custom-report-start-date">Start Date</label>
                <input
                  id="custom-report-start-date"
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  className={errors.startDate ? 'reports-input--error' : ''}
                  aria-invalid={Boolean(errors.startDate)}
                  aria-describedby={
                    errors.startDate
                      ? 'custom-report-start-date-error'
                      : undefined
                  }
                  onChange={onChange}
                />
                {errors.startDate && (
                  <span
                    id="custom-report-start-date-error"
                    className="reports-field-error"
                  >
                    {errors.startDate}
                  </span>
                )}
              </div>

              <div className="reports-form-field">
                <label htmlFor="custom-report-end-date">End Date</label>
                <input
                  id="custom-report-end-date"
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  className={errors.endDate ? 'reports-input--error' : ''}
                  aria-invalid={Boolean(errors.endDate)}
                  aria-describedby={
                    errors.endDate
                      ? 'custom-report-end-date-error'
                      : undefined
                  }
                  onChange={onChange}
                />
                {errors.endDate && (
                  <span
                    id="custom-report-end-date-error"
                    className="reports-field-error"
                  >
                    {errors.endDate}
                  </span>
                )}
              </div>
            </div>
          </div>

          <footer className="reports-modal__footer">
            <button
              type="button"
              className="reports-button reports-button--secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="reports-button reports-button--primary"
            >
              <FileText size={17} aria-hidden="true" />
              Generate Report
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function DeleteConfirmationModal({ report, onCancel, onConfirm }) {
  if (!report) {
    return null;
  }

  return (
    <div
      className="reports-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <section
        className="reports-modal reports-modal--confirmation"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reports-delete-title"
      >
        <header className="reports-modal__header">
          <div>
            <span className="reports-modal__eyebrow reports-modal__eyebrow--danger">
              Delete report
            </span>
            <h2 id="reports-delete-title">Confirm deletion</h2>
          </div>

          <button
            type="button"
            className="reports-icon-button"
            aria-label="Close delete confirmation"
            onClick={onCancel}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="reports-modal__body">
          <div className="reports-delete-message">
            <span className="reports-delete-message__icon" aria-hidden="true">
              <Trash2 size={23} />
            </span>

            <div>
              <p>
                Are you sure you want to delete{' '}
                <strong>{report.name}</strong>?
              </p>
              <span>
                This removes the report from the current frontend session.
              </span>
            </div>
          </div>
        </div>

        <footer className="reports-modal__footer">
          <button
            type="button"
            className="reports-button reports-button--secondary"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="reports-button reports-button--danger"
            onClick={onConfirm}
          >
            <Trash2 size={17} aria-hidden="true" />
            Delete Report
          </button>
        </footer>
      </section>
    </div>
  );
}

function Reports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const [startDate, setStartDate] = useState('2026-07-01');
  const [endDate, setEndDate] = useState('2026-07-19');
  const [draftStartDate, setDraftStartDate] = useState('2026-07-01');
  const [draftEndDate, setDraftEndDate] = useState('2026-07-19');
  const [dateError, setDateError] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const [isCustomReportOpen, setIsCustomReportOpen] = useState(false);
  const [customReportForm, setCustomReportForm] = useState(
    DEFAULT_CUSTOM_FORM,
  );
  const [customReportErrors, setCustomReportErrors] = useState({});
  const [pendingReportIds, setPendingReportIds] = useState([]);

  const datePickerRef = useRef(null);
  const actionMenuRef = useRef(null);
  const completionTimersRef = useRef(new Map());

  const selectedReport = useMemo(
    () =>
      reports.find((report) => report.id === selectedReportId) || null,
    [reports, selectedReportId],
  );

  const visibleReports = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesCategory =
        !selectedCategory || report.type === selectedCategory;

      const matchesSearch =
        !normalizedQuery ||
        report.name.toLowerCase().includes(normalizedQuery) ||
        report.type.toLowerCase().includes(normalizedQuery) ||
        report.status.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [reports, searchQuery, selectedCategory]);

  useEffect(() => {
    if (!notification) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setNotification(null);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [notification]);

  useEffect(() => {
    pendingReportIds.forEach((reportId) => {
      if (completionTimersRef.current.has(reportId)) {
        return;
      }

      const timerId = window.setTimeout(() => {
        setReports((currentReports) =>
          currentReports.map((report) =>
            report.id === reportId
              ? { ...report, status: 'Completed' }
              : report,
          ),
        );

        setPendingReportIds((currentIds) =>
          currentIds.filter((id) => id !== reportId),
        );

        completionTimersRef.current.delete(reportId);
      }, 3500);

      completionTimersRef.current.set(reportId, timerId);
    });
  }, [pendingReportIds]);

  useEffect(
    () => () => {
      completionTimersRef.current.forEach((timerId) => {
        window.clearTimeout(timerId);
      });

      completionTimersRef.current.clear();
    },
    [],
  );

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
        setDateError('');
      }

      if (
        activeMenuId &&
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target)
      ) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [activeMenuId, endDate, isDatePickerOpen, startDate]);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key !== 'Escape') {
        return;
      }

      if (reportToDelete) {
        setReportToDelete(null);
        return;
      }

      if (isCustomReportOpen) {
        setIsCustomReportOpen(false);
        setCustomReportErrors({});
        setCustomReportForm({
          ...DEFAULT_CUSTOM_FORM,
          startDate,
          endDate,
        });
        return;
      }

      if (selectedReportId) {
        setSelectedReportId(null);
        return;
      }

      if (isDatePickerOpen) {
        setIsDatePickerOpen(false);
        setDraftStartDate(startDate);
        setDraftEndDate(endDate);
        setDateError('');
        return;
      }

      if (activeMenuId) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [
    activeMenuId,
    endDate,
    isCustomReportOpen,
    isDatePickerOpen,
    reportToDelete,
    selectedReportId,
    startDate,
  ]);

  const showNotification = (message, type = 'success') => {
    setNotification({
      id: createUniqueId('notification'),
      message,
      type,
    });
  };

  const downloadCsv = (rows, filename) => {
    const headers = [
      'Report Name',
      'Report Type',
      'Date Range',
      'Generated On',
      'Status',
    ];

    const csvRows = rows.map((report) => [
      report.name,
      report.type,
      report.dateRange,
      report.generatedOn,
      report.status,
    ]);

    const csvContent = [headers, ...csvRows]
      .map((row) => row.map(escapeCsvValue).join(','))
      .join('\r\n');

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: 'text/csv;charset=utf-8;',
    });

    const objectUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');

    downloadLink.href = objectUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(objectUrl);
  };

  const handleApplyDateRange = () => {
    if (!draftStartDate || !draftEndDate) {
      setDateError('Both start and end dates are required.');
      showNotification('Please select both dates.', 'error');
      return;
    }

    if (draftEndDate < draftStartDate) {
      setDateError('End date cannot be before the start date.');
      showNotification('The selected date range is invalid.', 'error');
      return;
    }

    setStartDate(draftStartDate);
    setEndDate(draftEndDate);
    setDateError('');
    setIsDatePickerOpen(false);
    showNotification('Report date range updated.', 'information');
  };

  const handleCancelDateRange = () => {
    setDraftStartDate(startDate);
    setDraftEndDate(endDate);
    setDateError('');
    setIsDatePickerOpen(false);
  };

  const handleExportReports = async () => {
    if (visibleReports.length === 0) {
      showNotification('There are no visible reports to export.', 'error');
      return;
    }

    setIsExporting(true);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 450);
    });

    downloadCsv(
      visibleReports,
      `pest-control-reports-${endDate}.csv`,
    );

    setIsExporting(false);
    showNotification('Reports exported successfully.');
  };

  const handleCategorySelect = (category) => {
    setActiveMenuId(null);

    if (category.isCustom) {
      setCustomReportForm({
        ...DEFAULT_CUSTOM_FORM,
        startDate,
        endDate,
      });
      setCustomReportErrors({});
      setIsCustomReportOpen(true);
      return;
    }

    setSelectedCategory((currentCategory) =>
      currentCategory === category.title ? '' : category.title,
    );
  };

  const handleCustomReportChange = (event) => {
    const { name, value } = event.target;

    setCustomReportForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    if (customReportErrors[name]) {
      setCustomReportErrors((currentErrors) => ({
        ...currentErrors,
        [name]: '',
      }));
    }
  };

  const validateCustomReport = () => {
    const errors = {};

    if (!customReportForm.name.trim()) {
      errors.name = 'Report name is required.';
    }

    if (!customReportForm.type) {
      errors.type = 'Select a report type.';
    }

    if (!customReportForm.startDate) {
      errors.startDate = 'Start date is required.';
    }

    if (!customReportForm.endDate) {
      errors.endDate = 'End date is required.';
    } else if (
      customReportForm.startDate &&
      customReportForm.endDate < customReportForm.startDate
    ) {
      errors.endDate = 'End date cannot be before the start date.';
    }

    return errors;
  };

  const handleGenerateCustomReport = (event) => {
    event.preventDefault();

    const validationErrors = validateCustomReport();

    if (Object.keys(validationErrors).length > 0) {
      setCustomReportErrors(validationErrors);
      showNotification('Correct the highlighted report fields.', 'error');
      return;
    }

    const reportId = createUniqueId('custom-report');

    const newReport = {
      id: reportId,
      name: customReportForm.name.trim(),
      type: customReportForm.type,
      dateRange: createDateRange(
        customReportForm.startDate,
        customReportForm.endDate,
      ),
      generatedOn: formatCurrentDateTime(),
      status: 'In Progress',
    };

    setReports((currentReports) => [newReport, ...currentReports]);
    setPendingReportIds((currentIds) => [...currentIds, reportId]);
    setIsCustomReportOpen(false);
    setCustomReportErrors({});
    setCustomReportForm({
      ...DEFAULT_CUSTOM_FORM,
      startDate,
      endDate,
    });

    showNotification('Custom report generation started.');
  };

  const handleCloseCustomReport = () => {
    setIsCustomReportOpen(false);
    setCustomReportErrors({});
    setCustomReportForm({
      ...DEFAULT_CUSTOM_FORM,
      startDate,
      endDate,
    });
  };

  const handleViewReport = (report) => {
    setActiveMenuId(null);
    setSelectedReportId(report.id);
  };

  const handleDownloadReport = (report) => {
    if (report.status === 'In Progress') {
      showNotification(
        'This report is still being generated.',
        'error',
      );
      return;
    }

    downloadCsv(
      [report],
      `${slugify(report.name) || 'report'}.csv`,
    );

    setActiveMenuId(null);
    showNotification(`${report.name} downloaded successfully.`);
  };

  const handleDuplicateReport = (report) => {
    const duplicateReport = {
      ...report,
      id: createUniqueId('report-copy'),
      name: `${report.name} Copy`,
      generatedOn: formatCurrentDateTime(),
    };

    setReports((currentReports) => [
      duplicateReport,
      ...currentReports,
    ]);

    setActiveMenuId(null);
    showNotification('Report duplicated successfully.');
  };

  const handleRequestDelete = (report) => {
    setActiveMenuId(null);
    setReportToDelete(report);
  };

  const handleConfirmDelete = () => {
    if (!reportToDelete) {
      return;
    }

    setReports((currentReports) =>
      currentReports.filter(
        (report) => report.id !== reportToDelete.id,
      ),
    );

    setPendingReportIds((currentIds) =>
      currentIds.filter((id) => id !== reportToDelete.id),
    );

    const timerId = completionTimersRef.current.get(reportToDelete.id);

    if (timerId) {
      window.clearTimeout(timerId);
      completionTimersRef.current.delete(reportToDelete.id);
    }

    if (selectedReportId === reportToDelete.id) {
      setSelectedReportId(null);
    }

    setReportToDelete(null);
    showNotification('Report deleted successfully.');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
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
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </button>

        <ChevronRight size={17} aria-hidden="true" />

        <span aria-current="page">Reports</span>
      </nav>

      <header className="reports-header">
        <div className="reports-header__content">
          <h1>Reports</h1>
          <p>
            View and analyze business reports and performance insights.
          </p>
        </div>

        <div className="reports-header__actions">
          <div
            className="reports-date-wrapper"
            ref={datePickerRef}
          >
            <button
              type="button"
              className="reports-date-control"
              aria-haspopup="dialog"
              aria-expanded={isDatePickerOpen}
              onClick={() => {
                setActiveMenuId(null);
                setDraftStartDate(startDate);
                setDraftEndDate(endDate);
                setDateError('');
                setIsDatePickerOpen((currentValue) => !currentValue);
              }}
            >
              <CalendarDays size={19} aria-hidden="true" />
              <span>{createDateRange(startDate, endDate)}</span>
              <ChevronDown size={18} aria-hidden="true" />
            </button>

            {isDatePickerOpen && (
              <div
                className="reports-date-popover"
                role="dialog"
                aria-label="Select report date range"
              >
                <div className="reports-date-popover__header">
                  <strong>Select Date Range</strong>
                  <button
                    type="button"
                    className="reports-icon-button reports-icon-button--small"
                    aria-label="Close date range selector"
                    onClick={handleCancelDateRange}
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>

                <div className="reports-date-popover__fields">
                  <div className="reports-form-field">
                    <label htmlFor="reports-from-date">From Date</label>
                    <input
                      id="reports-from-date"
                      type="date"
                      value={draftStartDate}
                      aria-invalid={Boolean(dateError)}
                      onChange={(event) => {
                        setDraftStartDate(event.target.value);
                        setDateError('');
                      }}
                    />
                  </div>

                  <div className="reports-form-field">
                    <label htmlFor="reports-to-date">To Date</label>
                    <input
                      id="reports-to-date"
                      type="date"
                      value={draftEndDate}
                      aria-invalid={Boolean(dateError)}
                      onChange={(event) => {
                        setDraftEndDate(event.target.value);
                        setDateError('');
                      }}
                    />
                  </div>
                </div>

                {dateError && (
                  <div
                    className="reports-date-popover__error"
                    role="alert"
                  >
                    <AlertCircle size={16} aria-hidden="true" />
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
            disabled={isExporting}
            onClick={handleExportReports}
          >
            {isExporting ? (
              <LoaderCircle
                className="reports-spinner"
                size={18}
                aria-hidden="true"
              />
            ) : (
              <Download size={18} aria-hidden="true" />
            )}

            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </header>

      <section
        className="reports-stats-grid"
        aria-label="Report statistics"
      >
        {STATISTICS.map((statistic) => (
          <StatCard key={statistic.id} {...statistic} />
        ))}
      </section>

      <section className="reports-section-card">
        <header className="reports-section-header">
          <div>
            <h2>Report Categories</h2>
          </div>
        </header>

        <div className="reports-category-grid">
          {REPORT_CATEGORIES.map((category) => (
            <ReportCategoryCard
              key={category.id}
              {...category}
              isActive={
                !category.isCustom &&
                selectedCategory === category.title
              }
              onClick={() => handleCategorySelect(category)}
            />
          ))}
        </div>
      </section>

      <section className="reports-section-card reports-recent-section">
        <header className="reports-section-header reports-section-header--recent">
          <div className="reports-section-header__title">
            <h2>Recent Reports</h2>

            {selectedCategory && (
              <div className="reports-active-filter">
                <span>
                  Filtered by: <strong>{selectedCategory}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('')}
                >
                  Clear Filter
                </button>
              </div>
            )}
          </div>

          <div className="reports-search">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              aria-label="Search reports"
              placeholder="Search reports..."
              onChange={(event) => setSearchQuery(event.target.value)}
            />

            {searchQuery && (
              <button
                type="button"
                aria-label="Clear report search"
                onClick={() => setSearchQuery('')}
              >
                <X size={17} aria-hidden="true" />
              </button>
            )}
          </div>
        </header>

        {visibleReports.length > 0 ? (
          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th scope="col">Report Name</th>
                  <th scope="col">Report Type</th>
                  <th scope="col">Date Range</th>
                  <th scope="col">Generated On</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>

              <tbody>
                {visibleReports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <div className="reports-table__name">
                        <span aria-hidden="true">
                          <FileText size={18} />
                        </span>
                        <strong>{report.name}</strong>
                      </div>
                    </td>

                    <td>{report.type}</td>
                    <td>{report.dateRange}</td>
                    <td>{report.generatedOn}</td>

                    <td>
                      <StatusBadge status={report.status} />
                    </td>

                    <td>
                      <div className="reports-row-actions">
                        <button
                          type="button"
                          className="reports-view-button"
                          onClick={() => handleViewReport(report)}
                        >
                          View
                        </button>

                        <div
                          className="reports-action-wrapper"
                          ref={
                            activeMenuId === report.id
                              ? actionMenuRef
                              : null
                          }
                        >
                          <button
                            type="button"
                            className="reports-icon-button reports-icon-button--table"
                            aria-label={`Open actions for ${report.name}`}
                            aria-haspopup="menu"
                            aria-expanded={
                              activeMenuId === report.id
                            }
                            onClick={() =>
                              setActiveMenuId((currentId) =>
                                currentId === report.id
                                  ? null
                                  : report.id,
                              )
                            }
                          >
                            <MoreVertical
                              size={19}
                              aria-hidden="true"
                            />
                          </button>

                          {activeMenuId === report.id && (
                            <div
                              className="reports-action-menu"
                              role="menu"
                            >
                              <button
                                type="button"
                                role="menuitem"
                                disabled={
                                  report.status === 'In Progress'
                                }
                                onClick={() =>
                                  handleDownloadReport(report)
                                }
                              >
                                <Download
                                  size={16}
                                  aria-hidden="true"
                                />
                                Download CSV
                              </button>

                              <button
                                type="button"
                                role="menuitem"
                                onClick={() =>
                                  handleDuplicateReport(report)
                                }
                              >
                                <Copy
                                  size={16}
                                  aria-hidden="true"
                                />
                                Duplicate Report
                              </button>

                              <button
                                type="button"
                                role="menuitem"
                                className="reports-action-menu__danger"
                                onClick={() =>
                                  handleRequestDelete(report)
                                }
                              >
                                <Trash2
                                  size={16}
                                  aria-hidden="true"
                                />
                                Delete Report
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="reports-empty-state">
            <span className="reports-empty-state__icon" aria-hidden="true">
              <FileText size={29} />
            </span>

            <h3>No reports found</h3>
            <p>
              Try changing your search or report category filter.
            </p>

            <button
              type="button"
              className="reports-button reports-button--outline"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}

        <div className="reports-info-banner">
          <Info size={21} aria-hidden="true" />
          <p>
            Select a report category or view a recent report to see
            detailed insights.
          </p>
        </div>
      </section>

      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          onClose={() => setSelectedReportId(null)}
          onDownload={handleDownloadReport}
        />
      )}

      {isCustomReportOpen && (
        <CustomReportModal
          form={customReportForm}
          errors={customReportErrors}
          onChange={handleCustomReportChange}
          onSubmit={handleGenerateCustomReport}
          onClose={handleCloseCustomReport}
        />
      )}

      {reportToDelete && (
        <DeleteConfirmationModal
          report={reportToDelete}
          onCancel={() => setReportToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </main>
  );
}

export default Reports;