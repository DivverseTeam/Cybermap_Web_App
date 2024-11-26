"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/app/_components/ui/button";
import { cn } from "~/lib/utils";
import { AppRoutes } from "~/routes";
import { api } from "~/trpc/react";

const ForgotPassword = () => {
  const {
    mutate: forgotPassword,
    isPending,
    isSuccess,
    isError,
    error,
  } = api.user.forgotPassword.useMutation();

  const [email, setEmail] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    forgotPassword(
      { email },
      {
        onSuccess: () => {
          router.push(AppRoutes.AUTH.RESET_PASSWORD);
        },
        onError: (error) => {
          console.error("Error:", error);
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-4 text-center font-bold text-2xl">Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded-md border border-gray-300 p-2"
        />
        <Button
          type="submit"
          loading={isPending}
          className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-blue-500"
        >
          Send reset code
        </Button>
      </form>
      <p
        className={cn({
          "text-green-500": isSuccess,
          "text-destructive": isError,
        })}
      >
        {error?.message}
      </p>
    </div>
  );
};

export default ForgotPassword;
