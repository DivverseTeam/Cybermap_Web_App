"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

// import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "~/app/_components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/app/_components/ui/form";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/app/_components/ui/select";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "~/app/_components/ui/sheet";
import { Textarea } from "~/app/_components/ui/textarea";

// import { createEvidence } from "../_lib/actions";
import {
	createEvidenceSchema,
	EvidenceStatus,
	type CreateEvidenceSchema,
} from "../_lib/validations";
import { Label } from "~/app/_components/ui/label";
import { Input } from "~/app/_components/ui/input";
import { cn } from "~/lib/utils";
// import { CreateEvidenceForm } from "./create-evidence-form";

interface CreateTaskFormProps
	extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
	children: React.ReactNode;
	form: UseFormReturn<CreateEvidenceSchema>;
	onSubmit: (data: CreateEvidenceSchema) => void;
}

export function CreateEvidenceSheet() {
	const [open, setOpen] = React.useState(false);
	const [isCreatePending, startCreateTransition] = React.useTransition();
	// const isDesktop = useMediaQuery("(min-width: 640px)");

	const form = useForm<CreateEvidenceSchema>({
		resolver: zodResolver(createEvidenceSchema),
	});

	const [file, setFile] = React.useState<File | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0] || null;
		setFile(selectedFile);
	};

	function onSubmit(input: CreateEvidenceSchema) {
		if (file) {
			// Handle file upload logic
			console.log("File uploaded:", file.name);
		} else {
			console.log("No file selected");
		}
		startCreateTransition(async () => {
			// const { error } = await createEvidence(input);
			// if (error) {
			// 	toast.error(error);
			// 	return;
			// }
			// form.reset();
			// setOpen(false);
			// toast.success("Evidence created");
		});
	}

	return (
		<Sheet>
			<SheetContent className="flex flex-col gap-6 sm:max-w-md">
				<SheetHeader className="text-left">
					<SheetTitle>Update task</SheetTitle>
					<SheetDescription>
						Update the task details and save the changes
					</SheetDescription>
				</SheetHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>File name</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Do a kickflip"
											className="resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Status</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger className="capitalize">
												<SelectValue placeholder="Select a status" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectGroup>
												{Object.values(EvidenceStatus).map((item) => (
													<SelectItem
														key={item}
														value={item}
														className="capitalize"
													>
														{item}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* File upload below */}
						<div className="flex flex-col">
							<Label htmlFor="file" className="mb-2">
								Upload File
							</Label>
							<Input
								type="file"
								id="file"
								name="file"
								onChange={handleFileChange}
								className={cn(
									"block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500",
									"file:mr-4 file:rounded-lg file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:font-semibold file:text-sm file:text-white hover:file:bg-blue-600",
								)}
							/>
							{file && (
								<p className="mt-2 text-gray-500 text-sm">
									Selected file: {file.name}
								</p>
							)}
						</div>
						{/* file upload above */}
						<SheetFooter className="gap-2 pt-2 sm:space-x-0">
							<SheetClose asChild>
								<Button type="button" variant="outline">
									Cancel
								</Button>
							</SheetClose>
							<Button disabled={isCreatePending}>
								{isCreatePending && (
									<ReloadIcon
										className="mr-2 size-4 animate-spin"
										aria-hidden="true"
									/>
								)}
								Save
							</Button>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
}
