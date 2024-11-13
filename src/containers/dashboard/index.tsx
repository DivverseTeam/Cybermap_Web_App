"use client";

import { DataTable } from "~/app/_components/table/data-table";
import { Button } from "~/app/_components/ui/button";
import PageTitle from "~/components/PageTitle";
import { DownArrow } from "~/components/svgs/DownArrow";
import ComplianceChart from "./components/ComplianceChart";
import FrameComplianceList from "./components/FrameComplianceList";
import ProgressChart from "./components/ProgressChart";
import { frameworkData, frameworkDataColumns } from "./constants";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "~/app/_components/ui/table";
import { z } from "zod";

// const FrameworkStatus = z.enum([
//   "FULLY_IMPLEMENTED",
//   "NOT_IMPLEMENTED",
//   "PARTIALLY_IMPLEMENTED",
// ]);
// type FrameworkStatus = z.infer<typeof FrameworkStatus>;

// type Framework = {
//   id: string;
//   control: string;
//   mapped: string[];
//   status: FrameworkStatus;
// };

export default function DashboardPage() {
  return (
    <div className="flex flex-col pb-6">
      {/* px-6 */}
      <PageTitle
        title="Dashboard"
        subtitle="Get a overview of your compliance and performance"
        action={<Button variant="outline">Customize widgets</Button>}
      />
      {/* py-6 */}
      <div className="flex flex-col gap-6 py-6">
        <div className="flex items-center gap-6">
          <div className="h-[367.93px] min-w-[378px] rounded-[8px] border border-neutral-2 border-solid bg-white">
            <div className="flex h-[72px] w-full items-center justify-between px-5">
              <p className="text-base text-neutral-normal">Compliance score</p>
              <div className="flex h-8 w-[137px] items-center justify-center rounded-sm border border-neutral-5 border-solid bg-white font-medium text-neutral-11 text-sm">
                Download report
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative flex flex-col items-center">
                {/* <div className="w-[260px] h-[130px] relative border-t-[50px] border-l-[50px] border-r-[50px]  rounded-t-full border-gray-2">
                  <div className="w-[260px] h-[130px] absolute  border-t-[50px] border-l-[50px] border-r-[50px]  rounded-t-full border-gray-2"></div>
                </div> */}
                <div>
                  <ProgressChart />
                </div>
                <div className="absolute top-20 flex flex-col items-center gap-[18px]">
                  <div className="flex flex-col items-center gap-2 ">
                    <p className="font-bold text-[#1E1B39] text-[54px]">80</p>
                    <div className="flex flex-col items-center gap-[8.41px]">
                      <p className="font-bold text-[#1E1B39] text-[13.76px] leading-[18.35px]">
                        Your compliance score
                      </p>
                      <p className="font-normal text-[#615E83] text-[12.23px] leading-[13.76px]">
                        Last update 2mins ago
                      </p>
                    </div>
                  </div>
                  <div className="flex h-8 w-[137px] items-center justify-center rounded-sm border border-neutral-5 border-solid bg-white font-medium text-neutral-11 text-sm">
                    Download report
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[367.93px] w-full rounded-[8px] border border-neutral-2 border-solid bg-white">
            <div className="flex h-[72px] w-full items-center justify-between px-5">
              <p className="text-base text-neutral-normal">
                Compliance over time
              </p>
              <div className="flex h-8 w-[106px] items-center justify-center gap-2 rounded-sm border border-neutral-5 border-solid bg-white font-medium text-neutral-11 text-sm">
                <span>Annually</span>
                <DownArrow />
              </div>
            </div>
            <ComplianceChart />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="custom-scroll h-[552px] max-h-[552px] w-full overflow-scroll rounded-[8px] bg-white">
            <div className="flex h-[72px] w-full items-center justify-between px-5">
              <p className="text-base text-neutral-normal">Control status</p>
              <div className="flex h-8 w-[76px] items-center justify-center rounded-sm border border-neutral-5 border-solid bg-white font-medium text-neutral-11 text-sm">
                View all
              </div>
            </div>
            <div>
              <DataTable columns={frameworkDataColumns} data={frameworkData} />
              {/* <div className="p-3">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="font-extrabold text-muted text-xs">
                      <TableHead className="w-3/5 ">ID</TableHead>
                      <TableHead className="w-3/5 ">Control</TableHead>
                      <TableHead>Mapped</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="font-normal text-xs">
                    {frameworkData.map((control: Framework) => (
                      <TableRow key={control.id}>
                        <TableCell className="flex flex-col font-medium ">
                          <span>{control.id}</span>
                        </TableCell>
                        <TableCell className="flex flex-col font-medium ">
                          <span>{control.control}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col w-max p-2">
                            {control.evidencesCollected ===
                              control.evidencesExpected && (
                              <span className="flex h-4 items-center justify-center rounded-full bg-[#008743]/20 font-semibold px-2 text-[#008743] text-[10px]">
                                Fully Implemented
                              </span>
                            )}
                            {control.evidencesCollected > 0 &&
                              control.evidencesCollected <
                                control.evidencesExpected && (
                                <span className="flex h-4 items-center justify-center rounded-full bg-[#C65C10]/20 px-2 font-semibold text-[#C65C10] text-[10px]">
                                  Partially Implemented
                                </span>
                              )}
                            {control.evidencesCollected === 0 && (
                              <span className="flex h-4 items-center justify-center rounded-full bg-destructive/20 font-semibold px-2 text-[10px] text-destructive">
                                Not Implemented
                              </span>
                            )}
                            
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div> */}
            </div>
          </div>
          <div className="custom-scroll h-[552px] max-h-[552px] min-w-[378px] rounded-[8px] bg-white">
            <div className="flex h-[72px] w-full items-center justify-between px-5">
              <p className="text-base text-neutral-normal">
                Framework compliance
              </p>
              <div className="flex h-8 w-[76px] items-center justify-center rounded-sm border border-neutral-5 border-solid bg-white font-medium text-neutral-11 text-sm">
                View all
              </div>
            </div>
            <div className="flex flex-col gap-4 p-4">
              <FrameComplianceList />
              <FrameComplianceList />
              <FrameComplianceList />
              <FrameComplianceList />
              <FrameComplianceList />
              {/* <FrameComplianceList /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
