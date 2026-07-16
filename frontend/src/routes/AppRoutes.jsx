import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "../components/dashboard-layout/DashboardLayout";

// import Dashboard from "../Pages/dashboard/Dashboard";
// import Booking from "../Pages/booking/Booking";
// import Service from "../Pages/service/Service";
// import Technician from "../Pages/technician/Technician";
// import Complaint from "../Pages/complaint/Complaint";
// import Payment from "../Pages/payment/Payment";

function AppRoutes() {
    return (
        <BrowserRouter>

            <Routes>

                <Route element={<DashboardLayout />}>
{/* 
                    <Route path="/" element={<Dashboard />} />

                    <Route path="/booking" element={<Booking />} />

                    <Route path="/service" element={<Service />} />

                    <Route path="/technician" element={<Technician />} />

                    <Route path="/complaint" element={<Complaint />} />

                    <Route path="/payment" element={<Payment />} /> */}

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;