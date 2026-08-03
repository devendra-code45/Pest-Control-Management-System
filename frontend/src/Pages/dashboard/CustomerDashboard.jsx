import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  History,
  ClipboardCheck,
  CreditCard,
  MapPin,
  Clock,
  User,
  ArrowRight,
  Plus,
  FileText,
  Wallet,
  Headphones,
  Zap,
} from "lucide-react";

import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./CustomerDashboard.css";

const DEFAULT_CUSTOMER_NAME = "Customer";

const UPCOMING_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "ASSIGNED",
];

const QUICK_ACTIONS = [
  {
    id: "book",
    label: "Book a Service",
    icon: Plus,
    tone: "green",
    path: "/customer/create-booking",
  },
  {
    id: "bookings",
    label: "My Bookings",
    icon: FileText,
    tone: "blue",
    path: "/customer/bookings",
  },
  {
    id: "payments",
    label: "Payment History",
    icon: Wallet,
    tone: "purple",
    path: "/customer/payments",
  },
  {
    id: "support",
    label: "Help & Support",
    icon: Headphones,
    tone: "pink",
    path: "/customer/contact-support",
  },
];

function parseDate(value) {
  if (!value) {
    return null;
  }

  const date =
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(`${value}T00:00:00`)
      : new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

function formatDate(value) {
  const date = parseDate(value);

  if (!date) {
    return "Not scheduled";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));
}

function formatBookingId(id) {
  return `BK-${String(id).padStart(4, "0")}`;
}

function getDisplayStatus(status) {
  const statuses = {
    PENDING: "Pending",
    ACCEPTED: "Accepted",
    ASSIGNED: "Assigned",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    REJECTED: "Rejected",
  };

  return statuses[status] || status || "Pending";
}

function getRelativeDate(value) {
  const serviceDate = parseDate(value);

  if (!serviceDate) {
    return "Scheduled";
  }

  serviceDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const difference = Math.round(
    (serviceDate.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (difference === 0) {
    return "Today";
  }

  if (difference === 1) {
    return "Tomorrow";
  }

  if (difference > 1) {
    return `In ${difference} days`;
  }

  return "Scheduled";
}

function getAddress(booking) {
  return [
    booking.serviceAddress,
    booking.city,
    booking.pincode,
  ]
    .filter(Boolean)
    .join(", ");
}

function StatusBadge({ status }) {
  const toneMap = {
    Pending: "cd-badge--warning",
    Accepted: "cd-badge--info",
    Assigned: "cd-badge--info",
    "In Progress": "cd-badge--info",
    Completed: "cd-badge--success",
    Cancelled: "cd-badge--danger",
    Rejected: "cd-badge--danger",
  };

  return (
    <span
      className={`cd-badge ${
        toneMap[status] ||
        "cd-badge--neutral"
      }`}
    >
      {status}
    </span>
  );
}

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] =
    useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setDashboardError("");

        const results =
          await Promise.allSettled([
            api.get("/users/profile"),
            api.get("/customer/bookings"),
            api.get("/customer/payments"),
          ]);

        const [
          profileResult,
          bookingsResult,
          paymentsResult,
        ] = results;

        const unauthorized = results.some(
          (result) =>
            result.status === "rejected" &&
            result.reason?.response?.status === 401
        );

        if (unauthorized) {
          logout();
          navigate("/login", {
            replace: true,
          });
          return;
        }

        const errors = [];

        if (
          profileResult.status === "fulfilled"
        ) {
          setProfile(
            profileResult.value.data || null
          );
        } else {
          errors.push(
            "Customer profile could not be loaded."
          );
        }

        if (
          bookingsResult.status === "fulfilled"
        ) {
          setBookings(
            Array.isArray(
              bookingsResult.value.data
            )
              ? bookingsResult.value.data
              : []
          );
        } else {
          setBookings([]);

          errors.push(
            bookingsResult.reason?.response
              ?.status === 403
              ? "You do not have permission to load bookings."
              : "Bookings could not be loaded."
          );
        }

        if (
          paymentsResult.status === "fulfilled"
        ) {
          setPayments(
            Array.isArray(
              paymentsResult.value.data
            )
              ? paymentsResult.value.data
              : []
          );
        } else {
          setPayments([]);

          errors.push(
            "Payment information could not be loaded."
          );
        }

        setDashboardError(errors.join(" "));
      } catch (error) {
        setDashboardError(
          "Unable to load dashboard information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [logout, navigate]);

  const customerName =
    profile?.fullName ||
    auth?.user?.fullName ||
    auth?.fullName ||
    DEFAULT_CUSTOMER_NAME;

  const firstName = useMemo(() => {
    return (
      customerName
        .trim()
        .split(/\s+/)[0] ||
      DEFAULT_CUSTOMER_NAME
    );
  }, [customerName]);

  const stats = useMemo(() => {
    const upcomingCount = bookings.filter(
      (booking) =>
        UPCOMING_STATUSES.includes(
          booking.status
        )
    ).length;

    const completedCount = bookings.filter(
      (booking) =>
        booking.status === "COMPLETED"
    ).length;

    const totalSpent = payments
      .filter(
        (payment) =>
          payment.status === "PAID"
      )
      .reduce(
        (sum, payment) =>
          sum +
          Number(payment.amount || 0),
        0
      );

    return [
      {
        id: "bookings",
        label: "Total Bookings",
        value: String(bookings.length),
        icon: Calendar,
        tone: "green",
        linkLabel: "View all bookings",
        path: "/customer/bookings",
      },
      {
        id: "upcoming",
        label: "Upcoming Services",
        value: String(upcomingCount),
        icon: History,
        tone: "blue",
        linkLabel: "View upcoming",
        path: "/customer/bookings",
      },
      {
        id: "completed",
        label: "Completed Services",
        value: String(completedCount),
        icon: ClipboardCheck,
        tone: "orange",
        linkLabel: "View history",
        path: "/customer/bookings",
      },
      {
        id: "spent",
        label: "Total Spent",
        value: formatCurrency(totalSpent),
        icon: CreditCard,
        tone: "purple",
        linkLabel: "View payments",
        path: "/customer/payments",
      },
    ];
  }, [bookings, payments]);

  const upcomingService = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeBookings = bookings.filter(
      (booking) =>
        UPCOMING_STATUSES.includes(
          booking.status
        )
    );

    const futureBookings =
      activeBookings.filter((booking) => {
        const date = parseDate(
          booking.preferredDate
        );

        return !date || date >= today;
      });

    const availableBookings =
      futureBookings.length > 0
        ? futureBookings
        : activeBookings;

    const sortedBookings = [
      ...availableBookings,
    ].sort((first, second) => {
      const firstDate = parseDate(
        first.preferredDate
      );

      const secondDate = parseDate(
        second.preferredDate
      );

      if (!firstDate && !secondDate) {
        return Number(first.id) -
          Number(second.id);
      }

      if (!firstDate) {
        return 1;
      }

      if (!secondDate) {
        return -1;
      }

      return (
        firstDate.getTime() -
        secondDate.getTime()
      );
    });

    const booking =
      sortedBookings[0] || null;

    if (!booking) {
      return null;
    }

    const date = parseDate(
      booking.preferredDate
    );

    return {
      rawId: booking.id,
      day: date
        ? date.toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
            }
          )
        : "--",
      month: date
        ? date.toLocaleDateString(
            "en-IN",
            {
              month: "short",
              year: "numeric",
            }
          )
        : "Not scheduled",
      relative: getRelativeDate(
        booking.preferredDate
      ),
      service:
        booking.serviceName ||
        "Pest Control Service",
      address:
        getAddress(booking) ||
        "Address not available",
      time:
        booking.preferredTimeSlot ||
        "Time not selected",
      technician:
        booking.technicianName ||
        "Not assigned",
      status: getDisplayStatus(
        booking.status
      ),
    };
  }, [bookings]);

  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort((first, second) => {
        const firstCreated =
          parseDate(first.createdAt)
            ?.getTime() || 0;

        const secondCreated =
          parseDate(second.createdAt)
            ?.getTime() || 0;

        if (
          firstCreated !== secondCreated
        ) {
          return (
            secondCreated - firstCreated
          );
        }

        return (
          Number(second.id) -
          Number(first.id)
        );
      })
      .slice(0, 4)
      .map((booking) => {
        const matchingPayment =
          payments.find(
            (payment) =>
              Number(payment.bookingId) ===
              Number(booking.id)
          );

        return {
          rawId: booking.id,
          id: formatBookingId(
            booking.id
          ),
          service:
            booking.serviceName ||
            "Pest Control Service",
          date: formatDate(
            booking.preferredDate
          ),
          status: getDisplayStatus(
            booking.status
          ),
          amount: formatCurrency(
            booking.totalAmount ??
              matchingPayment?.amount ??
              0
          ),
        };
      });
  }, [bookings, payments]);

  const goTo = (path) => {
    navigate(path);
  };

  const openBookingDetails = (
    bookingId
  ) => {
    sessionStorage.setItem(
      "pcmsCustomerBookingId",
      String(bookingId)
    );

    navigate(
      "/customer/bookings/details",
      {
        state: {
          bookingId,
          action: "view",
        },
      }
    );
  };

  return (
    <div className="cd-page">
      <div className="cd-welcome">
        <p className="cd-welcome__eyebrow">
          Welcome back,
        </p>

        <h1 className="cd-welcome__name">
          {loading
            ? "Loading..."
            : firstName}
          {!loading && (
            <span
              className="cd-wave"
              role="img"
              aria-label="Waving hand"
            >
              👋
            </span>
          )}
        </h1>

        <p className="cd-welcome__subtitle">
          Here&apos;s what&apos;s happening
          with your pest control services.
        </p>

        {dashboardError && (
          <p className="cd-dashboard-error">
            {dashboardError}
          </p>
        )}
      </div>

      <div className="cd-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              className="cd-card cd-stat-card"
              key={stat.id}
            >
              <span
                className={`cd-stat-icon cd-stat-icon--${stat.tone}`}
              >
                <Icon size={22} />
              </span>

              <div className="cd-stat-body">
                <p className="cd-stat-label">
                  {stat.label}
                </p>

                <p
                  className={`cd-stat-value cd-stat-value--${stat.tone}`}
                >
                  {loading
                    ? "—"
                    : stat.value}
                </p>

                <button
                  type="button"
                  className="cd-stat-link"
                  onClick={() =>
                    goTo(stat.path)
                  }
                >
                  {stat.linkLabel}
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cd-twocol">
        <section className="cd-card cd-upcoming-card">
          <div className="cd-card__header">
            <div className="cd-card__title">
              <Calendar
                size={18}
                className="cd-card__title-icon"
              />

              <h3>Upcoming Service</h3>
            </div>
          </div>

          {loading ? (
            <div className="cd-upcoming-panel cd-upcoming-panel--empty">
              <p className="cd-empty-message">
                Loading upcoming service...
              </p>
            </div>
          ) : upcomingService ? (
            <>
              <div className="cd-upcoming-panel">
                <div className="cd-upcoming-date">
                  <span className="cd-upcoming-date__day">
                    {upcomingService.day}
                  </span>

                  <span className="cd-upcoming-date__month">
                    {upcomingService.month}
                  </span>

                  <span className="cd-badge cd-badge--success cd-upcoming-date__tag">
                    {
                      upcomingService.relative
                    }
                  </span>
                </div>

                <div className="cd-upcoming-details">
                  <h4>
                    {upcomingService.service}
                  </h4>

                  <p className="cd-upcoming-row">
                    <MapPin size={15} />
                    {upcomingService.address}
                  </p>

                  <p className="cd-upcoming-row">
                    <Clock size={15} />
                    {upcomingService.time}
                  </p>

                  <div className="cd-upcoming-footer">
                    <p className="cd-upcoming-row cd-upcoming-row--tech">
                      <User size={15} />
                      Technician:
                      <b>
                        {
                          upcomingService.technician
                        }
                      </b>
                    </p>

                    <StatusBadge
                      status={
                        upcomingService.status
                      }
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="cd-text-link"
                onClick={() =>
                  goTo(
                    "/customer/bookings"
                  )
                }
              >
                View all upcoming services
                <ArrowRight size={14} />
              </button>
            </>
          ) : (
            <div className="cd-upcoming-panel cd-upcoming-panel--empty">
              <p className="cd-empty-message">
                No upcoming service is
                scheduled.
              </p>
            </div>
          )}
        </section>

        <section className="cd-card cd-bookings-card">
          <div className="cd-card__header">
            <div className="cd-card__title">
              <FileText
                size={18}
                className="cd-card__title-icon"
              />

              <h3>Recent Bookings</h3>
            </div>

            <button
              type="button"
              className="cd-text-link cd-text-link--inline"
              onClick={() =>
                goTo("/customer/bookings")
              }
            >
              View all bookings
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="cd-table-wrap">
            <table className="cd-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="cd-table-empty"
                    >
                      Loading bookings...
                    </td>
                  </tr>
                ) : recentBookings.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="cd-table-empty"
                    >
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  recentBookings.map(
                    (booking) => (
                      <tr
                        key={booking.rawId}
                        className="cd-table__row"
                        onClick={() =>
                          openBookingDetails(
                            booking.rawId
                          )
                        }
                      >
                        <td className="cd-table__id">
                          {booking.id}
                        </td>

                        <td>
                          {booking.service}
                        </td>

                        <td>
                          {booking.date}
                        </td>

                        <td>
                          <StatusBadge
                            status={
                              booking.status
                            }
                          />
                        </td>

                        <td className="cd-table__amount">
                          {booking.amount}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="cd-bottomrow">
        <section className="cd-card cd-quickactions-card">
          <div className="cd-card__header">
            <div className="cd-card__title">
              <Zap
                size={18}
                className="cd-card__title-icon"
              />

              <h3>Quick Actions</h3>
            </div>
          </div>

          <div className="cd-quickactions-grid">
            {QUICK_ACTIONS.map(
              (action) => {
                const Icon = action.icon;

                return (
                  <button
                    type="button"
                    key={action.id}
                    className="cd-quickaction"
                    onClick={() =>
                      goTo(action.path)
                    }
                  >
                    <span
                      className={`cd-quickaction__icon cd-quickaction__icon--${action.tone}`}
                    >
                      <Icon size={20} />
                    </span>

                    <span className="cd-quickaction__label">
                      {action.label}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </section>

        <section className="cd-card cd-help-card">
          <span className="cd-help-icon">
            <Headphones size={22} />
          </span>

          <h3>Need Help?</h3>

          <p>
            Our support team is here to help
            you with any queries.
          </p>

          <button
            type="button"
            className="cd-btn cd-btn--outline"
            onClick={() =>
              goTo(
                "/customer/contact-support"
              )
            }
          >
            Contact Support
            <ArrowRight size={15} />
          </button>
        </section>
      </div>
    </div>
  );
}