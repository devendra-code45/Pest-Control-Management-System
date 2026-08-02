import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar";

import AdminNavbar from "../Navbar/AdminNavbar";
import CustomerNavbar from "../Navbar/CustomerNavbar";

import {
  ADMIN_NAV_GROUPS,
  CUSTOMER_NAV_GROUPS,
} from "../Sidebar/sidebarMenus";

import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

import "./DashboardLayout.css";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [navbarUser, setNavbarUser] =
    useState(null);

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const [
    notificationCount,
    setNotificationCount,
  ] = useState(0);

  const [
    notificationsLoading,
    setNotificationsLoading,
  ] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { auth, logout } = useAuth();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileOpen(false);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!auth.isAuthenticated) {
      setNavbarUser(null);
      return undefined;
    }

    const loadLoggedInUser = async () => {
      try {
        const response = await api.get(
          "/users/profile"
        );

        if (!cancelled) {
          setNavbarUser(
            response.data || auth.user
          );
        }
      } catch {
        if (!cancelled) {
          setNavbarUser(auth.user || null);
        }
      }
    };

    loadLoggedInUser();

    return () => {
      cancelled = true;
    };
  }, [
    auth.isAuthenticated,
    auth.token,
    auth.user,
    location.pathname,
  ]);

  const loadNotifications =
    useCallback(async () => {
      if (!auth.isAuthenticated) {
        setNotifications([]);
        setNotificationCount(0);
        return;
      }

      setNotificationsLoading(true);

      try {
        const [
          notificationsResponse,
          countResponse,
        ] = await Promise.all([
          api.get("/notifications"),
          api.get(
            "/notifications/unread-count"
          ),
        ]);

        setNotifications(
          Array.isArray(
            notificationsResponse.data
          )
            ? notificationsResponse.data
            : []
        );

        setNotificationCount(
          Number(
            countResponse.data?.count || 0
          )
        );
      } catch (error) {
        console.error(
          "Unable to load notifications.",
          error
        );
      } finally {
        setNotificationsLoading(false);
      }
    }, [
      auth.isAuthenticated,
      auth.token,
    ]);

  useEffect(() => {
    loadNotifications();
  }, [
    loadNotifications,
    location.pathname,
  ]);

  const handleMarkNotificationRead =
    async (notificationId) => {
      const currentNotification =
        notifications.find(
          (notification) =>
            notification.id ===
            notificationId
        );

      if (currentNotification?.read) {
        return;
      }

      try {
        await api.patch(
          `/notifications/${notificationId}/read`
        );

        setNotifications(
          (current) =>
            current.map((notification) =>
              notification.id ===
              notificationId
                ? {
                    ...notification,
                    read: true,
                  }
                : notification
            )
        );

        setNotificationCount(
          (current) =>
            Math.max(0, current - 1)
        );
      } catch (error) {
        console.error(
          "Unable to mark notification as read.",
          error
        );
      }
    };

  const handleMarkAllNotificationsRead =
    async () => {
      if (notificationCount === 0) {
        return;
      }

      try {
        await api.patch(
          "/notifications/read-all"
        );

        setNotifications(
          (current) =>
            current.map(
              (notification) => ({
                ...notification,
                read: true,
              })
            )
        );

        setNotificationCount(0);
      } catch (error) {
        console.error(
          "Unable to mark all notifications as read.",
          error
        );
      }
    };

  if (!auth.isAuthenticated) {
    return (
      <Navigate to="/login" replace />
    );
  }

  const isAdmin = auth.role === "ADMIN";

  const navGroups = isAdmin
    ? ADMIN_NAV_GROUPS
    : CUSTOMER_NAV_GROUPS;

  const currentUser =
    navbarUser || auth.user;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const notificationProps = {
    notifications,
    notificationCount,
    notificationsLoading,
    onNotificationsOpen:
      loadNotifications,
    onMarkNotificationRead:
      handleMarkNotificationRead,
    onMarkAllNotificationsRead:
      handleMarkAllNotificationsRead,
  };

  return (
    <div
      className={`dl-layout ${
        collapsed
          ? "dl-layout-collapsed"
          : ""
      }`}
    >
      <aside
        className={`dl-sidebar ${
          collapsed ? "collapsed" : ""
        }`}
      >
        <Sidebar
          navGroups={navGroups}
          collapsed={collapsed}
          onToggle={() =>
            setCollapsed(
              (current) => !current
            )
          }
          mobileOpen={mobileOpen}
          onCloseMobile={() =>
            setMobileOpen(false)
          }
          onLogout={handleLogout}
        />
      </aside>

      {mobileOpen && (
        <div
          className="dl-backdrop"
          onClick={() =>
            setMobileOpen(false)
          }
          aria-hidden="true"
        />
      )}

      <div className="dl-right">
        {isAdmin ? (
          <AdminNavbar
            user={currentUser}
            {...notificationProps}
            onMenuClick={() =>
              setMobileOpen(true)
            }
            onLogout={handleLogout}
          />
        ) : (
          <CustomerNavbar
            user={currentUser}
            {...notificationProps}
            onMenuClick={() =>
              setMobileOpen(true)
            }
            onLogout={handleLogout}
          />
        )}

        <main className="dl-main">
          <div className="dl-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
