import React, { useState } from "react";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/autenticacion/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include"  // para manejar sesiones con cookies
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Login exitoso!");
        console.log("Usuario logueado:", data);
      } else {
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de conexión al servidor");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 10 }}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button type="submit" style={{ padding: 10, width: "100%" }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;