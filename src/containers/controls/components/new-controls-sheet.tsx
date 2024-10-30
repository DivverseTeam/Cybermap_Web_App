import { CloudUpload, User } from "lucide-react";
import { useState } from "react";
import { Button } from "~/app/_components/ui/button";
import { FormLabel } from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
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
    <span className="text-secondary w-24">Implementation Guidance</span>,
    <span className="text-secondary ">
      The company has a documented risk management program in place that
      includes guidance on the identification of potential threats, rating the
      significance of the risks associated with the ientified threats, and
      mitigration strategies for those risks,
    </span>,
  ],
];

export function NewControlSheet() {
  const [files, setFiles] = useState<any>([]);

  const handleDrop = (e: any) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  };

  const handleFileSelect = (e: any) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles: any) => [...prevFiles, ...selectedFiles]);
  };

  const handleDragOver = (e: any) => e.preventDefault();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Create new evidence</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto h-full flex flex-col gap-6">
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
        <div className="flex flex-col items-center justify-center w-full">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex items-center bg-muted justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-secondary"
          >
            {files.length ? (
              <ul>
                {files.map((file: any, index: any) => (
                  <li key={index} className="text-sm text-gray-700">
                    {file.name}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-between gap-20">
                <div className="flex items-center justify-between gap-3">
                  <CloudUpload className="w-20 h-20 text-secondary" />
                  <div className="text-gray-500 flex flex-col gap-2 text-xs">
                    <span>Select a file or drag and drop here</span>
                    <span>CSV o XLSX file no more than 10mb</span>
                  </div>
                </div>
                <Label
                  htmlFor="fileUpload"
                  className="mt-4 px-4 py-2 bg-muted border-secondary border-2 text-xs text-secondary rounded-md cursor-pointer hover:bg-secondary-foreground/20"
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
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
