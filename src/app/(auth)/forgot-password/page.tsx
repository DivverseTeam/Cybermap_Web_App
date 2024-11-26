"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/app/_components/ui/button";
import { cn } from "~/lib/utils";
import { AppRoutes } from "~/routes";
import { api } from "~/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";

import { z } from "zod";

import { Input } from "~/app/_components/ui/input";

const ForgotPassword = () => {
  const {
    mutate: forgotPassword,
    isPending,
    isSuccess,
    isError,
    error,
  } = api.user.forgotPassword.useMutation();

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
    const { email } = values;

    forgotPassword(
      { email },
      {
        onSuccess: () => {
          router.push(AppRoutes.AUTH.RESET_PASSWORD);
        },
        onError: (error) => {
          console.error("Error:", error);
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-4 text-center font-bold text-2xl">Forgot Password</h1>
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
          <Button
            type="submit"
            loading={isPending}
            className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-blue-500"
          >
            Send reset code
          </Button>
        </form>
      </Form>
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
