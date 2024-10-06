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
import { signIn } from "next-auth/react";
import { useState } from "react";

type Props = {
	headerTitle: string;
	headerSubtitle: string;
	callbackUrl?: string;
	error?: string;
};

const signInFormSchema = z.object({
	email: z.string().min(1, "Email is required").email("Invalid email"),
	password: z
		.string()
		.min(1, "Password is required")
		.min(8, "Password must have at least 8 characters"),
});
const signUpFormSchema = z.object({
	fullName: z.string(),
	email: z.string().min(1, "Email is required").email("Invalid email"),
	password: z
		.string()
		.min(1, "Password is required")
		.min(8, "Password must have at least 8 characters"),
});

export default function AuthForm({
	headerTitle,
	headerSubtitle,
	callbackUrl,
}: Props) {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const signInForm = useForm<z.infer<typeof signInFormSchema>>({
		resolver: zodResolver(signInFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			fullName: "",
			email: "",
			password: "",
		},
	});

	const signInSubmit = (values: z.infer<typeof signInFormSchema>) => {
		setIsLoading(true);
		const { email, password } = values;
		signIn("credentials", {
			email,
			password,
			callbackUrl: callbackUrl || "/",
		});
	};

	const signUpSubmit = (values: z.infer<typeof signUpFormSchema>) => {
		console.log(values);
	};
	return (
		<div className="flex flex-col shadow-all items-center justify-between top-[172px] left-[462px] rounded-lg w-[516px] mx-auto pt-8 pr-8 pb-12 pl-8 gap-20">
			<div className="flex flex-col items-start w-full gap-2 select-none">
				<h3 className="font-bold text-2xl ">{headerTitle}</h3>
				<p className="font-medium text-[#768EA7]">{headerSubtitle}</p>
			</div>
			{headerTitle === "Sign In" ? (
				<Form {...signInForm}>
					<div className="flex flex-col gap-8 w-full">
						<GoogleSignInButton />
						<div className=" mx-auto flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-[#CBD5E2] after:ml-4 after:block after:h-px after:flex-grow after:bg-[#CBD5E2] text-[#CBD5E2]">
							OR
						</div>
						<form
							onSubmit={signInForm.handleSubmit(signInSubmit)}
							className=" w-full"
						>
							<div className="gap-4 space-y-4">
								<FormField
									control={signInForm.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="select-none">Email</FormLabel>
											<FormControl>
												<Input type="email" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={signInForm.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="select-none">Password</FormLabel>
											<FormControl>
												<PasswordInput {...field} />
											</FormControl>
											<FormMessage className="" />
										</FormItem>
									)}
								/>
								<p className="select-none flex items-end flex-row-reverse text-primary font-semibold cursor-pointer">
									Forgot Password
								</p>
								<Button type="submit" size="lg" loading={isLoading}>
									{headerTitle}
								</Button>
							</div>
						</form>

						<p className="text-[#768EA7] mx-auto select-none">
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
			) : (
				headerTitle === "Sign Up" && (
					<Form {...signUpForm}>
						<div className="flex flex-col gap-8 w-full">
							<GoogleSignInButton />
							<div className=" mx-auto flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-[#CBD5E2] after:ml-4 after:block after:h-px after:flex-grow after:bg-[#CBD5E2] text-[#CBD5E2]">
								OR
							</div>
							<form
								onSubmit={signUpForm.handleSubmit(signUpSubmit)}
								className=" w-full"
							>
								<div className="gap-4 space-y-4">
									{headerTitle === "Sign Up" && (
										<FormField
											control={signUpForm.control}
											name="fullName"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="select-none">
														Full Name
													</FormLabel>
													<FormControl>
														<Input type="text" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									)}
									<FormField
										control={signUpForm.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="select-none">Email</FormLabel>
												<FormControl>
													<Input type="email" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={signUpForm.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="select-none">Password</FormLabel>
												<FormControl>
													<PasswordInput {...field} />
												</FormControl>
												<FormMessage className="" />
											</FormItem>
										)}
									/>
									<Button type="submit">{headerTitle}</Button>
								</div>
							</form>

							<p className="text-[#768EA7] mx-auto select-none">
								Already have an account?{" "}
								<Link
									className="text-primary hover:underline font-semibold"
									href={"/signin"}
								>
									Sign In
								</Link>
							</p>
						</div>
					</Form>
				)
			)}
		</div>
	);
}
