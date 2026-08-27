import { useState } from "react";
import { saveAdminToken } from "../utils/adminAuth";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://dnd-cafe-ece43a569fa1.herokuapp.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Wrong username or password");
      }

      const data = await res.json();

      if (!data.token) {
        throw new Error("Backend did not return a token");
      }

      saveAdminToken(data.token);

      setSuccess("Login successful!");

      setTimeout(() => {
        window.location.replace("/admin/events");
      }, 600);

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError(err.message);
    } finally {
      setLoading(false);
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

        {success && (
          <div className="mb-4 rounded-xl bg-green-100 px-4 py-3 text-center text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-center text-red-700">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border px-4 py-3 rounded-2xl mb-4"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-3 rounded-2xl mb-4"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 text-white py-3 rounded-2xl hover:bg-green-800 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}