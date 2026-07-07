import React from "react";
import "../styles/dashboard.css";

function Dashboard({ children }) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-card">

        <div className="dashboard-header">
          <h1>🪪 DID Credential Verification System</h1>
          <p>
            Blockchain-Based Digital Identity & Credential Verification
          </p>
        </div>

        {children}

      </div>
    </div>
  );
}

export default Dashboard;