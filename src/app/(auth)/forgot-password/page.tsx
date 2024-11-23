"use client";

import { useState } from "react";

interface ForgotPasswordResponse {
  message: string;
}

// Type guard for response validation
function isForgotPasswordResponse(
  data: unknown
): data is ForgotPasswordResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as { message: unknown }).message === "string"
  );
}

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // Ensure the response is successful
      if (!res.ok) {
        throw new Error("Failed to send reset email");
      }

      const data: unknown = await res.json(); // `unknown` type for strict handling
      // console.log(data);

      if (isForgotPasswordResponse(data)) {
        setMessage(data.message);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (_error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-md mb-4 w-full"
        />
        <button
          type="submit"
          className="w-full py-2 px-4 text-white rounded-md bg-primary hover:bg-blue-500"
        >
          Send Reset Email
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default ForgotPassword;
