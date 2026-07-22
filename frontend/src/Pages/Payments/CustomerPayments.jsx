import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Bug,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CreditCard,
  Download,
  IndianRupee,
  Landmark,
  LockKeyhole,
  Search,
  ShieldCheck,
  Smartphone,
  X,
} from 'lucide-react';
import './CustomerPayments.css';

const PAYMENT_ROUTES = {
  bookingDetails: (bookingId) => `/bookings/${bookingId}`,
};

const PENDING_PAYMENT = {
  bookingId: 'BK-2026-031',
  service: 'General Pest Control',
  serviceDate: '20 Jul 2026',
  dueDate: '25 Jul 2026',
  amount: 1800,
};

const PAYMENT_METHODS = [
  {
    id: 'upi',
    name: 'UPI',
    description: 'Google Pay, PhonePe, Paytm',
    icon: Smartphone,
  },
  {
    id: 'card',
    name: 'Credit / Debit Card',
    description: 'Visa, Mastercard, RuPay',
    icon: CreditCard,
  },
  {
    id: 'net-banking',
    name: 'Net Banking',
    description: 'All major Indian banks',
    icon: Landmark,
  },
];

const INITIAL_TRANSACTIONS = [
  {
    id: 'TXN-784512',
    service: 'Termite Control',
    date: '12 Jul 2026',
    method: 'UPI',
    amount: 3500,
    status: 'Paid',
  },
  {
    id: 'TXN-769431',
    service: 'General Pest Control',
    date: '28 Jun 2026',
    method: 'Card',
    amount: 1800,
    status: 'Paid',
  },
  {
    id: 'TXN-754209',
    service: 'Mosquito Control',
    date: '15 Jun 2026',
    method: 'UPI',
    amount: 1200,
    status: 'Refunded',
  },
  {
    id: 'TXN-741863',
    service: 'Rodent Control',
    date: '02 Jun 2026',
    method: 'Net Banking',
    amount: 2400,
    status: 'Paid',
  },
  {
    id: 'TXN-728406',
    service: 'Bed Bug Treatment',
    date: '19 May 2026',
    method: 'UPI',
    amount: 2200,
    status: 'Paid',
  },
  {
    id: 'TXN-716294',
    service: 'Cockroach Control',
    date: '03 May 2026',
    method: 'Card',
    amount: 1500,
    status: 'Paid',
  },
  {
    id: 'TXN-704128',
    service: 'Ant Control',
    date: '18 Apr 2026',
    method: 'UPI',
    amount: 900,
    status: 'Refunded',
  },
  {
    id: 'TXN-691507',
    service: 'General Pest Control',
    date: '02 Apr 2026',
    method: 'Net Banking',
    amount: 1800,
    status: 'Paid',
  },
];

const PAGE_SIZE = 4;

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function todayLabel() {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date());
}

function PaymentStatus({ status }) {
  const isPaid = status === 'Paid';

  return (
    <span className={`cp-status cp-status--${status.toLowerCase()}`}>
      {isPaid ? (
        <CircleCheck aria-hidden="true" size={15} />
      ) : (
        <ChevronLeft className="cp-refund-icon" aria-hidden="true" size={15} />
      )}
      {status}
    </span>
  );
}

function Payments() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [pendingPaid, setPendingPaid] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const processingTimerRef = useRef(null);
  const isProcessingRef = useRef(false);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesSearch = [
        transaction.id,
        transaction.service,
        transaction.date,
        transaction.method,
        transaction.status,
        String(transaction.amount),
      ].some((value) => value.toLowerCase().includes(normalizedSearch));

      const matchesStatus =
        statusFilter === 'All' || transaction.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, transactions]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));

  const visibleTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredTransactions.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredTransactions]);

  const firstVisibleItem =
    filteredTransactions.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastVisibleItem = Math.min(
    currentPage * PAGE_SIZE,
    filteredTransactions.length,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    isProcessingRef.current = isProcessing;
  }, [isProcessing]);

  useEffect(() => {
    if (!isPaymentOpen) return undefined;

    lastFocusedRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isProcessingRef.current) {
        setIsPaymentOpen(false);
        return;
      }

      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button:not([disabled]), input:not([disabled])',
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      lastFocusedRef.current?.focus?.();
    };
  }, [isPaymentOpen]);

  useEffect(() => {
    if (isPaymentOpen && paymentResult) {
      closeButtonRef.current?.focus();
    }
  }, [isPaymentOpen, paymentResult]);

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timer = window.setTimeout(() => setToastMessage(''), 3500);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(
    () => () => {
      if (processingTimerRef.current) {
        window.clearTimeout(processingTimerRef.current);
      }
    },
    [],
  );

  const openPaymentModal = (methodId = 'upi') => {
    setSelectedMethod(methodId);
    setPaymentResult(null);
    setIsProcessing(false);
    setIsPaymentOpen(true);
  };

  const closePaymentModal = () => {
    if (isProcessing) return;
    setIsPaymentOpen(false);
    setPaymentResult(null);
  };

  const completePayment = () => {
    setIsProcessing(true);

    processingTimerRef.current = window.setTimeout(() => {
      const method = PAYMENT_METHODS.find((item) => item.id === selectedMethod);
      const transactionId = `TXN-${Date.now().toString().slice(-6)}`;
      const newTransaction = {
        id: transactionId,
        service: PENDING_PAYMENT.service,
        date: todayLabel(),
        method: method?.name === 'Credit / Debit Card' ? 'Card' : method?.name,
        amount: PENDING_PAYMENT.amount,
        status: 'Paid',
      };

      setTransactions((current) => [newTransaction, ...current]);
      setPendingPaid(true);
      setIsProcessing(false);
      setPaymentResult({ transactionId, method: method?.name });
    }, 1100);
  };

  const downloadReceipt = (transaction) => {
    const receipt = [
      'PEST CONTROL MANAGEMENT SYSTEM',
      'PAYMENT RECEIPT',
      '',
      `Transaction ID: #${transaction.id}`,
      `Service: ${transaction.service}`,
      `Date: ${transaction.date}`,
      `Payment Method: ${transaction.method}`,
      `Amount: ${formatCurrency(transaction.amount)}`,
      `Status: ${transaction.status}`,
      '',
      'Thank you for your payment.',
    ].join('\n');

    const file = new Blob([receipt], { type: 'text/plain;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${transaction.id}-receipt.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
    setToastMessage(`Receipt for #${transaction.id} downloaded.`);
  };

  const renderReceiptButton = (transaction) => (
    <button
      className="cp-download-button"
      type="button"
      onClick={() => downloadReceipt(transaction)}
      aria-label={`Download receipt for transaction ${transaction.id}`}
    >
      <Download aria-hidden="true" size={17} />
      Download
    </button>
  );

  return (
    <main className="customer-payments" aria-labelledby="payments-page-title">
      {toastMessage && (
        <div className="cp-toast" role="status" aria-live="polite">
          <CheckCircle2 aria-hidden="true" size={20} />
          {toastMessage}
        </div>
      )}

      <header className="cp-page-header">
        <div>
          <h1 id="payments-page-title">Payments</h1>
          <p>View transactions, pending payments and download receipts</p>
        </div>
        <button
          className="cp-button cp-button--primary cp-header-button"
          type="button"
          onClick={() => openPaymentModal()}
        >
          <IndianRupee aria-hidden="true" size={21} />
          Make a Payment
        </button>
      </header>

      <section className="cp-top-grid" aria-label="Pending payment and payment methods">
        <article className="cp-card cp-pending-card">
          <h2>Pending Payment</h2>

          <div className="cp-pending-heading">
            <span className="cp-service-icon">
              <Bug aria-hidden="true" size={31} />
            </span>
            <div className="cp-service-name">
              <h3>{PENDING_PAYMENT.service}</h3>
              <p>#{PENDING_PAYMENT.bookingId}</p>
            </div>
            <span className={`cp-due-badge${pendingPaid ? ' cp-due-badge--paid' : ''}`}>
              {pendingPaid ? (
                <CircleCheck aria-hidden="true" size={17} />
              ) : (
                <AlertCircle aria-hidden="true" size={17} />
              )}
              {pendingPaid ? 'Paid' : 'Payment Due'}
            </span>
          </div>

          <div className="cp-payment-details">
            <div>
              <span>Service Date</span>
              <strong>
                <CalendarDays aria-hidden="true" size={19} />
                {PENDING_PAYMENT.serviceDate}
              </strong>
            </div>
            <div>
              <span>Due Date</span>
              <strong>
                <CalendarDays aria-hidden="true" size={19} />
                {PENDING_PAYMENT.dueDate}
              </strong>
            </div>
            <div>
              <span>Amount</span>
              <strong>{formatCurrency(PENDING_PAYMENT.amount)}</strong>
            </div>
          </div>

          <div className="cp-pending-actions">
            <button
              className="cp-button cp-button--primary"
              type="button"
              onClick={() => openPaymentModal()}
              disabled={pendingPaid}
            >
              {pendingPaid ? (
                <>
                  <Check aria-hidden="true" size={19} />
                  Payment Completed
                </>
              ) : (
                <>Pay {formatCurrency(PENDING_PAYMENT.amount)}</>
              )}
            </button>
            <button
              className="cp-button cp-button--outline"
              type="button"
              onClick={() => navigate(PAYMENT_ROUTES.bookingDetails(PENDING_PAYMENT.bookingId))}
            >
              View Booking
            </button>
          </div>

          <p className="cp-secure-line">
            <ShieldCheck aria-hidden="true" size={18} />
            Secure payment • UPI, Cards and Net Banking
          </p>
        </article>

        <article className="cp-card cp-methods-card">
          <h2>Payment Methods</h2>
          <div className="cp-method-list">
            {PAYMENT_METHODS.map(({ id, name, description, icon: Icon }) => (
              <button
                className="cp-method-row"
                type="button"
                key={id}
                onClick={() => openPaymentModal(id)}
                aria-label={`Pay using ${name}`}
              >
                <span className="cp-method-icon">
                  <Icon aria-hidden="true" size={23} />
                </span>
                <span className="cp-method-copy">
                  <strong>{name}</strong>
                  <small>{description}</small>
                </span>
                <ChevronRight aria-hidden="true" size={20} />
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="cp-card cp-history-card" aria-labelledby="payment-history-title">
        <div className="cp-history-header">
          <h2 id="payment-history-title">Payment History</h2>
          <div className="cp-history-controls">
            <label className="cp-search-field">
              <span className="cp-visually-hidden">Search payments</span>
              <Search aria-hidden="true" size={19} />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search payments"
              />
            </label>

            <label className="cp-filter-field">
              <span className="cp-visually-hidden">Filter by payment status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Refunded">Refunded</option>
              </select>
            </label>
          </div>
        </div>

        {visibleTransactions.length > 0 ? (
          <>
            <div className="cp-table-wrapper">
              <table className="cp-payment-table">
                <caption className="cp-visually-hidden">Customer payment transaction history</caption>
                <thead>
                  <tr>
                    <th scope="col">Transaction ID</th>
                    <th scope="col">Service</th>
                    <th scope="col">Date</th>
                    <th scope="col">Method</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Status</th>
                    <th scope="col">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>#{transaction.id}</td>
                      <td>{transaction.service}</td>
                      <td>{transaction.date}</td>
                      <td>{transaction.method}</td>
                      <td>{formatCurrency(transaction.amount)}</td>
                      <td><PaymentStatus status={transaction.status} /></td>
                      <td>{renderReceiptButton(transaction)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="cp-mobile-transactions">
              {visibleTransactions.map((transaction) => (
                <article className="cp-mobile-transaction" key={transaction.id}>
                  <header>
                    <div>
                      <h3>{transaction.service}</h3>
                      <p>#{transaction.id}</p>
                    </div>
                    <PaymentStatus status={transaction.status} />
                  </header>
                  <dl>
                    <div>
                      <dt>Date</dt>
                      <dd>{transaction.date}</dd>
                    </div>
                    <div>
                      <dt>Method</dt>
                      <dd>{transaction.method}</dd>
                    </div>
                    <div>
                      <dt>Amount</dt>
                      <dd>{formatCurrency(transaction.amount)}</dd>
                    </div>
                  </dl>
                  {renderReceiptButton(transaction)}
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="cp-empty-state">
            <Search aria-hidden="true" size={31} />
            <h3>No payments found</h3>
            <p>Try changing your search or status filter.</p>
            <button
              className="cp-button cp-button--outline"
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

        <footer className="cp-history-footer">
          <p>
            Showing {firstVisibleItem}–{lastVisibleItem} of {filteredTransactions.length} payments
          </p>
          <nav className="cp-pagination" aria-label="Payment history pages">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft aria-hidden="true" size={19} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                className={currentPage === page ? 'is-active' : ''}
                type="button"
                key={page}
                onClick={() => setCurrentPage(page)}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight aria-hidden="true" size={19} />
            </button>
          </nav>
        </footer>
      </section>

      {isPaymentOpen && (
        <div
          className="cp-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePaymentModal();
          }}
        >
          <section
            className="cp-payment-modal"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-modal-title"
            aria-describedby="payment-modal-description"
          >
            {!paymentResult ? (
              <>
                <header className="cp-modal-header">
                  <div>
                    <h2 id="payment-modal-title">Make a Payment</h2>
                    <p id="payment-modal-description">Choose how you want to pay securely.</p>
                  </div>
                  <button
                    className="cp-icon-button"
                    type="button"
                    ref={closeButtonRef}
                    onClick={closePaymentModal}
                    disabled={isProcessing}
                    aria-label="Close payment dialog"
                  >
                    <X aria-hidden="true" size={21} />
                  </button>
                </header>

                <div className="cp-modal-amount">
                  <span>Amount to pay</span>
                  <strong>{formatCurrency(PENDING_PAYMENT.amount)}</strong>
                  <small>{PENDING_PAYMENT.service} • #{PENDING_PAYMENT.bookingId}</small>
                </div>

                <fieldset className="cp-method-fieldset">
                  <legend>Select payment method</legend>
                  {PAYMENT_METHODS.map(({ id, name, description, icon: Icon }) => (
                    <label
                      className={`cp-method-option${selectedMethod === id ? ' is-selected' : ''}`}
                      key={id}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={id}
                        checked={selectedMethod === id}
                        onChange={() => setSelectedMethod(id)}
                        disabled={isProcessing}
                      />
                      <span className="cp-method-icon">
                        <Icon aria-hidden="true" size={22} />
                      </span>
                      <span className="cp-method-copy">
                        <strong>{name}</strong>
                        <small>{description}</small>
                      </span>
                      <span className="cp-radio-mark" aria-hidden="true">
                        {selectedMethod === id && <Check size={14} />}
                      </span>
                    </label>
                  ))}
                </fieldset>

                <p className="cp-modal-security">
                  <LockKeyhole aria-hidden="true" size={17} />
                  Your payment information is securely processed.
                </p>

                <div className="cp-modal-actions">
                  <button
                    className="cp-button cp-button--outline"
                    type="button"
                    onClick={closePaymentModal}
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  <button
                    className="cp-button cp-button--primary"
                    type="button"
                    onClick={completePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <span className="cp-spinner" aria-hidden="true" />
                        Processing…
                      </>
                    ) : (
                      <>Pay {formatCurrency(PENDING_PAYMENT.amount)}</>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="cp-payment-success" role="status" aria-live="polite">
                <span className="cp-success-icon">
                  <CheckCircle2 aria-hidden="true" size={38} />
                </span>
                <h2 id="payment-modal-title">Payment Successful</h2>
                <p id="payment-modal-description">
                  Your payment of {formatCurrency(PENDING_PAYMENT.amount)} was completed.
                </p>
                <dl>
                  <div>
                    <dt>Transaction ID</dt>
                    <dd>#{paymentResult.transactionId}</dd>
                  </div>
                  <div>
                    <dt>Payment Method</dt>
                    <dd>{paymentResult.method}</dd>
                  </div>
                </dl>
                <button
                  className="cp-button cp-button--primary"
                  type="button"
                  ref={closeButtonRef}
                  onClick={() => {
                    closePaymentModal();
                    setToastMessage('Payment completed successfully.');
                  }}
                >
                  Done
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

export default Payments;
