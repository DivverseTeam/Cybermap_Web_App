"use client";

import { useState } from "react";

// Define the expected response structure
interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          verificationCode,
          newPassword,
        }),
      });

      // Check if response is OK
      if (!res.ok) {
        setMessage("Failed to reset password. Please try again.");
        return;
      }

      // Parse response as JSON
      const data: unknown = await res.json();

      // Type guard to check if data matches ResetPasswordResponse structure
      if (isResetPasswordResponse(data)) {
        setMessage(data.message);
      } else {
        setMessage("Invalid response format.");
      }
    } catch (_error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  // Type guard to check if the data is of type ResetPasswordResponse
  function isResetPasswordResponse(
    data: unknown
  ): data is ResetPasswordResponse {
    return (
      typeof data === "object" &&
      data !== null &&
      "success" in data &&
      "message" in data &&
      typeof (data as ResetPasswordResponse).message === "string"
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4">
        Reset Your Password
      </h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-md mb-4 w-full"
        />
        <input
          type="text"
          placeholder="Enter verification code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-md mb-4 w-full"
        />
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-md mb-4 w-full"
        />
        <button
          type="submit"
          className="w-full py-2 px-4 text-white rounded-md bg-primary hover:bg-blue-500"
        >
          Reset Password
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default ResetPassword;
