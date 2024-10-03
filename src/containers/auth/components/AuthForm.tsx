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
import GoogleSignInButton from "~/components/GoogleSigninButton";
// import { TextInput } from "@razorpay/blade/components";

type Props = {
  headerTitle: string;
  headerSubtitle: string;
};

const formSchema = z.object({
  fullName: z.string(),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have at least 8 characters"),
});

export default function AuthForm({ headerTitle, headerSubtitle }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <div className="flex flex-col border shadow items-center justify-between top-[172px] left-[462px] rounded-lg w-[516px] mx-auto pt-8 pr-8 pb-12 pl-8 gap-6">
      <Form {...form}>
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
                    <FormLabel>Full Name</FormLabel>
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
                  <FormLabel>Email</FormLabel>
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full bg-[#305EFF] hover:bg-[#305EFF]/90"
              type="submit"
            >
              Sign In
            </Button>
          </div>
        </form>

        <p className="text-[#768EA7]">
          Don&apos;t have an account?{" "}
          <Link
            className="text-[#305EFF] hover:underline font-semibold"
            href={"/signup"}
          >
            Sign Up
          </Link>
        </p>
      </Form>
    </div>
  );
}
