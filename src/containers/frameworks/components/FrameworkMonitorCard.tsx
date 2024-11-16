import Image from "next/image";
import Link from "next/link";
import { Button } from "~/app/_components/ui/button";
import FrameworkComplianceProgress from "./FrameworkComplianceProgress";
import type { IFrameworkData } from "../types";

type FrameworkMonitorCardProps = {
  framework: IFrameworkData;
};

export default function FrameworkMonitorCard({
  framework,
}: FrameworkMonitorCardProps) {
  return (
    <div className="flex min-w-[240.6px] flex-col gap-2 rounded-[8px] border border-neutral-2 border-solid bg-white p-3">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative block h-5 w-5 rounded-[50%]">
            <Image
              src={framework.icon}
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
          <p className="font-semibold text-base text-gray-12">
            {framework.name}
          </p>
        </div>
        <p className="font-medium text-secondary text-xs">
          {
            framework.complianceScore.find(
              (item) => item.name.toLowerCase() === "passing"
            )?.value
          }
          /
          {framework.complianceScore.reduce((acc, item) => acc + item.value, 0)}
        </p>
      </div>
      <div className="relative flex flex-col items-center justify-center">
        <FrameworkComplianceProgress
          complianceScore={framework.complianceScore}
        />

        <Link href={`/frameworks/${framework.name}`}>
          <Button size="sm" className="w-[188px] text-sm" variant="outline">
            View framework
          </Button>
        </Link>
      </div>
    </div>
  );
}
