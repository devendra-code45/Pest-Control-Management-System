import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Download,
  Printer,
  RotateCcw,
  ClipboardList,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
} from "lucide-react";
import "./PaymentsDetail.css";

const OVERVIEW_LEFT = [
  { label: "Invoice No.", value: "INV-2025-0001" },
  { label: "Booking ID", value: "BK-2025-0012" },
  { label: "Payment Date", value: "12 May 2025, 10:30 AM" },
  { label: "Payment Status", value: "Paid", badge: true },
  { label: "Payment Mode", value: "UPI" },
];

const OVERVIEW_RIGHT = [
  { label: "Amount", value: "₹ 5,600", strong: true },
  { label: "Transaction ID", value: "UPI-512364789012" },
  { label: "Reference No.", value: "REF-2025-1256" },
  { label: "Payment By", value: "Ramesh Sharma" },
  { label: "Recorded By", value: "Admin User" },
];

const BOOKING_LEFT = [
  { label: "Service Date", value: "10 May 2025" },
  { label: "Service Type", value: "General Pest Control Service" },
  { label: "Property Address", value: "123, Green Avenue, New Delhi - 110001" },
];

const BOOKING_RIGHT = [
  { label: "Technician", value: "Amit Kumar" },
  { label: "Duration", value: "2 Hours" },
  { label: "Booking Status", value: "Completed", badge: true },
];

const LINE_ITEMS = [
  { id: 1, description: "General Pest Control Service", qty: 1, rate: "4,000", amount: "4,000" },
  { id: 2, description: "Termite Inspection", qty: 1, rate: "800", amount: "800" },
  { id: 3, description: "Service Visit Charge", qty: 1, rate: "200", amount: "200" },
];

const TIMELINE = [
  {
    time: "12 May 2025 · 10:28 AM",
    title: "Payment Initiated",
    note: "Payment was initiated by Ramesh Sharma.",
    done: false,
  },
  {
    time: "12 May 2025 · 10:29 AM",
    title: "Payment Processing",
    note: "Transaction is being processed securely.",
    done: false,
  },
  {
    time: "12 May 2025 · 10:30 AM",
    title: "Payment Successful",
    note: "Payment received successfully.",
    done: true,
  },
  {
    time: "12 May 2025 · 10:31 AM",
    title: "Receipt Generated",
    note: "Receipt has been generated and sent.",
    done: true,
  },
];

export default function PaymentsDetail() {
  return (
    <div className="pd-page">
      <nav className="pd-breadcrumb" aria-label="Breadcrumb">
        <Link to="/dashboard" className="pd-breadcrumb-link">
          Dashboard
        </Link>
        <ChevronRight size={14} className="pd-breadcrumb-sep" />
        <Link to="/payments" className="pd-breadcrumb-link">
          Payments
        </Link>
        <ChevronRight size={14} className="pd-breadcrumb-sep" />
        <span className="pd-breadcrumb-current">Payment Details</span>
      </nav>

      <div className="pd-header">
        <div>
          <h1 className="pd-title">Payment Details</h1>
          <p className="pd-subtitle">View complete payment and transaction information.</p>
        </div>
        <div className="pd-header-actions">
          <button type="button" className="pd-btn pd-btn-outline">
            <Download size={16} />
            Download Receipt
          </button>
          <button type="button" className="pd-btn pd-btn-outline">
            <Printer size={16} />
            Print Receipt
          </button>
          <button type="button" className="pd-btn pd-btn-primary">
            <RotateCcw size={16} />
            Refund Payment
          </button>
        </div>
      </div>

      <div className="pd-grid">
        <section className="pd-card">
          <header className="pd-card-header">
            <span className="pd-card-icon">
              <ClipboardList size={18} />
            </span>
            <h2 className="pd-card-title">Payment Overview</h2>
          </header>
          <div className="pd-detail-grid">
            <dl className="pd-detail-col">
              {OVERVIEW_LEFT.map((item) => (
                <div className="pd-detail-row" key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>
                    {item.badge ? (
                      <span className="pd-badge pd-badge-success">{item.value}</span>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <dl className="pd-detail-col">
              {OVERVIEW_RIGHT.map((item) => (
                <div className="pd-detail-row" key={item.label}>
                  <dt>{item.label}</dt>
                  <dd className={item.strong ? "pd-value-strong" : undefined}>{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="pd-card">
          <header className="pd-card-header">
            <span className="pd-card-icon">
              <User size={18} />
            </span>
            <h2 className="pd-card-title">Customer Details</h2>
          </header>
          <div className="pd-customer">
            <span className="pd-avatar">RS</span>
            <div>
              <div className="pd-customer-name-row">
                <span className="pd-customer-name">Ramesh Sharma</span>
                <span className="pd-tag">Customer</span>
              </div>
            </div>
          </div>
          <ul className="pd-contact-list">
            <li>
              <Phone size={15} /> 9876543210
            </li>
            <li>
              <Mail size={15} /> ramesh.sharma@email.com
            </li>
            <li>
              <MapPin size={15} /> 123, Green Avenue, New Delhi - 110001
            </li>
          </ul>
          <button type="button" className="pd-btn pd-btn-outline pd-full-width">
            <User size={16} />
            View Customer Profile
          </button>
        </section>

        <section className="pd-card">
          <header className="pd-card-header">
            <span className="pd-card-icon">
              <Calendar size={18} />
            </span>
            <h2 className="pd-card-title">Service / Booking Details</h2>
          </header>

          <div className="pd-booking-box">
            <div className="pd-detail-grid">
              <dl className="pd-detail-col">
                {BOOKING_LEFT.map((item) => (
                  <div className="pd-detail-row" key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
              <dl className="pd-detail-col">
                {BOOKING_RIGHT.map((item) => (
                  <div className="pd-detail-row" key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>
                      {item.badge ? (
                        <span className="pd-badge pd-badge-success">{item.value}</span>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <table className="pd-items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Rate (₹)</th>
                <th>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {LINE_ITEMS.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.description}</td>
                  <td>{item.qty}</td>
                  <td>{item.rate}</td>
                  <td>{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pd-summary">
            <div className="pd-summary-row">
              <span>Subtotal</span>
              <span>₹ 5,000</span>
            </div>
            <div className="pd-summary-row">
              <span>Tax (18%)</span>
              <span>₹ 900</span>
            </div>
            <div className="pd-summary-row">
              <span>Discount</span>
              <span>- ₹ 300</span>
            </div>
            <div className="pd-summary-row pd-summary-total">
              <span>Total Amount</span>
              <span>₹ 5,600</span>
            </div>
          </div>
        </section>

        <section className="pd-card">
          <header className="pd-card-header">
            <span className="pd-card-icon">
              <Clock size={18} />
            </span>
            <h2 className="pd-card-title">Payment Timeline</h2>
          </header>
          <ul className="pd-timeline">
            {TIMELINE.map((step, i) => (
              <li className="pd-timeline-item" key={step.title}>
                <span className={`pd-timeline-dot ${step.done ? "pd-timeline-done" : ""}`} />
                {i !== TIMELINE.length - 1 && <span className="pd-timeline-line" />}
                <div>
                  <p className="pd-timeline-time">{step.time}</p>
                  <p className="pd-timeline-title">{step.title}</p>
                  <p className="pd-timeline-note">{step.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="pd-secure-banner">
        <span className="pd-secure-icon">
          <ShieldCheck size={20} />
        </span>
        <div>
          <p className="pd-secure-title">Secure &amp; Verified Transaction</p>
          <p className="pd-secure-note">This payment is encrypted and processed securely. All data is protected.</p>
        </div>
      </div>
    </div>
  );
}
