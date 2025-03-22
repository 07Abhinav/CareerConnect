"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../utils/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      localStorage.setItem("token", response.data.token);
      router.push("/jobs");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <p className="mt-4">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="text-blue-500">
          Signup
        </a>
      </p>
    </div>
  );
}