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
import Link from "next/link";
import Image from "next/image";

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
  const [{ all: allIntegrations }] = api.integrations.get.useSuspenseQuery();

  const isDesktop = useMediaQuery("(min-width: 640px)");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fileData, setFileData] = useState<EmployeeType[]>([]);
  const [file, setFile] = useState<File | undefined>();

  const [preview, setPreview] = useState<string | undefined>("");

  const [processingProgress, setProcessingProgress] = useState<number>(0);

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

  type ProcessStep = {
    delay: number;
    progress: number;
  };

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

      if (!binaryData) {
        toast.error("Error reading the file. Please try again.");
        return;
      }

      try {
        const workbook: XLSX.WorkBook = XLSX.read(binaryData, {
          type: "binary",
        });

        const processSteps: ProcessStep[] = [
          { delay: 500, progress: 30 }, // File reading complete
          { delay: 1000, progress: 50 }, // Workbook parsed
          { delay: 1000, progress: 70 }, // Sheet selected and validated
          { delay: 1000, progress: 90 }, // Data converted to JSON
          { delay: 500, progress: 100 }, // Processing complete
        ];

        let currentStep = 0;

        const simulateProcessing = (): void => {
          const step = processSteps[currentStep];

          if (step) {
            const { delay, progress } = step;

            setTimeout(() => {
              setProcessingProgress(progress);

              // Perform actions at specific progress stages
              if (progress === 50) {
                // Validate workbook
                if (workbook.SheetNames.length === 0) {
                  toast.error("The uploaded file does not contain any sheets.");
                  return;
                }
              }

              if (progress === 70) {
                // Validate and process the first sheet
                const sheetName: string = workbook.SheetNames[0] || "Sheet1";
                const worksheet: XLSX.WorkSheet | undefined =
                  workbook.Sheets[sheetName];

                if (!worksheet) {
                  toast.error(`The sheet "${sheetName}" is missing.`);
                  return;
                }
              }

              if (progress === 90) {
                // Convert the sheet to JSON
                const sheetName: string = workbook.SheetNames[0] || "Sheet1";
                const worksheet: XLSX.WorkSheet | undefined =
                  workbook.Sheets[sheetName];

                // Ensure the worksheet is valid
                if (!worksheet) {
                  console.error(`Sheet "${sheetName}" not found.`);
                  alert(`The sheet "${sheetName}" is missing.`);
                  return;
                }
                const jsonData: EmployeeType[] =
                  XLSX.utils.sheet_to_json(worksheet);

                setPreview(JSON.stringify(jsonData[0])); // Show a preview of the first record
                setFileData(jsonData); // Save the processed data
              }

              currentStep++;
              simulateProcessing(); // Move to the next step
            }, delay);
          }
        };

        simulateProcessing(); // Start the simulation
      } catch (error) {
        console.error("Error processing file:", error);
        toast.error(
          "An error occurred during file processing. Please try again."
        );
      }
    };

    reader.onerror = (): void => {
      toast.error("Failed to read the file. Please try again.");
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

        <DialogContent className="gap-6 h-[600px] 2xl:h-[800px] overflow-auto">
          <DialogHeader>
            <DialogTitle>Import employees</DialogTitle>
            <DialogDescription>
              Select a data source to import employees
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col text-secondary text-xs 2xl:text-md">
            <h3>FILE UPLOAD (csv)</h3>
            <Link
              // href={
              //   "https://cybermap-employeestemplate.s3.us-east-1.amazonaws.com/csv-files/employees-template.xlsx?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEA8aCXVzLWVhc3QtMSJIMEYCIQDQ3hJjTBDzLV943uYYt%2FvPclb8XCjWdFNNgucxtoGaSAIhAOibMWVWyJeA%2FLSEhEmQsUsGQ2FYsm%2FgEwxmWyMI5YMvKsAECNj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMOTA1NDE4Mjg0ODMyIgyQL6ecRm8D0gXxEiIqlARVTmMJSLaK0jCPDKIeRXYYaOCWLIA2OUT6Zz7gRIwrRM%2BNLP%2B82IwPWyAkUpBmRcQU1Vr%2FBL5PMj46uUYNdKwqdxS3PDUv87d82AoCm10MksFKX%2BHj%2BV%2FsvgVcONmckjhWOt6n%2BGHhwvaSohbZOkMzJQqG4lf4Ws32%2Fe%2FmqxxWJblCXt7cQU0%2B3TOXZ3Ts3%2FAMJ%2B0y1pHQVrzuZMaAJRoWz4XTWQa%2B4ePXzeSFDimSNopYSaLG46lkSLT59BI4sKmq5mG3DJHcEHwTZZE6wSMfBNWW6WkPsSReERx5wE1z8j3Spzf3V%2FYMU9kocHw71uJi5J7Zr1b2qutlenuAPqyDX6WNnUix%2FV44yzm0MKqq8h0FG47rZLdKAnZCgeG9BvlOY5tmLAInvYoDySEHjw19UcylxEZ1nxlMbJBqnnCG21djUys3zx8ayZG9NAoXVwAmtnAnpwO0ekPqTAnlkBIRkLijBiZ2llRSj1F9q1rjosjW43w0n61anxNTOYI9%2FhjjZ9EO%2FatSKu01hcb%2B%2FEbar4bI9Mb73fGWJbzqStsV0%2F7y%2Bqk23o15XqZ6uGCHTNMIti1JnrC0SNlImaFvEr85e2y4skvMz5osD4lpEmch4HMUhdKCF%2B2MUpiU6IGWhR%2F4RVMqik4eR4zlfdcUDCX%2B5L5LX7rsFR73Tr3wNfA%2BS0PPfsIxb2uZivT66uVslFd%2FTo%2FPMOvUpbsGOsQC1fFLG9aJclgDBPf%2FizzP4HIIwZUvV5XScOa6wCKz7IU93gYUM3jeOcfwZvJ4secgbr3lpwq%2BD6UXkp0v9eG3pXC8wBrQP%2BsxOpK31fW3Sgqy3Dh9Y8FYT64s%2BGy5eENvYQjY05tZJggjot4vz5Sp%2Bior5C8QzKFKjzEGwsBkZQKEQTqsOQ4Qmg953r0XBdw4Ym4mtOuVGFdWKppwe7yfaNGwuTtYgPOGHpCS72TFrdGRQJF4vL4FSa3PJpmLa26FwnAAPIVi4w8ZAhfcEsTiiFkrbB3CAc1u86DEmbbrWgiPLG7MHJ%2FUB8hBs3NEdmMPebkz%2FLCvsNGvm8kXbZ%2Fn%2FHe%2FOXpVlam2S2Mp1oP4y8uiCluuezEJxK%2BL3FAdKw9teksI0jo2aeG6HUdBBNPvO4FwkQVGMU1KpKZLjg9JauTiLyn8&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA5FTZCT4QOR5ZGYLT%2F20241223%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241223T144714Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=eb791b341fd955d22ff08f751f0296f79e80a09d93c624c87849a8a5c74e5adf"
              // }
              href={
                "https://cybermap-employeestemplate.s3.us-east-1.amazonaws.com/csv-files/employees-template.xlsx"
              }
              className="text-primary flex items-center"
              // target="_blank"
            >
              <span className="hover:underline">Download csv template</span>
              <FileSpreadsheet className="ml-1 w-3 h-3" />
            </Link>
            <div className="flex w-full flex-col justify-center gap-0 overflow-y-auto">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="flex mt-4 py-4 h-48 w-full cursor-pointer items-center justify-center rounded-sm border border-gray-200 border-dashed bg-gray-50 hover:border-secondary"
              >
                {file ? (
                  <ul>
                    <li className="text-gray-700 text-sm">{file.name}</li>
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-between gap-2">
                    <div className="flex flex-col items-center justify-between gap-3">
                      <CloudUpload className="h-16 w-16 text-[#E0E1E6] text-xs" />
                      <div className="flex flex-col gap-2 text-gray-500 text-xs">
                        <span>Select a file or drag and drop here</span>
                        <span>CSV or XLSX file no more than 10mb</span>
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
              {file && (
                <div className="flex flex-col mt-0 rounded-md border bg-gray-100 p-4 gap-2">
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
              <div className="">
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
            <DialogFooter className="flex flex-col sm:flex-col sm:space-x-0 gap-1 w-full">
              <Button
                aria-label="import employees from csv"
                variant={"default"}
                loading={isPending}
                type="submit"
                className="h-8"
                onClick={handleFileUpload}
                disabled={processingProgress < 100}
              >
                Import
              </Button>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="h-8"
                  onClick={() => {
                    setPreview("");
                    resetFileInput();
                    setFile(undefined);
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
          <div className="flex gap-4 items-center w-full text-secondary">
            <div className="h-[2px] w-1/2 bg-muted"></div>
            <span>OR</span>
            <div className="h-[2px] w-1/2 bg-muted"></div>
          </div>
          <div className="flex flex-col gap-2 text-secondary text-xs 2xl:text-md">
            <h3>AVAILABLE INTEGRATIONS</h3>
            <div className="flex flex-col">
              {allIntegrations.map((integration, idx) => (
                <div
                  key={idx}
                  className="flex justify-between border items-center p-3 rounded-lg mb-1"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={integration.image}
                      alt={`${integration.name} logo`}
                      width={30}
                      height={30}
                      className="border rounded-sm p-1"
                    />
                    <span className="font-medium text-black text-sm">
                      {integration.name}
                    </span>
                  </div>
                  <Button variant={"outline"} className="h-6 text-xs">
                    Import data
                  </Button>
                </div>
              ))}
            </div>
          </div>
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
