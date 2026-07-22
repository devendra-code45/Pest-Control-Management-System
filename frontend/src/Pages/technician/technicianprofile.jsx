import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Pencil,
  IdCard,
  Calendar,
  ShieldCheck,
  MapPin,
  User,
  Phone,
  Mail,
  Home,
  Users,
  Info,
} from "lucide-react";
import "./technicianprofile.css";

const technician = {
  name: "Amit Kumar",
  role: "Senior Pest Control Technician",
  status: "Active",
  employeeId: "EMP-TCH-015",
  dateOfJoining: "12 Mar 2023",
  experience: "4 Years",
  licenseNo: "PCMC/TECH/2023/145",
  serviceArea: "Pune, Pimpri-Chinchwad, PCMC",
  fullName: "Amit Kumar",
  phone: "9876543210",
  email: "amit.kumar@example.com",
  dob: "05 Jul 1993",
  gender: "Male",
  address: "B-404, Green Valley Apartments, Kharadi, Pune, Maharashtra - 411014",
};

const emergencyContact = {
  name: "Ramesh Kumar",
  phone: "9876543211",
  relationship: "Brother",
};

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="tp-detail-row">
    <span className="tp-detail-icon">
      <Icon size={16} strokeWidth={2} />
    </span>
    <div className="tp-detail-text">
      <span className="tp-detail-label">{label}</span>
      <span className="tp-detail-value">{value}</span>
    </div>
  </div>
);

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="tp-info-row">
    <span className="tp-info-icon">
      <Icon size={16} strokeWidth={2} />
    </span>
    <div className="tp-info-text">
      <span className="tp-info-label">{label}</span>
      <span className="tp-info-value">{value}</span>
    </div>
  </div>
);

const EmergencyItem = ({ icon: Icon, label, value }) => (
  <div className="tp-emergency-item">
    <span className="tp-emergency-icon">
      <Icon size={18} strokeWidth={2} />
    </span>
    <div className="tp-emergency-text">
      <span className="tp-emergency-label">{label}</span>
      <span className="tp-emergency-value">{value}</span>
    </div>
  </div>
);

export default function TechnicianProfile() {
  const navigate = useNavigate();
  return (
    <div className="tp-page">
      <nav className="tp-breadcrumb" aria-label="Breadcrumb">
        <a href="#" className="tp-breadcrumb-link">
          Dashboard
        </a>
        <ChevronRight size={14} className="tp-breadcrumb-sep" />
        <a href="#" className="tp-breadcrumb-link">
          Technicians
        </a>
        <ChevronRight size={14} className="tp-breadcrumb-sep" />
        <span className="tp-breadcrumb-current">Profile</span>
      </nav>

      <header className="tp-header">
        <div>
          <h1 className="tp-title">Technician Profile</h1>
          <p className="tp-subtitle">
            View your personal information and emergency contact details
          </p>
        </div>
        <button type="button" className="tp-btn tp-btn-outline" onClick={() => navigate("/admin/technicians/edit")}>
          <Pencil size={16} strokeWidth={2} />
          Edit Profile
        </button>
      </header>

      <section className="tp-card">
        <div className="tp-card-header">
          <span className="tp-card-header-icon">
            <IdCard size={18} strokeWidth={2} />
          </span>
          <h2 className="tp-card-title">Technician Details</h2>
        </div>

        <div className="tp-card-body">
          <div className="tp-profile-col">
            <div className="tp-avatar">
              <User size={48} strokeWidth={1.5} />
            </div>
            <span className="tp-status-badge">
              <span className="tp-status-dot" />
              {technician.status}
            </span>
          </div>

          <div className="tp-identity-col">
            <h3 className="tp-name">{technician.name}</h3>
            <p className="tp-role">{technician.role}</p>

            <div className="tp-detail-list">
              <DetailRow icon={IdCard} label="Employee ID" value={technician.employeeId} />
              <DetailRow icon={Calendar} label="Date of Joining" value={technician.dateOfJoining} />
              <DetailRow icon={ShieldCheck} label="Experience" value={technician.experience} />
              <DetailRow icon={Calendar} label="License No." value={technician.licenseNo} />
              <DetailRow icon={MapPin} label="Service Area" value={technician.serviceArea} />
            </div>
          </div>

          <div className="tp-info-col">
            <InfoRow icon={User} label="Full Name" value={technician.fullName} />
            <InfoRow icon={Phone} label="Phone Number" value={technician.phone} />
            <InfoRow icon={Mail} label="Email Address" value={technician.email} />
            <InfoRow icon={Calendar} label="Date of Birth" value={technician.dob} />
            <InfoRow icon={User} label="Gender" value={technician.gender} />
            <InfoRow icon={Home} label="Address" value={technician.address} />
          </div>
        </div>
      </section>

      <section className="tp-card">
        <div className="tp-card-header">
          <span className="tp-card-header-icon">
            <Phone size={18} strokeWidth={2} />
          </span>
          <h2 className="tp-card-title">Emergency Contact</h2>
        </div>

        <div className="tp-emergency-body">
          <EmergencyItem icon={User} label="Contact Name" value={emergencyContact.name} />
          <span className="tp-emergency-divider" />
          <EmergencyItem icon={Phone} label="Phone Number" value={emergencyContact.phone} />
          <span className="tp-emergency-divider" />
          <EmergencyItem icon={Users} label="Relationship" value={emergencyContact.relationship} />
        </div>

        <div className="tp-notice">
          <Info size={16} strokeWidth={2} />
          <span>This contact will be notified in case of any emergency during field service.</span>
        </div>
      </section>
    </div>
  );
}