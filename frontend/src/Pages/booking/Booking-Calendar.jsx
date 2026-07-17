import React, { useState, useMemo } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  User,
  Filter,
  BarChart3,
} from 'lucide-react';
import './Booking-Calendar.css';

const MONTH_NAME = 'May 2025';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Calendar grid data for May 2025 (starts Sunday, includes leading/trailing days)
const CALENDAR_WEEKS = [
  [
    { day: 27, muted: true },
    { day: 28, muted: true },
    { day: 29, muted: true },
    { day: 30, muted: true },
    { day: 1, events: [{ time: '10:00 AM', title: 'General Pest Control', place: 'Green Villa', status: 'scheduled' }] },
    { day: 2, events: [{ time: '11:30 AM', title: 'Termite Treatment', place: 'City Apartments', status: 'progress' }] },
    { day: 3 },
  ],
  [
    { day: 4 },
    { day: 5 },
    { day: 6, events: [{ time: '02:00 PM', title: 'Rodent Control', place: 'Sunrise Villas', status: 'pending' }] },
    { day: 7 },
    { day: 8, events: [{ time: '10:30 AM', title: 'Cockroach Control', place: 'Green Tech Park', status: 'progress' }] },
    { day: 9 },
    { day: 10 },
  ],
  [
    { day: 11 },
    {
      day: 12,
      today: true,
      events: [
        { time: '10:00 AM', title: 'Termite Treatment', place: 'City Apartments', status: 'scheduled' },
        { time: '03:00 PM', title: 'General Pest Control', place: 'Kapoor Residence', status: 'progress' },
      ],
    },
    { day: 13 },
    { day: 14, events: [{ time: '11:00 AM', title: 'Rodent Control', place: 'Sunrise Villas', status: 'pending' }] },
    { day: 15 },
    { day: 16, events: [{ time: '10:30 AM', title: 'General Pest Control', place: 'Green Tech Park', status: 'scheduled' }] },
    { day: 17 },
  ],
  [
    { day: 18 },
    { day: 19 },
    { day: 20, events: [{ time: '02:00 PM', title: 'Cockroach Control', place: 'Green Villa', status: 'progress' }] },
    { day: 21 },
    { day: 22, events: [{ time: '10:00 AM', title: 'Termite Treatment', place: 'City Apartments', status: 'scheduled' }] },
    { day: 23 },
    { day: 24 },
  ],
  [
    { day: 25 },
    { day: 26, events: [{ time: '11:30 AM', title: 'Rodent Control', place: 'Sunrise Villas', status: 'pending' }] },
    { day: 27 },
    { day: 28, events: [{ time: '03:30 PM', title: 'General Pest Control', place: 'Kapoor Residence', status: 'progress' }] },
    { day: 29 },
    { day: 30 },
    { day: 31 },
  ],
];

const STATUS_OPTIONS = ['Scheduled', 'In Progress', 'Completed', 'Pending', 'Cancelled'];
const STATUS_KEY_MAP = {
  Scheduled: 'scheduled',
  'In Progress': 'progress',
  Completed: 'completed',
  Pending: 'pending',
  Cancelled: 'cancelled',
};

export default function BookingCalendar() {
  const [activeStatuses, setActiveStatuses] = useState(STATUS_OPTIONS);
  const [technician, setTechnician] = useState('All Technicians');
  const [viewMode, setViewMode] = useState('Week');

  const toggleStatus = (status) => {
    setActiveStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const isVisible = (status) => activeStatuses.includes(
    Object.keys(STATUS_KEY_MAP).find((k) => STATUS_KEY_MAP[k] === status)
  );

  const stats = useMemo(
    () => [
      { label: 'Scheduled Today', value: 18, key: 'scheduled' },
      { label: 'In Progress', value: 7, key: 'progress' },
      { label: 'Completed', value: 12, key: 'completed' },
      { label: 'Pending', value: 4, key: 'pending' },
      { label: 'Cancelled', value: 2, key: 'cancelled' },
    ],
    []
  );

  return (
    <div className="cal-page">
      <div className="cal-breadcrumb">
        <span className="crumb-active">Dashboard</span>
        <ChevronRight size={14} className="crumb-sep" />
        <span>Bookings</span>
        <ChevronRight size={14} className="crumb-sep" />
        <span>Booking Calendar</span>
      </div>

      <div className="cal-header">
        <div>
          <h1 className="page-title">Booking Calendar</h1>
          <p className="page-subtitle">View and manage bookings by schedule.</p>
        </div>
        <div className="cal-header-actions">
          <button className="btn btn-outline">
            <Calendar size={16} />
            Today
          </button>
          <div className="view-select">
            <span>{viewMode}</span>
            <ChevronDown size={14} />
          </div>
          <div className="nav-arrows">
            <button className="icon-btn">
              <ChevronLeft size={16} />
            </button>
            <button className="icon-btn">
              <ChevronRight size={16} />
            </button>
          </div>
          <button className="btn btn-primary">
            <Plus size={18} />
            Create Booking
          </button>
        </div>
      </div>

      <div className="cal-layout">
        <aside className="cal-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-card-title">
              <User size={16} />
              Technician Filter
            </div>
            <select value={technician} onChange={(e) => setTechnician(e.target.value)}>
              <option>All Technicians</option>
              <option>Amit Kumar</option>
              <option>Vikram Singh</option>
              <option>Rahul Mehta</option>
            </select>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-card-title">
              <Filter size={16} />
              Status Filter
            </div>
            <div className="status-checklist">
              {STATUS_OPTIONS.map((status) => (
                <label className={`status-check status-check-${STATUS_KEY_MAP[status]}`} key={status}>
                  <input
                    type="checkbox"
                    checked={activeStatuses.includes(status)}
                    onChange={() => toggleStatus(status)}
                  />
                  <span className="checkmark" />
                  {status}
                </label>
              ))}
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-card-title">
              <BarChart3 size={16} />
              Quick Stats
            </div>
            <div className="quick-stats">
              {stats.map((s) => (
                <div className="quick-stat-row" key={s.key}>
                  <span>{s.label}</span>
                  <span className={`quick-stat-value quick-stat-${s.key}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="cal-main">
          <div className="cal-month-nav">
            <button className="icon-btn">
              <ChevronLeft size={18} />
            </button>
            <span className="cal-month-label">{MONTH_NAME}</span>
            <button className="icon-btn">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="cal-grid">
            <div className="cal-grid-header">
              {WEEKDAYS.map((wd) => (
                <div className="cal-weekday" key={wd}>
                  {wd}
                </div>
              ))}
            </div>
            <div className="cal-grid-body">
              {CALENDAR_WEEKS.map((week, wi) => (
                <div className="cal-week-row" key={wi}>
                  {week.map((cell, ci) => (
                    <div className={`cal-cell ${cell.muted ? 'cal-cell-muted' : ''}`} key={ci}>
                      <span className={`cal-day-num ${cell.today ? 'cal-day-today' : ''}`}>{cell.day}</span>
                      <div className="cal-events">
                        {cell.events &&
                          cell.events
                            .filter((ev) => isVisible(ev.status))
                            .map((ev, ei) => (
                              <div className={`cal-event cal-event-${ev.status}`} key={ei}>
                                <span className="cal-event-time">{ev.time}</span>
                                <span className="cal-event-title">{ev.title}</span>
                                <span className="cal-event-place">{ev.place}</span>
                              </div>
                            ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="cal-legend">
            <div className="legend-item">
              <span className="legend-dot legend-scheduled" /> Scheduled
            </div>
            <div className="legend-item">
              <span className="legend-dot legend-progress" /> In Progress
            </div>
            <div className="legend-item">
              <span className="legend-dot legend-completed" /> Completed
            </div>
            <div className="legend-item">
              <span className="legend-dot legend-pending" /> Pending
            </div>
            <div className="legend-item">
              <span className="legend-dot legend-cancelled" /> Cancelled
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
