import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Eye,
  Pencil,
  ArrowLeft,
  Bug,
  Calendar,
  ClipboardList,
  Settings,
  Clock,
  IndianRupee,
  Tag,
  Image as ImageIcon,
  Info,
  CheckCircle,
  Camera,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import api from "../../api/axios";
import "./service-details.css";

const formatDate = (value, includeTime = false) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(includeTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
        }
      : {}),
  }).format(date);
};

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));

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

  return "Unable to load service details.";
};

const InfoRow = ({ label, value }) => (
  <div className="sd-info-row">
    <span className="sd-info-label">{label}</span>
    <span className="sd-info-colon">:</span>
    <span className="sd-info-value">{value || "—"}</span>
  </div>
);

export default function ServiceDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const serviceId =
    location.state?.serviceId ||
    sessionStorage.getItem("pcmsServiceId");

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadService = async () => {
      if (!serviceId) {
        setError("Service ID was not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/admin/services/${serviceId}`
        );

        setService(response.data);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [serviceId]);

  const timeline = useMemo(() => {
    if (!service) return [];

    return [
      {
        title: "Service Created",
        date: formatDate(service.createdAt, true),
      },
      {
        title: "Service Updated",
        date: formatDate(service.updatedAt, true),
      },
    ];
  }, [service]);

  const openEdit = () => {
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

  const statusText =
    service?.active === false ? "Inactive" : "Active";

  const statusClass =
    service?.active === false
      ? "sd-badge-inactive"
      : "sd-badge-success";

  return (
    <div className="sd-page">
      <nav className="sd-breadcrumb" aria-label="Breadcrumb">
        <button
          type="button"
          className="sd-breadcrumb-link sd-breadcrumb-button"
          onClick={() => navigate("/admin/dashboard")}
        >
          Admin
        </button>

        <ChevronRight size={14} className="sd-breadcrumb-sep" />

        <button
          type="button"
          className="sd-breadcrumb-link sd-breadcrumb-button"
          onClick={() => navigate("/admin/services")}
        >
          Services
        </button>

        <ChevronRight size={14} className="sd-breadcrumb-sep" />

        <span className="sd-breadcrumb-current">
          View Service
        </span>
      </nav>

      <header className="sd-header">
        <div className="sd-header-left">
          <span className="sd-header-icon">
            <Eye size={26} strokeWidth={2} />
          </span>

          <div>
            <h1 className="sd-title">Service Details</h1>

            <p className="sd-subtitle">
              View complete information about this service.
            </p>
          </div>
        </div>

        <div className="sd-header-actions">
          <button
            type="button"
            className="sd-btn sd-btn-outline"
            onClick={openEdit}
            disabled={!service}
          >
            <Pencil size={16} strokeWidth={2} />
            Edit Service
          </button>

          <button
            type="button"
            className="sd-btn sd-btn-outline"
            onClick={() => navigate("/admin/services")}
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Back to Services
          </button>
        </div>
      </header>

      {error && (
        <div className="sd-message sd-message-error">
          <AlertCircle size={17} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="sd-loading">
          <LoaderCircle
            size={22}
            className="sd-loading-icon"
          />
          Loading service details...
        </div>
      ) : service ? (
        <>
          <section className="sd-summary-card">
            <div className="sd-summary-left">
              <span className="sd-summary-icon">
                <Bug size={28} strokeWidth={2} />
              </span>

              <div className="sd-summary-text">
                <div className="sd-summary-name-row">
                  <span className="sd-summary-name">
                    {service.name}
                  </span>

                  <span className={`sd-badge ${statusClass}`}>
                    {statusText}
                  </span>
                </div>

                <p className="sd-summary-desc">
                  {service.description}
                </p>
              </div>
            </div>

            <div className="sd-summary-meta">
              <div className="sd-meta-field">
                <span className="sd-meta-label">Service ID</span>
                <span className="sd-meta-value">
                  SRV-{service.id}
                </span>
              </div>

              <div className="sd-meta-field">
                <span className="sd-meta-label">Created On</span>
                <span className="sd-meta-value sd-meta-with-icon">
                  <Calendar size={14} strokeWidth={2} />
                  {formatDate(service.createdAt)}
                </span>
              </div>

              <div className="sd-meta-field">
                <span className="sd-meta-label">Last Updated</span>
                <span className="sd-meta-value sd-meta-with-icon">
                  <Calendar size={14} strokeWidth={2} />
                  {formatDate(service.updatedAt)}
                </span>
              </div>

              <div className="sd-meta-field">
                <span className="sd-meta-label">Status</span>
                <span className={`sd-badge ${statusClass}`}>
                  {statusText}
                </span>
              </div>
            </div>
          </section>

          <div className="sd-layout">
            <div className="sd-main-col">
              <section className="sd-card">
                <div className="sd-card-header">
                  <span className="sd-card-header-icon">
                    <ClipboardList size={18} strokeWidth={2} />
                  </span>

                  <h2 className="sd-card-title">
                    Service Information
                  </h2>
                </div>

                <div className="sd-info-columns">
                  <div className="sd-info-list">
                    <InfoRow
                      label="Service Name"
                      value={service.name}
                    />

                    <InfoRow
                      label="Service Category"
                      value={service.category}
                    />

                    <InfoRow
                      label="Short Description"
                      value={service.description}
                    />
                  </div>

                  <div className="sd-info-list">
                    <InfoRow
                      label="Duration"
                      value={service.duration}
                    />

                    <InfoRow
                      label="Price"
                      value={formatPrice(service.price)}
                    />

                    <InfoRow
                      label="Current Status"
                      value={statusText}
                    />
                  </div>
                </div>
              </section>

              <section className="sd-card">
                <div className="sd-card-header">
                  <span className="sd-card-header-icon">
                    <Settings size={18} strokeWidth={2} />
                  </span>

                  <h2 className="sd-card-title">
                    Service Details
                  </h2>
                </div>

                <div className="sd-detail-grid">
                  <div className="sd-detail-item">
                    <span className="sd-detail-icon">
                      <Clock size={16} strokeWidth={2} />
                    </span>

                    <div className="sd-detail-text">
                      <span className="sd-detail-label">Duration</span>
                      <span className="sd-detail-value">
                        {service.duration}
                      </span>
                    </div>
                  </div>

                  <div className="sd-detail-item">
                    <span className="sd-detail-icon">
                      <IndianRupee size={16} strokeWidth={2} />
                    </span>

                    <div className="sd-detail-text">
                      <span className="sd-detail-label">Price</span>
                      <span className="sd-detail-value">
                        {formatPrice(service.price)}
                      </span>
                    </div>
                  </div>

                  <div className="sd-detail-item">
                    <span className="sd-detail-icon">
                      <Tag size={16} strokeWidth={2} />
                    </span>

                    <div className="sd-detail-text">
                      <span className="sd-detail-label">Category</span>
                      <span className="sd-detail-value">
                        {service.category}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="sd-card">
                <div className="sd-card-header">
                  <span className="sd-card-header-icon">
                    <Clock size={18} strokeWidth={2} />
                  </span>

                  <h2 className="sd-card-title">
                    Activity Timeline
                  </h2>
                </div>

                <div className="sd-timeline">
                  {timeline.map((step, index) => (
                    <React.Fragment key={step.title}>
                      <div className="sd-timeline-step">
                        <span className="sd-timeline-dot">
                          <CheckCircle size={16} strokeWidth={2} />
                        </span>

                        <div className="sd-timeline-text">
                          <span className="sd-timeline-title">
                            {step.title}
                          </span>

                          <span className="sd-timeline-date">
                            {step.date}
                          </span>
                        </div>
                      </div>

                      {index < timeline.length - 1 && (
                        <span className="sd-timeline-connector" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </section>
            </div>

            <aside className="sd-side-col">
              <section className="sd-card">
                <div className="sd-card-header">
                  <span className="sd-card-header-icon">
                    <Tag size={18} strokeWidth={2} />
                  </span>

                  <h2 className="sd-card-title">
                    Pricing Information
                  </h2>
                </div>

                <div className="sd-pricing-list">
                  <div className="sd-pricing-row">
                    <span className="sd-pricing-label">
                      Base Price
                    </span>

                    <span className="sd-pricing-colon">:</span>

                    <span className="sd-pricing-value">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                </div>

                <div className="sd-pricing-total-row">
                  <span className="sd-pricing-total-label">
                    Total Price
                  </span>

                  <span className="sd-pricing-colon">:</span>

                  <span className="sd-pricing-total-value">
                    {formatPrice(service.price)}
                  </span>
                </div>
              </section>

              <section className="sd-card">
                <div className="sd-card-header">
                  <span className="sd-card-header-icon">
                    <ImageIcon size={18} strokeWidth={2} />
                  </span>

                  <h2 className="sd-card-title">
                    Service Image
                  </h2>
                </div>

                {service.serviceImage ? (
                  <img
                    src={service.serviceImage}
                    alt={service.name}
                    className="sd-service-image"
                  />
                ) : (
                  <div className="sd-image-placeholder">
                    <Camera size={32} strokeWidth={1.5} />
                    <span>No image stored</span>
                  </div>
                )}
              </section>

              <section className="sd-card">
                <div className="sd-card-header">
                  <span className="sd-card-header-icon">
                    <Info size={18} strokeWidth={2} />
                  </span>

                  <h2 className="sd-card-title">
                    Status Information
                  </h2>
                </div>

                <div className="sd-status-list">
                  <div className="sd-status-row">
                    <span className="sd-status-label">
                      Current Status
                    </span>

                    <span className={`sd-badge ${statusClass}`}>
                      {statusText}
                    </span>
                  </div>

                  <div className="sd-status-row">
                    <span className="sd-status-label">
                      Service Availability
                    </span>

                    <span className={`sd-badge ${statusClass}`}>
                      {service.active === false
                        ? "Unavailable"
                        : "Available"}
                    </span>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </>
      ) : null}
    </div>
  );
}