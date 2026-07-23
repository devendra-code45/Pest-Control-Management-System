import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import Dashboard from "../Pages/dashboard/Dashboard";
import CustomerDashboard from "../Pages/dashboard/CustomerDashboard";

// Customer management
import AddCustomer from "../Pages/customer/add-customer";
import EditCustomer from "../Pages/customer/edit-customer";
import CustomerDetails from "../Pages/customer/customer-details";

// Booking management
import CreateBooking from "../Pages/booking/Create-Booking";
import BookingDetails from "../Pages/booking/Booking-details";
import PendingBooking from "../Pages/booking/adminInterface/PendingBookings";
import EditBooking from "../Pages/booking/Edit-Booking";
import AcceptedBookings from "../Pages/booking/adminInterface/accepted-bookings";
import RBPage from "../Pages/booking/adminInterface/RBPage";
import ViewAcceptedBookings from "../pages/booking/adminInterface/accepted-bookings-view"
import RejectBookingPage from "../Pages/booking/adminInterface/rejected-bookings";
import ViewRejectedBooking from "../Pages/booking/adminInterface/RBView";

// Complaints
import NewComplaint from "../Pages/complaint/newcomplaint";
import ComplaintManagement from "../Pages/complaint/complaintmanagement";

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

// Payments
import Payment from "../Pages/Payments/Payments";
import CreatePayment from "../Pages/Payments/CreatePayments";
import Invoice from "../Pages/Payments/invoice";
import PaymentDetail from "../pages/Payments/PaymentsDetail";
import CustomerPayment from "../Pages/Payments/CustomerPayments";


// Other pages
import Login from "../Pages/login/Login";
import Registration from "../Pages/login/Registration";
import ChangePassword from "../Pages/login/ChangePassword";
import ForgotPassword from "../Pages/login/ForgotPassword";
import Profile from "../Pages/profile/profile";
import Reports from "../Pages/reports/Reports";

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          {/* Admin routes */}
          <Route
            element={<ProtectedRoute allowedRole="ADMIN" />}
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

              <Route path="/admin/dashboard" element={<Dashboard />} />

              {/* Customers */}
              <Route path="/admin/customer-details" element={<CustomerDetails />} />

              <Route path="/admin/customers/add" element={<AddCustomer />} />

              <Route path="/admin/customers/edit" element={<EditCustomer />} />

              {/* Bookings */}
              <Route path="/admin/bookings" element={<PendingBooking />} />

              <Route path="/admin/bookings/pending" element={<PendingBooking />} />

              <Route path="/admin/bookings/accepted" element={<AcceptedBookings />} />

              <Route path="/admin/bookings/assigned-bookings-view" element={<ViewAcceptedBookings />} />

              <Route path="/admin/bookings/rejection-reason" element={<RBPage />} />

              <Route path="/admin/bookings/rejected" element={<RejectBookingPage />} />

              <Route path="/admin/bookings/details" element={<BookingDetails />} />

              <Route path="/admin/bookings/edit" element={<EditBooking />} />

              <Route path="/admin/bookings/assign-technician" element={<AssignTechnician />} />

              <Route path="/admin/bookings/rejected-bookings/view" element={<ViewRejectedBooking />} />

              {/* Technicians */}
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

              {/* Services */}
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

              {/* Complaints */}
              <Route
                path="/admin/complaints"
                element={<ComplaintManagement />}
              />

              {/* Payments */}
              <Route
                path="/admin/payments"
                element={<Payment />}
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
                element={<PaymentDetail />}
              />

              {/* Reports and account */}
              <Route
                path="/admin/reports"
                element={<Reports />}
              />

              <Route
                path="/admin/profile"
                element={<Profile />}
              />

              <Route
                path="/change-password"
                element={<ChangePassword />}
              />
            </Route>
          </Route>

          {/* Customer routes */}
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
                element={<Dashboard />}
              />
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              {/* Services and bookings */}
              <Route
                path="/customer/services"
                element={<ServiceDetails />}
              />

              <Route
                path="/customer/create-booking"
                element={<CreateBooking />}
              />

              <Route
                path="/customer/bookings"
                element={<PendingBooking />}
              />

              <Route
                path="/customer/bookings/details"
                element={<BookingDetails />}
              />

              <Route path="/customer/payments" element={<CustomerPayment />} />
              <Route path="/customer/payments/invoice" element={<Invoice />} />
              {/* Complaints */}
              <Route
                path="/customer/complaints"
                element={<NewComplaint />}
              />

              {/* Payments */}
              <Route
                path="/customer/payments"
                element={<Payment />}
              />

              <Route
                path="/customer/payments/invoice"
                element={<Invoice />}
              />

              {/* Account */}
              <Route
                path="/customer/profile"
                element={<Profile />}
              />

              <Route
                path="/change-password"
                element={<ChangePassword />}
              />
            </Route>
          </Route>

          {/* Global 404 */}
          <Route
            path="*"
            element={<h1>404 - Page Not Found</h1>}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;