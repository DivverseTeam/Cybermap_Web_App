"use client";

import React, { useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/app/_components/ui/accordion";

import { User, X } from "lucide-react";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { Progress } from "~/app/_components/ui/progress";
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
import { ViewControlSheet } from "./view-control-sheet";

type Props = {
  frameworkCategory: any;
};

export default function CategoryCard({ frameworkCategory }: Props) {
  const [showViewControlSheet, setShowViewControlSheet] = useState(false);

  return (
    <div className="mb-3 rounded-md bg-muted p-4 text-secondary-foreground">
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
          {frameworkCategory.controlGroup.map((group: any, _key: any) => (
            <AccordionContent key={group.name}>
              <div className="flex flex-col rounded-sm bg-white px-4 py-5">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-secondary-foreground">
                      {group.name}
                    </h5>
                    <ViewControlSheet
                      open={showViewControlSheet}
                      onOpenChange={setShowViewControlSheet}
                      control={group}
                    />
                  </div>
                  <div className="p-3">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow className="font-extrabold text-muted text-xs">
                          <TableHead className="w-3/5 ">CONTROL</TableHead>
                          <TableHead>STATUS</TableHead>
                          <TableHead>ASSIGNED TO</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="font-normal text-xs">
                        {group.controls.map((control: any, _key: any) => (
                          <TableRow key={control.name}>
                            <TableCell className="flex flex-col font-medium ">
                              <span>{control.name}</span>
                              <span className="text-secondary">
                                {control.description}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                {control.evidencesCollected ===
                                  control.evidencesExpected && (
                                  <span className="flex h-4 items-center justify-center rounded-full bg-[#008743]/20 font-semibold text-[#008743] text-[10px]">
                                    Fully Implemented
                                  </span>
                                )}
                                {control.evidencesCollected > 0 &&
                                  control.evidencesCollected <
                                    control.evidencesExpected && (
                                    <span className="flex h-4 items-center justify-center rounded-full bg-[#C65C10]/20 px-1 font-semibold text-[#C65C10] text-[10px]">
                                      Partially Implemented
                                    </span>
                                  )}
                                {control.evidencesCollected === 0 && (
                                  <span className="flex h-4 items-center justify-center rounded-full bg-destructive/20 font-semibold text-[10px] text-destructive">
                                    Not Implemented
                                  </span>
                                )}
                                {/* <Progress
                                value={
                                  (+control.evidencesCollected /
                                    +control.evidencesExpected) *
                                  100
                                }
                              /> */}
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold ">
                              {control.assignedTo}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </AccordionContent>
          ))}
        </AccordionItem>
      </Accordion>
    </div>
  );
}
