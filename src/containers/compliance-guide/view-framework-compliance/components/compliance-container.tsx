import type { VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/app/_components/ui/accordion";
import { Badge, type badgeVariants } from "~/app/_components/ui/badge";

type Props = {};

export default function ComplianceContainer({}: Props) {
  // let badgeVariant: VariantProps<typeof badgeVariants>["variant"];

  // if (status.toLowerCase() === "pending") {
  //   badgeVariant = "warning";
  // }

  // if (status.toLowerCase() === "completed") {
  //   badgeVariant = "success";
  // }

  return (
    <Accordion
      type="single"
      collapsible
      className="py-2 text-secondary text-sm"
    >
      {/* GENERAL */}
      <AccordionItem value="item-1">
        <AccordionTrigger className="rounded-sm bg-gray-100 p-3">
          <p>GENERAL</p>
          <div className="flex items-center">
            <p className="flex justify-end">1 module</p>

            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex items-center justify-between px-3 py-3 text-black">
          <p>Overview</p>
          <Badge className="w-max font-semibold" variant={"success"}>
            Completed
          </Badge>
        </AccordionContent>
      </AccordionItem>

      {/* START YOUR PROJECT */}
      <AccordionItem value="item-2">
        <AccordionTrigger className="rounded-sm bg-gray-100 p-3 px-1 ">
          <p>START YOUR PROJECT</p>
          <div className="flex items-center">
            <p className="flex justify-end">4 modules</p>

            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex items-center justify-between px-3 py-3 text-black">
          <p>What is an ISMS?</p>
          <Badge className="w-max font-semibold" variant={"success"}>
            Completed
          </Badge>
        </AccordionContent>
        <AccordionContent className="px-3 flex items-center justify-between py-3 text-black">
          <p>27001 Overview</p>
          <Badge className="w-max font-semibold" variant={"warning"}>
            Pending
          </Badge>
        </AccordionContent>
        <AccordionContent className="px-3 flex items-center justify-between py-3 text-black">
          <p>Choose the ISO</p>
          <Badge className="w-max font-semibold" variant={"warning"}>
            Pending
          </Badge>
        </AccordionContent>
        <AccordionContent className="px-3 flex items-center justify-between py-3 text-black">
          <p>Start to implement</p>
          <Badge className="w-max font-semibold" variant={"warning"}>
            Pending
          </Badge>
        </AccordionContent>
      </AccordionItem>

      {/* CONTEXT OF THE ORGANIZATION */}
      <AccordionItem value="item-3">
        <AccordionTrigger className="bg-gray-100 px-1 rounded-sm p-3 ">
          <p>4. CONTEXT OF THE ORGANIZATION</p>
          <div className="flex items-center">
            <p className="flex justify-end">4 modules</p>

            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 flex items-center justify-between py-3 text-black">
          <p>4.1 Understanding the organization and it’s context</p>
          <Badge className="w-max font-semibold" variant={"success"}>
            Completed
          </Badge>
        </AccordionContent>
        <AccordionContent className="px-3 flex items-center justify-between py-3 text-black">
          <p>
            4.2 Understanding the need and the expectations of the interested
            parties
          </p>
          <Badge className="w-max font-semibold" variant={"warning"}>
            Pending
          </Badge>
        </AccordionContent>
        <AccordionContent className="px-3 flex items-center justify-between py-3 text-black">
          <p>
            4.3 Determining the scope of the information security management
            system
          </p>
          <Badge className="w-max font-semibold" variant={"warning"}>
            Pending
          </Badge>
        </AccordionContent>
        <AccordionContent className="px-3 flex items-center justify-between py-3 text-black">
          <p>4.4 Information security management system</p>
          <Badge className="w-max font-semibold" variant={"warning"}>
            Pending
          </Badge>
        </AccordionContent>
      </AccordionItem>

      {/* LEADERSHIP */}
      <AccordionItem value="item-4">
        <AccordionTrigger className="bg-gray-100 px-1 rounded-sm p-3 ">
          <p>5. LEADERSHIP</p>
          <div className="flex items-center">
            <p className="flex justify-end">3 modules</p>

            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 flex items-center justify-between py-3 text-black">
          <p>5.1 Leadership and commitment</p>
          <Badge className="w-max font-semibold" variant={"success"}>
            Completed
          </Badge>
        </AccordionContent>
        <AccordionContent className="px-3 flex items-center justify-between py-3 text-black">
          <p>5.2 Policy</p>
          <Badge className="w-max font-semibold" variant={"warning"}>
            Pending
          </Badge>
        </AccordionContent>
        <AccordionContent className="px-3 flex items-center justify-between py-3 text-black">
          <p>5.3 Organizational roles, responsibilities and authorities</p>
          <Badge className="w-max font-semibold" variant={"warning"}>
            Pending
          </Badge>
        </AccordionContent>
      </AccordionItem>

      {/* PLANNING */}
      <AccordionItem value="item-5">
        <AccordionTrigger className="bg-gray-100 px-1 rounded-sm p-3 ">
          <p>6. PLANNING</p>
          <div className="flex items-center">
            <p className="flex justify-end">3 modules</p>

            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 flex items-center justify-between py-3 text-black">
          <p>6.1.1 General</p>
          <Badge className="w-max font-semibold" variant={"success"}>
            Completed
          </Badge>
        </AccordionContent>
        <AccordionContent className="px-3 flex items-center justify-between py-3 text-black">
          <p>6.1.2 Information security risk assessment</p>
          <Badge className="w-max font-semibold" variant={"warning"}>
            Pending
          </Badge>
        </AccordionContent>
        <AccordionContent className="px-3 flex items-center justify-between py-3 text-black">
          <p>6.1.3 Information security risk treatment</p>
          <Badge className="w-max font-semibold" variant={"warning"}>
            Pending
          </Badge>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
