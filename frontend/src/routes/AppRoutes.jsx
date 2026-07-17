import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import Dashboard from "../Pages/dashboard/Dashboard";

import AddCustomer from "../Pages/customer/add-customer";


import NewComplaint from "../Pages/complaint/newcomplaint";
import ComplaintManagement from "../Pages/complaint/complaintmanagement";
import TechnicianManagement from "../Pages/technician/technicianmanagement";
import AddTechnician from "../Pages/technician/addtechnician";
import AssignTechnician from "../Pages/technician/assigntechnician";
import EditTechnician from "../Pages/technician/edittechnicianprofile";
import TechnicianProfile from "../Pages/technician/technicianprofile";
import Payment from "../Pages/payments/Payments";
import Invoice from "../Pages/payments/invoice";
import CreatePayment from "../Pages/payments/CreatePayments";
import PaymentDetail from "../Pages/payments/PaymentsDetail";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-customer" element={<AddCustomer />} />
          <Route path="/new-complaint" element={<NewComplaint />} />
          <Route path="/complaint" element={<ComplaintManagement />} />
          <Route path="/technician-management" element={<TechnicianManagement />} />
          <Route path="/add-technician" element={<AddTechnician />} />
          <Route path="/assign-technician" element={<AssignTechnician />} />
          <Route path="/edit-technician" element={<EditTechnician />} />
          <Route path="/technician-profile" element={<TechnicianProfile />} />
          <Route path="/payments" element={<Payment />} />
          <Route path="/create-payment" element={<CreatePayment />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/payments-details" element={<PaymentDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;