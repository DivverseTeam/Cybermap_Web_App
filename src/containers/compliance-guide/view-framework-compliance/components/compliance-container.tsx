import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/app/_components/ui/accordion";

type Props = {};

export default function ComplianceContainer({}: Props) {
  return (
    <Accordion
      type="single"
      collapsible
      className="text-secondary py-2 text-sm"
    >
      {/* GENERAL */}
      <AccordionItem value="item-1">
        <AccordionTrigger className="bg-gray-100 rounded-lg p-3 no-underline">
          GENERAL
        </AccordionTrigger>
        <AccordionContent className="px-3">
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>

      {/* START YOUR PROJECT */}
      <AccordionItem value="item-2">
        <AccordionTrigger className="bg-gray-100 flex px-1 rounded-lg p-3 no-underline">
          <p>START YOUR PROJECT</p>
          <p className="flex justify-end">1 module</p>
        </AccordionTrigger>
        <AccordionContent className="px-3">
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>

        <AccordionContent className="px-3">
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
        <AccordionContent className="px-3">
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
        <AccordionContent className="px-3">
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
