import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import Dashboard from "../Pages/dashboard/Dashboard";

import AddCustomer from "../Pages/customer/add-customer";

import NewComplaint from "../Pages/complaint/newcomplaint";
import ComplaintManagement from "../Pages/complaint/complaintmanagement";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-customer" element={<AddCustomer />} />
          <Route path="/new-complaint" element={<NewComplaint />} />
          <Route path="/complaint" element={<ComplaintManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;