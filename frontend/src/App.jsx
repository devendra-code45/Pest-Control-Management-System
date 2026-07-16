import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Customer module only — other modules (login, dashboard, booking,
// complaint, payment, service, technician) are stubbed out (.gitkeep only)
// and not wired up yet. Add them back to App.jsx once those files exist.
const CustomerList = lazy(() => import("./Pages/customer/customer-list"));
const AddCustomer = lazy(() => import("./Pages/customer/add-customer"));
const EditCustomer = lazy(() => import("./Pages/customer/edit-customer"));
const CustomerDetails = lazy(() =>
  import("./Pages/customer/customer-details")
);

function PageLoader() {
  return (
    <div className="route-loader">
      <div className="route-loader-spinner" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route index element={<Navigate to="/customers" replace />} />

          <Route path="customers" element={<CustomerList />} />
          <Route path="customers/add" element={<AddCustomer />} />
          <Route path="customers/:id" element={<CustomerDetails />} />
          <Route path="customers/:id/edit" element={<EditCustomer />} />

          <Route path="*" element={<Navigate to="/customers" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}