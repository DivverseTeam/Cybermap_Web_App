"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: resendVerification } =
    api.user.resendVerificationCode.useMutation();

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage(""); // Clear previous messages
    setIsLoading(true);

    try {
      const response = await resendVerification({ email });
      setMessage(response.message);
    } catch (error) {
      console.error("Error:", error);
      setMessage(
        "Failed to resend verification email. Please ensure email is registered and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Forgot Password</h1>
      <p>
        If you haven't received the verification email, enter your email below
        to resend it.
      </p>
      <form onSubmit={handleResend}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
          className="p-2 border border-gray-300 rounded-md mb-4 w-full"
        />

        <button type="submit" disabled={isLoading} className="button">
          {isLoading ? "Sending..." : "Resend Verification"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
