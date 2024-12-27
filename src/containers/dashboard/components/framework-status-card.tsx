import type { FunctionComponent } from "react";
import Image from "next/image";
import { Card } from "~/app/_components/ui/card";

interface FrameworkStatusCardProps {
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

const FrameworkStatusCard: FunctionComponent<FrameworkStatusCardProps> = ({
  name,
  preparedness,
  readiness,
}) => {
  const preparednessPercentage = Math.round(
    (preparedness.completed / preparedness.total) * 100
  );
  const readinessPercentage = Math.round(
    (readiness.completed / readiness.total) * 100
  );

  return (
    <Card className="w-full min-w-[300px] rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <div className="flex flex-col gap-4">
        <p className="text-xl font-semibold">{name}</p>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <div className="mb-0 flex items-center justify-between">
              <p className="font-medium text-gray-700">Preparedness</p>
              <p className="font-medium text-gray-700">
                {preparednessPercentage}%
              </p>
            </div>
            <ProgressBar percentage={preparednessPercentage} />
          </div>
          <div className="flex flex-col gap-1">
            <div className="mb-0 flex items-center justify-between">
              <p className="font-medium text-gray-700">Audit readiness</p>
              <p className="font-medium text-gray-700">
                {readinessPercentage}%
              </p>
            </div>
            <ProgressBar percentage={readinessPercentage} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FrameworkStatusCard;
