"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: resetPassword } = api.user.resetPassword.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage(""); // Clear previous messages
    setIsLoading(true);
    try {
      const response = await resetPassword({
        email,
        verificationCode,
        newPassword,
      });
      setMessage(response.message);
    } catch (error) {
      console.error("Error:", error);
      setMessage(
        "Failed to reset password. Please try again. Contact support if issue persists"
      );
    } finally {
      setIsLoading(false);
    }
  };

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
          disabled={isLoading}
          className="w-full py-2 px-4 text-white rounded-md bg-primary hover:bg-blue-500"
        >
          {isLoading ? "Resetting..." : "Reset Password"}{" "}
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default ResetPassword;
