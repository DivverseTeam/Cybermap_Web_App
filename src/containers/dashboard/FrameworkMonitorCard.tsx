import Image from "next/image";
import Link from "next/link";
import { Button } from "~/app/_components/ui/button";
import FrameworkComplianceProgress from "./FrameworkComplianceProgress";
import { frameworkIcons } from "./constants";

type FrameworkKey = keyof typeof frameworkIcons;

// type FrameworkIcon = (typeof frameworkIcons)[FrameworkKey];

export default function FrameworkMonitorCard({
  framework,
  progress,
  score,
  keyVal,
}: {
  framework: string;
  progress: string;
  score: string;
  keyVal: FrameworkKey;
}) {
  return (
    <div className="flex h-[228.35] min-w-[217.6px] flex-col gap-2 rounded-[8px] border border-neutral-2 border-solid bg-white p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative block h-5 w-5 rounded-[50%]">
            <Image
              src={frameworkIcons[keyVal]}
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
          <p className="font-semibold text-base text-gray-12">{framework}</p>
        </div>
        <p className="font-medium text-gray-11 text-xs">{score}</p>
      </div>
      <div className="relative flex h-[128px] justify-center">
        <FrameworkComplianceProgress progress={progress} />
        <div className="absolute top-[4.5rem] flex flex-col items-center gap-[18px]">
          <div className="flex flex-col items-center gap-2 ">
            <p className="font-bold text-[#1E1B39] text-[25.84px]">
              {progress}%
            </p>
          </div>

          <Link href={`/frameworks/${framework}`}>
            <Button size="sm" variant="outline">
              View framework
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
