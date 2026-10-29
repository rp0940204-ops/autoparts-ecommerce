import { useState } from "react";

function AuthForm({ onSuccess, onClose }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "login" ? { email, password } : { name, email, password };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong");
      } else {
        onSuccess(data);
      }
    } catch {
      setError("Could not reach the server");
    }
    setBusy(false);
  }

  return (
    <div className="modal-back">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          x
        </button>
        <h2>{mode === "login" ? "Login" : "Create account"}</h2>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Please wait..." : mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <p className="switch">
          {mode === "login" ? "New here? " : "Already have an account? "}
          <span onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Create an account" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;