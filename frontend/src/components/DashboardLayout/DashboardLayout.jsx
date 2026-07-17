import { useEffect, useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // If the viewport is resized up past the tablet breakpoint while the
  // mobile drawer is open, close it so it doesn't linger on desktop.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`dl-layout ${collapsed ? "dl-layout-collapsed" : ""}`}>
      <aside className={`dl-sidebar ${collapsed ? "collapsed" : ""}`}>
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
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
        <Navbar collapsed={collapsed} onMenuClick={() => setMobileOpen(true)} />

        <main className="dl-main">
          <div className="dl-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}