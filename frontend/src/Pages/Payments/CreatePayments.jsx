import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  X,
  Save,
  CreditCard,
  FileText,
  User,
  IndianRupee,
  Hash,
  Calendar,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  StickyNote,
  Lock,
  ClipboardList,
} from "lucide-react";
import "./CreatePayments.css";

export default function CreatePayments() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    invoice: "",
    customer: "",
    amount: "",
    mode: "",
    date: "",
    transactionId: "",
    status: "",
    notes: "",
  });

  function handleChange(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: wire up to API once backend is ready
    navigate("/payments");
  }

  return (
    <div className="cp-page">
      <nav className="cp-breadcrumb" aria-label="Breadcrumb">
        <Link to="/dashboard" className="cp-breadcrumb-link">
          Dashboard
        </Link>
        <ChevronRight size={14} className="cp-breadcrumb-sep" />
        <Link to="/payments" className="cp-breadcrumb-link">
          Payments
        </Link>
        <ChevronRight size={14} className="cp-breadcrumb-sep" />
        <span className="cp-breadcrumb-current">Create Payment</span>
      </nav>

      <div className="cp-header">
        <div>
          <h1 className="cp-title">Create Payment</h1>
          <p className="cp-subtitle">Record a new payment against an invoice or booking.</p>


           <div className="cp-header-actions">
           <button type="button" className="cp-btn cp-btn-outline">
            <X size={16} />
            Cancel
          </button>
          <button type="submit" form="cp-form" className="cp-btn cp-btn-primary">
            <Save size={16} />
            Save Payment
          </button>
        </div>
        </div>
    
      </div>

      <form className="cp-grid" id="cp-form" onSubmit={handleSubmit}>
        <section className="cp-card">
          <header className="cp-card-header">
            <span className="cp-card-icon">
              <CreditCard size={18} />
            </span>
            <h2 className="cp-card-title">Payment Information</h2>
          </header>

          <div className="cp-form-grid">
            <div className="cp-field">
              <label className="cp-label" htmlFor="invoice">
                Invoice / Booking <span className="cp-required">*</span>
              </label>
              <div className="cp-input-wrap">
                <FileText size={16} className="cp-input-icon" />
                <select
                  id="invoice"
                  className="cp-select"
                  value={form.invoice}
                  onChange={handleChange("invoice")}
                  required
                >
                  <option value="">Select Invoice or Booking</option>
                  <option value="INV-2025-0001">INV-2025-0001 · BK-2025-0012</option>
                  <option value="INV-2025-0002">INV-2025-0002 · BK-2025-0015</option>
                </select>
              </div>
            </div>

            <div className="cp-field">
              <label className="cp-label" htmlFor="customer">
                Customer
              </label>
              <div className="cp-input-wrap">
                <User size={16} className="cp-input-icon" />
                <select
                  id="customer"
                  className="cp-select"
                  value={form.customer}
                  onChange={handleChange("customer")}
                >
                  <option value="">Select Customer</option>
                  <option value="ramesh-sharma">Ramesh Sharma</option>
                  <option value="anita-verma">Anita Verma</option>
                </select>
              </div>
            </div>

            <div className="cp-field">
              <label className="cp-label" htmlFor="amount">
                Amount (₹) <span className="cp-required">*</span>
              </label>
              <div className="cp-input-wrap">
                <IndianRupee size={16} className="cp-input-icon" />
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter amount"
                  className="cp-input"
                  value={form.amount}
                  onChange={handleChange("amount")}
                  required
                />
              </div>
            </div>

            <div className="cp-field">
              <label className="cp-label" htmlFor="mode">
                Payment Mode <span className="cp-required">*</span>
              </label>
              <div className="cp-input-wrap">
                <CreditCard size={16} className="cp-input-icon" />
                <select
                  id="mode"
                  className="cp-select"
                  value={form.mode}
                  onChange={handleChange("mode")}
                  required
                >
                  <option value="">Select Payment Mode</option>
                  <option value="upi">UPI</option>
                  <option value="credit-card">Credit Card</option>
                  <option value="bank-transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
            </div>

            <div className="cp-field">
              <label className="cp-label" htmlFor="date">
                Payment Date <span className="cp-required">*</span>
              </label>
              <div className="cp-input-wrap">
                <Calendar size={16} className="cp-input-icon" />
                <input
                  id="date"
                  type="date"
                  className="cp-input"
                  value={form.date}
                  onChange={handleChange("date")}
                  required
                />
              </div>
            </div>

            <div className="cp-field">
              <label className="cp-label" htmlFor="transactionId">
                Transaction ID
              </label>
              <div className="cp-input-wrap">
                <Hash size={16} className="cp-input-icon" />
                <input
                  id="transactionId"
                  type="text"
                  placeholder="Enter transaction id"
                  className="cp-input"
                  value={form.transactionId}
                  onChange={handleChange("transactionId")}
                />
              </div>
            </div>

            <div className="cp-field">
              <label className="cp-label" htmlFor="status">
                Payment Status <span className="cp-required">*</span>
              </label>
              <div className="cp-input-wrap">
                <ShieldCheck size={16} className="cp-input-icon" />
                <select
                  id="status"
                  className="cp-select"
                  value={form.status}
                  onChange={handleChange("status")}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            <div className="cp-field">
              <label className="cp-label" htmlFor="notes">
                Notes
              </label>
              <div className="cp-input-wrap cp-textarea-wrap">
                <StickyNote size={16} className="cp-input-icon cp-textarea-icon" />
                <textarea
                  id="notes"
                  placeholder="Enter notes (optional)"
                  className="cp-textarea"
                  rows={4}
                  value={form.notes}
                  onChange={handleChange("notes")}
                />
              </div>
            </div>
          </div>
        </section>

        <aside className="cp-sidebar">
          <section className="cp-card">
            <header className="cp-card-header">
              <span className="cp-card-icon">
                <ClipboardList size={18} />
              </span>
              <h2 className="cp-card-title">Invoice Summary</h2>
            </header>
            <div className="cp-summary">
              <div className="cp-summary-row">
                <span>Subtotal</span>
                <span>₹ 5,000</span>
              </div>
              <div className="cp-summary-row">
                <span>Tax (18%)</span>
                <span>₹ 900</span>
              </div>
              <div className="cp-summary-row">
                <span>Discount</span>
                <span>₹ 300</span>
              </div>
              <div className="cp-summary-row cp-summary-total">
                <span>Total Amount</span>
                <span>₹ 5,600</span>
              </div>
            </div>
          </section>

          <section className="cp-card">
            <header className="cp-card-header">
              <span className="cp-card-icon">
                <User size={18} />
              </span>
              <h2 className="cp-card-title">Customer Details</h2>
            </header>
            <ul className="cp-contact-list">
              <li>
                <User size={15} /> Ramesh Sharma
              </li>
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
          </section>
        </aside>
      </form>

      <div className="cp-secure-banner">
        <div className="cp-secure-left">
          <span className="cp-secure-icon">
            <ShieldCheck size={20} />
          </span>
          <div>
            <p className="cp-secure-title">Secure Payment Processing</p>
            <p className="cp-secure-note">
              All payments are encrypted and processed securely. Your transaction is protected.
            </p>
          </div>
        </div>
        <span className="cp-compliance">
          <Lock size={14} />
          PCI DSS Compliant
        </span>
      </div>
    </div>
  );
}
