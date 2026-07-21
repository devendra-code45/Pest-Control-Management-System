import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import Dashboard from "../Pages/dashboard/Dashboard";

import AddCustomer from "../Pages/customer/add-customer";
import EditCustomer from "../Pages/customer/edit-customer";
import CustomerDetails from "../Pages/customer/customer-details";

import CreateBooking from "../Pages/booking/Create-Booking";
import BookingDetails from "../Pages/booking/Booking-details";
import Booking from "../Pages/booking/Booking";
import EditBooking from "../Pages/booking/Edit-Booking";

import NewComplaint from "../Pages/complaint/newcomplaint";
import ComplaintManagement from "../Pages/complaint/complaintmanagement";
import TechnicianManagement from "../Pages/technician/technicianmanagement";
import AddTechnician from "../Pages/technician/addtechnician";
import AssignTechnician from "../Pages/technician/assigntechnician";
import EditTechnician from "../Pages/technician/edittechnicianprofile";
import TechnicianProfile from "../Pages/technician/technicianprofile";

import AddService from "../Pages/service/add-service";
import EditService from "../Pages/service/edit-service";
import ServiceDetails from "../Pages/service/service-details";
import Services from "../Pages/service/services";

import Payment from "../Pages/Payments/Payments";
import CreatePayment from "../pages/Payments/CreatePayments";
import Invoice from "../Pages/Payments/invoice";
import PaymentDetail from "../pages/Payments/PaymentsDetail";

import Login from "../Pages/login/Login";
import Profile from '../Pages/profile/profile';
import Reports from "../Pages/reports/Reports";

import Registration from "../Pages/login/Registration";
import ChangePassword from "../Pages/login/ChangePassword";
import ForgotPassword from "../Pages/login/ForgotPassword";

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
            <Route element={<DashboardLayout />}>

              <Route path="/admin/dashboard" element={<Dashboard />} />

              <Route path="/admin/customers" element={<CustomerDetails />} />
              <Route path="/admin/customers/add" element={<AddCustomer />} />
              <Route path="/admin/customers/edit" element={<EditCustomer />} />

              <Route path="/admin/bookings" element={<Booking />} />
              <Route path="/admin/bookings/pending" element={<Booking />} />
              <Route path="/admin/bookings/details" element={<BookingDetails />} />
              <Route path="/admin/bookings/edit" element={<EditBooking />} />
              <Route path="/admin/bookings/assign-technician" element={<AssignTechnician />} />

              <Route path="/admin/technicians" element={<TechnicianManagement />} />
              <Route path="/admin/technicians/add" element={<AddTechnician />} />
              <Route path="/admin/technicians/edit" element={<EditTechnician />} />
              <Route path="/admin/technicians/profile" element={<TechnicianProfile />} />

              <Route path="/admin/services" element={<Services />} />
              <Route path="/admin/services/add" element={<AddService />} />
              <Route path="/admin/services/edit" element={<EditService />} />
              <Route path="/admin/services/details" element={<ServiceDetails />} />

              <Route path="/admin/complaints" element={<ComplaintManagement />} />

              <Route path="/admin/payments" element={<Payment />} />
              <Route path="/admin/payments/create" element={<CreatePayment />} />
              <Route path="/admin/payments/invoice" element={<Invoice />} />
              <Route path="/admin/payments/details" element={<PaymentDetail />} />

              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/profile" element={<Profile />} />
              <Route path="*" element={<h1>404 - Page Not Found</h1>} />

            </Route>
          </Route>
          <Route element={<ProtectedRoute allowedRole="CUSTOMER" />}>
            <Route element={<DashboardLayout />}>

              <Route path="/customer/dashboard" element={<Dashboard />} />

              <Route path="/customer/create-booking" element={<CreateBooking />} />
              <Route path="/customer/bookings" element={<Booking />} />
              <Route path="/customer/bookings/details" element={<BookingDetails />} />

              <Route path="/customer/services" element={<Services />} />

              <Route path="/customer/complaints" element={<NewComplaint />} />

              <Route path="/customer/payments" element={<Payment />} />
              <Route path="/customer/payments/invoice" element={<Invoice />} />

              <Route path="/customer/profile" element={<Profile />} />
              <Route path="*" element={<h1>404 - Page Not Found</h1>} />

            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;