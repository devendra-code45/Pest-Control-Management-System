import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import Dashboard from "../Pages/dashboard/Dashboard";

import AddCustomer from "../Pages/customer/add-customer";
import EditCustomer from "../Pages/customer/edit-customer";
import CustomerList from "../Pages/customer/customer-list";
import CustomerDetails from "../Pages/customer/customer-details";

import CreateBooking from "../Pages/booking/Create-Booking";
import BookingDetails from "../Pages/booking/Booking-details";
import BookingCalendar from "../Pages/booking/Booking-Calendar";
import Booking from "../Pages/booking/Booking";

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
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />

          <Route path="/add-customer" element={<AddCustomer />} />
          <Route path="/edit-customer" element={<EditCustomer />} />
          <Route path="/customer-details" element={<CustomerDetails />} />
          <Route path="/customer-list" element={<CustomerList />} />

          <Route path="/create-booking" element={<CreateBooking />} />
          <Route path="/booking-details" element={<BookingDetails />} />
          <Route path="/booking-calendar" element={<BookingCalendar />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;