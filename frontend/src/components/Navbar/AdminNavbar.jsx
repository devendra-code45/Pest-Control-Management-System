import {
  useEffect,
  useRef,
  useState,
} from "react";

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

import NotificationDropdown from "./NotificationDropdown";
import "./Navbar.css";

function useBreadcrumb(pathname) {
  const segments = pathname
    .split("/")
    .filter(Boolean);

  if (segments.length === 0) {
    return [
      {
        label: "Admin",
        path: "/admin/dashboard",
      },
    ];
  }

  return segments.map(
    (segment, index) => ({
      label: segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (character) =>
          character.toUpperCase()
        ),

      path:
        "/" +
        segments
          .slice(0, index + 1)
          .join("/"),
    })
  );
}

function getDisplayName(user) {
  return (
    user?.fullName ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "Administrator"
  );
}

export default function AdminNavbar({
  user,
  notifications = [],
  notificationCount = 0,
  notificationsLoading = false,
  onNotificationsOpen,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onMenuClick,
  onLogout,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const crumbs = useBreadcrumb(
    location.pathname
  );

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [
    notificationOpen,
    setNotificationOpen,
  ] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const adminUser = {
    name: getDisplayName(user),
    role:
      user?.role === "ADMIN"
        ? "Administrator"
        : user?.role || "Administrator",
    avatarUrl:
      user?.profileImage ||
      user?.avatarUrl ||
      "",
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target
        )
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

  const initials = adminUser.name
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    setProfileOpen(false);
    setNotificationOpen(false);

    if (onLogout) {
      onLogout();
      return;
    }

    navigate("/login", {
      replace: true,
    });
  };

  const handleNotificationToggle = () => {
    const willOpen = !notificationOpen;

    setNotificationOpen(willOpen);
    setProfileOpen(false);

    if (
      willOpen &&
      typeof onNotificationsOpen ===
        "function"
    ) {
      onNotificationsOpen();
    }
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
          {crumbs.map(
            (crumb, index) => (
              <span
                className="nb-crumb-wrap"
                key={crumb.path}
              >
                {index > 0 && (
                  <span className="nb-crumb-sep">
                    /
                  </span>
                )}

                {index ===
                crumbs.length - 1 ? (
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
            )
          )}
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
            aria-label="Admin notifications"
            onClick={
              handleNotificationToggle
            }
          >
            <Bell size={18} />

            {notificationCount > 0 && (
              <span className="nb-badge">
                {notificationCount > 99
                  ? "99+"
                  : notificationCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <NotificationDropdown
              notifications={notifications}
              unreadCount={
                notificationCount
              }
              loading={
                notificationsLoading
              }
              onMarkAsRead={
                onMarkNotificationRead
              }
              onMarkAllAsRead={
                onMarkAllNotificationsRead
              }
            />
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
            {adminUser.avatarUrl ? (
              <img
                src={adminUser.avatarUrl}
                alt={adminUser.name}
                className="nb-avatar"
              />
            ) : (
              <span className="nb-avatar nb-avatar-fallback">
                {initials || "AD"}
              </span>
            )}

            <span className="nb-user-info">
              <span className="nb-user-name">
                {adminUser.name}
              </span>

              <span className="nb-user-role">
                {adminUser.role}
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
                to="/admin/profile"
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
