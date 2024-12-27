"use client";

import type React from "react";
import type { ComplianceItem, IEmployee } from "../types";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/app/_components/ui/sheet";

import type { Row } from "@tanstack/react-table";
import { Badge } from "~/app/_components/ui/badge";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import {
  ChevronRight,
  CircleCheck,
  FilePenLine,
  TriangleAlert,
} from "lucide-react";
import { Button } from "~/app/_components/ui/button";
import Link from "next/link";
import { Switch } from "~/app/_components/ui/switch";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
// import type { IEmployee } from "~/server/models/Employee";

interface EmployeeProfileSheet
  extends React.ComponentPropsWithRef<typeof Sheet> {
  employee: Row<IEmployee>["original"];
}

export default function EmployeeProfileSheet({
  employee,
  open,
  onOpenChange,
  ...props
}: EmployeeProfileSheet) {
  const initialComplianceList =
    (employee?.complianceList as {
      [key: string]: boolean;
    }[]) || [];

  const { mutate: changeComplianceStatus, isPending } =
    api.employees.changeComplianceStatus.useMutation();

  console.log("selected employee: ", employee);

  const [statusEditActive, setStatusEditActive] = useState<boolean>(false);

  const [complianceList, setComplianceList] = useState<ComplianceItem[]>(
    initialComplianceList
  );

  console.log("initial compliance list: ", initialComplianceList);
  // setComplianceList(initialComplianceList);
  // console.log("compliance list: ", complianceList);

  useEffect(() => {
    setComplianceList(initialComplianceList);
    console.log("compliance list: ", complianceList);
  }, [employee.complianceList]);

  const toggleCompliance = (key: string) => {
    setComplianceList((prevList) =>
      prevList.map((item) =>
        item[key] !== undefined
          ? { [key]: !item[key] } // Toggle the boolean value
          : item
      )
    );

    console.log(complianceList);
  };

  const resetComplianceList = () => {
    setComplianceList(initialComplianceList);

    setStatusEditActive(false);
  };

  console.log("employee ID prev: ", employee);
  console.log("employee ID: ", employee._id);
  const handleComplianceStatusChange = () => {
    console.log("new compliance list: ", complianceList);
    changeComplianceStatus(
      { newComplianceList: complianceList, _id: employee._id },
      {
        onSuccess: (data) => {
          toast.success(data?.message);
          setStatusEditActive(false);
          window.location.reload();
        },
        onError: (err) => {
          console.error("Error:", err);
          toast.error(
            "Failed to upload employees! Please review the csv file and try again"
          );
        },
      }
    );
  };

  // Filter compliances that are false
  const nonCompliantItems = complianceList
    .filter((compliance) => Object.values(compliance)[0] === false)
    .map((compliance) => Object.keys(compliance)[0]); // Extract only the keys (compliance names)

  // Generate sentence with comma and "and"
  const nonCompliantSentence =
    nonCompliantItems.length === 1
      ? nonCompliantItems[0]
      : nonCompliantItems.slice(0, -1).join(", ") +
        " and " +
        nonCompliantItems[nonCompliantItems.length - 1];

  const totalCompliance = complianceList.length;
  const trueComplianceCount = complianceList.filter(
    (item) => Object.values(item)[0]
  ).length;
  const score = Math.ceil((+trueComplianceCount / +totalCompliance) * 100);
  const data = [{ name: "score", value: score }];
  const circleSize = 100;

  // Set colors based on score value
  const barColor =
    score > 75
      ? "rgba(0, 123, 23)"
      : score > 50 && score <= 75
      ? "rgba(255, 179, 0)"
      : score === 50
      ? "rgba(198, 92, 16)"
      : "rgba(219, 0, 7)";
  const textColor =
    score > 75
      ? "rgba(0, 123, 23)"
      : score > 50 && score <= 75
      ? "rgba(255, 179, 0)"
      : score === 50
      ? "rgba(198, 92, 16)"
      : "rgba(219, 0, 7)";
  const interiorBackgroundColor =
    score > 75
      ? "rgba(0, 123, 23, 0.2)"
      : score > 50 && score <= 75
      ? "rgba(255, 179, 0, 0.2)"
      : score === 50
      ? "rgba(198, 92, 16, 0.2)"
      : "rgba(219, 0, 7, 0.2)";
  const scoreComment =
    score > 75
      ? "well"
      : score > 50 && score <= 75
      ? "fairly"
      : score === 50
      ? "average"
      : "poorly";

  return (
    <Sheet open={open} onOpenChange={onOpenChange} {...props}>
      {employee ? (
        <SheetContent className="flex h-full flex-col gap-3 overflow-y-auto">
          <SheetHeader className="text-left px-4">
            <SheetTitle>
              {employee.firstName} {employee.lastName}
            </SheetTitle>
          </SheetHeader>
          {complianceList.length > 0 ? (
            <div className="p-4 py-6 flex flex-col gap-6">
              {/* name and title */}
              <div className="flex items-center justify-between">
                {/* photo */}
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-md bg-secondary p-2 text-white text-xl">
                    {employee?.firstName?.split("")[0]?.toUpperCase()}
                    {employee?.lastName?.split("")[0]?.toUpperCase()}
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <p className="text-secondary text-sm">{employee.email}</p>
                  </div>
                </div>
                <Badge variant={"muted"}>{employee.jobTitle}</Badge>
              </div>

              {/* summary table */}
              <div className="overflow-auto text-secondary my-2">
                <table className="min-w-full divide-y divide-gray-200 bg-white">
                  <tbody className="flex flex-col gap-2">
                    <tr className="grid grid-cols-3">
                      <th className="  text-left text-sm font-medium">
                        Status
                      </th>
                      <td className=" whitespace-nowrap text-sm ">
                        {employee.terminationDate ? "Deactivated" : "Hired"}
                      </td>
                    </tr>
                    <tr className="grid grid-cols-3">
                      <th className=" text-left text-sm font-medium">
                        Employee ID
                      </th>
                      <td className=" whitespace-nowrap text-sm ">
                        {employee.employeeId}
                      </td>
                    </tr>
                    <tr className="grid grid-cols-3">
                      <th className=" text-left text-sm font-medium">
                        Last Password Update
                      </th>
                      {employee.lastPasswordUpdate ? (
                        <td className=" whitespace-nowrap text-sm ">
                          {employee.lastPasswordUpdate as string}
                        </td>
                      ) : (
                        <td className="h-[2px] w-4 bg-secondary"></td>
                      )}
                    </tr>
                    <tr className="grid grid-cols-3 items-center mb-2">
                      <th className=" text-left text-sm font-medium">
                        Controls Owned
                      </th>
                      <td className=" whitespace-nowrap text-sm ">7</td>
                      <td className=" whitespace-nowrap text-sm ">
                        <Button variant={"outline"} className="h-7">
                          <Link href={"/controls"}>View controls</Link>
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* compliance score / active edit status */}
              {!statusEditActive ? (
                <div className="flex flex-col gap-4">
                  <h2 className="font-medium text-lg text-secondary-foreground">
                    Compliance Score & Details
                  </h2>
                  {/* score and list */}
                  <div className="flex justify-between items-center gap-4">
                    {score ? (
                      <RadialBarChart
                        width={circleSize}
                        height={circleSize}
                        cx={circleSize / 2}
                        cy={circleSize / 2}
                        innerRadius={45}
                        outerRadius={60}
                        barSize={4}
                        data={data}
                        startAngle={90}
                        endAngle={-270}
                        className="mx-auto flex items-center justify-center"
                      >
                        {/* Draw the interior background circle */}
                        <circle
                          cx={circleSize / 2}
                          cy={circleSize / 2}
                          r={45} // Match the innerRadius
                          fill={interiorBackgroundColor} // Interior background color
                        />
                        <PolarAngleAxis
                          type="number"
                          domain={[0, 100]}
                          angleAxisId={0}
                          tick={false}
                        />
                        <RadialBar
                          background
                          dataKey="value"
                          cornerRadius={circleSize / 2}
                          fill={barColor}
                        />
                        <text
                          x={circleSize / 2}
                          y={circleSize / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          style={{
                            fill: textColor,
                            fontWeight: "medium",
                            fontSize: "50px",
                          }}
                          className="progress-label" // Apply dynamic text color here
                        >
                          {score}
                        </text>
                      </RadialBarChart>
                    ) : (
                      <div className="h-[2px] w-4 bg-secondary"></div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      {complianceList.map((compliance, idx) => (
                        <div key={idx}>
                          {Object.keys(compliance).map((key) => (
                            <Badge
                              key={key}
                              className="flex items-center gap-1 w-max ml-8"
                              variant={`${
                                Object.values(compliance)[0]
                                  ? "success"
                                  : "warning"
                              }`}
                            >
                              {Object.values(compliance)[0] ? (
                                <CircleCheck className="text-[#007B17] w-5" />
                              ) : (
                                <TriangleAlert className="text-[#C65C10] w-5" />
                              )}
                              <span className="text-xs whitespace-nowrap">
                                {key}
                              </span>
                            </Badge>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* edit status */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="w-max  px-4 flex gap-2 items-center rounded-md"
                      onClick={() => setStatusEditActive(!statusEditActive)}
                      disabled={employee.terminationDate ? true : false}
                    >
                      <FilePenLine />
                      <span>Edit status</span>
                    </Button>
                    <div className="flex flex-col text-secondary text-sm">
                      <div className="flex items-center gap-1">
                        <TriangleAlert className="text-secondary-foreground w-4 " />
                        <span className="text-secondary-foreground">
                          Important Notice:
                        </span>
                      </div>
                      <p>
                        Edit the employee’s compliance status only when
                        necessary, as manual changes can affect records and
                        reports
                      </p>
                    </div>
                    <p className="font-medium text-secondary-foreground  ">
                      Proceed only if this action is requried
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5 border h-max rounded-lg p-4 transition-transform duration-300 ease-in-out transform hover:translate-y-1">
                  <h2 className="font-medium text-lg">
                    Edit compliance status
                  </h2>
                  <div className="">
                    {complianceList.map((compliance, index) => {
                      const entry = Object.entries(compliance)[0]; // Extract the first entry (key-value pair)

                      console.log("status edit: ", statusEditActive);

                      if (!entry) return null; // Safeguard against empty objects

                      const [key, value] = entry; // Destructure key and value

                      return (
                        <div
                          key={index}
                          className="flex items-center gap-6 py-1 text-sm"
                        >
                          <span className="text-sm font-medium text-gray-700 w-1/2">
                            {key}
                          </span>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={value}
                              onCheckedChange={() => toggleCompliance(key)}
                              className={`${
                                value ? "bg-green-500" : "bg-red-500"
                              } relative inline-flex h-6 w-11 items-center rounded-full`}
                            >
                              <span className="sr-only">Toggle compliance</span>
                              <span
                                className={`${
                                  value ? "translate-x-6" : "translate-x-1"
                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                              />
                            </Switch>
                            <span>Compliant</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-start gap-2 ">
                    <Button
                      loading={isPending}
                      onClick={handleComplianceStatusChange}
                    >
                      Save changes
                    </Button>
                    <Button
                      variant={"destructive"}
                      onClick={resetComplianceList}
                    >
                      Cancel
                    </Button>
                    {/* <Button
                      variant={"outline"}
                      onClick={() => setStatusEditActive(false)}
                      className="px-6"
                    >
                      Close
                    </Button> */}
                  </div>
                </div>
              )}

              {/* feedback */}
              <div className="flex flex-col gap-2 text-secondary">
                <h2 className="font-medium text-lg text-secondary-foreground">
                  Action-oriented Feedback
                </h2>
                <p className="font-normal text-sm">
                  {employee.firstName} is performing {scoreComment} with an{" "}
                  {score}% compliance score.{" "}
                  {nonCompliantItems.length
                    ? `To reach 100%, focus should be placed on completing ${nonCompliantSentence}. Regular follow-ups and automated reminders can assist in closing these gaps efficiently.`
                    : "All compliances are met."}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mr-4">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500">Loading...</p>
            </div>
          )}
          <SheetFooter className="flex px-4 mt-16 flex-col-reverse sm:flex-row sm:justify-start sm:space-x-2">
            <Button variant={"default"} disabled={statusEditActive}>
              Create Ping
            </Button>
            {/* <Button variant={"destructive"} className="flex items-center gap-2">
              <span>Disable Employee</span> <ChevronRight className="w-5" />
            </Button> */}
          </SheetFooter>
        </SheetContent>
      ) : (
        <p>No employee selected</p>
      )}
    </Sheet>
  );
}
