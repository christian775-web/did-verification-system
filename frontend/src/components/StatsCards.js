import React from "react";

function StatsCards({ history }) {
  const total = history.length;

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        marginBottom: "20px",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          flex: 1,
          background: "#1e293b",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <h2>{total}</h2>
        <p>Total Credentials</p>
      </div>

      <div
        style={{
          flex: 1,
          background: "#14532d",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <h2>{total}</h2>
        <p>Issued</p>
      </div>

      <div
        style={{
          flex: 1,
          background: "#1e3a8a",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <h2>{history.length}</h2>
        <p>History Records</p>
      </div>
    </div>
  );
}

export default StatsCards;