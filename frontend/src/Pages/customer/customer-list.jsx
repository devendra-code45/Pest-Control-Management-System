import React, { useState, useMemo } from "react";
import {
  Users,
  ShieldCheck,
  UserPlus,
  Building2,
  Clock,
  UserX,
  Search,
  Filter,
  RotateCw,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Eye,
  Pencil,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Upload,
  Plus,
} from "lucide-react";
import "./customer-list.css";

const STAT_CARDS = [
  {
    id: "total",
    label: "Total Customers",
    value: "1,248",
    trend: "up",
    trendLabel: "12.5% from last month",
    icon: Users,
  },
  {
    id: "active",
    label: "Active Customers",
    value: "892",
    trend: "up",
    trendLabel: "8.3% from last month",
    icon: ShieldCheck,
  },
  {
    id: "new",
    label: "New This Month",
    value: "78",
    trend: "up",
    trendLabel: "15.8% from last month",
    icon: UserPlus,
  },
  {
    id: "locations",
    label: "Service Locations",
    value: "1,425",
    trend: "up",
    trendLabel: "10.4% from last month",
    icon: Building2,
  },
  {
    id: "pending",
    label: "Pending Follow Ups",
    value: "36",
    trend: "down",
    trendLabel: "4.2% from last month",
    icon: Clock,
  },
  {
    id: "inactive",
    label: "Inactive Customers",
    value: "124",
    trend: "down",
    trendLabel: "6.1% from last month",
    icon: UserX,
  },
];

const CUSTOMERS = [
  {
    id: 1,
    initials: "JS",
    name: "John Smith",
    subtitle: "Smith Residence",
    phone: "(555) 123-4567",
    email: "john.smith@email.com",
    address: "123 Green Valley Rd",
    city: "San Jose, CA 95123",
    type: "Residential",
    totalServices: 12,
    lastService: "May 12, 2025",
    lastServiceRelative: "2 days ago",
    status: "Active",
    assignedTo: "Mike Johnson",
  },
  {
    id: 2,
    initials: "BC",
    name: "Bright Clean Ltd.",
    subtitle: "Commercial Building",
    phone: "(555) 987-6543",
    email: "contact@brightclean.com",
    address: "456 Business Park Dr",
    city: "San Jose, CA 95110",
    type: "Commercial",
    totalServices: 28,
    lastService: "May 10, 2025",
    lastServiceRelative: "4 days ago",
    status: "Active",
    assignedTo: "Sarah Wilson",
  },
  {
    id: 3,
    initials: "MW",
    name: "Maria White",
    subtitle: "White Residence",
    phone: "(555) 456-7890",
    email: "maria.white@email.com",
    address: "789 Oak Street",
    city: "San Jose, CA 95125",
    type: "Residential",
    totalServices: 8,
    lastService: "May 08, 2025",
    lastServiceRelative: "6 days ago",
    status: "Active",
    assignedTo: "David Brown",
  },
  {
    id: 4,
    initials: "GP",
    name: "Green Park Hotel",
    subtitle: "Hotel & Restaurant",
    phone: "(555) 321-0987",
    email: "manager@greenpark.com",
    address: "321 Hotel Plaza",
    city: "San Jose, CA 95113",
    type: "Commercial",
    totalServices: 45,
    lastService: "May 05, 2025",
    lastServiceRelative: "9 days ago",
    status: "In Progress",
    assignedTo: "Mike Johnson",
  },
  {
    id: 5,
    initials: "AD",
    name: "Alex Davis",
    subtitle: "Davis Residence",
    phone: "(555) 654-3210",
    email: "alex.davis@email.com",
    address: "654 Pine Avenue",
    city: "San Jose, CA 95127",
    type: "Residential",
    totalServices: 5,
    lastService: "Apr 28, 2025",
    lastServiceRelative: "16 days ago",
    status: "Active",
    assignedTo: "Sarah Wilson",
  },
  {
    id: 6,
    initials: "TC",
    name: "Tech Corp Inc.",
    subtitle: "Corporate Office",
    phone: "(555) 111-2222",
    email: "info@techcorp.com",
    address: "1000 Innovation Way",
    city: "San Jose, CA 95134",
    type: "Commercial",
    totalServices: 32,
    lastService: "Apr 25, 2025",
    lastServiceRelative: "19 days ago",
    status: "Active",
    assignedTo: "David Brown",
  },
  {
    id: 7,
    initials: "RB",
    name: "Robert Brown",
    subtitle: "Brown Residence",
    phone: "(555) 777-8888",
    email: "robert.brown@email.com",
    address: "987 Maple Drive",
    city: "San Jose, CA 95128",
    type: "Residential",
    totalServices: 3,
    lastService: "Apr 20, 2025",
    lastServiceRelative: "24 days ago",
    status: "Inactive",
    assignedTo: "Mike Johnson",
  },
  {
    id: 8,
    initials: "FH",
    name: "Food Hub Restaurant",
    subtitle: "Restaurant",
    phone: "(555) 333-4444",
    email: "owner@foodhub.com",
    address: "555 Food Street",
    city: "San Jose, CA 95112",
    type: "Commercial",
    totalServices: 18,
    lastService: "Apr 18, 2025",
    lastServiceRelative: "26 days ago",
    status: "Inactive",
    assignedTo: "Sarah Wilson",
  },
];

const STATUS_STYLES = {
  Active: "status-badge status-active",
  "In Progress": "status-badge status-progress",
  Inactive: "status-badge status-inactive",
};

const TYPE_STYLES = {
  Residential: "type-badge type-residential",
  Commercial: "type-badge type-commercial",
};

function Avatar({ initials, seed }) {
  const hue = (seed * 47) % 360;
  return (
    <div
      className="customer-avatar"
      style={{
        background: `linear-gradient(135deg, hsl(${hue}, 55%, 88%), hsl(${hue}, 45%, 78%))`,
      }}
    >
      {initials}
    </div>
  );
}

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [technicianFilter, setTechnicianFilter] = useState("All Technicians");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCustomers = useMemo(() => {
    return CUSTOMERS.filter((customer) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm);

      const matchesStatus =
        statusFilter === "All Status" || customer.status === statusFilter;

      const matchesType =
        typeFilter === "All Types" || customer.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchTerm, statusFilter, typeFilter]);

  const allSelected =
    filteredCustomers.length > 0 &&
    selectedRows.length === filteredCustomers.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredCustomers.map((c) => c.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div className="customers-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Customers</h1>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item breadcrumb-active">Customers</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item">Customer List</span>
          </nav>
          <p className="page-subtitle">
            Manage all your customers, their properties, service history, and
            communication details.
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-outline">
            <Upload size={16} />
            Import Customers
          </button>
          <button className="btn btn-primary">
            <Plus size={16} />
            Add New Customer
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        {STAT_CARDS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="stat-card" key={stat.id}>
              <div className="stat-icon">
                <Icon size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
                <span
                  className={`stat-trend ${
                    stat.trend === "up" ? "trend-up" : "trend-down"
                  }`}
                >
                  {stat.trend === "up" ? "↑" : "↓"} {stat.trendLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="filters-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search customers by name, email, phone, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Status</label>
          <div className="select-wrapper">
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>In Progress</option>
              <option>Inactive</option>
            </select>
            <ChevronDown size={16} className="select-chevron" />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Customer Type</label>
          <div className="select-wrapper">
            <select
              className="filter-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option>All Types</option>
              <option>Residential</option>
              <option>Commercial</option>
            </select>
            <ChevronDown size={16} className="select-chevron" />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Service Location</label>
          <div className="select-wrapper">
            <select
              className="filter-select"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option>All Locations</option>
              <option>San Jose, CA</option>
              <option>Santa Clara, CA</option>
              <option>Fremont, CA</option>
            </select>
            <ChevronDown size={16} className="select-chevron" />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Assigned To</label>
          <div className="select-wrapper">
            <select
              className="filter-select"
              value={technicianFilter}
              onChange={(e) => setTechnicianFilter(e.target.value)}
            >
              <option>All Technicians</option>
              <option>Mike Johnson</option>
              <option>Sarah Wilson</option>
              <option>David Brown</option>
            </select>
            <ChevronDown size={16} className="select-chevron" />
          </div>
        </div>

        <button className="btn btn-outline btn-more-filters">
          <Filter size={16} />
          More Filters
        </button>
        <button className="icon-btn" aria-label="Reset filters">
          <RotateCw size={16} />
        </button>
      </div>

      {/* Data Table */}
      <div className="table-card">
        <div className="table-scroll">
          <table className="customers-table">
            <thead>
              <tr>
                <th className="col-checkbox">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Customer</th>
                <th>Contact Details</th>
                <th>Location</th>
                <th>Customer Type</th>
                <th>Total Services</th>
                <th>Last Service</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => (
                <tr key={customer.id}>
                  <td className="col-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(customer.id)}
                      onChange={() => toggleSelectRow(customer.id)}
                    />
                  </td>
                  <td>
                    <div className="customer-cell">
                      <Avatar initials={customer.initials} seed={index + 1} />
                      <div className="customer-cell-text">
                        <span className="customer-name">{customer.name}</span>
                        <span className="customer-subtitle">
                          {customer.subtitle}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <span className="contact-line">
                        <Phone size={13} />
                        {customer.phone}
                      </span>
                      <span className="contact-line">
                        <Mail size={13} />
                        {customer.email}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="location-cell">
                      <span className="contact-line">
                        <MapPin size={13} />
                        {customer.address}
                      </span>
                      <span className="location-subtitle">
                        {customer.city}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={TYPE_STYLES[customer.type]}>
                      {customer.type}
                    </span>
                  </td>
                  <td className="cell-services">{customer.totalServices}</td>
                  <td>
                    <div className="last-service-cell">
                      <span>{customer.lastService}</span>
                      <span className="location-subtitle">
                        {customer.lastServiceRelative}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={STATUS_STYLES[customer.status]}>
                      <span className="status-dot" />
                      {customer.status}
                    </span>
                  </td>
                  <td>
                    <div className="assignee-cell">
                      <div className="assignee-avatar">
                        {customer.assignedTo
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </div>
                      <span>{customer.assignedTo}</span>
                    </div>
                  </td>
                  <td className="col-actions">
                    <div className="action-buttons">
                      <button className="action-icon-btn" aria-label="View customer">
                        <Eye size={16} />
                      </button>
                      <button className="action-icon-btn" aria-label="Edit customer">
                        <Pencil size={16} />
                      </button>
                      <button className="action-icon-btn" aria-label="More options">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={10}>
                    <div className="empty-state">
                      <Users size={32} />
                      <p className="empty-state-title">No customers found</p>
                      <p className="empty-state-subtitle">
                        Try adjusting your search or filters to find what
                        you're looking for.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="table-footer">
          <span className="table-summary">
            Showing 1 to {filteredCustomers.length} of 1,248 customers
          </span>
          <div className="pagination">
            <button className="pagination-btn" aria-label="Previous page">
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                className={`pagination-btn ${
                  currentPage === page ? "pagination-btn-active" : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <span className="pagination-ellipsis">...</span>
            <button className="pagination-btn">156</button>
            <button className="pagination-btn" aria-label="Next page">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="select-wrapper per-page-select">
            <select className="filter-select">
              <option>10 per page</option>
              <option>25 per page</option>
              <option>50 per page</option>
            </select>
            <ChevronDown size={16} className="select-chevron" />
          </div>
        </div>
      </div>
    </div>
  );
}