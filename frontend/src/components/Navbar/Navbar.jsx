import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  UserCircle,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import "./Navbar.css";

function useBreadcrumb(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [{ label: "Dashboard", path: "/dashboard" }];
  return segments.map((seg, i) => ({
    label: seg
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    path: "/" + segments.slice(0, i + 1).join("/"),
  }));
}

export default function Navbar({
  user = { name: "John Doe", role: "Administrator", avatarUrl: "" },
  notificationCount = 3,
  collapsed = false,
  onMenuClick,
}) {
  const location = useLocation();
  const crumbs = useBreadcrumb(location.pathname);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
        <nav className="nb-breadcrumb" aria-label="Breadcrumb">
          {crumbs.map((crumb, i) => (
            <span className="nb-crumb-wrap" key={crumb.path}>
              {i > 0 && <span className="nb-crumb-sep">/</span>}
              {i === crumbs.length - 1 ? (
                <span className="nb-crumb nb-crumb-current">{crumb.label}</span>
              ) : (
                <Link to={crumb.path} className="nb-crumb">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      <div className={`nb-right ${mobileSearchOpen ? "nb-search-active" : ""}`}>

        <button type="button" className="nb-icon-btn" aria-label="Notifications">
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="nb-badge">{notificationCount}</span>
          )}
        </button>

        <div className="nb-divider" />

        <div className="nb-profile" ref={dropdownRef}>
          <button
            type="button"
            className="nb-profile-trigger"
            onClick={() => setDropdownOpen((o) => !o)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="nb-avatar" />
            ) : (
              <span className="nb-avatar nb-avatar-fallback">{initials}</span>
            )}
            <span className="nb-user-info">
              <span className="nb-user-name">{user.name}</span>
              <span className="nb-user-role">{user.role}</span>
            </span>
            <ChevronDown
              size={16}
              className={`nb-chevron ${dropdownOpen ? "nb-chevron-open" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="nb-dropdown">
              <Link
                to="/profile"
                className="nb-dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                <UserCircle size={16} />
                My Profile
              </Link>
              <Link
                to="/settings"
                className="nb-dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings size={16} />
                Settings
              </Link>
              <div className="nb-dropdown-sep" />
              <button type="button" className="nb-dropdown-item nb-dropdown-danger">
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