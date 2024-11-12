import SemiCircleProgressBar from "react-progressbar-semicircle";
import { getProgressColor } from "./constants";

export default function FrameworkComplianceProgress({
  progress,
}: {
  progress: string;
}) {
  return (
    <SemiCircleProgressBar
      percentage={+progress}
      stroke={getProgressColor(+progress)}
      background="#F9F9FB"
      strokeWidth={12}
    />
  );
}
