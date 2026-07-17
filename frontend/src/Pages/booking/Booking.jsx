import React, { useState, useMemo } from 'react';
import {
  Calendar,
  CalendarCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  RotateCw,
  Eye,
  MoreVertical,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';
import './Booking.css';

const BOOKINGS = [
  {
    id: 'BK-2025-001',
    customer: 'Ramesh Sharma',
    initials: 'RS',
    property: 'Green Villa',
    serviceType: 'General Pest Control',
    scheduleDate: '12 May 2025',
    scheduleTime: '10:00 AM',
    technician: 'Amit Kumar',
    techInitials: 'AK',
    status: 'Scheduled',
  },
  {
    id: 'BK-2025-002',
    customer: 'Anita Verma',
    initials: 'AV',
    property: 'City Apartments',
    serviceType: 'Termite Treatment',
    scheduleDate: '12 May 2025',
    scheduleTime: '11:30 AM',
    technician: 'Vikram Singh',
    techInitials: 'VS',
    status: 'In Progress',
  },
  {
    id: 'BK-2025-003',
    customer: 'Sunrise Villas',
    initials: 'SV',
    property: 'Sunrise Villas',
    serviceType: 'Rodent Control',
    scheduleDate: '13 May 2025',
    scheduleTime: '09:00 AM',
    technician: 'Rahul Mehta',
    techInitials: 'RM',
    status: 'Pending',
  },
  {
    id: 'BK-2025-004',
    customer: 'Green Tech Park',
    initials: 'GT',
    property: 'Green Tech Park',
    serviceType: 'General Pest Control',
    scheduleDate: '14 May 2025',
    scheduleTime: '02:00 PM',
    technician: 'Amit Kumar',
    techInitials: 'AK',
    status: 'Scheduled',
  },
  {
    id: 'BK-2025-005',
    customer: 'Neha Kapoor',
    initials: 'NK',
    property: 'Kapoor Residence',
    serviceType: 'Cockroach Control',
    scheduleDate: '15 May 2025',
    scheduleTime: '03:30 PM',
    technician: 'Vikram Singh',
    techInitials: 'VS',
    status: 'Cancelled',
  },
];

const STAT_CARDS = [
  { key: 'total', label: 'Total Bookings', sub: 'This Month', value: 152, icon: Calendar },
  { key: 'scheduled', label: 'Scheduled Today', sub: 'Today', value: 18, icon: CalendarCheck },
  { key: 'progress', label: 'In Progress', sub: 'Currently', value: 26, icon: Clock },
  { key: 'completed', label: 'Completed', sub: 'This Month', value: 108, icon: CheckCircle2 },
  { key: 'cancelled', label: 'Cancelled', sub: 'This Month', value: 8, icon: AlertTriangle },
];

function StatusBadge({ status }) {
  const statusClass = status.toLowerCase().replace(/\s+/g, '-');
  return <span className={`status-badge status-${statusClass}`}>{status}</span>;
}

export default function Booking() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu, setOpenMenu] = useState(null);

  const filteredBookings = useMemo(() => {
    return BOOKINGS.filter((b) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.property.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
      const matchesService = serviceFilter === 'All' || b.serviceType === serviceFilter;
      return matchesSearch && matchesStatus && matchesService;
    });
  }, [searchTerm, statusFilter, serviceFilter]);

  return (
    <div className="booking-page">
      <div className="booking-breadcrumb">
        <span className="crumb-active">Dashboard</span>
        <ChevronRight size={14} className="crumb-sep" />
        <span>Bookings</span>
      </div>

      <div className="booking-header">
        <div>
          <h1 className="page-title">Bookings</h1>
          <p className="page-subtitle">Manage and track all pest control service bookings.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          Create Booking
        </button>
      </div>

      <div className="stats-grid">
        {STAT_CARDS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="stat-card" key={stat.key}>
              <div className={`stat-icon stat-icon-${stat.key}`}>
                <Icon size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
                <span className="stat-sub">{stat.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="filter-bar">
        <div className="search-input">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by booking ID, customer or property..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-field">
          <label>Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All</option>
            <option>Scheduled</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>
        </div>

        <div className="filter-field">
          <label>Service Type</label>
          <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
            <option>All</option>
            <option>General Pest Control</option>
            <option>Termite Treatment</option>
            <option>Rodent Control</option>
            <option>Cockroach Control</option>
          </select>
        </div>

        <div className="filter-field">
          <label>Date Range</label>
          <div className="date-range-input">
            <Calendar size={16} />
            <span>Select Date Range</span>
          </div>
        </div>

        <button className="btn btn-outline filter-btn">
          <Filter size={16} />
          Filter
        </button>
        <button className="btn btn-icon-only" title="Refresh">
          <RotateCw size={16} />
        </button>
      </div>

      <div className="table-card">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID <ArrowUpDown size={13} /></th>
                <th>Customer <ArrowUpDown size={13} /></th>
                <th>Property <ArrowUpDown size={13} /></th>
                <th>Service Type <ArrowUpDown size={13} /></th>
                <th>Schedule Date <ArrowUpDown size={13} /></th>
                <th>Technician <ArrowUpDown size={13} /></th>
                <th>Status <ArrowUpDown size={13} /></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <Calendar size={40} />
                      <p>No bookings found</p>
                      <span>Try adjusting your search or filters.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="booking-id-cell">{b.id}</td>
                    <td>
                      <div className="person-cell">
                        <span className="avatar">{b.initials}</span>
                        {b.customer}
                      </div>
                    </td>
                    <td>{b.property}</td>
                    <td>{b.serviceType}</td>
                    <td>
                      <div className="date-cell">
                        <Calendar size={14} />
                        <div>
                          <div>{b.scheduleDate}</div>
                          <div className="cell-sub">{b.scheduleTime}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="person-cell">
                        <span className="avatar avatar-tech">{b.techInitials}</span>
                        {b.technician}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                    <td>
                      <div className="action-cell">
                        <button className="icon-btn" title="View">
                          <Eye size={17} />
                        </button>
                        <div className="menu-wrapper">
                          <button
                            className="icon-btn"
                            title="More"
                            onClick={() => setOpenMenu(openMenu === b.id ? null : b.id)}
                          >
                            <MoreVertical size={17} />
                          </button>
                          {openMenu === b.id && (
                            <div className="dropdown-menu">
                              <button>Edit Booking</button>
                              <button>View Details</button>
                              <button className="danger">Cancel Booking</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span className="results-count">Showing 1 to {filteredBookings.length} of 25 results</span>
          <div className="pagination">
            <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`page-btn ${currentPage === p ? 'active' : ''}`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}
            <span className="page-ellipsis">...</span>
            <button className={`page-btn ${currentPage === 5 ? 'active' : ''}`} onClick={() => setCurrentPage(5)}>
              5
            </button>
            <button className="page-btn" onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
