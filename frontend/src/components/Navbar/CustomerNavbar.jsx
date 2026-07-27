import { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  UserCircle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function useBreadcrumb(pathname) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [
      {
        label: "Customer",
        path: "/customer/dashboard",
      },
    ];
  }

  return segments.map((segment, index) => ({
    label: segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (character) =>
        character.toUpperCase()
      ),

    path:
      "/" +
      segments.slice(0, index + 1).join("/"),
  }));
}

export default function CustomerNavbar({
  user,
  notificationCount = 3,
  onMenuClick,
  onLogout,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  const crumbs = useBreadcrumb(location.pathname);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const loggedInUser = user || auth?.user || {};

  const customerUser = {
    name:
      loggedInUser.fullName ||
      loggedInUser.name ||
      "Customer",

    role:
      loggedInUser.role === "CUSTOMER"
        ? "Customer"
        : loggedInUser.role || "Customer",

    avatarUrl:
      loggedInUser.profileImage ||
      loggedInUser.avatarUrl ||
      "",
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    setProfileOpen(false);
    setNotificationOpen(false);
  }, [location.pathname]);

  const initials = customerUser.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    setProfileOpen(false);
    setNotificationOpen(false);

    logout();

    if (typeof onLogout === "function") {
      onLogout();
    }

    navigate("/login", { replace: true });
  };

  return (
    <header className="nb-navbar">
      <div className="nb-left">
        <button
          type="button"
          className="nb-menu-btn"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <nav
          className="nb-breadcrumb"
          aria-label="Breadcrumb"
        >
          {crumbs.map((crumb, index) => (
            <span
              className="nb-crumb-wrap"
              key={crumb.path}
            >
              {index > 0 && (
                <span className="nb-crumb-sep">
                  /
                </span>
              )}

              {index === crumbs.length - 1 ? (
                <span className="nb-crumb nb-crumb-current">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="nb-crumb"
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      <div className="nb-right">
        <div
          className="nb-notification-wrapper"
          ref={notificationRef}
        >
          <button
            type="button"
            className="nb-icon-btn"
            aria-label="Customer notifications"
            onClick={() => {
              setNotificationOpen(
                (current) => !current
              );

              setProfileOpen(false);
            }}
          >
            <Bell size={18} />

            {notificationCount > 0 && (
              <span className="nb-badge">
                {notificationCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div className="nb-notification-dropdown">
              <div className="nb-notification-header">
                <strong>Notifications</strong>

                <button type="button">
                  Mark all as read
                </button>
              </div>

              <div className="nb-notification-item unread">
                <span className="nb-notification-dot" />

                <div>
                  <strong>
                    Booking Confirmed
                  </strong>

                  <p>
                    Your booking has been confirmed.
                  </p>

                  <small>5 minutes ago</small>
                </div>
              </div>

              <div className="nb-notification-item unread">
                <span className="nb-notification-dot blue" />

                <div>
                  <strong>
                    Technician Assigned
                  </strong>

                  <p>
                    A technician was assigned to
                    your booking.
                  </p>

                  <small>20 minutes ago</small>
                </div>
              </div>

              <div className="nb-notification-item">
                <span className="nb-notification-dot orange" />

                <div>
                  <strong>
                    Payment Successful
                  </strong>

                  <p>
                    Your payment was completed
                    successfully.
                  </p>

                  <small>1 hour ago</small>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="nb-divider" />

        <div
          className="nb-profile"
          ref={profileRef}
        >
          <button
            type="button"
            className="nb-profile-trigger"
            onClick={() => {
              setProfileOpen(
                (current) => !current
              );

              setNotificationOpen(false);
            }}
            aria-haspopup="true"
            aria-expanded={profileOpen}
          >
            {customerUser.avatarUrl ? (
              <img
                src={customerUser.avatarUrl}
                alt={customerUser.name}
                className="nb-avatar"
              />
            ) : (
              <span className="nb-avatar nb-avatar-fallback">
                {initials || "CU"}
              </span>
            )}

            <span className="nb-user-info">
              <span className="nb-user-name">
                {customerUser.name}
              </span>

              <span className="nb-user-role">
                {customerUser.role}
              </span>
            </span>

            <ChevronDown
              size={16}
              className={`nb-chevron ${
                profileOpen
                  ? "nb-chevron-open"
                  : ""
              }`}
            />
          </button>

          {profileOpen && (
            <div className="nb-dropdown">
              <Link
                to="/customer/profile"
                className="nb-dropdown-item"
                onClick={() =>
                  setProfileOpen(false)
                }
              >
                <UserCircle size={16} />
                My Profile
              </Link>

              <div className="nb-dropdown-sep" />

              <button
                type="button"
                className="nb-dropdown-item nb-dropdown-danger"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}