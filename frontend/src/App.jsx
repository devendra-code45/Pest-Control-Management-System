import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import "./App.css";

/**
 * Temporary placeholderclear for pages that haven't been built yet.
 * Replace each route's element with the real page component from
 * src/Pages once it exists — this keeps the shell fully navigable
 * in the meantime.
 */
function ComingSoon({ title }) {
  return (
    <div style={{ padding: "8px 4px" }}>
      <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 600, color: "#1F2937" }}>
        {title}
      </h2>
      <p style={{ margin: 0, fontSize: 14, color: "#6B7280" }}>
        This page hasn't been built yet.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <DashboardLayout>
              <Outlet />
            </DashboardLayout>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ComingSoon title="Dashboard" />} />
          <Route path="/customers" element={<ComingSoon title="Customers" />} />
          <Route path="/bookings" element={<ComingSoon title="Bookings" />} />
          <Route path="/services" element={<ComingSoon title="Services" />} />
          <Route path="/technicians" element={<ComingSoon title="Technicians" />} />
          <Route path="/complaints" element={<ComingSoon title="Complaints" />} />
          <Route path="/payments" element={<ComingSoon title="Payments" />} />
          <Route path="/reports" element={<ComingSoon title="Reports" />} />
          <Route path="/analytics" element={<ComingSoon title="Analytics" />} />
          <Route path="/calendar" element={<ComingSoon title="Calendar" />} />
          <Route path="/notifications" element={<ComingSoon title="Notifications" />} />
          <Route path="/inventory" element={<ComingSoon title="Inventory" />} />
          <Route
            path="/chemical-management"
            element={<ComingSoon title="Chemical Management" />}
          />
          <Route path="/equipment" element={<ComingSoon title="Equipment" />} />
          <Route path="/settings" element={<ComingSoon title="Settings" />} />
          <Route path="/profile" element={<ComingSoon title="Profile" />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}