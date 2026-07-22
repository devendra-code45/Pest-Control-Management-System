import React, { useState } from "react";
import {useNavigate} from 'react-router-dom';
import {
  Home,
  ChevronRight,
  Plus,
  Download,
  Filter as FilterIcon,
  Users,
  CheckCircle,
  Truck,
  Calendar,
  AlertTriangle,
  Search,
  ChevronDown,
  MapPin,
  Phone,
  Clock,
  Eye,
  Pencil,
  CalendarClock,
  MoreVertical,
  ChevronLeft,
} from "lucide-react";
import "./technicianmanagement.css";

/* ---------------- Mock Data ---------------- */
const STAT_CARDS = [
  {
    icon: Users,
    label: "Total Technicians",
    value: "186",
    note: "+12 this month",
    tone: "primary",
    positive: true,
  },
  {
    icon: CheckCircle,
    label: "Available",
    value: "102",
    note: "Ready for assignment",
    tone: "success",
  },
  {
    icon: Truck,
    label: "On Service",
    value: "58",
    note: "Currently working",
    tone: "primary",
  },
  {
    icon: Calendar,
    label: "Scheduled Today",
    value: "74",
    note: "Today's visits",
    tone: "primary",
  },
  {
    icon: AlertTriangle,
    label: "Emergency Assigned",
    value: "8",
    note: "High priority",
    tone: "danger",
  },
];

const TECHNICIANS = [
  {
    id: "EMP-1004",
    name: "Rahul Sharma",
    role: "Senior Technician",
    phone: "9876543210",
    region: "North Zone",
    skills: ["General Pest", "Termite"],
    experience: "5 Years",
    jobs: "6 Jobs",
    availability: "Available",
    status: "Active",
    lastActivity: "10 min ago",
  },
  {
    id: "EMP-1007",
    name: "Amit Verma",
    role: "Field Technician",
    phone: "9876543211",
    region: "West Zone",
    skills: ["Rodent", "General Pest"],
    experience: "3 Years",
    jobs: "4 Jobs",
    availability: "Busy",
    status: "Active",
    lastActivity: "25 min ago",
  },
  {
    id: "EMP-1012",
    name: "Sunil Patil",
    role: "Pest Control Tech",
    phone: "9876543212",
    region: "South Zone",
    skills: ["Rodent", "Bed Bug"],
    experience: "4 Years",
    jobs: "5 Jobs",
    availability: "On Service",
    status: "Active",
    lastActivity: "5 min ago",
  },
  {
    id: "EMP-1016",
    name: "Neha Gupta",
    role: "Junior Technician",
    phone: "9876543213",
    region: "East Zone",
    skills: ["General Pest", "Cockroach"],
    experience: "2 Years",
    jobs: "3 Jobs",
    availability: "Available",
    status: "Training",
    lastActivity: "1 hour ago",
  },
  {
    id: "EMP-1021",
    name: "Rakesh Singh",
    role: "Senior Technician",
    phone: "9876543214",
    region: "Central Zone",
    skills: ["Termite", "Wood Pest"],
    experience: "6 Years",
    jobs: "7 Jobs",
    availability: "Busy",
    status: "Active",
    lastActivity: "15 min ago",
  },
];

const SKILL_TONE = {
  "General Pest": "green",
  Termite: "amber",
  Rodent: "slate",
  "Bed Bug": "blue",
  Cockroach: "violet",
  "Wood Pest": "amber",
};

const AVAILABILITY_TONE = {
  Available: "success",
  Busy: "warning",
  "On Service": "danger",
};

const STATUS_TONE = {
  Active: "success",
  Training: "info",
};

const initials = (name) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/* ---------------- Small Reusable Bits ---------------- */
// Compact inline filter: label + select live inside one small bordered
// pill so the whole toolbar reads as a single row instead of stacked
// label/control pairs.
const FilterSelect = ({ label, options }) => (
  <div className="tm-filter">
    <span className="tm-filter-label">{label}</span>
    <div className="tm-select-wrap">
      <select className="tm-select" defaultValue={options[0]} title={label}>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown size={13} className="tm-select-caret" />
    </div>
  </div>
);

const Badge = ({ tone, children, dot }) => (
  <span className={`tm-badge tm-badge-${tone}`}>
    {dot && <span className="tm-badge-dot" />}
    {children}
  </span>
);

export default function TechniciansManagement() {
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  const toggleAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(TECHNICIANS.map((t) => t.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="tm-page">
      {/* Breadcrumb */}
      <div className="tm-breadcrumb">
        <Home size={14} />
        <span>Home</span>
        <ChevronRight size={13} className="tm-crumb-sep" />
        <span>Technicians</span>
        <ChevronRight size={13} className="tm-crumb-sep" />
        <span className="tm-crumb-active">Management</span>
      </div>

      {/* Page Header */}
      <div className="tm-page-header">
        <div>
          <h1 className="tm-title">Technicians Management</h1>
          <p className="tm-subtitle">
            Manage technician profiles, assignments and schedules.
          </p>
        </div>
        <div className="tm-header-actions">
          <button type="button" className="tm-btn tm-btn-primary" onClick={() => navigate("/admin/technicians/add")}>
            <Plus size={16} />
            Add Technician
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="tm-stats-grid">
        {STAT_CARDS.map((card) => (
          <div className="tm-stat-card" key={card.label}>
            <span className={`tm-stat-icon tm-tone-${card.tone}`}>
              <card.icon size={19} />
            </span>
            <div className="tm-stat-body">
              <span className="tm-stat-label">{card.label}</span>
              <span className="tm-stat-value">{card.value}</span>
              <span
                className={`tm-stat-note ${
                  card.positive ? "is-positive" : ""
                }`}
              >
                {card.note}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters — single compact row */}
      <div className="tm-toolbar">
        <div className="tm-search">
          <Search size={15} className="tm-search-icon" />
          <input
            type="text"
            className="tm-search-input"
            placeholder="Search name, ID, phone..."
          />
        </div>

        <div className="tm-toolbar-divider" />

        <FilterSelect label="Dept" options={["All Departments", "Residential", "Commercial", "Termite Control"]} />
        <FilterSelect label="Region" options={["All Regions", "North Zone", "South Zone", "East Zone", "West Zone", "Central Zone"]} />
        <FilterSelect label="Availability" options={["All", "Available", "Busy", "On Service"]} />
        <FilterSelect label="Status" options={["All Status", "Active", "Training", "Inactive"]} />
        <FilterSelect label="Skill" options={["All Skills", "General Pest", "Termite", "Rodent", "Bed Bug"]} />

        <div className="tm-toolbar-actions">
          <button type="button" className="tm-btn tm-btn-primary tm-btn-sm">
            Search
          </button>
          <button type="button" className="tm-btn tm-btn-outline tm-btn-sm">
            Reset
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="tm-table-card">
        <div className="tm-table-header">
          <h3>Technicians List</h3>
        </div>

        <div className="tm-table-scroll">
          <table className="tm-table">
            <thead>
              <tr>
                <th className="tm-col-check">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleAll}
                  />
                </th>
                <th>Technician</th>
                <th>Employee ID</th>
                <th>Phone</th>
                <th>Region</th>
                <th>Skills</th>
                <th>Experience</th>
                <th>Today's Jobs</th>
                <th>Availability</th>
                <th>Status</th>
                <th>Last Activity</th>
                <th className="tm-col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {TECHNICIANS.map((tech) => (
                <tr key={tech.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(tech.id)}
                      onChange={() => toggleRow(tech.id)}
                    />
                  </td>
                  <td>
                    <div className="tm-tech-cell">
                      <span className="tm-avatar">{initials(tech.name)}</span>
                      <div className="tm-tech-info">
                        <span className="tm-tech-name">{tech.name}</span>
                        <span className="tm-tech-role">{tech.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className="tm-muted">{tech.id}</td>
                  <td>
                    <span className="tm-cell-icon-text">
                      <Phone size={14} />
                      {tech.phone}
                    </span>
                  </td>
                  <td>
                    <span className="tm-cell-icon-text">
                      <MapPin size={14} />
                      {tech.region}
                    </span>
                  </td>
                  <td>
                    <div className="tm-skill-list">
                      {tech.skills.map((skill) => (
                        <span
                          key={skill}
                          className={`tm-skill-chip tm-skill-${
                            SKILL_TONE[skill] || "slate"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="tm-muted">{tech.experience}</td>
                  <td className="tm-muted">{tech.jobs}</td>
                  <td>
                    <Badge tone={AVAILABILITY_TONE[tech.availability]} dot>
                      {tech.availability}
                    </Badge>
                  </td>
                  <td>
                    <Badge tone={STATUS_TONE[tech.status] || "success"}>
                      {tech.status}
                    </Badge>
                  </td>
                  <td>
                    <span className="tm-cell-icon-text tm-muted">
                      <Clock size={14} />
                      {tech.lastActivity}
                    </span>
                  </td>
                  <td>
                    <div className="tm-actions">
                      <button type="button" className="tm-icon-btn" title="View" onClick={() => navigate("/admin/technicians/profile/")}>
                        <Eye size={16} />
                      </button>
                      <button type="button" className="tm-icon-btn" title="Edit" onClick={() => navigate("/admin/technicians/edit/")}>
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer: Pagination */}
        <div className="tm-table-footer">
          <span className="tm-entries-info">Showing 1 to 10 of 186 entries</span>

          <div className="tm-pagination">
            <button type="button" className="tm-page-btn" aria-label="Previous page">
              <ChevronLeft size={16} />
            </button>
            <button type="button" className="tm-page-btn is-active">1</button>
            <button type="button" className="tm-page-btn">2</button>
            <button type="button" className="tm-page-btn">3</button>
            <span className="tm-page-ellipsis">…</span>
            <button type="button" className="tm-page-btn">19</button>
            <button type="button" className="tm-page-btn" aria-label="Next page">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="tm-rows-per-page">
            <span>Rows per page</span>
            <div className="tm-select-wrap tm-select-wrap-sm">
              <select className="tm-select tm-select-standalone" defaultValue="10">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <ChevronDown size={14} className="tm-select-caret" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}