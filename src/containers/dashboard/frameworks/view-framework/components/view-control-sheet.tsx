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
    <span className="w-24 text-secondary ">Name</span>,
    <span className="font-semibold text-secondary-foreground">
      Risk management program established
    </span>,
  ],
  [
    <span className="w-24 text-secondary">Description</span>,
    <span className="text-secondary ">
      The company has a documented risk management program in place that
      includes guidance on the identification of potential threats, rating the
      significance of the risks associated with the ientified threats, and
      mitigration strategies for those risks,
    </span>,
  ],
  [
    <span className="w-24 text-secondary">ID</span>,
    <span className="font-semibold text-secondary-foreground">RSK-3</span>,
  ],
  [
    <span className="w-24 text-secondary">Assigned To</span>,
    <Button
      variant="outline"
      className="flex h-6 items-center justify-between gap-2 font-semibold text-secondary text-xs"
    >
      <User size={14} />
      Assign owner
    </Button>,
  ],
  [
    <span className="w-24 text-secondary">Control Status</span>,
    <span className="flex h-4 items-center rounded-xl bg-[#C65C10]/20 px-2 font-semibold text-[#C65C10]">
      Partially Implemented
    </span>,
  ],
  [
    <span className="w-24 text-secondary">Note</span>,
    ,
    <span className="text-secondary">Add a note...</span>,
  ],
];

interface ViewControlSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  control: any;
  open: any;
  onOpenChange: any;
}

export function ViewControlSheet({
  control,
  open,
  onOpenChange,
  ...props
}: ViewControlSheetProps) {
  const [_isUpdatePending, _startUpdateTransition] = useTransition();
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
      <SheetContent className="flex h-full flex-col gap-6 overflow-y-auto">
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
                  <tr key={index} className="flex gap-3 text-left">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="flex p-2 px-0 text-left">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-md border text-xs">
          {/* control evidences */}
          <div className="flex items-center justify-between rounded-md border-none bg-muted px-4 py-2">
            <h4 className="font-semibold">Control Evidence</h4>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleEvidenceUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              className="h-8 text-xs hover:bg-white"
              onClick={triggerEvidenceUpload}
            >
              Upload Evidence
            </Button>
          </div>
          <div className="flex flex-col gap-4 py-4 text-xs ">
            <div className="flex items-center justify-between px-4">
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
            <div className="flex items-center justify-between px-4">
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
            <div className="flex items-center justify-between px-4">
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
        <div className=" mb-20 flex flex-col gap-4 rounded-md border text-xs">
          {/* mapped controls */}
          <div className="flex items-center justify-between rounded-md border-none bg-muted px-4 py-2">
            <h4 className="font-semibold">Mapped Controls</h4>
            <Button variant="outline" className="h-8 text-xs hover:bg-white">
              Add new
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 p-5">
            <p className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
              SDC 2 - CC1.2 <X size={14} />
            </p>
            <p className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
              SDC 2 - CC1.2 <X size={14} />
            </p>
            <p className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
              SDC 2 - CC1.2 <X size={14} />
            </p>
            <p className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
              SDC 2 - CC1.2 <X size={14} />
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
