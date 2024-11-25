"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import { PasswordInput } from "~/app/_components/ui/password-input";
import { AppRoutes } from "~/routes";
import { api } from "~/trpc/react";

const ResetPassword = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const { mutateAsync: resetPassword } = api.user.resetPassword.useMutation();

  const router = useRouter();

  const formSchema = z.object({
    email: z.string().email(),
    verificationCode: z.string(),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[A-Z]/, {
        message: "Password must include at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must include at least one lowercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must include at least one number." })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must include at least one special character.",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      verificationCode: "",
      newPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, verificationCode, newPassword } = values;

    setMessage(""); // Clear previous messages
    setIsLoading(true);
    try {
      const response = await resetPassword({
        email,
        verificationCode,
        newPassword,
      });
      if (response.success) {
        setIsSuccess(true);
        setMessage(response.message);
        setTimeout(() => {
          router.push(AppRoutes.AUTH.LOGIN);
        }, 500);
      } else {
        setIsError(true);
        setMessage("Failed to send password reset email.");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsError(true);
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="select-none">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="verificationCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="select-none">
                  Enter verification code
                </FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="select-none">
                  Enter new Password
                </FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            loading={isLoading}
            className="w-full py-2 px-4 text-white rounded-md bg-primary hover:bg-blue-500"
          >
            Reset Password
          </Button>
        </form>
      </Form>
      {/* Optional Resend Token */}
      <p
        className="text-gray-500 text-center mt-4 italic hover:underline hover:text-black cursor-pointer"
        onClick={() => router.push(AppRoutes.AUTH.FORGOT_PASSWORD)}
      >
        Didn’t receive a token?
      </p>

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

export default ResetPassword;
