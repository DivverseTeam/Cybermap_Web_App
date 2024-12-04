import type { FunctionComponent } from "react";
import { Skeleton } from "~/app/_components/ui/skeleton";

interface LessonSkeletonProps {}

const LessonSkeleton: FunctionComponent<LessonSkeletonProps> = () => {
  return (
    <div>
      <Skeleton className="mb-4 h-6 w-full" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-2 h-4 w-5/6" />
      <Skeleton className="mb-2 h-4 w-4/6" />
      <Skeleton className="mb-4 h-6 w-3/4" />
      <Skeleton className="h-40 w-full rounded-md" />
    </div>
  );
};

export default LessonSkeleton;
