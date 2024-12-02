import type { FunctionComponent } from "react";
import { Badge, type badgeVariants } from "~/app/_components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import type { OrganisationControl } from "~/server/models/Control";

interface ComplianceModulesProps {
  controls: Array<OrganisationControl>;
}

const ComplianceControls: FunctionComponent<ComplianceModulesProps> = ({
  controls,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {controls.map((control) => {
        const { id, name, status } = control;

        let badgeVariant: VariantProps<typeof badgeVariants>["variant"] =
          "warning";

        if (status === "FULLY_IMPLEMENTED") {
          badgeVariant = "success";
        }

        return (
          <div
            key={id}
            className="flex items-center justify-between bg-gray-100 px-3 py-4 text-[#192839] text-sm"
          >
            <p>{name}</p>
            <Badge className="w-max font-semibold" variant={badgeVariant}>
              {status === "FULLY_IMPLEMENTED" ? "Completed" : "Pending"}
            </Badge>
          </div>
        );
      })}
    </div>
  );
};

export default ComplianceControls;
