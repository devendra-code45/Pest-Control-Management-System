import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Leaf,
  Users,
  UserPlus,
  Eye,
  Pencil,
  Calendar,
  CalendarPlus,
  CalendarDays,
  ClipboardList,
  Sprout,
  Plus,
  UserCog,
  User,
  UserCheck,
  Clock,
  MessageSquare,
  CheckCircle2,
  CreditCard,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Lock,
} from 'lucide-react';
import './Sidebar.css';

// Every leaf item gets a `path`, matching the convention already used by
// the Customers submenu (add-customer -> /add-customer, etc).
const NAV_GROUPS = [
  {
    label: 'MAIN',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: Sprout, path: '/dashboard' }, 
    ]
  },
  {
    label: 'OPERATIONS',
    items: [
      {
        key: 'customers',
        label: 'Customers',
        icon: Users,
        children: [
          { key: 'add-customer', label: 'Add Customer', icon: UserPlus, path: '/add-customer' },
          { key: 'edit-customer', label: 'Edit Customer', icon: Pencil, path: '/edit-customer' },
          { key: 'customer-details', label: 'Customer Details', icon: Eye, path: '/customer-details' },
        ],
      },
      {
        key: 'bookings',
        label: 'Bookings',
        icon: Calendar,
        children: [
          { key: 'create-booking', label: 'Create Booking', icon: CalendarPlus, path: '/create-booking' },
          { key: 'edit-booking', label: 'Edit Booking', icon: Pencil, path: '/edit-booking' },
          { key: 'bookings-list', label: 'Bookings', icon: ClipboardList, path: '/booking' },
          { key: 'booking-details', label: 'Booking Details', icon: Eye, path: '/booking-details' },
        ],
      },
      {
        key: 'services',
        label: 'Services',
        icon: Sprout,
        children: [
          { key: 'add-service', label: 'Add Service', icon: Plus, path: '/add-service' },
          { key: 'edit-service', label: 'Edit Service', icon: Pencil, path: '/edit-service' },
          { key: 'service-details', label: 'Service Details', icon: Eye, path: '/service-details' },
          { key: 'services-list', label: 'Services', icon: ClipboardList, path: '/services' },
        ],
      },
      {
        key: 'technicians',
        label: 'Technicians',
        icon: UserCog,
        children: [
          { key: 'add-technician', label: 'Add Technician', icon: UserPlus, path: '/technician/add-technician' },
          { key: 'edit-technician', label: 'Edit Technician', icon: Pencil, path: '/edit-technician' },
          { key: 'technician-profile', label: 'Technician Profile', icon: User, path: '/technician-profile' },
          { key: 'assign-technician', label: 'Assign Technician', icon: UserCheck, path: '/assign-technician' },
          { key: 'technicians-list', label: 'Technicians', icon: ClipboardList, path: '/technician-management' },
        ],
      },
      {
        key: 'complaints',
        label: 'Complaints',
        icon: MessageSquare,
        children: [
          { key: 'complaints-list', label: 'New Complaint', icon: ClipboardList, path: '/new-complaint' },
          { key: 'complaint-details', label: 'Complaint Details', icon: Eye, path: '/complaint' },
        ],
      },
    ],
  },
  {
    label: 'FINANCE & INSIGHTS',
    items: [
      {
        key: 'payments',
        label: 'Payments',
        icon: CreditCard,
        children: [
          { key: 'create-payment', label: 'Create Payment', icon: Plus, path: '/create-payment' },
          { key: 'payments-list', label: 'Payments', icon: ClipboardList, path: '/payments' },
          { key: 'invoice', label: 'Invoice', icon: Receipt, path: '/invoice' },
        ],
      },
      { key: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
    ],
  },
  {
    label: 'CONTROLS',
    items: [
      { key: 'change-password', label: 'Change Password', icon: Lock, path: '/change-password' },
      { key: 'profile', label: 'Profile', icon: User, path: '/profile' },
      { key: 'logout', label: 'Logout', icon: LogOut, danger: true, path: '/'},
    ],
  },
];

const cx = (...parts) => parts.filter(Boolean).join(' ');

export default function Sidebar({
  collapsed = false,
  onToggle,
  mobileOpen = false,
  onCloseMobile,
  onLogout,
}) {
  const location = useLocation();
  // Accordion: only one submenu open at a time. Change to a Set if you
  // want multiple open together.
  const [openKey, setOpenKey] = useState(null);
  // Groups the user manually closed, so navigating to a new page inside
  // an already-open group doesn't silently force it back open.
  const [manuallyClosed, setManuallyClosed] = useState(new Set());

  // Whichever group contains the current route opens automatically --
  // this is what makes "click the module, it opens, and shows the right
  // submenu item" work, and keeps things in sync on direct/deep links.
  useEffect(() => {
    const groupForRoute = NAV_GROUPS.flatMap((g) => g.items).find(
      (item) => item.children?.some((child) => child.path === location.pathname)
    );
    if (groupForRoute && !manuallyClosed.has(groupForRoute.key)) {
      setOpenKey(groupForRoute.key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const toggleGroup = (key) => {
    setOpenKey((prev) => {
      const next = prev === key ? null : key;
      setManuallyClosed((prevClosed) => {
        const updated = new Set(prevClosed);
        if (next === key) {
          updated.delete(key);
        } else {
          updated.add(key);
        }
        return updated;
      });
      return next;
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
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {(!collapsed || mobileOpen) && (
                <div className="sb-group-label">{group.label}</div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const hasChildren = Boolean(item.children && item.children.length);
                const isOpen = hasChildren && openKey === item.key;
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
                            setOpenKey(item.key);
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
      </div>
    </>
  );
}