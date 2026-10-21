import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api";
import { setItem } from "../storage";

// Num `catch`, o erro tem tipo `unknown` (pode ser qualquer coisa lançada).
function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export default function Login() {
  const navigate = useNavigate();
  // O TS infere `string` a partir do valor inicial "".
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.title = "Login | JV SaaS";
  }, []);

  async function handleLogin() {
    try {
      const data = await login({ email, password });
      setItem("token", data.token);
      setItem("userEmail", email);
      navigate("/dashboard");
    } catch (error) {
      alert(errorMessage(error));
    }
  }

  async function handleRegister() {
    try {
      await register({ email, password });
      alert("User created successfully");
    } catch (error) {
      alert(errorMessage(error));
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p>Login to access your dashboard</p>

        <div className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="auth-actions">
            <button onClick={handleLogin}>Login</button>
            <button className="secondary" onClick={handleRegister}>Register</button>
          </div>
        </div>
      </div>
    </div>
  );
}
