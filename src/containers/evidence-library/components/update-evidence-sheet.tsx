"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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

// import { updateEvidence } from "../_lib/actions";
import {
	EvidenceStatus,
	updateEvidenceSchema,
	type UpdateEvidenceSchema,
} from "../_lib/validations";
import { Evidence } from "../_lib/queries";

interface UpdateEvidenceSheetProps
	extends React.ComponentPropsWithRef<typeof Sheet> {
	evidence: Evidence;
}

export function UpdateEvidenceSheet({
	evidence,
	...props
}: UpdateEvidenceSheetProps) {
	const [isUpdatePending, startUpdateTransition] = React.useTransition();

	const form = useForm<UpdateEvidenceSchema>({
		resolver: zodResolver(updateEvidenceSchema),
		defaultValues: {
			name: evidence.name ?? "",
			status: evidence.status,
			// linkedControls: evidence.linkedControls,
			// renewalDate: evidence.renewalDate,
		},
	});

	React.useEffect(() => {
		form.reset({
			name: evidence.name ?? "",
			status: evidence.status,
			// label: evidence.label,
			// priority: evidence.priority,
		});
	}, [evidence, form]);

	function onSubmit(input: UpdateEvidenceSchema) {
		// startUpdateTransition(async () => {
		//   const { error } = await updateEvidence({
		//     id: evidence.id,
		//     ...input,
		//   });
		//   if (error) {
		//     toast.error(error);
		//     return;
		//   }
		//   form.reset();
		//   props.onOpenChange?.(false);
		//   toast.success("Evidence updated");
		// });
	}

	return (
		<Sheet {...props}>
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
									<FormLabel>Title</FormLabel>
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
							render={({ field }: any) => (
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
						{/* <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Select a priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {evidences.priority.enumValues.map((item: any) => (
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
            /> */}
						<SheetFooter className="gap-2 pt-2 sm:space-x-0">
							<SheetClose asChild>
								<Button type="button" variant="outline">
									Cancel
								</Button>
							</SheetClose>
							<Button disabled={isUpdatePending}>
								{isUpdatePending && (
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
