"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { AppRoutes } from "~/routes";
import { api } from "~/trpc/react";
import { SignUpSchema } from "../schemas";

type Props = {
  headerTitle: string;
  headerSubtitle: string;
};

export default function SignUpForm({ headerTitle, headerSubtitle }: Props) {
  const _router = useRouter();
  const {
    mutate: signUpMutate,
    isPending,
    error,
  } = api.user.signUp.useMutation();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SignUpSchema>) => {
    const { fullName, email, password } = values;

    signUpMutate(
      {
        name: fullName,
        email,
        password,
      },
      {
        onSuccess: () => {
          form.reset();
          signIn("credentials", {
            email,
            password,
            callbackUrl: AppRoutes.AUTH.EMAIL_VERIFY,
          });
        },
        onError: (error) => {
          console.error("Error signing up:", error);
        },
      }
    );
  };

  return (
    <div className="mx-auto flex w-[516px] flex-col items-center justify-between gap-10 rounded-lg pt-8 pr-8 pb-12 pl-8 shadow-all">
      <div className="flex w-full select-none flex-col items-start gap-1">
        <h3 className="font-bold text-2xl ">{headerTitle}</h3>
        <p className="font-medium text-secondary">{headerSubtitle}</p>
      </div>

      <Form {...form}>
        <div className="flex max-h-[735px] w-full flex-col gap-[1rem]">
          {/* <GoogleSignInButton /> */}
          {/* <div className=" mx-auto flex w-full items-center justify-evenly text-[#CBD5E2] before:mr-4 before:block before:h-px before:flex-grow before:bg-[#CBD5E2] after:ml-4 after:block after:h-px after:flex-grow after:bg-[#CBD5E2]">
            OR
          </div> */}
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

              <FormError message={error?.message} />

              <Button
                size="lg"
                type="submit"
                loading={isPending}
                className="w-full"
              >
                {headerTitle}
              </Button>
            </div>
          </form>
          <p className="mx-auto select-none text-secondary">
            Already have an account?{" "}
            <Link
              className="font-semibold text-primary hover:underline"
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
