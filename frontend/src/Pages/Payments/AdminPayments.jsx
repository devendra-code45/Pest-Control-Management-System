import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  Download,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
} from "lucide-react";

import api from "../../api/axios";
import "./AdminPayments.css";

const ADMIN_PAYMENT_ROUTES = {
  details: "/admin/payments/details",
};

const PAGE_SIZE = 5;

function getErrorMessage(error, fallback) {
  const data = error.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data?.message) {
    return data.message;
  }

  if (data?.error) {
    return data.error;
  }

  if (data && typeof data === "object") {
    const firstMessage = Object.values(data).find(
      (value) =>
        typeof value === "string" &&
        value.trim()
    );

    if (firstMessage) {
      return firstMessage;
    }
  }

  if (!error.response) {
    return "Unable to connect to the backend.";
  }

  return fallback;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTime(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getInitials(name) {
  return (
    String(name || "")
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "NA"
  );
}

function getDisplayStatus(status) {
  const normalized = String(
    status || "PAID"
  ).toUpperCase();

  const labels = {
    PAID: "Paid",
    REFUNDED: "Refunded",
    PARTIALLY_REFUNDED:
      "Partially Refunded",
    PENDING: "Pending",
    FAILED: "Failed",
  };

  return (
    labels[normalized] ||
    normalized
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      )
  );
}

function getMethodType(method) {
  const normalized = String(
    method || ""
  ).toUpperCase();

  const labels = {
    UPI: "UPI",
    CARD: "Card",
    NET_BANKING: "Net Banking",
    CASH: "Cash",
  };

  return labels[normalized] || method || "Not available";
}

function getBookingNumber(payment) {
  if (payment.bookingNumber) {
    return payment.bookingNumber;
  }

  if (payment.bookingId) {
    return `BK-${String(
      payment.bookingId
    ).padStart(4, "0")}`;
  }

  return "Not available";
}

function transformPayment(payment) {
  const createdAt =
    payment.createdAt ||
    payment.paymentDate ||
    payment.paidAt;

  return {
    raw: payment,
    paymentId: payment.id,
    id:
      payment.transactionId ||
      `PAY-${payment.id || "NA"}`,
    customer:
      payment.customerName ||
      payment.customer?.fullName ||
      payment.customer?.name ||
      "Customer",
    customerId:
      payment.customerId ||
      payment.customer?.id ||
      null,
    bookingId: getBookingNumber(payment),
    bookingRawId: payment.bookingId,
    service:
      payment.serviceName ||
      payment.booking?.serviceName ||
      "Pest Control Service",
    date: formatDate(createdAt),
    time: formatTime(createdAt),
    createdAt,
    methodType: getMethodType(
      payment.paymentMethod
    ),
    methodLabel: getMethodType(
      payment.paymentMethod
    ),
    amount: Number(payment.amount || 0),
    status: getDisplayStatus(
      payment.status
    ),
  };
}

function escapeCsv(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function isSameMonth(dateValue, targetDate) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return (
    date.getFullYear() ===
      targetDate.getFullYear() &&
    date.getMonth() === targetDate.getMonth()
  );
}

function matchesPeriod(
  dateValue,
  periodFilter
) {
  if (periodFilter === "all-time") {
    return true;
  }

  const today = new Date();

  if (periodFilter === "this-month") {
    return isSameMonth(dateValue, today);
  }

  if (periodFilter === "last-month") {
    const lastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );

    return isSameMonth(
      dateValue,
      lastMonth
    );
  }

  if (
    periodFilter ===
    "last-3-months"
  ) {
    const paymentDate = new Date(
      dateValue
    );

    if (
      Number.isNaN(
        paymentDate.getTime()
      )
    ) {
      return false;
    }

    const startDate = new Date(
      today.getFullYear(),
      today.getMonth() - 2,
      1
    );

    const endDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );

    return (
      paymentDate >= startDate &&
      paymentDate < endDate
    );
  }

  return true;
}

function PaymentStatus({ status }) {
  const iconMap = {
    Paid: CircleCheck,
    Refunded: RotateCcw,
    "Partially Refunded": RotateCcw,
    Pending: Clock3,
    Failed: AlertTriangle,
  };

  const Icon =
    iconMap[status] || CircleCheck;

  const statusClass = status
    .toLowerCase()
    .replaceAll(" ", "-");

  return (
    <span
      className={`ap-status ap-status--${statusClass}`}
    >
      <Icon
        aria-hidden="true"
        size={16}
        strokeWidth={2}
      />
      {status}
    </span>
  );
}

function AdminPayments() {
  const navigate = useNavigate();

  const [transactions, setTransactions] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [methodFilter, setMethodFilter] =
    useState("All");

  const [periodFilter, setPeriodFilter] =
    useState("all-time");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [pageError, setPageError] =
    useState("");

  const [toastMessage, setToastMessage] =
    useState("");

  const loadPayments = async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await api.get(
        "/admin/payments"
      );

      const loadedPayments =
        Array.isArray(response.data)
          ? response.data
          : [];

      setTransactions(
        loadedPayments.map(
          transformPayment
        )
      );
    } catch (error) {
      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "pcmsAuth"
        );

        navigate("/login", {
          replace: true,
        });

        return;
      }

      setTransactions([]);

      setPageError(
        getErrorMessage(
          error,
          "Unable to load admin payments."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    methodFilter,
    periodFilter,
    searchTerm,
    statusFilter,
  ]);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timer = window.setTimeout(
      () => setToastMessage(""),
      3500
    );

    return () =>
      window.clearTimeout(timer);
  }, [toastMessage]);

  const filteredTransactions =
    useMemo(() => {
      const query = searchTerm
        .trim()
        .toLowerCase();

      return transactions.filter(
        (transaction) => {
          const matchesSearch = [
            transaction.id,
            transaction.customer,
            transaction.bookingId,
            transaction.service,
            transaction.methodLabel,
            transaction.status,
            transaction.date,
            String(transaction.amount),
          ].some((value) =>
            String(value || "")
              .toLowerCase()
              .includes(query)
          );

          const matchesStatus =
            statusFilter === "All" ||
            transaction.status ===
              statusFilter;

          const matchesMethod =
            methodFilter === "All" ||
            transaction.methodType ===
              methodFilter;

          const periodMatches =
            matchesPeriod(
              transaction.createdAt,
              periodFilter
            );

          return (
            matchesSearch &&
            matchesStatus &&
            matchesMethod &&
            periodMatches
          );
        }
      );
    }, [
      methodFilter,
      periodFilter,
      searchTerm,
      statusFilter,
      transactions,
    ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTransactions.length /
        PAGE_SIZE
    )
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const visibleTransactions =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) *
        PAGE_SIZE;

      return filteredTransactions.slice(
        startIndex,
        startIndex + PAGE_SIZE
      );
    }, [
      currentPage,
      filteredTransactions,
    ]);

  const visiblePageNumbers =
    useMemo(() => {
      const windowSize = Math.min(
        3,
        totalPages
      );

      const maxStart = Math.max(
        1,
        totalPages - windowSize + 1
      );

      const start = Math.min(
        Math.max(1, currentPage - 1),
        maxStart
      );

      return Array.from(
        { length: windowSize },
        (_, index) => start + index
      );
    }, [currentPage, totalPages]);

  const firstVisible =
    filteredTransactions.length === 0
      ? 0
      : (currentPage - 1) *
          PAGE_SIZE +
        1;

  const lastVisible = Math.min(
    currentPage * PAGE_SIZE,
    filteredTransactions.length
  );

  const exportTransactions = () => {
    if (
      filteredTransactions.length === 0
    ) {
      setToastMessage(
        "There are no transactions to export."
      );
      return;
    }

    const headers = [
      "Transaction ID",
      "Customer",
      "Booking ID",
      "Service",
      "Date",
      "Time",
      "Method",
      "Amount",
      "Status",
    ];

    const rows =
      filteredTransactions.map(
        (transaction) => [
          transaction.id,
          transaction.customer,
          transaction.bookingId,
          transaction.service,
          transaction.date,
          transaction.time,
          transaction.methodLabel,
          transaction.amount,
          transaction.status,
        ]
      );

    const csv = [headers, ...rows]
      .map((row) =>
        row.map(escapeCsv).join(",")
      )
      .join("\n");

    const file = new Blob(
      [`\uFEFF${csv}`],
      {
        type: "text/csv;charset=utf-8",
      }
    );

    const url =
      URL.createObjectURL(file);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "admin-payment-report.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(
      () =>
        URL.revokeObjectURL(url),
      1000
    );

    setToastMessage(
      `${filteredTransactions.length} transactions exported.`
    );
  };

  const openDetails = (
    transaction
  ) => {
    if (transaction.paymentId) {
      sessionStorage.setItem(
        "pcmsAdminPaymentId",
        String(transaction.paymentId)
      );
    }

    sessionStorage.setItem(
      "pcmsAdminTransactionId",
      transaction.id
    );

    navigate(
      ADMIN_PAYMENT_ROUTES.details,
      {
        state: {
          paymentId:
            transaction.paymentId,
          transactionId:
            transaction.id,
        },
      }
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setMethodFilter("All");
    setPeriodFilter("all-time");
  };

  return (
    <main
      className="admin-payments"
      aria-labelledby="admin-payments-title"
    >
      {toastMessage && (
        <div
          className="ap-toast"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2
            aria-hidden="true"
            size={20}
          />
          {toastMessage}
        </div>
      )}

      <header className="ap-page-header">
        <div>
          <h1 id="admin-payments-title">
            Payments Management
          </h1>

          <p>
            Track customer payments,
            verify transactions and manage
            refunds
          </p>
        </div>

        <div className="ap-header-actions">
          <button
            className="ap-button ap-button--outline"
            type="button"
            onClick={loadPayments}
            disabled={loading}
          >
            <RefreshCw
              aria-hidden="true"
              size={19}
              className={
                loading
                  ? "ap-spin"
                  : undefined
              }
            />
            Refresh
          </button>

          <button
            className="ap-button ap-button--outline ap-export-button"
            type="button"
            onClick={exportTransactions}
            disabled={
              loading ||
              filteredTransactions.length ===
                0
            }
          >
            <Download
              aria-hidden="true"
              size={20}
            />
            Export Report
          </button>
        </div>
      </header>

      {pageError && (
        <div
          className="ap-error-banner"
          role="alert"
        >
          <AlertTriangle
            aria-hidden="true"
            size={20}
          />

          <span>{pageError}</span>

          <button
            type="button"
            onClick={loadPayments}
          >
            Try Again
          </button>
        </div>
      )}

      <section
        className="ap-card ap-transactions"
        aria-labelledby="all-transactions-title"
      >
        <div className="ap-table-header">
          <h2 id="all-transactions-title">
            All Transactions
          </h2>

          <div
            className="ap-filters"
            aria-label="Transaction filters"
          >
            <label className="ap-search">
              <span className="ap-visually-hidden">
                Search transactions
              </span>

              <Search
                aria-hidden="true"
                size={19}
              />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder="Search customer, booking or transaction"
              />
            </label>

            <label className="ap-select-field">
              <span className="ap-visually-hidden">
                Filter by status
              </span>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Status
                </option>
                <option value="Paid">
                  Paid
                </option>
                <option value="Refunded">
                  Refunded
                </option>
                <option value="Partially Refunded">
                  Partially Refunded
                </option>
                <option value="Pending">
                  Pending
                </option>
                <option value="Failed">
                  Failed
                </option>
              </select>
            </label>

            <label className="ap-select-field">
              <span className="ap-visually-hidden">
                Filter by payment method
              </span>

              <select
                value={methodFilter}
                onChange={(event) =>
                  setMethodFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Methods
                </option>
                <option value="UPI">
                  UPI
                </option>
                <option value="Card">
                  Card
                </option>
                <option value="Net Banking">
                  Net Banking
                </option>
                <option value="Cash">
                  Cash
                </option>
              </select>
            </label>

            <label className="ap-select-field ap-period-filter">
              <span className="ap-calendar-icon">
                <CalendarDays
                  aria-hidden="true"
                  size={19}
                />
              </span>

              <span className="ap-visually-hidden">
                Filter by period
              </span>

              <select
                value={periodFilter}
                onChange={(event) =>
                  setPeriodFilter(
                    event.target.value
                  )
                }
              >
                <option value="all-time">
                  All Time
                </option>
                <option value="this-month">
                  This Month
                </option>
                <option value="last-month">
                  Last Month
                </option>
                <option value="last-3-months">
                  Last 3 Months
                </option>
              </select>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="ap-loading-state">
            <RefreshCw
              aria-hidden="true"
              size={31}
              className="ap-spin"
            />
            <p>
              Loading payment transactions...
            </p>
          </div>
        ) : visibleTransactions.length >
          0 ? (
          <>
            <div className="ap-table-wrapper">
              <table className="ap-table">
                <caption className="ap-visually-hidden">
                  Administrative customer
                  payment transactions
                </caption>

                <thead>
                  <tr>
                    <th scope="col">
                      Transaction
                    </th>
                    <th scope="col">
                      Customer
                    </th>
                    <th scope="col">
                      Booking &amp; Service
                    </th>
                    <th scope="col">
                      Date &amp; Time
                    </th>
                    <th scope="col">
                      Method
                    </th>
                    <th scope="col">
                      Amount
                    </th>
                    <th scope="col">
                      Status
                    </th>
                    <th scope="col">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleTransactions.map(
                    (transaction) => (
                      <tr
                        key={
                          transaction.paymentId ||
                          transaction.id
                        }
                      >
                        <td>
                          <strong className="ap-transaction-id">
                            #
                            {transaction.id}
                          </strong>
                        </td>

                        <td>
                          <div className="ap-customer-cell">
                            <span
                              className="ap-avatar"
                              aria-hidden="true"
                            >
                              {getInitials(
                                transaction.customer
                              )}
                            </span>

                            <span>
                              {
                                transaction.customer
                              }
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="ap-stacked-cell">
                            <strong>
                              #
                              {
                                transaction.bookingId
                              }
                            </strong>

                            <span>
                              {
                                transaction.service
                              }
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="ap-stacked-cell">
                            <strong>
                              {
                                transaction.date
                              }
                            </strong>

                            <span>
                              {
                                transaction.time
                              }
                            </span>
                          </div>
                        </td>

                        <td>
                          {
                            transaction.methodLabel
                          }
                        </td>

                        <td>
                          <strong>
                            {formatCurrency(
                              transaction.amount
                            )}
                          </strong>
                        </td>

                        <td>
                          <PaymentStatus
                            status={
                              transaction.status
                            }
                          />
                        </td>

                        <td>
                          <button
                            className="ap-button ap-button--outline ap-details-button"
                            type="button"
                            onClick={() =>
                              openDetails(
                                transaction
                              )
                            }
                            aria-label={`View details for transaction ${transaction.id}`}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="ap-mobile-list">
              {visibleTransactions.map(
                (transaction) => (
                  <article
                    className="ap-mobile-item"
                    key={
                      transaction.paymentId ||
                      transaction.id
                    }
                  >
                    <header>
                      <div className="ap-customer-cell">
                        <span
                          className="ap-avatar"
                          aria-hidden="true"
                        >
                          {getInitials(
                            transaction.customer
                          )}
                        </span>

                        <span>
                          <strong>
                            {
                              transaction.customer
                            }
                          </strong>

                          <small>
                            #
                            {transaction.id}
                          </small>
                        </span>
                      </div>

                      <PaymentStatus
                        status={
                          transaction.status
                        }
                      />
                    </header>

                    <dl>
                      <div>
                        <dt>Booking</dt>
                        <dd>
                          #
                          {
                            transaction.bookingId
                          }
                        </dd>
                      </div>

                      <div>
                        <dt>Service</dt>
                        <dd>
                          {
                            transaction.service
                          }
                        </dd>
                      </div>

                      <div>
                        <dt>Date</dt>
                        <dd>
                          {transaction.date}
                        </dd>
                      </div>

                      <div>
                        <dt>Method</dt>
                        <dd>
                          {
                            transaction.methodLabel
                          }
                        </dd>
                      </div>
                    </dl>

                    <footer>
                      <strong>
                        {formatCurrency(
                          transaction.amount
                        )}
                      </strong>

                      <button
                        className="ap-button ap-button--outline ap-details-button"
                        type="button"
                        onClick={() =>
                          openDetails(
                            transaction
                          )
                        }
                      >
                        View Details
                      </button>
                    </footer>
                  </article>
                )
              )}
            </div>
          </>
        ) : (
          <div className="ap-empty-state">
            <Search
              aria-hidden="true"
              size={34}
            />

            <h3>
              No transactions found
            </h3>

            <p>
              {transactions.length === 0
                ? "No customer payments are available yet."
                : "Try changing the search text or filters."}
            </p>

            {transactions.length > 0 && (
              <button
                className="ap-button ap-button--outline"
                type="button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        <footer className="ap-table-footer">
          <p>
            Showing {firstVisible}–
            {lastVisible} of{" "}
            {filteredTransactions.length}{" "}
            transactions
          </p>

          <nav
            className="ap-pagination"
            aria-label="Transaction pages"
          >
            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      1,
                      page - 1
                    )
                )
              }
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft
                aria-hidden="true"
                size={20}
              />
            </button>

            {visiblePageNumbers.map(
              (pageNumber) => (
                <button
                  className={
                    pageNumber ===
                    currentPage
                      ? "is-active"
                      : undefined
                  }
                  type="button"
                  key={pageNumber}
                  onClick={() =>
                    setCurrentPage(
                      pageNumber
                    )
                  }
                  aria-current={
                    pageNumber ===
                    currentPage
                      ? "page"
                      : undefined
                  }
                  aria-label={`Go to page ${pageNumber}`}
                >
                  {pageNumber}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      totalPages,
                      page + 1
                    )
                )
              }
              disabled={
                currentPage === totalPages
              }
              aria-label="Next page"
            >
              <ChevronRight
                aria-hidden="true"
                size={20}
              />
            </button>
          </nav>
        </footer>
      </section>

      <p className="ap-security-note">
        <ShieldCheck
          aria-hidden="true"
          size={22}
        />

        Sensitive payment details are
        protected. Only transaction
        information stored by PCMS is
        displayed.
      </p>
    </main>
  );
}

export default AdminPayments;