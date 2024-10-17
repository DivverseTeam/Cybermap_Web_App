"use client";
import { DataTable } from "~/app/(main)/policies/_data-table";
import { DownArrow } from "~/components/svgs/DownArrow";
import ComplianceChart from "./components/ComplianceChart";
import FrameComplianceList from "./components/FrameComplianceList";
import ProgressChart from "./components/ProgressChart";
import { frameworkdata, frameworkdataColumns } from "./constants";

export default function DashboardPage() {
  return (
    <div className="flex flex-col pb-6">
      {/* px-6 */}
      <div className="flex flex-row h-24 w-full items-end justify-between pb-2">
        <div className="flex flex-col gap-1">
          <p className="text-xl font-semibold text-neutral-12">Dashboard</p>
          <p className="text-base text-neutral-11">
            Get a overview of your compliance and perfomance
          </p>
        </div>
        <div className="h-8 w-[153px] bg-white rounded-sm border border-solid flex items-center justify-center border-neutral-5 font-medium text-sm text-neutral-11">
          Customize widgets
        </div>
      </div>
      {/* py-6 */}
      <div className="py-6 flex flex-col gap-6">
        <div className="flex items-center gap-6">
          <div className="min-w-[378px] h-[367.93px] border border-solid border-neutral-2 bg-white rounded-[8px]">
            <div className="flex items-center px-5 justify-between h-[72px] w-full">
              <p className="text-base text-neutral-normal">Compliance score</p>
              <div className="h-8 w-[137px] bg-white items-center flex justify-center rounded-sm border border-solid border-neutral-5 font-medium text-sm text-neutral-11">
                Download report
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center relative">
                {/* <div className="w-[260px] h-[130px] relative border-t-[50px] border-l-[50px] border-r-[50px]  rounded-t-full border-gray-2">
                  <div className="w-[260px] h-[130px] absolute  border-t-[50px] border-l-[50px] border-r-[50px]  rounded-t-full border-gray-2"></div>
                </div> */}
                <div>
                  <ProgressChart />
                </div>
                <div className="flex flex-col items-center gap-[18px] absolute top-20">
                  <div className="flex flex-col items-center gap-2 ">
                    <p className="text-[54px] text-[#1E1B39] font-bold">80</p>
                    <div className="flex flex-col items-center gap-[8.41px]">
                      <p className="text-[13.76px] leading-[18.35px] text-[#1E1B39] font-bold">
                        Your compliance score
                      </p>
                      <p className="text-[12.23px] leading-[13.76px] text-[#615E83] font-normal">
                        Last update 2mins ago
                      </p>
                    </div>
                  </div>
                  <div className="h-8 w-[137px] bg-white items-center flex justify-center rounded-sm border border-solid border-neutral-5 font-medium text-sm text-neutral-11">
                    Download report
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-[367.93px] border border-solid border-neutral-2 bg-white rounded-[8px]">
            <div className="flex items-center px-5 justify-between h-[72px] w-full">
              <p className="text-base text-neutral-normal">
                Compliance over time
              </p>
              <div className="h-8 w-[106px] bg-white items-center flex gap-2 justify-center rounded-sm border border-solid border-neutral-5 font-medium text-sm text-neutral-11">
                <span>Annually</span>
                <DownArrow />
              </div>
            </div>
            <ComplianceChart />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="w-full max-h-[552px] h-[552px] overflow-scroll bg-white rounded-[8px] custom-scroll">
            <div className="flex items-center px-5 justify-between h-[72px] w-full">
              <p className="text-base text-neutral-normal">
                Framework compliance
              </p>
              <div className="h-8 w-[76px] bg-white items-center flex justify-center rounded-sm border border-solid border-neutral-5 font-medium text-sm text-neutral-11">
                View all
              </div>
            </div>
            <div>
              <DataTable
                columns={frameworkdataColumns}
                data={frameworkdata}
                hc="bg-white"
              />
            </div>
          </div>
          <div className="min-w-[378px] max-h-[552px] h-[552px] bg-white rounded-[8px] custom-scroll">
            <div className="flex items-center px-5 justify-between h-[72px] w-full">
              <p className="text-base text-neutral-normal">
                Framework compliance
              </p>
              <div className="h-8 w-[76px] bg-white items-center flex justify-center rounded-sm border border-solid border-neutral-5 font-medium text-sm text-neutral-11">
                View all
              </div>
            </div>
            <div className="p-4 gap-4 flex flex-col">
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
