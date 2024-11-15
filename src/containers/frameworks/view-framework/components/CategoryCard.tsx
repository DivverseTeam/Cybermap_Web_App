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
import type { ICategory, IControl, IControlGroup } from "../types";
import { Badge } from "~/app/_components/ui/badge";

type Props = {
  frameworkCategory: ICategory;
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
          {frameworkCategory.controlGroup.map((group: IControlGroup) => (
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
                        {group.controls.map((control: IControl) => (
                          <TableRow key={control.name}>
                            <TableCell className="flex flex-col font-medium ">
                              <span>{control.name}</span>
                              <span className="text-secondary">
                                {control.description}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col w-max p-2">
                                {control.evidencesCollected ===
                                  control.evidencesExpected && (
                                  <Badge
                                    className="w-max font-semibold"
                                    variant="success"
                                  >
                                    Fully Implemented
                                  </Badge>
                                )}
                                {control.evidencesCollected > 0 &&
                                  control.evidencesCollected <
                                    control.evidencesExpected && (
                                    <Badge
                                      className="w-max font-semibold"
                                      variant="warning"
                                    >
                                      Partially Implemented
                                    </Badge>
                                  )}
                                {control.evidencesCollected === 0 && (
                                  <Badge
                                    className="w-max font-semibold"
                                    variant="destructive"
                                  >
                                    Not Implemented
                                  </Badge>
                                )}
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
