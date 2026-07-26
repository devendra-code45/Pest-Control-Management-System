import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleCheck,
  Download,
  Info,
  Mail,
  MapPin,
  Phone,
  ReceiptIndianRupee,
  RotateCcw,
  ShieldCheck,
  X,
} from 'lucide-react';
import './PaymentDetails.css';

const PAYMENT_DETAILS_ROUTES = {
  payments: '/payments',
  booking: (bookingId) => `/bookings/${bookingId}`,
};

const PAYMENT = {
  transactionId: 'TXN-784512',
  amount: 1800,
  method: 'UPI',
  paidOn: '23 Jul 2026, 10:45 AM',
  gatewayPaymentId: 'pay_Qx784512',
  provider: 'Razorpay',
  referenceNumber: 'UPI78451223',
  gatewayStatus: 'Verified',
  bookingId: 'BK-2026-031',
  service: 'General Pest Control',
  property: 'Home • Chalisgaon',
  serviceDate: '20 Jul 2026',
  technician: 'Rahul Patil',
  bookingStatus: 'Completed',
  customer: {
    name: 'Manish Bhoi',
    initials: 'MB',
    id: 'CUS-2026-014',
    phone: '+91 98••• ••210',
    phoneLink: '+919800002210',
    email: 'manish.bhoi@example.com',
    address: 'Chalisgaon, Maharashtra',
  },
};

const INITIAL_ACTIVITY = [
  { id: 'initiated', label: 'Payment Initiated', time: '23 Jul 2026, 10:44 AM' },
  { id: 'verified', label: 'Gateway Verified', time: '23 Jul 2026, 10:45 AM' },
  { id: 'completed', label: 'Payment Completed', time: '23 Jul 2026, 10:45 AM' },
];

const REFUND_REASONS = [
  'Service cancelled',
  'Duplicate payment',
  'Customer request',
  'Incorrect amount charged',
  'Other',
];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function PaymentDetails() {
  const navigate = useNavigate();
  const { transactionId } = useParams();
  const displayTransactionId = transactionId || PAYMENT.transactionId;
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [refundedAmount, setRefundedAmount] = useState(0);
  const [activity, setActivity] = useState(INITIAL_ACTIVITY);
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [refundForm, setRefundForm] = useState({
    amount: String(PAYMENT.amount),
    reason: '',
    note: '',
  });
  const [refundErrors, setRefundErrors] = useState({});
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const refundTimerRef = useRef(null);
  const processingRef = useRef(false);

  const statusClass = useMemo(
    () => paymentStatus.toLowerCase().replaceAll(' ', '-'),
    [paymentStatus],
  );

  useEffect(() => {
    processingRef.current = isProcessingRefund;
  }, [isProcessingRefund]);

  useEffect(() => {
    if (!isRefundOpen) return undefined;

    lastFocusedRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !processingRef.current) {
        setIsRefundOpen(false);
        return;
      }

      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
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
  }, [isRefundOpen]);

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timer = window.setTimeout(() => setToastMessage(''), 3500);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(
    () => () => {
      if (refundTimerRef.current) window.clearTimeout(refundTimerRef.current);
    },
    [],
  );

  const downloadReceipt = () => {
    const receipt = [
      'PEST CONTROL MANAGEMENT SYSTEM',
      'PAYMENT RECEIPT',
      '',
      `Transaction ID: #${displayTransactionId}`,
      `Customer: ${PAYMENT.customer.name}`,
      `Booking ID: #${PAYMENT.bookingId}`,
      `Service: ${PAYMENT.service}`,
      `Payment Date: ${PAYMENT.paidOn}`,
      `Payment Method: ${PAYMENT.method}`,
      `Gateway Payment ID: ${PAYMENT.gatewayPaymentId}`,
      `Amount Paid: ${formatCurrency(PAYMENT.amount)}`,
      `Status: ${paymentStatus}`,
      refundedAmount > 0 ? `Refunded Amount: ${formatCurrency(refundedAmount)}` : '',
      '',
      'This is a system-generated receipt.',
    ]
      .filter(Boolean)
      .join('\n');

    const file = new Blob([receipt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${displayTransactionId}-receipt.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setToastMessage('Payment receipt downloaded.');
  };

  const openRefundModal = () => {
    if (paymentStatus !== 'Paid') return;
    setRefundForm({ amount: String(PAYMENT.amount), reason: '', note: '' });
    setRefundErrors({});
    setIsRefundOpen(true);
  };

  const closeRefundModal = () => {
    if (isProcessingRefund) return;
    setIsRefundOpen(false);
    setRefundErrors({});
  };

  const handleRefundChange = (event) => {
    const { name, value } = event.target;
    setRefundForm((current) => ({ ...current, [name]: value }));
    setRefundErrors((current) => ({ ...current, [name]: '' }));
  };

  const submitRefund = (event) => {
    event.preventDefault();
    const amount = Number(refundForm.amount);
    const errors = {};

    if (!Number.isFinite(amount) || amount <= 0) {
      errors.amount = 'Enter a valid refund amount.';
    } else if (amount > PAYMENT.amount) {
      errors.amount = `Refund cannot exceed ${formatCurrency(PAYMENT.amount)}.`;
    }

    if (!refundForm.reason) {
      errors.reason = 'Select a reason for the refund.';
    }

    if (Object.keys(errors).length > 0) {
      setRefundErrors(errors);
      return;
    }

    setIsProcessingRefund(true);
    refundTimerRef.current = window.setTimeout(() => {
      const isFullRefund = amount === PAYMENT.amount;
      const completedAt = new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date());

      setRefundedAmount(amount);
      setPaymentStatus(isFullRefund ? 'Refunded' : 'Partially Refunded');
      setActivity((current) => [
        ...current,
        {
          id: `refund-${Date.now()}`,
          label: isFullRefund ? 'Refund Completed' : 'Partial Refund Completed',
          time: completedAt,
        },
      ]);
      setIsProcessingRefund(false);
      setIsRefundOpen(false);
      setToastMessage(
        `${formatCurrency(amount)} ${isFullRefund ? 'refund' : 'partial refund'} completed.`,
      );
    }, 1100);
  };

  return (
    <main className="payment-details-page" aria-labelledby="payment-details-title">
      {toastMessage && (
        <div className="pdt-toast" role="status" aria-live="polite">
          <CheckCircle2 aria-hidden="true" size={20} />
          {toastMessage}
        </div>
      )}

      <button
        className="pdt-back-button"
        type="button"
        onClick={() => navigate(PAYMENT_DETAILS_ROUTES.payments)}
      >
        <ArrowLeft aria-hidden="true" size={19} />
        Back to Payments
      </button>

      <header className="pdt-page-header">
        <div>
          <div className="pdt-title-row">
            <h1 id="payment-details-title">Payment Details</h1>
            <span className={`pdt-status pdt-status--${statusClass}`}>
              {paymentStatus === 'Paid' ? (
                <CircleCheck aria-hidden="true" size={17} />
              ) : (
                <RotateCcw aria-hidden="true" size={17} />
              )}
              {paymentStatus}
            </span>
          </div>
          <p>Transaction #{displayTransactionId}</p>
        </div>

        <div className="pdt-header-actions">
          <button
            className="pdt-button pdt-button--outline"
            type="button"
            onClick={downloadReceipt}
          >
            <Download aria-hidden="true" size={19} />
            Download Receipt
          </button>

          {paymentStatus === 'Paid' && (
            <button
              className="pdt-button pdt-button--danger"
              type="button"
              onClick={openRefundModal}
            >
              <RotateCcw aria-hidden="true" size={19} />
              Refund Payment
            </button>
          )}
        </div>
      </header>

      <div className="pdt-content-grid">
        <div className="pdt-left-column">
          <section className="pdt-card pdt-transaction-card" aria-labelledby="transaction-info-title">
            <h2 id="transaction-info-title">Transaction Information</h2>

            <div className="pdt-transaction-summary">
              <div className="pdt-amount-block">
                <span>Amount Paid</span>
                <strong>{formatCurrency(PAYMENT.amount)}</strong>
                <small>
                  <ShieldCheck aria-hidden="true" size={17} />
                  Payment verified
                </small>
              </div>
              <div className="pdt-summary-item">
                <span>Payment Method</span>
                <strong>{PAYMENT.method}</strong>
              </div>
              <div className="pdt-summary-item">
                <span>Paid On</span>
                <strong>{PAYMENT.paidOn}</strong>
              </div>
            </div>

            <dl className="pdt-information-grid">
              <div>
                <dt>Transaction ID</dt>
                <dd>#{displayTransactionId}</dd>
              </div>
              <div>
                <dt>Gateway Payment ID</dt>
                <dd>{PAYMENT.gatewayPaymentId}</dd>
              </div>
              <div>
                <dt>Payment Provider</dt>
                <dd>{PAYMENT.provider}</dd>
              </div>
              <div>
                <dt>Reference Number</dt>
                <dd>{PAYMENT.referenceNumber}</dd>
              </div>
              <div>
                <dt>Booking ID</dt>
                <dd>#{PAYMENT.bookingId}</dd>
              </div>
              <div>
                <dt>Gateway Status</dt>
                <dd>
                  <span className="pdt-verified-badge">
                    <CircleCheck aria-hidden="true" size={15} />
                    {PAYMENT.gatewayStatus}
                  </span>
                </dd>
              </div>
            </dl>

            <p className="pdt-security-line">
              <ShieldCheck aria-hidden="true" size={18} />
              Sensitive payment credentials are never stored.
            </p>
          </section>

          <section className="pdt-card" aria-labelledby="booking-service-title">
            <h2 id="booking-service-title">Booking &amp; Service Details</h2>
            <div className="pdt-booking-grid">
              <div>
                <span>Service</span>
                <strong>{PAYMENT.service}</strong>
              </div>
              <div>
                <span>Property</span>
                <strong>{PAYMENT.property}</strong>
              </div>
              <div>
                <span>Service Date</span>
                <strong>{PAYMENT.serviceDate}</strong>
              </div>
              <div>
                <span>Technician</span>
                <strong>{PAYMENT.technician}</strong>
              </div>
              <div>
                <span>Booking Status</span>
                <strong className="pdt-completed-badge">
                  <CircleCheck aria-hidden="true" size={15} />
                  {PAYMENT.bookingStatus}
                </strong>
              </div>
              <button
                className="pdt-button pdt-button--outline pdt-booking-button"
                type="button"
                onClick={() => navigate(PAYMENT_DETAILS_ROUTES.booking(PAYMENT.bookingId))}
              >
                <CalendarDays aria-hidden="true" size={18} />
                View Booking
              </button>
            </div>
          </section>

          <section className="pdt-card" aria-labelledby="payment-activity-title">
            <h2 id="payment-activity-title">Payment Activity</h2>
            <ol className="pdt-timeline">
              {activity.map((item) => (
                <li key={item.id}>
                  <span className="pdt-timeline-icon">
                    <Check aria-hidden="true" size={16} />
                  </span>
                  <strong>{item.label}</strong>
                  <time>{item.time}</time>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="pdt-right-column" aria-label="Customer and payment summary">
          <section className="pdt-card" aria-labelledby="customer-information-title">
            <h2 id="customer-information-title">Customer Information</h2>

            <div className="pdt-customer-profile">
              <span className="pdt-customer-avatar" aria-hidden="true">
                {PAYMENT.customer.initials}
              </span>
              <div>
                <strong>{PAYMENT.customer.name}</strong>
                <span>Customer ID&nbsp;&nbsp; #{PAYMENT.customer.id}</span>
              </div>
            </div>

            <dl className="pdt-contact-list">
              <div>
                <dt><Phone aria-hidden="true" size={20} /> Phone</dt>
                <dd>
                  <a href={`tel:${PAYMENT.customer.phoneLink}`}>{PAYMENT.customer.phone}</a>
                </dd>
              </div>
              <div>
                <dt><Mail aria-hidden="true" size={20} /> Email</dt>
                <dd>
                  <a href={`mailto:${PAYMENT.customer.email}`}>{PAYMENT.customer.email}</a>
                </dd>
              </div>
              <div>
                <dt><MapPin aria-hidden="true" size={20} /> Address</dt>
                <dd>{PAYMENT.customer.address}</dd>
              </div>
            </dl>
          </section>

          <section className="pdt-card" aria-labelledby="payment-summary-title">
            <h2 id="payment-summary-title">Payment Summary</h2>
            <dl className="pdt-payment-summary">
              <div>
                <dt>Service Amount</dt>
                <dd>{formatCurrency(PAYMENT.amount)}</dd>
              </div>
              <div>
                <dt>Tax</dt>
                <dd>₹0</dd>
              </div>
              <div>
                <dt>Discount</dt>
                <dd>₹0</dd>
              </div>
              {refundedAmount > 0 && (
                <div className="pdt-refunded-row">
                  <dt>Refunded Amount</dt>
                  <dd>-{formatCurrency(refundedAmount)}</dd>
                </div>
              )}
              <div className="pdt-summary-total">
                <dt>{refundedAmount > 0 ? 'Net Paid' : 'Total Paid'}</dt>
                <dd>{formatCurrency(PAYMENT.amount - refundedAmount)}</dd>
              </div>
            </dl>
            <p className="pdt-paid-note">
              <CircleCheck aria-hidden="true" size={17} />
              {refundedAmount > 0 ? 'Refund recorded successfully' : 'Payment received in full'}
            </p>
          </section>

          <div className={`pdt-info-strip${refundedAmount > 0 ? ' pdt-info-strip--refunded' : ''}`}>
            <Info aria-hidden="true" size={20} />
            <span>
              {refundedAmount > 0
                ? `${formatCurrency(refundedAmount)} has been refunded for this transaction.`
                : 'Refunds are available only for successful paid transactions.'}
            </span>
          </div>
        </aside>
      </div>

      {isRefundOpen && (
        <div
          className="pdt-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeRefundModal();
          }}
        >
          <section
            className="pdt-refund-modal"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="refund-modal-title"
            aria-describedby="refund-modal-description"
          >
            <header className="pdt-modal-header">
              <div>
                <h2 id="refund-modal-title">Refund Payment</h2>
                <p id="refund-modal-description">
                  Review the refund details before confirming.
                </p>
              </div>
              <button
                className="pdt-icon-button"
                type="button"
                ref={closeButtonRef}
                onClick={closeRefundModal}
                disabled={isProcessingRefund}
                aria-label="Close refund dialog"
              >
                <X aria-hidden="true" size={21} />
              </button>
            </header>

            <div className="pdt-refund-summary">
              <span className="pdt-refund-icon">
                <ReceiptIndianRupee aria-hidden="true" size={23} />
              </span>
              <span>
                <strong>#{displayTransactionId}</strong>
                <small>{PAYMENT.customer.name} • {PAYMENT.service}</small>
              </span>
              <strong>{formatCurrency(PAYMENT.amount)}</strong>
            </div>

            <form className="pdt-refund-form" onSubmit={submitRefund} noValidate>
              <div className="pdt-field">
                <label htmlFor="refund-amount">Refund Amount</label>
                <div className="pdt-amount-input">
                  <span>₹</span>
                  <input
                    id="refund-amount"
                    type="number"
                    name="amount"
                    min="1"
                    max={PAYMENT.amount}
                    step="1"
                    value={refundForm.amount}
                    onChange={handleRefundChange}
                    aria-invalid={Boolean(refundErrors.amount)}
                    aria-describedby={refundErrors.amount ? 'refund-amount-error' : undefined}
                  />
                </div>
                {refundErrors.amount && (
                  <small className="pdt-field-error" id="refund-amount-error">
                    {refundErrors.amount}
                  </small>
                )}
              </div>

              <div className="pdt-field">
                <label htmlFor="refund-reason">Refund Reason</label>
                <select
                  id="refund-reason"
                  name="reason"
                  value={refundForm.reason}
                  onChange={handleRefundChange}
                  aria-invalid={Boolean(refundErrors.reason)}
                  aria-describedby={refundErrors.reason ? 'refund-reason-error' : undefined}
                >
                  <option value="">Select a reason</option>
                  {REFUND_REASONS.map((reason) => (
                    <option value={reason} key={reason}>{reason}</option>
                  ))}
                </select>
                {refundErrors.reason && (
                  <small className="pdt-field-error" id="refund-reason-error">
                    {refundErrors.reason}
                  </small>
                )}
              </div>

              <div className="pdt-field">
                <label htmlFor="refund-note">Internal Note (optional)</label>
                <textarea
                  id="refund-note"
                  name="note"
                  rows="3"
                  value={refundForm.note}
                  onChange={handleRefundChange}
                  placeholder="Add a note for the payment record"
                />
              </div>

              <div className="pdt-refund-warning">
                <Info aria-hidden="true" size={18} />
                This frontend demo updates local UI only. A real refund must be verified by the payment gateway.
              </div>

              <div className="pdt-modal-actions">
                <button
                  className="pdt-button pdt-button--outline"
                  type="button"
                  onClick={closeRefundModal}
                  disabled={isProcessingRefund}
                >
                  Cancel
                </button>
                <button
                  className="pdt-button pdt-button--danger-solid"
                  type="submit"
                  disabled={isProcessingRefund}
                >
                  {isProcessingRefund ? (
                    <>
                      <span className="pdt-spinner" aria-hidden="true" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <RotateCcw aria-hidden="true" size={18} />
                      Confirm Refund
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default PaymentDetails;
