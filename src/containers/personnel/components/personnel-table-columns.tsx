import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useState, useEffect, useTransition } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import { formatDate } from "~/lib/utils";
import { Button } from "~/app/_components/ui/button";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import type { IEmployee } from "../types";
import { CircleCheck, TriangleAlert } from "lucide-react";

// const columnHelper = createColumnHelper();

export const columns: ColumnDef<IEmployee>[] = [
  {
    accessorFn: (row) => ({
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
    }),
    id: "name",
    header: () => <span>Name</span>,
    cell: ({ row }) => {
      const { firstName, lastName, email } = row.getValue("name") as {
        firstName: string;
        lastName: string;
        email: string;
      };
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center text-xs p-2 w-6 h-6 rounded-sm bg-secondary text-white">
            {firstName.split("")[0]?.toUpperCase()}
            {lastName.split("")[0]?.toUpperCase()}
          </div>

          <div className="flex flex-col">
            <span className="font-semibold">
              {firstName} {lastName}
            </span>
            <span className="text-sm text-gray-500">{email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "complianceList",
    header: () => <span className="flex">Score</span>, // Wrap in span
    cell: ({ row }) => {
      const complianceList =
        (row.getValue("complianceList") as {
          [key: string]: boolean;
        }[]) || [];
      const totalCompliance = complianceList.length;
      const trueComplianceCount = complianceList.filter(
        (item) => Object.values(item)[0]
      ).length;
      const score = Math.ceil((+trueComplianceCount / +totalCompliance) * 100);
      const data = [{ name: "score", value: score }];
      const circleSize = 30;

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

      return (
        <RadialBarChart
          width={circleSize}
          height={circleSize}
          cx={circleSize / 2}
          cy={circleSize / 2}
          innerRadius={12}
          outerRadius={18}
          barSize={2}
          data={data}
          startAngle={90}
          endAngle={-270}
          className="flex items-center mx-auto justify-center"
        >
          {/* Draw the interior background circle */}
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={12} // Match the innerRadius
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
            style={{ fill: textColor, fontWeight: "medium" }}
            className="progress-label" // Apply dynamic text color here
          >
            {score}
          </text>
        </RadialBarChart>
      );
    },
  },
  {
    accessorKey: "hireDate",
    header: () => (
      <span className="whitespace-nowrap text-center">Hire Date</span>
    ), // Wrap in span
    cell: ({ cell }) => (
      <span className="text-sm whitespace-nowrap text-center">
        {" "}
        {formatDate(cell.getValue() as Date)}
      </span>
    ),
  },
  {
    accessorKey: "terminationDate",
    header: () => (
      <span className="whitespace-nowrap text-center">Termination Date</span>
    ), // Wrap in span
    cell: ({ cell }) => {
      const terminationDate = cell.getValue() as Date | null;
      return (
        <span className="text-sm whitespace-nowrap text-center">
          {terminationDate ? (
            formatDate(terminationDate)
          ) : (
            <div className="h-[2px] w-4 bg-secondary"></div>
          )}
        </span>
      );
    },
  },
  {
    accessorKey: "policyAcknowledgment",
    header: () => (
      <span className="whitespace-nowrap text-center">
        Policy Acknowledgment
      </span>
    ), // Wrap in span
    cell: ({ row }) => {
      // Get the compliance list from the row
      const complianceList = row.getValue("complianceList") as {
        [key: string]: boolean;
      }[];

      // Find the value of "Policy Acknowledgement"
      const policyAcknowledgement = complianceList.find((item) =>
        item.hasOwnProperty("Policy Acknowledgement")
      )?.["Policy Acknowledgement"];

      return (
        <div className="flex justify-center items-center">
          {policyAcknowledgement ? (
            <CircleCheck className="text-[#007B17]" />
          ) : (
            <TriangleAlert className="text-[#C65C10]" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "identityMFA",
    header: () => (
      <span className="whitespace-nowrap text-center">Identity MFA</span>
    ), // Wrap in span
    cell: ({ row }) => {
      // Get the compliance list from the row
      const complianceList = row.getValue("complianceList") as {
        [key: string]: boolean;
      }[];

      // Find the value of "Policy Acknowledgement"
      const identityMFA = complianceList.find((item) =>
        item.hasOwnProperty("Identity MFA")
      )?.["Identity MFA"];

      return (
        <div className="flex justify-center items-center">
          {identityMFA ? (
            <CircleCheck className="text-[#007B17]" />
          ) : (
            <TriangleAlert className="text-[#C65C10]" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "backgroundCheck",
    header: () => (
      <span className="whitespace-nowrap text-center">Background Check</span>
    ), // Wrap in span
    cell: ({ row }) => {
      // Get the compliance list from the row
      const complianceList = row.getValue("complianceList") as {
        [key: string]: boolean;
      }[];

      // Find the value of "Policy Acknowledgement"
      const backgroundCheck = complianceList.find((item) =>
        item.hasOwnProperty("Background Check")
      )?.["Background Check"];

      return (
        <div className="flex justify-center items-center">
          {backgroundCheck ? (
            <CircleCheck className="text-[#007B17]" />
          ) : (
            <TriangleAlert className="text-[#C65C10]" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "securityTraining",
    header: () => (
      <span className="whitespace-nowrap text-center">Security Training</span>
    ), // Wrap in span
    cell: ({ row }) => {
      // Get the compliance list from the row
      const complianceList = row.getValue("complianceList") as {
        [key: string]: boolean;
      }[];

      // Find the value of "Policy Acknowledgement"
      const securityTraining = complianceList.find((item) =>
        item.hasOwnProperty("Security Training")
      )?.["Security Training"];

      return (
        <div className="flex justify-center items-center">
          {securityTraining ? (
            <CircleCheck className="text-[#007B17]" />
          ) : (
            <TriangleAlert className="text-[#C65C10]" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "deviceCompliance",
    header: () => (
      <span className="whitespace-nowrap text-center">Device Compliance</span>
    ), // Wrap in span
    cell: ({ row }) => {
      // Get the compliance list from the row
      const complianceList = row.getValue("complianceList") as {
        [key: string]: boolean;
      }[];

      // Find the value of "Policy Acknowledgement"
      const deviceCompliance = complianceList.find((item) =>
        item.hasOwnProperty("Device Compliance")
      )?.["Device Compliance"];

      return (
        <div className="flex justify-center items-center">
          {deviceCompliance ? (
            <CircleCheck className="text-[#007B17]" />
          ) : (
            <TriangleAlert className="text-[#C65C10]" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "passwordManagers",
    header: () => (
      <span className="whitespace-nowrap text-center">Password Managers</span>
    ), // Wrap in span
    cell: ({ row }) => {
      // Get the compliance list from the row
      const complianceList = row.getValue("complianceList") as {
        [key: string]: boolean;
      }[];

      // Find the value of "Policy Acknowledgement"
      const passwordManagers = complianceList.find((item) =>
        item.hasOwnProperty("Password Managers")
      )?.["Password Managers"];

      return (
        <div className="flex justify-center items-center">
          {passwordManagers ? (
            <CircleCheck className="text-[#007B17]" />
          ) : (
            <TriangleAlert className="text-[#C65C10]" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "antiVirus",
    header: () => (
      <span className="whitespace-nowrap text-center">Anti-Virus</span>
    ), // Wrap in span
    cell: ({ row }) => {
      // Get the compliance list from the row
      const complianceList = row.getValue("complianceList") as {
        [key: string]: boolean;
      }[];

      // Find the value of "Policy Acknowledgement"
      const antiVirus = complianceList.find((item) =>
        item.hasOwnProperty("Anti-Virus")
      )?.["Anti-Virus"];

      return (
        <div className="flex justify-center items-center">
          {antiVirus ? (
            <CircleCheck className="text-[#007B17]" />
          ) : (
            <TriangleAlert className="text-[#C65C10]" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "autoUpdates",
    header: () => (
      <span className="whitespace-nowrap text-center">Auto-Updates</span>
    ), // Wrap in span
    cell: ({ row }) => {
      // Get the compliance list from the row
      const complianceList = row.getValue("complianceList") as {
        [key: string]: boolean;
      }[];

      // Find the value of "Policy Acknowledgement"
      const autoUpdates = complianceList.find((item) =>
        item.hasOwnProperty("Auto-Updates")
      )?.["Auto-Updates"];

      return (
        <div className="flex justify-center items-center">
          {autoUpdates ? (
            <CircleCheck className="text-[#007B17]" />
          ) : (
            <TriangleAlert className="text-[#C65C10]" />
          )}
        </div>
      );
    },
  },
];
