import SemiCircleProgressBar from "react-progressbar-semicircle";
import { getProgressColor } from "./constants";

export default function FrameworkComplianceProgress({
  progress,
}: {
  progress: string;
}) {
  const barColor =
    +progress >= 80
      ? "rgba(0, 123, 23)"
      : +progress >= 50 && +progress < 80
      ? "rgba(255, 179, 0)"
      : +progress >= 30 && +progress < 50
      ? "rgba(198, 92, 16)"
      : "rgba(219, 0, 7)";
  return (
    <SemiCircleProgressBar
      percentage={+progress}
      stroke={barColor}
      background="#F9F9FB"
      strokeWidth={12}
    />
  );
}
