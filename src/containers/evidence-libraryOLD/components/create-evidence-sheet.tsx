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
  SheetTrigger,
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
import { CreateEvidenceForm } from "./create-evidence-form";
// import { CreateEvidenceForm } from "./create-evidence-form";

interface CreateTaskFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateEvidenceSchema>;
  onSubmit: (data: CreateEvidenceSchema) => void;
}

export function CreateEvidenceSheet({ ...props }) {
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
      //   const { error } = await createEvidence(input);
      //   if (error) {
      //     toast.error(error);
      //     return;
      //   }
      //   form.reset();
      //     setOpen(false);
      //   toast.success("Evidence created");

      console.log("Creating...");
    });
  }

  return (
    <Sheet {...props}>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Update task</SheetTitle>
          <SheetDescription>
            Update the task details and save the changes
          </SheetDescription>
        </SheetHeader>
        <CreateEvidenceForm form={form} onSubmit={onSubmit}>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </CreateEvidenceForm>
      </SheetContent>
    </Sheet>
  );
}
