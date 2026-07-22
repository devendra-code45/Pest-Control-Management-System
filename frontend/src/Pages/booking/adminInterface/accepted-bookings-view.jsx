import React from "react";
import { useNavigate } from "react-router-dom";
import {
    ChevronRight,
    ArrowLeft,
    Printer,
    CheckCircle2,
    Flag,
    MapPin,
    Calendar,
    CheckCircle,
    User,
    Phone,
    Building2,
    Bug,
    Clock,
    UserCheck,
    StickyNote,
} from "lucide-react";
import "./accepted-bookings-view.css";

const booking = {
    id: "BK-2025-0142",
    status: "Assigned",
    bookedOn: "18 May 2025, 09:15 AM",
    acceptedOn: "19 May 2025, 10:30 AM",
    priority: "High",
};

const customer = {
    name: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul.sharma@gmail.com",
    address: "Pune, Maharashtra - 411057",
};

const property = {
    name: "Green Valley Apartments",
    type: "Residential Apartment",
    address: "Green Valley Apartments, Building A, Pune, Maharashtra - 411057",
};

const service = {
    pestType: "Cockroach",
    serviceType: "General Pest Control",
    description: "General pest control treatment for kitchen and surrounding areas.",
    amount: "2,500",
    paymentStatus: "Paid",
};

const schedule = {
    date: "22 May 2025",
    time: "10:00 AM - 12:00 PM",
    duration: "2 Hours",
    frequency: "One Time Service",
    timeSlot: "Morning",
};

const technician = {
    name: "Amit Sharma",
    id: "TC-1008",
    phone: "9876543210",
    experience: "5+ Years",
    specialization: "General Pest Control, Termite Treatment",
};

const notes = {
    service: "Severe infestation reported in kitchen area. Customer requested immediate treatment.",
    customer: "Please ensure kitchen cabinets and sink area are treated thoroughly.",
};

const timeline = [
    {
        title: "Booking Created",
        date: "18 May 2025, 09:15 AM",
        by: "By Customer",
    },
    {
        title: "Booking Accepted",
        date: "19 May 2025, 10:30 AM",
        by: "By Admin",
    },
    {
        title: "Technician Assigned",
        date: "19 May 2025, 11:00 AM",
        by: "By Admin",
    },
];

const InfoRow = ({ label, value }) => (
    <div className="bd-info-row">
        <span className="bd-info-label">{label}</span>
        <span className="bd-info-colon">:</span>
        <span className="bd-info-value">{value}</span>
    </div>
);

export default function BookingDetails() {
    const navigate = useNavigate();
    return (
        <div className="bd-page">
            <nav className="bd-breadcrumb" aria-label="Breadcrumb">
                    Admin
                <ChevronRight size={14} className="bd-breadcrumb-sep" />
                    Bookings
                <ChevronRight size={14} className="bd-breadcrumb-sep" />
                    Accepted Bookings
                <ChevronRight size={14} className="bd-breadcrumb-sep" />
                <span className="bd-breadcrumb-current">Booking Details</span>
            </nav>

            <header className="bd-header">
                <button type="button" className="bd-btn bd-btn-outline" onClick={() => navigate("/admin/bookings/accepted")}>
                    <ArrowLeft size={16} strokeWidth={2} />
                    Back to Accepted Bookings
                </button>
                <button type="button" className="bd-btn bd-btn-outline">
                    <Printer size={16} strokeWidth={2} />
                    Print
                </button>
            </header>

            <section className="bd-summary-card">
                <div className="bd-summary-left">
                    <span className="bd-summary-icon">
                        <CheckCircle2 size={28} strokeWidth={2} />
                    </span>
                    <div className="bd-summary-text">
                        <span className="bd-summary-label">Booking ID</span>
                        <div className="bd-summary-id-row">
                            <span className="bd-summary-id">{booking.id}</span>
                            <span className="bd-badge bd-badge-success">{booking.status}</span>
                        </div>
                        <div className="bd-summary-meta">
                            <span className="bd-summary-meta-item">
                                <Calendar size={14} strokeWidth={2} />
                                Booked on: {booking.bookedOn}
                            </span>
                            <span className="bd-summary-meta-item">
                                <CheckCircle size={14} strokeWidth={2} />
                                Accepted on: {booking.acceptedOn}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bd-summary-right">
                    <div className="bd-summary-stat">
                        <span className="bd-summary-stat-icon bd-stat-icon-danger">
                            <Flag size={16} strokeWidth={2} />
                        </span>
                        <div className="bd-summary-stat-text">
                            <span className="bd-summary-stat-label">Priority</span>
                            <span className="bd-badge bd-badge-danger">{booking.priority}</span>
                        </div>
                    </div>

                    <div className="bd-summary-stat">
                        <span className="bd-summary-stat-icon bd-stat-icon-accent">
                            <MapPin size={16} strokeWidth={2} />
                        </span>
                        <div className="bd-summary-stat-text">
                            <span className="bd-summary-stat-label">Status</span>
                            <span className="bd-badge bd-badge-success">{booking.status}</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bd-grid">
                <div className="bd-card">
                    <div className="bd-card-header">
                        <span className="bd-card-header-icon">
                            <User size={18} strokeWidth={2} />
                        </span>
                        <h2 className="bd-card-title">Customer Information</h2>
                    </div>
                    <div className="bd-info-list">
                        <InfoRow label="Customer Name" value={customer.name} />
                        <InfoRow
                            label="Phone Number"
                            value={
                                <span className="bd-value-with-icon">
                                    {customer.phone}
                                    <Phone size={13} strokeWidth={2} className="bd-value-icon" />
                                </span>
                            }
                        />
                        <InfoRow label="Email Address" value={customer.email} />
                        <InfoRow label="Address" value={customer.address} />
                    </div>
                </div>

                <div className="bd-card">
                    <div className="bd-card-header">
                        <span className="bd-card-header-icon">
                            <Building2 size={18} strokeWidth={2} />
                        </span>
                        <h2 className="bd-card-title">Property Information</h2>
                    </div>
                    <div className="bd-info-list">
                        <InfoRow label="Property Name" value={property.name} />
                        <InfoRow label="Property Type" value={property.type} />
                        <InfoRow label="Property Address" value={property.address} />
                    </div>
                </div>

                <div className="bd-card">
                    <div className="bd-card-header">
                        <span className="bd-card-header-icon">
                            <Bug size={18} strokeWidth={2} />
                        </span>
                        <h2 className="bd-card-title">Service Information</h2>
                    </div>
                    <div className="bd-info-list">
                        <InfoRow label="Pest Type" value={service.pestType} />
                        <InfoRow label="Service Type" value={service.serviceType} />
                        <InfoRow label="Description" value={service.description} />
                        <InfoRow label="Service Amount" value={`₹ ${service.amount}`} />
                        <InfoRow
                            label="Payment Status"
                            value={<span className="bd-badge bd-badge-success">{service.paymentStatus}</span>}
                        />
                    </div>
                </div>

                <div className="bd-card">
                    <div className="bd-card-header">
                        <span className="bd-card-header-icon">
                            <Calendar size={18} strokeWidth={2} />
                        </span>
                        <h2 className="bd-card-title">Schedule Information</h2>
                    </div>
                    <div className="bd-info-list">
                        <InfoRow label="Scheduled Date" value={schedule.date} />
                        <InfoRow label="Scheduled Time" value={schedule.time} />
                        <InfoRow label="Estimated Duration" value={schedule.duration} />
                        <InfoRow label="Service Frequency" value={schedule.frequency} />
                        <InfoRow label="Preferred Time Slot" value={schedule.timeSlot} />
                    </div>
                </div>

                <div className="bd-card">
                    <div className="bd-card-header">
                        <span className="bd-card-header-icon">
                            <UserCheck size={18} strokeWidth={2} />
                        </span>
                        <h2 className="bd-card-title">Assigned Technician</h2>
                    </div>

                    <div className="bd-technician-block">
                        <span className="bd-technician-avatar">
                            <User size={32} strokeWidth={1.5} />
                        </span>
                        <div className="bd-technician-text">
                            <span className="bd-technician-name">{technician.name}</span>
                            <span className="bd-badge bd-badge-success bd-technician-id">{technician.id}</span>
                            <span className="bd-technician-phone">
                                <Phone size={13} strokeWidth={2} />
                                {technician.phone}
                            </span>
                        </div>
                    </div>

                    <div className="bd-info-list bd-info-list-divided">
                        <InfoRow label="Experience" value={technician.experience} />
                        <InfoRow label="Specialization" value={technician.specialization} />
                    </div>
                </div>

                <div className="bd-card">
                    <div className="bd-card-header">
                        <span className="bd-card-header-icon">
                            <StickyNote size={18} strokeWidth={2} />
                        </span>
                        <h2 className="bd-card-title">Notes</h2>
                    </div>
                    <div className="bd-info-list bd-notes-list">
                        <InfoRow label="Service Notes" value={notes.service} />
                        <InfoRow label="Customer Notes" value={notes.customer} />
                    </div>
                </div>
            </section>

            <section className="bd-card bd-timeline-card">
                <div className="bd-card-header">
                    <span className="bd-card-header-icon">
                        <Clock size={18} strokeWidth={2} />
                    </span>
                    <h2 className="bd-card-title">Booking Timeline</h2>
                </div>

                <div className="bd-timeline">
                    {timeline.map((step, index) => (
                        <React.Fragment key={step.title}>
                            <div className="bd-timeline-step">
                                <span className="bd-timeline-dot">
                                    <CheckCircle size={16} strokeWidth={2} />
                                </span>
                                <span className="bd-timeline-title">{step.title}</span>
                                <span className="bd-timeline-date">{step.date}</span>
                                <span className="bd-timeline-by">{step.by}</span>
                            </div>
                            {index < timeline.length - 1 && <span className="bd-timeline-connector" />}
                        </React.Fragment>
                    ))}
                </div>
            </section>
        </div>
    );
}