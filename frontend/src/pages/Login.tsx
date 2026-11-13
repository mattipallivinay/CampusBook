
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginUser } from "../services/authService";

interface ApiErrorResponse {
  message?: string;
}

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError<ApiErrorResponse>(err)
        ? err.response?.data?.message
        : undefined;

      setError(
        errorMessage || "Login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1220] px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-8"
      >
        <h1 className="text-2xl font-bold text-white">
          Welcome to CampusBook
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Sign in to access your academic workspace.
        </p>

        {error && (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        )}

        <label className="mt-6 block text-sm text-gray-300">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-lg border border-white/10 bg-[#0B1220] p-3 text-white outline-none focus:border-blue-500"
          placeholder="Enter your email"
        />

        <label className="mt-4 block text-sm text-gray-300">
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-lg border border-white/10 bg-[#0B1220] p-3 text-white outline-none focus:border-blue-500"
          placeholder="Enter your password"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-blue-600 p-3 font-medium text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default Login;
