import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Leaf,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Headphones,
  ArrowRight,
} from "lucide-react";
import "./Sidebar.css";

// Every leaf item gets a `path`, matching the convention already used by
// the Customers submenu (add-customer -> /add-customer, etc).


const cx = (...parts) => parts.filter(Boolean).join(' ');

export default function Sidebar({
  navGroups = [],
  collapsed = false,
  onToggle,
  mobileOpen = false,
  onCloseMobile,
  onLogout,
}) {
  const location = useLocation();
  // Accordion: only one submenu open at a time. Change to a Set if you
  // want multiple open together.
  const isCustomerInterface =
    location.pathname.startsWith("/customer");
  const [openKeys, setOpenKeys] = useState(new Set());

  // Whichever group contains the current route opens automatically --
  // this is what makes "click the module, it opens, and shows the right
  // submenu item" work, and keeps things in sync on direct/deep links.
  useEffect(() => {
    const groupForRoute = navGroups
      .flatMap((group) => group.items)
      .find((item) =>
        item.children?.some(
          (child) => child.path === location.pathname
        )
      );

    if (groupForRoute) {
      setOpenKeys((currentKeys) => {
        const updatedKeys = new Set(currentKeys);
        updatedKeys.add(groupForRoute.key);
        return updatedKeys;
      });
    }
  }, [location.pathname, navGroups]);

  const toggleGroup = (key) => {
    setOpenKeys((currentKeys) => {
      const updatedKeys = new Set(currentKeys);

      if (updatedKeys.has(key)) {
        updatedKeys.delete(key);
      } else {
        updatedKeys.add(key);
      }

      return updatedKeys;
    });
  };

  const closeOnMobile = () => {
    if (mobileOpen) {
      onCloseMobile?.();
    }
  };

  // On small screens the header button closes the drawer instead of
  // collapsing to the icon rail (there's no icon-rail mode on mobile).
  const handleHeaderButtonClick = () => {
    if (mobileOpen) {
      onCloseMobile?.();
    } else {
      onToggle?.();
    }
  };
  

  return (
    <>
      {mobileOpen && (
        <div className="sb-backdrop" onClick={onCloseMobile} aria-hidden="true" />
      )}

      <div
        className={cx(
          'sb-sidebar',
          collapsed && !mobileOpen && 'collapsed',
          mobileOpen && 'mobile-open'
        )}
      >
        <div className="sb-header">
          <div className="sb-logo-wrap">
            <div className="sb-logo">
              <Leaf size={20} color="#fff" />
            </div>
            {(!collapsed || mobileOpen) && (
              <div>
                <div className="sb-brand-name">Pest</div>
                <div className="sb-brand-name accent">Control</div>
              </div>
            )}
          </div>
          <button
            type="button"
            className="sb-toggle"
            onClick={handleHeaderButtonClick}
            aria-label={mobileOpen ? 'Close sidebar' : collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {mobileOpen ? (
              <X size={16} />
            ) : collapsed ? (
              <PanelLeftOpen size={16} />
            ) : (
              <PanelLeftClose size={16} />
            )}
          </button>
        </div>

        <nav className="sb-nav">
          {navGroups.map((group) => (
            <div key={group.label}>
              {(!collapsed || mobileOpen) && (
                <div className="sb-group-label">{group.label}</div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const hasChildren = Boolean(item.children && item.children.length);
                const isOpen =
                  hasChildren && openKeys.has(item.key);
                // The parent module is "active" if it's open right now,
                // OR one of its children matches the current route -- so
                // it stays highlighted even after the submenu is closed
                // while you're still on one of its pages.
                const isActive =
                  hasChildren &&
                  (isOpen || item.children.some((c) => c.path === location.pathname));
                const showLabels = !collapsed || mobileOpen;

                if (hasChildren) {
                  return (
                    <div className="sb-item-wrap" key={item.key}>
                      <button
                        type="button"
                        className={cx('sb-item', isActive && 'active', isOpen && 'open')}
                        onClick={() => {
                          if (showLabels) {
                            toggleGroup(item.key);
                          } else {
                            // Collapsed rail: clicking expands the
                            // sidebar back out so the submenu is visible.
                            onToggle?.();

                            setOpenKeys((currentKeys) => {
                              const updatedKeys = new Set(currentKeys);
                              updatedKeys.add(item.key);
                              return updatedKeys;
                            });
                          }
                        }}
                        aria-expanded={showLabels ? isOpen : undefined}
                      >
                        <Icon size={18} className="sb-icon" />
                        {showLabels && <span className="sb-label">{item.label}</span>}
                        {showLabels && (
                          <ChevronDown size={16} className={cx('sb-chevron', isOpen && 'open')} />
                        )}
                      </button>

                      {showLabels && (
                        <div className={cx('sb-submenu', isOpen && 'open')}>
                          {item.children.map((child) => {
                            const ChildIcon = child.icon;
                            return (
                              <NavLink
                                key={child.key}
                                to={child.path}
                                className={({ isActive: childActive }) =>
                                  cx('sb-subitem', childActive && 'active')
                                }
                                onClick={closeOnMobile}
                              >
                                <ChildIcon size={15} className="sb-sub-icon" />
                                <span>{child.label}</span>
                              </NavLink>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                // Leaf items with no submenu (Reports, Settings, Profile, Logout).
                if (item.key === 'logout') {
                  return (
                    <div className="sb-item-wrap" key={item.key}>
                      <button
                        type="button"
                        className={cx('sb-item', 'danger')}
                        onClick={() => {
                          onLogout?.();
                          closeOnMobile();
                        }}
                      >
                        <Icon size={18} className="sb-icon" />
                        {showLabels && <span className="sb-label">{item.label}</span>}
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="sb-item-wrap" key={item.key}>
                    <NavLink
                      to={item.path}
                      className={({ isActive: leafActive }) =>
                        cx('sb-item', leafActive && 'active')
                      }
                      onClick={closeOnMobile}
                    >
                      <Icon size={18} className="sb-icon" />
                      {showLabels && <span className="sb-label">{item.label}</span>}
                    </NavLink>
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {isCustomerInterface && (
          <div
            className={cx(
              "sb-support-wrapper",
              collapsed &&
              !mobileOpen &&
              "sb-support-wrapper--collapsed"
            )}
          >
            {collapsed && !mobileOpen ? (
              <NavLink
                to="/customer/complaints"
                className="sb-support-collapsed"
                aria-label="Contact Support"
                title="Contact Support"
              >
                <Headphones size={20} />
              </NavLink>
            ) : (
              <div className="sb-support-card">
                <div className="sb-support-icon">
                  <Headphones size={20} />
                </div>

                <div className="sb-support-content">
                  <h3>Need Help?</h3>

                  <p>
                    Contact our support team for help
                    with your bookings or services.
                  </p>

                  <NavLink
                    to="/customer/contact-support"
                    className="sb-support-button"
                    onClick={closeOnMobile}
                  >
                    Contact Support
                    <ArrowRight size={15} />
                  </NavLink>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}