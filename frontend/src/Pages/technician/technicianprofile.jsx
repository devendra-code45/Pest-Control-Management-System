import React, { useState } from "react";
import {useNavigate} from 'react-router-dom';
import {
  Home,
  ChevronRight,
  ArrowLeft,
  Pencil,
  MoreHorizontal,
  ChevronDown,
  Star,
  IdCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Building2,
  Compass,
  Briefcase,
  ClipboardList,
  CalendarCheck,
  FileText,
  TrendingUp,
  Activity,
  UserRound,
  ShieldCheck,
  CheckCircle2,
  Award,
  Sparkles,
} from "lucide-react";
import "./TechnicianProfile.css";

/* ---------------- Mock Data ---------------- */
const HEADER_STATS = [
  { icon: ClipboardList, value: "785", label: "Completed Jobs" },
  { icon: Star, value: "4.8", label: "Avg. Rating", filled: true },
  { icon: TrendingUp, value: "42 min", label: "Avg. Completion Time" },
  { icon: CalendarCheck, value: "98%", label: "Attendance" },
];

const TABS = [
  { key: "overview", label: "Overview", icon: ClipboardList },
  { key: "assignments", label: "Assignments", icon: Briefcase },
  { key: "attendance", label: "Attendance", icon: CalendarCheck },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "performance", label: "Performance", icon: TrendingUp },
  { key: "activity", label: "Activity", icon: Activity },
];

const PERSONAL_INFO = [
  { label: "Date of Birth", value: "12 Aug 1992" },
  { label: "Gender", value: "Male" },
  { label: "Blood Group", value: "O+" },
  { label: "Emergency Contact", value: "Ramesh Sharma (Brother)" },
  { label: "Phone Number", value: "9876543200" },
  { label: "Address", value: "123, Green Park, Kothrud, Pune, Maharashtra - 411038" },
];

const PROFESSIONAL_INFO = [
  { label: "Designation", value: "Senior Technician" },
  { label: "Department", value: "Operations" },
  {
    label: "Primary Skills",
    value: ["General Pest Control", "Termite Treatment"],
    tag: true,
  },
  {
    label: "Secondary Skills",
    value: ["Rodent Control", "Bed Bug Treatment"],
    tag: true,
  },
  { label: "License / Certification No.", value: "PC-2019-MH-1024" },
  { label: "License Expiry Date", value: "20 Dec 2025" },
  { label: "Vehicle Number", value: "MH12 AB 1234" },
];

const SKILLS = [
  { name: "General Pest Control", value: 90 },
  { name: "Termite Treatment", value: 85 },
  { name: "Rodent Control", value: 75 },
  { name: "Bed Bug Treatment", value: 70 },
];

const CERTIFICATIONS = [
  {
    name: "Pest Control Technician",
    issued: "20 Dec 2019",
    expiry: "19 Dec 2025",
    status: "Valid",
  },
  {
    name: "Safety & Hygiene Training",
    issued: "15 Jan 2021",
    expiry: "14 Jan 2026",
    status: "Valid",
  },
  {
    name: "Chemical Handling",
    issued: "10 Mar 2022",
    expiry: "09 Mar 2026",
    status: "Valid",
  },
  {
    name: "First Aid Certificate",
    issued: "05 Dec 2022",
    expiry: "04 Dec 2025",
    status: "Valid",
  },
];

const RECENT_ACTIVITY = [
  { time: "10:30 AM", text: "Completed service at Green Valley Apartment" },
  { time: "09:15 AM", text: "Started treatment for Service Request #SRV-1023" },
  { time: "08:45 AM", text: "Checked in at customer location" },
  { time: "08:30 AM", text: "Job assigned: Termite Treatment at Blue Ridge Villa" },
  { time: "08:00 AM", text: "Daily attendance marked" },
];

/* ---------------- Reusable Bits ---------------- */
const InfoRow = ({ label, value, tag }) => (
  <div className="tp-info-row">
    <span className="tp-info-label">{label}</span>
    {tag ? (
      <div className="tp-info-tags">
        {value.map((v) => (
          <span key={v} className="tp-tag">
            {v}
          </span>
        ))}
      </div>
    ) : (
      <span className="tp-info-value">{value}</span>
    )}
  </div>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="tp-section-header">
    <span className="tp-section-icon">
      <Icon size={16} />
    </span>
    <h3>{title}</h3>
  </div>
);

export default function TechnicianProfile() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  return (
    <div className="tp-page">
      {/* Breadcrumb */}
      <div className="tp-breadcrumb">
        <Home size={14} />
        <span>Home</span>
        <ChevronRight size={13} className="tp-crumb-sep" />
        <span>Technicians</span>
        <ChevronRight size={13} className="tp-crumb-sep" />
        <span>Management</span>
        <ChevronRight size={13} className="tp-crumb-sep" />
        <span className="tp-crumb-active">Technician Profile</span>
      </div>

      {/* Page Header */}
      <div className="tp-page-header">
        <div>
          <h1 className="tp-title">Technician Profile</h1>
          <p className="tp-subtitle">
            View and manage technician details, performance and activity.
          </p>
        </div>
        <div className="tp-header-actions">
          <button type="button" className="tp-btn tp-btn-outline" onClick={() => navigate("/technician-management")}>
            <ArrowLeft size={16} />
            Back to Technicians
          </button>
          <button type="button" className="tp-btn tp-btn-primary" onClick={() => navigate("/edit-technician")}>
            <Pencil size={15} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Summary Card */}
      <div className="tp-card tp-profile-card">
        <div className="tp-profile-main">
          <div className="tp-avatar-wrap">
            <div className="tp-avatar">
              <UserRound size={40} />
            </div>
            <span className="tp-avatar-status" />
          </div>

          <div className="tp-profile-identity">
            <div className="tp-name-row">
              <h2>Rahul Sharma</h2>
              <span className="tp-badge tp-badge-success">Active</span>
            </div>
            <span className="tp-role">Senior Technician</span>
            <div className="tp-rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < 4 ? "tp-star-filled" : "tp-star-half"}
                  fill={i < 4 ? "currentColor" : "none"}
                />
              ))}
              <span className="tp-rating-value">4.8 (126 reviews)</span>
            </div>
          </div>

          <div className="tp-profile-meta">
            <div className="tp-meta-item">
              <IdCard size={15} />
              <div>
                <span className="tp-meta-label">Employee ID</span>
                <span className="tp-meta-value">EMP-1004</span>
              </div>
            </div>
            <div className="tp-meta-item">
              <Phone size={15} />
              <div>
                <span className="tp-meta-label">Phone</span>
                <span className="tp-meta-value">9876543210</span>
              </div>
            </div>
            <div className="tp-meta-item">
              <Mail size={15} />
              <div>
                <span className="tp-meta-label">Email</span>
                <span className="tp-meta-value">rahul.sharma@exemple.com</span>
              </div>
            </div>
            <div className="tp-meta-item">
              <MapPin size={15} />
              <div>
                <span className="tp-meta-label">Region</span>
                <span className="tp-meta-value">North Zone</span>
              </div>
            </div>
            <div className="tp-meta-item">
              <Calendar size={15} />
              <div>
                <span className="tp-meta-label">Joining Date</span>
                <span className="tp-meta-value">15 Mar 2019</span>
              </div>
            </div>
            <div className="tp-meta-item">
              <User size={15} />
              <div>
                <span className="tp-meta-label">Reporting Manager</span>
                <span className="tp-meta-value">Vikram Singh</span>
              </div>
            </div>
            <div className="tp-meta-item">
              <Building2 size={15} />
              <div>
                <span className="tp-meta-label">Department</span>
                <span className="tp-meta-value">Operations</span>
              </div>
            </div>
            <div className="tp-meta-item">
              <Compass size={15} />
              <div>
                <span className="tp-meta-label">Region</span>
                <span className="tp-meta-value">North Zone</span>
              </div>
            </div>
            <div className="tp-meta-item">
              <Briefcase size={15} />
              <div>
                <span className="tp-meta-label">Experience</span>
                <span className="tp-meta-value">5 Years</span>
              </div>
            </div>
          </div>
        </div>

        <div className="tp-stat-strip">
          {HEADER_STATS.map((stat) => (
            <div className="tp-stat-box" key={stat.label}>
              <span className="tp-stat-icon">
                <stat.icon size={16} fill={stat.filled ? "currentColor" : "none"} />
              </span>
              <span className="tp-stat-value">{stat.value}</span>
              <span className="tp-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="tp-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`tp-tab ${activeTab === tab.key ? "is-active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="tp-content-grid">
        {/* Row 1 */}
        <div className="tp-card">
          <SectionHeader icon={User} title="Personal Information" />
          <div className="tp-info-list">
            {PERSONAL_INFO.map((item) => (
              <InfoRow key={item.label} {...item} />
            ))}
          </div>
        </div>

        <div className="tp-card">
          <SectionHeader icon={Briefcase} title="Professional Information" />
          <div className="tp-info-list">
            {PROFESSIONAL_INFO.map((item) => (
              <InfoRow key={item.label} {...item} />
            ))}
          </div>
        </div>

        <div className="tp-card">
          <SectionHeader icon={Sparkles} title="Current Status" />
          <div className="tp-status-banner">
            <span className="tp-status-icon">
              <CheckCircle2 size={20} />
            </span>
            <div>
              <span className="tp-status-title">Available</span>
              <span className="tp-status-sub">Ready for new assignments</span>
            </div>
          </div>
          <div className="tp-info-list tp-info-list-tight">
            <InfoRow label="Today's Jobs" value="2 / 6" />
            <InfoRow label="Current Location" value="Kothrud, Pune" />
            <InfoRow label="Last Activity" value="10 min ago" />
          </div>
        </div>
        
      </div>
    </div>
  );
}