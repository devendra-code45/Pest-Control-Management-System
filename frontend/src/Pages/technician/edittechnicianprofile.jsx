import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

import "./edittechnicianprofile.css";

/* Initial values can later come from your Spring Boot API */
const initialForm = {
  phone: "9876543210",
  email: "rahul.sharma@example.com",

  streetAddress: "123, Green Park",
  city: "Pune",
  state: "Maharashtra",
  zip: "411038",

  emergencyName: "Ramesh Sharma",
  emergencyPhone: "9876543200",
};

/* Reusable field label */
const FieldLabel = ({ children, required }) => {
  return (
    <label className="field-label">
      {children}

      {required && (
        <span className="field-label__required">
          *
        </span>
      )}
    </label>
  );
};

/* Reusable input with icon */
const IconInput = ({ icon: Icon, ...props }) => {
  return (
    <div className="input-shell">
      <Icon
        size={16}
        className="input-shell__icon"
      />

      <input
        className="input-shell__field"
        {...props}
      />
    </div>
  );
};

/* Reusable section heading */
const SectionHeading = ({ icon: Icon, children }) => {
  return (
    <div className="section-heading">
      <span className="section-heading__icon">
        <Icon size={15} />
      </span>

      <h2>{children}</h2>
    </div>
  );
};

const EditTechnicianProfile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const updateField = (field) => {
    return (event) => {
      const { value } = event.target;

      setForm((previousForm) => ({
        ...previousForm,
        [field]: value,
      }));

      setErrors((previousErrors) => ({
        ...previousErrors,
        [field]: "",
      }));
    };
  };

  const validateForm = () => {
    const newErrors = {};

    const phonePattern = /^[6-9]\d{9}$/;
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const zipPattern = /^\d{6}$/;

    if (!form.phone.trim()) {
      newErrors.phone =
        "Phone number is required.";
    } else if (!phonePattern.test(form.phone)) {
      newErrors.phone =
        "Enter a valid 10-digit phone number.";
    }

    if (!form.email.trim()) {
      newErrors.email =
        "Email address is required.";
    } else if (!emailPattern.test(form.email)) {
      newErrors.email =
        "Enter a valid email address.";
    }

    if (!form.streetAddress.trim()) {
      newErrors.streetAddress =
        "Address is required.";
    }

    if (!form.city.trim()) {
      newErrors.city =
        "City is required.";
    }

    if (!form.state.trim()) {
      newErrors.state =
        "State is required.";
    }

    if (!form.zip.trim()) {
      newErrors.zip =
        "ZIP code is required.";
    } else if (!zipPattern.test(form.zip)) {
      newErrors.zip =
        "Enter a valid 6-digit ZIP code.";
    }

    if (!form.emergencyName.trim()) {
      newErrors.emergencyName =
        "Emergency contact name is required.";
    }

    if (!form.emergencyPhone.trim()) {
      newErrors.emergencyPhone =
        "Emergency phone number is required.";
    } else if (
      !phonePattern.test(form.emergencyPhone)
    ) {
      newErrors.emergencyPhone =
        "Enter a valid 10-digit phone number.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    console.log(
      "Updated technician information:",
      form
    );

    /*
      Later connect your Spring Boot API here.

      Example:

      axios.put(
        `http://localhost:8080/api/technicians/${technicianId}`,
        form
      );
    */

    alert(
      "Technician information updated successfully."
    );

    navigate("/admin/technicians/profile");
  };

  const handleCancel = () => {
    navigate("/admin/technicians/profile");
  };

  return (
    <div className="edit-technician-page">
      {/* Breadcrumb */}
      <nav
        className="breadcrumb"
        aria-label="Breadcrumb"
      >
        <button
          type="button"
          className="breadcrumb__link"
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          Home
        </button>

        <span className="breadcrumb__separator">
          /
        </span>

        <button
          type="button"
          className="breadcrumb__link"
          onClick={() =>
            navigate("/admin/technicians")
          }
        >
          Technicians
        </button>

        <span className="breadcrumb__separator">
          /
        </span>

        <span className="breadcrumb__current">
          Edit Technician Profile
        </span>
      </nav>

      {/* Page header */}
      <header className="page-header">
        <div>
          <h1 className="page-header__title">
            Edit Technician Profile
          </h1>

          <p className="page-header__subtitle">
            Update technician contact, address and
            emergency contact information.
          </p>
        </div>

        <div className="page-header__actions">
          <button
            type="button"
            className="btn btn--outline"
            onClick={handleCancel}
          >
            <ArrowLeft size={16} />
            Back to Profile
          </button>

          <button
            type="submit"
            form="edit-technician-form"
            className="btn btn--success"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </header>

      <form
        id="edit-technician-form"
        className="form-grid"
        onSubmit={handleSubmit}
      >
        <div
          className="form-main"
          style={{ gridColumn: "1 / -1" }}
        >
          {/* Contact Information */}
          <section className="form-card">
            <SectionHeading icon={Phone}>
              Contact Information
            </SectionHeading>

            <div className="field-grid field-grid--2">
              <div className="form-field">
                <FieldLabel required>
                  Phone Number
                </FieldLabel>

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
                <FieldLabel required>
                  Email Address
                </FieldLabel>

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

          {/* Address Information */}
          <section className="form-card">
            <SectionHeading icon={MapPin}>
              Address Information
            </SectionHeading>

            <div className="form-field">
              <FieldLabel required>
                Street Address
              </FieldLabel>

              <IconInput
                icon={Home}
                type="text"
                name="streetAddress"
                placeholder="Enter street address"
                value={form.streetAddress}
                onChange={updateField(
                  "streetAddress"
                )}
              />

              {errors.streetAddress && (
                <span className="field-error">
                  {errors.streetAddress}
                </span>
              )}
            </div>

            <div className="field-grid field-grid--3">
              <div className="form-field">
                <FieldLabel required>
                  City
                </FieldLabel>

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
                <FieldLabel required>
                  State
                </FieldLabel>

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

          {/* Emergency Contact */}
          <section className="form-card">
            <SectionHeading icon={Phone}>
              Emergency Contact
            </SectionHeading>

            <div className="field-grid field-grid--2">
              <div className="form-field">
                <FieldLabel required>
                  Contact Name
                </FieldLabel>

                <IconInput
                  icon={User}
                  type="text"
                  name="emergencyName"
                  placeholder="Enter contact name"
                  value={form.emergencyName}
                  onChange={updateField(
                    "emergencyName"
                  )}
                />

                {errors.emergencyName && (
                  <span className="field-error">
                    {errors.emergencyName}
                  </span>
                )}
              </div>

              <div className="form-field form-field--last">
                <FieldLabel required>
                  Phone Number
                </FieldLabel>

                <IconInput
                  icon={Phone}
                  type="tel"
                  name="emergencyPhone"
                  placeholder="Enter emergency phone number"
                  value={form.emergencyPhone}
                  onChange={updateField(
                    "emergencyPhone"
                  )}
                  maxLength={10}
                />

                {errors.emergencyPhone && (
                  <span className="field-error">
                    {errors.emergencyPhone}
                  </span>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Bottom buttons */}
        <div
          className="form-footer"
          style={{ gridColumn: "1 / -1" }}
        >
          <button
            type="button"
            className="btn btn--outline"
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn--success"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTechnicianProfile;