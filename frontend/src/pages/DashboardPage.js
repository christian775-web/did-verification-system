import React from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage({ account, history }) {
  const navigate = useNavigate();

  const active = history.filter(
    (h) => h.status !== "REVOKED"
  ).length;

  const revoked = history.filter(
    (h) => h.status === "REVOKED"
  ).length;

  return (
    <div className="container">
      <div className="card">

        <h1>📊 Dashboard</h1>

        <h3>Connected Wallet</h3>
        <p>{account || "Not Connected"}</p>

        <hr />

        <h3>Statistics</h3>

        <p><strong>Total Credentials:</strong> {history.length}</p>
        <p><strong>Active:</strong> {active}</p>
        <p><strong>Revoked:</strong> {revoked}</p>

        <button
          onClick={() => navigate("/admin")}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            cursor: "pointer"
          }}
        >
          Go to Admin Panel
        </button>

      </div>
    </div>
  );
}

export default DashboardPage;