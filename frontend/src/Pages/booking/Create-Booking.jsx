import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Pencil,
  Bug,
  Sparkles,
  Clock,
  Tag,
  Building2,
  Ruler,
  UploadCloud,
  X,
  RotateCcw,
  CalendarCheck,
  ChevronDown,
  LayoutGrid,
  UserCheck,
  Leaf,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import api from "../../api/axios";
import "./Create-Booking.css";

const DEFAULT_PROFILE = {
  name: "Customer",
  email: "",
  phone: "",
  address: "",
};

const SERVICES = {
  "Termite Control": {
    icon: Bug,
    duration: "45 - 60 mins",
    price: 1299,
    types: [
      {
        label: "Inspection & Treatment",
        inspectionCharge: 199,
      },
      {
        label: "Treatment Only",
        inspectionCharge: 0,
      },
      {
        label: "Inspection Only",
        inspectionCharge: 0,
      },
    ],
  },

  "General Pest Control": {
    icon: Sparkles,
    duration: "60 - 75 mins",
    price: 999,
    types: [
      {
        label: "Standard Treatment",
        inspectionCharge: 0,
      },
      {
        label: "Deep Treatment",
        inspectionCharge: 149,
      },
    ],
  },

  "Cockroach Control": {
    icon: Bug,
    duration: "30 - 45 mins",
    price: 799,
    types: [
      {
        label: "Gel Treatment",
        inspectionCharge: 0,
      },
      {
        label: "Spray Treatment",
        inspectionCharge: 0,
      },
    ],
  },

  "Rodent Control": {
    icon: Bug,
    duration: "45 - 60 mins",
    price: 899,
    types: [
      {
        label: "Trap Installation",
        inspectionCharge: 99,
      },
      {
        label: "Baiting Treatment",
        inspectionCharge: 99,
      },
    ],
  },

  "Mosquito Control": {
    icon: Sparkles,
    duration: "30 - 45 mins",
    price: 699,
    types: [
      {
        label: "Fogging Treatment",
        inspectionCharge: 0,
      },
    ],
  },
};

const PROPERTY_TYPES = [
  "Apartment",
  "Independent House",
  "Villa",
  "Commercial Office",
  "Warehouse",
  "Other",
];

const PROPERTY_SIZES = [
  "Below 500 sq.ft.",
  "500 - 1000 sq.ft.",
  "1001 - 1500 sq.ft.",
  "1501 - 2000 sq.ft.",
  "Above 2000 sq.ft.",
];

const TIME_SLOTS = [
  "08:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 02:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
];

const PEST_TYPES = [
  "Termites",
  "Cockroaches",
  "Ants",
  "Rodents",
  "Mosquitoes",
  "Bed Bugs",
  "Other",
];

const CONVENIENCE_FEE = 49;
const MAX_IMAGES = 5;
const MAX_DESCRIPTION = 500;

function createEmptyForm(profile = DEFAULT_PROFILE) {
  return {
    service: "",
    serviceType: "",
    propertyType: "",
    propertySize: "",
    address: profile.address || "",
    landmark: "",
    city: "",
    pincode: "",
    date: "",
    timeSlot: "",
    pestType: "",
    description: "",
  };
}

function todayPlus(days) {
  const date = new Date();

  date.setDate(date.getDate() + days);

  return date.toISOString().split("T")[0];
}

function getBackendError(error) {
  const responseData = error.response?.data;

  if (typeof responseData === "string") {
    return responseData;
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData?.error) {
    return responseData.error;
  }

  if (responseData && typeof responseData === "object") {
    const validationMessage = Object.values(responseData).find(
      (value) => typeof value === "string"
    );

    if (validationMessage) {
      return validationMessage;
    }
  }

  if (!error.response) {
    return "Unable to connect to the server.";
  }

  return "Unable to create booking. Please try again.";
}

export default function BookService({
  onEditProfile,
  onSubmit,
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [profileLoading, setProfileLoading] = useState(true);

  const [form, setForm] = useState(
    createEmptyForm(DEFAULT_PROFILE)
  );

  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);

        const response = await api.get("/users/profile");
        const customer = response.data;

        const completeAddress = [
          customer.address,
          customer.city,
          customer.pincode,
        ]
          .filter(Boolean)
          .join(", ");

        const loadedProfile = {
          name: customer.fullName || "Customer",
          email: customer.email || "",
          phone: customer.phone || "",
          address: completeAddress,
        };

        setProfile(loadedProfile);

        setForm((currentForm) => ({
          ...currentForm,
          address:
            currentForm.address ||
            customer.address ||
            completeAddress ||
            "",
          city: currentForm.city || customer.city || "",
          pincode:
            currentForm.pincode ||
            customer.pincode ||
            "",
        }));
      } catch (error) {
        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          localStorage.removeItem("pcmsAuth");
          navigate("/login", { replace: true });
          return;
        }

        setApiError(
          "Unable to load customer profile information."
        );
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const selectedService = form.service
    ? SERVICES[form.service]
    : null;

  const selectedType = useMemo(() => {
    if (!selectedService || !form.serviceType) {
      return null;
    }

    return (
      selectedService.types.find(
        (type) => type.label === form.serviceType
      ) || null
    );
  }, [selectedService, form.serviceType]);

  const pricing = useMemo(() => {
    const serviceCharge = selectedService
      ? selectedService.price
      : 0;

    const inspectionCharge = selectedType
      ? selectedType.inspectionCharge
      : 0;

    const convenienceFee = selectedService
      ? CONVENIENCE_FEE
      : 0;

    const total =
      serviceCharge +
      inspectionCharge +
      convenienceFee;

    return {
      serviceCharge,
      inspectionCharge,
      convenienceFee,
      total,
    };
  }, [selectedService, selectedType]);

  const handleField = (field) => (event) => {
    const value = event.target.value;

    setForm((currentForm) => {
      const updatedForm = {
        ...currentForm,
        [field]: value,
      };

      if (field === "service") {
        updatedForm.serviceType = "";
      }

      return updatedForm;
    });

    if (errors[field]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: "",
      }));
    }

    if (apiError) {
      setApiError("");
    }
  };

  const handleDescription = (event) => {
    const value = event.target.value.slice(
      0,
      MAX_DESCRIPTION
    );

    setForm((currentForm) => ({
      ...currentForm,
      description: value,
    }));

    if (errors.description) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        description: "",
      }));
    }

    if (apiError) {
      setApiError("");
    }
  };

  const addImages = (files) => {
    const imageFiles = Array.from(files || []).filter(
      (file) => file.type.startsWith("image/")
    );

    const remainingSpace =
      MAX_IMAGES - images.length;

    const acceptedImages = imageFiles
      .slice(0, remainingSpace)
      .map((file) => ({
        file,
        url: URL.createObjectURL(file),
        id: `${file.name}-${file.lastModified}-${Math.random()
          .toString(36)
          .slice(2, 7)}`,
      }));

    setImages((currentImages) => [
      ...currentImages,
      ...acceptedImages,
    ]);
  };

  const removeImage = (id) => {
    setImages((currentImages) => {
      const imageToRemove = currentImages.find(
        (image) => image.id === id
      );

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }

      return currentImages.filter(
        (image) => image.id !== id
      );
    });
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.service) {
      nextErrors.service =
        "Please select a service";
    }

    if (!form.serviceType) {
      nextErrors.serviceType =
        "Please select a service type";
    }

    if (!form.propertyType) {
      nextErrors.propertyType =
        "Please select a property type";
    }

    if (!form.propertySize) {
      nextErrors.propertySize =
        "Please select a property size";
    }

    if (!form.address.trim()) {
      nextErrors.address =
        "Address is required";
    }

    if (!form.city.trim()) {
      nextErrors.city =
        "City is required";
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      nextErrors.pincode =
        "Enter a valid 6-digit pincode";
    }

    if (!form.date) {
      nextErrors.date =
        "Please select a preferred date";
    }

    if (!form.timeSlot) {
      nextErrors.timeSlot =
        "Please select a time slot";
    }

    if (!form.pestType) {
      nextErrors.pestType =
        "Please select a pest type";
    }

    if (!form.description.trim()) {
      nextErrors.description =
        "Please describe the problem";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    images.forEach((image) => {
      URL.revokeObjectURL(image.url);
    });

    setForm(createEmptyForm(profile));
    setErrors({});
    setImages([]);
    setSubmitted(false);
    setApiError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitted(false);
    setApiError("");

    if (!validate()) {
      return;
    }

    const bookingRequest = {
      serviceName: form.service,
      serviceType: form.serviceType,
      propertyType: form.propertyType,
      propertySize: form.propertySize,
      serviceAddress: form.address.trim(),
      landmark: form.landmark.trim(),
      city: form.city.trim(),
      pincode: form.pincode.trim(),
      preferredDate: form.date,
      preferredTimeSlot: form.timeSlot,
      pestType: form.pestType,
      problemDescription:
        form.description.trim(),
    };

    try {
      setSubmitting(true);

      const response = await api.post(
        "/customer/bookings",
        bookingRequest
      );

      setSubmitted(true);

      if (typeof onSubmit === "function") {
        onSubmit(response.data);
      }

      setTimeout(() => {
        navigate("/customer/bookings", {
          replace: true,
          state: {
            bookingCreated: true,
            booking: response.data,
          },
        });
      }, 1200);
    } catch (error) {
      setApiError(getBackendError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProfile = () => {
    if (typeof onEditProfile === "function") {
      onEditProfile();
      return;
    }

    navigate("/customer/profile/edit-profile");
  };

  const ServiceIcon = selectedService
    ? selectedService.icon
    : Bug;

  return (
    <div className="bs-page">
      <div className="bs-header">
        <span className="bs-header-icon">
          <Calendar size={22} />
        </span>

        <div>
          <h1 className="bs-title">
            Book a Pest Control Service
          </h1>

          <p className="bs-subtitle">
            Fill in the details below to schedule your
            service.
          </p>
        </div>
      </div>

      <div className="bs-profile-bar">
        <div className="bs-profile-field">
          <User size={18} />

          <div>
            <p className="bs-profile-label">Name</p>

            <p className="bs-profile-value">
              {profileLoading
                ? "Loading..."
                : profile.name}
            </p>
          </div>
        </div>

        <div className="bs-profile-field">
          <Mail size={18} />

          <div>
            <p className="bs-profile-label">Email</p>

            <p className="bs-profile-value">
              {profileLoading
                ? "Loading..."
                : profile.email || "Not added"}
            </p>
          </div>
        </div>

        <div className="bs-profile-field">
          <Phone size={18} />

          <div>
            <p className="bs-profile-label">Phone</p>

            <p className="bs-profile-value">
              {profileLoading
                ? "Loading..."
                : profile.phone || "Not added"}
            </p>
          </div>
        </div>

        <div className="bs-profile-field bs-profile-field--address">
          <MapPin size={18} />

          <div>
            <p className="bs-profile-label">
              Address
            </p>

            <p className="bs-profile-value">
              {profileLoading
                ? "Loading..."
                : profile.address || "Not added"}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="bs-btn bs-btn--outline bs-btn--sm"
          onClick={handleEditProfile}
        >
          <Pencil size={14} />
          Edit Profile
        </button>
      </div>

      <div className="bs-layout">
        <form
          className="bs-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <section className="bs-card">
            <div className="bs-step-heading">
              <span className="bs-step-number">
                1
              </span>
              <h3>Select Service</h3>
            </div>

            <div className="bs-grid-2">
              <div className="bs-field">
                <label>
                  Select Service{" "}
                  <span className="bs-required">
                    *
                  </span>
                </label>

                <div
                  className={`bs-select ${
                    errors.service
                      ? "bs-select--error"
                      : ""
                  }`}
                >
                  <span className="bs-select__icon">
                    <ServiceIcon size={16} />
                  </span>

                  <select
                    value={form.service}
                    onChange={handleField("service")}
                  >
                    <option value="" disabled>
                      Choose a service
                    </option>

                    {Object.keys(SERVICES).map(
                      (name) => (
                        <option
                          key={name}
                          value={name}
                        >
                          {name}
                        </option>
                      )
                    )}
                  </select>

                  <ChevronDown
                    size={15}
                    className="bs-select__chevron"
                  />
                </div>

                {errors.service && (
                  <span className="bs-error-text">
                    {errors.service}
                  </span>
                )}
              </div>

              <div className="bs-field">
                <label>
                  Service Type{" "}
                  <span className="bs-required">
                    *
                  </span>
                </label>

                <div
                  className={`bs-select ${
                    errors.serviceType
                      ? "bs-select--error"
                      : ""
                  } ${
                    !selectedService
                      ? "bs-select--disabled"
                      : ""
                  }`}
                >
                  <span className="bs-select__icon">
                    <Sparkles size={16} />
                  </span>

                  <select
                    value={form.serviceType}
                    onChange={handleField(
                      "serviceType"
                    )}
                    disabled={!selectedService}
                  >
                    <option value="" disabled>
                      {selectedService
                        ? "Choose a service type"
                        : "Select a service first"}
                    </option>

                    {selectedService?.types.map(
                      (type) => (
                        <option
                          key={type.label}
                          value={type.label}
                        >
                          {type.label}
                        </option>
                      )
                    )}
                  </select>

                  <ChevronDown
                    size={15}
                    className="bs-select__chevron"
                  />
                </div>

                {errors.serviceType && (
                  <span className="bs-error-text">
                    {errors.serviceType}
                  </span>
                )}
              </div>

              <div className="bs-field">
                <label className="bs-field__muted-label">
                  Service Duration
                </label>

                <div className="bs-readonly">
                  <Clock size={15} />

                  {selectedService
                    ? selectedService.duration
                    : "—"}
                </div>
              </div>

              <div className="bs-field">
                <label className="bs-field__muted-label">
                  Starting Price
                </label>

                <div className="bs-readonly">
                  <Tag size={15} />

                  {selectedService
                    ? `₹${selectedService.price.toLocaleString(
                        "en-IN"
                      )} onwards`
                    : "—"}
                </div>
              </div>
            </div>
          </section>

          <section className="bs-card">
            <div className="bs-step-heading">
              <span className="bs-step-number">
                2
              </span>
              <h3>Property Details</h3>
            </div>

            <div className="bs-grid-2">
              <div className="bs-field">
                <label>
                  Property Type{" "}
                  <span className="bs-required">
                    *
                  </span>
                </label>

                <div
                  className={`bs-select ${
                    errors.propertyType
                      ? "bs-select--error"
                      : ""
                  }`}
                >
                  <span className="bs-select__icon">
                    <Building2 size={16} />
                  </span>

                  <select
                    value={form.propertyType}
                    onChange={handleField(
                      "propertyType"
                    )}
                  >
                    <option value="" disabled>
                      Select property type
                    </option>

                    {PROPERTY_TYPES.map((type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={15}
                    className="bs-select__chevron"
                  />
                </div>

                {errors.propertyType && (
                  <span className="bs-error-text">
                    {errors.propertyType}
                  </span>
                )}
              </div>

              <div className="bs-field">
                <label>
                  Property Size (Approx.){" "}
                  <span className="bs-required">
                    *
                  </span>
                </label>

                <div
                  className={`bs-select ${
                    errors.propertySize
                      ? "bs-select--error"
                      : ""
                  }`}
                >
                  <span className="bs-select__icon">
                    <Ruler size={16} />
                  </span>

                  <select
                    value={form.propertySize}
                    onChange={handleField(
                      "propertySize"
                    )}
                  >
                    <option value="" disabled>
                      Select property size
                    </option>

                    {PROPERTY_SIZES.map((size) => (
                      <option
                        key={size}
                        value={size}
                      >
                        {size}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={15}
                    className="bs-select__chevron"
                  />
                </div>

                {errors.propertySize && (
                  <span className="bs-error-text">
                    {errors.propertySize}
                  </span>
                )}
              </div>
            </div>
          </section>

          <section className="bs-card">
            <div className="bs-step-heading">
              <span className="bs-step-number">
                3
              </span>
              <h3>Service Address</h3>
            </div>

            <div className="bs-field bs-field--full">
              <label>
                Address{" "}
                <span className="bs-required">
                  *
                </span>
              </label>

              <div
                className={`bs-input ${
                  errors.address
                    ? "bs-input--error"
                    : ""
                }`}
              >
                <MapPin
                  size={16}
                  className="bs-input__icon"
                />

                <input
                  type="text"
                  value={form.address}
                  onChange={handleField("address")}
                  placeholder="Enter your full address"
                />
              </div>

              {errors.address && (
                <span className="bs-error-text">
                  {errors.address}
                </span>
              )}
            </div>

            <div className="bs-grid-3">
              <div className="bs-field">
                <label>
                  Landmark{" "}
                  <span className="bs-optional">
                    (Optional)
                  </span>
                </label>

                <div className="bs-input">
                  <MapPin
                    size={16}
                    className="bs-input__icon"
                  />

                  <input
                    type="text"
                    value={form.landmark}
                    onChange={handleField(
                      "landmark"
                    )}
                    placeholder="Near Baner Road"
                  />
                </div>
              </div>

              <div className="bs-field">
                <label>
                  City{" "}
                  <span className="bs-required">
                    *
                  </span>
                </label>

                <div
                  className={`bs-input ${
                    errors.city
                      ? "bs-input--error"
                      : ""
                  }`}
                >
                  <input
                    type="text"
                    value={form.city}
                    onChange={handleField("city")}
                    placeholder="City"
                  />
                </div>

                {errors.city && (
                  <span className="bs-error-text">
                    {errors.city}
                  </span>
                )}
              </div>

              <div className="bs-field">
                <label>
                  Pincode{" "}
                  <span className="bs-required">
                    *
                  </span>
                </label>

                <div
                  className={`bs-input ${
                    errors.pincode
                      ? "bs-input--error"
                      : ""
                  }`}
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={form.pincode}
                    onChange={handleField(
                      "pincode"
                    )}
                    placeholder="411045"
                  />
                </div>

                {errors.pincode && (
                  <span className="bs-error-text">
                    {errors.pincode}
                  </span>
                )}
              </div>
            </div>
          </section>

          <section className="bs-card">
            <div className="bs-step-heading">
              <span className="bs-step-number">
                4
              </span>
              <h3>Schedule Service</h3>
            </div>

            <div className="bs-grid-2">
              <div className="bs-field">
                <label>
                  Preferred Date{" "}
                  <span className="bs-required">
                    *
                  </span>
                </label>

                <div
                  className={`bs-input ${
                    errors.date
                      ? "bs-input--error"
                      : ""
                  }`}
                >
                  <Calendar
                    size={16}
                    className="bs-input__icon"
                  />

                  <input
                    type="date"
                    min={todayPlus(0)}
                    value={form.date}
                    onChange={handleField("date")}
                  />
                </div>

                {errors.date && (
                  <span className="bs-error-text">
                    {errors.date}
                  </span>
                )}
              </div>

              <div className="bs-field">
                <label>
                  Preferred Time Slot{" "}
                  <span className="bs-required">
                    *
                  </span>
                </label>

                <div
                  className={`bs-select ${
                    errors.timeSlot
                      ? "bs-select--error"
                      : ""
                  }`}
                >
                  <span className="bs-select__icon">
                    <Clock size={16} />
                  </span>

                  <select
                    value={form.timeSlot}
                    onChange={handleField(
                      "timeSlot"
                    )}
                  >
                    <option value="" disabled>
                      Select a time slot
                    </option>

                    {TIME_SLOTS.map((slot) => (
                      <option
                        key={slot}
                        value={slot}
                      >
                        {slot}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={15}
                    className="bs-select__chevron"
                  />
                </div>

                {errors.timeSlot && (
                  <span className="bs-error-text">
                    {errors.timeSlot}
                  </span>
                )}
              </div>
            </div>
          </section>

          <section className="bs-card">
            <div className="bs-step-heading">
              <span className="bs-step-number">
                5
              </span>
              <h3>Pest Problem Details</h3>
            </div>

            <div className="bs-grid-2">
              <div className="bs-field">
                <label>
                  Pest Type{" "}
                  <span className="bs-required">
                    *
                  </span>
                </label>

                <div
                  className={`bs-select ${
                    errors.pestType
                      ? "bs-select--error"
                      : ""
                  }`}
                >
                  <span className="bs-select__icon">
                    <Bug size={16} />
                  </span>

                  <select
                    value={form.pestType}
                    onChange={handleField(
                      "pestType"
                    )}
                  >
                    <option value="" disabled>
                      Select pest type
                    </option>

                    {PEST_TYPES.map((pest) => (
                      <option
                        key={pest}
                        value={pest}
                      >
                        {pest}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={15}
                    className="bs-select__chevron"
                  />
                </div>

                {errors.pestType && (
                  <span className="bs-error-text">
                    {errors.pestType}
                  </span>
                )}
              </div>

              <div className="bs-field">
                <label>
                  Problem Description{" "}
                  <span className="bs-required">
                    *
                  </span>
                </label>

                <div
                  className={`bs-input bs-input--textarea ${
                    errors.description
                      ? "bs-input--error"
                      : ""
                  }`}
                >
                  <textarea
                    rows={3}
                    maxLength={MAX_DESCRIPTION}
                    value={form.description}
                    onChange={handleDescription}
                    placeholder="Describe the pest problem."
                  />

                  <span className="bs-char-count">
                    {form.description.length}/
                    {MAX_DESCRIPTION}
                  </span>
                </div>

                {errors.description && (
                  <span className="bs-error-text">
                    {errors.description}
                  </span>
                )}
              </div>
            </div>

            <div className="bs-field bs-field--full">
              <label>
                Upload Images{" "}
                <span className="bs-optional">
                  (Optional — upload will be connected
                  later)
                </span>
              </label>

              <div
                className={`bs-dropzone ${
                  isDragging
                    ? "bs-dropzone--active"
                    : ""
                }`}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() =>
                  setIsDragging(false)
                }
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                  addImages(
                    event.dataTransfer.files
                  );
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  hidden
                  onChange={(event) =>
                    addImages(event.target.files)
                  }
                />

                <UploadCloud
                  size={18}
                  className="bs-dropzone__icon"
                />

                <div className="bs-dropzone__text-group">
                  <p className="bs-dropzone__text">
                    Click to upload or drag and drop
                  </p>

                  <p className="bs-dropzone__hint">
                    JPG, PNG up to 5MB each
                  </p>
                </div>

                {images.length > 0 && (
                  <div className="bs-dropzone__previews">
                    {images.map((image) => (
                      <div
                        className="bs-preview"
                        key={image.id}
                      >
                        <img
                          src={image.url}
                          alt="Uploaded pest issue"
                        />

                        <button
                          type="button"
                          className="bs-preview__remove"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeImage(image.id);
                          }}
                          aria-label="Remove image"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {apiError && (
            <div
              className="bs-success-banner"
              style={{
                color: "#dc2626",
                background: "rgba(220, 38, 38, 0.08)",
                borderColor:
                  "rgba(220, 38, 38, 0.2)",
              }}
            >
              <AlertCircle size={16} />
              {apiError}
            </div>
          )}

          {submitted && (
            <div className="bs-success-banner">
              <CalendarCheck size={16} />
              Your service has been booked
              successfully. Redirecting to My
              Bookings...
            </div>
          )}

          <div className="bs-form__actions">
            <button
              type="button"
              className="bs-btn bs-btn--outline"
              onClick={resetForm}
              disabled={submitting}
            >
              <RotateCcw size={15} />
              Reset
            </button>

            <button
              type="submit"
              className="bs-btn bs-btn--primary"
              disabled={submitting}
            >
              <CalendarCheck size={15} />

              {submitting
                ? "Booking..."
                : "Book Service"}
            </button>
          </div>
        </form>

        <aside className="bs-card bs-summary">
          <div className="bs-summary__header">
            <span className="bs-summary__icon">
              <LayoutGrid size={18} />
            </span>

            <h3>Booking Summary</h3>
          </div>

          {selectedService ? (
            <div className="bs-summary__service">
              <span className="bs-summary__service-icon">
                <ServiceIcon size={22} />
              </span>

              <div>
                <p className="bs-summary__service-name">
                  {form.service}
                </p>

                {form.serviceType && (
                  <span className="bs-summary__service-tag">
                    {form.serviceType}
                  </span>
                )}

                <p className="bs-summary__service-duration">
                  <Clock size={13} />
                  {selectedService.duration}
                </p>
              </div>
            </div>
          ) : (
            <div className="bs-summary__empty">
              Select a service to see your booking
              summary.
            </div>
          )}

          <div className="bs-summary__rows">
            <div className="bs-summary__row">
              <span>Service Charges</span>
              <span>
                ₹
                {pricing.serviceCharge.toLocaleString(
                  "en-IN"
                )}
                .00
              </span>
            </div>

            <div className="bs-summary__row">
              <span>Inspection Charges</span>
              <span>
                ₹
                {pricing.inspectionCharge.toLocaleString(
                  "en-IN"
                )}
                .00
              </span>
            </div>

            <div className="bs-summary__row">
              <span>Convenience Fee</span>
              <span>
                ₹
                {pricing.convenienceFee.toLocaleString(
                  "en-IN"
                )}
                .00
              </span>
            </div>
          </div>

          <div className="bs-summary__total">
            <span>Total Amount</span>

            <span>
              ₹
              {pricing.total.toLocaleString(
                "en-IN"
              )}
              .00
            </span>
          </div>

          <ul className="bs-summary__features">
            <li>
              <span className="bs-summary__feature-icon">
                <UserCheck size={18} />
              </span>

              <div>
                <p>Expert Technicians</p>
                <span>
                  Verified and experienced
                  professionals
                </span>
              </div>
            </li>

            <li>
              <span className="bs-summary__feature-icon">
                <Leaf size={18} />
              </span>

              <div>
                <p>Safe & Eco-friendly</p>
                <span>
                  Safe for your family and pets
                </span>
              </div>
            </li>

            <li>
              <span className="bs-summary__feature-icon">
                <ShieldCheck size={18} />
              </span>

              <div>
                <p>Satisfaction Guarantee</p>
                <span>
                  We ensure quality service
                </span>
              </div>
            </li>
          </ul>

          <div className="bs-summary__note">
            <ShieldCheck size={16} />
            You can cancel or reschedule your booking
            before the technician is assigned.
          </div>
        </aside>
      </div>
    </div>
  );
}