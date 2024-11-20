"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { FormError } from "~/app/_components/form-error";
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
import GoogleSignInButton from "~/components/GoogleSignInButton";
import { SignInSchema } from "../schemas";

type Props = {
  headerTitle: string;
  headerSubtitle: string;
  callbackUrl?: string;
  error?: string;
};

export default function SignInForm({
  headerTitle,
  headerSubtitle,
  callbackUrl,
  error,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);

  //  signinSchema is imported from schemas in the parent dir
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SignInSchema>) => {
    const { email, password } = values;
    setLoading(true);
    signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="mx-auto flex w-[516px] flex-col items-center justify-between gap-10 rounded-lg pt-8 pr-8 pb-12 pl-8 shadow-all">
      <div className="flex w-full select-none flex-col items-start gap-1">
        <h3 className="font-bold text-2xl ">{headerTitle}</h3>
        <p className="font-medium text-secondary">{headerSubtitle}</p>
      </div>

      <Form {...form}>
        <div className="flex max-h-[679px] w-full flex-col gap-[1rem]">
          {/* <GoogleSignInButton /> */}
          <div className=" mx-auto flex w-full items-center justify-evenly text-[#CBD5E2] before:mr-4 before:block before:h-px before:flex-grow before:bg-[#CBD5E2] after:ml-4 after:block after:h-px after:flex-grow after:bg-[#CBD5E2]">
            OR
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full">
            <div className="gap-4 space-y-4">
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
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="select-none">
                      Enter your Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />

              <p className="ml-auto flex w-fit cursor-pointer select-none justify-between font-semibold text-primary hover:underline">
                <Link href={"/forgot-password"}>Forgot Password</Link>
              </p>

              <FormError
                message={error ? "Email or password is incorrect" : ""}
              />

              <Button
                size="lg"
                type="submit"
                loading={loading}
                className="w-full"
              >
                {headerTitle}
              </Button>
            </div>
          </form>

          <p className="mx-auto select-none text-secondary">
            Don&apos;t have an account?{" "}
            <Link
              className="font-semibold text-primary hover:underline"
              href={"/signup"}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
}
