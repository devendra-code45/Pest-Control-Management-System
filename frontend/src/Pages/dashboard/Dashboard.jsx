import React from "react";

export default function Dashboard() {
  return (
    <section
      style={{
        minHeight: "100%",
        padding: "24px",
        borderRadius: "16px",
        background: "#f7faf8",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
      }}
    >
      <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1f2937", marginBottom: "8px" }}>
        Dashboard
      </h1>
      <p style={{ fontSize: "15px", color: "#6b7280" }}>
        Welcome to the Pest Control Management System.
      </p>
    </section>
  );
}
