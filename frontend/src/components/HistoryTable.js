import React from "react";

function HistoryTable({ history }) {
  if (!history || history.length === 0) {
    return (
      <p style={{ color: "#9ca3af" }}>
        No credential history found.
      </p>
    );
  }

  return (
    <div>
      <h3 style={{ marginTop: 20 }}>📜 Credential History</h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 10,
        }}
      >
        <thead>
          <tr style={{ background: "#1f2937" }}>
            <th style={thStyle}>Credential ID</th>
            <th style={thStyle}>Holder</th>
            <th style={thStyle}>Tx Hash</th>
            <th style={thStyle}>Type</th>
          </tr>
        </thead>

        <tbody>
          {history.map((item, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #374151" }}>
              <td style={tdStyle}>{item.credentialId}</td>
              <td style={tdStyle}>
                {item.holder.slice(0, 6)}...{item.holder.slice(-4)}
              </td>
              <td style={tdStyle}>
                {item.tx.slice(0, 10)}...
              </td>
              <td style={tdStyle}>{item.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: "10px",
  textAlign: "left",
  color: "#e5e7eb",
};

const tdStyle = {
  padding: "10px",
  color: "#d1d5db",
};

export default HistoryTable;