import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
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
  FileText,
  IndianRupee,
  Landmark,
  LockKeyhole,
  Search,
  ShieldCheck,
  Smartphone,
  X,
} from "lucide-react";

import { QRCodeCanvas } from "qrcode.react";

import api from "../../api/axios";
import "./CustomerPayments.css";

const PAYMENT_METHODS = [
  {
    id: "UPI",
    name: "UPI",
    description: "Google Pay, PhonePe, Paytm",
    icon: Smartphone,
  },
  {
    id: "CARD",
    name: "Credit / Debit Card",
    description: "Visa, Mastercard, RuPay",
    icon: CreditCard,
  },
  {
    id: "NET_BANKING",
    name: "Net Banking",
    description: "All major Indian banks",
    icon: Landmark,
  },
];

const PAGE_SIZE = 4;

const PCMS_UPI_ID = "pcms@upi";
const PCMS_PAYEE_NAME = "Pest Control Management System";

function createUpiPaymentUrl(booking) {
  if (!booking) {
    return "";
  }

  const amount = Number(
    booking.totalAmount || 0
  ).toFixed(2);

  const note = `Payment for booking BK-${String(
    booking.id
  ).padStart(4, "0")}`;

  return [
    "upi://pay",
    `?pa=${encodeURIComponent(
      PCMS_UPI_ID
    )}`,
    `&pn=${encodeURIComponent(
      PCMS_PAYEE_NAME
    )}`,
    `&am=${encodeURIComponent(amount)}`,
    "&cu=INR",
    `&tn=${encodeURIComponent(note)}`,
  ].join("");
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));
}

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function paymentMethodLabel(method) {
  const labels = {
    UPI: "UPI",
    CARD: "Card",
    NET_BANKING: "Net Banking",
    CASH: "Cash",
  };

  return labels[method] || method || "Not available";
}

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

function PaymentStatus({ status }) {
  const normalizedStatus =
    status === "REFUNDED" ? "Refunded" : "Paid";

  return (
    <span
      className={`cp-status cp-status--${normalizedStatus.toLowerCase()}`}
    >
      {normalizedStatus === "Paid" ? (
        <CircleCheck
          aria-hidden="true"
          size={15}
        />
      ) : (
        <ChevronLeft
          className="cp-refund-icon"
          aria-hidden="true"
          size={15}
        />
      )}

      {normalizedStatus}
    </span>
  );
}

function Payments() {
  const navigate = useNavigate();
  const location = useLocation();

  const requestedBookingId =
    location.state?.bookingId ||
    Number(
      sessionStorage.getItem(
        "pcmsPaymentBookingId"
      )
    ) ||
    null;

  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] =
    useState([]);
  const [selectedBookingId, setSelectedBookingId] =
    useState(requestedBookingId);

  const [searchTerm, setSearchTerm] =
    useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [currentPage, setCurrentPage] =
    useState(1);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] =
    useState("");

  const [isPaymentOpen, setIsPaymentOpen] =
    useState(false);
  const [selectedMethod, setSelectedMethod] =
    useState("UPI");
  const [isProcessing, setIsProcessing] =
    useState(false);
  const [paymentResult, setPaymentResult] =
    useState(null);
  const [toastMessage, setToastMessage] =
    useState("");

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const isProcessingRef = useRef(false);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      setPageError("");

      const [
        bookingsResponse,
        paymentsResponse,
      ] = await Promise.all([
        api.get("/customer/bookings"),
        api.get("/customer/payments"),
      ]);

      const loadedBookings = Array.isArray(
        bookingsResponse.data
      )
        ? bookingsResponse.data
        : [];

      const loadedPayments = Array.isArray(
        paymentsResponse.data
      )
        ? paymentsResponse.data
        : [];

      setBookings(loadedBookings);
      setTransactions(loadedPayments);

      const paidBookingIds = new Set(
        loadedPayments.map(
          (payment) => payment.bookingId
        )
      );

      const eligibleBookings =
        loadedBookings.filter(
          (booking) =>
            !paidBookingIds.has(booking.id) &&
            ![
              "REJECTED",
              "CANCELLED",
            ].includes(booking.status)
        );

      const requestedBooking =
        eligibleBookings.find(
          (booking) =>
            booking.id === requestedBookingId
        );

      const nextSelectedBooking =
        requestedBooking ||
        eligibleBookings[0] ||
        null;

      setSelectedBookingId(
        nextSelectedBooking?.id || null
      );

      if (nextSelectedBooking?.id) {
        sessionStorage.setItem(
          "pcmsPaymentBookingId",
          String(nextSelectedBooking.id)
        );
      } else {
        sessionStorage.removeItem(
          "pcmsPaymentBookingId"
        );
      }
    } catch (error) {
      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("pcmsAuth");
        navigate("/login", {
          replace: true,
        });
        return;
      }

      setPageError(
        getErrorMessage(
          error,
          "Unable to load payment information."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentData();
  }, []);

  useEffect(() => {
    isProcessingRef.current =
      isProcessing;
  }, [isProcessing]);

  useEffect(() => {
    if (!isPaymentOpen) {
      return undefined;
    }

    lastFocusedRef.current =
      document.activeElement;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (
        event.key === "Escape" &&
        !isProcessingRef.current
      ) {
        setIsPaymentOpen(false);
        return;
      }

      if (
        event.key === "Tab" &&
        modalRef.current
      ) {
        const focusableElements =
          modalRef.current.querySelectorAll(
            "button:not([disabled]), input:not([disabled])"
          );

        const firstElement =
          focusableElements[0];

        const lastElement =
          focusableElements[
          focusableElements.length - 1
          ];

        if (
          event.shiftKey &&
          document.activeElement ===
          firstElement
        ) {
          event.preventDefault();
          lastElement?.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement ===
          lastElement
        ) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        previousOverflow;

      lastFocusedRef.current?.focus?.();
    };
  }, [isPaymentOpen]);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const paidBookingIds = useMemo(
    () =>
      new Set(
        transactions.map(
          (payment) => payment.bookingId
        )
      ),
    [transactions]
  );

  const pendingBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          !paidBookingIds.has(booking.id) &&
          ![
            "REJECTED",
            "CANCELLED",
          ].includes(booking.status)
      ),
    [bookings, paidBookingIds]
  );

  const selectedBooking = useMemo(
    () =>
      pendingBookings.find(
        (booking) =>
          booking.id === selectedBookingId
      ) ||
      pendingBookings[0] ||
      null,
    [
      pendingBookings,
      selectedBookingId,
    ]
  );

  const upiPaymentUrl = useMemo(
    () =>
      createUpiPaymentUrl(
        selectedBooking
      ),
    [selectedBooking]
  );

  const filteredTransactions = useMemo(
    () => {
      const normalizedSearch =
        searchTerm.trim().toLowerCase();

      return transactions.filter(
        (transaction) => {
          const displayStatus =
            transaction.status ===
              "REFUNDED"
              ? "Refunded"
              : "Paid";

          const matchesSearch = [
            transaction.transactionId,
            transaction.bookingNumber,
            transaction.serviceName,
            formatDateTime(
              transaction.createdAt
            ),
            paymentMethodLabel(
              transaction.paymentMethod
            ),
            displayStatus,
            String(transaction.amount),
          ].some((value) =>
            String(value || "")
              .toLowerCase()
              .includes(normalizedSearch)
          );

          const matchesStatus =
            statusFilter === "All" ||
            displayStatus ===
            statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    },
    [
      searchTerm,
      statusFilter,
      transactions,
    ]
  );

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

  const firstVisibleItem =
    filteredTransactions.length === 0
      ? 0
      : (currentPage - 1) *
      PAGE_SIZE +
      1;

  const lastVisibleItem = Math.min(
    currentPage * PAGE_SIZE,
    filteredTransactions.length
  );

  const chooseBooking = (bookingId) => {
    const numericId =
      Number(bookingId);

    setSelectedBookingId(numericId);

    sessionStorage.setItem(
      "pcmsPaymentBookingId",
      String(numericId)
    );

    setPaymentResult(null);
  };

  const openPaymentModal = (
    methodId = "UPI"
  ) => {
    if (!selectedBooking) {
      setPageError(
        "There is no pending booking available for payment."
      );
      return;
    }

    setPageError("");
    setSelectedMethod(methodId);
    setPaymentResult(null);
    setIsProcessing(false);
    setIsPaymentOpen(true);
  };

  const closePaymentModal = () => {
    if (isProcessing) {
      return;
    }

    setIsPaymentOpen(false);
    setPaymentResult(null);
  };

  const completePayment = async () => {
    if (!selectedBooking) {
      return;
    }

    try {
      setIsProcessing(true);
      setPageError("");

      const response = await api.post(
        "/customer/payments",
        {
          bookingId:
            selectedBooking.id,
          paymentMethod:
            selectedMethod,
        }
      );

      setPaymentResult(response.data);

      setTransactions(
        (currentTransactions) => [
          response.data,
          ...currentTransactions,
        ]
      );

      const remainingBookings =
        pendingBookings.filter(
          (booking) =>
            booking.id !==
            selectedBooking.id
        );

      const nextBooking =
        remainingBookings[0] ||
        null;

      setSelectedBookingId(
        nextBooking?.id || null
      );

      if (nextBooking?.id) {
        sessionStorage.setItem(
          "pcmsPaymentBookingId",
          String(nextBooking.id)
        );
      } else {
        sessionStorage.removeItem(
          "pcmsPaymentBookingId"
        );
      }
    } catch (error) {
      setPageError(
        getErrorMessage(
          error,
          "Unable to complete payment."
        )
      );

      setIsPaymentOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadReceipt = (transaction) => {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const margin = 18;
      const contentWidth =
        pageWidth - margin * 2;

      const formatPdfAmount = (amount) => {
        return `INR ${Number(
          amount || 0
        ).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      };

      const transactionId =
        transaction.transactionId ||
        "Not available";

      const bookingNumber =
        transaction.bookingNumber ||
        `BK-${String(
          transaction.bookingId || ""
        ).padStart(4, "0")}`;

      const serviceName =
        transaction.serviceName ||
        "Pest Control Service";

      const customerName =
        transaction.customerName ||
        "Customer";

      const paymentDate = formatDateTime(
        transaction.createdAt
      );

      const paymentMethod =
        paymentMethodLabel(
          transaction.paymentMethod
        );

      const paymentStatus =
        transaction.status || "PAID";

      /*
       * Header
       */

      pdf.setFillColor(21, 128, 61);

      pdf.rect(
        0,
        0,
        pageWidth,
        42,
        "F"
      );

      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(19);

      pdf.text(
        "PEST CONTROL",
        margin,
        18
      );

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      pdf.text(
        "MANAGEMENT SYSTEM",
        margin,
        25
      );

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(17);

      pdf.text(
        "PAYMENT RECEIPT",
        pageWidth - margin,
        20,
        {
          align: "right",
        }
      );

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);

      pdf.text(
        `Receipt #${transactionId}`,
        pageWidth - margin,
        27,
        {
          align: "right",
        }
      );

      /*
       * Payment success box
       */

      let y = 54;

      pdf.setFillColor(240, 253, 244);
      pdf.setDrawColor(187, 247, 208);

      pdf.roundedRect(
        margin,
        y,
        contentWidth,
        24,
        3,
        3,
        "FD"
      );

      pdf.setTextColor(22, 101, 52);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);

      pdf.text(
        "Payment Successful",
        margin + 8,
        y + 10
      );

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);

      pdf.text(
        "Your payment has been received successfully.",
        margin + 8,
        y + 17
      );

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);

      pdf.text(
        paymentStatus,
        pageWidth - margin - 8,
        y + 14,
        {
          align: "right",
        }
      );

      /*
       * Customer and booking details
       */

      y += 36;

      pdf.setTextColor(31, 41, 55);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);

      pdf.text(
        "Payment Information",
        margin,
        y
      );

      y += 7;

      pdf.setDrawColor(229, 231, 235);

      pdf.line(
        margin,
        y,
        pageWidth - margin,
        y
      );

      y += 10;

      const addRow = (
        label,
        value,
        rowY
      ) => {
        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.setFontSize(9);
        pdf.setTextColor(
          107,
          114,
          128
        );

        pdf.text(
          label,
          margin,
          rowY
        );

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.setTextColor(
          31,
          41,
          55
        );

        const safeValue = String(
          value || "Not available"
        );

        const wrappedText =
          pdf.splitTextToSize(
            safeValue,
            100
          );

        pdf.text(
          wrappedText,
          margin + 55,
          rowY
        );

        return Math.max(
          9,
          wrappedText.length * 5
        );
      };

      y += addRow(
        "Transaction ID",
        transactionId,
        y
      );

      y += addRow(
        "Booking ID",
        bookingNumber,
        y
      );

      y += addRow(
        "Customer Name",
        customerName,
        y
      );

      y += addRow(
        "Service",
        serviceName,
        y
      );

      y += addRow(
        "Payment Date",
        paymentDate,
        y
      );

      y += addRow(
        "Payment Method",
        paymentMethod,
        y
      );

      y += addRow(
        "Payment Status",
        paymentStatus,
        y
      );

      /*
       * Amount summary
       */

      y += 6;

      pdf.setFillColor(247, 250, 248);
      pdf.setDrawColor(209, 250, 229);

      pdf.roundedRect(
        margin,
        y,
        contentWidth,
        30,
        3,
        3,
        "FD"
      );

      pdf.setTextColor(71, 85, 105);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);

      pdf.text(
        "Total Amount Paid",
        margin + 9,
        y + 12
      );

      pdf.setTextColor(21, 128, 61);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(17);

      pdf.text(
        formatPdfAmount(
          transaction.amount
        ),
        pageWidth - margin - 9,
        y + 19,
        {
          align: "right",
        }
      );

      /*
       * Information box
       */

      y += 43;

      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(226, 232, 240);

      pdf.roundedRect(
        margin,
        y,
        contentWidth,
        24,
        3,
        3,
        "FD"
      );

      pdf.setTextColor(71, 85, 105);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);

      const informationText =
        "This receipt confirms payment for the selected pest control booking. Keep this receipt for future reference.";

      const wrappedInformation =
        pdf.splitTextToSize(
          informationText,
          contentWidth - 16
        );

      pdf.text(
        wrappedInformation,
        margin + 8,
        y + 10
      );

      /*
       * Footer
       */

      pdf.setDrawColor(229, 231, 235);

      pdf.line(
        margin,
        pageHeight - 31,
        pageWidth - margin,
        pageHeight - 31
      );

      pdf.setTextColor(107, 114, 128);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);

      pdf.text(
        "Thank you for choosing Pest Control Management System.",
        pageWidth / 2,
        pageHeight - 21,
        {
          align: "center",
        }
      );

      pdf.text(
        "This is a computer-generated receipt and does not require a signature.",
        pageWidth / 2,
        pageHeight - 15,
        {
          align: "center",
        }
      );

      pdf.setTextColor(21, 128, 61);
      pdf.setFont("helvetica", "bold");

      pdf.text(
        "Safe Environment. Healthy Life.",
        pageWidth / 2,
        pageHeight - 9,
        {
          align: "center",
        }
      );

      /*
       * Save PDF
       */

      const safeTransactionId =
        transactionId.replace(
          /[^a-zA-Z0-9-_]/g,
          ""
        );

      pdf.save(
        `${safeTransactionId}-receipt.pdf`
      );

      setToastMessage(
        "PDF receipt downloaded successfully."
      );
    } catch (error) {
      console.error(
        "PDF receipt generation failed:",
        error
      );

      setPageError(
        "Unable to download the PDF receipt."
      );
    }
  };


  const downloadInvoice = (transaction) => {
    try {
      const booking = bookings.find(
        (item) =>
          Number(item.id) ===
          Number(transaction.bookingId)
      );

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const margin = 18;
      const contentWidth =
        pageWidth - margin * 2;

      const formatPdfAmount = (amount) =>
        `INR ${Number(
          amount || 0
        ).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;

      const transactionId =
        transaction.transactionId ||
        "Not available";

      const bookingNumber =
        transaction.bookingNumber ||
        `BK-${String(
          transaction.bookingId || ""
        ).padStart(4, "0")}`;

      const invoiceNumber =
        `INV-${String(
          transaction.id ||
          transaction.bookingId ||
          Date.now()
        ).padStart(6, "0")}`;

      const customerName =
        transaction.customerName ||
        booking?.customerName ||
        "Customer";

      const customerEmail =
        transaction.customerEmail ||
        booking?.customerEmail ||
        "Not available";

      const customerPhone =
        transaction.customerPhone ||
        booking?.customerPhone ||
        "Not available";

      const serviceName =
        transaction.serviceName ||
        booking?.serviceName ||
        "Pest Control Service";

      const serviceType =
        booking?.serviceType ||
        "Standard Service";

      const serviceDate =
        formatDate(
          booking?.preferredDate
        );

      const paymentDate =
        formatDateTime(
          transaction.createdAt
        );

      const paymentMethod =
        paymentMethodLabel(
          transaction.paymentMethod
        );

      const servicePrice =
        Number(
          booking?.servicePrice || 0
        );

      const inspectionCharge =
        Number(
          booking?.inspectionCharge || 0
        );

      const convenienceFee =
        Number(
          booking?.convenienceFee || 0
        );

      const totalAmount =
        Number(
          transaction.amount ||
          booking?.totalAmount ||
          0
        );

      // Header
      pdf.setFillColor(21, 128, 61);
      pdf.rect(
        0,
        0,
        pageWidth,
        42,
        "F"
      );

      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(19);
      pdf.text(
        "PEST CONTROL",
        margin,
        18
      );

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(
        "MANAGEMENT SYSTEM",
        margin,
        25
      );

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text(
        "TAX INVOICE",
        pageWidth - margin,
        19,
        {
          align: "right",
        }
      );

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(
        `Invoice No: ${invoiceNumber}`,
        pageWidth - margin,
        26,
        {
          align: "right",
        }
      );

      let y = 54;

      // Invoice summary
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(
        margin,
        y,
        contentWidth,
        28,
        3,
        3,
        "FD"
      );

      pdf.setTextColor(71, 85, 105);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(
        "Invoice Date",
        margin + 8,
        y + 9
      );
      pdf.text(
        "Booking ID",
        margin + 65,
        y + 9
      );
      pdf.text(
        "Payment Status",
        margin + 120,
        y + 9
      );

      pdf.setTextColor(31, 41, 55);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text(
        paymentDate,
        margin + 8,
        y + 18
      );
      pdf.text(
        bookingNumber,
        margin + 65,
        y + 18
      );
      pdf.setTextColor(21, 128, 61);
      pdf.text(
        transaction.status || "PAID",
        margin + 120,
        y + 18
      );

      y += 40;

      // Bill to
      pdf.setTextColor(31, 41, 55);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text(
        "Bill To",
        margin,
        y
      );

      y += 8;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text(
        customerName,
        margin,
        y
      );

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(107, 114, 128);
      y += 6;
      pdf.text(
        customerEmail,
        margin,
        y
      );
      y += 6;
      pdf.text(
        customerPhone,
        margin,
        y
      );

      y += 14;

      // Service table
      const colX = {
        description: margin,
        date: margin + 82,
        qty: margin + 122,
        amount: pageWidth - margin,
      };

      pdf.setFillColor(240, 253, 244);
      pdf.setTextColor(22, 101, 52);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);

      pdf.rect(
        margin,
        y,
        contentWidth,
        11,
        "F"
      );

      pdf.text(
        "DESCRIPTION",
        colX.description + 4,
        y + 7
      );
      pdf.text(
        "SERVICE DATE",
        colX.date,
        y + 7
      );
      pdf.text(
        "QTY",
        colX.qty,
        y + 7
      );
      pdf.text(
        "AMOUNT",
        colX.amount - 4,
        y + 7,
        {
          align: "right",
        }
      );

      y += 11;

      pdf.setDrawColor(229, 231, 235);
      pdf.setTextColor(31, 41, 55);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);

      const serviceDescription =
        pdf.splitTextToSize(
          `${serviceName} - ${serviceType}`,
          72
        );

      const rowHeight =
        Math.max(
          18,
          serviceDescription.length * 5 + 7
        );

      pdf.rect(
        margin,
        y,
        contentWidth,
        rowHeight
      );

      pdf.text(
        serviceDescription,
        colX.description + 4,
        y + 7
      );

      pdf.text(
        serviceDate,
        colX.date,
        y + 7
      );

      pdf.text(
        "1",
        colX.qty,
        y + 7
      );

      pdf.setFont("helvetica", "bold");
      pdf.text(
        formatPdfAmount(servicePrice),
        colX.amount - 4,
        y + 7,
        {
          align: "right",
        }
      );

      y += rowHeight + 10;

      // Totals
      const totalsLabelX =
        pageWidth - margin - 72;

      const totalsValueX =
        pageWidth - margin;

      const addTotalRow = (
        label,
        value,
        options = {}
      ) => {
        pdf.setFont(
          "helvetica",
          options.bold
            ? "bold"
            : "normal"
        );
        pdf.setFontSize(
          options.bold ? 11 : 9
        );
        pdf.setTextColor(
          options.green
            ? 21
            : 71,
          options.green
            ? 128
            : 85,
          options.green
            ? 61
            : 105
        );

        pdf.text(
          label,
          totalsLabelX,
          y
        );

        pdf.text(
          formatPdfAmount(value),
          totalsValueX,
          y,
          {
            align: "right",
          }
        );

        y += options.bold ? 9 : 7;
      };

      addTotalRow(
        "Service Charges",
        servicePrice
      );

      addTotalRow(
        "Inspection Charges",
        inspectionCharge
      );

      addTotalRow(
        "Convenience Fee",
        convenienceFee
      );

      pdf.setDrawColor(229, 231, 235);
      pdf.line(
        totalsLabelX,
        y - 3,
        totalsValueX,
        y - 3
      );

      y += 3;

      addTotalRow(
        "Total Amount",
        totalAmount,
        {
          bold: true,
          green: true,
        }
      );

      y += 8;

      // Payment details box
      pdf.setFillColor(247, 250, 248);
      pdf.setDrawColor(209, 250, 229);
      pdf.roundedRect(
        margin,
        y,
        contentWidth,
        30,
        3,
        3,
        "FD"
      );

      pdf.setTextColor(71, 85, 105);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(
        "Transaction ID",
        margin + 8,
        y + 10
      );
      pdf.text(
        "Payment Method",
        margin + 95,
        y + 10
      );

      pdf.setTextColor(31, 41, 55);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9.5);
      pdf.text(
        transactionId,
        margin + 8,
        y + 20
      );
      pdf.text(
        paymentMethod,
        margin + 95,
        y + 20
      );

      // Footer
      pdf.setDrawColor(229, 231, 235);
      pdf.line(
        margin,
        pageHeight - 31,
        pageWidth - margin,
        pageHeight - 31
      );

      pdf.setTextColor(107, 114, 128);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.text(
        "Thank you for choosing Pest Control Management System.",
        pageWidth / 2,
        pageHeight - 21,
        {
          align: "center",
        }
      );
      pdf.text(
        "This is a computer-generated invoice and does not require a signature.",
        pageWidth / 2,
        pageHeight - 15,
        {
          align: "center",
        }
      );

      pdf.setTextColor(21, 128, 61);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        "Safe Environment. Healthy Life.",
        pageWidth / 2,
        pageHeight - 9,
        {
          align: "center",
        }
      );

      const safeInvoiceNumber =
        invoiceNumber.replace(
          /[^a-zA-Z0-9-_]/g,
          ""
        );

      pdf.save(
        `${safeInvoiceNumber}.pdf`
      );

      setToastMessage(
        "Invoice downloaded successfully."
      );
    } catch (error) {
      console.error(
        "Invoice generation failed:",
        error
      );

      setPageError(
        "Unable to download the invoice."
      );
    }
  };

  const renderDocumentButtons = (
    transaction
  ) => (
    <div className="cp-document-actions">
      <button
        className="cp-download-button"
        type="button"
        onClick={() =>
          downloadReceipt(transaction)
        }
        aria-label={`Download receipt for transaction ${transaction.transactionId}`}
      >
        <Download
          aria-hidden="true"
          size={17}
        />
        Receipt
      </button>

      <button
        className="cp-download-button"
        type="button"
        onClick={() =>
          downloadInvoice(transaction)
        }
        aria-label={`Download invoice for transaction ${transaction.transactionId}`}
      >
        <FileText
          aria-hidden="true"
          size={17}
        />
        Invoice
      </button>
    </div>
  );

  return (
    <main
      className="customer-payments"
      aria-labelledby="payments-page-title"
    >
      {toastMessage && (
        <div
          className="cp-toast"
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

      <header className="cp-page-header">
        <div>
          <h1 id="payments-page-title">
            Payments
          </h1>

          <p>
            View transactions, pending payments
            and download receipts
          </p>
        </div>

        <button
          className="cp-button cp-button--primary cp-header-button"
          type="button"
          onClick={() =>
            openPaymentModal()
          }
          disabled={
            loading ||
            !selectedBooking
          }
        >
          <IndianRupee
            aria-hidden="true"
            size={21}
          />
          Make a Payment
        </button>
      </header>

      {pageError && (
        <div
          className="cp-card"
          style={{
            marginBottom: "20px",
            color: "#dc2626",
            borderColor: "#fecaca",
            background: "#fff7f7",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <AlertCircle size={19} />
          {pageError}
        </div>
      )}

      <section
        className="cp-top-grid"
        aria-label="Pending payment and payment methods"
      >
        <article className="cp-card cp-pending-card">
          <h2>Pending Payment</h2>

          {loading ? (
            <div className="cp-empty-state">
              <p>
                Loading payment information...
              </p>
            </div>
          ) : selectedBooking ? (
            <>
              {pendingBookings.length > 1 && (
                <label
                  style={{
                    display: "grid",
                    gap: "7px",
                    marginTop: "18px",
                  }}
                >
                  <span
                    style={{
                      color: "#64748b",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                    }}
                  >
                    Select Booking
                  </span>

                  <select
                    value={
                      selectedBooking.id
                    }
                    onChange={(event) =>
                      chooseBooking(
                        event.target.value
                      )
                    }
                    style={{
                      minHeight: "44px",
                      padding:
                        "9px 13px",
                      border:
                        "1px solid #cbd5e1",
                      borderRadius: "9px",
                      background:
                        "#ffffff",
                    }}
                  >
                    {pendingBookings.map(
                      (booking) => (
                        <option
                          key={
                            booking.id
                          }
                          value={
                            booking.id
                          }
                        >
                          BK-
                          {String(
                            booking.id
                          ).padStart(
                            4,
                            "0"
                          )}{" "}
                          —{" "}
                          {
                            booking.serviceName
                          }
                        </option>
                      )
                    )}
                  </select>
                </label>
              )}

              <div className="cp-pending-heading">
                <span className="cp-service-icon">
                  <Bug
                    aria-hidden="true"
                    size={31}
                  />
                </span>

                <div className="cp-service-name">
                  <h3>
                    {
                      selectedBooking.serviceName
                    }
                  </h3>

                  <p>
                    #BK-
                    {String(
                      selectedBooking.id
                    ).padStart(4, "0")}
                  </p>
                </div>

                <span className="cp-due-badge">
                  <AlertCircle
                    aria-hidden="true"
                    size={17}
                  />
                  Payment Due
                </span>
              </div>

              <div className="cp-payment-details">
                <div>
                  <span>
                    Service Date
                  </span>

                  <strong>
                    <CalendarDays
                      aria-hidden="true"
                      size={19}
                    />
                    {formatDate(
                      selectedBooking.preferredDate
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Booking Status
                  </span>

                  <strong>
                    {
                      selectedBooking.status
                    }
                  </strong>
                </div>

                <div>
                  <span>Amount</span>

                  <strong>
                    {formatCurrency(
                      selectedBooking.totalAmount
                    )}
                  </strong>
                </div>
              </div>

              <div className="cp-pending-actions">
                <button
                  className="cp-button cp-button--primary"
                  type="button"
                  onClick={() =>
                    openPaymentModal()
                  }
                >
                  Pay{" "}
                  {formatCurrency(
                    selectedBooking.totalAmount
                  )}
                </button>

                <button
                  className="cp-button cp-button--outline"
                  type="button"
                  onClick={() =>
                    navigate(
                      "/customer/bookings/details",
                      {
                        state: {
                          bookingId:
                            selectedBooking.id,
                        },
                      }
                    )
                  }
                >
                  View Booking
                </button>
              </div>

              <p className="cp-secure-line">
                <ShieldCheck
                  aria-hidden="true"
                  size={18}
                />
                Secure payment • UPI, Cards
                and Net Banking
              </p>
            </>
          ) : (
            <div className="cp-empty-state">
              <CircleCheck size={31} />

              <h3>
                No pending payments
              </h3>

              <p>
                All eligible bookings have
                already been paid.
              </p>

              <button
                className="cp-button cp-button--outline"
                type="button"
                onClick={() =>
                  navigate(
                    "/customer/bookings"
                  )
                }
              >
                View My Bookings
              </button>
            </div>
          )}
        </article>

        <article className="cp-card cp-methods-card">
          <h2>Payment Methods</h2>

          <div className="cp-method-list">
            {PAYMENT_METHODS.map(
              ({
                id,
                name,
                description,
                icon: Icon,
              }) => (
                <button
                  className="cp-method-row"
                  type="button"
                  key={id}
                  onClick={() =>
                    openPaymentModal(id)
                  }
                  disabled={
                    !selectedBooking
                  }
                  aria-label={`Pay using ${name}`}
                >
                  <span className="cp-method-icon">
                    <Icon
                      aria-hidden="true"
                      size={23}
                    />
                  </span>

                  <span className="cp-method-copy">
                    <strong>{name}</strong>
                    <small>
                      {description}
                    </small>
                  </span>

                  <ChevronRight
                    aria-hidden="true"
                    size={20}
                  />
                </button>
              )
            )}
          </div>
        </article>
      </section>

      <section
        className="cp-card cp-history-card"
        aria-labelledby="payment-history-title"
      >
        <div className="cp-history-header">
          <h2 id="payment-history-title">
            Payment History
          </h2>

          <div className="cp-history-controls">
            <label className="cp-search-field">
              <span className="cp-visually-hidden">
                Search payments
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
                placeholder="Search payments"
              />
            </label>

            <label className="cp-filter-field">
              <span className="cp-visually-hidden">
                Filter by payment status
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
              </select>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="cp-empty-state">
            <p>Loading payments...</p>
          </div>
        ) : visibleTransactions.length >
          0 ? (
          <>
            <div className="cp-table-wrapper">
              <table className="cp-payment-table">
                <caption className="cp-visually-hidden">
                  Customer payment transaction
                  history
                </caption>

                <thead>
                  <tr>
                    <th scope="col">
                      Transaction ID
                    </th>
                    <th scope="col">
                      Booking
                    </th>
                    <th scope="col">
                      Service
                    </th>
                    <th scope="col">
                      Date
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
                      Documents
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleTransactions.map(
                    (transaction) => (
                      <tr
                        key={
                          transaction.id
                        }
                      >
                        <td>
                          {
                            transaction.transactionId
                          }
                        </td>

                        <td>
                          {
                            transaction.bookingNumber
                          }
                        </td>

                        <td>
                          {
                            transaction.serviceName
                          }
                        </td>

                        <td>
                          {formatDateTime(
                            transaction.createdAt
                          )}
                        </td>

                        <td>
                          {paymentMethodLabel(
                            transaction.paymentMethod
                          )}
                        </td>

                        <td>
                          {formatCurrency(
                            transaction.amount
                          )}
                        </td>

                        <td>
                          <PaymentStatus
                            status={
                              transaction.status
                            }
                          />
                        </td>

                        <td>
                          {renderDocumentButtons(
                            transaction
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="cp-mobile-transactions">
              {visibleTransactions.map(
                (transaction) => (
                  <article
                    className="cp-mobile-transaction"
                    key={transaction.id}
                  >
                    <header>
                      <div>
                        <h3>
                          {
                            transaction.serviceName
                          }
                        </h3>

                        <p>
                          {
                            transaction.transactionId
                          }
                        </p>
                      </div>

                      <PaymentStatus
                        status={
                          transaction.status
                        }
                      />
                    </header>

                    <dl>
                      <div>
                        <dt>Date</dt>
                        <dd>
                          {formatDateTime(
                            transaction.createdAt
                          )}
                        </dd>
                      </div>

                      <div>
                        <dt>Method</dt>
                        <dd>
                          {paymentMethodLabel(
                            transaction.paymentMethod
                          )}
                        </dd>
                      </div>

                      <div>
                        <dt>Amount</dt>
                        <dd>
                          {formatCurrency(
                            transaction.amount
                          )}
                        </dd>
                      </div>
                    </dl>

                    {renderDocumentButtons(
                      transaction
                    )}
                  </article>
                )
              )}
            </div>
          </>
        ) : (
          <div className="cp-empty-state">
            <Search
              aria-hidden="true"
              size={31}
            />

            <h3>No payments found</h3>

            <p>
              Complete a payment or change your
              filters.
            </p>

            <button
              className="cp-button cp-button--outline"
              type="button"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

        <footer className="cp-history-footer">
          <p>
            Showing {firstVisibleItem}–
            {lastVisibleItem} of{" "}
            {filteredTransactions.length}{" "}
            payments
          </p>

          <nav
            className="cp-pagination"
            aria-label="Payment history pages"
          >
            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(1, page - 1)
                )
              }
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft
                aria-hidden="true"
                size={19}
              />
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                className={
                  currentPage === page
                    ? "is-active"
                    : ""
                }
                type="button"
                key={page}
                onClick={() =>
                  setCurrentPage(page)
                }
                aria-label={`Go to page ${page}`}
                aria-current={
                  currentPage === page
                    ? "page"
                    : undefined
                }
              >
                {page}
              </button>
            ))}

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
                size={19}
              />
            </button>
          </nav>
        </footer>
      </section>

      {isPaymentOpen &&
        selectedBooking && (
          <div
            className="cp-modal-backdrop"
            role="presentation"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closePaymentModal();
              }
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
                      <h2 id="payment-modal-title">
                        Make a Payment
                      </h2>

                      <p id="payment-modal-description">
                        Choose how you want to
                        pay securely.
                      </p>
                    </div>

                    <button
                      className="cp-icon-button"
                      type="button"
                      ref={closeButtonRef}
                      onClick={
                        closePaymentModal
                      }
                      disabled={
                        isProcessing
                      }
                      aria-label="Close payment dialog"
                    >
                      <X
                        aria-hidden="true"
                        size={21}
                      />
                    </button>
                  </header>

                  <div className="cp-modal-amount">
                    <span>
                      Amount to pay
                    </span>

                    <strong>
                      {formatCurrency(
                        selectedBooking.totalAmount
                      )}
                    </strong>

                    <small>
                      {
                        selectedBooking.serviceName
                      }{" "}
                      • BK-
                      {String(
                        selectedBooking.id
                      ).padStart(4, "0")}
                    </small>
                  </div>

                  <fieldset className="cp-method-fieldset">
                    <legend>
                      Select payment method
                    </legend>

                    {PAYMENT_METHODS.map(
                      ({
                        id,
                        name,
                        description,
                        icon: Icon,
                      }) => (
                        <label
                          className={`cp-method-option${selectedMethod ===
                            id
                            ? " is-selected"
                            : ""
                            }`}
                          key={id}
                        >
                          <input
                            type="radio"
                            name="payment-method"
                            value={id}
                            checked={
                              selectedMethod ===
                              id
                            }
                            onChange={() =>
                              setSelectedMethod(
                                id
                              )
                            }
                            disabled={
                              isProcessing
                            }
                          />

                          <span className="cp-method-icon">
                            <Icon
                              aria-hidden="true"
                              size={22}
                            />
                          </span>

                          <span className="cp-method-copy">
                            <strong>
                              {name}
                            </strong>

                            <small>
                              {
                                description
                              }
                            </small>
                          </span>

                          <span
                            className="cp-radio-mark"
                            aria-hidden="true"
                          >
                            {selectedMethod ===
                              id && (
                                <Check
                                  size={14}
                                />
                              )}
                          </span>
                        </label>
                      )
                    )}
                  </fieldset>

                  {selectedMethod === "UPI" && (
                    <section className="cp-upi-payment">
                      <div className="cp-upi-heading">
                        <Smartphone
                          size={20}
                          aria-hidden="true"
                        />

                        <div>
                          <h3>Scan and Pay</h3>

                          <p>
                            Open Google Pay,
                            PhonePe, Paytm or any
                            UPI app and scan this
                            QR code.
                          </p>
                        </div>
                      </div>

                      <div className="cp-qr-box">
                        <QRCodeCanvas
                          value={upiPaymentUrl}
                          size={210}
                          level="H"
                          includeMargin
                          aria-label="UPI payment QR code"
                        />
                      </div>

                      <div className="cp-upi-details">
                        <div>
                          <span>
                            Amount
                          </span>

                          <strong>
                            {formatCurrency(
                              selectedBooking.totalAmount
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            UPI ID
                          </span>

                          <strong>
                            {PCMS_UPI_ID}
                          </strong>
                        </div>
                      </div>

                      <p className="cp-upi-note">
                        After completing payment
                        in your UPI app, click
                        <strong>
                          {" "}
                          I Have Paid
                        </strong>
                        .
                      </p>
                    </section>
                  )}

                  <p className="cp-modal-security">
                    <LockKeyhole
                      aria-hidden="true"
                      size={17}
                    />
                    Your payment information is
                    securely processed.
                  </p>

                  <div className="cp-modal-actions">
                    <button
                      className="cp-button cp-button--outline"
                      type="button"
                      onClick={
                        closePaymentModal
                      }
                      disabled={
                        isProcessing
                      }
                    >
                      Cancel
                    </button>

                    <button
                      className="cp-button cp-button--primary"
                      type="button"
                      onClick={
                        completePayment
                      }
                      disabled={
                        isProcessing
                      }
                    >
                      {isProcessing ? (
                        <>
                          <span
                            className="cp-spinner"
                            aria-hidden="true"
                          />
                          Processing…
                        </>
                      ) : selectedMethod ===
                        "UPI" ? (
                        <>I Have Paid</>
                      ) : (
                        <>
                          Pay{" "}
                          {formatCurrency(
                            selectedBooking.totalAmount
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div
                  className="cp-payment-success"
                  role="status"
                  aria-live="polite"
                >
                  <span className="cp-success-icon">
                    <CheckCircle2
                      aria-hidden="true"
                      size={38}
                    />
                  </span>

                  <h2 id="payment-modal-title">
                    Payment Successful
                  </h2>

                  <p id="payment-modal-description">
                    Your payment of{" "}
                    {formatCurrency(
                      paymentResult.amount
                    )}{" "}
                    was completed.
                  </p>

                  <dl>
                    <div>
                      <dt>
                        Transaction ID
                      </dt>

                      <dd>
                        {
                          paymentResult.transactionId
                        }
                      </dd>
                    </div>

                    <div>
                      <dt>
                        Payment Method
                      </dt>

                      <dd>
                        {paymentMethodLabel(
                          paymentResult.paymentMethod
                        )}
                      </dd>
                    </div>
                  </dl>

                  <button
                    className="cp-button cp-button--primary"
                    type="button"
                    ref={closeButtonRef}
                    onClick={() => {
                      closePaymentModal();

                      setToastMessage(
                        "Payment completed successfully."
                      );
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