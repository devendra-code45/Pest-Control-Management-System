import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  CalendarPlus,
  Users,
  ShieldCheck,
  UserCog,
  IndianRupee,
  TrendingUp,
  MapPin,
  Clock3,
  Bug,
  Wrench,
  UserPlus,
  BarChart3,
  Leaf,
  ChevronRight,
  ArrowRight,
  MessageSquareWarning,
  Building2,
} from 'lucide-react';
import './Dashboard.css';

const DASHBOARD_ROUTES = {
  customers: '/customers',
  bookings: '/bookings',
  addBooking: '/create-booking',
  services: '/services',
  addService: '/add-service',
  technicians: '/technicians',
  complaints: '/complaints',
  payments: '/payments',
  reports: '/reports',
  addCustomer: '/add-customer',
};

const STAT_CARDS = [
  {
    id: 'customers',
    title: 'Total Customers',
    value: '1,248',
    trend: '12% from last month',
    trendType: 'up',
    icon: Users,
    route: DASHBOARD_ROUTES.customers,
  },
  {
    id: 'bookings',
    title: "Today's Bookings",
    value: '18',
    trend: '4 new bookings today',
    trendType: 'info',
    icon: CalendarDays,
    route: DASHBOARD_ROUTES.bookings,
  },
  {
    id: 'active-services',
    title: 'Active Services',
    value: '42',
    trend: '8 services completed today',
    trendType: 'info',
    icon: ShieldCheck,
    route: DASHBOARD_ROUTES.services,
  },
  {
    id: 'technicians',
    title: 'Available Technicians',
    value: '16',
    trend: 'Out of 24 technicians',
    trendType: 'neutral',
    icon: UserCog,
    route: DASHBOARD_ROUTES.technicians,
  },
  {
    id: 'revenue',
    title: 'Monthly Revenue',
    value: '₹2,48,500',
    trend: '18% from last month',
    trendType: 'up',
    icon: IndianRupee,
    route: DASHBOARD_ROUTES.payments,
  },
];

const UPCOMING_SERVICES = [
  {
    id: 'UPC-1',
    date: '20 Jul 2026',
    time: '09:00 AM',
    customer: 'Rahul Patil',
    service: 'General Pest Control',
    property: 'Residential',
    location: 'Pune, Maharashtra',
    technician: 'Amit Sharma',
    status: 'Scheduled',
  },
  {
    id: 'UPC-2',
    date: '20 Jul 2026',
    time: '11:30 AM',
    customer: 'Sneha Kulkarni',
    service: 'Termite Treatment',
    property: 'Office',
    location: 'Pimpri, Maharashtra',
    technician: 'Rohit Jadhav',
    status: 'In Progress',
  },
  {
    id: 'UPC-3',
    date: '20 Jul 2026',
    time: '02:00 PM',
    customer: 'Akash More',
    service: 'Rodent Control',
    property: 'Restaurant',
    location: 'Chinchwad, Maharashtra',
    technician: 'Sameer Patil',
    status: 'Pending',
  },
];

const RECENT_COMPLAINTS = [
  {
    id: 'REQ-2026-0148',
    customer: 'Vishal Deshmukh',
    issue: 'Cockroach infestation',
    date: '19 Jul 2026',
    priority: 'High',
    status: 'Open',
  },
  {
    id: 'REQ-2026-0147',
    customer: 'Priya Shah',
    issue: 'Termite inspection request',
    date: '19 Jul 2026',
    priority: 'Medium',
    status: 'Assigned',
  },
  {
    id: 'REQ-2026-0146',
    customer: 'Sagar Patil',
    issue: 'Follow-up service required',
    date: '18 Jul 2026',
    priority: 'Low',
    status: 'Resolved',
  },
  {
    id: 'REQ-2026-0145',
    customer: 'Neha Joshi',
    issue: 'Technician arrival delay',
    date: '18 Jul 2026',
    priority: 'High',
    status: 'In Review',
  },
];

const ACTIVE_SERVICES = [
  {
    id: 'ACT-1',
    service: 'General Pest Control',
    icon: ShieldCheck,
    customer: 'Green Valley Residency',
    property: 'Residential Society',
    location: 'Pune, Maharashtra',
    date: 'Started on 19 Jul 2026',
    status: 'In Progress',
  },
  {
    id: 'ACT-2',
    service: 'Termite Treatment',
    icon: Bug,
    customer: 'Tech Park Offices',
    property: 'Commercial Office',
    location: 'Hinjewadi, Pune',
    date: 'Started on 18 Jul 2026',
    status: 'In Progress',
  },
  {
    id: 'ACT-3',
    service: 'Rodent Control',
    icon: Wrench,
    customer: 'Royal Food Corner',
    property: 'Restaurant',
    location: 'Pimpri, Maharashtra',
    date: 'Started on 18 Jul 2026',
    status: 'Inspection',
  },
  {
    id: 'ACT-4',
    service: 'Bed Bug Treatment',
    icon: Bug,
    customer: 'Sunrise Hostel',
    property: 'Hostel',
    location: 'Wakad, Pune',
    date: 'Scheduled for 20 Jul 2026',
    status: 'Scheduled',
  },
];

const QUICK_ACTIONS = [
  {
    id: 'add-customer',
    label: 'Add Customer',
    icon: UserPlus,
    route: DASHBOARD_ROUTES.addCustomer,
  },
  {
    id: 'new-booking',
    label: 'New Booking',
    icon: CalendarPlus,
    route: DASHBOARD_ROUTES.addBooking,
  },
  {
    id: 'add-service',
    label: 'Add Service',
    icon: Wrench,
    route: DASHBOARD_ROUTES.addService,
  },
  {
    id: 'view-reports',
    label: 'View Reports',
    icon: BarChart3,
    route: DASHBOARD_ROUTES.reports,
  },
];

const STATUS_TONE = {
  Scheduled: 'blue',
  'In Progress': 'green',
  Pending: 'orange',
  Inspection: 'purple',
  Open: 'red',
  Assigned: 'blue',
  Resolved: 'green',
  'In Review': 'purple',
};

const PRIORITY_TONE = {
  High: 'red',
  Medium: 'orange',
  Low: 'green',
};

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatDisplayDate(isoDate) {
  const parsed = new Date(`${isoDate}T00:00:00`);
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function StatusBadge({ label, tone }) {
  return (
    <span className={`admin-dashboard-badge admin-dashboard-badge--${tone}`}>
      {label}
    </span>
  );
}

function StatCard({ title, value, trend, trendType, icon: Icon, onClick }) {
  return (
    <button type="button" className="admin-dashboard-stat-card" onClick={onClick}>
      <span className="admin-dashboard-stat-icon" aria-hidden="true">
        <Icon size={22} />
      </span>
      <span className="admin-dashboard-stat-text">
        <span className="admin-dashboard-stat-title">{title}</span>
        <span className="admin-dashboard-stat-value">{value}</span>
        <span className={`admin-dashboard-stat-trend admin-dashboard-stat-trend--${trendType}`}>
          {trendType === 'up' && <TrendingUp size={14} aria-hidden="true" />}
          {trend}
        </span>
      </span>
    </button>
  );
}

function TechnicianAvatar({ name }) {
  return (
    <span className="admin-dashboard-avatar" aria-hidden="true">
      {getInitials(name)}
    </span>
  );
}

function UpcomingServicesCard({ navigate }) {
  return (
    <section className="admin-dashboard-card">
      <div className="admin-dashboard-card-header">
        <h2 className="admin-dashboard-card-title">
          <CalendarDays size={18} aria-hidden="true" />
          Upcoming Services
        </h2>
        <button
          type="button"
          className="admin-dashboard-btn admin-dashboard-btn--outline"
          onClick={() => navigate(DASHBOARD_ROUTES.booking)}
        >
          View All Schedule
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="admin-dashboard-table-wrapper">
        <table className="admin-dashboard-table">
          <thead>
            <tr>
              <th scope="col">Date &amp; Time</th>
              <th scope="col">Customer</th>
              <th scope="col">Service Type</th>
              <th scope="col">Property / Location</th>
              <th scope="col">Technician</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {UPCOMING_SERVICES.map((row) => (
              <tr key={row.id}>
                <td>
                  <div className="admin-dashboard-cell-datetime">
                    <span className="admin-dashboard-cell-icon-box" aria-hidden="true">
                      <CalendarDays size={14} />
                    </span>
                    <div className="admin-dashboard-cell-stack">
                      <span className="admin-dashboard-cell-primary">{row.date}</span>
                      <span className="admin-dashboard-cell-muted admin-dashboard-cell-inline">
                        <Clock3 size={12} aria-hidden="true" />
                        {row.time}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="admin-dashboard-cell-primary">{row.customer}</td>
                <td>
                  <span className="admin-dashboard-cell-inline">
                    <Bug size={14} aria-hidden="true" />
                    {row.service}
                  </span>
                </td>
                <td>
                  <div className="admin-dashboard-cell-stack">
                    <span className="admin-dashboard-cell-primary admin-dashboard-cell-inline">
                      <Building2 size={12} aria-hidden="true" />
                      {row.property}
                    </span>
                    <span className="admin-dashboard-cell-muted admin-dashboard-cell-inline">
                      <MapPin size={12} aria-hidden="true" />
                      {row.location}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="admin-dashboard-cell-inline">
                    <TechnicianAvatar name={row.technician} />
                    <span>{row.technician}</span>
                  </div>
                </td>
                <td>
                  <StatusBadge label={row.status} tone={STATUS_TONE[row.status]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ComplaintsCard({ navigate }) {
  return (
    <section className="admin-dashboard-card">
      <div className="admin-dashboard-card-header">
        <h2 className="admin-dashboard-card-title">
          <MessageSquareWarning size={18} aria-hidden="true" />
          Recent Complaints &amp; Requests
        </h2>
        <button
          type="button"
          className="admin-dashboard-btn admin-dashboard-btn--outline"
          onClick={() => navigate(DASHBOARD_ROUTES.complaints)}
        >
          View All Complaints
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="admin-dashboard-table-wrapper">
        <table className="admin-dashboard-table">
          <thead>
            <tr>
              <th scope="col">Request ID</th>
              <th scope="col">Customer</th>
              <th scope="col">Issue / Service</th>
              <th scope="col">Date</th>
              <th scope="col">Priority</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_COMPLAINTS.map((row) => (
              <tr key={row.id}>
                <td className="admin-dashboard-cell-primary">{row.id}</td>
                <td>{row.customer}</td>
                <td className="admin-dashboard-cell-muted">{row.issue}</td>
                <td className="admin-dashboard-cell-muted">{row.date}</td>
                <td>
                  <StatusBadge label={row.priority} tone={PRIORITY_TONE[row.priority]} />
                </td>
                <td>
                  <StatusBadge label={row.status} tone={STATUS_TONE[row.status]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ActiveServicesCard({ navigate }) {
  return (
    <section className="admin-dashboard-card">
      <div className="admin-dashboard-card-header">
        <h2 className="admin-dashboard-card-title">
          <ShieldCheck size={18} aria-hidden="true" />
          Active Services
        </h2>
        <button
          type="button"
          className="admin-dashboard-btn admin-dashboard-btn--outline"
          onClick={() => navigate(DASHBOARD_ROUTES.services)}
        >
          View All
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
      <ul className="admin-dashboard-active-list">
        {ACTIVE_SERVICES.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id} className="admin-dashboard-active-item">
              <span className="admin-dashboard-active-icon" aria-hidden="true">
                <Icon size={18} />
              </span>
              <div className="admin-dashboard-active-body">
                <div className="admin-dashboard-active-top">
                  <span className="admin-dashboard-active-service">{item.service}</span>
                  <StatusBadge label={item.status} tone={STATUS_TONE[item.status]} />
                </div>
                <span className="admin-dashboard-cell-primary">{item.customer}</span>
                <span className="admin-dashboard-cell-muted admin-dashboard-cell-inline">
                  <Building2 size={12} aria-hidden="true" />
                  {item.property}
                </span>
                <span className="admin-dashboard-cell-muted admin-dashboard-cell-inline">
                  <MapPin size={12} aria-hidden="true" />
                  {item.location}
                </span>
                <span className="admin-dashboard-cell-muted admin-dashboard-cell-inline">
                  <Clock3 size={12} aria-hidden="true" />
                  {item.date}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function QuickActionButton({ label, icon: Icon, onClick }) {
  return (
    <button type="button" className="admin-dashboard-quick-action" onClick={onClick}>
      <span className="admin-dashboard-quick-action-icon" aria-hidden="true">
        <Icon size={18} />
      </span>
      <span className="admin-dashboard-quick-action-label">{label}</span>
      <ChevronRight size={16} className="admin-dashboard-quick-action-chevron" aria-hidden="true" />
    </button>
  );
}

function QuickActionsCard({ navigate }) {
  return (
    <section className="admin-dashboard-card">
      <div className="admin-dashboard-quick-actions-header">
        <h2 className="admin-dashboard-card-title">Quick Actions</h2>
        <p className="admin-dashboard-card-subtitle">Manage common operations quickly.</p>
      </div>
      <div className="admin-dashboard-quick-actions-grid">
        {QUICK_ACTIONS.map((action) => (
          <QuickActionButton
            key={action.id}
            label={action.label}
            icon={action.icon}
            onClick={() => navigate(action.route)}
          />
        ))}
      </div>
    </section>
  );
}

function InfoBanner({ navigate }) {
  return (
    <section className="admin-dashboard-banner">
      <span className="admin-dashboard-banner-icon" aria-hidden="true">
        <Leaf size={24} />
      </span>
      <div className="admin-dashboard-banner-body">
        <h2 className="admin-dashboard-banner-title">
          Efficient operations create safer environments.
        </h2>
        <p className="admin-dashboard-banner-text">
          Track every booking, service, technician and customer request from one centralized dashboard.
        </p>
      </div>
      <button
        type="button"
        className="admin-dashboard-btn admin-dashboard-btn--secondary"
        onClick={() => navigate("/admin/reports")}
      >
        View Reports
        <ArrowRight size={16} aria-hidden="true" />
      </button>
    </section>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('2026-07-19');

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div className="admin-dashboard-page">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-header-text">
          <h1 className="admin-dashboard-title">Admin Dashboard</h1>
          <p className="admin-dashboard-subtitle">
            Monitor customers, bookings, technicians and pest control operations.
          </p>
        </div>
        <div className="admin-dashboard-header-actions">
          <div className="admin-dashboard-date-control">
            <CalendarDays size={18} className="admin-dashboard-date-icon" aria-hidden="true" />
            <span className="admin-dashboard-date-display" aria-hidden="true">
              {formatDisplayDate(selectedDate)}
            </span>
            <input
              type="date"
              className="admin-dashboard-date-input"
              value={selectedDate}
              onChange={handleDateChange}
              aria-label="Dashboard date"
            />
          </div>
          <button
            type="button"
            className="admin-dashboard-btn admin-dashboard-btn--primary"
            onClick={() => navigate(DASHBOARD_ROUTES.addBooking)}
          >
            <CalendarPlus size={18} aria-hidden="true" />
            New Booking
          </button>
        </div>
      </header>

      <section className="admin-dashboard-stats-grid" aria-label="Key statistics">
        {STAT_CARDS.map((card) => (
          <StatCard
            key={card.id}
            title={card.title}
            value={card.value}
            trend={card.trend}
            trendType={card.trendType}
            icon={card.icon}
            onClick={() => navigate(card.route)}
          />
        ))}
      </section>

      <div className="admin-dashboard-main-grid">
        <div className="admin-dashboard-column admin-dashboard-column--left">
          <UpcomingServicesCard navigate={navigate} />
          <ComplaintsCard navigate={navigate} />
        </div>
        <div className="admin-dashboard-column admin-dashboard-column--right">
          <ActiveServicesCard navigate={navigate} />
          <QuickActionsCard navigate={navigate} />
        </div>
      </div>

      <InfoBanner navigate={navigate} />
    </div>
  );
}