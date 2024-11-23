"use client";

import { useState } from "react";

interface ResendVerificationResponse {
  message: string;
  error?: string;
}

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async () => {
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      // Assert the response type as ResendVerificationResponse
      const data = (await response.json()) as ResendVerificationResponse;

      if (response.ok) {
        setMessage(data.message); // Display success message
      } else {
        setError(data.error || "Failed to resend verification email.");
      }
    } catch (_err) {
      setError("Failed to resend verification email.");
    }
  };

  return (
    <div>
      <h1>Resend Verification Email</h1>
      <p>
        If you haven't received the verification email, enter your email below
        to resend it.
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <button onClick={handleResend}>Resend Verification Code</button>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
