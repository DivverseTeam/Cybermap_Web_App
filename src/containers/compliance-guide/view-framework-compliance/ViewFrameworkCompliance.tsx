"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { frameworksWithControls } from "../ComplianceGuidePage";
import PageTitle from "~/components/PageTitle";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
// import type { IFramework } from "../../types";
import { ComplianceTabs } from "./components/compliance-tabs";
import ComplianceContainer from "./components/compliance-container";
import ControlsContainer from "./components/controls-container";

type Props = {};

export default function ViewFrameworkCompliance({}: Props) {
  const params = useParams();
  const frameworkId = params.id as string;

  const [activeList, setActiveList] = useState<string>("complianceModules");

  const framework = frameworksWithControls.find(
    (framework) => framework.name === frameworkId?.replace(/%20/g, " ")
  );

  const radialCircleSize = 20;

  const controlRadialBarData = [
    { name: "score", value: framework?.controlsCompletion.completedControls },
  ];
  const moduleRadialBarData = [
    { name: "score", value: framework?.modulesCompletion.completedModules },
  ];

  // Set colors based on score value
  const controlBarColor =
    framework?.controlsCompletion.completedControls ?? 0 > 75
      ? "rgba(0, 123, 23)"
      : (framework?.controlsCompletion.completedControls ?? 0) > 50 &&
        (framework?.controlsCompletion.completedControls ?? 0) <= 75
      ? "rgba(255, 179, 0)"
      : (framework?.controlsCompletion.completedControls ?? 0) === 50
      ? "rgba(198, 92, 16)"
      : "rgba(219, 0, 7)";
  // Set colors based on score value
  const moduleBarColor =
    (framework?.modulesCompletion.completedModules ?? 0) > 75
      ? "rgba(0, 123, 23)"
      : (framework?.modulesCompletion.completedModules ?? 0) > 50 &&
        (framework?.modulesCompletion.completedModules ?? 0) <= 75
      ? "rgba(255, 179, 0)"
      : (framework?.modulesCompletion.completedModules ?? 0) === 50
      ? "rgba(198, 92, 16)"
      : "rgba(219, 0, 7)";

  // Create an array with `true` for completed controls and `false` for remaining controls
  const completedControls =
    framework?.controlsCompletion.completedControls ?? 0;
  const controlBoxes = Array.from(
    { length: framework?.controlsCompletion.totalControls ?? 0 },
    (_, i) => i < completedControls
  );
  // Create an array with `true` for completed modules and `false` for remaining modules

  const completedModules = framework?.modulesCompletion.completedModules ?? 0;
  const moduleBoxes = Array.from(
    { length: framework?.modulesCompletion.totalModules ?? 0 },
    (_, i) => i < completedModules
  );
  return (
    <>
      {framework && (
        <div className="flex flex-col gap-4 2xl:gap-6">
          <PageTitle
            title={framework.name}
            // subtitle="Track your progress towards framework compliance"
            // action={<NewControlSheet />}
          />

          {/* COMPLIANCE SUMMARY */}
          <div className="grid grid-cols-2 gap-4 2xl:gap-6">
            {/* Audit readiness */}
            <div className="flex flex-col gap-3 rounded-[8px] border border-neutral-2 border-solid bg-white px-3 py-4 text-xs">
              <div className="flex justify-between px-2">
                <p className="text-sm">Audit readiness</p>
                <div className="flex items-center gap-1">
                  <p>
                    {Math.ceil(
                      (framework.modulesCompletion.completedModules /
                        framework.modulesCompletion.totalModules) *
                        100
                    )}
                    %
                  </p>
                  <RadialBarChart
                    width={radialCircleSize}
                    height={radialCircleSize}
                    cx={radialCircleSize / 2}
                    cy={radialCircleSize / 2}
                    innerRadius={8}
                    outerRadius={14}
                    barSize={2}
                    data={moduleRadialBarData}
                    startAngle={90}
                    endAngle={-270}
                    className="mx-auto flex items-center justify-center"
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 100]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={radialCircleSize / 2}
                      fill={moduleBarColor}
                    />
                  </RadialBarChart>
                </div>
              </div>
              <div className="grid grid-cols-25 gap-1">
                {moduleBoxes.map((isCompleted, index) => (
                  <div
                    key={index}
                    className={`h-4 w-4 rounded ${
                      isCompleted ? "bg-green-600" : "bg-gray-200"
                    }`}
                  ></div>
                ))}
              </div>
              <div className="flex justify-end">
                <p className="text-secondary">
                  {framework.modulesCompletion.completedModules}/
                  {framework.modulesCompletion.totalModules} Modules completed
                </p>
              </div>
            </div>

            {/* Audit preparedness */}
            <div className="flex flex-col gap-3 rounded-[8px] border border-neutral-2 border-solid bg-white px-3 py-4 text-xs">
              <div className="flex justify-between px-2">
                <p className="text-sm">Audit preparedness</p>
                <div className="flex items-center gap-1">
                  <p>
                    {Math.ceil(
                      (framework.controlsCompletion.completedControls /
                        framework.controlsCompletion.totalControls) *
                        100
                    )}
                    %
                  </p>
                  <RadialBarChart
                    width={radialCircleSize}
                    height={radialCircleSize}
                    cx={radialCircleSize / 2}
                    cy={radialCircleSize / 2}
                    innerRadius={8}
                    outerRadius={14}
                    barSize={2}
                    data={controlRadialBarData}
                    startAngle={90}
                    endAngle={-270}
                    className="mx-auto flex items-center justify-center"
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 100]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={radialCircleSize / 2}
                      fill={controlBarColor}
                    />
                  </RadialBarChart>
                </div>
              </div>
              <div className="grid grid-cols-25 gap-1">
                {controlBoxes.map((isCompleted, index) => (
                  <div
                    key={index}
                    className={`h-4 w-4 rounded ${
                      isCompleted ? "bg-green-600" : "bg-gray-200"
                    }`}
                  ></div>
                ))}
              </div>
              <div className="flex justify-end">
                <p className="text-secondary">
                  {framework.controlsCompletion.completedControls}/
                  {framework.controlsCompletion.totalControls} Controls
                  completed
                </p>
              </div>
            </div>
          </div>

          {/* COMPLIANCE CONTAINER */}
          <div className="flex flex-col gap-4 [@media(min-width:1400px)]:gap-6">
            <ComplianceTabs setActiveList={setActiveList} />
            {activeList === "complianceModules" ? (
              <ComplianceContainer />
            ) : (
              activeList === "controls" && <ControlsContainer />
            )}
          </div>
        </div>
      )}
    </>
  );
}
