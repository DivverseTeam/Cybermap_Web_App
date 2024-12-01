"use client";

import { PlusSignIcon } from "hugeicons-react";
import { CloudUpload } from "lucide-react";
import { useState } from "react";

// import { useMediaQuery } from "~/hooks/use-media-query";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/app/_components/ui/drawer";
import { Label } from "~/app/_components/ui/label";
import { useMediaQuery } from "~/hooks/use-media-query";

import * as XLSX from "xlsx";
import { toast } from "sonner";

// import { Evidence } from "../_lib/queries";

// import { deleteEvidences } from "../_lib/actions";

interface ImportEmployeesDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function ImportEmployeeDialog({
  showTrigger = true,
  onSuccess,
  open,
  onOpenChange,
  ...props
}: ImportEmployeesDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const [fileData, setFileData] = useState<object[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string>("");

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0]; // Get the first file
    if (droppedFile) {
      setFile(droppedFile);
      processFile(droppedFile); // Process the dropped file
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]; // Get the first file
    if (selectedFile) {
      setFile(selectedFile);
      processFile(selectedFile); // Process the selected file
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const processFile = (file: File) => {
    const reader = new FileReader();
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      alert("File size exceeds 10MB.");
      return;
    }
    reader.onload = (event) => {
      const binaryData = event.target?.result;

      if (binaryData) {
        const workbook = XLSX.read(binaryData, { type: "binary" });
        if (workbook.SheetNames.length === 0) {
          console.error("No sheets found in the workbook.");
          alert("The uploaded file does not contain any sheets.");
          return;
        }
        const sheetName = workbook.SheetNames[0] || "Sheet 1"; // Get the first sheet
        const worksheet = workbook.Sheets[sheetName];
        // Ensure the worksheet is valid
        if (!worksheet) {
          console.error(`Sheet "${sheetName}" not found.`);
          alert(`The sheet "${sheetName}" is missing.`);
          return;
        }
        const jsonData: {}[] = XLSX.utils.sheet_to_json(worksheet); // Convert to JSON
        setFileData(jsonData); // Save data as an array of objects

        setPreview(JSON.stringify(fileData[0], null, 2));
      }
    };
    reader.readAsBinaryString(file);
  };
  const handleFileUpload = async () => {
    try {
      setLoading(true);
      // const response = await fetch("/api/upload", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(fileData), // Convert the data to JSON
      // });
      const response = 1 + 1;

      // if (!response.ok) {
      //   setLoading(false);
      //   throw new Error(`Failed to upload data: ${response.statusText}`);
      // }

      // const result = await response.json();
      const result = await response;
      console.log("Employees Upload successful:", result);
      setLoading(false);
      toast("Employees uploaded successfully!");
      setFile(null);
    } catch (error) {
      console.error("Error uploading data:", error);
      setLoading(false);
      toast.error("Failed to upload data. Please try again.");
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="h-[36px] [@media(min-width:1400px)]:h-[44px] rounded-md text-secondary"
              size="sm"
            >
              <PlusSignIcon className="mr-2" />
              Import Employee
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <div className="flex w-full flex-col items-center justify-center gap-4 overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Admin employee upload</DialogTitle>
              <DialogDescription>
                Here you can manually import employees from your local file
                system
              </DialogDescription>
            </DialogHeader>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="flex h-36 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 hover:border-secondary"
            >
              {file ? (
                <ul>
                  <li className="text-gray-700 text-sm">{file.name}</li>
                </ul>
              ) : (
                <div className="flex items-center justify-between gap-10">
                  <div className="flex items-center justify-between gap-3">
                    <CloudUpload className="h-20 w-20 text-[#E0E1E6]" />
                    <div className="flex flex-col gap-2 text-gray-500 text-xs">
                      <span>Select a file or drag and drop here</span>
                      <span>CSV o XLSX file no more than 10mb</span>
                    </div>
                  </div>
                  <Label
                    htmlFor="fileUpload"
                    className="mt-4 cursor-pointer rounded-md border-2 border-secondary bg-gray-50 px-2 py-1 text-secondary text-xs hover:bg-muted"
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
            <div className="mt-4">
              {fileData.length > 0 ? (
                <pre className="max-h-32 overflow-auto">
                  {preview}
                  {/* Display only the first row */}
                </pre>
              ) : (
                <p>No data uploaded yet.</p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setFile(null)}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant={"default"}
              loading={loading}
              type="submit"
              onClick={handleFileUpload}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="h-[36px] [@media(min-width:1400px)]:h-[44px] rounded-md text-secondary"
            size="sm"
          >
            <PlusSignIcon className="mr-2" />
            Import Employee
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <div className="flex w-full flex-col items-center justify-center">
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-medium">(Evidence name)</span>
              from our servers.
            </DrawerDescription>
          </DrawerHeader>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex h-36 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 hover:border-secondary"
          >
            {file ? (
              <ul>
                <li className="text-gray-700 text-sm">{file.name}</li>
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
                  className="mt-4 cursor-pointer rounded-md border-2 border-secondary bg-gray-50 px-2 py-1 text-secondary text-xs hover:bg-muted"
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
            accept=".xlsx, .xls" //
            onChange={handleFileSelect}
          />
        </div>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button aria-label="Delete selected rows" variant="default">
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
