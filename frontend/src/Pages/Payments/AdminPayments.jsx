import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  Download,
  RotateCcw,
  Search,
  ShieldCheck,
} from 'lucide-react';
import './AdminPayments.css';

const ADMIN_PAYMENT_ROUTES = {
  details: (transactionId) => `/payments/${transactionId}`,
};

const FEATURED_TRANSACTIONS = [
  {
    id: 'TXN-784512',
    customer: 'Manish Bhoi',
    initials: 'MB',
    bookingId: 'BK-2026-031',
    service: 'General Pest Control',
    date: '23 Jul 2026',
    time: '10:45 AM',
    monthKey: '2026-07',
    methodType: 'UPI',
    methodLabel: 'UPI',
    amount: 1800,
    status: 'Paid',
    featured: true,
  },
  {
    id: 'TXN-769431',
    customer: 'Sneha Patil',
    initials: 'SP',
    bookingId: 'BK-2026-028',
    service: 'Termite Control',
    date: '22 Jul 2026',
    time: '04:20 PM',
    monthKey: '2026-07',
    methodType: 'Card',
    methodLabel: 'Card •••• 4582',
    amount: 3500,
    status: 'Paid',
  },
  {
    id: 'TXN-754209',
    customer: 'Rahul More',
    initials: 'RM',
    bookingId: 'BK-2026-024',
    service: 'Mosquito Control',
    date: '21 Jul 2026',
    time: '11:10 AM',
    monthKey: '2026-07',
    methodType: 'UPI',
    methodLabel: 'UPI',
    amount: 1200,
    status: 'Refunded',
  },
  {
    id: 'TXN-741863',
    customer: 'Priya Deshmukh',
    initials: 'PD',
    bookingId: 'BK-2026-019',
    service: 'Rodent Control',
    date: '20 Jul 2026',
    time: '02:30 PM',
    monthKey: '2026-07',
    methodType: 'Net Banking',
    methodLabel: 'Net Banking',
    amount: 2400,
    status: 'Pending',
  },
  {
    id: 'TXN-728406',
    customer: 'Amit Jadhav',
    initials: 'AJ',
    bookingId: 'BK-2026-015',
    service: 'Bed Bug Treatment',
    date: '19 Jul 2026',
    time: '09:15 AM',
    monthKey: '2026-07',
    methodType: 'Card',
    methodLabel: 'Card •••• 9210',
    amount: 2200,
    status: 'Failed',
  },
];

const CUSTOMER_POOL = [
  ['Neha Pawar', 'NP'],
  ['Rohit Shinde', 'RS'],
  ['Kavita More', 'KM'],
  ['Sagar Patil', 'SP'],
  ['Anjali Jadhav', 'AJ'],
  ['Vikas Bhoi', 'VB'],
  ['Pooja Chaudhari', 'PC'],
  ['Nikhil Sonawane', 'NS'],
];

const SERVICE_POOL = [
  'Cockroach Control',
  'Termite Control',
  'General Pest Control',
  'Rodent Control',
  'Mosquito Control',
  'Bed Bug Treatment',
  'Ant Control',
];

const STATUS_POOL = ['Paid', 'Paid', 'Paid', 'Pending', 'Refunded', 'Failed'];
const METHOD_POOL = ['UPI', 'Card', 'Net Banking'];

function buildGeneratedTransactions() {
  return Array.from({ length: 55 }, (_, index) => {
    const [customer, initials] = CUSTOMER_POOL[index % CUSTOMER_POOL.length];
    const methodType = METHOD_POOL[index % METHOD_POOL.length];
    const isJuly = index < 37;
    const isJune = index >= 37 && index < 47;
    const monthKey = isJuly ? '2026-07' : isJune ? '2026-06' : '2026-05';
    const monthLabel = isJuly ? 'Jul' : isJune ? 'Jun' : 'May';
    const day = isJuly ? 18 - (index % 18) : 28 - (index % 18);
    const hour24 = 9 + (index % 8);
    const hour12 = hour24 % 12 || 12;
    const timeSuffix = hour24 >= 12 ? 'PM' : 'AM';
    const cardEnding = String(1372 + index * 97).slice(-4).padStart(4, '0');

    return {
      id: `TXN-${717000 - index * 317}`,
      customer,
      initials,
      bookingId: `BK-2026-${String(14 + index).padStart(3, '0')}`,
      service: SERVICE_POOL[index % SERVICE_POOL.length],
      date: `${String(Math.max(day, 1)).padStart(2, '0')} ${monthLabel} 2026`,
      time: `${String(hour12).padStart(2, '0')}:${index % 2 ? '30' : '15'} ${timeSuffix}`,
      monthKey,
      methodType,
      methodLabel: methodType === 'Card' ? `Card •••• ${cardEnding}` : methodType,
      amount: [900, 1200, 1500, 1800, 2200, 2400, 3500][index % 7],
      status: STATUS_POOL[index % STATUS_POOL.length],
    };
  });
}

const ALL_TRANSACTIONS = [...FEATURED_TRANSACTIONS, ...buildGeneratedTransactions()];
const PAGE_SIZE = 5;

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function escapeCsv(value) {
  const text = String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

function PaymentStatus({ status }) {
  const iconMap = {
    Paid: CircleCheck,
    Refunded: RotateCcw,
    Pending: Clock3,
    Failed: AlertTriangle,
  };
  const Icon = iconMap[status] ?? CircleCheck;

  return (
    <span className={`ap-status ap-status--${status.toLowerCase()}`}>
      <Icon aria-hidden="true" size={16} strokeWidth={2} />
      {status}
    </span>
  );
}

function AdminPayments() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [periodFilter, setPeriodFilter] = useState('this-month');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState('');

  const filteredTransactions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const allowedMonths = {
      'this-month': ['2026-07'],
      'last-month': ['2026-06'],
      'last-3-months': ['2026-07', '2026-06', '2026-05'],
      'all-time': null,
    }[periodFilter];

    return ALL_TRANSACTIONS.filter((transaction) => {
      const matchesSearch = [
        transaction.id,
        transaction.customer,
        transaction.bookingId,
        transaction.service,
        transaction.methodLabel,
        transaction.status,
        transaction.date,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === 'All' || transaction.status === statusFilter;
      const matchesMethod =
        methodFilter === 'All' || transaction.methodType === methodFilter;
      const matchesPeriod =
        !allowedMonths || allowedMonths.includes(transaction.monthKey);

      return matchesSearch && matchesStatus && matchesMethod && matchesPeriod;
    });
  }, [methodFilter, periodFilter, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));

  const visibleTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredTransactions.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredTransactions]);

  const visiblePageNumbers = useMemo(() => {
    const windowSize = Math.min(3, totalPages);
    const maxStart = Math.max(1, totalPages - windowSize + 1);
    const start = Math.min(Math.max(1, currentPage - 1), maxStart);
    return Array.from({ length: windowSize }, (_, index) => start + index);
  }, [currentPage, totalPages]);

  const firstVisible =
    filteredTransactions.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastVisible = Math.min(
    currentPage * PAGE_SIZE,
    filteredTransactions.length,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [methodFilter, periodFilter, searchTerm, statusFilter]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timer = window.setTimeout(() => setToastMessage(''), 3500);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const exportTransactions = () => {
    const headers = [
      'Transaction ID',
      'Customer',
      'Booking ID',
      'Service',
      'Date',
      'Time',
      'Method',
      'Amount',
      'Status',
    ];
    const rows = filteredTransactions.map((transaction) => [
      transaction.id,
      transaction.customer,
      transaction.bookingId,
      transaction.service,
      transaction.date,
      transaction.time,
      transaction.methodLabel,
      transaction.amount,
      transaction.status,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(','))
      .join('\n');
    const file = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'admin-payment-report.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setToastMessage(`${filteredTransactions.length} transactions exported.`);
  };

  const openDetails = (transactionId) => {
    navigate(ADMIN_PAYMENT_ROUTES.details(transactionId));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setMethodFilter('All');
    setPeriodFilter('this-month');
  };


  return (
    <main className="admin-payments" aria-labelledby="admin-payments-title">
      {toastMessage && (
        <div className="ap-toast" role="status" aria-live="polite">
          <CheckCircle2 aria-hidden="true" size={20} />
          {toastMessage}
        </div>
      )}

      <header className="ap-page-header">
        <div>
          <h1 id="admin-payments-title">Payments Management</h1>
          <p>Track customer payments, verify transactions and manage refunds</p>
        </div>
        <button
          className="ap-button ap-button--outline ap-export-button"
          type="button"
          onClick={exportTransactions}
        >
          <Download aria-hidden="true" size={20} />
          Export Report
        </button>
      </header>

      <section className="ap-card ap-transactions" aria-labelledby="all-transactions-title">
        <div className="ap-table-header">
          <h2 id="all-transactions-title">All Transactions</h2>

          <div className="ap-filters" aria-label="Transaction filters">
            <label className="ap-search">
              <span className="ap-visually-hidden">Search transactions</span>
              <Search aria-hidden="true" size={19} />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search customer, booking or transaction"
              />
            </label>

            <label className="ap-select-field">
              <span className="ap-visually-hidden">Filter by status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Refunded">Refunded</option>
                <option value="Failed">Failed</option>
              </select>
            </label>

            <label className="ap-select-field">
              <span className="ap-visually-hidden">Filter by payment method</span>
              <select
                value={methodFilter}
                onChange={(event) => setMethodFilter(event.target.value)}
              >
                <option value="All">All Methods</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </label>

            <label className="ap-select-field ap-period-filter">
              <span className="ap-calendar-icon">
                <CalendarDays aria-hidden="true" size={19} />
              </span>
              <span className="ap-visually-hidden">Filter by period</span>
              <select
                value={periodFilter}
                onChange={(event) => setPeriodFilter(event.target.value)}
              >
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="last-3-months">Last 3 Months</option>
                <option value="all-time">All Time</option>
              </select>
            </label>
          </div>
        </div>

        {visibleTransactions.length > 0 ? (
          <>
            <div className="ap-table-wrapper">
              <table className="ap-table">
                <caption className="ap-visually-hidden">Administrative customer payment transactions</caption>
                <thead>
                  <tr>
                    <th scope="col">Transaction</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Booking &amp; Service</th>
                    <th scope="col">Date &amp; Time</th>
                    <th scope="col">Method</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTransactions.map((transaction) => (
                    <tr
                      className={transaction.featured ? 'ap-featured-row' : undefined}
                      key={transaction.id}
                    >
                      <td>
                        <strong className="ap-transaction-id">#{transaction.id}</strong>
                      </td>
                      <td>
                        <div className="ap-customer-cell">
                          <span className="ap-avatar" aria-hidden="true">
                            {transaction.initials}
                          </span>
                          <span>{transaction.customer}</span>
                        </div>
                      </td>
                      <td>
                        <div className="ap-stacked-cell">
                          <strong>#{transaction.bookingId}</strong>
                          <span>{transaction.service}</span>
                        </div>
                      </td>
                      <td>
                        <div className="ap-stacked-cell">
                          <strong>{transaction.date}</strong>
                          <span>{transaction.time}</span>
                        </div>
                      </td>
                      <td>{transaction.methodLabel}</td>
                      <td><strong>{formatCurrency(transaction.amount)}</strong></td>
                      <td><PaymentStatus status={transaction.status} /></td>
                      <td>
                        <button
                          className="ap-button ap-button--outline ap-details-button"
                          type="button"
                          onClick={() => navigate("/admin/payments/details")}
                          aria-label={`View details for transaction ${transaction.id}`}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ap-mobile-list">
              {visibleTransactions.map((transaction) => (
                <article
                  className={`ap-mobile-item${transaction.featured ? ' ap-mobile-item--featured' : ''}`}
                  key={transaction.id}
                >
                  <header>
                    <div className="ap-customer-cell">
                      <span className="ap-avatar" aria-hidden="true">
                        {transaction.initials}
                      </span>
                      <span>
                        <strong>{transaction.customer}</strong>
                        <small>#{transaction.id}</small>
                      </span>
                    </div>
                    <PaymentStatus status={transaction.status} />
                  </header>

                  <dl>
                    <div>
                      <dt>Booking</dt>
                      <dd>#{transaction.bookingId}</dd>
                    </div>
                    <div>
                      <dt>Service</dt>
                      <dd>{transaction.service}</dd>
                    </div>
                    <div>
                      <dt>Date</dt>
                      <dd>{transaction.date}</dd>
                    </div>
                    <div>
                      <dt>Method</dt>
                      <dd>{transaction.methodLabel}</dd>
                    </div>
                  </dl>

                  <footer>
                    <strong>{formatCurrency(transaction.amount)}</strong>
                    <button
                      className="ap-button ap-button--outline ap-details-button"
                      type="button"
                      onClick={() => openDetails(transaction.id)}
                    >
                      View Details
                    </button>
                  </footer>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="ap-empty-state">
            <Search aria-hidden="true" size={34} />
            <h3>No transactions found</h3>
            <p>Try changing the search text or filters.</p>
            <button
              className="ap-button ap-button--outline"
              type="button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}

        <footer className="ap-table-footer">
          <p>
            Showing {firstVisible}–{lastVisible} of {filteredTransactions.length} transactions
          </p>

          <nav className="ap-pagination" aria-label="Transaction pages">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft aria-hidden="true" size={20} />
            </button>

            {visiblePageNumbers.map((pageNumber) => (
              <button
                className={pageNumber === currentPage ? 'is-active' : undefined}
                type="button"
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                aria-current={pageNumber === currentPage ? 'page' : undefined}
                aria-label={`Go to page ${pageNumber}`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight aria-hidden="true" size={20} />
            </button>
          </nav>
        </footer>
      </section>

      <p className="ap-security-note">
        <ShieldCheck aria-hidden="true" size={22} />
        Sensitive payment details are protected. Only masked card information is shown.
      </p>
    </main>
  );
}

export default AdminPayments;
