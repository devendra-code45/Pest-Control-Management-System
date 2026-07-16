import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Sprout,
  UserCog,
  MessageSquareWarning,
  CreditCard,
  FileBarChart2,
  BarChart3,
  CalendarDays,
  Bell,
  Boxes,
  FlaskConical,
  Wrench,
  Settings,
  UserCircle,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  Leaf,
} from "lucide-react";
import "./Sidebar.css";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Operations",
    items: [
      { to: "/customers", label: "Customers", icon: Users },
      { to: "/bookings", label: "Bookings", icon: CalendarCheck },
      { to: "/services", label: "Services", icon: Sprout },
      { to: "/technicians", label: "Technicians", icon: UserCog, path: "/technician-management" },
      { to: "/complaints", label: "Complaints", icon: MessageSquareWarning },
    ],
  },
  {
    label: "Finance & Insights",
    items: [
      { to: "/payments", label: "Payments", icon: CreditCard },
      { to: "/reports", label: "Reports", icon: FileBarChart2 },
    ],
  },
  {
    label: "Schedule",
    items: [
      { to: "/calendar", label: "Calendar", icon: CalendarDays },
      { to: "/notifications", label: "Notifications", icon: Bell },
    ],
  },
  
];

const BOTTOM_ITEMS = [
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/profile", label: "Profile", icon: UserCircle },
];

export default function Sidebar({ collapsed, onToggle }) {
  const [logoutHover, setLogoutHover] = useState(false);

  return (
    <aside className={`sb-sidebar ${collapsed ? "sb-collapsed" : ""}`}>
      <div className="sb-top">
        <div className="sb-logo">
          <span className="sb-logo-mark">
            <Leaf size={20} strokeWidth={2.4} />
          </span>
          {!collapsed && (
            <span className="sb-logo-text">
              Pest<span className="sb-logo-accent">Control</span>
              <span className="sb-logo-sub">MANAGEMENT SYSTEM</span>
            </span>
          )}
        </div>
        <button
          type="button"
          className="sb-toggle"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>
      </div>

      <nav className="sb-nav" aria-label="Primary">
        {NAV_GROUPS.map((group) => (
          <div className="sb-group" key={group.label}>
            {!collapsed && <p className="sb-group-label">{group.label}</p>}
            <ul className="sb-menu">
              {group.items.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `sb-menu-item ${isActive ? "sb-active" : ""}`
                    }
                    title={collapsed ? label : undefined}
                  >
                    <span className="sb-menu-icon">
                      <Icon size={18} strokeWidth={2} />
                    </span>
                    {!collapsed && <span className="sb-menu-label">{label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sb-bottom">
        <ul className="sb-menu">
          {BOTTOM_ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `sb-menu-item ${isActive ? "sb-active" : ""}`
                }
                title={collapsed ? label : undefined}
              >
                <span className="sb-menu-icon">
                  <Icon size={18} strokeWidth={2} />
                </span>
                {!collapsed && <span className="sb-menu-label">{label}</span>}
              </NavLink>
            </li>
          ))}
          <li>
            <button
              type="button"
              className={`sb-menu-item sb-logout ${logoutHover ? "sb-logout-hover" : ""}`}
              onMouseEnter={() => setLogoutHover(true)}
              onMouseLeave={() => setLogoutHover(false)}
              title={collapsed ? "Logout" : undefined}
            >
              <span className="sb-menu-icon">
                <LogOut size={18} strokeWidth={2} />
              </span>
              {!collapsed && <span className="sb-menu-label">Logout</span>}
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}