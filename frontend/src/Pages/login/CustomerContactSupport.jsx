import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Headphones,
  Paperclip,
  Phone,
  RotateCcw,
  Send,
  X,
} from "lucide-react";

import "./CustomerContactSupport.css";

const CATEGORY_OPTIONS = [
  "Service Quality",
  "Service Delay",
  "Technician Behaviour",
  "Payment Issue",
  "Reschedule",
  "Pest Problem Not Resolved",
  "Follow Up",
  "Other",
];

const initialForm = {
  subject: "",
  category: "",
  bookingId: "",
  description: "",
};

const initialComplaints = [
  {
    id: "CP-2025-0012",
    subject: "Technician was late",
    category: "Service Delay",
    date: "25 May 2025",
    status: "In Progress",
  },
  {
    id: "CP-2025-0011",
    subject: "Pest problem not resolved",
    category: "Service Quality",
    date: "18 May 2025",
    status: "Resolved",
  },
  {
    id: "CP-2025-0010",
    subject: "Need to reschedule",
    category: "Reschedule",
    date: "10 May 2025",
    status: "Resolved",
  },
  {
    id: "CP-2025-0009",
    subject: "Wrong amount charged",
    category: "Payment Issue",
    date: "02 May 2025",
    status: "Closed",
  },
  {
    id: "CP-2025-0008",
    subject: "Request for follow up",
    category: "Follow Up",
    date: "28 Apr 2025",
    status: "Resolved",
  },
  {
    id: "CP-2025-0007",
    subject: "Technician did not arrive",
    category: "Service Delay",
    date: "22 Apr 2025",
    status: "Open",
  },
  {
    id: "CP-2025-0006",
    subject: "Payment receipt required",
    category: "Payment Issue",
    date: "15 Apr 2025",
    status: "Resolved",
  },
  {
    id: "CP-2025-0005",
    subject: "Cockroach issue remains",
    category: "Pest Problem Not Resolved",
    date: "08 Apr 2025",
    status: "Closed",
  },
];

const statusClassName = (status) =>
  status.toLowerCase().replace(/\s+/g, "-");

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

function StatisticCard({ icon: Icon, label, value, description, tone }) {
  return (
    <article className="contact-support__stat-card">
      <div
        className={`contact-support__stat-icon contact-support__stat-icon--${tone}`}
      >
        <Icon size={26} />
      </div>

      <div>
        <p className="contact-support__stat-label">{label}</p>
        <strong className={`contact-support__stat-value text-${tone}`}>
          {value}
        </strong>
        <p className="contact-support__stat-description">{description}</p>
      </div>
    </article>
  );
}

function ContactSupport() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [complaints, setComplaints] = useState(initialComplaints);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");

  const totals = useMemo(() => {
    const openStatuses = ["Open", "In Progress"];

    return {
      total: complaints.length,
      open: complaints.filter((item) =>
        openStatuses.includes(item.status)
      ).length,
      resolved: complaints.filter(
        (item) => item.status === "Resolved"
      ).length,
      closed: complaints.filter((item) => item.status === "Closed")
        .length,
    };
  }, [complaints]);

  const totalPages = Math.max(
    1,
    Math.ceil(complaints.length / rowsPerPage)
  );

  const visibleComplaints = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return complaints.slice(startIndex, startIndex + rowsPerPage);
  }, [complaints, currentPage, rowsPerPage]);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setSuccessMessage("");
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.subject.trim()) {
      nextErrors.subject = "Subject is required.";
    } else if (form.subject.trim().length < 5) {
      nextErrors.subject = "Subject must contain at least 5 characters.";
    }

    if (!form.category) {
      nextErrors.category = "Please select a complaint category.";
    }

    if (
      form.bookingId.trim() &&
      !/^BK-\d{4}-\d{4}$/i.test(form.bookingId.trim())
    ) {
      nextErrors.bookingId =
        "Use booking ID format BK-2025-0012.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Description is required.";
    } else if (form.description.trim().length < 15) {
      nextErrors.description =
        "Description must contain at least 15 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    const maximumSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        attachment: "Only PDF, JPG and PNG files are allowed.",
      }));
      event.target.value = "";
      return;
    }

    if (file.size > maximumSize) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        attachment: "File size must not exceed 5 MB.",
      }));
      event.target.value = "";
      return;
    }

    setSelectedFile(file);

    setErrors((currentErrors) => ({
      ...currentErrors,
      attachment: "",
    }));
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
    setSelectedFile(null);
    setSuccessMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const complaintNumber = String(complaints.length + 13).padStart(
      4,
      "0"
    );

    const newComplaint = {
      id: `CP-2025-${complaintNumber}`,
      subject: form.subject.trim(),
      category: form.category,
      date: formatDate(new Date()),
      status: "Open",
      bookingId: form.bookingId.trim() || null,
      description: form.description.trim(),
      attachment: selectedFile?.name || null,
    };

    setComplaints((currentComplaints) => [
      newComplaint,
      ...currentComplaints,
    ]);

    setForm(initialForm);
    setSelectedFile(null);
    setErrors({});
    setCurrentPage(1);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setSuccessMessage(
      `Complaint ${newComplaint.id} submitted successfully.`
    );
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const goToPage = (pageNumber) => {
    const safePage = Math.min(Math.max(pageNumber, 1), totalPages);
    setCurrentPage(safePage);
  };

  const handleViewAllComplaints = () => {
    navigate("/customer/complaints");
  };

  return (
    <section className="contact-support">
      <header className="contact-support__header">
        <div>
          <div className="contact-support__title-row">
            <h1>Contact Support</h1>
            <Headphones size={29} />
          </div>

          <p>
            We&apos;re here to help you. Raise a complaint or query and
            our support team will get back to you.
          </p>
        </div>

        <a
          href="tel:18001234567"
          className="contact-support__call-card"
          aria-label="Call customer support"
        >
          <span className="contact-support__call-icon">
            <Phone size={25} />
          </span>

          <span>
            <strong>Need immediate help?</strong>
            <small>Call our support team</small>
            <b>1800-123-4567</b>
          </span>
        </a>
      </header>

      <div className="contact-support__statistics">
        <StatisticCard
          icon={Headphones}
          label="Total Complaints"
          value={totals.total}
          description="All time complaints"
          tone="green"
        />

        <StatisticCard
          icon={Clock3}
          label="Open"
          value={totals.open}
          description="Awaiting response"
          tone="blue"
        />

        <StatisticCard
          icon={CheckCircle2}
          label="Resolved"
          value={totals.resolved}
          description="Successfully resolved"
          tone="orange"
        />

        <StatisticCard
          icon={X}
          label="Closed"
          value={totals.closed}
          description="Closed complaints"
          tone="purple"
        />
      </div>

      {successMessage && (
        <div className="contact-support__success" role="status">
          <CheckCircle2 size={19} />
          <span>{successMessage}</span>

          <button
            type="button"
            aria-label="Dismiss success message"
            onClick={() => setSuccessMessage("")}
          >
            <X size={17} />
          </button>
        </div>
      )}

      <div className="contact-support__content-grid">
        <form
          className="contact-support__card contact-support__form-card"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="contact-support__card-heading">
            <Headphones size={21} />
            <h2>Raise a Complaint</h2>
          </div>

          <div className="contact-support__field">
            <label htmlFor="support-subject">
              Subject <span>*</span>
            </label>

            <input
              id="support-subject"
              type="text"
              name="subject"
              value={form.subject}
              onChange={updateField}
              placeholder="Enter a short description of your issue"
              aria-invalid={Boolean(errors.subject)}
            />

            {errors.subject && (
              <p className="contact-support__field-error">
                <AlertCircle size={14} />
                {errors.subject}
              </p>
            )}
          </div>

          <div className="contact-support__field">
            <label htmlFor="support-category">
              Category <span>*</span>
            </label>

            <select
              id="support-category"
              name="category"
              value={form.category}
              onChange={updateField}
              aria-invalid={Boolean(errors.category)}
            >
              <option value="">Select a category</option>

              {CATEGORY_OPTIONS.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>

            {errors.category && (
              <p className="contact-support__field-error">
                <AlertCircle size={14} />
                {errors.category}
              </p>
            )}
          </div>

          <div className="contact-support__field">
            <label htmlFor="support-booking-id">
              Booking ID <small>(Optional)</small>
            </label>

            <input
              id="support-booking-id"
              type="text"
              name="bookingId"
              value={form.bookingId}
              onChange={updateField}
              placeholder="Enter booking ID (e.g., BK-2025-0012)"
              aria-invalid={Boolean(errors.bookingId)}
            />

            {errors.bookingId && (
              <p className="contact-support__field-error">
                <AlertCircle size={14} />
                {errors.bookingId}
              </p>
            )}
          </div>

          <div className="contact-support__field">
            <label htmlFor="support-description">
              Description <span>*</span>
            </label>

            <textarea
              id="support-description"
              name="description"
              value={form.description}
              onChange={updateField}
              rows={5}
              maxLength={500}
              placeholder="Please describe your issue in detail..."
              aria-invalid={Boolean(errors.description)}
            />

            <div className="contact-support__textarea-footer">
              {errors.description ? (
                <p className="contact-support__field-error">
                  <AlertCircle size={14} />
                  {errors.description}
                </p>
              ) : (
                <span />
              )}

              <small>{form.description.length}/500</small>
            </div>
          </div>

          <div className="contact-support__field">
            <label htmlFor="support-attachment">
              Attachment <small>(Optional)</small>
            </label>

            <input
              ref={fileInputRef}
              id="support-attachment"
              type="file"
              className="contact-support__file-input"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />

            {!selectedFile ? (
              <button
                type="button"
                className="contact-support__upload"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip size={22} />

                <span>
                  <strong>Click to upload</strong> or drag and drop
                  <small>PDF, JPG or PNG up to 5 MB</small>
                </span>
              </button>
            ) : (
              <div className="contact-support__selected-file">
                <FileText size={21} />

                <span>
                  <strong>{selectedFile.name}</strong>
                  <small>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </small>
                </span>

                <button
                  type="button"
                  onClick={removeSelectedFile}
                  aria-label="Remove selected attachment"
                >
                  <X size={17} />
                </button>
              </div>
            )}

            {errors.attachment && (
              <p className="contact-support__field-error">
                <AlertCircle size={14} />
                {errors.attachment}
              </p>
            )}
          </div>

          <div className="contact-support__form-actions">
            <button
              type="button"
              className="contact-support__button contact-support__button--outline"
              onClick={handleReset}
            >
              <RotateCcw size={17} />
              Reset
            </button>

            <button
              type="submit"
              className="contact-support__button contact-support__button--primary"
            >
              <Send size={17} />
              Submit Complaint
            </button>
          </div>
        </form>

        <section className="contact-support__card contact-support__table-card">
          <div className="contact-support__table-heading">
            <div className="contact-support__card-heading">
              <FileText size={21} />
              <h2>Your Previous Complaints</h2>
            </div>

            <button
              type="button"
              className="contact-support__view-all"
              onClick={handleViewAllComplaints}
            >
              View all complaints
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="contact-support__table-wrapper">
            <table className="contact-support__table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {visibleComplaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td>
                      <button
                        type="button"
                        className="contact-support__complaint-id"
                        onClick={() =>
                          navigate(
                            `/customer/complaints/${complaint.id}`
                          )
                        }
                      >
                        {complaint.id}
                      </button>
                    </td>

                    <td>{complaint.subject}</td>
                    <td>{complaint.category}</td>
                    <td>{complaint.date}</td>

                    <td>
                      <span
                        className={`contact-support__status contact-support__status--${statusClassName(
                          complaint.status
                        )}`}
                      >
                        {complaint.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="contact-support__table-footer">
            <label>
              Rows per page:

              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
            </label>

            <div className="contact-support__pagination">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((pageNumber) => (
                <button
                  type="button"
                  key={pageNumber}
                  className={
                    currentPage === pageNumber
                      ? "contact-support__page-active"
                      : ""
                  }
                  onClick={() => goToPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </footer>
        </section>
      </div>
    </section>
  );
}

export default ContactSupport;