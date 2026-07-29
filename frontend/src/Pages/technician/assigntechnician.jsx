import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  ChevronRight,
  ArrowLeft,
  UserCheck,
  ClipboardList,
  User,
  CalendarClock,
  PackageCheck,
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
  AlertCircle,
} from "lucide-react";
import api from "../../api/axios";
import "./assigntechnician.css";

const STATUS_TONE = {
  AVAILABLE: "success",
  BUSY: "warning",
  INACTIVE: "danger",
};

const STATUS_LABEL = {
  AVAILABLE: "Available",
  BUSY: "Busy",
  INACTIVE: "Inactive",
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

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "NA";

const formatDate = (value) => {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
};

const getStartTime = (timeSlot) => {
  if (!timeSlot) return "10:00";

  const match = timeSlot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);

  if (!match) return "10:00";

  let hours = Number(match[1]);
  const minutes = match[2];
  const period = match[3]?.toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${minutes}`;
};

const getPriority = (preferredDate) => {
  if (!preferredDate) return "Low";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const serviceDate = new Date(`${preferredDate}T00:00:00`);
  const difference = Math.ceil(
    (serviceDate.getTime() - today.getTime()) / 86400000
  );

  if (difference <= 1) return "High";
  if (difference <= 3) return "Medium";
  return "Low";
};

const getPriorityTone = (priority) => {
  if (priority === "High") return "danger";
  if (priority === "Medium") return "warning";
  return "success";
};

const getErrorMessage = (error) => {
  const responseData = error.response?.data;

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData;
  }

  if (responseData?.message) return responseData.message;
  if (responseData?.error) return responseData.error;

  if (!error.response) {
    return "Unable to connect to the backend.";
  }

  return "Unable to complete technician assignment.";
};

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

const FieldInput = ({
  label,
  required,
  icon: Icon,
  value,
  readOnly,
  name,
  onChange,
  type = "text",
}) => (
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

const FieldSelect = ({
  label,
  required,
  icon: Icon,
  value,
  name,
  onChange,
  options = [],
  tooltip,
}) => (
  <div className="as-field">
    <label className="as-label">
      {label} {required && <span className="as-required">*</span>}
      {tooltip && (
        <Info size={13} className="as-tooltip-icon" title={tooltip} />
      )}
    </label>
    <div className="as-input-wrap">
      {Icon && <Icon size={15} className="as-input-icon" />}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="as-input as-select"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
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
    <span
      className={`as-summary-value ${
        highlight ? `as-summary-${highlight}` : ""
      }`}
    >
      {value}
    </span>
  </div>
);

export default function AssignTechnician() {
  const navigate = useNavigate();
  const location = useLocation();

  const bookingId =
    location.state?.bookingId ||
    Number(sessionStorage.getItem("pcmsAssignBookingId"));

  const [booking, setBooking] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [equipment, setEquipment] = useState([
    "Spray Machine",
    "PPE Kit",
    "Chemicals",
  ]);
  const [notes, setNotes] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [duration, setDuration] = useState("2.0 Hours");
  const [followUp, setFollowUp] = useState("Yes");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    if (!bookingId) {
      setError("No booking was selected.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      sessionStorage.setItem(
        "pcmsAssignBookingId",
        String(bookingId)
      );

      const [bookingResponse, technicianResponse] =
        await Promise.all([
          api.get(`/admin/bookings/${bookingId}`),
          api.get("/admin/technicians/available"),
        ]);

      const bookingData = bookingResponse.data;
      const technicianData = Array.isArray(
        technicianResponse.data
      )
        ? technicianResponse.data
        : [];

      setBooking(bookingData);
      setTechnicians(technicianData);
      setScheduleDate(bookingData.preferredDate || "");
      setStartTime(
        getStartTime(bookingData.preferredTimeSlot)
      );

      if (technicianData.length > 0) {
        setSelectedId(String(technicianData[0].id));
      } else {
        setSelectedId("");
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [bookingId]);

  const filteredTechnicians = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    return technicians.filter((technician) => {
      return (
        search === "" ||
        String(technician.id).includes(search) ||
        technician.fullName
          ?.toLowerCase()
          .includes(search) ||
        technician.phone?.includes(search) ||
        technician.email
          ?.toLowerCase()
          .includes(search) ||
        technician.specialization
          ?.toLowerCase()
          .includes(search)
      );
    });
  }, [technicians, searchValue]);

  const selectedTech = technicians.find(
    (technician) =>
      String(technician.id) === String(selectedId)
  );

  const priority = getPriority(
    booking?.preferredDate
  );

  const toggleEquipment = (item) => {
    setEquipment((previousEquipment) =>
      previousEquipment.includes(item)
        ? previousEquipment.filter(
            (equipmentItem) =>
              equipmentItem !== item
          )
        : [...previousEquipment, item]
    );
  };

  const handleAssign = async () => {
    if (!bookingId) {
      setError("No booking was selected.");
      return;
    }

    if (!selectedId) {
      setError("Select an available technician.");
      return;
    }

    try {
      setAssigning(true);
      setError("");

      await api.put(
        `/admin/bookings/${bookingId}/assign-technician`,
        {
          technicianId: Number(selectedId),
        }
      );

      sessionStorage.removeItem(
        "pcmsAssignBookingId"
      );

      navigate("/admin/bookings/accepted", {
        replace: true,
        state: {
          message:
            "Technician assigned successfully.",
        },
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setAssigning(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/bookings/accepted");
  };

  return (
    <div className="as-page">
      {/* Breadcrumb */}
      <div className="as-breadcrumb">
        <Home size={14} />
        <span>Home</span>
        <ChevronRight
          size={13}
          className="as-crumb-sep"
        />
        <span>Technicians</span>
        <ChevronRight
          size={13}
          className="as-crumb-sep"
        />
        <span>Management</span>
        <ChevronRight
          size={13}
          className="as-crumb-sep"
        />
        <span className="as-crumb-active">
          Assign Technician
        </span>
      </div>

      {/* Page Header */}
      <div className="as-page-header">
        <div>
          <h1 className="as-title">
            Assign Technician
          </h1>
          <p className="as-subtitle">
            Assign a technician to a service
            request or job.
          </p>
        </div>
        <div className="as-header-actions">
          <button
            type="button"
            className="as-btn as-btn-outline"
            onClick={handleCancel}
          >
            <ArrowLeft size={16} />
            Back to Bookings
          </button>
          <button
            type="button"
            className="as-btn as-btn-primary"
            onClick={handleAssign}
            disabled={
              loading || assigning || !selectedId
            }
          >
            <UserCheck size={16} />
            {assigning
              ? "Assigning..."
              : "Assign Technician"}
          </button>
        </div>
      </div>

      {error && (
        <div
          className="as-card"
          style={{ marginBottom: "16px" }}
        >
          <div className="as-section-header">
            <span className="as-section-icon">
              <AlertCircle size={16} />
            </span>
            <h3>{error}</h3>
          </div>
        </div>
      )}

      {/* Body Grid */}
      <div className="as-grid">
        {/* LEFT COLUMN */}
        <div className="as-col as-col-main">
          {/* 1. Service / Job Details */}
          <div className="as-card">
            <SectionHeader
              number={1}
              icon={ClipboardList}
              title="Service / Job Details"
            />
            <div className="as-form-grid as-cols-4">
              <FieldInput
                label="Service Request ID"
                icon={FileText}
                value={
                  booking
                    ? `BK-${booking.id}`
                    : "—"
                }
                readOnly
              />
              <FieldInput
                label="Customer"
                icon={User}
                value={
                  booking?.customerName || "—"
                }
                readOnly
              />
              <FieldInput
                label="Property / Location"
                icon={MapPin}
                value={
                  [
                    booking?.propertyType,
                    booking?.serviceAddress,
                    booking?.city,
                    booking?.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ") || "—"
                }
                readOnly
              />
              <FieldInput
                label="Pest Type"
                icon={Bug}
                value={booking?.pestType || "—"}
                readOnly
              />

              <FieldInput
                label="Service Type"
                icon={Wrench}
                value={
                  [
                    booking?.serviceName,
                    booking?.serviceType,
                  ]
                    .filter(Boolean)
                    .join(" - ") || "—"
                }
                readOnly
              />
              <div className="as-field">
                <label className="as-label">
                  Priority
                </label>
                <div className="as-input-wrap">
                  <Badge
                    tone={getPriorityTone(priority)}
                  >
                    {priority}
                  </Badge>
                </div>
              </div>
              <FieldInput
                label="Requested Date"
                icon={Calendar}
                value={formatDate(
                  booking?.createdAt?.split("T")[0]
                )}
                readOnly
              />
              <FieldInput
                label="Preferred Date"
                icon={Calendar}
                value={formatDate(
                  booking?.preferredDate
                )}
                readOnly
              />
            </div>
          </div>

          {/* 2. Select Technician */}
          <div className="as-card">
            <SectionHeader
              number={2}
              icon={User}
              title="Select Technician"
            />
            <div className="as-field">
              <label className="as-label">
                Technician{" "}
                <span className="as-required">
                  *
                </span>
              </label>
              <div className="as-input-wrap">
                <Search
                  size={15}
                  className="as-input-icon"
                />
                <input
                  type="text"
                  className="as-input"
                  placeholder="Search by name, employee ID or phone number..."
                  value={searchValue}
                  onChange={(event) =>
                    setSearchValue(
                      event.target.value
                    )
                  }
                />
                <ChevronDown
                  size={14}
                  className="as-select-caret"
                />
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
                    <th>Today&apos;s Jobs</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTechnicians.map(
                    (technician) => (
                      <tr
                        key={technician.id}
                        className={
                          String(selectedId) ===
                          String(technician.id)
                            ? "is-selected"
                            : ""
                        }
                        onClick={() =>
                          setSelectedId(
                            String(technician.id)
                          )
                        }
                      >
                        <td>
                          <div className="as-tech-cell">
                            <span className="as-avatar">
                              {initials(
                                technician.fullName
                              )}
                            </span>
                            <div className="as-tech-info">
                              <span className="as-tech-name">
                                {String(
                                  selectedId
                                ) ===
                                  String(
                                    technician.id
                                  ) && (
                                  <span className="as-select-dot" />
                                )}
                                {
                                  technician.fullName
                                }
                              </span>
                              <span className="as-tech-role">
                                {
                                  technician.specialization
                                }
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="as-muted">
                          TECH-{technician.id}
                        </td>
                        <td className="as-muted">
                          {
                            technician.experienceYears
                          }{" "}
                          Years
                        </td>
                        <td>
                          <Badge
                            tone={
                              STATUS_TONE[
                                technician.status
                              ] || "success"
                            }
                          >
                            {STATUS_LABEL[
                              technician.status
                            ] ||
                              technician.status}
                          </Badge>
                        </td>
                        <td className="as-muted">
                          —
                        </td>
                        <td>
                          <span className="as-rating">
                            <Star
                              size={13}
                              fill="currentColor"
                            />
                            —
                          </span>
                        </td>
                      </tr>
                    )
                  )}

                  {!loading &&
                    filteredTechnicians.length ===
                      0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="as-muted"
                          style={{
                            textAlign: "center",
                            padding: "24px",
                          }}
                        >
                          No available technicians
                          found.
                        </td>
                      </tr>
                    )}

                  {loading && (
                    <tr>
                      <td
                        colSpan={6}
                        className="as-muted"
                        style={{
                          textAlign: "center",
                          padding: "24px",
                        }}
                      >
                        Loading technicians...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Schedule & Assignment Details */}
          <div className="as-card">
            <SectionHeader
              number={3}
              icon={CalendarClock}
              title="Schedule & Assignment Details"
            />
            <div className="as-form-grid as-cols-4">
              <FieldInput
                label="Schedule Date"
                required
                icon={Calendar}
                type="date"
                value={scheduleDate}
                onChange={(event) =>
                  setScheduleDate(
                    event.target.value
                  )
                }
              />
              <FieldInput
                label="Start Time"
                required
                icon={Clock}
                type="time"
                value={startTime}
                onChange={(event) =>
                  setStartTime(
                    event.target.value
                  )
                }
              />
              <FieldSelect
                label="Estimated Duration"
                required
                icon={Clock}
                value={duration}
                onChange={(event) =>
                  setDuration(
                    event.target.value
                  )
                }
                options={[
                  "1.0 Hours",
                  "1.5 Hours",
                  "2.0 Hours",
                  "3.0 Hours",
                  "4.0 Hours",
                ]}
              />
              <FieldSelect
                label="Follow-up Required"
                icon={Info}
                value={followUp}
                onChange={(event) =>
                  setFollowUp(
                    event.target.value
                  )
                }
                options={["Yes", "No"]}
                tooltip="Schedule a follow-up visit automatically"
              />
            </div>

            <div className="as-field as-field-full">
              <label className="as-label">
                Assignment Notes
              </label>
              <textarea
                className="as-textarea"
                placeholder="Add any notes or special instructions for the technician..."
                maxLength={250}
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                rows={3}
              />
              <span className="as-char-count">
                {notes.length} / 250
              </span>
            </div>
          </div>

          {/* 4. Equipment & Materials Required */}
          <div className="as-card">
            <SectionHeader
              number={4}
              icon={PackageCheck}
              title="Equipment & Materials Required"
            />
            <div className="as-checkbox-grid">
              {EQUIPMENT_OPTIONS.map((item) => (
                <label
                  className="as-checkbox"
                  key={item}
                >
                  <input
                    type="checkbox"
                    checked={equipment.includes(
                      item
                    )}
                    onChange={() =>
                      toggleEquipment(item)
                    }
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
            <SectionHeader
              icon={FileText}
              title="Assignment Summary"
            />
            {selectedTech && (
              <>
                <div className="as-summary-profile">
                  <span className="as-avatar as-avatar-lg">
                    {initials(
                      selectedTech.fullName
                    )}
                  </span>
                  <div>
                    <span className="as-summary-name">
                      {selectedTech.fullName}
                    </span>
                    <span className="as-summary-role">
                      {
                        selectedTech.specialization
                      }
                    </span>
                    <Badge
                      tone={
                        STATUS_TONE[
                          selectedTech.status
                        ] || "success"
                      }
                    >
                      {STATUS_LABEL[
                        selectedTech.status
                      ] || selectedTech.status}
                    </Badge>
                  </div>
                  <span className="as-summary-id">
                    TECH-{selectedTech.id}
                  </span>
                </div>

                <div className="as-summary-list">
                  <SummaryRow
                    icon={Briefcase}
                    label="Experience"
                    value={`${selectedTech.experienceYears} Years`}
                  />
                  <SummaryRow
                    icon={Phone}
                    label="Phone"
                    value={
                      selectedTech.phone || "—"
                    }
                    highlight="link"
                  />
                  <SummaryRow
                    icon={Mail}
                    label="Email"
                    value={
                      selectedTech.email || "—"
                    }
                    highlight="link"
                  />
                  <SummaryRow
                    icon={Compass}
                    label="Address"
                    value={
                      selectedTech.address || "—"
                    }
                  />
                  <SummaryRow
                    icon={ClipboardList}
                    label="Today's Jobs"
                    value="—"
                  />
                  <SummaryRow
                    icon={Star}
                    label="Rating"
                    value="—"
                    highlight="rating"
                  />
                </div>
              </>
            )}

            {!selectedTech && (
              <p className="as-muted">
                Select an available technician.
              </p>
            )}
          </div>

          {/* Job Summary */}
          <div className="as-card">
            <SectionHeader
              icon={ClipboardList}
              title="Job Summary"
            />
            <div className="as-summary-list">
              <SummaryRow
                label="Service Request ID"
                value={
                  booking
                    ? `BK-${booking.id}`
                    : "—"
                }
              />
              <SummaryRow
                label="Customer"
                value={
                  booking?.customerName || "—"
                }
              />
              <SummaryRow
                label="Property / Location"
                value={
                  [
                    booking?.propertyType,
                    booking?.serviceAddress,
                    booking?.city,
                  ]
                    .filter(Boolean)
                    .join(", ") || "—"
                }
              />
              <SummaryRow
                label="Pest Type"
                value={booking?.pestType || "—"}
              />
              <SummaryRow
                label="Service Type"
                value={
                  [
                    booking?.serviceName,
                    booking?.serviceType,
                  ]
                    .filter(Boolean)
                    .join(" - ") || "—"
                }
              />
              <SummaryRow
                label="Priority"
                value={
                  <Badge
                    tone={getPriorityTone(priority)}
                  >
                    {priority}
                  </Badge>
                }
              />
              <SummaryRow
                label="Preferred Date"
                value={formatDate(
                  booking?.preferredDate
                )}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="as-side-actions">
            <button
              type="button"
              className="as-btn as-btn-outline"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="as-btn as-btn-primary"
              onClick={handleAssign}
              disabled={
                loading || assigning || !selectedId
              }
            >
              <UserCheck size={16} />
              {assigning
                ? "Assigning..."
                : "Assign Technician"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}