import { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { QRCodeCanvas } from "qrcode.react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
function App() {
  const [account, setAccount] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialHash, setCredentialHash] = useState("");
  const [, setResult] = useState("");
  const [status, setStatus] = useState("");
  const [lastIssuedId, setLastIssuedId] = useState("");
  const [history, setHistory] = useState([]);
const [search, setSearch] = useState("");

const [selectedCredential, setSelectedCredential] = useState(null);
  const [loading, setLoading] = useState(false);
const [loggedIn, setLoggedIn] = useState(
  localStorage.getItem("loggedIn") === "true"
);

const role = localStorage.getItem("role") || "Guest";

  const API = "http://localhost:5000/credentials";

  // =========================
  // CONNECT WALLET (FIXED FOR ethers v5)
  // =========================
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // API WRAPPER
  // =========================
  const callAPI = async (fn) => {
    setLoading(true);

    try {
      const res = await fn();
      setResult(JSON.stringify(res.data, null, 2));
      return res.data;
    } catch (err) {
      setResult(JSON.stringify(err.response?.data || err.message, null, 2));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ISSUE (FIXED: STORE REAL ID)
  // =========================
  const issue = () =>
  callAPI(async () => {
    const res = await axios.post(`${API}/issue`, {
      credentialId,
      credentialHash,
      holder: account,
    });

    setLastIssuedId(credentialId);

    return res;
  });

  // =========================
  // VERIFY (USES CORRECT ID)
  // =========================
  const verify = async () => {
    const id = lastIssuedId || credentialId;

    const data = await callAPI(() =>
      axios.post(`${API}/verify`, {
        credentialId: id,
        credentialHash,
      })
    );

    if (!data) {
      setStatus("ERROR");
      return;
    }

    setStatus(data.valid ? "ACTIVE" : "INVALID");
  };

  // =========================
  // REVOKE (USES SAME ID)
  // =========================
  const revoke = () =>
    callAPI(() =>
      axios.post(`${API}/revoke`, {
        credentialId: lastIssuedId || credentialId,
      })
    );

  // =========================
  // HISTORY
  // =========================
  const fetchHistory = async () => {
    if (!account) return;

    try {
      const res = await axios.get(`${API}/history/${account}`);
      setHistory(res.data);
    } catch (err) {
      setResult(err.message);
    }
  };
const exportCSV = () => {
  if (history.length === 0) {
    alert("No history to export.");
    return;
  }

  const headers = ["Credential ID", "Holder", "Transaction"];

  const rows = history.map((h) => [
    h.credentialId,
    h.holder,
    h.tx,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((r) => r.join(",")),
  ].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "credential-history.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};
 if (!loggedIn) {
  return (
    <Login
      onLogin={() => {
        localStorage.setItem("loggedIn", "true");
        setLoggedIn(true);
      }}
    />
  );
}

return (
  <Routes>
    <Route
      path="/"
      element={
        <div className="container">
      <div className="card">
        <h1 className="title">
  🪪 DID Credential System
</h1>

<p
  style={{
    textAlign: "center",
    color: "#2563eb",
    fontWeight: "bold",
    marginBottom: "20px",
  }}
>
  Welcome, {role}
</p>

        <p className="subtitle">
  Blockchain-Based Identity Verification
</p>

<div className="stats">

  <div className="statCard">
    <div className="statNumber">
      {history.length}
    </div>
    <div className="statLabel">
      Credentials
    </div>
  </div>

  <div className="statCard">
    <div className="statNumber">
      {status === "ACTIVE" ? 1 : 0}
    </div>
    <div className="statLabel">
      Active
    </div>
  </div>

  <div className="statCard">
    <div className="statNumber">
      {status === "INVALID" ? 1 : 0}
    </div>
    <div className="statLabel">
      Revoked
    </div>
  </div>

  <div className="statCard">
    <div className="statNumber">
      {account ? "✓" : "✗"}
    </div>
    <div className="statLabel">
      Wallet
    </div>
  </div>

</div>
        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  }}
>
  <button
    onClick={connectWallet}
    className="walletBtn"
  >
    {account
      ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
      : "Connect Wallet"}
  </button>

  <button
    onClick={() => {
      localStorage.removeItem("loggedIn");
      setLoggedIn(false);
    }}
    style={{
      background: "#dc2626",
      color: "white",
      border: "none",
      padding: "10px 18px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    🚪 Logout
  </button>
</div>

        <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "30px",
    marginBottom: "30px",
  }}
>
  <div
    style={{
      background: "#1e293b",
      padding: "20px",
      borderRadius: "12px",
      textAlign: "center",
      color: "white",
    }}
  >
    <h2>📜</h2>
    <h3>{history.length}</h3>
    <p>Total Credentials</p>
  </div>

  <div
    style={{
      background: "#14532d",
      padding: "20px",
      borderRadius: "12px",
      textAlign: "center",
      color: "white",
    }}
  >
    <h2>✅</h2>
    <h3>
      {history.filter(h => h.status !== "REVOKED").length}
    </h3>
    <p>Active</p>
  </div>

  <div
    style={{
      background: "#7f1d1d",
      padding: "20px",
      borderRadius: "12px",
      textAlign: "center",
      color: "white",
    }}
  >
    <h2>❌</h2>
    <h3>
      {history.filter(h => h.status === "REVOKED").length}
    </h3>
    <p>Revoked</p>
  </div>

  <div
    style={{
      background: "#1d4ed8",
      padding: "20px",
      borderRadius: "12px",
      textAlign: "center",
      color: "white",
    }}
  >
    <h2>👤</h2>
    <h3>{role}</h3>
    <p>Logged In</p>
  </div>
</div>

{/* HISTORY */}
        <>
  <button
    onClick={fetchHistory}
    disabled={!account}
    className="historyBtn"
  >
    📊 Load History
  </button>

  <button
    onClick={exportCSV}
    disabled={history.length === 0}
    className="historyBtn"
    style={{
      background: "#10b981",
      marginTop: "10px",
      marginBottom: "20px",
    }}
  >
    📥 Export CSV
  </button>
</>

        {/* INPUTS */}
        <input
  className="input"
  placeholder="Credential ID"
  value={credentialId}
  onChange={(e) => setCredentialId(e.target.value)}
/>

        <input
  className="input"
  placeholder="Credential Hash"
  value={credentialHash}
  onChange={(e) => setCredentialHash(e.target.value)}
/>

        {/* BUTTONS */}
        {loading && (
  <div
    style={{
      textAlign: "center",
      margin: "15px 0",
      color: "#60a5fa",
      fontWeight: "bold",
    }}
  >
    ⏳ Processing blockchain transaction...
  </div>
)}

<div className="buttonGroup">

  {role === "Administrator" && (
    <button onClick={issue} className="issueBtn">
      Issue
    </button>
  )}

  <button onClick={verify} className="verifyBtn">
    Verify
  </button>

  {role === "Administrator" && (
    <button onClick={revoke} className="revokeBtn">
      Revoke
    </button>
  )}

</div>
        {/* STATUS */}
        {status && (
  <div
    style={{
      marginTop: 20,
      padding: "15px",
      borderRadius: "12px",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "18px",
      letterSpacing: "1px",
      color: "white",
      background:
        status === "ACTIVE"
          ? "linear-gradient(90deg,#16a34a,#22c55e)"
          : status === "INVALID"
          ? "linear-gradient(90deg,#dc2626,#ef4444)"
          : "linear-gradient(90deg,#f59e0b,#fbbf24)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    }}
  >
    {status === "ACTIVE" && "✅ ACTIVE"}
    {status === "INVALID" && "❌ REVOKED"}
    {status === "ERROR" && "⚠ ERROR"}
  </div>
)}

        {/* RESULT */}
        <h3 style={{ marginTop: 30 }}>
  📋 Transaction Result
</h3>

<pre style={{ background: "#020617", color: "#22c55e", padding: "20px" }}>
  {JSON.stringify(history, null, 2)}
</pre>
                {/* HISTORY */}
        {history.length > 0 && (
          <>
            <h3
  style={{
    marginTop: 35,
    marginBottom: 15,
    color: "#60a5fa",
    fontSize: "24px",
    fontWeight: "bold",
  }}
>
  📜 Credential History
</h3>
<input
  type="text"
  placeholder="🔍 Search Credential ID..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="input"
  style={{
    marginBottom: "20px",
  }}
/>

            <table
  className="table"
  style={{
    width: "100%",
    borderCollapse: "collapse",
    borderRadius: "10px",
    overflow: "hidden",
  }}
>
              <thead
  style={{
    background: "#1e293b",
    color: "#60a5fa",
  }}
>
                <tr>
                  <th>#</th>
                  <th>Credential</th>
                  <th>Holder</th>
                  <th>Transaction</th>
                </tr>
              </thead>

              <tbody style={{ background: "#0f172a" }}>
                {history
  .filter((h) =>
    h.credentialId
      .toLowerCase()
      .includes(search.toLowerCase())
  )
  .map((h, index) => (
                  <tr
  key={index}
  onClick={() => setSelectedCredential(h)}
  style={{
    cursor: "pointer",
  }}
>
                    <td>{index + 1}</td>

                    <td>{h.credentialId}</td>

                    <td>
                      {h.holder
                        ? `${h.holder.substring(0, 8)}...${h.holder.substring(
                            h.holder.length - 4
                          )}`
                        : "-"}
                    </td>

                    <td>
  {h.tx ? (
    <>
      {`${h.tx.substring(0, 12)}...`}

      <button
        onClick={() => {
          navigator.clipboard.writeText(h.tx);
          alert("Transaction copied!");
        }}
        style={{
          marginLeft: 10,
          padding: "3px 8px",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
          background: "#3b82f6",
          color: "white",
          fontSize: "12px",
        }}
      >
        📋
      </button>
    </>
  ) : (
    "-"
  )}
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

{selectedCredential && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    }}
  >
    <div
      style={{
        background: "#111827",
        color: "white",
        padding: "30px",
        borderRadius: "12px",
        width: "500px",
        boxShadow: "0 0 20px rgba(0,0,0,0.5)",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>
        📄 Credential Details
      </h2>

      <p>
        <strong>Credential ID:</strong><br />
        {selectedCredential.credentialId}
      </p>

      <p>
        <strong>Holder:</strong><br />
        {selectedCredential.holder || "-"}
      </p>

      <p>
  <strong>Transaction:</strong><br />
  {selectedCredential.tx || "-"}
</p>

<div
  style={{
    marginTop: "20px",
    textAlign: "center",
  }}
>
  <>
  <QRCodeCanvas
    id="credentialQR"
    value={JSON.stringify({
      credentialId: selectedCredential.credentialId,
      holder: selectedCredential.holder,
      status: selectedCredential.status,
    })}
    size={180}
  />

  <button
    style={{
      marginTop: "15px",
      padding: "10px 20px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    }}
    onClick={() => {
      const canvas = document.getElementById("credentialQR");

      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");

      const downloadLink = document.createElement("a");

      downloadLink.href = pngUrl;

      downloadLink.download = `${selectedCredential.credentialId}.png`;

      document.body.appendChild(downloadLink);

      downloadLink.click();

      document.body.removeChild(downloadLink);
    }}
  >
    📥 Download QR Code
  </button>
</>
</div>

<p>
  <strong>Status:</strong>
</p>

<div
  style={{
    display: "inline-block",
    background:
  selectedCredential.status === "REVOKED"
    ? "#dc2626"
    : "#16a34a",
    color: "white",
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "bold",
    marginBottom: "15px",
  }}
>
  {selectedCredential.status || "ACTIVE"}
</div>

           <button
        onClick={() => setSelectedCredential(null)}
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "10px",
          background: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Close
            </button>

    </div>
  </div>
)}

<footer
  style={{
    marginTop: "40px",
    padding: "20px",
    textAlign: "center",
    color: "#94a3b8",
    borderTop: "1px solid #334155",
    fontSize: "14px",
  }}
>
  <p>
    <strong>DID Credential Verification System</strong>
  </p>

  <p>
    Blockchain-Based Decentralized Identity Management
  </p>

  <p>
    Version 1.0 | © 2026
  </p>

  <p>
    Developed by Christian Okoye
  </p>
</footer>

        </div>
  </div>
      }
    />
  </Routes>
);
}

export default App;