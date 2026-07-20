import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
import Registration from "../Pages/login/Registration";
import ChangePassword from "../Pages/login/ChangePassword";
import ForgotPassword from "../Pages/login/ForgotPassword";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/add-customer" element={<AddCustomer />} />
          <Route path="/edit-customer" element={<EditCustomer />} />
          <Route path="/customer-details" element={<CustomerDetails />} />

          <Route path="/create-booking" element={<CreateBooking />} />
          <Route path="/booking-details" element={<BookingDetails />} />
          <Route path="/edit-booking" element={<EditBooking />} />
          <Route path="/booking" element={<Booking />} />

          <Route path="/new-complaint" element={<NewComplaint />} />
          <Route path="/complaint" element={<ComplaintManagement />} />

          <Route path="/technician-management" element={<TechnicianManagement />} />
          <Route path="/technician/add-technician" element={<AddTechnician />} />
          <Route path="/assign-technician" element={<AssignTechnician />} />
          <Route path="/edit-technician" element={<EditTechnician />} />
          <Route path="/technician-profile" element={<TechnicianProfile />} />

          <Route path="/add-service" element={<AddService />} />
          <Route path="/edit-service" element={<EditService />} />
          <Route path="/service-details" element={<ServiceDetails />} />
          <Route path="/services" element={<Services />} />

          <Route path="/payments" element={<Payment />} />
          <Route path="/create-payment" element={<CreatePayment />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/payments-details" element={<PaymentDetail />} />


          <Route path="/*" element={<h1>404 - Page Not Found</h1>} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;