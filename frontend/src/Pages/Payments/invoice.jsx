import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Download,
  Mail,
  Printer,
  Leaf,
  User,
  Phone,
  MapPin,
  ClipboardList,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import "./invoice.css";

const LINE_ITEMS = [
  { id: 1, description: "General Pest Control Service", qty: 1, rate: "4,000", amount: "4,000" },
  { id: 2, description: "Termite Inspection", qty: 1, rate: "800", amount: "800" },
  { id: 3, description: "Service Visit Charge", qty: 1, rate: "200", amount: "200" },
];

export default function Invoice() {
  return (
    <div className="inv-page">
      <nav className="inv-breadcrumb" aria-label="Breadcrumb">
        <Link to="/dashboard" className="inv-breadcrumb-link">
          Dashboard
        </Link>
        <ChevronRight size={14} className="inv-breadcrumb-sep" />
        <Link to="/payments" className="inv-breadcrumb-link">
          Payments
        </Link>
        <ChevronRight size={14} className="inv-breadcrumb-sep" />
        <span className="inv-breadcrumb-current">Invoice</span>
      </nav>

      <div className="inv-header">
        <div>
          <h1 className="inv-title">Invoice</h1>
          <p className="inv-subtitle">View and download invoice details.</p>
        </div>
        <div className="inv-header-actions">
          <button type="button" className="inv-btn inv-btn-outline">
            <Download size={16} />
            Download PDF
          </button>
          <button type="button" className="inv-btn inv-btn-primary">
            <Mail size={16} />
            Send Invoice
          </button>
          <button type="button" className="inv-btn inv-btn-outline">
            <Printer size={16} />
            Print Invoice
          </button>
        </div>
      </div>

      <div className="inv-grid">
        <section className="inv-card inv-doc">
          <div className="inv-doc-header">
            <div className="inv-brand">
              <span className="inv-brand-mark">
                <Leaf size={22} strokeWidth={2.4} />
              </span>
              <div>
                <p className="inv-brand-name">
                  Pest<span className="inv-brand-accent">Control</span>
                </p>
                <p className="inv-brand-tagline">Safe Environment, Healthy Life.</p>
              </div>
            </div>
            <div className="inv-doc-meta">
              <p className="inv-doc-label">INVOICE</p>
              <p className="inv-doc-number">INV-2025-0001</p>
              <p className="inv-doc-date">Invoice Date: 12 May 2025</p>
            </div>
          </div>

          <div className="inv-parties">
            <div>
              <p className="inv-section-label">Bill To</p>
              <ul className="inv-party-list">
                <li>
                  <User size={14} /> Ramesh Sharma
                </li>
                <li>
                  <Phone size={14} /> 9876543210
                </li>
                <li>
                  <Mail size={14} /> ramesh.sharma@email.com
                </li>
                <li>
                  <MapPin size={14} /> 123, Green Avenue, New Delhi - 110001
                </li>
              </ul>
            </div>
            <div>
              <p className="inv-section-label">Invoice Details</p>
              <dl className="inv-detail-list">
                <div className="inv-detail-row">
                  <dt>Booking ID</dt>
                  <dd>BK-2025-0012</dd>
                </div>
                <div className="inv-detail-row">
                  <dt>Service Date</dt>
                  <dd>10 May 2025</dd>
                </div>
                <div className="inv-detail-row">
                  <dt>Due Date</dt>
                  <dd>27 May 2025</dd>
                </div>
                <div className="inv-detail-row">
                  <dt>Payment Status</dt>
                  <dd>
                    <span className="inv-badge">Paid</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <table className="inv-items-table">
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

          <div className="inv-thankyou">
            <span className="inv-thankyou-icon">
              <Leaf size={16} />
            </span>
            <div>
              <p className="inv-thankyou-title">Thank you for choosing Pest Control Management System!</p>
              <p className="inv-thankyou-note">We appreciate your business and look forward to serving you again.</p>
            </div>
          </div>
        </section>

        <aside className="inv-sidebar">
          <section className="inv-card">
            <header className="inv-card-header">
              <span className="inv-card-icon">
                <ClipboardList size={18} />
              </span>
              <h2 className="inv-card-title">Invoice Summary</h2>
            </header>
            <div className="inv-summary">
              <div className="inv-summary-row">
                <span>Subtotal</span>
                <span>₹ 5,000</span>
              </div>
              <div className="inv-summary-row">
                <span>Tax (18%)</span>
                <span>₹ 900</span>
              </div>
              <div className="inv-summary-row">
                <span>Discount</span>
                <span>₹ 300</span>
              </div>
              <div className="inv-summary-row inv-summary-total">
                <span>Total Amount</span>
                <span>₹ 5,600</span>
              </div>
            </div>
          </section>

          <section className="inv-card">
            <header className="inv-card-header">
              <span className="inv-card-icon">
                <CreditCard size={18} />
              </span>
              <h2 className="inv-card-title">Payment Information</h2>
            </header>
            <dl className="inv-detail-list">
              <div className="inv-detail-row">
                <dt>Payment Mode</dt>
                <dd>UPI</dd>
              </div>
              <div className="inv-detail-row">
                <dt>Transaction ID</dt>
                <dd>UPI-512364789012</dd>
              </div>
              <div className="inv-detail-row">
                <dt>Payment Date</dt>
                <dd>12 May 2025, 10:30 AM</dd>
              </div>
              <div className="inv-detail-row">
                <dt>Payment Status</dt>
                <dd>
                  <span className="inv-badge">Paid</span>
                </dd>
              </div>
              <div className="inv-detail-row">
                <dt>Reference No.</dt>
                <dd>REF-2025-1256</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>

      <div className="inv-footer-banner">
        <span className="inv-footer-icon">
          <ShieldCheck size={20} />
        </span>
        <div>
          <p className="inv-footer-title">This is a computer generated invoice.</p>
          <p className="inv-footer-note">No signature is required.</p>
        </div>
      </div>
    </div>
  );
}
