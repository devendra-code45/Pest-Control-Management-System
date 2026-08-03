import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { jsPDF } from "jspdf";

import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleCheck,
  Download,
  FileText,
  Info,
  Mail,
  MapPin,
  Phone,
  ReceiptIndianRupee,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";

import api from "../../api/axios";
import "./PaymentDetails.css";

const PAYMENT_DETAILS_ROUTES = {
  payments: "/admin/payments",
  booking: "/admin/bookings/details",
};

const REFUND_REASONS = [
  "Service cancelled",
  "Duplicate payment",
  "Customer request",
  "Incorrect amount charged",
  "Other",
];

function getErrorMessage(error, fallback) {
  const data = error.response?.data;

  if (
    typeof data === "string" &&
    data.trim()
  ) {
    return data;
  }

  if (data?.message) {
    return data.message;
  }

  if (data?.error) {
    return data.error;
  }

  if (
    data &&
    typeof data === "object"
  ) {
    const firstMessage =
      Object.values(data).find(
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
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(Number(value || 0));
}

function formatPdfAmount(value) {
  return `INR ${Number(
    value || 0
  ).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDateTime(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(
    String(value).includes("T")
      ? value
      : `${value}T00:00:00`
  );

  if (
    Number.isNaN(date.getTime())
  ) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

function paymentMethodLabel(method) {
  const labels = {
    UPI: "UPI",
    CARD: "Card",
    NET_BANKING: "Net Banking",
    CASH: "Cash",
  };

  return (
    labels[
      String(method || "").toUpperCase()
    ] ||
    method ||
    "Not available"
  );
}

function displayStatus(status) {
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

function initials(name) {
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

function bookingNumber(payment) {
  if (payment?.bookingNumber) {
    return payment.bookingNumber;
  }

  if (payment?.bookingId) {
    return `BK-${String(
      payment.bookingId
    ).padStart(4, "0")}`;
  }

  return "Not available";
}

function customerNumber(payment) {
  if (payment?.customerNumber) {
    return payment.customerNumber;
  }

  if (payment?.customerId) {
    return `CUS-${String(
      payment.customerId
    ).padStart(4, "0")}`;
  }

  return "Not available";
}

function safeFileName(value) {
  return String(value || "payment")
    .replace(
      /[^a-zA-Z0-9-_]/g,
      ""
    );
}

function PaymentDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const paymentId =
    location.state?.paymentId ||
    sessionStorage.getItem(
      "pcmsAdminPaymentId"
    );

  const requestedTransactionId =
    location.state?.transactionId ||
    params.transactionId ||
    sessionStorage.getItem(
      "pcmsAdminTransactionId"
    );

  const [payment, setPayment] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [pageError, setPageError] =
    useState("");

  const [isRefundOpen, setIsRefundOpen] =
    useState(false);

  const [refundForm, setRefundForm] =
    useState({
      amount: "",
      reason: "",
      note: "",
    });

  const [refundErrors, setRefundErrors] =
    useState({});

  const [
    isProcessingRefund,
    setIsProcessingRefund,
  ] = useState(false);

  const [toastMessage, setToastMessage] =
    useState("");

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const processingRef = useRef(false);

  const loadPaymentDetails =
    async () => {
      if (!paymentId) {
        setPageError(
          "No payment was selected. Return to Payments and open a transaction."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setPageError("");

        const response = await api.get(
          `/admin/payments/${paymentId}`
        );

        const loadedPayment =
          response.data || null;

        setPayment(loadedPayment);

        if (
          loadedPayment?.id
        ) {
          sessionStorage.setItem(
            "pcmsAdminPaymentId",
            String(
              loadedPayment.id
            )
          );
        }

        if (
          loadedPayment?.transactionId
        ) {
          sessionStorage.setItem(
            "pcmsAdminTransactionId",
            loadedPayment.transactionId
          );
        }
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

        setPayment(null);

        setPageError(
          getErrorMessage(
            error,
            "Unable to load payment details."
          )
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadPaymentDetails();
  }, [paymentId]);

  useEffect(() => {
    processingRef.current =
      isProcessingRefund;
  }, [isProcessingRefund]);

  useEffect(() => {
    if (!isRefundOpen) {
      return undefined;
    }

    lastFocusedRef.current =
      document.activeElement;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    closeButtonRef.current?.focus();

    const handleKeyDown = (
      event
    ) => {
      if (
        event.key === "Escape" &&
        !processingRef.current
      ) {
        setIsRefundOpen(false);
        return;
      }

      if (
        event.key === "Tab" &&
        modalRef.current
      ) {
        const focusableElements =
          modalRef.current.querySelectorAll(
            "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])"
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
  }, [isRefundOpen]);

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

  const transactionId =
    payment?.transactionId ||
    requestedTransactionId ||
    "Not available";

  const paymentStatus = displayStatus(
    payment?.status
  );

  const amount = Number(
    payment?.amount || 0
  );

  const refundedAmount = Number(
    payment?.refundedAmount ||
      (paymentStatus === "Refunded"
        ? amount
        : 0)
  );

  const customerName =
    payment?.customerName ||
    payment?.customer?.fullName ||
    payment?.customer?.name ||
    "Customer";

  const customerEmail =
    payment?.customerEmail ||
    payment?.customer?.email ||
    "Not available";

  const customerPhone =
    payment?.customerPhone ||
    payment?.customer?.phone ||
    "Not available";

  const customerAddress =
    payment?.customerAddress ||
    payment?.customer?.address ||
    payment?.serviceAddress ||
    "Not available";

  const serviceName =
    payment?.serviceName ||
    payment?.booking?.serviceName ||
    "Pest Control Service";

  const serviceDate =
    payment?.serviceDate ||
    payment?.preferredDate ||
    payment?.booking?.preferredDate;

  const serviceType =
    payment?.serviceType ||
    payment?.booking?.serviceType ||
    "Standard Service";

  const property =
    [
      payment?.propertyType ||
        payment?.booking?.propertyType,
      payment?.city ||
        payment?.booking?.city,
    ]
      .filter(Boolean)
      .join(" • ") ||
    "Not available";

  const technicianName =
    payment?.technicianName ||
    payment?.booking?.technicianName ||
    "Not assigned";

  const bookingStatus =
    payment?.bookingStatus ||
    payment?.booking?.status ||
    "Not available";

  const paymentMethod =
    paymentMethodLabel(
      payment?.paymentMethod
    );

  const paidOn = formatDateTime(
    payment?.createdAt ||
      payment?.paymentDate ||
      payment?.paidAt
  );

  const provider =
    payment?.provider ||
    payment?.paymentProvider ||
    "PCMS Payment Service";

  const gatewayPaymentId =
    payment?.gatewayPaymentId ||
    transactionId;

  const referenceNumber =
    payment?.referenceNumber ||
    transactionId;

  const serviceAmount = Number(
    payment?.serviceAmount ||
      payment?.servicePrice ||
      amount
  );

  const inspectionCharge = Number(
    payment?.inspectionCharge || 0
  );

  const convenienceFee = Number(
    payment?.convenienceFee || 0
  );

  const statusClass = useMemo(
    () =>
      paymentStatus
        .toLowerCase()
        .replaceAll(" ", "-"),
    [paymentStatus]
  );

  const activity = useMemo(() => {
    if (!payment) {
      return [];
    }

    const items = [
      {
        id: "completed",
        label: "Payment Completed",
        time: paidOn,
      },
    ];

    if (
      payment.refundedAt ||
      paymentStatus === "Refunded" ||
      paymentStatus ===
        "Partially Refunded"
    ) {
      items.push({
        id: "refund",
        label:
          paymentStatus ===
          "Partially Refunded"
            ? "Partial Refund Completed"
            : "Refund Completed",
        time: formatDateTime(
          payment.refundedAt ||
            payment.updatedAt
        ),
      });
    }

    return items;
  }, [
    paidOn,
    payment,
    paymentStatus,
  ]);

  const downloadReceipt = () => {
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

      pdf.setFillColor(21, 128, 61);
      pdf.rect(
        0,
        0,
        pageWidth,
        42,
        "F"
      );

      pdf.setTextColor(255, 255, 255);
      pdf.setFont(
        "helvetica",
        "bold"
      );
      pdf.setFontSize(19);
      pdf.text(
        "PEST CONTROL",
        margin,
        18
      );

      pdf.setFont(
        "helvetica",
        "normal"
      );
      pdf.setFontSize(10);
      pdf.text(
        "MANAGEMENT SYSTEM",
        margin,
        25
      );

      pdf.setFont(
        "helvetica",
        "bold"
      );
      pdf.setFontSize(17);
      pdf.text(
        "PAYMENT RECEIPT",
        pageWidth - margin,
        20,
        {
          align: "right",
        }
      );

      pdf.setFont(
        "helvetica",
        "normal"
      );
      pdf.setFontSize(9);
      pdf.text(
        `Receipt #${transactionId}`,
        pageWidth - margin,
        27,
        {
          align: "right",
        }
      );

      let y = 55;

      pdf.setFillColor(
        240,
        253,
        244
      );
      pdf.setDrawColor(
        187,
        247,
        208
      );

      pdf.roundedRect(
        margin,
        y,
        contentWidth,
        25,
        3,
        3,
        "FD"
      );

      pdf.setTextColor(
        22,
        101,
        52
      );
      pdf.setFont(
        "helvetica",
        "bold"
      );
      pdf.setFontSize(13);
      pdf.text(
        paymentStatus === "Refunded"
          ? "Payment Refunded"
          : "Payment Successful",
        margin + 8,
        y + 10
      );

      pdf.setFontSize(16);
      pdf.text(
        formatPdfAmount(amount),
        pageWidth - margin - 8,
        y + 16,
        {
          align: "right",
        }
      );

      y += 38;

      const rows = [
        [
          "Transaction ID",
          transactionId,
        ],
        [
          "Booking ID",
          bookingNumber(payment),
        ],
        [
          "Customer",
          customerName,
        ],
        ["Service", serviceName],
        ["Payment Date", paidOn],
        [
          "Payment Method",
          paymentMethod,
        ],
        ["Status", paymentStatus],
      ];

      rows.forEach(
        ([label, value]) => {
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
          pdf.text(label, margin, y);

          pdf.setFont(
            "helvetica",
            "bold"
          );
          pdf.setTextColor(
            31,
            41,
            55
          );

          const wrapped =
            pdf.splitTextToSize(
              String(
                value ||
                  "Not available"
              ),
              100
            );

          pdf.text(
            wrapped,
            margin + 55,
            y
          );

          y += Math.max(
            9,
            wrapped.length * 5
          );
        }
      );

      if (refundedAmount > 0) {
        pdf.setTextColor(
          9,
          105,
          218
        );
        pdf.setFont(
          "helvetica",
          "bold"
        );
        pdf.text(
          "Refunded Amount",
          margin,
          y
        );
        pdf.text(
          formatPdfAmount(
            refundedAmount
          ),
          margin + 55,
          y
        );
      }

      pdf.setDrawColor(
        229,
        231,
        235
      );

      pdf.line(
        margin,
        pageHeight - 31,
        pageWidth - margin,
        pageHeight - 31
      );

      pdf.setTextColor(
        107,
        114,
        128
      );
      pdf.setFont(
        "helvetica",
        "normal"
      );
      pdf.setFontSize(8);
      pdf.text(
        "This is a computer-generated receipt and does not require a signature.",
        pageWidth / 2,
        pageHeight - 18,
        {
          align: "center",
        }
      );

      pdf.setTextColor(
        21,
        128,
        61
      );
      pdf.setFont(
        "helvetica",
        "bold"
      );
      pdf.text(
        "Safe Environment. Healthy Life.",
        pageWidth / 2,
        pageHeight - 10,
        {
          align: "center",
        }
      );

      pdf.save(
        `${safeFileName(
          transactionId
        )}-receipt.pdf`
      );

      setToastMessage(
        "Payment receipt downloaded."
      );
    } catch (error) {
      console.error(
        "Receipt generation failed:",
        error
      );

      setPageError(
        "Unable to download the receipt."
      );
    }
  };

  const downloadInvoice = () => {
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

      const invoiceNumber =
        `INV-${String(
          payment?.id ||
            payment?.bookingId ||
            Date.now()
        ).padStart(6, "0")}`;

      pdf.setFillColor(21, 128, 61);
      pdf.rect(
        0,
        0,
        pageWidth,
        42,
        "F"
      );

      pdf.setTextColor(255, 255, 255);
      pdf.setFont(
        "helvetica",
        "bold"
      );
      pdf.setFontSize(19);
      pdf.text(
        "PEST CONTROL",
        margin,
        18
      );

      pdf.setFont(
        "helvetica",
        "normal"
      );
      pdf.setFontSize(10);
      pdf.text(
        "MANAGEMENT SYSTEM",
        margin,
        25
      );

      pdf.setFont(
        "helvetica",
        "bold"
      );
      pdf.setFontSize(18);
      pdf.text(
        "TAX INVOICE",
        pageWidth - margin,
        19,
        {
          align: "right",
        }
      );

      pdf.setFont(
        "helvetica",
        "normal"
      );
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

      pdf.setFillColor(
        248,
        250,
        252
      );
      pdf.setDrawColor(
        226,
        232,
        240
      );

      pdf.roundedRect(
        margin,
        y,
        contentWidth,
        28,
        3,
        3,
        "FD"
      );

      pdf.setTextColor(
        71,
        85,
        105
      );
      pdf.setFont(
        "helvetica",
        "normal"
      );
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

      pdf.setTextColor(
        31,
        41,
        55
      );
      pdf.setFont(
        "helvetica",
        "bold"
      );
      pdf.setFontSize(10);

      pdf.text(
        paidOn,
        margin + 8,
        y + 18
      );
      pdf.text(
        bookingNumber(payment),
        margin + 65,
        y + 18
      );

      pdf.setTextColor(
        21,
        128,
        61
      );
      pdf.text(
        paymentStatus,
        margin + 120,
        y + 18
      );

      y += 42;

      pdf.setTextColor(
        31,
        41,
        55
      );
      pdf.setFont(
        "helvetica",
        "bold"
      );
      pdf.setFontSize(12);
      pdf.text("Bill To", margin, y);

      y += 8;

      pdf.setFontSize(10);
      pdf.text(
        customerName,
        margin,
        y
      );

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

      pdf.setFillColor(
        240,
        253,
        244
      );
      pdf.setTextColor(
        22,
        101,
        52
      );
      pdf.setFont(
        "helvetica",
        "bold"
      );
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
        margin + 4,
        y + 7
      );

      pdf.text(
        "SERVICE DATE",
        margin + 84,
        y + 7
      );

      pdf.text(
        "AMOUNT",
        pageWidth - margin - 4,
        y + 7,
        {
          align: "right",
        }
      );

      y += 11;

      const description =
        pdf.splitTextToSize(
          `${serviceName} - ${serviceType}`,
          72
        );

      const rowHeight = Math.max(
        19,
        description.length * 5 + 7
      );

      pdf.setDrawColor(
        229,
        231,
        235
      );

      pdf.rect(
        margin,
        y,
        contentWidth,
        rowHeight
      );

      pdf.setTextColor(
        31,
        41,
        55
      );
      pdf.setFont(
        "helvetica",
        "normal"
      );
      pdf.text(
        description,
        margin + 4,
        y + 7
      );

      pdf.text(
        formatDate(serviceDate),
        margin + 84,
        y + 7
      );

      pdf.setFont(
        "helvetica",
        "bold"
      );
      pdf.text(
        formatPdfAmount(
          serviceAmount
        ),
        pageWidth - margin - 4,
        y + 7,
        {
          align: "right",
        }
      );

      y += rowHeight + 12;

      const labelX =
        pageWidth - margin - 72;

      const valueX =
        pageWidth - margin;

      const totalRow = (
        label,
        value,
        bold = false,
        green = false
      ) => {
        pdf.setFont(
          "helvetica",
          bold ? "bold" : "normal"
        );

        pdf.setFontSize(
          bold ? 11 : 9
        );

        pdf.setTextColor(
          green ? 21 : 71,
          green ? 128 : 85,
          green ? 61 : 105
        );

        pdf.text(label, labelX, y);

        pdf.text(
          formatPdfAmount(value),
          valueX,
          y,
          {
            align: "right",
          }
        );

        y += bold ? 9 : 7;
      };

      totalRow(
        "Service Amount",
        serviceAmount
      );

      totalRow(
        "Inspection Charge",
        inspectionCharge
      );

      totalRow(
        "Convenience Fee",
        convenienceFee
      );

      pdf.line(
        labelX,
        y - 3,
        valueX,
        y - 3
      );

      y += 3;

      totalRow(
        "Total Amount",
        amount,
        true,
        true
      );

      y += 8;

      pdf.setFillColor(
        247,
        250,
        248
      );
      pdf.setDrawColor(
        209,
        250,
        229
      );

      pdf.roundedRect(
        margin,
        y,
        contentWidth,
        30,
        3,
        3,
        "FD"
      );

      pdf.setTextColor(
        71,
        85,
        105
      );
      pdf.setFont(
        "helvetica",
        "normal"
      );
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

      pdf.setTextColor(
        31,
        41,
        55
      );
      pdf.setFont(
        "helvetica",
        "bold"
      );

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

      pdf.setDrawColor(
        229,
        231,
        235
      );

      pdf.line(
        margin,
        pageHeight - 31,
        pageWidth - margin,
        pageHeight - 31
      );

      pdf.setTextColor(
        107,
        114,
        128
      );
      pdf.setFont(
        "helvetica",
        "normal"
      );
      pdf.setFontSize(8);

      pdf.text(
        "This is a computer-generated invoice and does not require a signature.",
        pageWidth / 2,
        pageHeight - 18,
        {
          align: "center",
        }
      );

      pdf.setTextColor(
        21,
        128,
        61
      );
      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.text(
        "Safe Environment. Healthy Life.",
        pageWidth / 2,
        pageHeight - 10,
        {
          align: "center",
        }
      );

      pdf.save(
        `${safeFileName(
          invoiceNumber
        )}.pdf`
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

  const openRefundModal = () => {
    if (
      paymentStatus !== "Paid"
    ) {
      return;
    }

    setRefundForm({
      amount: String(amount),
      reason: "",
      note: "",
    });

    setRefundErrors({});
    setIsRefundOpen(true);
  };

  const closeRefundModal = () => {
    if (isProcessingRefund) {
      return;
    }

    setIsRefundOpen(false);
    setRefundErrors({});
  };

  const handleRefundChange = (
    event
  ) => {
    const { name, value } =
      event.target;

    setRefundForm((current) => ({
      ...current,
      [name]: value,
    }));

    setRefundErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const submitRefund = async (
    event
  ) => {
    event.preventDefault();

    const refundAmount = Number(
      refundForm.amount
    );

    const errors = {};

    if (
      !Number.isFinite(refundAmount) ||
      refundAmount <= 0
    ) {
      errors.amount =
        "Enter a valid refund amount.";
    } else if (
      refundAmount !== amount
    ) {
      errors.amount =
        `Only a full refund of ${formatCurrency(
          amount
        )} is supported.`;
    }

    if (!refundForm.reason) {
      errors.reason =
        "Select a reason for the refund.";
    }

    if (
      Object.keys(errors).length > 0
    ) {
      setRefundErrors(errors);
      return;
    }

    try {
      setIsProcessingRefund(true);
      setPageError("");

      const response = await api.patch(
        `/admin/payments/${payment.id}/refund`,
        {
          amount: refundAmount,
          reason: refundForm.reason,
          note: refundForm.note.trim(),
        }
      );

      const updatedPayment =
        response.data &&
        typeof response.data ===
          "object"
          ? response.data
          : {
              ...payment,
              status:
                refundAmount === amount
                  ? "REFUNDED"
                  : "PARTIALLY_REFUNDED",
              refundedAmount:
                refundAmount,
              refundReason:
                refundForm.reason,
              refundNote:
                refundForm.note.trim(),
              refundedAt:
                new Date().toISOString(),
            };

      setPayment(updatedPayment);
      setIsRefundOpen(false);

      setToastMessage(
        `${formatCurrency(
          refundAmount
        )} refund completed successfully.`
      );
    } catch (error) {
      setRefundErrors({
        submit: getErrorMessage(
          error,
          "Unable to refund this payment."
        ),
      });
    } finally {
      setIsProcessingRefund(false);
    }
  };

  const openBooking = () => {
    if (!payment?.bookingId) {
      setPageError(
        "Booking information is unavailable for this payment."
      );
      return;
    }

    sessionStorage.setItem(
      "pcmsSelectedBookingId",
      String(payment.bookingId)
    );

    navigate(
      PAYMENT_DETAILS_ROUTES.booking,
      {
        state: {
          bookingId:
            payment.bookingId,
        },
      }
    );
  };

  if (loading) {
    return (
      <main className="payment-details-page">
        <div className="pdt-page-state">
          <RefreshCw
            aria-hidden="true"
            size={34}
            className="pdt-spin"
          />

          <h2>
            Loading payment details...
          </h2>
        </div>
      </main>
    );
  }

  if (!payment) {
    return (
      <main className="payment-details-page">
        <button
          className="pdt-back-button"
          type="button"
          onClick={() =>
            navigate(
              PAYMENT_DETAILS_ROUTES.payments
            )
          }
        >
          <ArrowLeft
            aria-hidden="true"
            size={19}
          />
          Back to Payments
        </button>

        <div className="pdt-page-state pdt-page-state--error">
          <AlertCircle
            aria-hidden="true"
            size={36}
          />

          <h2>
            Payment details unavailable
          </h2>

          <p>{pageError}</p>

          {paymentId && (
            <button
              className="pdt-button pdt-button--outline"
              type="button"
              onClick={
                loadPaymentDetails
              }
            >
              Try Again
            </button>
          )}
        </div>
      </main>
    );
  }

  return (
    <main
      className="payment-details-page"
      aria-labelledby="payment-details-title"
    >
      {toastMessage && (
        <div
          className="pdt-toast"
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

      {pageError && (
        <div
          className="pdt-error-banner"
          role="alert"
        >
          <AlertCircle
            aria-hidden="true"
            size={20}
          />
          {pageError}
        </div>
      )}

      <button
        className="pdt-back-button"
        type="button"
        onClick={() =>
          navigate(
            PAYMENT_DETAILS_ROUTES.payments
          )
        }
      >
        <ArrowLeft
          aria-hidden="true"
          size={19}
        />
        Back to Payments
      </button>

      <header className="pdt-page-header">
        <div>
          <div className="pdt-title-row">
            <h1 id="payment-details-title">
              Payment Details
            </h1>

            <span
              className={`pdt-status pdt-status--${statusClass}`}
            >
              {paymentStatus ===
              "Paid" ? (
                <CircleCheck
                  aria-hidden="true"
                  size={17}
                />
              ) : (
                <RotateCcw
                  aria-hidden="true"
                  size={17}
                />
              )}

              {paymentStatus}
            </span>
          </div>

          <p>
            Transaction #
            {transactionId}
          </p>
        </div>

        <div className="pdt-header-actions">
          <button
            className="pdt-button pdt-button--outline"
            type="button"
            onClick={downloadReceipt}
          >
            <Download
              aria-hidden="true"
              size={19}
            />
            Download Receipt
          </button>

          <button
            className="pdt-button pdt-button--outline"
            type="button"
            onClick={downloadInvoice}
          >
            <FileText
              aria-hidden="true"
              size={19}
            />
            Download Invoice
          </button>

          {paymentStatus ===
            "Paid" && (
            <button
              className="pdt-button pdt-button--danger"
              type="button"
              onClick={openRefundModal}
            >
              <RotateCcw
                aria-hidden="true"
                size={19}
              />
              Refund Payment
            </button>
          )}
        </div>
      </header>

      <div className="pdt-content-grid">
        <div className="pdt-left-column">
          <section
            className="pdt-card pdt-transaction-card"
            aria-labelledby="transaction-info-title"
          >
            <h2 id="transaction-info-title">
              Transaction Information
            </h2>

            <div className="pdt-transaction-summary">
              <div className="pdt-amount-block">
                <span>Amount Paid</span>

                <strong>
                  {formatCurrency(
                    amount
                  )}
                </strong>

                <small>
                  <ShieldCheck
                    aria-hidden="true"
                    size={17}
                  />
                  Payment recorded
                </small>
              </div>

              <div className="pdt-summary-item">
                <span>
                  Payment Method
                </span>
                <strong>
                  {paymentMethod}
                </strong>
              </div>

              <div className="pdt-summary-item">
                <span>Paid On</span>
                <strong>{paidOn}</strong>
              </div>
            </div>

            <dl className="pdt-information-grid">
              <div>
                <dt>Transaction ID</dt>
                <dd>
                  #{transactionId}
                </dd>
              </div>

              <div>
                <dt>
                  Payment Record ID
                </dt>
                <dd>
                  {payment.id}
                </dd>
              </div>

              <div>
                <dt>
                  Payment Provider
                </dt>
                <dd>{provider}</dd>
              </div>

              <div>
                <dt>
                  Reference Number
                </dt>
                <dd>
                  {referenceNumber}
                </dd>
              </div>

              <div>
                <dt>Booking ID</dt>
                <dd>
                  #
                  {bookingNumber(
                    payment
                  )}
                </dd>
              </div>

              <div>
                <dt>Payment Status</dt>
                <dd>
                  <span className="pdt-verified-badge">
                    <CircleCheck
                      aria-hidden="true"
                      size={15}
                    />
                    {paymentStatus}
                  </span>
                </dd>
              </div>
            </dl>

            <p className="pdt-security-line">
              <ShieldCheck
                aria-hidden="true"
                size={18}
              />
              Sensitive payment
              credentials are never
              stored.
            </p>
          </section>

          <section
            className="pdt-card"
            aria-labelledby="booking-service-title"
          >
            <h2 id="booking-service-title">
              Booking &amp; Service Details
            </h2>

            <div className="pdt-booking-grid">
              <div>
                <span>Service</span>
                <strong>
                  {serviceName}
                </strong>
              </div>

              <div>
                <span>Property</span>
                <strong>{property}</strong>
              </div>

              <div>
                <span>
                  Service Date
                </span>
                <strong>
                  {formatDate(
                    serviceDate
                  )}
                </strong>
              </div>

              <div>
                <span>Technician</span>
                <strong>
                  {technicianName}
                </strong>
              </div>

              <div>
                <span>
                  Booking Status
                </span>
                <strong className="pdt-completed-badge">
                  <CircleCheck
                    aria-hidden="true"
                    size={15}
                  />
                  {bookingStatus}
                </strong>
              </div>
            </div>
          </section>

          <section
            className="pdt-card"
            aria-labelledby="payment-activity-title"
          >
            <h2 id="payment-activity-title">
              Payment Activity
            </h2>

            <ol className="pdt-timeline">
              {activity.map((item) => (
                <li key={item.id}>
                  <span className="pdt-timeline-icon">
                    <Check
                      aria-hidden="true"
                      size={16}
                    />
                  </span>

                  <strong>
                    {item.label}
                  </strong>

                  <time>
                    {item.time}
                  </time>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside
          className="pdt-right-column"
          aria-label="Customer and payment summary"
        >
          <section
            className="pdt-card"
            aria-labelledby="customer-information-title"
          >
            <h2 id="customer-information-title">
              Customer Information
            </h2>

            <div className="pdt-customer-profile">
              <span
                className="pdt-customer-avatar"
                aria-hidden="true"
              >
                {initials(
                  customerName
                )}
              </span>

              <div>
                <strong>
                  {customerName}
                </strong>

                <span>
                  Customer ID&nbsp;&nbsp; #
                  {customerNumber(
                    payment
                  )}
                </span>
              </div>
            </div>

            <dl className="pdt-contact-list">
              <div>
                <dt>
                  <Phone
                    aria-hidden="true"
                    size={20}
                  />
                  Phone
                </dt>

                <dd>
                  {customerPhone ===
                  "Not available" ? (
                    customerPhone
                  ) : (
                    <a
                      href={`tel:${customerPhone}`}
                    >
                      {customerPhone}
                    </a>
                  )}
                </dd>
              </div>

              <div>
                <dt>
                  <Mail
                    aria-hidden="true"
                    size={20}
                  />
                  Email
                </dt>

                <dd>
                  {customerEmail ===
                  "Not available" ? (
                    customerEmail
                  ) : (
                    <a
                      href={`mailto:${customerEmail}`}
                    >
                      {customerEmail}
                    </a>
                  )}
                </dd>
              </div>

              <div>
                <dt>
                  <MapPin
                    aria-hidden="true"
                    size={20}
                  />
                  Address
                </dt>

                <dd>
                  {customerAddress}
                </dd>
              </div>
            </dl>
          </section>

          <section
            className="pdt-card"
            aria-labelledby="payment-summary-title"
          >
            <h2 id="payment-summary-title">
              Payment Summary
            </h2>

            <dl className="pdt-payment-summary">
              <div>
                <dt>Service Amount</dt>
                <dd>
                  {formatCurrency(
                    serviceAmount
                  )}
                </dd>
              </div>

              <div>
                <dt>
                  Inspection Charge
                </dt>
                <dd>
                  {formatCurrency(
                    inspectionCharge
                  )}
                </dd>
              </div>

              <div>
                <dt>
                  Convenience Fee
                </dt>
                <dd>
                  {formatCurrency(
                    convenienceFee
                  )}
                </dd>
              </div>

              {refundedAmount > 0 && (
                <div className="pdt-refunded-row">
                  <dt>
                    Refunded Amount
                  </dt>

                  <dd>
                    -
                    {formatCurrency(
                      refundedAmount
                    )}
                  </dd>
                </div>
              )}

              <div className="pdt-summary-total">
                <dt>
                  {refundedAmount > 0
                    ? "Net Paid"
                    : "Total Paid"}
                </dt>

                <dd>
                  {formatCurrency(
                    amount -
                      refundedAmount
                  )}
                </dd>
              </div>
            </dl>

            <p className="pdt-paid-note">
              <CircleCheck
                aria-hidden="true"
                size={17}
              />

              {refundedAmount > 0
                ? "Refund recorded successfully"
                : "Payment received in full"}
            </p>
          </section>

          <div
            className={`pdt-info-strip${
              refundedAmount > 0
                ? " pdt-info-strip--refunded"
                : ""
            }`}
          >
            <Info
              aria-hidden="true"
              size={20}
            />

            <span>
              {refundedAmount > 0
                ? `${formatCurrency(
                    refundedAmount
                  )} has been refunded for this transaction.`
                : "Refunds are available only for successful paid transactions."}
            </span>
          </div>
        </aside>
      </div>

      {isRefundOpen && (
        <div
          className="pdt-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeRefundModal();
            }
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
                <h2 id="refund-modal-title">
                  Refund Payment
                </h2>

                <p id="refund-modal-description">
                  Review the refund
                  details before
                  confirming.
                </p>
              </div>

              <button
                className="pdt-icon-button"
                type="button"
                ref={closeButtonRef}
                onClick={
                  closeRefundModal
                }
                disabled={
                  isProcessingRefund
                }
                aria-label="Close refund dialog"
              >
                <X
                  aria-hidden="true"
                  size={21}
                />
              </button>
            </header>

            <div className="pdt-refund-summary">
              <span className="pdt-refund-icon">
                <ReceiptIndianRupee
                  aria-hidden="true"
                  size={23}
                />
              </span>

              <span>
                <strong>
                  #{transactionId}
                </strong>

                <small>
                  {customerName} •{" "}
                  {serviceName}
                </small>
              </span>

              <strong>
                {formatCurrency(
                  amount
                )}
              </strong>
            </div>

            <form
              className="pdt-refund-form"
              onSubmit={submitRefund}
              noValidate
            >
              <div className="pdt-field">
                <label htmlFor="refund-amount">
                  Refund Amount
                </label>

                <div className="pdt-amount-input">
                  <span>₹</span>

                  <input
                    id="refund-amount"
                    type="number"
                    name="amount"
                    min="1"
                    max={amount}
                    step="0.01"
                    value={
                      refundForm.amount
                    }
                    readOnly
                    aria-invalid={Boolean(
                      refundErrors.amount
                    )}
                    aria-describedby={
                      refundErrors.amount
                        ? "refund-amount-error"
                        : undefined
                    }
                  />
                </div>

                {refundErrors.amount && (
                  <small
                    className="pdt-field-error"
                    id="refund-amount-error"
                  >
                    {
                      refundErrors.amount
                    }
                  </small>
                )}
              </div>

              <div className="pdt-field">
                <label htmlFor="refund-reason">
                  Refund Reason
                </label>

                <select
                  id="refund-reason"
                  name="reason"
                  value={
                    refundForm.reason
                  }
                  onChange={
                    handleRefundChange
                  }
                  aria-invalid={Boolean(
                    refundErrors.reason
                  )}
                  aria-describedby={
                    refundErrors.reason
                      ? "refund-reason-error"
                      : undefined
                  }
                >
                  <option value="">
                    Select a reason
                  </option>

                  {REFUND_REASONS.map(
                    (reason) => (
                      <option
                        value={reason}
                        key={reason}
                      >
                        {reason}
                      </option>
                    )
                  )}
                </select>

                {refundErrors.reason && (
                  <small
                    className="pdt-field-error"
                    id="refund-reason-error"
                  >
                    {
                      refundErrors.reason
                    }
                  </small>
                )}
              </div>

              <div className="pdt-field">
                <label htmlFor="refund-note">
                  Internal Note
                  (optional)
                </label>

                <textarea
                  id="refund-note"
                  name="note"
                  rows="3"
                  value={refundForm.note}
                  onChange={
                    handleRefundChange
                  }
                  placeholder="Add a note for the payment record"
                />
              </div>

              <div className="pdt-refund-warning">
                <Info
                  aria-hidden="true"
                  size={18}
                />
                This performs a full refund
                in the PCMS payment record.
                Actual bank reversal requires
                a real payment-gateway
                integration.
              </div>

              {refundErrors.submit && (
                <div
                  className="pdt-refund-submit-error"
                  role="alert"
                >
                  <AlertCircle
                    aria-hidden="true"
                    size={18}
                  />
                  {
                    refundErrors.submit
                  }
                </div>
              )}

              <div className="pdt-modal-actions">
                <button
                  className="pdt-button pdt-button--outline"
                  type="button"
                  onClick={
                    closeRefundModal
                  }
                  disabled={
                    isProcessingRefund
                  }
                >
                  Cancel
                </button>

                <button
                  className="pdt-button pdt-button--danger-solid"
                  type="submit"
                  disabled={
                    isProcessingRefund
                  }
                >
                  {isProcessingRefund ? (
                    <>
                      <span
                        className="pdt-spinner"
                        aria-hidden="true"
                      />
                      Processing…
                    </>
                  ) : (
                    <>
                      <RotateCcw
                        aria-hidden="true"
                        size={18}
                      />
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