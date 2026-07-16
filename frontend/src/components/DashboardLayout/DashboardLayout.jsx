import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import "./DashboardLayout.css";

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`dl-shell ${collapsed ? "dl-sidebar-collapsed" : ""}`}
    >
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <div className="dl-body">
        <Navbar />
        <main className="dl-main" role="main">
          <div className="dl-content">{children}</div>
        </main>
      </div>
    </div>
  );
}