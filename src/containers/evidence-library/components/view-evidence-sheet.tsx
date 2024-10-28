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
} from "~/app/_components/ui/sheet";
import { Textarea } from "~/app/_components/ui/textarea";

// import { updateEvidence } from "../_lib/actions";
// import {
//   EvidenceStatus,
//   updateEvidenceSchema,
//   type UpdateEvidenceSchema,
// } from "../_lib/validations";
// import { Evidence } from "../_lib/queries";
import { useEffect, useTransition } from "react";
import { IEvidence } from "../types";
import { type Row } from "@tanstack/react-table";
import { User } from "lucide-react";

interface ViewEvidenceSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  evidence: Row<IEvidence>["original"];
}

function StatusLabel({ status }: any) {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "updated":
        return "bg-green-700/20 text-green-700  rounded-xl px-2 font-semibold flex items-center h-4";
      case "needs artifact":
        return "bg-destructive/20 text-destructive rounded-xl px-2 font-semibold flex items-center h-4";
    }
  };

  return (
    <span className={`px-2 py-1 rounded ${getStatusStyle(status)}`}>
      {status}
    </span>
  );
}

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
    <span className="text-secondary w-24">Owner</span>,
    <Button
      variant="outline"
      className="flex items-center justify-between h-6 font-semibold text-xs gap-2 text-secondary"
    >
      <User size={14} />
      Amanda owner
    </Button>,
  ],
  [
    <span className="text-secondary w-24">Status</span>,
    <StatusLabel status="Updated" />,
  ],
  [
    <span className="text-secondary w-24">Implementation Guidance</span>,
    <span className="text-secondary ">
      The company has a documented risk management program in place that
      includes guidance on the identification of potential threats, rating the
      significance of the risks associated with the ientified threats, and
      mitigration strategies for those risks,
    </span>,
  ],
];

export function ViewEvidenceSheet({
  evidence,
  open,
  onOpenChange,
  ...props
}: ViewEvidenceSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} {...props}>
      <SheetContent className="flex flex-col gap-6 overflow-y-auto h-full">
        <SheetHeader className="text-left">
          <SheetTitle>View evidence</SheetTitle>
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
      </SheetContent>
    </Sheet>
  );
}
