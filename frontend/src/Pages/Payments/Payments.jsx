import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Download,
  Plus,
  Wallet,
  ClipboardList,
  CheckCircle2,
  Clock,
  Search,
  Calendar,
  SlidersHorizontal,
  ArrowUpDown,
  Eye,
  MoreVertical,
  ChevronLeft,
} from "lucide-react";
import "./Payments.css";

const STATS = [
  { label: "Total Revenue", value: "₹ 2,45,680", icon: Wallet, note: "This Month" },
  { label: "Total Payments", value: "186", icon: ClipboardList, note: "This Month" },
  { label: "Paid Amount", value: "₹ 2,15,430", icon: CheckCircle2, note: "This Month" },
  { label: "Pending Amount", value: "₹ 30,250", icon: Clock, note: "This Month" },
];

const PAYMENTS = [
  {
    invoice: "INV-2025-0001",
    customer: "Ramesh Sharma",
    initials: "RS",
    booking: "BK-2025-0012",
    amount: "₹ 5,600",
    mode: "UPI",
    date: "12 May 2025",
    status: "Paid",
  },
  {
    invoice: "INV-2025-0002",
    customer: "Anita Verma",
    initials: "AV",
    booking: "BK-2025-0015",
    amount: "₹ 3,200",
    mode: "Credit Card",
    date: "12 May 2025",
    status: "Paid",
  },
  {
    invoice: "INV-2025-0003",
    customer: "Green City Apartments",
    initials: "GC",
    booking: "BK-2025-0018",
    amount: "₹ 12,750",
    mode: "Bank Transfer",
    date: "11 May 2025",
    status: "Pending",
  },
  {
    invoice: "INV-2025-0004",
    customer: "Vikram Singh",
    initials: "VS",
    booking: "BK-2025-0020",
    amount: "₹ 2,800",
    mode: "Cash",
    date: "10 May 2025",
    status: "Paid",
  },
  {
    invoice: "INV-2025-0005",
    customer: "Sunrise Villas",
    initials: "SV",
    booking: "BK-2025-0023",
    amount: "₹ 7,900",
    mode: "UPI",
    date: "09 May 2025",
    status: "Failed",
  },
];

const STATUS_CLASS = {
  Paid: "py-badge-success",
  Pending: "py-badge-warning",
  Failed: "py-badge-danger",
};

export default function Payments() {
  const [search, setSearch] = useState("");

  return (
    <div className="py-page">
      <nav className="py-breadcrumb" aria-label="Breadcrumb">
        <Link to="/dashboard" className="py-breadcrumb-link">
          Dashboard
        </Link>
        <ChevronRight size={14} className="py-breadcrumb-sep" />
        <span className="py-breadcrumb-current">Payments</span>
      </nav>

      <div className="py-header">
  <div>
    <h1 className="py-title">Payments</h1>
    <p className="py-subtitle">Manage all customer payments, invoices and transactions.</p>
  </div>
  <div className="py-header-actions">
    <Link to="/create-payment" className="py-btn py-btn-primary">
      <Plus size={16} />
      Create Payment
    </Link>
  </div>
</div>

      <div className="py-stats-grid">
        {STATS.map(({ label, value, icon: Icon, note }) => (
          <div className="py-stat-card" key={label}>
            <span className="py-stat-icon">
              <Icon size={20} strokeWidth={2} />
            </span>
            <div className="py-stat-body">
              <p className="py-stat-label">{label}</p>
              <p className="py-stat-value">{value}</p>
              <p className="py-stat-note">{note}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="py-table-card">
        <div className="py-filters">
          <div className="py-search">
            <Search size={16} className="py-search-icon" />
            <input
              type="text"
              placeholder="Search by invoice, customer or booking..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="py-search-input"
            />
          </div>

          <div className="py-select-field">
            <label className="py-select-label">Payment Status</label>
            <select className="py-select">
              <option>All</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
          </div>

          <div className="py-select-field">
            <label className="py-select-label">Payment Mode</label>
            <select className="py-select">
              <option>All</option>
              <option>UPI</option>
              <option>Credit Card</option>
              <option>Bank Transfer</option>
              <option>Cash</option>
            </select>
          </div>

          <button type="button" className="py-btn py-btn-outline py-date-btn">
            <Calendar size={16} />
            Select Date Range
          </button>

          <button type="button" className="py-btn py-btn-outline">
            <SlidersHorizontal size={16} />
            Filter
          </button>
        </div>

        <div className="py-table-wrap">
          <table className="py-table">
            <thead>
              <tr>
                <th>
                  Invoice No. <ArrowUpDown size={12} />
                </th>
                <th>
                  Customer <ArrowUpDown size={12} />
                </th>
                <th>
                  Booking ID <ArrowUpDown size={12} />
                </th>
                <th>
                  Amount <ArrowUpDown size={12} />
                </th>
                <th>Payment Mode</th>
                <th>
                  Payment Date <ArrowUpDown size={12} />
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {PAYMENTS.filter((p) =>
                `${p.invoice} ${p.customer} ${p.booking}`
                  .toLowerCase()
                  .includes(search.toLowerCase())
              ).map((p) => (
                <tr key={p.invoice}>
                  <td className="py-cell-strong">{p.invoice}</td>
                  <td>
                    <div className="py-customer-cell">
                      <span className="py-avatar">{p.initials}</span>
                      {p.customer}
                    </div>
                  </td>
                  <td>{p.booking}</td>
                  <td className="py-cell-strong">{p.amount}</td>
                  <td>{p.mode}</td>
                  <td>{p.date}</td>
                  <td>
                    <span className={`py-badge ${STATUS_CLASS[p.status]}`}>{p.status}</span>
                  </td>
                  <td>
                    <div className="py-actions">
                      <Link
                        to="/payments/detail"
                        className="py-icon-btn"
                        aria-label={`View ${p.invoice}`}
                      >
                        <Eye size={16} />
                      </Link>
                      <button type="button" className="py-icon-btn" aria-label="More actions">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="py-pagination">
          <p className="py-pagination-info">Showing 1 to 5 of 25 results</p>
          <div className="py-pagination-controls">
            <button type="button" className="py-page-btn" aria-label="Previous page">
              <ChevronLeft size={16} />
            </button>
            <button type="button" className="py-page-btn py-page-active">
              1
            </button>
            <button type="button" className="py-page-btn">
              2
            </button>
            <button type="button" className="py-page-btn">
              3
            </button>
            <span className="py-page-ellipsis">...</span>
            <button type="button" className="py-page-btn">
              5
            </button>
            <button type="button" className="py-page-btn" aria-label="Next page">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
