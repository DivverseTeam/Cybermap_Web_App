"use client";

import { PlusSignIcon } from "hugeicons-react";
import { CloudUpload, FileSpreadsheet, X } from "lucide-react";
import { useRef, useState } from "react";

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
import { api } from "~/trpc/react";
import type { EmployeeType } from "~/server/models/Employee";
import { Progress } from "~/app/_components/ui/progress";

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
  const {
    mutate: addEmployees,
    isPending,

    error,
  } = api.employees.addEmployees.useMutation();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fileData, setFileData] = useState<EmployeeType[]>([]);
  const [file, setFile] = useState<File | undefined>();

  const [preview, setPreview] = useState<string | undefined>("");

  const [processingProgress, setProcessingProgress] = useState<
    number | undefined
  >(undefined);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setPreview("");
    resetFileInput();
    setFile(undefined);
    const droppedFile = e.dataTransfer.files[0]; // Get the first file
    if (droppedFile) {
      processFile(droppedFile); // Process the dropped file
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]; // Get the first file
    if (selectedFile) {
      processFile(selectedFile); // Process the selected file
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const processFile = (file: File) => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    setProcessingProgress(0); // Reset progress at the start

    const reader = new FileReader();
    // if (file.size > 10 * 1024 * 1024) {
    //   // 10MB limit
    //   alert("File size exceeds 10MB.");
    //   return;
    // }
    reader.onload = (event) => {
      const binaryData = event.target?.result;

      if (binaryData) {
        setProcessingProgress(30); // File reading complete (30%)

        const workbook = XLSX.read(binaryData, { type: "binary" });
        if (workbook.SheetNames.length === 0) {
          console.error("No sheets found in the workbook.");
          alert("The uploaded file does not contain any sheets.");
          return;
        }
        setProcessingProgress(50); // Workbook parsed (50%)

        const sheetName = workbook.SheetNames[0] || "Sheet 1"; // Get the first sheet
        const worksheet = workbook.Sheets[sheetName];
        // Ensure the worksheet is valid
        if (!worksheet) {
          console.error(`Sheet "${sheetName}" not found.`);
          alert(`The sheet "${sheetName}" is missing.`);
          return;
        }
        const jsonData: EmployeeType[] = XLSX.utils.sheet_to_json(worksheet); // Convert to JSON
        setPreview(JSON.stringify(jsonData[0]));
        setProcessingProgress(90); // Data conversion complete (90%)

        setFileData(jsonData); // Save data as an array of objects
        setProcessingProgress(100); // Processing complete (100%)
      }
    };
    reader.readAsBinaryString(file);
  };
  const handleFileUpload = () => {
    addEmployees(fileData, {
      onSuccess: (data) => {
        toast.success(data?.message);
        setPreview("");
        resetFileInput();
        setFile(undefined);
        onOpenChange?.(false);
        window.location.reload();
      },
      onError: (err) => {
        console.error("Error:", err);
        toast.error(
          "Failed to upload employees! Please review the csv file and try again"
        );
        setPreview(error?.message);
        resetFileInput();
        setFile(undefined);
      },
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) {
      // Convert to MB if size >= 1MB
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      // Otherwise, show in KB
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the input value
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
          <div className="flex w-full flex-col justify-center gap-4 overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Admin employee upload</DialogTitle>
              <DialogDescription>
                Upload the appropriate csv or excel sheet
              </DialogDescription>
            </DialogHeader>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="flex mt-2 h-44 w-full cursor-pointer items-center justify-center rounded-sm border border-gray-200 border-dashed bg-gray-50 hover:border-secondary"
            >
              {file ? (
                <ul>
                  <li className="text-gray-700 text-sm">{file.name}</li>
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-between gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <CloudUpload className="h-20 w-20 text-[#E0E1E6]" />
                    <div className="flex flex-col gap-2 text-gray-500 text-xs">
                      <span>Select a file or drag and drop here</span>
                      <span>CSV o XLSX file no more than 10mb</span>
                    </div>
                  </div>
                  <Label
                    htmlFor="fileUpload"
                    className=" cursor-pointer rounded-sm font-light border border-secondary bg-gray-50 px-14 py-1.5 text-secondary text-xs hover:bg-gray-200"
                  >
                    Select File
                  </Label>
                </div>
              )}
            </div>
            <input
              type="file"
              id="fileUpload"
              ref={fileInputRef}
              className="hidden"
              accept=".xlsx, .xls"
              onChange={handleFileSelect}
            />
            {file && processingProgress && (
              <div className="flex flex-col mt-4 rounded-md border bg-gray-100 p-4 gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-2 items-center">
                    <FileSpreadsheet className="w-8 h-8" />
                    <div className="flex-flex-col gap-2">
                      <p className="font-normal">{file.name}</p>
                      <span className="text-secondary text-xs">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-end flex-col gap-2">
                    <X
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => {
                        setPreview("");
                        resetFileInput();
                        setFile(undefined);
                      }}
                    />

                    <span className="text-secondary text-xs">
                      {processingProgress}%
                    </span>
                  </div>
                </div>
                <Progress value={processingProgress} />
              </div>
            )}
            <div className="mt-4">
              {fileData ? (
                <pre
                  className={`"max-h-32 h-10 overflow-auto w-full pb-5" ${
                    error && "text-destructive"
                  }`}
                >
                  {preview}
                </pre>
              ) : (
                <p>No data uploaded yet.</p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setPreview("");
                  resetFileInput();
                  setFile(undefined);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant={"default"}
              loading={isPending}
              type="submit"
              className="px-10"
              onClick={handleFileUpload}
            >
              Import
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
