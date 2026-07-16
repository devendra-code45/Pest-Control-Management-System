import { useState } from 'react';
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
} from 'lucide-react';
import './Sidebar.css';

const NAV_GROUPS = [
  {
    label: 'OPERATIONS',
    items: [
      {
        key: 'customers',
        label: 'Customers',
        icon: Users,
        children: [
          { key: 'add-customer', label: 'Add Customer', icon: UserPlus },
          { key: 'customer-details', label: 'Customer Details', icon: Eye },
          { key: 'edit-customer', label: 'Edit Customer', icon: Pencil },
        ],
      },
      {
        key: 'bookings',
        label: 'Bookings',
        icon: Calendar,
        children: [
          { key: 'bookings-list', label: 'Bookings', icon: ClipboardList },
          { key: 'create-booking', label: 'Create Booking', icon: CalendarPlus },
          { key: 'booking-details', label: 'Booking Details', icon: Eye },
          { key: 'edit-booking', label: 'Edit Booking', icon: Pencil },
          { key: 'booking-calendar', label: 'Booking Calendar', icon: CalendarDays },
        ],
      },
      {
        key: 'services',
        label: 'Services',
        icon: Sprout,
        children: [
          { key: 'services-list', label: 'Services', icon: ClipboardList },
          { key: 'add-service', label: 'Add Service', icon: Plus },
          { key: 'service-details', label: 'Service Details', icon: Eye },
          { key: 'edit-service', label: 'Edit Service', icon: Pencil },
        ],
      },
      {
        key: 'technicians',
        label: 'Technicians',
        icon: UserCog,
        children: [
          { key: 'technicians-list', label: 'Technicians', icon: ClipboardList },
          { key: 'add-technician', label: 'Add Technician', icon: UserPlus },
          { key: 'technician-profile', label: 'Technician Profile', icon: User },
          { key: 'assign-technician', label: 'Assign Technician', icon: UserCheck },
          { key: 'technician-schedule', label: 'Technician Schedule', icon: Clock },
        ],
      },
      {
        key: 'complaints',
        label: 'Complaints',
        icon: MessageSquare,
        children: [
          { key: 'complaints-list', label: 'Complaints', icon: ClipboardList },
          { key: 'complaint-details', label: 'Complaint Details', icon: Eye },
          { key: 'resolve-complaint', label: 'Resolve Complaint', icon: CheckCircle2 },
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
          { key: 'payments-list', label: 'Payments', icon: ClipboardList },
          { key: 'payments-details', label: 'Payments Details', icon: Eye },
          { key: 'create-payment', label: 'Create Payment', icon: Plus },
          { key: 'invoice', label: 'Invoice', icon: Receipt },
        ],
      },
      { key: 'reports', label: 'Reports', icon: BarChart3 },
    ],
  },
  {
    label: 'CONTROLS',
    items: [
      { key: 'settings', label: 'Settings', icon: Settings },
      { key: 'profile', label: 'Profile', icon: User },
      { key: 'logout', label: 'Logout', icon: LogOut, danger: true },
    ],
  },
];

const cx = (...parts) => parts.filter(Boolean).join(' ');

export default function Sidebar({ collapsed = false, onToggle }) {
  // Only one dropdown open at a time (accordion). Change to a Set if you want multiple open at once.
  const [openKey, setOpenKey] = useState('customers');
  const [activeKey, setActiveKey] = useState('customer-details');

  const toggleGroup = (key) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  const selectItem = (key) => {
    setActiveKey(key);
  };

  return (
    <div className={`sb-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sb-header">
        <div className="sb-logo-wrap">
          <div className="sb-logo">
            <Leaf size={20} color="#fff" />
          </div>
          {!collapsed && (
            <div>
              <div className="sb-brand-name">Pest</div>
              <div className="sb-brand-name accent">Control</div>
            </div>
          )}
        </div>
        <button
          type="button"
          className="sb-toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      <nav className="sb-nav">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="sb-group-label">{group.label}</div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const hasChildren = Boolean(item.children && item.children.length);
              const isOpen = hasChildren && openKey === item.key;
              const isActive = (!hasChildren && activeKey === item.key) || (hasChildren && activeKey === item.key);

              return (
                <div className="sb-item-wrap" key={item.key}>
                  <button
                    type="button"
                    className={cx('sb-item', isActive && 'active', isOpen && 'open', item.danger && 'danger', collapsed && 'collapsed-item')}
                    onClick={() => {
                      if (hasChildren && !collapsed) {
                        toggleGroup(item.key);
                      } else {
                        selectItem(item.key);
                      }
                    }}
                    aria-expanded={hasChildren && !collapsed ? isOpen : undefined}
                  >
                    <Icon size={18} className="sb-icon" />
                    {!collapsed && <span className="sb-label">{item.label}</span>}
                    {!collapsed && hasChildren && (
                      <ChevronDown size={16} className={cx('sb-chevron', isOpen && 'open')} />
                    )}
                  </button>

                  {!collapsed && hasChildren && (
                    <div className={cx('sb-submenu', isOpen && 'open')}>
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <button
                            type="button"
                            key={child.key}
                            className={cx('sb-subitem', activeKey === child.key && 'active')}
                            onClick={() => selectItem(child.key)}
                          >
                            <ChildIcon size={15} className="sb-sub-icon" />
                            <span>{child.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </div>
  );
}