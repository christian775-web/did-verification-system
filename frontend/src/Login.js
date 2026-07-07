import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
  const login = () => {
  if (username === "admin" && password === "admin123") {
    localStorage.setItem("role", "Administrator");
    onLogin("Administrator");
    return;
  }

  if (username === "verifier" && password === "verify123") {
    localStorage.setItem("role", "Verifier");
    onLogin("Verifier");
    return;
  }

  if (username === "student" && password === "student123") {
    localStorage.setItem("role", "Student");
    onLogin("Student");
    return;
  }

  alert("Invalid username or password");
};

  return (
    <div className="container">
      <div className="card">

        <h1 className="title">🔐 Admin Login</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button
          className="issueBtn"
          onClick={login}
        >
          Login
        </button>

      </div>
    </div>
  );
}

export default Login;