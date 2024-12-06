import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/app/_components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import {
  Sheet,
  // SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/app/_components/ui/sheet";

const controlDetailsData = [
  {
    name: "name",
    label: () => <span className="w-24 text-secondary ">Name</span>,
    input: (field: any) => (
      <Input placeholder="Enter a name..." className="border-none" {...field} />
    ),
  },
  {
    name: "description",
    label: () => <span className="w-24 text-secondary ">Description</span>,
    input: (field: any) => (
      <Input
        placeholder="Add description..."
        className="border-none"
        {...field}
      />
    ),
  },
  {
    name: "button",
    label: () => <span className="w-24 text-secondary">Owner</span>,
    input: () => (
      <Button
        variant="outline"
        className="flex h-6 items-center justify-between gap-2 font-semibold text-secondary text-xs"
      >
        <User size={14} />
        Amanda owner
      </Button>
    ),
  },

  {
    name: "implementationGuidance",
    label: () => (
      <span className="w-24 text-secondary">Implementation Guidance</span>
    ),
    input: (field: any) => (
      <Input className="border-none" placeholder="Add a note..." {...field} />
    ),
  },
];

export function NewControlSheet() {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const formSchema = z.object({
    name: z.string().email(),
    description: z.string(),
    implementationGuidance: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      implementationGuidance: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Create new control</Button>
      </SheetTrigger>
      {/* <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-black"
        > */}
      <SheetContent className="flex h-full flex-col gap-6 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create control</SheetTitle>
          {/* <SheetDescription>
            Make changes to your profile here. Click save when you're done.
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
                    <td className="flex p-2 px-0 text-left">{row.label()}</td>
                    {row.name === "button" ? (
                      <td className="flex p-2 px-0 text-left">
                        {row.input(null)}
                      </td>
                    ) : (
                      <FormField
                        control={form.control}
                        name={row["name"] as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <td className="flex p-2 px-0 text-left">
                                {row.input(field)}
                              </td>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex h-36 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 hover:border-secondary"
          >
            {files.length ? (
              <ul>
                {files.map((file: File, index: number) => (
                  <li key={index} className="text-gray-700 text-sm">
                    {file.name}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-between gap-20">
                <div className="flex items-center justify-between gap-3">
                  <CloudUpload className="h-20 w-20 text-[#E0E1E6]" />
                  <div className="flex flex-col gap-2 text-gray-500 text-xs">
                    <span>Select a file or drag and drop here</span>
                    <span>CSV o XLSX file no more than 10mb</span>
                  </div>
                </div>
                <Label
                  htmlFor="fileUpload"
                  className="mt-4 cursor-pointer rounded-md border-2 border-secondary bg-gray-50 px-4 py-2 text-secondary text-xs hover:bg-muted"
                >
                  SELECT FILE
                </Label>
              </div>
            )}
          </div>
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            multiple
            onChange={handleFileSelect}
          />
        </div>

        <SheetFooter>
          {/* <SheetClose asChild>
              </SheetClose> */}
          <Button type="submit">Save changes</Button>
        </SheetFooter>
      </SheetContent>
      {/* </form>
      </Form> */}
    </Sheet>
  );
}
