import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`dl-layout ${collapsed ? "dl-layout-collapsed" : ""}`}>
      <aside className={`dl-sidebar ${collapsed ? "collapsed" : ""}`}>
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      </aside>

      <div className="dl-right">
        <Navbar collapsed={collapsed} />

        <main className="dl-main">
          <div className="dl-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}