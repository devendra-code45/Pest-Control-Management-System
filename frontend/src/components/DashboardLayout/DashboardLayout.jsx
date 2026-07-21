import { useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

import {
  ADMIN_NAV_GROUPS,
  CUSTOMER_NAV_GROUPS,
} from "../Sidebar/sidebarMenus";

import { useAuth } from "../../context/AuthContext";

import "./DashboardLayout.css";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navGroups =
    auth.role === "ADMIN"
      ? ADMIN_NAV_GROUPS
      : CUSTOMER_NAV_GROUPS;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div
      className={`dl-layout ${
        collapsed ? "dl-layout-collapsed" : ""
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
            setCollapsed((value) => !value)
          }
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {mobileOpen && (
        <div
          className="dl-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="dl-right">
        <Navbar
          collapsed={collapsed}
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="dl-main">
          <div className="dl-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}