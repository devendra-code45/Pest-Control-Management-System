import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Phone,
  Mail,
  MapPin,
  Home,
  Building,
  Hash,
  User,
  Users,
  Calendar,
  LoaderCircle,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import api from "../../api/axios";
import "./edittechnicianprofile.css";

const emptyForm = {
  phone: "",
  email: "",
  dateOfBirth: "",
  gender: "",
  streetAddress: "",
  city: "",
  state: "",
  zip: "",
  emergencyName: "",
  emergencyPhone: "",
  emergencyRelationship: "",
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

  return "Unable to update technician information.";
};

const splitAddress = (address = "") => {
  const parts = String(address)
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return {
      streetAddress: "",
      city: "",
      state: "",
      zip: "",
    };
  }

  // Example: "Pune, Maharashtra"
  if (parts.length === 2) {
    return {
      streetAddress: "",
      city: parts[0],
      state: parts[1],
      zip: "",
    };
  }

  // Example: "Kharadi, Pune, Maharashtra"
  if (parts.length === 3) {
    return {
      streetAddress: parts[0],
      city: parts[1],
      state: parts[2],
      zip: "",
    };
  }

  // Example:
  // "B-404, Green Valley, Pune, Maharashtra, 411014"
  const lastPart = parts.at(-1);
  const hasZip = /^\d{6}$/.test(lastPart);

  const zip = hasZip ? lastPart : "";
  const stateIndex = hasZip
    ? parts.length - 2
    : parts.length - 1;
  const cityIndex = stateIndex - 1;

  return {
    streetAddress: parts.slice(0, cityIndex).join(", "),
    city: parts[cityIndex] || "",
    state: parts[stateIndex] || "",
    zip,
  };
};

const FieldLabel = ({ children, required }) => (
  <label className="field-label">
    {children}
    {required && (
      <span className="field-label__required">*</span>
    )}
  </label>
);

const IconInput = ({ icon: Icon, ...props }) => (
  <div className="input-shell">
    <Icon size={16} className="input-shell__icon" />

    <input className="input-shell__field" {...props} />
  </div>
);

const SectionHeading = ({ icon: Icon, children }) => (
  <div className="section-heading">
    <span className="section-heading__icon">
      <Icon size={15} />
    </span>

    <h2>{children}</h2>
  </div>
);

const EditTechnicianProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const technicianId =
    location.state?.technicianId ||
    sessionStorage.getItem("pcmsTechnicianId");

  const [form, setForm] = useState(emptyForm);
  const [technician, setTechnician] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadTechnician = async () => {
      if (!technicianId) {
        setRequestError("Technician ID was not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setRequestError("");

        const response = await api.get(
          `/admin/technicians/${technicianId}`
        );

        const data = response.data || {};
        const parsedAddress = splitAddress(data.address);

        setTechnician(data);

        setForm({
          phone: data.phone || "",
          email: data.email || "",
          dateOfBirth:
            data.dateOfBirth ||
            data.dob ||
            "",
          gender: data.gender || "",
          streetAddress:
            data.streetAddress || parsedAddress.streetAddress,
          city: data.city || parsedAddress.city,
          state: data.state || parsedAddress.state,
          zip:
            data.zip ||
            data.postalCode ||
            parsedAddress.zip,
          emergencyName:
            data.emergencyContactName ||
            data.emergencyName ||
            "",
          emergencyPhone:
            data.emergencyContactPhone ||
            data.emergencyPhone ||
            "",
          emergencyRelationship:
            data.emergencyContactRelationship ||
            data.relationship ||
            "",
        });
      } catch (error) {
        setRequestError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    loadTechnician();
  }, [technicianId]);

  const updateField = (field) => (event) => {
    const { value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [field]: "",
    }));

    setSuccess("");
  };

  const validateForm = () => {
    const newErrors = {};
    const phonePattern = /^\d{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const zipPattern = /^\d{6}$/;

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!phonePattern.test(form.phone)) {
      newErrors.phone =
        "Enter a valid 10-digit phone number.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailPattern.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required.";
    }

    if (!form.gender) {
      newErrors.gender = "Gender is required.";
    }

    if (!form.streetAddress.trim()) {
      newErrors.streetAddress = "Address is required.";
    }

    if (!form.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!form.state.trim()) {
      newErrors.state = "State is required.";
    }

    if (!form.zip.trim()) {
      newErrors.zip = "ZIP code is required.";
    } else if (!zipPattern.test(form.zip)) {
      newErrors.zip = "Enter a valid 6-digit ZIP code.";
    }

    if (!form.emergencyName.trim()) {
      newErrors.emergencyName =
        "Emergency contact name is required.";
    }

    if (!form.emergencyPhone.trim()) {
      newErrors.emergencyPhone =
        "Emergency phone number is required.";
    } else if (!phonePattern.test(form.emergencyPhone)) {
      newErrors.emergencyPhone =
        "Enter a valid 10-digit phone number.";
    }

    if (!form.emergencyRelationship.trim()) {
      newErrors.emergencyRelationship =
        "Relationship is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const goToProfile = () => {
    navigate("/admin/technicians/profile/", {
      state: {
        technicianId,
      },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const address = [
      form.streetAddress.trim(),
      form.city.trim(),
      form.state.trim(),
      form.zip.trim(),
    ].join(", ");

    const payload = {
      ...technician,
      phone: form.phone.trim(),
      email: form.email.trim(),
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      address,
      streetAddress: form.streetAddress.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      zip: form.zip.trim(),
      postalCode: form.zip.trim(),
      emergencyContactName: form.emergencyName.trim(),
      emergencyContactPhone: form.emergencyPhone.trim(),
      emergencyName: form.emergencyName.trim(),
      emergencyPhone: form.emergencyPhone.trim(),
      emergencyContactRelationship:
        form.emergencyRelationship.trim(),
      relationship: form.emergencyRelationship.trim(),
    };

    try {
      setSaving(true);
      setRequestError("");
      setSuccess("");

      await api.put(
        `/admin/technicians/${technicianId}`,
        payload
      );

      setSuccess(
        "Technician information updated successfully."
      );

      window.setTimeout(() => {
        goToProfile();
      }, 700);
    } catch (error) {
      setRequestError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-technician-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <button
          type="button"
          className="breadcrumb__link"
          onClick={() => navigate("/admin/dashboard")}
        >
          Home
        </button>

        <span className="breadcrumb__separator">/</span>

        <button
          type="button"
          className="breadcrumb__link"
          onClick={() => navigate("/admin/technicians")}
        >
          Technicians
        </button>

        <span className="breadcrumb__separator">/</span>

        <span className="breadcrumb__current">
          Edit Technician Profile
        </span>
      </nav>

      <header className="page-header">
        <div>
          <h1 className="page-header__title">
            Edit Technician Profile
          </h1>

          <p className="page-header__subtitle">
            Update technician contact, address and emergency
            contact information.
          </p>
        </div>

        <div className="page-header__actions">
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => navigate("/admin/technicians")}
          >
            <ArrowLeft size={16} />
            Back to Technicians
          </button>

          <button
            type="submit"
            form="edit-technician-form"
            className="btn btn--success"
            disabled={loading || saving || !technician}
          >
            {saving ? (
              <LoaderCircle
                size={16}
                className="edit-loading-icon"
              />
            ) : (
              <Save size={16} />
            )}

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      {requestError && (
        <div className="edit-message edit-message--error">
          <AlertCircle size={17} />
          {requestError}
        </div>
      )}

      {success && (
        <div className="edit-message edit-message--success">
          <CheckCircle size={17} />
          {success}
        </div>
      )}

      {loading ? (
        <div className="edit-loading">
          <LoaderCircle
            size={22}
            className="edit-loading-icon"
          />
          Loading technician information...
        </div>
      ) : technician ? (
        <form
          id="edit-technician-form"
          className="form-grid"
          onSubmit={handleSubmit}
        >
          <div
            className="form-main"
            style={{ gridColumn: "1 / -1" }}
          >
            <section className="form-card">
              <SectionHeading icon={User}>
                Personal Information
              </SectionHeading>

              <div className="field-grid field-grid--2">
                <div className="form-field">
                  <FieldLabel required>Date of Birth</FieldLabel>

                  <IconInput
                    icon={Calendar}
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={updateField("dateOfBirth")}
                  />

                  {errors.dateOfBirth && (
                    <span className="field-error">
                      {errors.dateOfBirth}
                    </span>
                  )}
                </div>

                <div className="form-field form-field--last">
                  <FieldLabel required>Gender</FieldLabel>

                  <div className="input-shell">
                    <Users
                      size={16}
                      className="input-shell__icon"
                    />

                    <select
                      className="input-shell__field input-shell__field--select"
                      name="gender"
                      value={form.gender}
                      onChange={updateField("gender")}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {errors.gender && (
                    <span className="field-error">
                      {errors.gender}
                    </span>
                  )}
                </div>
              </div>
            </section>

            <section className="form-card">
              <SectionHeading icon={Phone}>
                Contact Information
              </SectionHeading>

              <div className="field-grid field-grid--2">
                <div className="form-field">
                  <FieldLabel required>Phone Number</FieldLabel>

                  <IconInput
                    icon={Phone}
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={updateField("phone")}
                    maxLength={10}
                  />

                  {errors.phone && (
                    <span className="field-error">
                      {errors.phone}
                    </span>
                  )}
                </div>

                <div className="form-field form-field--last">
                  <FieldLabel required>Email Address</FieldLabel>

                  <IconInput
                    icon={Mail}
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={updateField("email")}
                  />

                  {errors.email && (
                    <span className="field-error">
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>
            </section>

            <section className="form-card">
              <SectionHeading icon={MapPin}>
                Address Information
              </SectionHeading>

              <div className="form-field">
                <FieldLabel required>Street Address</FieldLabel>

                <IconInput
                  icon={Home}
                  type="text"
                  name="streetAddress"
                  placeholder="Enter street address"
                  value={form.streetAddress}
                  onChange={updateField("streetAddress")}
                />

                {errors.streetAddress && (
                  <span className="field-error">
                    {errors.streetAddress}
                  </span>
                )}
              </div>

              <div className="field-grid field-grid--3">
                <div className="form-field">
                  <FieldLabel required>City</FieldLabel>

                  <IconInput
                    icon={Building}
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={form.city}
                    onChange={updateField("city")}
                  />

                  {errors.city && (
                    <span className="field-error">
                      {errors.city}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <FieldLabel required>State</FieldLabel>

                  <IconInput
                    icon={MapPin}
                    type="text"
                    name="state"
                    placeholder="Enter state"
                    value={form.state}
                    onChange={updateField("state")}
                  />

                  {errors.state && (
                    <span className="field-error">
                      {errors.state}
                    </span>
                  )}
                </div>

                <div className="form-field form-field--last">
                  <FieldLabel required>
                    ZIP / Postal Code
                  </FieldLabel>

                  <IconInput
                    icon={Hash}
                    type="text"
                    name="zip"
                    placeholder="Enter ZIP code"
                    value={form.zip}
                    onChange={updateField("zip")}
                    maxLength={6}
                  />

                  {errors.zip && (
                    <span className="field-error">
                      {errors.zip}
                    </span>
                  )}
                </div>
              </div>
            </section>

            <section className="form-card">
              <SectionHeading icon={Phone}>
                Emergency Contact
              </SectionHeading>

              <div className="field-grid field-grid--3">
                <div className="form-field">
                  <FieldLabel required>Contact Name</FieldLabel>

                  <IconInput
                    icon={User}
                    type="text"
                    name="emergencyName"
                    placeholder="Enter contact name"
                    value={form.emergencyName}
                    onChange={updateField("emergencyName")}
                  />

                  {errors.emergencyName && (
                    <span className="field-error">
                      {errors.emergencyName}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <FieldLabel required>Phone Number</FieldLabel>

                  <IconInput
                    icon={Phone}
                    type="tel"
                    name="emergencyPhone"
                    placeholder="Enter emergency phone number"
                    value={form.emergencyPhone}
                    onChange={updateField("emergencyPhone")}
                    maxLength={10}
                  />

                  {errors.emergencyPhone && (
                    <span className="field-error">
                      {errors.emergencyPhone}
                    </span>
                  )}
                </div>

                <div className="form-field form-field--last">
                  <FieldLabel required>Relationship</FieldLabel>

                  <IconInput
                    icon={Users}
                    type="text"
                    name="emergencyRelationship"
                    placeholder="Example: Brother"
                    value={form.emergencyRelationship}
                    onChange={updateField("emergencyRelationship")}
                  />

                  {errors.emergencyRelationship && (
                    <span className="field-error">
                      {errors.emergencyRelationship}
                    </span>
                  )}
                </div>
              </div>
            </section>
          </div>

          <div
            className="form-footer"
            style={{ gridColumn: "1 / -1" }}
          >
            <button
              type="button"
              className="btn btn--outline"
              onClick={goToProfile}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn--success"
              disabled={saving}
            >
              {saving ? (
                <LoaderCircle
                  size={16}
                  className="edit-loading-icon"
                />
              ) : (
                <Save size={16} />
              )}

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
};

export default EditTechnicianProfile;