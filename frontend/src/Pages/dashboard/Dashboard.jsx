import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  ClipboardList,
  ClipboardCheck,
  IndianRupee,
  AlertCircle,
  Calendar,
  ArrowRight,
  ChevronRight,
  CalendarDays,
  Wallet,
  FileText,
  UserRound,
} from "lucide-react";

import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";

const BOOKING_ENDPOINTS = [
  "/admin/bookings/pending",
  "/admin/bookings/accepted",
  "/admin/bookings/assigned",
  "/admin/bookings/in-progress",
  "/admin/bookings/completed",
  "/admin/bookings/rejected",
];

const QUICK_ACCESS = [
  {
    id: "bookings",
    label: "Bookings",
    caption: "View and manage bookings",
    icon: CalendarDays,
    tone: "blue",
    path: "/admin/bookings",
  },
  {
    id: "services",
    label: "Services",
    caption: "Manage pest control services",
    icon: ClipboardCheck,
    tone: "green",
    path: "/admin/services",
  },
  {
    id: "technicians",
    label: "Technicians",
    caption: "View and manage technicians",
    icon: UserRound,
    tone: "purple",
    path: "/admin/technicians",
  },
  {
    id: "payments",
    label: "Payments",
    caption: "View customer payments",
    icon: Wallet,
    tone: "orange",
    path: "/admin/payments",
  },
  {
    id: "complaints",
    label: "Complaints",
    caption: "View customer complaints",
    icon: AlertCircle,
    tone: "red",
    path: "/admin/complaints",
  },
  {
    id: "reports",
    label: "Reports",
    caption: "View system reports",
    icon: FileText,
    tone: "blue",
    path: "/admin/reports",
  },
];

const AVATAR_TONES = [
  "ad-av-green",
  "ad-av-blue",
  "ad-av-orange",
  "ad-av-purple",
  "ad-av-teal",
];

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeStatus(value) {
  return String(value || "")
    .trim()
    .replaceAll("-", "_")
    .replaceAll(" ", "_")
    .toUpperCase();
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

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

function getDateTimestamp(value) {
  return parseDate(value)?.getTime() || 0;
}

function formatDate(value) {
  const date = parseDate(value);

  if (!date) {
    return "Not available";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value) {
  const date = parseDate(value);

  if (!date) {
    return "";
  }

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatBookingId(id) {
  if (id === null || id === undefined) {
    return "Not available";
  }

  return `BK-${String(id).padStart(4, "0")}`;
}

function formatBookingStatus(status) {
  const labels = {
    PENDING: "Pending",
    ACCEPTED: "Accepted",
    ASSIGNED: "Assigned",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    REJECTED: "Rejected",
  };

  const normalized = normalizeStatus(status);

  return (
    labels[normalized] ||
    String(status || "Unknown")
  );
}

function formatPaymentStatus(status) {
  const labels = {
    PAID: "Paid",
    PENDING: "Pending",
    FAILED: "Failed",
    REFUNDED: "Refunded",
    PARTIALLY_REFUNDED:
      "Partially Refunded",
  };

  const normalized = normalizeStatus(status);

  return (
    labels[normalized] ||
    String(status || "Unknown")
  );
}

function getInitials(name = "") {
  const generatedInitials = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return generatedInitials || "NA";
}

function getAvatarTone(name = "") {
  const characterTotal = String(name)
    .split("")
    .reduce(
      (total, character) =>
        total + character.charCodeAt(0),
      0
    );

  return AVATAR_TONES[
    characterTotal % AVATAR_TONES.length
  ];
}

function getPaymentCustomerName(payment) {
  return (
    payment.customerName ||
    payment.customer?.fullName ||
    payment.customer?.name ||
    "Customer"
  );
}

function getPaymentBookingNumber(payment) {
  if (payment.bookingNumber) {
    return payment.bookingNumber;
  }

  if (
    payment.bookingId !== null &&
    payment.bookingId !== undefined
  ) {
    return formatBookingId(
      payment.bookingId
    );
  }

  return "Not available";
}

function getPaymentTransactionId(payment) {
  return (
    payment.transactionId ||
    payment.referenceNumber ||
    `PAY-${String(
      payment.id || "NA"
    ).padStart(4, "0")}`
  );
}

function getPaymentDate(payment) {
  return (
    payment.createdAt ||
    payment.paymentDate ||
    payment.paidAt ||
    payment.updatedAt
  );
}

function getErrorMessage(error, fallback) {
  const data = error?.response?.data;

  if (
    typeof data === "string" &&
    data.trim()
  ) {
    return data;
  }

  if (data?.message) {
    return data.message;
  }

  if (data?.error) {
    return data.error;
  }

  if (!error?.response) {
    return "Unable to connect to the backend.";
  }

  return fallback;
}

function BookingStatusBadge({ status }) {
  const toneMap = {
    Completed: "ad-badge--success",
    "In Progress": "ad-badge--info",
    Pending: "ad-badge--warning",
    Accepted: "ad-badge--info",
    Assigned: "ad-badge--info",
    Cancelled: "ad-badge--danger",
    Rejected: "ad-badge--danger",
  };

  return (
    <span
      className={`ad-badge ${
        toneMap[status] ||
        "ad-badge--neutral"
      }`}
    >
      {status}
    </span>
  );
}

function PaymentStatusBadge({ status }) {
  const toneMap = {
    Paid: "ad-badge--success",
    Pending: "ad-badge--warning",
    Failed: "ad-badge--danger",
    Refunded: "ad-badge--neutral",
    "Partially Refunded":
      "ad-badge--info",
  };

  return (
    <span
      className={`ad-badge ${
        toneMap[status] ||
        "ad-badge--neutral"
      }`}
    >
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const [bookings, setBookings] =
    useState([]);

  const [services, setServices] =
    useState([]);

  const [payments, setPayments] =
    useState([]);

  const [complaints, setComplaints] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    dashboardError,
    setDashboardError,
  ] = useState("");

  const loadDashboard = useCallback(
    async () => {
      try {
        setLoading(true);
        setDashboardError("");

        const results =
          await Promise.allSettled([
            api.get("/admin/services"),
            api.get("/admin/payments"),
            api.get("/admin/complaints"),

            ...BOOKING_ENDPOINTS.map(
              (endpoint) =>
                api.get(endpoint)
            ),
          ]);

        const unauthorized =
          results.some(
            (result) =>
              result.status ===
                "rejected" &&
              result.reason?.response
                ?.status === 401
          );

        if (unauthorized) {
          logout();

          navigate("/login", {
            replace: true,
          });

          return;
        }

        const [
          servicesResult,
          paymentsResult,
          complaintsResult,
          ...bookingResults
        ] = results;

        const errors = [];

        if (
          servicesResult.status ===
          "fulfilled"
        ) {
          setServices(
            toArray(
              servicesResult.value.data
            )
          );
        } else {
          setServices([]);

          errors.push(
            getErrorMessage(
              servicesResult.reason,
              "Services could not be loaded."
            )
          );
        }

        if (
          paymentsResult.status ===
          "fulfilled"
        ) {
          setPayments(
            toArray(
              paymentsResult.value.data
            )
          );
        } else {
          setPayments([]);

          errors.push(
            getErrorMessage(
              paymentsResult.reason,
              "Payments could not be loaded."
            )
          );
        }

        if (
          complaintsResult.status ===
          "fulfilled"
        ) {
          setComplaints(
            toArray(
              complaintsResult.value.data
            )
          );
        } else {
          setComplaints([]);

          errors.push(
            getErrorMessage(
              complaintsResult.reason,
              "Complaints could not be loaded."
            )
          );
        }

        const successfulBookingResults =
          bookingResults.filter(
            (result) =>
              result.status ===
              "fulfilled"
          );

        if (
          successfulBookingResults.length ===
          0
        ) {
          setBookings([]);

          errors.push(
            "Bookings could not be loaded."
          );
        } else {
          const bookingMap = new Map();

          successfulBookingResults
            .flatMap((result) =>
              toArray(
                result.value.data
              )
            )
            .forEach((booking) => {
              const key =
                booking.id ??
                `${booking.status}-${booking.createdAt}`;

              bookingMap.set(
                String(key),
                booking
              );
            });

          setBookings([
            ...bookingMap.values(),
          ]);

          if (
            successfulBookingResults.length !==
            BOOKING_ENDPOINTS.length
          ) {
            errors.push(
              "Some booking categories could not be loaded."
            );
          }
        }

        setDashboardError(
          [...new Set(errors)].join(" ")
        );
      } catch (error) {
        setDashboardError(
          getErrorMessage(
            error,
            "Unable to load dashboard information."
          )
        );
      } finally {
        setLoading(false);
      }
    },
    [logout, navigate]
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const adminName =
    user?.fullName ||
    user?.name ||
    user?.username ||
    "Admin";

  const today = useMemo(() => {
    const currentDate = new Date();

    return {
      dateLabel:
        currentDate.toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        ),

      dayLabel:
        currentDate.toLocaleDateString(
          "en-IN",
          {
            weekday: "long",
          }
        ),
    };
  }, []);

  const totalRevenue = useMemo(() => {
    return payments.reduce(
      (total, payment) => {
        const status =
          normalizeStatus(
            payment.status
          );

        const amount = Number(
          payment.amount || 0
        );

        const refundedAmount = Number(
          payment.refundedAmount || 0
        );

        if (status === "PAID") {
          return total + amount;
        }

        if (
          status ===
          "PARTIALLY_REFUNDED"
        ) {
          return (
            total +
            Math.max(
              0,
              amount - refundedAmount
            )
          );
        }

        return total;
      },
      0
    );
  }, [payments]);

  const activeServicesCount =
    useMemo(() => {
      return services.filter(
        (service) => {
          const status =
            normalizeStatus(
              service.status
            );

          return (
            service.active !== false &&
            status !== "INACTIVE"
          );
        }
      ).length;
    }, [services]);

  const openComplaintsCount =
    useMemo(() => {
      const closedStatuses = new Set([
        "RESOLVED",
        "CLOSED",
        "REJECTED",
      ]);

      return complaints.filter(
        (complaint) =>
          !closedStatuses.has(
            normalizeStatus(
              complaint.status
            )
          )
      ).length;
    }, [complaints]);

  const stats = useMemo(
    () => [
      {
        id: "bookings",
        label: "Total Bookings",
        value: bookings.length,
        icon: ClipboardList,
        tone: "blue",
        linkLabel:
          "View all bookings",
        path: "/admin/bookings",
      },
      {
        id: "services",
        label: "Active Services",
        value: activeServicesCount,
        icon: ClipboardCheck,
        tone: "green",
        linkLabel:
          "View all services",
        path: "/admin/services",
      },
      {
        id: "payments",
        label: "Total Payments",
        value: payments.length,
        icon: Wallet,
        tone: "purple",
        linkLabel:
          "View all payments",
        path: "/admin/payments",
      },
      {
        id: "revenue",
        label: "Total Revenue",
        value:
          formatCurrency(
            totalRevenue
          ),
        icon: IndianRupee,
        tone: "orange",
        linkLabel: "View payments",
        path: "/admin/payments",
      },
      {
        id: "complaints",
        label: "Open Complaints",
        value: openComplaintsCount,
        icon: AlertCircle,
        tone: "red",
        linkLabel:
          "View complaints",
        path: "/admin/complaints",
      },
    ],
    [
      bookings.length,
      activeServicesCount,
      payments.length,
      totalRevenue,
      openComplaintsCount,
    ]
  );

  const recentBookings = useMemo(
    () => {
      return [...bookings]
        .sort((first, second) => {
          const secondDate =
            getDateTimestamp(
              second.updatedAt ||
                second.createdAt ||
                second.preferredDate
            );

          const firstDate =
            getDateTimestamp(
              first.updatedAt ||
                first.createdAt ||
                first.preferredDate
            );

          if (
            secondDate !== firstDate
          ) {
            return (
              secondDate - firstDate
            );
          }

          return (
            Number(second.id || 0) -
            Number(first.id || 0)
          );
        })
        .slice(0, 5)
        .map((booking) => ({
          rawId: booking.id,

          id: formatBookingId(
            booking.id
          ),

          customer:
            booking.customerName ||
            booking.customer?.fullName ||
            booking.customer?.name ||
            "Customer",

          service:
            booking.serviceName ||
            booking.service?.name ||
            "Pest Control Service",

          date: formatDate(
            booking.preferredDate ||
              booking.createdAt
          ),

          time:
            booking.preferredTimeSlot ||
            formatTime(
              booking.createdAt
            ) ||
            "Not selected",

          status:
            formatBookingStatus(
              booking.status
            ),
        }));
    },
    [bookings]
  );

  const recentPayments = useMemo(
    () => {
      return [...payments]
        .sort((first, second) => {
          return (
            getDateTimestamp(
              getPaymentDate(second)
            ) -
            getDateTimestamp(
              getPaymentDate(first)
            )
          );
        })
        .slice(0, 5)
        .map((payment) => ({
          rawId: payment.id,

          transactionId:
            getPaymentTransactionId(
              payment
            ),

          customer:
            getPaymentCustomerName(
              payment
            ),

          bookingId:
            getPaymentBookingNumber(
              payment
            ),

          bookingRawId:
            payment.bookingId,

          amount: formatCurrency(
            payment.amount
          ),

          status:
            formatPaymentStatus(
              payment.status
            ),

          date: formatDate(
            getPaymentDate(payment)
          ),
        }));
    },
    [payments]
  );

  const goTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const openBookingDetails = (
    booking
  ) => {
    if (!booking.rawId) {
      navigate("/admin/bookings");
      return;
    }

    sessionStorage.setItem(
      "pcmsSelectedBookingId",
      String(booking.rawId)
    );

    navigate(
      "/admin/bookings/details",
      {
        state: {
          bookingId: booking.rawId,
        },
      }
    );
  };

  const openPaymentDetails = (
    payment
  ) => {
    if (!payment.rawId) {
      navigate("/admin/payments");
      return;
    }

    sessionStorage.setItem(
      "pcmsAdminPaymentId",
      String(payment.rawId)
    );

    sessionStorage.setItem(
      "pcmsAdminTransactionId",
      payment.transactionId
    );

    navigate(
      "/admin/payments/details",
      {
        state: {
          paymentId: payment.rawId,
          transactionId:
            payment.transactionId,
        },
      }
    );
  };

  return (
    <main className="ad-page">
      <header className="ad-header">
        <div className="ad-header__content">
          <h1 className="ad-welcome">
            Welcome back, {adminName}!

            <span
              className="ad-wave"
              role="img"
              aria-label="Waving hand"
            >
              👋
            </span>
          </h1>

          <p className="ad-subtitle">
            Here&apos;s what&apos;s
            happening with your pest
            control business today.
          </p>
        </div>

        <div className="ad-date-card">
          <span className="ad-date-icon">
            <Calendar
              size={18}
              strokeWidth={2}
            />
          </span>

          <div>
            <p className="ad-date-value">
              {today.dateLabel}
            </p>

            <p className="ad-date-day">
              {today.dayLabel}
            </p>
          </div>
        </div>
      </header>

      {dashboardError && (
        <div
          className="ad-dashboard-message"
          role="alert"
        >
          <AlertCircle
            size={18}
            strokeWidth={2}
          />

          <span>{dashboardError}</span>

          <button
            type="button"
            onClick={loadDashboard}
          >
            Retry
          </button>
        </div>
      )}

      <section
        className="ad-stats"
        aria-label="Dashboard statistics"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              className="ad-card ad-stat-card"
              key={stat.id}
            >
              <span
                className={`ad-stat-icon ad-stat-icon--${stat.tone}`}
              >
                <Icon
                  size={22}
                  strokeWidth={2}
                />
              </span>

              <div className="ad-stat-body">
                <p className="ad-stat-label">
                  {stat.label}
                </p>

                <p className="ad-stat-value">
                  {loading
                    ? "—"
                    : stat.value}
                </p>

                <button
                  type="button"
                  className={`ad-stat-link ad-stat-link--${stat.tone}`}
                  onClick={() =>
                    goTo(stat.path)
                  }
                >
                  {stat.linkLabel}

                  <ArrowRight
                    size={13}
                    strokeWidth={2}
                  />
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <div className="ad-twocol">
        <section className="ad-card ad-table-card">
          <div className="ad-card__header">
            <h2>Recent Bookings</h2>

            <button
              type="button"
              className="ad-btn ad-btn--outline ad-btn--sm"
              onClick={() =>
                goTo("/admin/bookings")
              }
            >
              View All Bookings
            </button>
          </div>

          <div className="ad-table-wrap">
            <table className="ad-table ad-bookings-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer Name</th>
                  <th>Service Type</th>
                  <th>Date &amp; Time</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="ad-table-empty"
                    >
                      Loading bookings...
                    </td>
                  </tr>
                ) : recentBookings.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="ad-table-empty"
                    >
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  recentBookings.map(
                    (booking) => (
                      <tr
                        key={
                          booking.rawId ||
                          booking.id
                        }
                        className="ad-table__row"
                        tabIndex={0}
                        onClick={() =>
                          openBookingDetails(
                            booking
                          )
                        }
                        onKeyDown={(
                          event
                        ) => {
                          if (
                            event.key ===
                              "Enter" ||
                            event.key === " "
                          ) {
                            event.preventDefault();

                            openBookingDetails(
                              booking
                            );
                          }
                        }}
                      >
                        <td className="ad-table__id">
                          {booking.id}
                        </td>

                        <td>
                          <div className="ad-customer">
                            <span
                              className={`ad-avatar ${getAvatarTone(
                                booking.customer
                              )}`}
                            >
                              {getInitials(
                                booking.customer
                              )}
                            </span>

                            <span className="ad-customer__name">
                              {
                                booking.customer
                              }
                            </span>
                          </div>
                        </td>

                        <td>
                          {booking.service}
                        </td>

                        <td>
                          <div className="ad-datetime">
                            <Calendar
                              size={13}
                              strokeWidth={2}
                            />

                            <div>
                              <p>
                                {
                                  booking.date
                                }
                              </p>

                              <span>
                                {
                                  booking.time
                                }
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <BookingStatusBadge
                            status={
                              booking.status
                            }
                          />
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ad-card ad-table-card">
          <div className="ad-card__header">
            <h2>Recent Payments</h2>

            <button
              type="button"
              className="ad-btn ad-btn--outline ad-btn--sm"
              onClick={() =>
                goTo("/admin/payments")
              }
            >
              View All Payments
            </button>
          </div>

          <div className="ad-table-wrap">
            <table className="ad-table ad-payments-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Customer Name</th>
                  <th>Booking ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="ad-table-empty"
                    >
                      Loading payments...
                    </td>
                  </tr>
                ) : recentPayments.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="ad-table-empty"
                    >
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  recentPayments.map(
                    (payment) => (
                      <tr
                        key={
                          payment.rawId ||
                          payment.transactionId
                        }
                        className="ad-table__row"
                        tabIndex={0}
                        onClick={() =>
                          openPaymentDetails(
                            payment
                          )
                        }
                        onKeyDown={(
                          event
                        ) => {
                          if (
                            event.key ===
                              "Enter" ||
                            event.key === " "
                          ) {
                            event.preventDefault();

                            openPaymentDetails(
                              payment
                            );
                          }
                        }}
                      >
                        <td className="ad-table__id">
                          {
                            payment.transactionId
                          }
                        </td>

                        <td>
                          {payment.customer}
                        </td>

                        <td>
                          {payment.bookingId}
                        </td>

                        <td className="ad-table__amount">
                          {payment.amount}
                        </td>

                        <td>
                          <PaymentStatusBadge
                            status={
                              payment.status
                            }
                          />
                        </td>

                        <td>
                          {payment.date}
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

      <section className="ad-card ad-quickaccess-card">
        <div className="ad-card__header">
          <h2>Quick Access</h2>
        </div>

        <div className="ad-quickaccess-grid">
          {QUICK_ACCESS.map(
            (item) => {
              const Icon = item.icon;

              return (
                <button
                  type="button"
                  className="ad-quickaccess"
                  key={item.id}
                  onClick={() =>
                    goTo(item.path)
                  }
                >
                  <span
                    className={`ad-quickaccess__icon ad-quickaccess__icon--${item.tone}`}
                  >
                    <Icon
                      size={22}
                      strokeWidth={2}
                    />
                  </span>

                  <span className="ad-quickaccess__text">
                    <span className="ad-quickaccess__label">
                      {item.label}
                    </span>

                    <span className="ad-quickaccess__caption">
                      {item.caption}
                    </span>
                  </span>

                  <ChevronRight
                    size={18}
                    strokeWidth={2}
                    className="ad-quickaccess__chevron"
                  />
                </button>
              );
            }
          )}
        </div>
      </section>
    </main>
  );
}