"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import { PasswordInput } from "~/app/_components/ui/password-input";
import { cn } from "~/lib/utils";
import { AppRoutes } from "~/routes";
import { api } from "~/trpc/react";

const ResetPassword = () => {
  const {
    mutate: resetPassword,
    isPending,
    isError,
    isSuccess,
    error,
  } = api.user.resetPassword.useMutation();

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

    resetPassword(
      { email, verificationCode, newPassword },
      {
        onSuccess: () => {
          setTimeout(() => {
            router.push(AppRoutes.AUTH.LOGIN);
          }, 500);
        },
        onError: (error) => {
          console.error("Error:", error);
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-4 text-center font-bold text-2xl">
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
                <FormMessage />
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
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            loading={isPending}
            className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-blue-500"
          >
            Reset Password
          </Button>
        </form>
      </Form>
      {/* Optional Resend Token */}
      <p
        className="mt-4 cursor-pointer text-center text-gray-500 italic hover:text-black hover:underline"
        onClick={() => router.push(AppRoutes.AUTH.FORGOT_PASSWORD)}
      >
        Didn’t receive a verification code?
      </p>

      <p
        className={cn({
          "text-green-500": isSuccess,
          "text-destructive": isError,
        })}
      >
        {isSuccess ? "Password reset successful" : isError ? error.message : ""}
      </p>
    </div>
  );
};

export default ResetPassword;
