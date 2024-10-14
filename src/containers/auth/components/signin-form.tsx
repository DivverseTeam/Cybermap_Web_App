"use client";

import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/app/_components/ui/form";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/app/_components/ui/input";
import { Button } from "~/app/_components/ui/button";
import Link from "next/link";
import GoogleSignInButton from "~/components/GoogleSignInButton";
import { PasswordInput } from "~/app/_components/ui/password-input";
import { FormError } from "~/app/_components/form-error";
import { useState } from "react";
import { SignInSchema } from "../schemas";
import { signIn } from "next-auth/react";

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
			callbackUrl: callbackUrl || "/",
		});
	};

	return (
		<div className="flex flex-col shadow-all items-center justify-between rounded-lg w-[516px] mx-auto pt-8 pr-8 pb-12 pl-8 gap-10">
			<div className="flex flex-col items-start w-full gap-1 select-none">
				<h3 className="font-bold text-2xl ">{headerTitle}</h3>
				<p className="font-medium text-secondary">{headerSubtitle}</p>
			</div>

			<Form {...form}>
				<div className="flex flex-col gap-[1rem] w-full max-h-[679px]">
					<GoogleSignInButton />
					<div className=" mx-auto flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-[#CBD5E2] after:ml-4 after:block after:h-px after:flex-grow after:bg-[#CBD5E2] text-[#CBD5E2]">
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
							<p className="select-none flex justify-between ml-auto w-fit text-primary hover:underline font-semibold cursor-pointer">
								Forgot Password
							</p>

							<FormError
								message={error ? "Email or password is incorrect" : ""}
							/>

							<Button size="lg" type="submit" loading={loading}>
								{headerTitle}
							</Button>
						</div>
					</form>

					<p className="text-secondary mx-auto select-none">
						Don&apos;t have an account?{" "}
						<Link
							className="text-primary hover:underline font-semibold"
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
