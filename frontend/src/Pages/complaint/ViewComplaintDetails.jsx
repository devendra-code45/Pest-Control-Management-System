import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ChevronRight,
  MessageSquare,
  ArrowLeft,
  Printer,
  Copy,
  Check,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Info,
  FileText,
  Camera,
  History,
  CheckCircle,
  Download,
  AlertCircle,
} from "lucide-react";

import api from "../../api/axios";
import "./ViewComplaintDetails.css";

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

  const serviceObject =
    bookingObject.service &&
      typeof bookingObject.service === "object"
      ? bookingObject.service
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
      bookingObject.serviceName ||
      serviceObject.serviceName ||
      serviceObject.name ||
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
  if (!value) {
    return "—";
  }

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

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const InfoRow = ({ label, value }) => (
  <div className="vcd-info-row">
    <span className="vcd-info-label">
      {label}
    </span>

    <span className="vcd-info-colon">
      :
    </span>

    <span className="vcd-info-value">
      {value || "—"}
    </span>
  </div>
);

export default function ViewComplaintDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const complaintId =
    params.complaintId ||
    params.id ||
    location.state?.complaintId ||
    location.state?.complaint?.id;

  const [complaint, setComplaint] =
    useState(null);

  const [copied, setCopied] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [pageError, setPageError] =
    useState("");

  useEffect(() => {
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
          `/customer/complaints/${complaintId}`
        );

        const complaintData =
          normalizeComplaint(
            response.data
          );

        setComplaint(complaintData);
      } catch (error) {
        console.error(
          "Load complaint details error:",
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

    loadComplaint();
  }, [complaintId]);

  const handleCopy = async () => {
    if (!complaint?.id) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        complaint.id
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  };

  const downloadAttachment = async (
    attachment
  ) => {
    if (!attachment?.downloadUrl) {
      return;
    }

    setPageError("");

    try {
      const apiPath =
        attachment.downloadUrl.startsWith(
          "/api"
        )
          ? attachment.downloadUrl.replace(
            "/api",
            ""
          )
          : attachment.downloadUrl;

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
        attachment.name ||
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
      <div className="vcd-page">
        Loading complaint details...
      </div>
    );
  }

  if (pageError && !complaint) {
    return (
      <div className="vcd-page">
        <div className="vcd-notes-text">
          <AlertCircle size={18} />
          {pageError}
        </div>

        <button
          type="button"
          className="vcd-btn vcd-btn-outline"
          onClick={() =>
            navigate(
              "/customer/complaints"
            )
          }
        >
          <ArrowLeft size={16} />
          Back to My Complaints
        </button>
      </div>
    );
  }

  const timeline =
    Array.isArray(
      complaint?.history
    )
      ? complaint.history
      : [];

  return (
    <div className="vcd-page">
      <nav
        className="vcd-breadcrumb"
        aria-label="Breadcrumb"
      >
        <span
          className="vcd-breadcrumb-link"
          onClick={() =>
            navigate(
              "/customer/dashboard"
            )
          }
        >
          Dashboard
        </span>

        <ChevronRight
          size={14}
          className="vcd-breadcrumb-sep"
        />

        <span
          className="vcd-breadcrumb-link"
          onClick={() =>
            navigate(
              "/customer/complaints"
            )
          }
        >
          Complaints
        </span>

        <ChevronRight
          size={14}
          className="vcd-breadcrumb-sep"
        />

        <span className="vcd-breadcrumb-current">
          Complaint Details
        </span>
      </nav>

      <header className="vcd-header">
        <div className="vcd-header-left">
          <span className="vcd-header-icon">
            <MessageSquare
              size={26}
              strokeWidth={2}
            />
          </span>

          <div>
            <h1 className="vcd-title">
              Complaint Details
            </h1>

            <p className="vcd-subtitle">
              View complete details and
              status of your complaint.
            </p>
          </div>
        </div>

        <div className="vcd-header-actions">
          <button
            type="button"
            className="vcd-btn vcd-btn-outline"
            onClick={() =>
              navigate(
                "/customer/complaints"
              )
            }
          >
            <ArrowLeft
              size={16}
              strokeWidth={2}
            />

            Back to My Complaints
          </button>
        </div>
      </header>

      {pageError && (
        <div
          className="vcd-notes-text"
          role="alert"
        >
          <AlertCircle size={16} />
          {pageError}
        </div>
      )}

      <section className="vcd-summary-card">
        <div className="vcd-summary-field">
          <span className="vcd-summary-label">
            Complaint ID
          </span>

          <span className="vcd-summary-id-row">
            <span className="vcd-summary-id">
              {complaint.id}
            </span>

            <button
              type="button"
              className="vcd-copy-btn"
              onClick={handleCopy}
              aria-label="Copy complaint ID"
            >
              {copied ? (
                <Check
                  size={14}
                  strokeWidth={2.5}
                />
              ) : (
                <Copy
                  size={14}
                  strokeWidth={2}
                />
              )}
            </button>
          </span>
        </div>

        <div className="vcd-summary-field">
          <span className="vcd-summary-label">
            Booking ID
          </span>

          <span className="vcd-summary-value">
            {complaint.bookingId ||
              "Not linked"}
          </span>
        </div>

        <div className="vcd-summary-field">
          <span className="vcd-summary-label">
            Status
          </span>

          <span className="vcd-badge vcd-badge-warning">
            {complaint.status ||
              "Pending"}
          </span>
        </div>

        <div className="vcd-summary-field">
          <span className="vcd-summary-label">
            Category
          </span>

          <span className="vcd-summary-value">
            {complaint.category ||
              "—"}
          </span>
        </div>

        <div className="vcd-summary-field">
          <span className="vcd-summary-label">
            Date Submitted
          </span>

          <span className="vcd-summary-value vcd-summary-with-icon">
            <Calendar
              size={14}
              strokeWidth={2}
            />

            {formatDateTime(
              complaint.createdAt
            )}
          </span>
        </div>

        <div className="vcd-summary-field">
          <span className="vcd-summary-label">
            Last Updated
          </span>

          <span className="vcd-summary-value vcd-summary-with-icon">
            <Calendar
              size={14}
              strokeWidth={2}
            />

            {formatDateTime(
              complaint.updatedAt
            )}
          </span>
        </div>
      </section>

      <section className="vcd-grid">
        <div className="vcd-card">
          <div className="vcd-card-header">
            <span className="vcd-card-header-icon">
              <User
                size={18}
                strokeWidth={2}
              />
            </span>

            <h2 className="vcd-card-title">
              Customer Information
            </h2>
          </div>

          <div className="vcd-info-list">
            <InfoRow
              label="Customer Name"
              value={
                complaint.customerName ||
                "—"
              }
            />

            <InfoRow
              label="Phone Number"
              value={
                <span className="vcd-value-with-icon">
                  {complaint.customerPhone ||
                    "—"}

                  <Phone
                    size={13}
                    strokeWidth={2}
                  />
                </span>
              }
            />

            <InfoRow
              label="Email Address"
              value={
                <span className="vcd-value-with-icon">
                  <span className="vcd-email-text">
                    {complaint.customerEmail || "—"}
                  </span>

                  <Mail size={13} strokeWidth={2} />
                </span>
              }
            />

            <InfoRow
              label="Service Address"
              value={
                <span className="vcd-value-with-icon">
                  {complaint.serviceAddress ||
                    "—"}

                  <MapPin
                    size={13}
                    strokeWidth={2}
                  />
                </span>
              }
            />
          </div>
        </div>

        <div className="vcd-card">
          <div className="vcd-card-header">
            <span className="vcd-card-header-icon">
              <Info
                size={18}
                strokeWidth={2}
              />
            </span>

            <h2 className="vcd-card-title">
              Complaint Information
            </h2>
          </div>

          <div className="vcd-info-list">
            <InfoRow
              label="Subject"
              value={complaint.subject}
            />

            <InfoRow
              label="Complaint Category"
              value={
                complaint.category
              }
            />

            <InfoRow
              label="Service Related To"
              value={
                complaint.serviceName ||
                "Not linked"
              }
            />

            <InfoRow
              label="Service Date"
              value={
                complaint.serviceDate
                  ? formatDate(
                    complaint.serviceDate
                  )
                  : "—"
              }
            />

            <InfoRow
              label="Current Status"
              value={complaint.status}
            />
          </div>
        </div>

        <div className="vcd-card">
          <div className="vcd-card-header">
            <span className="vcd-card-header-icon">
              <FileText
                size={18}
                strokeWidth={2}
              />
            </span>

            <h2 className="vcd-card-title">
              Description
            </h2>
          </div>

          <p className="vcd-description-text">
            {complaint.description ||
              "—"}
          </p>

          {complaint.attachment && (
            <div className="vcd-images-block">
              <span className="vcd-images-label">
                <Camera
                  size={14}
                  strokeWidth={2}
                />

                Uploaded Attachment
              </span>

              <button
                type="button"
                className="vcd-btn vcd-btn-outline"
                onClick={() =>
                  downloadAttachment(
                    complaint.attachment
                  )
                }
              >
                <Download size={15} />

                {complaint.attachment
                  .name ||
                  "Download attachment"}
              </button>
            </div>
          )}
        </div>

        <div className="vcd-card">
          <div className="vcd-card-header">
            <span className="vcd-card-header-icon">
              <History
                size={18}
                strokeWidth={2}
              />
            </span>

            <h2 className="vcd-card-title">
              Complaint Timeline
            </h2>
          </div>

          <div className="vcd-timeline">
            {timeline.length === 0 ? (
              <p className="vcd-notes-text">
                No history available.
              </p>
            ) : (
              timeline.map(
                (step, index) => (
                  <div
                    className="vcd-timeline-step"
                    key={
                      step.id ||
                      `${step.status}-${index}`
                    }
                  >
                    <div className="vcd-timeline-marker">
                      <span className="vcd-timeline-dot vcd-timeline-dot-done">
                        <CheckCircle
                          size={13}
                          strokeWidth={2.5}
                        />
                      </span>

                      {index <
                        timeline.length -
                        1 && (
                          <span className="vcd-timeline-line vcd-timeline-line-done" />
                        )}
                    </div>

                    <div className="vcd-timeline-text">
                      <span className="vcd-timeline-title vcd-timeline-title-done">
                        {step.status ||
                          "Updated"}
                      </span>

                      <span className="vcd-timeline-date">
                        {formatDateTime(
                          step.createdAt
                        )}
                      </span>

                      <span className="vcd-timeline-by">
                        By{" "}
                        {step.updatedBy ||
                          "System"}
                      </span>

                      <span className="vcd-timeline-date">
                        {step.note}
                      </span>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </section>

      <section className="vcd-card vcd-notes-card">
        <div className="vcd-card-header">
          <span className="vcd-card-header-icon">
            <FileText
              size={18}
              strokeWidth={2}
            />
          </span>

          <h2 className="vcd-card-title">
            Admin Response
          </h2>
        </div>

        <p className="vcd-notes-text">
          {complaint.adminResponse ||
            complaint.response ||
            "Your complaint is awaiting an admin response."}
        </p>

        {complaint.responseAttachment && (
          <button
            type="button"
            className="vcd-btn vcd-btn-outline"
            onClick={() =>
              downloadAttachment(
                complaint.responseAttachment
              )
            }
          >
            <Download size={15} />
            Download admin attachment
          </button>
        )}
      </section>
    </div>
  );
}