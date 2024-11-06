"use client";

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
	SheetTrigger,
} from "~/app/_components/ui/sheet";
import { Textarea } from "~/app/_components/ui/textarea";

// import { IEvidence } from "../types";
import type { Row } from "@tanstack/react-table";
import { User, X } from "lucide-react";
// import { updateEvidence } from "../_lib/actions";
// import {
//   EvidenceStatus,
//   updateEvidenceSchema,
//   type UpdateEvidenceSchema,
// } from "../_lib/validations";
// import { Evidence } from "../_lib/queries";
import { useEffect, useRef, useTransition } from "react";
import { Input } from "~/app/_components/ui/input";

const controlDetailsData = [
	[
		<span className="text-secondary w-24 ">Name</span>,
		<span className="text-secondary-foreground font-semibold">
			Risk management program established
		</span>,
	],
	[
		<span className="text-secondary w-24">Description</span>,
		<span className="text-secondary ">
			The company has a documented risk management program in place that
			includes guidance on the identification of potential threats, rating the
			significance of the risks associated with the ientified threats, and
			mitigration strategies for those risks,
		</span>,
	],
	[
		<span className="text-secondary w-24">ID</span>,
		<span className="text-secondary-foreground font-semibold">RSK-3</span>,
	],
	[
		<span className="text-secondary w-24">Assigned To</span>,
		<Button
			variant="outline"
			className="flex items-center justify-between h-6 font-semibold text-xs gap-2 text-secondary"
		>
			<User size={14} />
			Assign owner
		</Button>,
	],
	[
		<span className="text-secondary w-24">Control Status</span>,
		<span className="rounded-xl px-2 font-semibold flex items-center h-4 bg-[#C65C10]/20 text-[#C65C10]">
			Partially Implemented
		</span>,
	],
	[
		<span className="text-secondary w-24">Note</span>,
		,
		<span className="text-secondary">Add a note...</span>,
	],
];

interface ViewControlSheetProps
	extends React.ComponentPropsWithRef<typeof Sheet> {
	control: any;
}

export function ViewControlSheet({
	control,
	open,
	onOpenChange,
	...props
}: ViewControlSheetProps) {
	const [isUpdatePending, startUpdateTransition] = useTransition();
	// console.log("control", control);

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleEvidenceUpload = (event: any) => {
		const file = event.target.files[0];
		if (file) {
			// Handle the file upload logic here
			console.log("Uploaded file:", file.name);
		}
	};

	const triggerEvidenceUpload = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange} {...props}>
			<SheetTrigger asChild>
				<Button variant="outline">View Control</Button>
			</SheetTrigger>
			<SheetContent className="flex flex-col gap-6 overflow-y-auto h-full">
				<SheetHeader className="text-left">
					<SheetTitle>View Control {control.id}</SheetTitle>
					{/* <SheetDescription>
            Update the task details and save the changes
          </SheetDescription> */}
				</SheetHeader>
				<div className="flex flex-col gap-3">
					{/* Control details */}
					{/* <div className="flex justify-start  gap-7">
                <span className="text-secondary">Name</span>
                <span className="text-secondary-foreground">Control name</span>
              </div> */}
					<div className="text-xs">
						<table className=" w-full">
							<tbody>
								{controlDetailsData.map((row, index) => (
									<tr key={index} className="flex text-left gap-3">
										{row.map((cell, cellIndex) => (
											<td key={cellIndex} className="p-2 px-0 flex text-left">
												{cell}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
				<div className="flex flex-col rounded-md gap-4 border text-xs">
					{/* control evidences */}
					<div className="flex justify-between items-center bg-muted px-4 py-2 rounded-md border-none">
						<h4 className="font-semibold">Control Evidence</h4>
						<Input
							type="file"
							ref={fileInputRef}
							onChange={handleEvidenceUpload}
							className="hidden"
						/>
						<Button
							variant="outline"
							className="hover:bg-white text-xs h-8"
							onClick={triggerEvidenceUpload}
						>
							Upload Evidence
						</Button>
					</div>
					<div className="flex flex-col gap-4 text-xs py-4 ">
						<div className="flex justify-between items-center px-4">
							<p>Control Evidence 123.pdf</p>
							<div className="flex gap-2">
								<Button variant="outline" className="h-7 text-xs">
									View
								</Button>
								<Button variant="outline" className="h-7 text-xs">
									Download
								</Button>
							</div>
						</div>
						<div className="flex justify-between items-center px-4">
							<p>Control Evidence 123.pdf</p>
							<div className="flex gap-2">
								<Button variant="outline" className="h-7 text-xs">
									View
								</Button>
								<Button variant="outline" className="h-7 text-xs">
									Download
								</Button>
							</div>
						</div>
						<div className="flex justify-between items-center px-4">
							<p>Control Evidence 123.pdf</p>
							<div className="flex gap-2">
								<Button variant="outline" className="h-7 text-xs">
									View
								</Button>
								<Button variant="outline" className="h-7 text-xs">
									Download
								</Button>
							</div>
						</div>
					</div>
				</div>
				<div className=" flex flex-col rounded-md gap-4 border text-xs mb-20">
					{/* mapped controls */}
					<div className="flex justify-between items-center bg-muted px-4 py-2 rounded-md border-none">
						<h4 className="font-semibold">Mapped Controls</h4>
						<Button variant="outline" className="hover:bg-white text-xs h-8">
							Add new
						</Button>
					</div>
					<div className="flex flex-wrap p-5 gap-2">
						<p className="rounded-md bg-muted px-2 py-1 flex items-center gap-1">
							SDC 2 - CC1.2 <X size={14} />
						</p>
						<p className="rounded-md bg-muted px-2 py-1  flex items-center gap-1">
							SDC 2 - CC1.2 <X size={14} />
						</p>
						<p className="rounded-md bg-muted px-2 py-1 flex items-center gap-1">
							SDC 2 - CC1.2 <X size={14} />
						</p>
						<p className="rounded-md bg-muted px-2 py-1 flex items-center gap-1">
							SDC 2 - CC1.2 <X size={14} />
						</p>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
