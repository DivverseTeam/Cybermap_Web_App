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

import type { Row } from "@tanstack/react-table";
import { User } from "lucide-react";
// import { updateEvidence } from "../_lib/actions";
// import {
//   EvidenceStatus,
//   updateEvidenceSchema,
//   type UpdateEvidenceSchema,
// } from "../_lib/validations";
// import { Evidence } from "../_lib/queries";
import { useEffect, useTransition } from "react";
import type { IEvidence } from "../types";
import type { VariantProps } from "class-variance-authority";
import { Badge, type badgeVariants } from "~/app/_components/ui/badge";

interface ViewEvidenceSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  evidence: Row<IEvidence>["original"];
}

type StatusLabelProps = {
  status: string;
};

function StatusLabel({ status }: StatusLabelProps) {
  let badgeVariant: VariantProps<typeof badgeVariants>["variant"];

  if (status.toLowerCase() === "not implemented") {
    badgeVariant = "destructive";
  }

  if (status.toLowerCase() === "fully implemented") {
    badgeVariant = "success";
  }

  return (
    <Badge className="w-max font-semibold" variant={badgeVariant}>
      {status}
    </Badge>
  );
}

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
    <span className="w-24 text-secondary">Owner</span>,
    <Button
      variant="outline"
      className="flex h-6 items-center justify-between gap-2 font-semibold text-secondary text-xs"
    >
      <User size={14} />
      Amanda owner
    </Button>,
  ],
  [
    <span className="w-24 text-secondary">Status</span>,
    <StatusLabel status="Updated" />,
  ],
  [
    <span className="w-24 text-secondary">Implementation Guidance</span>,
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
      <SheetContent className="flex h-full flex-col gap-6 overflow-y-auto">
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
      </SheetContent>
    </Sheet>
  );
}
