import type { FunctionComponent } from "react";
import Image from "next/image";
import { Card } from "~/app/_components/ui/card";

interface FrameworkComplianceCardProps {
  logo?: string;
  name: string;
  readiness: {
    total: number;
    completed: number;
  };
  preparedness: {
    total: number;
    completed: number;
  };
}

const ProgressBar = ({ percentage }: { percentage: number }) => {
  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
      <div
        className="absolute top-0 left-0 h-full bg-green-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const FrameworkComplianceCard: FunctionComponent<
  FrameworkComplianceCardProps
> = ({ name, logo, preparedness, readiness }) => {
  const preparednessPercentage = Math.round(
    (preparedness.completed / preparedness.total) * 100,
  );
  const readinessPercentage = Math.round(
    (readiness.completed / readiness.total) * 100,
  );

  return (
    <Card className="w-full min-w-[550px] rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="relative block h-10 w-10 rounded-[50%]">
            <Image
              src={logo || ""}
              alt="headerImage"
              fill={true}
              priority={true}
              style={{
                borderRadius: "50%",
                maxWidth: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
          <p className="text-xl">{name}</p>
        </div>

        <div className="flex flex-col gap-8">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="font-medium text-gray-700">Audit readiness</p>
              <p className="font-medium text-gray-700">
                {readinessPercentage}%
              </p>
            </div>
            <ProgressBar percentage={readinessPercentage} />
            <div className="mt-2 flex justify-between text-gray-500">
              <span>{readiness.completed} modules completed</span>
              <span>{readiness.total} total</span>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="font-medium text-gray-700">Preparedness</p>
              <p className="font-medium text-gray-700">
                {preparednessPercentage}%
              </p>
            </div>
            <ProgressBar percentage={preparednessPercentage} />
            <div className="mt-2 flex justify-between text-gray-500">
              <span>{preparedness.completed} controls implemented</span>
              <span>{preparedness.total} total</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FrameworkComplianceCard;
