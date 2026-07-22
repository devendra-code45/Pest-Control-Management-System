import React from "react";
import {
  Pencil,
  IdCard,
  CalendarDays,
  ShieldCheck,
  MapPin,
  User,
  Phone,
  Mail,
  Home,
  Users,
  Info,
} from "lucide-react";
import "./TechnicianProfile.css";

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

const TechnicianProfile = () => {
  return (
    <div className="tp-page">
      {/* Breadcrumb */}
      <nav className="tp-breadcrumb" aria-label="Breadcrumb">
        <span>Dashboard</span>
        <span className="tp-breadcrumb-sep">›</span>
        <span>Technicians</span>
        <span className="tp-breadcrumb-sep">›</span>
        <span className="tp-breadcrumb-current">Profile</span>
      </nav>

      {/* Page Header */}
      <div className="tp-header">
        <div>
          <h1 className="tp-title">Technician Profile</h1>
          <p className="tp-subtitle">
            View your personal information and emergency contact details
          </p>
        </div>
        <button type="button" className="tp-btn tp-btn-outline">
          <Pencil size={16} />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Technician Details Card */}
      <section className="tp-card">
        <div className="tp-card-header">
          <IdCard size={18} className="tp-card-header-icon" />
          <h2>Technician Details</h2>
        </div>

        <div className="tp-details-grid">
          {/* Avatar column */}
          <div className="tp-avatar-col">
            <div className="tp-avatar">
              <User size={48} />
            </div>
            <span className="tp-status-badge">
              <span className="tp-status-dot" />
              {technician.status}
            </span>
          </div>

          {/* Info list column */}
          <div className="tp-info-col">
            <h3 className="tp-name">{technician.name}</h3>
            <p className="tp-role">{technician.role}</p>

            <ul className="tp-meta-list">
              <li>
                <IdCard size={16} className="tp-meta-icon" />
                <span className="tp-meta-label">Employee ID</span>
                <span className="tp-meta-value">{technician.employeeId}</span>
              </li>
              <li>
                <CalendarDays size={16} className="tp-meta-icon" />
                <span className="tp-meta-label">Date of Joining</span>
                <span className="tp-meta-value">{technician.dateOfJoining}</span>
              </li>
              <li>
                <ShieldCheck size={16} className="tp-meta-icon" />
                <span className="tp-meta-label">Experience</span>
                <span className="tp-meta-value">{technician.experience}</span>
              </li>
              <li>
                <CalendarDays size={16} className="tp-meta-icon" />
                <span className="tp-meta-label">License No.</span>
                <span className="tp-meta-value">{technician.licenseNo}</span>
              </li>
              <li>
                <MapPin size={16} className="tp-meta-icon" />
                <span className="tp-meta-label">Service Area</span>
                <span className="tp-meta-value">{technician.serviceArea}</span>
              </li>
            </ul>
          </div>

          {/* Contact details column */}
          <div className="tp-contact-col">
            <ul className="tp-field-list">
              <li>
                <User size={16} className="tp-meta-icon" />
                <span className="tp-field-label">Full Name</span>
                <span className="tp-field-value">{technician.fullName}</span>
              </li>
              <li>
                <Phone size={16} className="tp-meta-icon" />
                <span className="tp-field-label">Phone Number</span>
                <span className="tp-field-value">{technician.phone}</span>
              </li>
              <li>
                <Mail size={16} className="tp-meta-icon" />
                <span className="tp-field-label">Email Address</span>
                <span className="tp-field-value">{technician.email}</span>
              </li>
              <li>
                <CalendarDays size={16} className="tp-meta-icon" />
                <span className="tp-field-label">Date of Birth</span>
                <span className="tp-field-value">{technician.dob}</span>
              </li>
              <li>
                <User size={16} className="tp-meta-icon" />
                <span className="tp-field-label">Gender</span>
                <span className="tp-field-value">{technician.gender}</span>
              </li>
              <li>
                <Home size={16} className="tp-meta-icon" />
                <span className="tp-field-label">Address</span>
                <span className="tp-field-value">{technician.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Emergency Contact Card */}
      <section className="tp-card">
        <div className="tp-card-header">
          <Phone size={18} className="tp-card-header-icon" />
          <h2>Emergency Contact</h2>
        </div>

        <div className="tp-emergency-grid">
          <div className="tp-emergency-item">
            <span className="tp-emergency-icon">
              <User size={18} />
            </span>
            <div>
              <p className="tp-emergency-label">Contact Name</p>
              <p className="tp-emergency-value">{emergencyContact.name}</p>
            </div>
          </div>

          <div className="tp-emergency-item">
            <span className="tp-emergency-icon">
              <Phone size={18} />
            </span>
            <div>
              <p className="tp-emergency-label">Phone Number</p>
              <p className="tp-emergency-value">{emergencyContact.phone}</p>
            </div>
          </div>

          <div className="tp-emergency-item">
            <span className="tp-emergency-icon">
              <Users size={18} />
            </span>
            <div>
              <p className="tp-emergency-label">Relationship</p>
              <p className="tp-emergency-value">{emergencyContact.relationship}</p>
            </div>
          </div>
        </div>

        <div className="tp-info-banner">
          <Info size={16} className="tp-info-banner-icon" />
          <span>
            This contact will be notified in case of any emergency during field
            service.
          </span>
        </div>
      </section>
    </div>
  );
};

export default TechnicianProfile;