import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  User,
  MessageSquare,
  Pencil,
  ArrowLeft,
  ExternalLink,
  FileImage,
  Download,
  UploadCloud,
  Check,
  History,
  Clock,
  X,
  AlertCircle,
} from "lucide-react";

import api from "../../api/axios";
import "./AdminComplaintView.css";

const STATUS_OPTIONS = [
  "In Progress",
  "Resolved",
  "Closed",
  "Rejected",
];

const MAX_NOTE = 500;

const normalizeComplaint = (data = {}) => {
  const customerObject =
    data.customer &&
    typeof data.customer === "object"
      ? data.customer
      : {};

  const bookingObject =
    data.booking &&
    typeof data.booking === "object"
      ? data.booking
      : {};

  const customerName =
    data.customerName ||
    data.fullName ||
    data.name ||
    customerObject.fullName ||
    customerObject.name ||
    [
      customerObject.firstName,
      customerObject.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    (typeof data.customer === "string"
      ? data.customer
      : "");

  const customerEmail =
    data.customerEmail ||
    data.email ||
    customerObject.email ||
    "";

  const customerPhone =
    data.customerPhone ||
    data.phone ||
    data.phoneNumber ||
    customerObject.phone ||
    customerObject.phoneNumber ||
    "";

  const bookingId =
    data.bookingId ||
    data.bookingReference ||
    data.bookingNumber ||
    bookingObject.bookingId ||
    bookingObject.bookingNumber ||
    (typeof data.booking === "string"
      ? data.booking
      : "");

  const serviceObject =
    bookingObject.service &&
    typeof bookingObject.service ===
      "object"
      ? bookingObject.service
      : {};

  return {
    ...data,

    id:
      data.id ||
      data.complaintNumber ||
      data.complaintId ||
      "",

    customerName,
    customerEmail,
    customerPhone,
    bookingId,

    serviceName:
      data.serviceName ||
      serviceObject.serviceName ||
      serviceObject.name ||
      bookingObject.serviceName ||
      "",

    serviceDate:
      data.serviceDate ||
      data.preferredDate ||
      bookingObject.serviceDate ||
      bookingObject.preferredDate ||
      "",

    serviceAddress:
      data.serviceAddress ||
      data.address ||
      bookingObject.serviceAddress ||
      bookingObject.address ||
      "",

    createdAt:
      data.createdAt ||
      data.submittedOn ||
      data.submittedAt ||
      data.dateSubmitted ||
      null,

    updatedAt:
      data.updatedAt ||
      data.lastUpdated ||
      data.updatedOn ||
      null,
  };
};

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatFileSize = (size) => {
  const bytes = Number(size);

  if (
    !bytes ||
    Number.isNaN(bytes)
  ) {
    return "Unknown size";
  }

  if (bytes < 1024) {
    return `${bytes} bytes`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    1024 /
    1024
  ).toFixed(2)} MB`;
};

function StatusBadge({ status }) {
  const toneMap = {
    Pending: "av-badge--warning",
    "In Progress":
      "av-badge--warning",
    Resolved:
      "av-badge--success",
    Closed: "av-badge--danger",
    Rejected:
      "av-badge--danger",
  };

  return (
    <span
      className={`av-badge ${
        toneMap[status] ||
        "av-badge--neutral"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

export default function AdminComplaintView({
  backPath = "/admin/complaints",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const complaintId =
    params.complaintId ||
    params.id ||
    location.state?.complaint?.id;

  const [complaint, setComplaint] =
    useState(null);

  const [status, setStatus] =
    useState("In Progress");

  const [note, setNote] =
    useState("");

  const [attachment, setAttachment] =
    useState(null);

  const [errors, setErrors] =
    useState({});

  const [saving, setSaving] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [pageError, setPageError] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const fileInputRef = useRef(null);

  const loadComplaint = async () => {
    if (!complaintId) {
      setPageError(
        "Complaint ID is missing."
      );

      setLoading(false);
      return;
    }

    setLoading(true);
    setPageError("");

    try {
      const response = await api.get(
        `/admin/complaints/${complaintId}`
      );

      const complaintData =
        normalizeComplaint(
          response.data
        );

      setComplaint(complaintData);

      setStatus(
        complaintData.status ===
          "Pending"
          ? "In Progress"
          : complaintData.status ||
              "In Progress"
      );
    } catch (error) {
      console.error(
        "Load complaint error:",
        error?.response?.data || error
      );

      setPageError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Unable to load complaint details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaint();
  }, [complaintId]);

  const handleNoteChange = (
    event
  ) => {
    setNote(
      event.target.value.slice(
        0,
        MAX_NOTE
      )
    );

    if (errors.note) {
      setErrors((current) => ({
        ...current,
        note: "",
      }));
    }
  };

  const handleFile = (file) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    const maxBytes =
      5 * 1024 * 1024;

    if (
      !allowedTypes.includes(file.type)
    ) {
      setErrors((current) => ({
        ...current,
        file:
          "Only PDF, JPG and PNG files are allowed.",
      }));

      return;
    }

    if (file.size > maxBytes) {
      setErrors((current) => ({
        ...current,
        file:
          "File must be under 5 MB.",
      }));

      return;
    }

    setErrors((current) => ({
      ...current,
      file: "",
    }));

    setAttachment(file);
  };

  const validate = () => {
    const nextErrors = {};

    if (!status) {
      nextErrors.status =
        "Please select a status.";
    }

    if (!note.trim()) {
      nextErrors.note =
        "Please add a response or note.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length ===
      0
    );
  };

  const handleCancel = () => {
    setStatus(
      complaint?.status === "Pending"
        ? "In Progress"
        : complaint?.status ||
            "In Progress"
    );

    setNote("");
    setAttachment(null);
    setErrors({});
    setPageError("");
    setSuccessMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdate = async (
    event
  ) => {
    event.preventDefault();

    if (
      !validate() ||
      !complaintId
    ) {
      return;
    }

    const formData = new FormData();

    formData.append(
      "status",
      status
    );

    formData.append(
      "response",
      note.trim()
    );

    if (attachment) {
      formData.append(
        "attachment",
        attachment
      );
    }

    setSaving(true);
    setPageError("");
    setSuccessMessage("");

    try {
      const response = await api.patch(
        `/admin/complaints/${complaintId}`,
        formData
      );

      const updatedComplaint =
        normalizeComplaint(
          response.data
        );

      setComplaint(
        updatedComplaint
      );

      setStatus(
        updatedComplaint.status ||
          status
      );

      setNote("");
      setAttachment(null);

      setSuccessMessage(
        "Complaint updated successfully."
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(
        "Update complaint error:",
        error?.response?.data || error
      );

      setPageError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Unable to update complaint."
      );
    } finally {
      setSaving(false);
    }
  };

  const downloadAttachment = async (
    file
  ) => {
    if (!file?.downloadUrl) {
      return;
    }

    try {
      const apiPath =
        file.downloadUrl.startsWith(
          "/api"
        )
          ? file.downloadUrl.replace(
              "/api",
              ""
            )
          : file.downloadUrl;

      const response = await api.get(
        apiPath,
        {
          responseType: "blob",
        }
      );

      const url =
        URL.createObjectURL(
          response.data
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        file.name ||
        "complaint-attachment";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Download attachment error:",
        error?.response?.data || error
      );

      setPageError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Unable to download attachment."
      );
    }
  };

  if (loading) {
    return (
      <div className="av-page">
        Loading complaint details...
      </div>
    );
  }

  if (
    pageError &&
    !complaint
  ) {
    return (
      <div className="av-page">
        <div className="av-error-text">
          <AlertCircle size={17} />
          {pageError}
        </div>

        <button
          className="av-btn av-btn--outline"
          onClick={() =>
            navigate(backPath)
          }
        >
          <ArrowLeft size={15} />
          Back to Complaints
        </button>
      </div>
    );
  }

  const history =
    Array.isArray(
      complaint?.history
    )
      ? complaint.history
      : [];

  return (
    <div className="av-page">
      <div className="av-breadcrumb">
        <span
          onClick={() =>
            navigate(
              "/admin/dashboard"
            )
          }
        >
          Dashboard
        </span>

        <span className="av-breadcrumb__sep">
          &gt;
        </span>

        <span
          onClick={() =>
            navigate(backPath)
          }
        >
          Complaints
        </span>

        <span className="av-breadcrumb__sep">
          &gt;
        </span>

        <span className="av-breadcrumb__current">
          Complaint Details
        </span>
      </div>

      <div className="av-header">
        <div className="av-header__titlegroup">
          <h1 className="av-title">
            Complaint Details -{" "}
            {complaint.id}

            <StatusBadge
              status={
                complaint.status
              }
            />
          </h1>

          <p className="av-subtitle">
            View and manage complaint
            information and response
          </p>
        </div>

        <button
          className="av-btn av-btn--outline"
          onClick={() =>
            navigate(backPath)
          }
        >
          <ArrowLeft size={15} />
          Back to Complaints
        </button>
      </div>

      {successMessage && (
        <div className="av-timeline__note av-timeline__note--success">
          {successMessage}
        </div>
      )}

      {pageError && (
        <div className="av-error-text">
          <AlertCircle size={16} />
          {pageError}
        </div>
      )}

      <div className="av-columns">
        <section className="av-card">
          <div className="av-card__header">
            <span className="av-icon-badge">
              <User size={18} />
            </span>

            <h3>
              Customer &amp; Booking
              Information
            </h3>
          </div>

          <div className="av-detail">
            <label>
              Customer Name
            </label>

            <p>
              {complaint.customerName ||
                "—"}
            </p>
          </div>

          <div className="av-detail">
            <label>Email</label>

            <p>
              {complaint.customerEmail ||
                "—"}
            </p>
          </div>

          <div className="av-detail">
            <label>Phone</label>

            <p>
              {complaint.customerPhone ||
                "—"}
            </p>
          </div>

          <div className="av-divider" />

          <div className="av-detail">
            <label>Booking ID</label>

            <p
              className={
                complaint.bookingId
                  ? "av-detail__link"
                  : ""
              }
              onClick={() => {
                if (
                  complaint.bookingId
                ) {
                  navigate(
                    `/admin/bookings/${complaint.bookingId}`
                  );
                }
              }}
            >
              {complaint.bookingId ||
                "Not linked"}

              {complaint.bookingId && (
                <ExternalLink
                  size={13}
                />
              )}
            </p>
          </div>

          <div className="av-detail">
            <label>
              Service Name
            </label>

            <p>
              {complaint.serviceName ||
                "—"}
            </p>
          </div>

          <div className="av-detail">
            <label>
              Service Date
            </label>

            <p>
              {complaint.serviceDate ||
                "—"}
            </p>
          </div>

          <div className="av-detail">
            <label>
              Service Address
            </label>

            <p>
              {complaint.serviceAddress ||
                "—"}
            </p>
          </div>
        </section>

        <section className="av-card">
          <div className="av-card__header">
            <span className="av-icon-badge">
              <MessageSquare
                size={18}
              />
            </span>

            <h3>
              Complaint Information
            </h3>
          </div>

          <div className="av-detail">
            <label>Subject</label>

            <p>
              {complaint.subject ||
                "—"}
            </p>
          </div>

          <div className="av-detail">
            <label>Category</label>

            <p>
              <span className="av-tag">
                {complaint.category ||
                  "—"}
              </span>
            </p>
          </div>

          <div className="av-detail">
            <label>
              Submitted On
            </label>

            <p>
              {formatDateTime(
                complaint.createdAt
              )}
            </p>
          </div>

          <div className="av-detail">
            <label>
              Description
            </label>

            <p className="av-description">
              {complaint.description ||
                "—"}
            </p>
          </div>

          {complaint.attachment && (
            <div className="av-detail">
              <label>
                Attachment
              </label>

              <div className="av-attachment">
                <span className="av-attachment__icon">
                  <FileImage
                    size={18}
                  />
                </span>

                <div className="av-attachment__info">
                  <p>
                    {
                      complaint
                        .attachment
                        .name
                    }
                  </p>

                  <span>
                    {complaint
                      .attachment
                      .type ||
                      "File"}{" "}
                    &bull;{" "}
                    {formatFileSize(
                      complaint
                        .attachment
                        .size
                    )}
                  </span>
                </div>

                <button
                  type="button"
                  className="av-icon-btn"
                  aria-label="Download attachment"
                  onClick={() =>
                    downloadAttachment(
                      complaint.attachment
                    )
                  }
                >
                  <Download
                    size={15}
                  />
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="av-card">
          <div className="av-card__header">
            <span className="av-icon-badge">
              <Pencil size={18} />
            </span>

            <h3>
              Update Status &amp;
              Response
            </h3>
          </div>

          <form
            onSubmit={handleUpdate}
            noValidate
          >
            <div className="av-field">
              <label>
                Status{" "}
                <span className="av-required">
                  *
                </span>
              </label>

              <div
                className={`av-select ${
                  errors.status
                    ? "av-select--error"
                    : ""
                }`}
              >
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value
                    )
                  }
                >
                  {STATUS_OPTIONS.map(
                    (option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    )
                  )}
                </select>
              </div>

              {errors.status && (
                <span className="av-error-text">
                  {errors.status}
                </span>
              )}
            </div>

            <div className="av-field">
              <label>
                Response / Note{" "}
                <span className="av-required">
                  *
                </span>
              </label>

              <div
                className={`av-input av-input--textarea ${
                  errors.note
                    ? "av-input--error"
                    : ""
                }`}
              >
                <textarea
                  rows={4}
                  maxLength={
                    MAX_NOTE
                  }
                  placeholder="Add a response or note for this complaint..."
                  value={note}
                  onChange={
                    handleNoteChange
                  }
                />

                <span className="av-char-count">
                  {note.length}/
                  {MAX_NOTE}
                </span>
              </div>

              {errors.note && (
                <span className="av-error-text">
                  {errors.note}
                </span>
              )}
            </div>

            <div className="av-field">
              <label>
                Attachment{" "}
                <span className="av-optional">
                  (Optional)
                </span>
              </label>

              <div
                className="av-dropzone"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  hidden
                  onChange={(event) =>
                    handleFile(
                      event.target
                        .files?.[0]
                    )
                  }
                />

                {attachment ? (
                  <div className="av-dropzone__file">
                    <FileImage
                      size={16}
                    />

                    <span>
                      {attachment.name}
                    </span>

                    <button
                      type="button"
                      className="av-dropzone__remove"
                      onClick={(
                        event
                      ) => {
                        event.stopPropagation();

                        setAttachment(
                          null
                        );

                        if (
                          fileInputRef.current
                        ) {
                          fileInputRef.current.value =
                            "";
                        }
                      }}
                      aria-label="Remove attachment"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <>
                    <UploadCloud
                      size={18}
                      className="av-dropzone__icon"
                    />

                    <div>
                      <p className="av-dropzone__text">
                        Click to upload
                        file
                      </p>

                      <p className="av-dropzone__hint">
                        PDF, JPG or PNG
                        up to 5 MB
                      </p>
                    </div>
                  </>
                )}
              </div>

              {errors.file && (
                <span className="av-error-text">
                  {errors.file}
                </span>
              )}
            </div>

            <div className="av-form__actions">
              <button
                type="button"
                className="av-btn av-btn--outline"
                onClick={
                  handleCancel
                }
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="av-btn av-btn--primary"
                disabled={saving}
              >
                <Check size={15} />

                {saving
                  ? "Updating..."
                  : "Update Complaint"}
              </button>
            </div>
          </form>
        </section>
      </div>

      <section className="av-card av-history-card">
        <div className="av-card__header">
          <span className="av-icon-badge">
            <History size={18} />
          </span>

          <h3>
            Complaint History
          </h3>
        </div>

        <ul className="av-timeline">
          {history.length === 0 ? (
            <li className="av-timeline__item">
              No complaint history found.
            </li>
          ) : (
            history.map(
              (item, index) => (
                <li
                  className="av-timeline__item"
                  key={
                    item.id ||
                    `${item.status}-${index}`
                  }
                >
                  <div className="av-timeline__marker-col">
                    <span className="av-timeline__marker av-timeline__marker--info">
                      {index === 0 ? (
                        <Clock
                          size={15}
                        />
                      ) : (
                        <MessageSquare
                          size={15}
                        />
                      )}
                    </span>

                    {index <
                      history.length -
                        1 && (
                      <span className="av-timeline__line" />
                    )}
                  </div>

                  <div className="av-timeline__body">
                    <p className="av-timeline__title">
                      {item.status}
                    </p>

                    <p className="av-timeline__timestamp">
                      {formatDateTime(
                        item.createdAt
                      )}
                    </p>

                    <div className="av-timeline__note av-timeline__note--info">
                      {item.note}

                      <span className="av-timeline__by">
                        By{" "}
                        {item.updatedBy ||
                          "System"}
                      </span>
                    </div>
                  </div>
                </li>
              )
            )
          )}
        </ul>
      </section>
    </div>
  );
}