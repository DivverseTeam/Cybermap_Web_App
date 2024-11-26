"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "~/app/_components/ui/button";
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
import { FormError } from "~/app/_components/form-error";

const ForgotPassword = () => {
  const {
    mutate: forgotPassword,
    isPending,
    error,
  } = api.user.forgotPassword.useMutation();

  const router = useRouter();

  const formSchema = z.object({
    email: z.string().email(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
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
      },
    );
  };

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-4 text-center font-bold text-2xl">Forgot Password</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-2"
        >
          <div>
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
            <FormError message={error?.message} />
          </div>
          <Button
            type="submit"
            loading={isPending}
            className="w-full"
            size="lg"
          >
            Send reset code
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPassword;
