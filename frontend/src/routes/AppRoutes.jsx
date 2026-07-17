import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import Dashboard from "../Pages/dashboard/Dashboard";

import AddCustomer from "../Pages/customer/add-customer";
import EditCustomer from "../Pages/customer/edit-customer";
import CustomerList from "../Pages/customer/customer-list";
import CustomerDetails from "../Pages/customer/customer-details";

import NewComplaint from "../Pages/complaint/newcomplaint";
import ComplaintManagement from "../Pages/complaint/complaintmanagement";
import TechnicianManagement from "../Pages/technician/technicianmanagement";
import AddTechnician from "../Pages/technician/addtechnician";
import AssignTechnician from "../Pages/technician/assigntechnician";
import EditTechnician from "../Pages/technician/edittechnicianprofile";
import TechnicianProfile from "../Pages/technician/technicianprofile";

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

          <Route path="/new-complaint" element={<NewComplaint />} />
          <Route path="/complaint" element={<ComplaintManagement />} />

          <Route path="/technician-management" element={<TechnicianManagement />} />
          <Route path="/add-technician" element={<AddTechnician />} />
          <Route path="/assign-technician" element={<AssignTechnician />} />
          <Route path="/edit-technician" element={<EditTechnician />} />
          <Route path="/technician-profile" element={<TechnicianProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;