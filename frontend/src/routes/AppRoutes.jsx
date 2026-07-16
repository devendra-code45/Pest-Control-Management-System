import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import Dashboard from "../Pages/dashboard/Dashboard";

import AddCustomer from "../Pages/customer/add-customer";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-customer" element={<AddCustomer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;