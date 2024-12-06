import type { FunctionComponent } from "react";
import { Skeleton } from "~/app/_components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/_components/ui/tabs";

interface FrameworkComplianceGuideSkeletonProps {}

const FrameworkComplianceGuideSkeleton: FunctionComponent<
  FrameworkComplianceGuideSkeletonProps
> = () => {
  return (
    <div className="flex flex-col gap-4 2xl:gap-6">
      <Skeleton className="h-8 w-1/3" />

      <div className="grid grid-cols-2 gap-4 2xl:gap-6">
        <Skeleton className="h-64 w-full rounded-lg border" />
        <Skeleton className="h-64 w-full rounded-lg border" />
      </div>

      <Tabs
        defaultValue="compliance"
        className="flex flex-col items-start gap-5"
      >
        <TabsList className="rounded-none bg-inherit">
          <TabsTrigger value="compliance">
            <Skeleton className="h-6 w-32" />
          </TabsTrigger>
          <TabsTrigger value="controls">
            <Skeleton className="h-6 w-24" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="compliance" className="w-full">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </TabsContent>
        <TabsContent value="controls" className="w-full">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FrameworkComplianceGuideSkeleton;
