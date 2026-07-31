import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  X,
  Save,
  SprayCan,
  FileText,
  Tag,
  Grid3x3,
  PenLine,
  Boxes,
  IndianRupee,
  Clock,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";
import api from "../../api/axios";
import "./edit-service.css";

const LIMITS = {
  shortDescription: 150,
};

const initialForm = {
  serviceName: "",
  serviceCategory: "",
  shortDescription: "",
  price: "",
  duration: "",
};

const getErrorMessage = (error) => {
  const data = error.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data?.message) return data.message;
  if (data?.error) return data.error;

  if (data && typeof data === "object") {
    const firstMessage = Object.values(data).find(
      (value) => typeof value === "string"
    );

    if (firstMessage) return firstMessage;
  }

  if (!error.response) {
    return "Unable to connect to the backend.";
  }

  return "Unable to update service.";
};

export default function EditService() {
  const navigate = useNavigate();
  const location = useLocation();

  const serviceId =
    location.state?.serviceId ||
    sessionStorage.getItem("pcmsServiceId");

  const [formData, setFormData] = useState(initialForm);
  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadService = async () => {
      if (!serviceId) {
        setBanner({
          type: "error",
          text: "Service ID was not found.",
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setBanner(null);

        const response = await api.get(
          `/admin/services/${serviceId}`
        );

        const service = response.data;

        setFormData({
          serviceName: service.name || "",
          serviceCategory: service.category || "",
          shortDescription: service.description || "",
          price: String(service.price ?? ""),
          duration: service.duration || "",
        });

        setActive(service.active !== false);
      } catch (error) {
        setBanner({
          type: "error",
          text: getErrorMessage(error),
        });
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [serviceId]);

  const updateField = (field, value, limit) => {
    if (limit && value.length > limit) return;

    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));

    setBanner(null);
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.serviceName.trim()) {
      nextErrors.serviceName = true;
    }

    if (!formData.serviceCategory.trim()) {
      nextErrors.serviceCategory = true;
    }

    if (!formData.shortDescription.trim()) {
      nextErrors.shortDescription = true;
    }

    if (formData.price === "") {
      nextErrors.price = true;
    } else if (Number(formData.price) < 0) {
      nextErrors.price = true;
    }

    if (!formData.duration.trim()) {
      nextErrors.duration = true;
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) {
      setBanner({
        type: "error",
        text: "Please fill in all required fields before updating.",
      });
      return;
    }

    const payload = {
      name: formData.serviceName.trim(),
      category: formData.serviceCategory.trim(),
      description: formData.shortDescription.trim(),
      duration: formData.duration.trim(),
      price: Number(formData.price),
      active,
    };

    try {
      setSaving(true);
      setBanner(null);

      await api.put(
        `/admin/services/${serviceId}`,
        payload
      );

      setBanner({
        type: "success",
        text: "Service updated successfully.",
      });

      window.setTimeout(() => {
        navigate("/admin/services/details", {
          state: {
            serviceId,
          },
        });
      }, 700);
    } catch (error) {
      setBanner({
        type: "error",
        text: getErrorMessage(error),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="es-page">
      <nav className="es-breadcrumb" aria-label="Breadcrumb">
        <button
          type="button"
          className="es-breadcrumb-link es-breadcrumb-button"
          onClick={() => navigate("/admin/dashboard")}
        >
          Admin
        </button>

        <ChevronRight size={14} className="es-breadcrumb-sep" />

        <button
          type="button"
          className="es-breadcrumb-link es-breadcrumb-button"
          onClick={() => navigate("/admin/services")}
        >
          Services
        </button>

        <ChevronRight size={14} className="es-breadcrumb-sep" />

        <span className="es-breadcrumb-current">
          Edit Service
        </span>
      </nav>

      <header className="es-header">
        <div className="es-header-left">
          <span className="es-header-icon">
            <SprayCan size={26} strokeWidth={2} />
          </span>

          <div>
            <h1 className="es-title">Edit Service</h1>

            <p className="es-subtitle">
              Update the service information and save your changes.
            </p>
          </div>
        </div>

        <div className="es-header-actions">
          <button
            type="button"
            className="es-btn es-btn-outline"
            onClick={() => navigate("/admin/services")}
            disabled={saving}
          >
            <X size={16} strokeWidth={2} />
            Cancel
          </button>

          <button
            type="button"
            className="es-btn es-btn-primary"
            onClick={handleUpdate}
            disabled={loading || saving}
          >
            {saving ? (
              <LoaderCircle
                size={16}
                className="es-loading-icon"
              />
            ) : (
              <Save size={16} strokeWidth={2} />
            )}

            {saving ? "Updating..." : "Update Service"}
          </button>
        </div>
      </header>

      {banner && (
        <div
          className={`es-banner ${
            banner.type === "success"
              ? "es-banner-success"
              : "es-banner-error"
          }`}
        >
          {banner.type === "success" ? (
            <CheckCircle2 size={16} strokeWidth={2} />
          ) : (
            <AlertTriangle size={16} strokeWidth={2} />
          )}

          <span>{banner.text}</span>
        </div>
      )}

      {loading ? (
        <div className="es-loading">
          <LoaderCircle
            size={22}
            className="es-loading-icon"
          />
          Loading service information...
        </div>
      ) : (
        <>
          <section className="es-card">
            <div className="es-card-header">
              <span className="es-card-header-icon">
                <FileText size={18} strokeWidth={2} />
              </span>

              <h2 className="es-card-title">
                Basic Information
              </h2>
            </div>

            <div className="es-form-grid es-grid-3">
              <div className="es-form-field">
                <label className="es-form-label">
                  Service Name{" "}
                  <span className="es-required">*</span>
                </label>

                <div
                  className={`es-input-wrap ${
                    errors.serviceName ? "es-field-error" : ""
                  }`}
                >
                  <Tag size={16} className="es-input-icon" />

                  <input
                    type="text"
                    className="es-input"
                    placeholder="Enter service name"
                    value={formData.serviceName}
                    onChange={(event) =>
                      updateField(
                        "serviceName",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="es-form-field">
                <label className="es-form-label">
                  Service Category{" "}
                  <span className="es-required">*</span>
                </label>

                <div
                  className={`es-select-wrap ${
                    errors.serviceCategory
                      ? "es-field-error"
                      : ""
                  }`}
                >
                  <Grid3x3
                    size={16}
                    className="es-input-icon"
                  />

                  <select
                    value={formData.serviceCategory}
                    onChange={(event) =>
                      updateField(
                        "serviceCategory",
                        event.target.value
                      )
                    }
                  >
                    <option value="">Select category</option>
                    <option>General Pest Control</option>
                    <option>Termite Control</option>
                    <option>Fumigation</option>
                    <option>Rodent Control</option>
                    <option>Bed Bug Control</option>
                    <option>Mosquito Control</option>
                  </select>

                  <ChevronDown
                    size={14}
                    className="es-select-caret"
                  />
                </div>
              </div>

              <div className="es-form-field es-field-span-2">
                <label className="es-form-label">
                  Short Description{" "}
                  <span className="es-required">*</span>
                </label>

                <div
                  className={`es-input-wrap es-input-wrap-counted ${
                    errors.shortDescription
                      ? "es-field-error"
                      : ""
                  }`}
                >
                  <PenLine
                    size={16}
                    className="es-input-icon"
                  />

                  <input
                    type="text"
                    className="es-input"
                    placeholder="Brief description about the service"
                    maxLength={LIMITS.shortDescription}
                    value={formData.shortDescription}
                    onChange={(event) =>
                      updateField(
                        "shortDescription",
                        event.target.value,
                        LIMITS.shortDescription
                      )
                    }
                  />

                  <span className="es-char-count-inline">
                    {formData.shortDescription.length}/
                    {LIMITS.shortDescription}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="es-card">
            <div className="es-card-header">
              <span className="es-card-header-icon">
                <Boxes size={18} strokeWidth={2} />
              </span>

              <h2 className="es-card-title">
                Service Details
              </h2>
            </div>

            <div className="es-form-grid es-grid-3">
              <div className="es-form-field">
                <label className="es-form-label">
                  Price (₹){" "}
                  <span className="es-required">*</span>
                </label>

                <div
                  className={`es-input-wrap ${
                    errors.price ? "es-field-error" : ""
                  }`}
                >
                  <IndianRupee
                    size={16}
                    className="es-input-icon"
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="es-input"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={(event) =>
                      updateField(
                        "price",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="es-form-field">
                <label className="es-form-label">
                  Duration{" "}
                  <span className="es-required">*</span>
                </label>

                <div
                  className={`es-select-wrap ${
                    errors.duration ? "es-field-error" : ""
                  }`}
                >
                  <Clock
                    size={16}
                    className="es-input-icon"
                  />

                  <select
                    value={formData.duration}
                    onChange={(event) =>
                      updateField(
                        "duration",
                        event.target.value
                      )
                    }
                  >
                    <option value="">Select duration</option>
                    <option>30 Minutes</option>
                    <option>1 Hour</option>
                    <option>1 - 2 Hours</option>
                    <option>2 Hours</option>
                    <option>2 - 3 Hours</option>
                    <option>2 - 4 Hours</option>
                    <option>Half Day</option>
                  </select>

                  <ChevronDown
                    size={14}
                    className="es-select-caret"
                  />
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}