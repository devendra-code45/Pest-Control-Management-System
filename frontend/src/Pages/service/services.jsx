import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  RefreshCw,
  Eye,
  Pencil,
  Bug,
  ChevronLeft,
  ChevronRight,
  Rat,
  SprayCan,
  Shield,
  Wind,
  Power,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import api from "../../api/axios";
import "./services.css";

const SERVICE_ICONS = {
  "Termite Control": Bug,
  "General Pest Control": SprayCan,
  "Rodent Control": Rat,
  "Bed Bug Control": Shield,
  "Mosquito Control": Wind,
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

  return "Unable to load services.";
};

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));

export default function Services() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const loadServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/services");

      setServices(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (requestError) {
      setServices([]);
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const normalizedServices = useMemo(
    () =>
      services.map((service) => ({
        ...service,
        status:
          service.active === false
            ? "Inactive"
            : "Active",
      })),
    [services]
  );

  const categories = useMemo(
    () => [
      "all",
      ...new Set(
        normalizedServices
          .map((service) => service.category)
          .filter(Boolean)
      ),
    ],
    [normalizedServices]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return normalizedServices.filter((service) => {
      const matchesSearch =
        !query ||
        String(service.name || "")
          .toLowerCase()
          .includes(query) ||
        String(service.category || "")
          .toLowerCase()
          .includes(query) ||
        String(service.description || "")
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        category === "all" ||
        service.category === category;

      const matchesStatus =
        status === "all" ||
        service.status.toLowerCase() === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    normalizedServices,
    search,
    category,
    status,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / perPage)
  );

  const safePage = Math.min(page, totalPages);

  const visibleServices = filtered.slice(
    (safePage - 1) * perPage,
    safePage * perPage
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const openDetails = (serviceId) => {
    sessionStorage.setItem(
      "pcmsServiceId",
      String(serviceId)
    );

    navigate("/admin/services/details", {
      state: {
        serviceId,
      },
    });
  };

  const openEdit = (serviceId) => {
    sessionStorage.setItem(
      "pcmsServiceId",
      String(serviceId)
    );

    navigate("/admin/services/edit", {
      state: {
        serviceId,
      },
    });
  };

  const toggleStatus = async (service) => {
    try {
      setUpdatingId(service.id);
      setError("");

      const endpoint =
        service.active === false
          ? `/admin/services/${service.id}/activate`
          : `/admin/services/${service.id}/deactivate`;

      await api.put(endpoint);

      await loadServices();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setUpdatingId(null);
    }
  };

  const firstRecord =
    filtered.length === 0
      ? 0
      : (safePage - 1) * perPage + 1;

  const lastRecord = Math.min(
    safePage * perPage,
    filtered.length
  );

  return (
    <div className="services-page">
      <div className="services-breadcrumb">
        <span className="crumb-active">
          Dashboard
        </span>
        <span className="crumb-sep">›</span>
        <span>Services</span>
      </div>

      <div className="services-header">
        <div>
          <h1>Services</h1>
          <p>
            Manage all pest control services offered
            by your company.
          </p>
        </div>

        <div className="services-header-actions">
          <button
            type="button"
            className="btns btns-outline"
            onClick={loadServices}
            disabled={loading}
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            type="button"
            className="btns btns-primary services-add-btn"
            onClick={() =>
              navigate("/admin/services/add")
            }
          >
            <Plus size={18} />
            Add Service
          </button>
        </div>
      </div>

      {error && (
        <div className="services-message services-message-error">
          <AlertCircle size={17} />
          {error}
        </div>
      )}

      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-input">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search by service name or category..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="toolbar-field">
            <label>Category</label>

            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setPage(1);
              }}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "all"
                    ? "All Categories"
                    : item}
                </option>
              ))}
            </select>
          </div>

          <div className="toolbar-field">
            <label>Status</label>

            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>

          <div className="toolbar-field">
            <label>Show</label>

            <select
              value={perPage}
              onChange={(event) => {
                setPerPage(
                  Number(event.target.value)
                );
                setPage(1);
              }}
            >
              <option value={10}>10 Per Page</option>
              <option value={25}>25 Per Page</option>
              <option value={50}>50 Per Page</option>
            </select>
          </div>
        </div>

        <div className="table-scroll">
          <table className="services-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Status</th>
                <th className="actions-col">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="empty-state"
                  >
                    <LoaderCircle
                      size={20}
                      className="services-loading-icon"
                    />
                    Loading services...
                  </td>
                </tr>
              ) : visibleServices.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="empty-state"
                  >
                    No services match your search or
                    filters.
                  </td>
                </tr>
              ) : (
                visibleServices.map((service) => {
                  const Icon =
                    SERVICE_ICONS[
                      service.category
                    ] || Bug;

                  return (
                    <tr key={service.id}>
                      <td>
                        <div className="service-name-cell">
                          <span className="service-icon">
                            <Icon size={18} />
                          </span>

                          <div>
                            <div className="service-name">
                              {service.name}
                            </div>

                            <div className="service-sub-category">
                              {service.category}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="service-description">
                        {service.description}
                      </td>

                      <td className="duration-cell">
                        {service.duration}
                      </td>

                      <td className="price-cell">
                        {formatPrice(service.price)}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            service.active === false
                              ? "status-inactive"
                              : "status-active"
                          }`}
                        >
                          {service.active === false
                            ? "Inactive"
                            : "Active"}
                        </span>
                      </td>

                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="icon-btn"
                            aria-label="View"
                            title="View"
                            onClick={() =>
                              openDetails(service.id)
                            }
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            className="icon-btn"
                            aria-label="Edit"
                            title="Edit"
                            onClick={() =>
                              openEdit(service.id)
                            }
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            className={`icon-btn ${
                              service.active === false
                                ? "icon-btn-activate"
                                : "icon-btn-deactivate"
                            }`}
                            aria-label={
                              service.active === false
                                ? "Activate"
                                : "Deactivate"
                            }
                            title={
                              service.active === false
                                ? "Activate"
                                : "Deactivate"
                            }
                            disabled={
                              updatingId === service.id
                            }
                            onClick={() =>
                              toggleStatus(service)
                            }
                          >
                            <Power size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>
            Showing {firstRecord} to {lastRecord} of{" "}
            {filtered.length} results
          </span>

          <div className="pagination">
            <button
              type="button"
              className="page-btn"
              disabled={safePage === 1}
              onClick={() =>
                setPage((current) =>
                  Math.max(1, current - 1)
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
                className={`page-btn ${
                  safePage === index + 1
                    ? "page-btn-active"
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
              className="page-btn"
              disabled={safePage === totalPages}
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
        </div>
      </div>
    </div>
  );
}