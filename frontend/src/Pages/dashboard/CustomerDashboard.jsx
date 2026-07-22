import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  ChevronRight,
  CircleCheck,
  CircleX,
  ClipboardList,
  Clock3,
  Headphones,
  Home,
  MessageSquareWarning,
  ReceiptIndianRupee,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react';
import './CustomerDashboard.css';

const CUSTOMER_DASHBOARD_ROUTES = {
  bookService: '/book-service',
  upcomingServices: '/bookings?status=upcoming',
  serviceRequests: '/service-requests',
  completedServices: '/bookings?status=completed',
  payments: '/payments',
  bookings: '/bookings',
  complaints: '/complaints/create',
  support: '/support',
};

const SUMMARY_CARDS = [
  {
    id: 'upcoming',
    label: 'Upcoming Service',
    value: '1',
    icon: CalendarDays,
    route: CUSTOMER_DASHBOARD_ROUTES.upcomingServices,
  },
  {
    id: 'active',
    label: 'Active Requests',
    value: '2',
    icon: ClipboardList,
    route: CUSTOMER_DASHBOARD_ROUTES.serviceRequests,
  },
  {
    id: 'completed',
    label: 'Completed Services',
    value: '8',
    icon: CheckCircle2,
    route: CUSTOMER_DASHBOARD_ROUTES.completedServices,
  },
  {
    id: 'spent',
    label: 'Total Spent',
    value: '₹12,450',
    icon: ReceiptIndianRupee,
    route: CUSTOMER_DASHBOARD_ROUTES.payments,
  },
];

const QUICK_ACTIONS = [
  {
    id: 'book',
    label: 'Book New Service',
    icon: CalendarPlus,
    route: CUSTOMER_DASHBOARD_ROUTES.bookService,
  },
  {
    id: 'complaint',
    label: 'Raise a Complaint',
    icon: MessageSquareWarning,
    route: CUSTOMER_DASHBOARD_ROUTES.complaints,
  },
  {
    id: 'support',
    label: 'Contact Support',
    icon: Headphones,
    route: CUSTOMER_DASHBOARD_ROUTES.support,
  },
];

const RECENT_BOOKINGS = [
  {
    id: 'BK-2026-024',
    service: 'Termite Control',
    date: '12 Jul 2026',
    status: 'Completed',
    amount: '₹3,500',
  },
  {
    id: 'BK-2026-018',
    service: 'General Pest Control',
    date: '28 Jun 2026',
    status: 'Completed',
    amount: '₹1,800',
  },
  {
    id: 'BK-2026-012',
    service: 'Mosquito Control',
    date: '15 Jun 2026',
    status: 'Cancelled',
    amount: '₹1,200',
  },
];

const INITIAL_APPOINTMENT = {
  id: 'BK-2026-030',
  date: '2026-07-24',
  time: '10:30',
  service: 'Cockroach Control',
  property: 'Home • Pune, Maharashtra',
  technician: 'Rahul Patil',
  status: 'Confirmed',
};

function formatDateParts(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);

  return {
    day: new Intl.DateTimeFormat('en-IN', { day: '2-digit' }).format(date),
    month: new Intl.DateTimeFormat('en-IN', { month: 'short' })
      .format(date)
      .toUpperCase(),
    longDate: new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date),
  };
}

function formatTime(time) {
  const [hours, minutes] = time.split(':').map(Number);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

function StatusBadge({ status }) {
  const isCompleted = status === 'Completed';
  const Icon = isCompleted ? CircleCheck : CircleX;

  return (
    <span className={`cd-status cd-status--${status.toLowerCase()}`}>
      <Icon aria-hidden="true" size={16} strokeWidth={2.2} />
      {status}
    </span>
  );
}

function CustomerDashboard() {
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(INITIAL_APPOINTMENT);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleForm, setRescheduleForm] = useState({
    date: INITIAL_APPOINTMENT.date,
    time: INITIAL_APPOINTMENT.time,
    reason: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const closeButtonRef = useRef(null);
  const modalRef = useRef(null);
  const lastFocusedElementRef = useRef(null);

  const appointmentDate = useMemo(
    () => formatDateParts(appointment.date),
    [appointment.date],
  );

  const minDate = useMemo(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    return new Date(today.getTime() - offset * 60_000)
      .toISOString()
      .split('T')[0];
  }, []);

  useEffect(() => {
    if (!isRescheduleOpen) return undefined;

    lastFocusedElementRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsRescheduleOpen(false);
        return;
      }

      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled])',
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      lastFocusedElementRef.current?.focus?.();
    };
  }, [isRescheduleOpen]);

  useEffect(() => {
    if (!successMessage) return undefined;

    const timer = window.setTimeout(() => setSuccessMessage(''), 3500);
    return () => window.clearTimeout(timer);
  }, [successMessage]);

  const bookingDetailsRoute = (bookingId) =>
    `${CUSTOMER_DASHBOARD_ROUTES.bookings}/${bookingId}`;

  const openRescheduleModal = () => {
    setRescheduleForm({
      date: appointment.date,
      time: appointment.time,
      reason: '',
    });
    setFormErrors({});
    setIsRescheduleOpen(true);
  };

  const closeRescheduleModal = () => {
    setIsRescheduleOpen(false);
    setFormErrors({});
  };

  const handleRescheduleChange = (event) => {
    const { name, value } = event.target;
    setRescheduleForm((current) => ({ ...current, [name]: value }));
    setFormErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleRescheduleSubmit = (event) => {
    event.preventDefault();
    const errors = {};

    if (!rescheduleForm.date) errors.date = 'Please select a new date.';
    if (!rescheduleForm.time) errors.time = 'Please select a new time.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setAppointment((current) => ({
      ...current,
      date: rescheduleForm.date,
      time: rescheduleForm.time,
    }));
    setIsRescheduleOpen(false);
    setSuccessMessage('Appointment rescheduled successfully.');
  };

  return (
    <main className="customer-dashboard" aria-labelledby="customer-dashboard-title">
      {successMessage && (
        <div className="cd-toast" role="status" aria-live="polite">
          <CircleCheck aria-hidden="true" size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      <header className="cd-page-header">
        <div>
          <h1 id="customer-dashboard-title">Customer Dashboard</h1>
          <p>Manage your pest control services and appointments</p>
        </div>
        <button
          className="cd-button cd-button--primary cd-header-action"
          type="button"
          onClick={() => navigate(CUSTOMER_DASHBOARD_ROUTES.bookService)}
        >
          <CalendarPlus aria-hidden="true" size={20} />
          Book a Service
        </button>
      </header>

      <section className="cd-summary-grid" aria-label="Service summary">
        {SUMMARY_CARDS.map(({ id, label, value, icon: Icon, route }) => (
          <button
            className="cd-summary-card"
            type="button"
            key={id}
            onClick={() => navigate(route)}
            aria-label={`${label}: ${value}. View details`}
          >
            <span className="cd-icon-box">
              <Icon aria-hidden="true" size={28} strokeWidth={1.8} />
            </span>
            <span className="cd-summary-copy">
              <span className="cd-summary-label">{label}</span>
              <strong>{value}</strong>
            </span>
          </button>
        ))}
      </section>

      <section className="cd-primary-grid" aria-label="Appointment and quick actions">
        <article className="cd-card cd-appointment-card">
          <h2>Upcoming Appointment</h2>

          <div className="cd-appointment-body">
            <div className="cd-date-badge" aria-label={appointmentDate.longDate}>
              <strong>{appointmentDate.day}</strong>
              <span>{appointmentDate.month}</span>
            </div>

            <div className="cd-appointment-content">
              <h3>{appointment.service}</h3>
              <p className="cd-property-line">
                <Home aria-hidden="true" size={18} />
                {appointment.property}
              </p>

              <div className="cd-appointment-meta">
                <div className="cd-meta-item">
                  <Clock3 aria-hidden="true" size={21} />
                  <span>
                    <strong>{formatTime(appointment.time)}</strong>
                    <small>Time</small>
                  </span>
                </div>
                <div className="cd-meta-item">
                  <UserRound aria-hidden="true" size={21} />
                  <span>
                    <strong>{appointment.technician}</strong>
                    <small>Technician</small>
                  </span>
                </div>
                <div className="cd-meta-item">
                  <CircleCheck aria-hidden="true" size={21} />
                  <span>
                    <strong className="cd-confirmed-label">{appointment.status}</strong>
                    <small>Status</small>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="cd-appointment-actions">
            <button
              className="cd-button cd-button--outline"
              type="button"
              onClick={() => navigate(bookingDetailsRoute(appointment.id))}
            >
              View Details
              <ChevronRight aria-hidden="true" size={18} />
            </button>
            <button
              className="cd-button cd-button--secondary"
              type="button"
              onClick={openRescheduleModal}
            >
              <CalendarDays aria-hidden="true" size={18} />
              Reschedule
            </button>
          </div>
        </article>

        <article className="cd-card cd-quick-card">
          <h2>Quick Actions</h2>
          <div className="cd-quick-list">
            {QUICK_ACTIONS.map(({ id, label, icon: Icon, route }) => (
              <button
                className="cd-quick-action"
                type="button"
                key={id}
                onClick={() => navigate(route)}
              >
                <span className="cd-quick-icon">
                  <Icon aria-hidden="true" size={22} />
                </span>
                <span>{label}</span>
                <ChevronRight className="cd-quick-chevron" aria-hidden="true" size={20} />
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="cd-secondary-grid" aria-label="Recent bookings and support">
        <article className="cd-card cd-bookings-card">
          <div className="cd-card-header">
            <h2>Recent Bookings</h2>
            <button
              className="cd-text-button"
              type="button"
              onClick={() => navigate(CUSTOMER_DASHBOARD_ROUTES.bookings)}
            >
              View All Bookings
              <ChevronRight aria-hidden="true" size={18} />
            </button>
          </div>

          <div className="cd-table-wrapper">
            <table className="cd-bookings-table">
              <caption className="cd-visually-hidden">Three most recent pest control bookings</caption>
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_BOOKINGS.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.service}</td>
                    <td>{booking.date}</td>
                    <td><StatusBadge status={booking.status} /></td>
                    <td>{booking.amount}</td>
                    <td>
                      <button
                        className="cd-row-action"
                        type="button"
                        onClick={() => navigate(bookingDetailsRoute(booking.id))}
                        aria-label={`View ${booking.service} booking`}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cd-mobile-bookings">
            {RECENT_BOOKINGS.map((booking) => (
              <article className="cd-mobile-booking" key={booking.id}>
                <div className="cd-mobile-booking__header">
                  <div>
                    <h3>{booking.service}</h3>
                    <p>{booking.date}</p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
                <div className="cd-mobile-booking__footer">
                  <strong>{booking.amount}</strong>
                  <button
                    className="cd-row-action"
                    type="button"
                    onClick={() => navigate(bookingDetailsRoute(booking.id))}
                    aria-label={`View ${booking.service} booking`}
                  >
                    View
                    <ChevronRight aria-hidden="true" size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="cd-card cd-help-card">
          <div className="cd-help-copy">
            <h2>Need Help?</h2>
            <p>Our support team is ready to assist you.</p>
            <button
              className="cd-button cd-button--outline"
              type="button"
              onClick={() => navigate(CUSTOMER_DASHBOARD_ROUTES.support)}
            >
              <Headphones aria-hidden="true" size={19} />
              Contact Support
            </button>
          </div>
          <div className="cd-help-visual" aria-hidden="true">
            <ShieldCheck className="cd-help-shield" size={88} strokeWidth={1.4} />
            <Headphones className="cd-help-headphones" size={54} strokeWidth={1.7} />
          </div>
        </article>
      </section>

      {isRescheduleOpen && (
        <div
          className="cd-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeRescheduleModal();
          }}
        >
          <section
            className="cd-modal"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reschedule-modal-title"
            aria-describedby="reschedule-modal-description"
          >
            <header className="cd-modal-header">
              <div>
                <h2 id="reschedule-modal-title">Reschedule Appointment</h2>
                <p id="reschedule-modal-description">
                  Select a new date and time for your service.
                </p>
              </div>
              <button
                className="cd-icon-button"
                type="button"
                ref={closeButtonRef}
                onClick={closeRescheduleModal}
                aria-label="Close reschedule dialog"
              >
                <X aria-hidden="true" size={21} />
              </button>
            </header>

            <div className="cd-modal-summary">
              <span className="cd-icon-box cd-icon-box--small">
                <CalendarDays aria-hidden="true" size={21} />
              </span>
              <span>
                <strong>{appointment.service}</strong>
                <small>
                  Current: {appointmentDate.longDate} at {formatTime(appointment.time)}
                </small>
              </span>
            </div>

            <form className="cd-reschedule-form" onSubmit={handleRescheduleSubmit} noValidate>
              <div className="cd-form-grid">
                <div className="cd-field">
                  <label htmlFor="reschedule-date">New Date</label>
                  <input
                    id="reschedule-date"
                    type="date"
                    name="date"
                    min={minDate}
                    value={rescheduleForm.date}
                    onChange={handleRescheduleChange}
                    aria-invalid={Boolean(formErrors.date)}
                    aria-describedby={formErrors.date ? 'reschedule-date-error' : undefined}
                  />
                  {formErrors.date && (
                    <small className="cd-field-error" id="reschedule-date-error">
                      {formErrors.date}
                    </small>
                  )}
                </div>

                <div className="cd-field">
                  <label htmlFor="reschedule-time">New Time</label>
                  <input
                    id="reschedule-time"
                    type="time"
                    name="time"
                    value={rescheduleForm.time}
                    onChange={handleRescheduleChange}
                    aria-invalid={Boolean(formErrors.time)}
                    aria-describedby={formErrors.time ? 'reschedule-time-error' : undefined}
                  />
                  {formErrors.time && (
                    <small className="cd-field-error" id="reschedule-time-error">
                      {formErrors.time}
                    </small>
                  )}
                </div>
              </div>

              <div className="cd-field">
                <label htmlFor="reschedule-reason">Reason (optional)</label>
                <textarea
                  id="reschedule-reason"
                  name="reason"
                  rows="3"
                  placeholder="Tell us why you need to reschedule"
                  value={rescheduleForm.reason}
                  onChange={handleRescheduleChange}
                />
              </div>

              <div className="cd-modal-actions">
                <button
                  className="cd-button cd-button--secondary"
                  type="button"
                  onClick={closeRescheduleModal}
                >
                  Cancel
                </button>
                <button className="cd-button cd-button--primary" type="submit">
                  <CalendarPlus aria-hidden="true" size={18} />
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default CustomerDashboard;
