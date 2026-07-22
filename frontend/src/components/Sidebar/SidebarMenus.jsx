import {
    Sprout,
    Users,
    Calendar,
    CalendarPlus,
    ClipboardList,
    UserCog,
    UserCheck,
    MessageSquare,
    CreditCard,
    BarChart3,
    User,
    LogOut,
    Lock,
    Eye,
} from "lucide-react";

export const ADMIN_NAV_GROUPS = [
    {
        label: "MAIN",
        items: [
            {
                key: "dashboard",
                label: "Dashboard",
                icon: Sprout,
                path: "/admin/dashboard",
            },
        ],
    },

    {
        label: "OPERATIONS",
        items: [
            {
                key: "customers",
                label: "Customers",
                icon: Users,
                children: [
                    {
                        key: "customers",
                        label: "Customers",
                        icon: Eye,
                        path: "/admin/customer-details",
                    },
                ],
            },

            {
                key: "bookings",
                label: "Bookings",
                icon: Calendar,
                children: [
                    {
                        key: "pending",
                        label: "Pending Bookings",
                        icon: ClipboardList,
                        path: "/admin/bookings/pending",
                    },
                    {
                        key: "accepted",
                        label: "Accepted Bookings",
                        icon: ClipboardList,
                        path: "/admin/bookings/accepted",
                    },
                    {
                        key: "rejected",
                        label: "Rejected Bookings",
                        icon: ClipboardList,
                        path: "/admin/bookings/rejected",
                    },
                    {
                        key: "assign-tech",
                        label: "Assign Technician",
                        icon: UserCheck,
                        path: "/admin/bookings/assign-technician",
                    },
                ],
            },

            {
                key: "services",
                label: "Services",
                icon: CalendarPlus,
                path: "/admin/services",
            },

            {
                key: "technicians",
                label: "Technicians",
                icon: UserCog,
                path: "/admin/bookings/assign-technician",
            },

            {
                key: "complaints",
                label: "Complaints",
                icon: MessageSquare,
                path: "/admin/complaints",
            },
        ],
    },

    {
        label: "FINANCE",
        items: [
            {
                key: "payments",
                label: "Payments",
                icon: CreditCard,
                path: "/admin/payments",
            },

            {
                key: "reports",
                label: "Reports",
                icon: BarChart3,
                path: "/admin/reports",
            },
        ],
    },

    {
        label: "ACCOUNT",
        items: [
            {
                key: "profile",
                label: "Profile",
                icon: User,
                path: "/admin/profile",
            },

            {
                key: "change-password",
                label: "Change Password",
                icon: Lock,
                path: "/change-password",
            },

            {
                key: "logout",
                label: "Logout",
                icon: LogOut,
            },
        ],
    },
];

export const CUSTOMER_NAV_GROUPS = [
    {
        label: "MAIN",
        items: [
            {
                key: "dashboard",
                label: "Dashboard",
                icon: Sprout,
                path: "/customer/dashboard",
            },
        ],
    },

    {
        label: "SERVICES",
        items: [
            {
                key: "services",
                label: "Available Services",
                icon: ClipboardList,
                path: "/customer/services",
            },
            {
                key: "book-service",
                label: "Book Service",
                icon: CalendarPlus,
                path: "/customer/create-booking",
            },
            {
                key: "my-bookings",
                label: "My Bookings",
                icon: Calendar,
                path: "/customer/bookings",
            },
            {
                key: "payments",
                label: "Payments",
                icon: CreditCard,
                path: "/customer/payments",
            },
            {
                key: "complaints",
                label: "Complaints",
                icon: MessageSquare,
                path: "/customer/complaints",
            },
        ],
    },

    {
        label: "ACCOUNT",
        items: [
            {
                key: "profile",
                label: "Profile",
                icon: User,
                path: "/customer/profile",
            },
            {
                key: "change-password",
                label: "Change Password",
                icon: Lock,
                path: "/change-password",
            },
            {
                key: "logout",
                label: "Logout",
                icon: LogOut,
            },
        ],
    },
];