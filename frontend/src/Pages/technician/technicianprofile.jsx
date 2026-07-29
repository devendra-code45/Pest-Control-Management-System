import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  LoaderCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import api from "../../api/axios";
import "./technicianprofile.css";

const safeText = (value, fallback = "—") => {
  const text = String(value ?? "").trim();
  return text || fallback;
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return safeText(value);
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const getErrorMessage = (error) => {
  const data = error.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data?.message) return data.message;
  if (data?.error) return data.error;

  if (!error.response) {
    return "Unable to connect to the backend.";
  }

  return "Unable to load technician details.";
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
  const location = useLocation();

  const technicianId =
    location.state?.technicianId ||
    sessionStorage.getItem("pcmsTechnicianId");

  const [technician, setTechnician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTechnician = async () => {
      if (!technicianId) {
        setError("Technician ID was not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/admin/technicians/${technicianId}`
        );

        setTechnician(response.data);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    loadTechnician();
  }, [technicianId]);

  const openEdit = () => {
    sessionStorage.setItem(
      "pcmsTechnicianId",
      String(technicianId)
    );

    navigate("/admin/technicians/edit/", {
      state: {
        technicianId,
      },
    });
  };

  const status = String(
    technician?.active === false
      ? "INACTIVE"
      : technician?.status || "AVAILABLE"
  ).toUpperCase();

  const displayStatus =
    status === "INACTIVE"
      ? "Inactive"
      : status === "BUSY"
      ? "Busy"
      : "Available";

  const name = safeText(
    technician?.fullName || technician?.name,
    "Unnamed Technician"
  );

  const role = safeText(
    technician?.designation ||
      technician?.role ||
      technician?.specialization,
    "Pest Control Technician"
  );

  const serviceArea = safeText(
    technician?.serviceArea ||
      technician?.region ||
      technician?.city ||
      technician?.address
  );

  const address = [
    technician?.streetAddress,
    technician?.city,
    technician?.state,
    technician?.zip || technician?.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="tp-page">
      <nav className="tp-breadcrumb" aria-label="Breadcrumb">
        <button
          type="button"
          className="tp-breadcrumb-link tp-breadcrumb-button"
          onClick={() => navigate("/admin/dashboard")}
        >
          Dashboard
        </button>

        <ChevronRight size={14} className="tp-breadcrumb-sep" />

        <button
          type="button"
          className="tp-breadcrumb-link tp-breadcrumb-button"
          onClick={() => navigate("/admin/technicians")}
        >
          Technicians
        </button>

        <ChevronRight size={14} className="tp-breadcrumb-sep" />

        <span className="tp-breadcrumb-current">Profile</span>
      </nav>

      <header className="tp-header">
        <div>
          <h1 className="tp-title">Technician Profile</h1>

          <p className="tp-subtitle">
            View technician information and emergency contact details
          </p>
        </div>

        <div className="tp-header-actions">
          <button
            type="button"
            className="tp-btn tp-btn-outline"
            onClick={() => navigate("/admin/technicians")}
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Back
          </button>

          <button
            type="button"
            className="tp-btn tp-btn-outline"
            onClick={openEdit}
            disabled={!technician}
          >
            <Pencil size={16} strokeWidth={2} />
            Edit Profile
          </button>
        </div>
      </header>

      {error && (
        <div className="tp-error-message">
          <AlertCircle size={17} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="tp-loading">
          <LoaderCircle size={22} className="tp-loading-icon" />
          Loading technician details...
        </div>
      ) : technician ? (
        <>
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
                  {technician.profilePhoto ? (
                    <img
                      src={technician.profilePhoto}
                      alt={name}
                      className="tp-avatar-image"
                    />
                  ) : (
                    <User size={48} strokeWidth={1.5} />
                  )}
                </div>

                <span
                  className={`tp-status-badge ${
                    displayStatus === "Inactive"
                      ? "tp-status-badge--inactive"
                      : displayStatus === "Busy"
                      ? "tp-status-badge--busy"
                      : ""
                  }`}
                >
                  <span className="tp-status-dot" />
                  {displayStatus}
                </span>
              </div>

              <div className="tp-identity-col">
                <h3 className="tp-name">{name}</h3>
                <p className="tp-role">{role}</p>

                <div className="tp-detail-list">
                  <DetailRow
                    icon={IdCard}
                    label="Employee ID"
                    value={`TECH-${technician.id}`}
                  />

                  <DetailRow
                    icon={Calendar}
                    label="Date of Joining"
                    value={formatDate(
                      technician.dateOfJoining ||
                        technician.joiningDate ||
                        technician.createdAt
                    )}
                  />

                  <DetailRow
                    icon={ShieldCheck}
                    label="Experience"
                    value={`${Number(
                      technician.experienceYears || 0
                    )} Years`}
                  />

                  <DetailRow
                    icon={ShieldCheck}
                    label="Specialization"
                    value={safeText(technician.specialization)}
                  />

                  <DetailRow
                    icon={MapPin}
                    label="Service Area"
                    value={serviceArea}
                  />
                </div>
              </div>

              <div className="tp-info-col">
                <InfoRow
                  icon={User}
                  label="Full Name"
                  value={name}
                />

                <InfoRow
                  icon={Phone}
                  label="Phone Number"
                  value={safeText(technician.phone)}
                />

                <InfoRow
                  icon={Mail}
                  label="Email Address"
                  value={safeText(technician.email)}
                />

                <InfoRow
                  icon={Calendar}
                  label="Date of Birth"
                  value={formatDate(
                    technician.dateOfBirth || technician.dob
                  )}
                />

                <InfoRow
                  icon={User}
                  label="Gender"
                  value={safeText(technician.gender)}
                />

                <InfoRow
                  icon={Home}
                  label="Address"
                  value={safeText(
                    technician.address || address
                  )}
                />
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
              <EmergencyItem
                icon={User}
                label="Contact Name"
                value={safeText(
                  technician.emergencyContactName ||
                    technician.emergencyName
                )}
              />

              <span className="tp-emergency-divider" />

              <EmergencyItem
                icon={Phone}
                label="Phone Number"
                value={safeText(
                  technician.emergencyContactPhone ||
                    technician.emergencyPhone
                )}
              />

              <span className="tp-emergency-divider" />

              <EmergencyItem
                icon={Users}
                label="Relationship"
                value={safeText(
                  technician.emergencyContactRelationship ||
                    technician.relationship
                )}
              />
            </div>

            <div className="tp-notice">
              <Info size={16} strokeWidth={2} />

              <span>
                This contact will be notified in case of any emergency
                during field service.
              </span>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}