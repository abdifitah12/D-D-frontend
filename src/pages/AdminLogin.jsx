import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { isAdminAuthenticated, saveAdminAuth } from "../utils/adminAuth";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  if (isAdminAuthenticated()) {
    return <Navigate to="/admin/events" replace />;
  }

  const handleLogin = (e) => {
    e.preventDefault();

    // match backend user
    if (username === "qamar" && password === "diriye10") {
      saveAdminAuth(username, password);
      navigate("/admin/events");
    } else {
      alert("Wrong username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Admin Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border px-4 py-3 rounded-2xl mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-3 rounded-2xl mb-4"
        />

        <button
          type="submit"
          className="w-full bg-green-700 text-white py-3 rounded-2xl"
        >
          Login
        </button>
      </form>
    </div>
  );
}
