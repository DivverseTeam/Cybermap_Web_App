"use memo";

import { Toaster } from "sonner";
import { Button } from "~/app/_components/ui/button";
import PageTitle from "~/components/PageTitle";
import { SearchParams } from "~/types";
import { searchParamsSchema } from "./_lib/validations";
import { getEvidences } from "./_lib/queries";
import { Shell } from "~/components/shell";
import { EvidencesTableProvider } from "./components/evidences-table-provider";
import React from "react";
import { Skeleton } from "~/app/_components/ui/skeleton";
import { DateRangePicker } from "~/components/date-range-picker";
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton";
import { EvidencesTable } from "./components/evidences-table";
// import EvidenceList from "./components/EvidenceList";
// import EvidenceList from "./components/EvidenceList";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface EvidenceLibraryPageProps {
  searchParams: SearchParams;
}

export default async function EvidenceLibraryPage({
  searchParams,
}: EvidenceLibraryPageProps) {
  // const router = useRouter();
  // const pathname = usePathname();
  // const searchParams = useSearchParams();

  // const searchParamsObj = Object.fromEntries(searchParams.entries());

  const search = searchParamsSchema.parse(searchParams);

  const evidencesPromise = getEvidences(search);
  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title="Evidence Library"
        subtitle="View and manage your evidences and files"
        action={
          <div className="flex items-center gap-2">
            <Button>Add new evidence</Button>
          </div>
        }
      />
      <div className="p-6 flex gap-6 flex-wrap">
        <Shell className="gap-2">
          {/* <SearchTitle searchData={searchData} /> */}
          {/**
           * The `TasksTableProvider` is use to enable some feature flags for the `TasksTable` component.
           * Feel free to remove this, as it's not required for the `TasksTable` component to work.
           */}
          <EvidencesTableProvider>
            {/**
             * The `DateRangePicker` component is used to render the date range picker UI.
             * It is used to filter the tasks based on the selected date range it was created at.
             * The business logic for filtering the tasks based on the selected date range is handled inside the component.
             */}
            <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
              <DateRangePicker
                triggerSize="sm"
                triggerClassName="ml-auto w-56 sm:w-60"
                align="end"
              />
            </React.Suspense>
            <React.Suspense
              fallback={
                <DataTableSkeleton
                  columnCount={5}
                  searchableColumnCount={1}
                  filterableColumnCount={2}
                  cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
                  shrinkZero
                />
              }
            >
              {/**
               * Passing promises and consuming them using React.use for triggering the suspense fallback.
               * @see https://react.dev/reference/react/use
               */}
              <EvidencesTable evidencesPromise={evidencesPromise} />
            </React.Suspense>
          </EvidencesTableProvider>
        </Shell>
      </div>
      <Toaster />
    </div>
  );
}
