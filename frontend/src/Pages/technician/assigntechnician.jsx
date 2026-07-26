import React, { useState } from "react";
import {useNavigate} from 'react-router-dom';
import {
  Home,
  ChevronRight,
  ArrowLeft,
  UserCheck,
  ClipboardList,
  User,
  CalendarClock,
  PackageCheck,
  Building,
  MapPin,
  Bug,
  Wrench,
  Calendar,
  Search,
  ChevronDown,
  Star,
  Clock,
  Phone,
  Mail,
  Compass,
  Briefcase,
  FileText,
  Info,
  Check,
} from "lucide-react";
import "./AssignTechnician.css";

/* ---------------- Mock Data ---------------- */
const TECHNICIANS = [
  {
    id: "EMP-1004",
    name: "Rahul Sharma",
    role: "Senior Technician",
    experience: "5 Years",
    status: "Available",
    jobs: "2 / 6",
    rating: "4.8",
    phone: "9876543210",
    email: "rahul.sharma@example.com",
    region: "North Zone",
  },
  {
    id: "EMP-1007",
    name: "Amit Verma",
    role: "Field Technician",
    experience: "3 Years",
    status: "Busy",
    jobs: "4 / 6",
    rating: "4.6",
    phone: "9876543211",
    email: "amit.verma@example.com",
    region: "West Zone",
  },
  {
    id: "EMP-1012",
    name: "Sunil Patil",
    role: "Pest Control Tech",
    experience: "4 Years",
    status: "On Service",
    jobs: "6 / 6",
    rating: "4.7",
    phone: "9876543212",
    email: "sunil.patil@example.com",
    region: "South Zone",
  },
  {
    id: "EMP-1016",
    name: "Neha Gupta",
    role: "Junior Technician",
    experience: "2 Years",
    status: "Available",
    jobs: "1 / 6",
    rating: "4.5",
    phone: "9876543213",
    email: "neha.gupta@example.com",
    region: "East Zone",
  },
  {
    id: "EMP-1021",
    name: "Rakesh Singh",
    role: "Senior Technician",
    experience: "6 Years",
    status: "Busy",
    jobs: "5 / 6",
    rating: "4.9",
    phone: "9876543214",
    region: "Central Zone",
  },
];

const STATUS_TONE = {
  Available: "success",
  Busy: "warning",
  "On Service": "danger",
};

const EQUIPMENT_OPTIONS = [
  "Spray Machine",
  "PPE Kit",
  "Chemicals",
  "Inspection Kit",
  "Ladder",
  "Fogging Machine",
  "Others",
];

const initials = (name) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/* ---------------- Reusable Bits ---------------- */
const SectionHeader = ({ number, icon: Icon, title }) => (
  <div className="as-section-header">
    <span className="as-section-icon">
      <Icon size={16} />
    </span>
    <h3>
      {number && <span className="as-section-number">{number}.</span>} {title}
    </h3>
  </div>
);

const FieldInput = ({ label, required, icon: Icon, value, readOnly, name, onChange, type = "text" }) => (
  <div className="as-field">
    <label className="as-label">
      {label} {required && <span className="as-required">*</span>}
    </label>
    <div className="as-input-wrap">
      {Icon && <Icon size={15} className="as-input-icon" />}
      <input
        type={type}
        name={name}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        className="as-input"
      />
    </div>
  </div>
);

const FieldSelect = ({ label, required, icon: Icon, value, name, onChange, options = [], tooltip }) => (
  <div className="as-field">
    <label className="as-label">
      {label} {required && <span className="as-required">*</span>}
      {tooltip && <Info size={13} className="as-tooltip-icon" title={tooltip} />}
    </label>
    <div className="as-input-wrap">
      {Icon && <Icon size={15} className="as-input-icon" />}
      <select name={name} value={value} onChange={onChange} className="as-input as-select">
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="as-select-caret" />
    </div>
  </div>
);

const Badge = ({ tone, children }) => (
  <span className={`as-badge as-badge-${tone}`}>
    <span className="as-badge-dot" />
    {children}
  </span>
);

const SummaryRow = ({ icon: Icon, label, value, highlight }) => (
  <div className="as-summary-row">
    <span className="as-summary-label">
      {Icon && <Icon size={14} />}
      {label}
    </span>
    <span className={`as-summary-value ${highlight ? `as-summary-${highlight}` : ""}`}>
      {value}
    </span>
  </div>
);

export default function AssignTechnician() {
  const [selectedId, setSelectedId] = useState("EMP-1004");
  const [equipment, setEquipment] = useState(["Spray Machine", "PPE Kit", "Chemicals"]);
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  const selectedTech = TECHNICIANS.find((t) => t.id === selectedId);

  const toggleEquipment = (item) => {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  return (
    <div className="as-page">
      {/* Breadcrumb */}
      <div className="as-breadcrumb">
        <Home size={14} />
        <span>Home</span>
        <ChevronRight size={13} className="as-crumb-sep" />
        <span>Technicians</span>
        <ChevronRight size={13} className="as-crumb-sep" />
        <span>Management</span>
        <ChevronRight size={13} className="as-crumb-sep" />
        <span className="as-crumb-active">Assign Technician</span>
      </div>

      {/* Page Header */}
      <div className="as-page-header">
        <div>
          <h1 className="as-title">Assign Technician</h1>
          <p className="as-subtitle">Assign a technician to a service request or job.</p>
        </div>
        <div className="as-header-actions">
          <button type="button" className="as-btn as-btn-outline" onClick={() => navigate("/admin/bookings/pending")}>
            <ArrowLeft size={16} />
            Back to Bookings
          </button>
          <button type="button" className="as-btn as-btn-primary">
            <UserCheck size={16} />
            Assign Technician
          </button>
        </div>
      </div>

      {/* Body Grid */}
      <div className="as-grid">
        {/* LEFT COLUMN */}
        <div className="as-col as-col-main">
          {/* 1. Service / Job Details */}
          <div className="as-card">
            <SectionHeader number={1} icon={ClipboardList} title="Service / Job Details" />
            <div className="as-form-grid as-cols-4">
              <FieldInput label="Service Request ID" icon={FileText} value="SRV-10254" readOnly />
              <FieldInput label="Customer" icon={User} value="Green Valley Apartment" readOnly />
              <FieldInput label="Property / Location" icon={MapPin} value="Building A, 2nd Floor, Pune" readOnly />
              <FieldInput label="Pest Type" icon={Bug} value="Termite" readOnly />

              <FieldInput label="Service Type" icon={Wrench} value="Termite Treatment" readOnly />
              <div className="as-field">
                <label className="as-label">Priority</label>
                <div className="as-input-wrap">
                  <Badge tone="danger">High</Badge>
                </div>
              </div>
              <FieldInput label="Requested Date" icon={Calendar} value="15/05/2024" readOnly />
              <FieldInput label="Preferred Date" icon={Calendar} value="16/05/2024" readOnly />
            </div>
          </div>

          {/* 2. Select Technician */}
          <div className="as-card">
            <SectionHeader number={2} icon={User} title="Select Technician" />
            <div className="as-field">
              <label className="as-label">
                Technician <span className="as-required">*</span>
              </label>
              <div className="as-input-wrap">
                <Search size={15} className="as-input-icon" />
                <input
                  type="text"
                  className="as-input"
                  placeholder="Search by name, employee ID or phone number..."
                />
                <ChevronDown size={14} className="as-select-caret" />
              </div>
            </div>

            <div className="as-table-scroll">
              <table className="as-table">
                <thead>
                  <tr>
                    <th>Technician</th>
                    <th>Employee ID</th>
                    <th>Experience</th>
                    <th>Current Status</th>
                    <th>Today's Jobs</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {TECHNICIANS.map((tech) => (
                    <tr
                      key={tech.id}
                      className={selectedId === tech.id ? "is-selected" : ""}
                      onClick={() => setSelectedId(tech.id)}
                    >
                      <td>
                        <div className="as-tech-cell">
                          <span className="as-avatar">{initials(tech.name)}</span>
                          <div className="as-tech-info">
                            <span className="as-tech-name">
                              {selectedId === tech.id && (
                                <span className="as-select-dot" />
                              )}
                              {tech.name}
                            </span>
                            <span className="as-tech-role">{tech.role}</span>
                          </div>
                        </div>
                      </td>
                      <td className="as-muted">{tech.id}</td>
                      <td className="as-muted">{tech.experience}</td>
                      <td>
                        <Badge tone={STATUS_TONE[tech.status]}>{tech.status}</Badge>
                      </td>
                      <td className="as-muted">{tech.jobs}</td>
                      <td>
                        <span className="as-rating">
                          <Star size={13} fill="currentColor" />
                          {tech.rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Schedule & Assignment Details */}
          <div className="as-card">
            <SectionHeader number={3} icon={CalendarClock} title="Schedule & Assignment Details" />
            <div className="as-form-grid as-cols-4">
              <FieldInput
                label="Schedule Date"
                required
                icon={Calendar}
                type="date"
                value="2024-05-16"
                onChange={() => {}}
              />
              <FieldInput
                label="Start Time"
                required
                icon={Clock}
                type="time"
                value="10:00"
                onChange={() => {}}
              />
              <FieldSelect
                label="Estimated Duration"
                required
                icon={Clock}
                value="2.0 Hours"
                onChange={() => {}}
                options={["1.0 Hours", "1.5 Hours", "2.0 Hours", "3.0 Hours", "4.0 Hours"]}
              />
              <FieldSelect
                label="Follow-up Required"
                icon={Info}
                value="Yes"
                onChange={() => {}}
                options={["Yes", "No"]}
                tooltip="Schedule a follow-up visit automatically"
              />
            </div>

            <div className="as-field as-field-full">
              <label className="as-label">Assignment Notes</label>
              <textarea
                className="as-textarea"
                placeholder="Add any notes or special instructions for the technician..."
                maxLength={250}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
              <span className="as-char-count">{notes.length} / 250</span>
            </div>
          </div>

          {/* 4. Equipment & Materials Required */}
          <div className="as-card">
            <SectionHeader number={4} icon={PackageCheck} title="Equipment & Materials Required" />
            <div className="as-checkbox-grid">
              {EQUIPMENT_OPTIONS.map((item) => (
                <label className="as-checkbox" key={item}>
                  <input
                    type="checkbox"
                    checked={equipment.includes(item)}
                    onChange={() => toggleEquipment(item)}
                  />
                  <span className="as-checkbox-box">
                    <Check size={12} />
                  </span>
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="as-col as-col-side">
          {/* Assignment Summary */}
          <div className="as-card">
            <SectionHeader icon={FileText} title="Assignment Summary" />
            {selectedTech && (
              <>
                <div className="as-summary-profile">
                  <span className="as-avatar as-avatar-lg">{initials(selectedTech.name)}</span>
                  <div>
                    <span className="as-summary-name">{selectedTech.name}</span>
                    <span className="as-summary-role">{selectedTech.role}</span>
                    <Badge tone={STATUS_TONE[selectedTech.status]}>{selectedTech.status}</Badge>
                  </div>
                  <span className="as-summary-id">{selectedTech.id}</span>
                </div>

                <div className="as-summary-list">
                  <SummaryRow icon={Briefcase} label="Experience" value={selectedTech.experience} />
                  <SummaryRow icon={Phone} label="Phone" value={selectedTech.phone} highlight="link" />
                  <SummaryRow icon={Mail} label="Email" value={selectedTech.email || "—"} highlight="link" />
                  <SummaryRow icon={Compass} label="Region" value={selectedTech.region} />
                  <SummaryRow icon={ClipboardList} label="Today's Jobs" value={selectedTech.jobs} />
                  <SummaryRow icon={Star} label="Rating" value={`★ ${selectedTech.rating}`} highlight="rating" />
                </div>
              </>
            )}
          </div>

          {/* Job Summary */}
          <div className="as-card">
            <SectionHeader icon={ClipboardList} title="Job Summary" />
            <div className="as-summary-list">
              <SummaryRow label="Service Request ID" value="SRV-10254" />
              <SummaryRow label="Customer" value="Green Valley Apartment" />
              <SummaryRow label="Property / Location" value="Building A, 2nd Floor, Pune" />
              <SummaryRow label="Pest Type" value="Termite" />
              <SummaryRow label="Service Type" value="Termite Treatment" />
              <SummaryRow label="Priority" value={<Badge tone="danger">High</Badge>} />
              <SummaryRow label="Preferred Date" value="16/05/2024" />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="as-side-actions">
            <button type="button" className="as-btn as-btn-outline">
              Cancel
            </button>
            <button type="button" className="as-btn as-btn-primary">
              <UserCheck size={16} />
              Assign Technician
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}