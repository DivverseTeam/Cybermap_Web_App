import type { FunctionComponent } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/app/_components/ui/accordion";
import { ChevronDown } from "lucide-react";
import type { Course } from "~/lib/types/course";
import { Badge, type badgeVariants } from "~/app/_components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ComplianceModulesProps {
  course: Course;
}

const ComplianceModules: FunctionComponent<ComplianceModulesProps> = ({
  course,
}) => {
  const pathname = usePathname();

  return (
    <div>
      <Accordion
        type="single"
        collapsible
        className="py-2 text-secondary text-sm"
      >
        {course.map((section) => {
          const { id, title, lessons } = section;

          return (
            <AccordionItem value={id.toString()} key={id}>
              <AccordionTrigger className="rounded-sm bg-gray-100 px-3 py-4 text-xs">
                <p>{title.toUpperCase()}</p>
                <div className="flex items-center gap-5">
                  <p className="flex justify-end">
                    {lessons.length} {`Module${lessons.length > 1 ? "s" : ""}`}
                  </p>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                </div>
              </AccordionTrigger>
              {lessons.map((lesson, idx) => {
                const { isCompleted = false, title, slug: lessonSlug } = lesson;

                let badgeVariant: VariantProps<
                  typeof badgeVariants
                >["variant"] = "warning";

                if (isCompleted) {
                  badgeVariant = "success";
                }

                return (
                  <Link key={idx} href={`${pathname}/${lessonSlug}`}>
                    <AccordionContent className="flex items-center justify-between px-3 py-4 text-[#192839]">
                      <p>{title}</p>
                      <Badge
                        className="w-max font-semibold"
                        variant={badgeVariant}
                      >
                        {isCompleted ? "Completed" : "Pending"}
                      </Badge>
                    </AccordionContent>
                  </Link>
                );
              })}
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default ComplianceModules;
