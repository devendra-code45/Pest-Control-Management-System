import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

// Layout
import DashboardLayout from "../components/DashboardLayout/DashboardLayout";

// Authentication pages
import Login from "../Pages/login/Login";
import Registration from "../Pages/login/Registration";
import ForgotPassword from "../Pages/login/ForgotPassword";
import VerifyEmail from "../Pages/login/VerifyEmail";
import ResetPassword from "../Pages/login/resetPassword";
import ChangePassword from "../Pages/login/ChangePassword";

// Dashboards
import Dashboard from "../Pages/dashboard/Dashboard";
import CustomerDashboard from "../Pages/dashboard/CustomerDashboard";

// Booking management
import CreateBooking from "../Pages/booking/Create-Booking";
import BookingDetails from "../Pages/booking/Booking-details";
import EditBooking from "../Pages/booking/Edit-Booking";
import MyBookings from "../Pages/booking/MyBookings";

import PendingBooking from "../Pages/booking/adminInterface/PendingBookings";
import AcceptedBookings from "../Pages/booking/adminInterface/accepted-bookings";
import ViewAcceptedBookings from "../Pages/booking/adminInterface/accepted-bookings-view";
import RBPage from "../Pages/booking/adminInterface/RBPage";
import RejectBookingPage from "../Pages/booking/adminInterface/rejected-bookings";
import ViewRejectedBooking from "../Pages/booking/adminInterface/RBView";

// Complaints
import ComplaintManagement from "../Pages/complaint/ViewComplaintDetails";
import CustomerComplaints from "../Pages/complaint/CustomerComplaints";

// Technicians
import TechnicianManagement from "../Pages/technician/technicianmanagement";
import AddTechnician from "../Pages/technician/addtechnician";
import AssignTechnician from "../Pages/technician/assigntechnician";
import EditTechnician from "../Pages/technician/edittechnicianprofile";
import TechnicianProfile from "../Pages/technician/technicianprofile";

// Services
import AddService from "../Pages/service/add-service";
import EditService from "../Pages/service/edit-service";
import ServiceDetails from "../Pages/service/service-details";
import Services from "../Pages/service/services";
import AvailableServices from "../Pages/service/AvailableServices";

// Payments
import CreatePayment from "../Pages/Payments/CreatePayments";
import Invoice from "../Pages/Payments/invoice";
import PaymentDetails from "../Pages/Payments/PaymentDetails";
import CustomerPayment from "../Pages/Payments/CustomerPayments";
import AdminPayment from "../Pages/Payments/AdminPayments";

// Profiles and reports
import Profile from "../Pages/profile/profile";
import CustomerProfile from "../Pages/profile/CostomerProfile";
import EditCustomerProfile from "../Pages/profile/EditCustomerProfile";
import Reports from "../Pages/reports/Reports";

// Support
import CustomerContactSupport from "../Pages/login/CustomerContactSupport";

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}

          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Registration />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/verify-otp"
            element={<VerifyEmail />}
          />

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />

          {/* ================= ADMIN ROUTES ================= */}

          <Route
            element={
              <ProtectedRoute allowedRole="ADMIN" />
            }
          >
            <Route element={<DashboardLayout />}>
              <Route
                path="/admin"
                element={
                  <Navigate
                    to="/admin/dashboard"
                    replace
                  />
                }
              />

              <Route
                path="/admin/dashboard"
                element={<Dashboard />}
              />

              {/* Admin bookings */}

              <Route
                path="/admin/bookings"
                element={<PendingBooking />}
              />

              <Route
                path="/admin/bookings/pending"
                element={<PendingBooking />}
              />

              <Route
                path="/admin/bookings/accepted"
                element={<AcceptedBookings />}
              />

              <Route
                path="/admin/bookings/assigned-bookings-view"
                element={<ViewAcceptedBookings />}
              />

              <Route
                path="/admin/bookings/rejection-reason"
                element={<RBPage />}
              />

              <Route
                path="/admin/bookings/rejected"
                element={<RejectBookingPage />}
              />

              <Route
                path="/admin/bookings/details"
                element={<BookingDetails />}
              />

              <Route
                path="/admin/bookings/:bookingId"
                element={<BookingDetails />}
              />

              <Route
                path="/admin/bookings/edit"
                element={<EditBooking />}
              />

              <Route
                path="/admin/bookings/assign-technician"
                element={<AssignTechnician />}
              />

              <Route
                path="/admin/bookings/rejected-bookings/view"
                element={<ViewRejectedBooking />}
              />

              {/* Admin technicians */}

              <Route
                path="/admin/technicians"
                element={<TechnicianManagement />}
              />

              <Route
                path="/admin/technicians/add"
                element={<AddTechnician />}
              />

              <Route
                path="/admin/technicians/edit"
                element={<EditTechnician />}
              />

              <Route
                path="/admin/technicians/profile"
                element={<TechnicianProfile />}
              />

              {/* Admin services */}

              <Route
                path="/admin/services"
                element={<Services />}
              />

              <Route
                path="/admin/services/add"
                element={<AddService />}
              />

              <Route
                path="/admin/services/edit"
                element={<EditService />}
              />

              <Route
                path="/admin/services/details"
                element={<ServiceDetails />}
              />

              {/* Admin complaints */}

              <Route
                path="/admin/complaints"
                element={<ComplaintManagement />}
              />

              {/* Admin payments */}

              <Route
                path="/admin/payments"
                element={<AdminPayment />}
              />

              <Route
                path="/admin/payments/create"
                element={<CreatePayment />}
              />

              <Route
                path="/admin/payments/invoice"
                element={<Invoice />}
              />

              <Route
                path="/admin/payments/details"
                element={<PaymentDetails />}
              />

              {/* Admin reports and account */}

              <Route
                path="/admin/reports"
                element={<Reports />}
              />

              <Route
                path="/admin/profile"
                element={<Profile />}
              />

              <Route
                path="/admin/change-password"
                element={<ChangePassword />}
              />
            </Route>
          </Route>

          {/* ================= CUSTOMER ROUTES ================= */}

          <Route
            element={
              <ProtectedRoute allowedRole="CUSTOMER" />
            }
          >
            <Route element={<DashboardLayout />}>
              <Route
                path="/customer"
                element={
                  <Navigate
                    to="/customer/dashboard"
                    replace
                  />
                }
              />

              <Route
                path="/customer/dashboard"
                element={<CustomerDashboard />}
              />

              {/* Customer services */}

              <Route
                path="/customer/services"
                element={<AvailableServices />}
              />

              {/* Customer bookings */}

              <Route
                path="/customer/create-booking"
                element={<CreateBooking />}
              />

              <Route
                path="/customer/bookings"
                element={<MyBookings />}
              />

              <Route
                path="/customer/bookings/details"
                element={<BookingDetails />}
              />

              <Route
                path="/customer/bookings/:bookingId"
                element={<BookingDetails />}
              />

              {/* Customer complaints */}

              <Route
                path="/customer/complaints"
                element={<CustomerComplaints />}
              />

              <Route
                path="/customer/complaints/view-details"
                element={<ComplaintManagement />}
              />

              {/* Customer payments */}

              <Route
                path="/customer/payments"
                element={<CustomerPayment />}
              />

              <Route
                path="/customer/payments/invoice"
                element={<Invoice />}
              />

              {/* Customer account */}

              <Route
                path="/customer/profile"
                element={<CustomerProfile />}
              />

              <Route
                path="/customer/profile/edit-profile"
                element={<EditCustomerProfile />}
              />

              <Route
                path="/customer/change-password"
                element={<ChangePassword />}
              />

              <Route
                path="/customer/contact-support"
                element={<CustomerContactSupport />}
              />
            </Route>
          </Route>

          {/* ================= 404 ROUTE ================= */}

          <Route
            path="*"
            element={
              <div
                style={{
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                <h1>404 - Page Not Found</h1>

                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                >
                  Go to Login
                </button>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;