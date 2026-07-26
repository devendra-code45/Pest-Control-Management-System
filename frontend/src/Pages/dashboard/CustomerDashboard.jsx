import React, { useEffect, useMemo, useState } from "react";
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

const STATS = [
  {
    id: "bookings",
    label: "Total Bookings",
    value: "12",
    icon: Calendar,
    tone: "green",
    linkLabel: "View all bookings",
    path: "/customer/bookings",
  },
  {
    id: "upcoming",
    label: "Upcoming Services",
    value: "3",
    icon: History,
    tone: "blue",
    linkLabel: "View upcoming",
    path: "/customer/bookings?filter=upcoming",
  },
  {
    id: "completed",
    label: "Completed Services",
    value: "8",
    icon: ClipboardCheck,
    tone: "orange",
    linkLabel: "View history",
    path: "/customer/bookings?filter=completed",
  },
  {
    id: "spent",
    label: "Total Spent",
    value: "₹8,450",
    icon: CreditCard,
    tone: "purple",
    linkLabel: "View payments",
    path: "/customer/payments",
  },
];

const RECENT_BOOKINGS = [
  {
    id: "BK-2025-0012",
    service: "General Pest Control",
    date: "25 May 2025",
    status: "Confirmed",
    amount: "₹1,299",
  },
  {
    id: "BK-2025-0011",
    service: "Termite Inspection",
    date: "18 May 2025",
    status: "Completed",
    amount: "₹999",
  },
  {
    id: "BK-2025-0010",
    service: "Cockroach Control",
    date: "10 May 2025",
    status: "Completed",
    amount: "₹799",
  },
  {
    id: "BK-2025-0009",
    service: "Rodent Control",
    date: "02 May 2025",
    status: "Cancelled",
    amount: "₹699",
  },
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

const UPCOMING_SERVICE = {
  day: "25",
  month: "May 2025",
  relative: "Tomorrow",
  service: "General Pest Control",
  address: "302, Green Valley Apartments, Baner, Pune - 411045",
  time: "10:30 AM - 11:30 AM",
  technician: "Amit Patil",
  status: "Confirmed",
};

function StatusBadge({ status }) {
  const toneMap = {
    Confirmed: "cd-badge--success",
    Completed: "cd-badge--success",
    Pending: "cd-badge--warning",
    "In Progress": "cd-badge--info",
    Cancelled: "cd-badge--danger",
  };

  return (
    <span
      className={`cd-badge ${
        toneMap[status] || "cd-badge--neutral"
      }`}
    >
      {status}
    </span>
  );
}

export default function CustomerDashboard({
  stats = STATS,
  recentBookings = RECENT_BOOKINGS,
  upcomingService = UPCOMING_SERVICE,
  quickActions = QUICK_ACTIONS,
}) {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      try {
        setProfileLoading(true);
        setProfileError("");

        const response = await api.get("/users/profile");

        setProfile(response.data);
      } catch (error) {
        const status = error.response?.status;

        if (status === 401 || status === 403) {
          logout();
          navigate("/login", { replace: true });
          return;
        }

        setProfileError("Unable to load customer information.");
      } finally {
        setProfileLoading(false);
      }
    };

    fetchCustomerProfile();
  }, []);

  const customerName =
    profile?.fullName ||
    auth?.user?.fullName ||
    DEFAULT_CUSTOMER_NAME;

  const firstName = useMemo(() => {
    return customerName.trim().split(/\s+/)[0] || DEFAULT_CUSTOMER_NAME;
  }, [customerName]);

  const goTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="cd-page">
      {/* Welcome header */}
      <div className="cd-welcome">
        <p className="cd-welcome__eyebrow">Welcome back,</p>

        <h1 className="cd-welcome__name">
          {profileLoading ? "Loading..." : firstName}!{" "}
          {!profileLoading && (
            <span
              className="cd-wave"
              role="img"
              aria-label="waving hand"
            >
              👋
            </span>
          )}
        </h1>

        <p className="cd-welcome__subtitle">
          Here&apos;s what&apos;s happening with your pest control services.
        </p>

        {profileError && (
          <p className="cd-dashboard-error">{profileError}</p>
        )}
      </div>

      {/* Stat cards */}
      <div className="cd-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="cd-card cd-stat-card" key={stat.id}>
              <span
                className={`cd-stat-icon cd-stat-icon--${stat.tone}`}
              >
                <Icon size={22} />
              </span>

              <div className="cd-stat-body">
                <p className="cd-stat-label">{stat.label}</p>

                <p
                  className={`cd-stat-value cd-stat-value--${stat.tone}`}
                >
                  {stat.value}
                </p>

                <button
                  type="button"
                  className="cd-stat-link"
                  onClick={() => goTo(stat.path)}
                >
                  {stat.linkLabel}
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming service and recent bookings */}
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

          <div className="cd-upcoming-panel">
            <div className="cd-upcoming-date">
              <span className="cd-upcoming-date__day">
                {upcomingService.day}
              </span>

              <span className="cd-upcoming-date__month">
                {upcomingService.month}
              </span>

              <span className="cd-badge cd-badge--success cd-upcoming-date__tag">
                {upcomingService.relative}
              </span>
            </div>

            <div className="cd-upcoming-details">
              <h4>{upcomingService.service}</h4>

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
                  Technician: <b>{upcomingService.technician}</b>
                </p>

                <StatusBadge status={upcomingService.status} />
              </div>
            </div>
          </div>

          <button
            type="button"
            className="cd-text-link"
            onClick={() =>
              goTo("/customer/bookings?filter=upcoming")
            }
          >
            View all upcoming services
            <ArrowRight size={14} />
          </button>
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
              onClick={() => goTo("/customer/bookings")}
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
                {recentBookings.map((row) => (
                  <tr
                    key={row.id}
                    className="cd-table__row"
                    onClick={() =>
                      goTo(`/customer/bookings/${row.id}`)
                    }
                  >
                    <td className="cd-table__id">{row.id}</td>
                    <td>{row.service}</td>
                    <td>{row.date}</td>

                    <td>
                      <StatusBadge status={row.status} />
                    </td>

                    <td className="cd-table__amount">
                      {row.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Quick actions and support */}
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
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  type="button"
                  key={action.id}
                  className="cd-quickaction"
                  onClick={() => goTo(action.path)}
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
            })}
          </div>
        </section>

        <section className="cd-card cd-help-card">
          <span className="cd-help-icon">
            <Headphones size={22} />
          </span>

          <h3>Need Help?</h3>

          <p>
            Our support team is here to help you with any queries.
          </p>

          <button
            type="button"
            className="cd-btn cd-btn--outline"
            onClick={() =>
              goTo("/customer/contact-support")
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