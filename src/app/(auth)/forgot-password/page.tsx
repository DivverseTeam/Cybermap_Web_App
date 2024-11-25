"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DayButton } from "react-day-picker";
import { Button } from "~/app/_components/ui/button";
import { AppRoutes } from "~/routes";
import { api } from "~/trpc/react";

const ForgotPassword = () => {
  const { mutateAsync: forgotPassword } = api.user.forgotPassword.useMutation();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);

    try {
      // Call the tRPC mutation
      const response = await forgotPassword({ email });
      if (response.success) {
        setIsSuccess(true);
        setMessage(response.message);

        router.push(AppRoutes.AUTH.RESET_PASSWORD); // Redirect after success
      } else {
        setIsError(true);
        setMessage("Failed to send password reset email.");
      }
    } catch (_error) {
      setIsError(true);
      setMessage(
        "An error occurred, please try again. Contact support if error persists."
      );
    } finally {
      setIsLoading(false);
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
        <Button
          type="submit"
          disabled={isLoading}
          loading={isLoading}
          className="w-full py-2 px-4 text-white rounded-md bg-primary hover:bg-blue-500"
        >
          Send reset code
        </Button>
      </form>
      <p
        className={`${
          isSuccess
            ? "text-green-500"
            : isError
            ? "text-destructive"
            : "text-black"
        }`}
      >
        {message}
      </p>
    </div>
  );
};

export default ForgotPassword;
