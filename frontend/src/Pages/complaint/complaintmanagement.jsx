import React, { useState, useMemo } from 'react';
import {
  Bug,
  Clock,
  User,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  ChevronDown,
  Plus,
  Download,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  Camera,
  Wrench,
  ClipboardList,
  Building,
  X,
} from 'lucide-react';
import './complaintmanagement.css';

// ----------------------------------------------------------------------------
// Static reference data (would normally come from an API)
// ----------------------------------------------------------------------------

const STATS = [
  {
    id: 'total',
    label: 'Total Complaints',
    value: '1,248',
    trend: '+18.2%',
    trendLabel: 'vs last month',
    trendDirection: 'up',
    icon: Bug,
    tone: 'accent',
  },
  {
    id: 'pending',
    label: 'Pending',
    value: '214',
    trend: '+8.7%',
    trendLabel: 'vs last month',
    trendDirection: 'up',
    icon: Clock,
    tone: 'warning',
  },
  {
    id: 'in-progress',
    label: 'In Progress',
    value: '362',
    trend: '+12.5%',
    trendLabel: 'vs last month',
    trendDirection: 'up',
    icon: User,
    tone: 'info',
  },
  {
    id: 'resolved',
    label: 'Resolved',
    value: '642',
    trend: '+25.1%',
    trendLabel: 'vs last month',
    trendDirection: 'up',
    icon: CheckCircle,
    tone: 'success',
  },
  {
    id: 'emergency',
    label: 'Emergency',
    value: '30',
    trend: '+15.3%',
    trendLabel: 'vs last month',
    trendDirection: 'up',
    icon: AlertTriangle,
    tone: 'danger',
  },
];

const COMPLAINTS = [
  {
    id: 'CMP-2024-1250',
    customer: 'Rahul Kumar',
    phone: '9876543210',
    email: 'rahul.kumar@email.com',
    property: 'Sunrise Apartments',
    address: 'Andheri West, Mumbai, Maharashtra - 400058',
    city: 'Mumbai, MH',
    pest: 'Cockroach',
    infestation: 'High Infestation',
    category: 'General Pest Control',
    categoryType: 'Residential',
    priority: 'High',
    status: 'In Progress',
    date: '24 May 2024',
    time: '10:30 AM',
    technician: 'Suresh Yadav',
    technicianPhone: '8899776655',
    scheduledDate: '25 May 2024',
    scheduledTime: '11:00 AM - 01:00 PM',
    description:
      'Cockroach infestation in kitchen and bathroom area. Seen multiple cockroaches in cabinets and drain area.',
    attachments: 3,
  },
  {
    id: 'CMP-2024-1249',
    customer: 'Priya Patel',
    phone: '8765432109',
    email: 'priya.patel@email.com',
    property: 'Green Valley Society',
    address: 'Baner, Pune, Maharashtra - 411045',
    city: 'Pune, MH',
    pest: 'Termite',
    infestation: 'Medium Infestation',
    category: 'Termite Control',
    categoryType: 'Residential',
    priority: 'Medium',
    status: 'Assigned',
    date: '24 May 2024',
    time: '09:15 AM',
    technician: 'Rakesh Jadhav',
    technicianPhone: '8877665544',
    scheduledDate: '26 May 2024',
    scheduledTime: '10:00 AM - 12:00 PM',
    description: 'Termite damage noticed near wooden furniture and skirting boards in the living room.',
    attachments: 2,
  },
  {
    id: 'CMP-2024-1248',
    customer: 'Amit Mishra',
    phone: '7654321098',
    email: 'amit.mishra@email.com',
    property: 'Lotus Corporate Park',
    address: 'Whitefield, Bangalore, Karnataka - 560066',
    city: 'Bangalore, KA',
    pest: 'Rodent',
    infestation: 'High Infestation',
    category: 'Rodent Control',
    categoryType: 'Commercial',
    priority: 'High',
    status: 'Scheduled',
    date: '23 May 2024',
    time: '04:45 PM',
    technician: 'Manoj Verma',
    technicianPhone: '8866554433',
    scheduledDate: '27 May 2024',
    scheduledTime: '09:00 AM - 11:00 AM',
    description: 'Rodent droppings and gnaw marks found in the server room and pantry area.',
    attachments: 4,
  },
  {
    id: 'CMP-2024-1247',
    customer: 'Sneha Singh',
    phone: '6543210987',
    email: 'sneha.singh@email.com',
    property: 'Ocean View Heights',
    address: 'ECR, Chennai, Tamil Nadu - 600041',
    city: 'Chennai, TN',
    pest: 'Mosquito',
    infestation: 'Low Infestation',
    category: 'Mosquito Control',
    categoryType: 'Residential',
    priority: 'Low',
    status: 'Pending',
    date: '23 May 2024',
    time: '02:20 PM',
    technician: 'Unassigned',
    technicianPhone: '-',
    scheduledDate: 'Not scheduled',
    scheduledTime: '-',
    description: 'Increased mosquito activity near the balcony and stagnant water in the terrace garden.',
    attachments: 1,
  },
  {
    id: 'CMP-2024-1246',
    customer: 'Dinesh Sharma',
    phone: '5432109876',
    email: 'dinesh.sharma@email.com',
    property: 'Royal Plaza',
    address: 'Banjara Hills, Hyderabad, Telangana - 500034',
    city: 'Hyderabad, TS',
    pest: 'Cockroach',
    infestation: 'Medium Infestation',
    category: 'General Pest Control',
    categoryType: 'Commercial',
    priority: 'Medium',
    status: 'In Progress',
    date: '22 May 2024',
    time: '11:10 AM',
    technician: 'Kiran Reddy',
    technicianPhone: '8855443322',
    scheduledDate: '23 May 2024',
    scheduledTime: '01:00 PM - 03:00 PM',
    description: 'Recurring cockroach sighting in the basement food court kitchens.',
    attachments: 2,
  },
  {
    id: 'CMP-2024-1245',
    customer: 'Neha Gupta',
    phone: '4321098765',
    email: 'neha.gupta@email.com',
    property: 'Maple Residence',
    address: 'Vasant Kunj, Delhi - 110070',
    city: 'Delhi, DL',
    pest: 'Bed Bug',
    infestation: 'High Infestation',
    category: 'Bed Bug Treatment',
    categoryType: 'Residential',
    priority: 'High',
    status: 'Completed',
    date: '22 May 2024',
    time: '09:30 AM',
    technician: 'Arjun Nair',
    technicianPhone: '8844332211',
    scheduledDate: '22 May 2024',
    scheduledTime: '09:30 AM - 12:30 PM',
    description: 'Bed bugs found in the master bedroom mattress and along the bed frame.',
    attachments: 3,
  },
  {
    id: 'CMP-2024-1244',
    customer: 'Vikram Bhatt',
    phone: '3210987654',
    email: 'vikram.bhatt@email.com',
    property: 'Silver Oak Building',
    address: 'Salt Lake, Kolkata, West Bengal - 700064',
    city: 'Kolkata, WB',
    pest: 'Termite',
    infestation: 'Medium Infestation',
    category: 'Termite Control',
    categoryType: 'Commercial',
    priority: 'Medium',
    status: 'Cancelled',
    date: '21 May 2024',
    time: '05:25 PM',
    technician: 'Unassigned',
    technicianPhone: '-',
    scheduledDate: 'Not scheduled',
    scheduledTime: '-',
    description: 'Customer cancelled the visit due to rescheduling of office renovation.',
    attachments: 0,
  },
];

const STATUS_OPTIONS = ['All Status', 'Pending', 'Assigned', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'];
const PRIORITY_OPTIONS = ['All Priority', 'High', 'Medium', 'Low'];
const PEST_OPTIONS = ['All Pest Type', 'Cockroach', 'Termite', 'Rodent', 'Mosquito', 'Bed Bug'];
const DATE_OPTIONS = ['All Time', 'Today', 'This Week', 'This Month', 'Custom Range'];

const STATUS_CLASS = {
  Pending: 'status-pending',
  Assigned: 'status-assigned',
  Scheduled: 'status-scheduled',
  'In Progress': 'status-progress',
  Completed: 'status-completed',
  Cancelled: 'status-cancelled',
};

const PRIORITY_CLASS = {
  High: 'priority-high',
  Medium: 'priority-medium',
  Low: 'priority-low',
};

const getInitials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

// ----------------------------------------------------------------------------
// Small presentational helpers
// ----------------------------------------------------------------------------

const Dropdown = ({ label, icon: Icon, options, value, onChange }) => (
  <div className="filter-dropdown">
    {Icon && <Icon size={16} className="filter-dropdown__icon" />}
    <select
      className="filter-dropdown__select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <ChevronDown size={16} className="filter-dropdown__chevron" />
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`badge ${STATUS_CLASS[status] || ''}`}>{status}</span>
);

const PriorityBadge = ({ priority }) => (
  <span className={`badge badge--dot ${PRIORITY_CLASS[priority] || ''}`}>{priority}</span>
);

// ----------------------------------------------------------------------------
// Main component
// ----------------------------------------------------------------------------

const ComplaintManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');
  const [pestFilter, setPestFilter] = useState('All Pest Type');
  const [dateFilter, setDateFilter] = useState('All Time');
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeComplaintId, setActiveComplaintId] = useState(COMPLAINTS[0].id);
  const [activeTab, setActiveTab] = useState('details');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredComplaints = useMemo(() => {
    return COMPLAINTS.filter((c) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm);
      const matchesStatus = statusFilter === 'All Status' || c.status === statusFilter;
      const matchesPriority = priorityFilter === 'All Priority' || c.priority === priorityFilter;
      const matchesPest = pestFilter === 'All Pest Type' || c.pest === pestFilter;
      return matchesSearch && matchesStatus && matchesPriority && matchesPest;
    });
  }, [searchTerm, statusFilter, priorityFilter, pestFilter]);

  const activeComplaint =
    COMPLAINTS.find((c) => c.id === activeComplaintId) || COMPLAINTS[0];

  const allSelected =
    filteredComplaints.length > 0 && selectedIds.length === filteredComplaints.length;

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : filteredComplaints.map((c) => c.id));
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const openComplaint = (id) => {
    setActiveComplaintId(id);
    setActiveTab('details');
  };

  return (
    <div className="complaint-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href="#home" className="breadcrumb__link">
          Home
        </a>
        <span className="breadcrumb__separator">/</span>
        <a href="#complaints" className="breadcrumb__link">
          Complaints
        </a>
        <span className="breadcrumb__separator">/</span>
        <span className="breadcrumb__current">Complaint Management</span>
      </nav>

      {/* Page header */}
      <header className="page-header">
        <div>
          <h1 className="page-header__title">Complaint Management</h1>
          <p className="page-header__subtitle">
            Track, manage and resolve pest control complaints efficiently
          </p>
        </div>
        <div className="page-header__actions">
          <button type="button" className="btn btn--primary">
            <Plus size={16} />
            New Complaint
            <ChevronDown size={14} />
          </button>
          <button type="button" className="btn btn--outline">
            <Download size={16} />
            Export
          </button>
        </div>
      </header>

      {/* Stats cards */}
      <section className="stats-grid" aria-label="Complaint statistics">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="stat-card" key={stat.id}>
              <div className={`stat-card__icon stat-card__icon--${stat.tone}`}>
                <Icon size={20} />
              </div>
              <div className="stat-card__body">
                <span className="stat-card__label">{stat.label}</span>
                <span className="stat-card__value">{stat.value}</span>
                <span className={`stat-card__trend stat-card__trend--${stat.trendDirection}`}>
                  ↑ {stat.trend}
                  <span className="stat-card__trend-label"> vs last month</span>
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Search & filters */}
      <section className="toolbar" aria-label="Search and filters">
        <div className="search-field">
          <Search size={16} className="search-field__icon" />
          <input
            type="text"
            className="search-field__input"
            placeholder="Search by complaint ID, customer name, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Dropdown
          label="Filter by status"
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <Dropdown
          label="Filter by priority"
          options={PRIORITY_OPTIONS}
          value={priorityFilter}
          onChange={setPriorityFilter}
        />
        <Dropdown
          label="Filter by pest type"
          options={PEST_OPTIONS}
          value={pestFilter}
          onChange={setPestFilter}
        />
        <Dropdown
          label="Filter by date range"
          icon={Calendar}
          options={DATE_OPTIONS}
          value={dateFilter}
          onChange={setDateFilter}
        />
      </section>

      {/* Content: table + details panel */}
      <section className="content-grid">
        {/* Data table */}
        <div className="table-card">
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="col-checkbox">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      aria-label="Select all complaints"
                    />
                  </th>
                  <th>Complaint ID</th>
                  <th>Customer</th>
                  <th>Property</th>
                  <th>Pest Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date &amp; Time</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={9}>
                      <div className="empty-state">
                        <ClipboardList size={32} />
                        <p className="empty-state__title">No complaints found</p>
                        <p className="empty-state__text">
                          Try adjusting your search or filters to find what you're looking for.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((c) => (
                    <tr
                      key={c.id}
                      className={`data-table__row ${
                        c.id === activeComplaintId ? 'data-table__row--active' : ''
                      }`}
                      onClick={() => openComplaint(c.id)}
                    >
                      <td onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(c.id)}
                          onChange={() => toggleSelectRow(c.id)}
                          aria-label={`Select complaint ${c.id}`}
                        />
                      </td>
                      <td>
                        <span className="cell-link">{c.id}</span>
                      </td>
                      <td>
                        <div className="customer-cell">
                          <span className="avatar">{getInitials(c.customer)}</span>
                          <div className="customer-cell__info">
                            <span className="customer-cell__name">{c.customer}</span>
                            <span className="customer-cell__phone">{c.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="property-cell">
                          <span className="property-cell__name">{c.property}</span>
                          <span className="property-cell__city">
                            <MapPin size={12} /> {c.city}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="pest-cell">
                          <Bug size={14} /> {c.pest}
                        </span>
                      </td>
                      <td>
                        <PriorityBadge priority={c.priority} />
                      </td>
                      <td>
                        <StatusBadge status={c.status} />
                      </td>
                      <td>
                        <div className="datetime-cell">
                          <span>{c.date}</span>
                          <span className="datetime-cell__time">{c.time}</span>
                        </div>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="icon-btn"
                            onClick={() => openComplaint(c.id)}
                            aria-label={`View ${c.id}`}
                          >
                            <Eye size={16} />
                          </button>
                          <button type="button" className="icon-btn" aria-label={`More actions for ${c.id}`}>
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span className="table-footer__summary">
              Showing 1 to {Math.min(rowsPerPage, filteredComplaints.length)} of {COMPLAINTS.length * 178}{' '}
              entries
            </span>
            <div className="pagination">
              <button
                type="button"
                className="pagination__nav"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`pagination__page ${currentPage === page ? 'pagination__page--active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <span className="pagination__ellipsis">…</span>
              <button
                type="button"
                className={`pagination__page ${currentPage === 178 ? 'pagination__page--active' : ''}`}
                onClick={() => setCurrentPage(178)}
              >
                178
              </button>
              <button
                type="button"
                className="pagination__nav"
                onClick={() => setCurrentPage((p) => Math.min(178, p + 1))}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="rows-per-page">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                aria-label="Rows per page"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Details panel */}
        <aside className="details-card">
          <div className="details-card__tabs">
            <button
              type="button"
              className={`details-tab ${activeTab === 'details' ? 'details-tab--active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Complaint Details
            </button>
            <button
              type="button"
              className={`details-tab ${activeTab === 'resolve' ? 'details-tab--active' : ''}`}
              onClick={() => setActiveTab('resolve')}
            >
              Resolve Complaint
            </button>
          </div>

          {activeTab === 'details' ? (
            <div className="details-card__body">
              <div className="details-card__top">
                <div>
                  <span className="details-card__eyebrow">Complaint ID</span>
                  <h2 className="details-card__id">{activeComplaint.id}</h2>
                </div>
                <PriorityBadge priority={activeComplaint.priority} />
              </div>

              <div className="details-card__meta">
                <div>
                  <span className="details-card__eyebrow">Status</span>
                  <div className="details-card__meta-value">
                    <StatusBadge status={activeComplaint.status} />
                  </div>
                </div>
                <div>
                  <span className="details-card__eyebrow">Reported On</span>
                  <div className="details-card__meta-value">
                    {activeComplaint.date}, {activeComplaint.time}
                  </div>
                </div>
              </div>

              <DetailSection icon={User} title="Customer Information">
                <p className="detail-primary">{activeComplaint.customer}</p>
                <p className="detail-line">
                  <Phone size={13} /> {activeComplaint.phone}
                </p>
                <p className="detail-line">
                  <Mail size={13} /> {activeComplaint.email}
                </p>
              </DetailSection>

              <DetailSection icon={Building} title="Property Details">
                <p className="detail-primary">{activeComplaint.property}</p>
                <p className="detail-line">
                  <MapPin size={13} /> {activeComplaint.address}
                </p>
              </DetailSection>

              <div className="detail-columns">
                <DetailSection icon={Bug} title="Pest Type">
                  <p className="detail-primary">{activeComplaint.pest}</p>
                  <p className="detail-line detail-line--muted">{activeComplaint.infestation}</p>
                </DetailSection>
                <DetailSection icon={ClipboardList} title="Service Category">
                  <p className="detail-primary">{activeComplaint.category}</p>
                  <p className="detail-line detail-line--muted">{activeComplaint.categoryType}</p>
                </DetailSection>
              </div>

              <div className="detail-columns">
                <DetailSection icon={Wrench} title="Assigned Technician">
                  <p className="detail-primary">{activeComplaint.technician}</p>
                  <p className="detail-line detail-line--muted">{activeComplaint.technicianPhone}</p>
                </DetailSection>
                <DetailSection icon={Calendar} title="Scheduled Date">
                  <p className="detail-primary">{activeComplaint.scheduledDate}</p>
                  <p className="detail-line detail-line--muted">{activeComplaint.scheduledTime}</p>
                </DetailSection>
              </div>

              <DetailSection icon={FileText} title="Description">
                <p className="detail-line detail-line--wrap">{activeComplaint.description}</p>
              </DetailSection>

              <div className="detail-section">
                <div className="detail-section__heading">
                  <Camera size={14} />
                  <span>Attachments</span>
                </div>
                <div className="attachments-grid">
                  {Array.from({ length: activeComplaint.attachments }).map((_, idx) => (
                    <div className="attachment-thumb" key={idx}>
                      <Camera size={18} />
                    </div>
                  ))}
                  <button type="button" className="attachment-add">
                    <Plus size={16} />
                    Add More
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <ResolveComplaintForm complaint={activeComplaint} />
          )}
        </aside>
      </section>
    </div>
  );
};

const DetailSection = ({ icon: Icon, title, children }) => (
  <div className="detail-section">
    <div className="detail-section__heading">
      <Icon size={14} />
      <span>{title}</span>
    </div>
    {children}
  </div>
);

const ResolveComplaintForm = ({ complaint }) => {
  const [status, setStatus] = useState('In Progress');
  const [notes, setNotes] = useState('');

  return (
    <form
      className="resolve-form"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="details-card__top">
        <div>
          <span className="details-card__eyebrow">Resolving</span>
          <h2 className="details-card__id">{complaint.id}</h2>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="resolution-status">Update Status</label>
        <div className="filter-dropdown filter-dropdown--full">
          <select
            id="resolution-status"
            className="filter-dropdown__select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.filter((s) => s !== 'All Status').map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="filter-dropdown__chevron" />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="resolution-date">Resolution Date</label>
        <div className="input-with-icon">
          <Calendar size={15} />
          <input id="resolution-date" type="date" />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="resolution-time">Resolution Time</label>
        <div className="input-with-icon">
          <Clock size={15} />
          <input id="resolution-time" type="time" />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="technician-remarks">Technician Remarks</label>
        <textarea
          id="technician-remarks"
          rows={4}
          placeholder="Describe the treatment applied and outcome..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="proof-upload">Upload Proof</label>
        <label htmlFor="proof-upload" className="upload-dropzone">
          <Camera size={20} />
          <span>Click to upload photos of completed work</span>
          <input id="proof-upload" type="file" accept="image/*" multiple hidden />
        </label>
      </div>

      <div className="resolve-form__actions">
        <button type="button" className="btn btn--outline">
          Save Draft
        </button>
        <button type="submit" className="btn btn--success">
          <CheckCircle size={16} />
          Mark as Resolved
        </button>
      </div>
    </form>
  );
};

export default ComplaintManagement;