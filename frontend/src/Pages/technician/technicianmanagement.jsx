import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  ChevronRight,
  Plus,
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
  ChevronLeft,
  RefreshCw,
  Ban,
  UserCheck,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import api from "../../api/axios";
import "./technicianmanagement.css";

const PAGE_SIZE = 10;

const SKILL_TONES = [
  "green",
  "amber",
  "slate",
  "blue",
  "violet",
];

const AVAILABILITY_TONE = {
  Available: "success",
  Busy: "warning",
  Inactive: "danger",
};

const STATUS_TONE = {
  Active: "success",
  Inactive: "danger",
};

const safeText = (value, fallback = "—") => {
  const text = String(value ?? "").trim();
  return text || fallback;
};

const initials = (name) =>
  String(name || "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "NA";

const splitSkills = (value) => {
  const skills = String(value || "")
    .split(/[,|/]/)
    .map((skill) => skill.trim())
    .filter(Boolean);

  return skills.length > 0
    ? skills
    : ["General Pest"];
};

const normalizeBackendStatus = (technician) => {
  if (technician?.active === false) {
    return "INACTIVE";
  }

  return String(
    technician?.status || "AVAILABLE"
  ).toUpperCase();
};

const getAvailability = (technician) => {
  const status = normalizeBackendStatus(technician);

  if (status === "BUSY") return "Busy";
  if (status === "INACTIVE") return "Inactive";

  return "Available";
};

const getAccountStatus = (technician) =>
  normalizeBackendStatus(technician) === "INACTIVE"
    ? "Inactive"
    : "Active";

const getRelativeTime = (value) => {
  if (!value) return "Not recorded";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not recorded";
  }

  const difference =
    Date.now() - date.getTime();

  const minutes = Math.max(
    0,
    Math.floor(difference / 60000)
  );

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days} day${days === 1 ? "" : "s"} ago`;
};

const isToday = (dateValue) => {
  if (!dateValue) return false;

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

const getErrorMessage = (error) => {
  const data = error.response?.data;

  if (
    typeof data === "string" &&
    data.trim()
  ) {
    return data;
  }

  if (data?.message) return data.message;
  if (data?.error) return data.error;

  if (!error.response) {
    return "Unable to connect to the backend.";
  }

  return "Unable to load technicians.";
};

const FilterSelect = ({
  label,
  value,
  options,
  onChange,
}) => (
  <div className="tm-filter">
    <span className="tm-filter-label">
      {label}
    </span>

    <div className="tm-select-wrap">
      <select
        className="tm-select"
        value={value}
        title={label}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={13}
        className="tm-select-caret"
      />
    </div>
  </div>
);

const Badge = ({
  tone,
  children,
  dot,
}) => (
  <span
    className={`tm-badge tm-badge-${tone}`}
  >
    {dot && (
      <span className="tm-badge-dot" />
    )}
    {children}
  </span>
);

export default function TechniciansManagement() {
  const navigate = useNavigate();

  const [technicians, setTechnicians] =
    useState([]);
  const [bookings, setBookings] =
    useState([]);

  const [selected, setSelected] =
    useState([]);
  const [selectAll, setSelectAll] =
    useState(false);

  const [search, setSearch] =
    useState("");
  const [roleFilter, setRoleFilter] =
    useState("All Roles");
  const [regionFilter, setRegionFilter] =
    useState("All Regions");
  const [
    availabilityFilter,
    setAvailabilityFilter,
  ] = useState("All");
  const [statusFilter, setStatusFilter] =
    useState("All Status");
  const [skillFilter, setSkillFilter] =
    useState("All Skills");

  const [page, setPage] = useState(1);
  const [loading, setLoading] =
    useState(true);
  const [updatingId, setUpdatingId] =
    useState(null);
  const [error, setError] =
    useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const technicianResponse =
        await api.get(
          "/admin/technicians"
        );

      const technicianData =
        Array.isArray(
          technicianResponse.data
        )
          ? technicianResponse.data
          : [];

      setTechnicians(technicianData);

      try {
        const bookingResponse =
          await api.get(
            "/admin/bookings"
          );

        setBookings(
          Array.isArray(
            bookingResponse.data
          )
            ? bookingResponse.data
            : []
        );
      } catch {
        setBookings([]);
      }
    } catch (requestError) {
      setTechnicians([]);
      setBookings([]);
      setError(
        getErrorMessage(requestError)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const mappedTechnicians =
    useMemo(() => {
      return technicians.map(
        (technician) => {
          const technicianId =
            Number(technician.id);

          const technicianBookings =
            bookings.filter(
              (booking) =>
                Number(
                  booking.technicianId
                ) === technicianId
            );

          const todayJobs =
            technicianBookings.filter(
              (booking) =>
                isToday(
                  booking.preferredDate
                ) &&
                ![
                  "REJECTED",
                  "CANCELLED",
                ].includes(
                  booking.status
                )
            ).length;

          const role =
            safeText(
              technician.designation ||
                technician.role ||
                technician.specialization,
              "Pest Control Technician"
            );

          const region =
            safeText(
              technician.region ||
                technician.city ||
                technician.address,
              "Not specified"
            );

          return {
            rawId: technician.id,
            id: `TECH-${technician.id}`,
            name: safeText(
              technician.fullName,
              "Unnamed Technician"
            ),
            role,
            email: safeText(
              technician.email
            ),
            phone: safeText(
              technician.phone
            ),
            profilePhoto:
              technician.profilePhoto ||
              null,
            region,
            skills: splitSkills(
              technician.specialization
            ),
            experience: `${
              Number(
                technician.experienceYears ||
                  0
              )
            } Years`,
            jobs: `${todayJobs} ${
              todayJobs === 1
                ? "Job"
                : "Jobs"
            }`,
            availability:
              getAvailability(
                technician
              ),
            status:
              getAccountStatus(
                technician
              ),
            backendStatus:
              normalizeBackendStatus(
                technician
              ),
            lastActivity:
              getRelativeTime(
                technician.updatedAt ||
                  technician.createdAt
              ),
          };
        }
      );
    }, [technicians, bookings]);

  const roleOptions = useMemo(
    () => [
      "All Roles",
      ...new Set(
        mappedTechnicians.map(
          (technician) =>
            technician.role
        )
      ),
    ],
    [mappedTechnicians]
  );

  const regionOptions = useMemo(
    () => [
      "All Regions",
      ...new Set(
        mappedTechnicians.map(
          (technician) =>
            technician.region
        )
      ),
    ],
    [mappedTechnicians]
  );

  const skillOptions = useMemo(
    () => [
      "All Skills",
      ...new Set(
        mappedTechnicians.flatMap(
          (technician) =>
            technician.skills
        )
      ),
    ],
    [mappedTechnicians]
  );

  const filteredTechnicians =
    useMemo(() => {
      const query = search
        .trim()
        .toLowerCase();

      return mappedTechnicians.filter(
        (technician) => {
          const matchesSearch =
            !query ||
            technician.id
              .toLowerCase()
              .includes(query) ||
            technician.name
              .toLowerCase()
              .includes(query) ||
            technician.phone
              .toLowerCase()
              .includes(query) ||
            technician.email
              .toLowerCase()
              .includes(query);

          const matchesRole =
            roleFilter ===
              "All Roles" ||
            technician.role ===
              roleFilter;

          const matchesRegion =
            regionFilter ===
              "All Regions" ||
            technician.region ===
              regionFilter;

          const matchesAvailability =
            availabilityFilter ===
              "All" ||
            technician.availability ===
              availabilityFilter;

          const matchesStatus =
            statusFilter ===
              "All Status" ||
            technician.status ===
              statusFilter;

          const matchesSkill =
            skillFilter ===
              "All Skills" ||
            technician.skills.includes(
              skillFilter
            );

          return (
            matchesSearch &&
            matchesRole &&
            matchesRegion &&
            matchesAvailability &&
            matchesStatus &&
            matchesSkill
          );
        }
      );
    }, [
      mappedTechnicians,
      search,
      roleFilter,
      regionFilter,
      availabilityFilter,
      statusFilter,
      skillFilter,
    ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTechnicians.length /
        PAGE_SIZE
    )
  );

  const safePage = Math.min(
    page,
    totalPages
  );

  const pageItems =
    filteredTechnicians.slice(
      (safePage - 1) *
        PAGE_SIZE,
      safePage * PAGE_SIZE
    );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const stats = useMemo(() => {
    const available =
      mappedTechnicians.filter(
        (technician) =>
          technician.availability ===
          "Available"
      ).length;

    const busy =
      mappedTechnicians.filter(
        (technician) =>
          technician.availability ===
          "Busy"
      ).length;

    const inactive =
      mappedTechnicians.filter(
        (technician) =>
          technician.status ===
          "Inactive"
      ).length;

    const todayJobs =
      bookings.filter(
        (booking) =>
          isToday(
            booking.preferredDate
          ) &&
          ![
            "REJECTED",
            "CANCELLED",
          ].includes(
            booking.status
          )
      ).length;

    return [
      {
        icon: Users,
        label: "Total Technicians",
        value:
          mappedTechnicians.length,
        note: "Registered technicians",
        tone: "primary",
      },
      {
        icon: CheckCircle,
        label: "Available",
        value: available,
        note: "Ready for assignment",
        tone: "success",
      },
      {
        icon: Truck,
        label: "On Service",
        value: busy,
        note: "Currently busy",
        tone: "primary",
      },
      {
        icon: Calendar,
        label: "Scheduled Today",
        value: todayJobs,
        note: "Today's bookings",
        tone: "primary",
      },
      {
        icon: AlertTriangle,
        label: "Inactive",
        value: inactive,
        note: "Cannot be assigned",
        tone: "danger",
      },
    ];
  }, [
    mappedTechnicians,
    bookings,
  ]);

  const visibleIds = pageItems.map(
    (technician) =>
      technician.rawId
  );

  const toggleAll = () => {
    const allVisibleSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) =>
        selected.includes(id)
      );

    if (allVisibleSelected) {
      setSelected((previous) =>
        previous.filter(
          (id) =>
            !visibleIds.includes(id)
        )
      );
      setSelectAll(false);
    } else {
      setSelected((previous) => [
        ...new Set([
          ...previous,
          ...visibleIds,
        ]),
      ]);
      setSelectAll(true);
    }
  };

  const toggleRow = (id) => {
    setSelected((previous) =>
      previous.includes(id)
        ? previous.filter(
            (selectedId) =>
              selectedId !== id
          )
        : [...previous, id]
    );
  };

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("All Roles");
    setRegionFilter("All Regions");
    setAvailabilityFilter("All");
    setStatusFilter("All Status");
    setSkillFilter("All Skills");
    setPage(1);
  };

  const openProfile = (
    technicianId
  ) => {
    sessionStorage.setItem(
      "pcmsTechnicianId",
      String(technicianId)
    );

    navigate(
      "/admin/technicians/profile/",
      {
        state: {
          technicianId,
        },
      }
    );
  };

  const openEdit = (
    technicianId
  ) => {
    sessionStorage.setItem(
      "pcmsTechnicianId",
      String(technicianId)
    );

    navigate(
      "/admin/technicians/edit/",
      {
        state: {
          technicianId,
        },
      }
    );
  };

  const deactivateTechnician =
    async (technician) => {
      const confirmed =
        window.confirm(
          `Deactivate ${technician.name}?`
        );

      if (!confirmed) return;

      try {
        setUpdatingId(
          technician.rawId
        );
        setError("");

        await api.delete(
          `/admin/technicians/${technician.rawId}`
        );

        await loadData();
      } catch (requestError) {
        setError(
          getErrorMessage(
            requestError
          )
        );
      } finally {
        setUpdatingId(null);
      }
    };

  const activateTechnician =
    async (technician) => {
      try {
        setUpdatingId(
          technician.rawId
        );
        setError("");

        await api.put(
          `/admin/technicians/${technician.rawId}/activate`
        );

        await loadData();
      } catch (requestError) {
        setError(
          getErrorMessage(
            requestError
          )
        );
      } finally {
        setUpdatingId(null);
      }
    };

  const firstRecord =
    filteredTechnicians.length === 0
      ? 0
      : (safePage - 1) *
          PAGE_SIZE +
        1;

  const lastRecord = Math.min(
    safePage * PAGE_SIZE,
    filteredTechnicians.length
  );

  return (
    <div className="tm-page">
      <div className="tm-breadcrumb">
        <Home size={14} />
        <span>Home</span>
        <ChevronRight
          size={13}
          className="tm-crumb-sep"
        />
        <span>Technicians</span>
        <ChevronRight
          size={13}
          className="tm-crumb-sep"
        />
        <span className="tm-crumb-active">
          Management
        </span>
      </div>

      <div className="tm-page-header">
        <div>
          <h1 className="tm-title">
            Technicians Management
          </h1>

          <p className="tm-subtitle">
            Manage technician profiles,
            availability and assignments.
          </p>
        </div>

        <div className="tm-header-actions">
          <button
            type="button"
            className="tm-btn tm-btn-outline"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            type="button"
            className="tm-btn tm-btn-primary"
            onClick={() =>
              navigate(
                "/admin/technicians/add"
              )
            }
          >
            <Plus size={16} />
            Add Technician
          </button>
        </div>
      </div>

      {error && (
        <div className="tm-error-message">
          <AlertCircle size={17} />
          {error}
        </div>
      )}

      <div className="tm-stats-grid">
        {stats.map((card) => (
          <div
            className="tm-stat-card"
            key={card.label}
          >
            <span
              className={`tm-stat-icon tm-tone-${card.tone}`}
            >
              <card.icon size={19} />
            </span>

            <div className="tm-stat-body">
              <span className="tm-stat-label">
                {card.label}
              </span>

              <span className="tm-stat-value">
                {card.value}
              </span>

              <span className="tm-stat-note">
                {card.note}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="tm-toolbar">
        <div className="tm-search">
          <Search
            size={15}
            className="tm-search-icon"
          />

          <input
            type="text"
            className="tm-search-input"
            placeholder="Search name, ID, phone..."
            value={search}
            onChange={(event) => {
              setSearch(
                event.target.value
              );
              setPage(1);
            }}
          />
        </div>

        <div className="tm-toolbar-divider" />

        <FilterSelect
          label="Role"
          value={roleFilter}
          options={roleOptions}
          onChange={(value) => {
            setRoleFilter(value);
            setPage(1);
          }}
        />

        <FilterSelect
          label="Region"
          value={regionFilter}
          options={regionOptions}
          onChange={(value) => {
            setRegionFilter(value);
            setPage(1);
          }}
        />

        <FilterSelect
          label="Availability"
          value={availabilityFilter}
          options={[
            "All",
            "Available",
            "Busy",
            "Inactive",
          ]}
          onChange={(value) => {
            setAvailabilityFilter(
              value
            );
            setPage(1);
          }}
        />

        <FilterSelect
          label="Status"
          value={statusFilter}
          options={[
            "All Status",
            "Active",
            "Inactive",
          ]}
          onChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
        />

        <FilterSelect
          label="Skill"
          value={skillFilter}
          options={skillOptions}
          onChange={(value) => {
            setSkillFilter(value);
            setPage(1);
          }}
        />

        <div className="tm-toolbar-actions">
          <button
            type="button"
            className="tm-btn tm-btn-outline tm-btn-sm"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      </div>

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
                    checked={
                      pageItems.length >
                        0 &&
                      pageItems.every(
                        (technician) =>
                          selected.includes(
                            technician.rawId
                          )
                      )
                    }
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
                <th className="tm-col-actions">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={12}
                    className="tm-empty-row"
                  >
                    <LoaderCircle
                      size={20}
                      className="tm-loading-icon"
                    />
                    Loading technicians...
                  </td>
                </tr>
              ) : pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="tm-empty-row"
                  >
                    No technicians found.
                  </td>
                </tr>
              ) : (
                pageItems.map(
                  (technician) => (
                    <tr
                      key={
                        technician.rawId
                      }
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.includes(
                            technician.rawId
                          )}
                          onChange={() =>
                            toggleRow(
                              technician.rawId
                            )
                          }
                        />
                      </td>

                      <td>
                        <div className="tm-tech-cell">
                          <span className="tm-avatar">
                            {technician.profilePhoto ? (
                              <img
                                src={technician.profilePhoto}
                                alt={technician.name}
                                className="tm-avatar-image"
                              />
                            ) : (
                              initials(technician.name)
                            )}
                          </span>

                          <div className="tm-tech-info">
                            <span className="tm-tech-name">
                              {
                                technician.name
                              }
                            </span>

                            <span className="tm-tech-role">
                              {
                                technician.role
                              }
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="tm-muted">
                        {technician.id}
                      </td>

                      <td>
                        <span className="tm-cell-icon-text">
                          <Phone size={14} />
                          {
                            technician.phone
                          }
                        </span>
                      </td>

                      <td>
                        <span className="tm-cell-icon-text">
                          <MapPin size={14} />
                          {
                            technician.region
                          }
                        </span>
                      </td>

                      <td>
                        <div className="tm-skill-list">
                          {technician.skills.map(
                            (
                              skill,
                              index
                            ) => (
                              <span
                                key={`${technician.rawId}-${skill}`}
                                className={`tm-skill-chip tm-skill-${
                                  SKILL_TONES[
                                    index %
                                      SKILL_TONES.length
                                  ]
                                }`}
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      </td>

                      <td className="tm-muted">
                        {
                          technician.experience
                        }
                      </td>

                      <td className="tm-muted">
                        {technician.jobs}
                      </td>

                      <td>
                        <Badge
                          tone={
                            AVAILABILITY_TONE[
                              technician.availability
                            ]
                          }
                          dot
                        >
                          {
                            technician.availability
                          }
                        </Badge>
                      </td>

                      <td>
                        <Badge
                          tone={
                            STATUS_TONE[
                              technician.status
                            ]
                          }
                        >
                          {
                            technician.status
                          }
                        </Badge>
                      </td>

                      <td>
                        <span className="tm-cell-icon-text tm-muted">
                          <Clock size={14} />
                          {
                            technician.lastActivity
                          }
                        </span>
                      </td>

                      <td>
                        <div className="tm-actions">
                          <button
                            type="button"
                            className="tm-icon-btn"
                            title="View"
                            onClick={() =>
                              openProfile(
                                technician.rawId
                              )
                            }
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            className="tm-icon-btn"
                            title="Edit"
                            onClick={() =>
                              openEdit(
                                technician.rawId
                              )
                            }
                          >
                            <Pencil
                              size={16}
                            />
                          </button>

                          {technician.status ===
                          "Inactive" ? (
                            <button
                              type="button"
                              className="tm-icon-btn tm-icon-btn-success"
                              title="Activate"
                              disabled={
                                updatingId ===
                                technician.rawId
                              }
                              onClick={() =>
                                activateTechnician(
                                  technician
                                )
                              }
                            >
                              <UserCheck
                                size={16}
                              />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="tm-icon-btn tm-icon-btn-danger"
                              title="Deactivate"
                              disabled={
                                updatingId ===
                                technician.rawId
                              }
                              onClick={() =>
                                deactivateTechnician(
                                  technician
                                )
                              }
                            >
                              <Ban size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="tm-table-footer">
          <span className="tm-entries-info">
            Showing {firstRecord} to{" "}
            {lastRecord} of{" "}
            {filteredTechnicians.length}{" "}
            entries
          </span>

          <div className="tm-pagination">
            <button
              type="button"
              className="tm-page-btn"
              aria-label="Previous page"
              disabled={safePage === 1}
              onClick={() =>
                setPage((current) =>
                  Math.max(
                    1,
                    current - 1
                  )
                )
              }
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({
              length: totalPages,
            }).map((_, index) => (
              <button
                type="button"
                key={index + 1}
                className={`tm-page-btn ${
                  safePage ===
                  index + 1
                    ? "is-active"
                    : ""
                }`}
                onClick={() =>
                  setPage(index + 1)
                }
              >
                {index + 1}
              </button>
            ))}

            <button
              type="button"
              className="tm-page-btn"
              aria-label="Next page"
              disabled={
                safePage === totalPages
              }
              onClick={() =>
                setPage((current) =>
                  Math.min(
                    totalPages,
                    current + 1
                  )
                )
              }
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="tm-rows-per-page">
            <span>
              {PAGE_SIZE} rows per page
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}