import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { AppRoutes } from "~/routes";

// Define the expected response type from the backend
interface VerifyEmailResponse {
  message: string;
  success: boolean;
  error?: string;
}

const VerifyEmailPage: React.FC = () => {
  const { data, status } = useSession();
  const router = useRouter();

  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle loading and unauthenticated states
  if (status === "loading") return <p>Loading...</p>;

  if (status === "unauthenticated") {
    router.push(AppRoutes.AUTH.LOGIN); // Redirect to sign-in page
    return null;
  }

  // Extract user email from session
  const email = data?.user?.email;

  const handleVerify = async () => {
    if (!email) {
      setError("Email is missing from the session.");
      return;
    }

    if (!token.trim()) {
      setError("Please enter the verification token.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token }),
      });

      // Parse response and handle success/failure
      const result = (await res.json()) as VerifyEmailResponse;

      if (res.ok && result.success) {
        setSuccess(
          result.message || "Your email has been successfully verified!"
        );
        setTimeout(() => {
          router.push(AppRoutes.AUTH.ONBOARDING); // Redirect after success
        }, 2000);
      } else {
        setError(
          result.error || "Token verification failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Verify Your Email</h1>
      <p className="text-gray-600 text-center mb-6">
        A verification token has been sent to{" "}
        <strong>{email || "your email"}</strong>. Please enter it below to
        verify your email address.
      </p>

      {/* Feedback Messages */}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}

      {/* Input for Token */}
      <input
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Enter your verification token"
        className="p-2 border border-gray-300 rounded-md mb-4 w-full"
      />

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={isLoading}
        className={`w-full py-2 px-4 text-white rounded-md ${
          isLoading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isLoading ? "Verifying..." : "Verify Email"}
      </button>

      {/* Optional Resend Token */}
      <p className="text-gray-500 text-center mt-4">
        Didn’t receive a token?{" "}
        <button
          className="text-blue-500 underline hover:text-blue-600"
          onClick={() => router.push(AppRoutes.AUTH.RESEND_VERIFICATION)}
        >
          Resend Verification Email
        </button>
      </p>
    </div>
  );
};

export default VerifyEmailPage;
