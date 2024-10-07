"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/app/_components/ui/input";
import { Button } from "~/app/_components/ui/button";
import Link from "next/link";
import GoogleSignInButton from "~/components/GoogleSignInButton";
// import { TextInput } from "@razorpay/blade/components";
import { EyeIcon, EyeOffIcon } from "@razorpay/blade/components";
import { PasswordInput } from "~/app/_components/ui/password-input";
import { FormError } from "~/app/_components/form-error";
import { FormSuccess } from "~/app/_components/form-success";
import { SignUpSchema } from "../schemas";
import { useState, useTransition } from "react";
import { signup } from "~/actions/signup";

type Props = {
  headerTitle: string;
  headerSubtitle: string;
};

export default function SignUpForm({ headerTitle, headerSubtitle }: Props) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = (values: z.infer<typeof SignUpSchema>) => {
    setError("");
    setSuccess("");

    // here the startTransition function wraps the signin server action and uses useTransition from react to disable input fields and buttons while isPending is still true and form values are being sent from the client to the server
    startTransition(() => {
      // signin function is a server action that send the form values to the server
      signup(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <div className="flex flex-col shadow-all items-center justify-between rounded-lg w-[516px] mx-auto pt-8 pr-8 pb-12 pl-8 gap-10">
      <div className="flex flex-col items-start w-full gap-1 select-none">
        <h3 className="font-bold text-2xl ">{headerTitle}</h3>
        <p className="font-medium text-[#768EA7]">{headerSubtitle}</p>
      </div>

      <Form {...form}>
        <div className="flex flex-col gap-[1rem] w-full max-h-[735px]">
          <GoogleSignInButton />
          <div className=" mx-auto flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-[#CBD5E2] after:ml-4 after:block after:h-px after:flex-grow after:bg-[#CBD5E2] text-[#CBD5E2]">
            OR
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full">
            <div className="gap-4 space-y-4">
              {headerTitle === "Sign Up" && (
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="select-none">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="select-none">
                      Enter your Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
              <p className="flex select-none items-end flex-row-reverse text-[#305EFF] hover:underline font-semibold cursor-pointer">
                Forgot Password
              </p>
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button
                className="w-full bg-[#305EFF] hover:bg-[#305EFF]/90 h-12 font-semibold"
                type="submit"
              >
                {headerTitle}
              </Button>
            </div>
          </form>

          <p className="text-[#768EA7] mx-auto select-none">
            Already have an account?{" "}
            <Link
              className="text-[#305EFF] hover:underline font-semibold"
              href={"/signin"}
            >
              Sign In
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
}
