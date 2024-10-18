"use client";

import React, { useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/app/_components/ui/accordion";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/_components/ui/table";
import { Button } from "~/app/_components/ui/button";
import { Progress } from "~/app/_components/ui/progress";
import { User, X } from "lucide-react";
import { Input } from "~/app/_components/ui/input";

type Props = {
  frameworkCategory: any;
};

const controlDetailsData = [
  [
    <span className="text-secondary w-24 ">Name</span>,
    <span className="text-secondary-foreground">
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
    <span className="text-secondary-foreground">RSK-3</span>,
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
    <span className="rounded-xl px-2 flex items-center h-4 bg-orange-800/20 text-orange-800">
      Partially Implemented
    </span>,
  ],
  [
    <span className="text-secondary w-24">Note</span>,
    ,
    <span className="text-secondary">Add a note...</span>,
  ],
];

export default function CategoryCard({ frameworkCategory }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleAddControlModal = () => {
    setIsModalOpen(!isModalOpen);
    console.log("modal opened");
  };

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
    <div className="rounded-md bg-muted p-4 w-[736px] mb-3 text-secondary-foreground">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        key={frameworkCategory.name}
      >
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            {frameworkCategory.name}
          </AccordionTrigger>
          {frameworkCategory.controlGroup.map((group: any, key: any) => (
            <AccordionContent key={group.name}>
              <div className="p-4 flex flex-col bg-white rounded-sm">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <h5 className="font-bold text-secondary-foreground">
                      {group.name}
                    </h5>
                    <Button variant="outline" onClick={toggleAddControlModal}>
                      Add control
                    </Button>
                  </div>
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="font-extrabold text-muted text-xs">
                        <TableHead className="w-3/5">CONTROL</TableHead>
                        <TableHead>PROGRESS</TableHead>
                        <TableHead>ASSIGNED TO</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs font-normal">
                      {group.controls.map((control: any, key: any) => (
                        <TableRow key={control.name}>
                          <TableCell className="font-medium flex flex-col ">
                            <span>{control.name}</span>
                            <span className="text-secondary">
                              {control.description}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>
                                {control.evidencesCollected}/
                                {control.evidencesExpected}
                              </span>
                              <Progress
                                value={
                                  (+control.evidencesCollected /
                                    +control.evidencesExpected) *
                                  100
                                }
                              />
                            </div>
                          </TableCell>
                          <TableCell>{control.assignedTo}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </AccordionContent>
          ))}
        </AccordionItem>
      </Accordion>

      {/* Add Control Modal */}
      {isModalOpen && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-99`}>
          <div
            className={`absolute overflow-y-scroll top-10 right-0 h-full w-1/3 bg-white p-6 flex flex-col gap-5 text-sm transition-transform duration-300 ease-in-out ${
              isModalOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex justify-between mt-6">
              <h2 className="text-lg font-bold mb-4">View Control</h2>
              <span
                className="text-secondary-foreground px-4 py-2 rounded-md cursor-pointer"
                onClick={toggleAddControlModal}
              >
                <X />
              </span>
            </div>
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
                          <td
                            key={cellIndex}
                            className="p-2 px-0 flex text-left"
                          >
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
                <Button
                  variant="outline"
                  className="hover:bg-white text-xs h-8"
                >
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
          </div>
        </div>
      )}
    </div>
  );
}
