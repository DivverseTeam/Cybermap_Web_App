"use client";

import React, { useEffect, useState } from "react";
import PageTitle from "~/components/PageTitle";
import { employees } from "./_lib/constants";
import type { IEmployee } from "./types";
import { Button } from "~/app/_components/ui/button";
import {
  CurvyRightDirectionIcon,
  PlusSignIcon,
  SortByDown01Icon,
  UserMultipleIcon,
} from "hugeicons-react";
import { ChevronRight, ListFilter, Star } from "lucide-react";
import PersonnelContainer from "./components/personnel-container";

type Props = {};
const employeesData = employees;

const allCompliances = new Set();

employeesData.forEach((employee: IEmployee) => {
  employee.complianceList.forEach((compliance) => {
    Object.keys(compliance).forEach((key) => allCompliances.add(key));
  });
});

export default function PersonnelPage({}: Props) {
  const [data, setData] = useState<IEmployee[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // const res = await fetch(
      //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/evidences?page=${page}&limit=${limit}&search=${search}&sortColumn=${sortColumn}&sortOrder=${sortOrder}`,
      //   { cache: "no-store" }
      // );
      // const { evidences, total } = await res.json();
      const employeeData = employees.map((employee: IEmployee) => ({
        ...employee,
        hireDate: new Date(employee.hireDate),
        terminationDate:
          employee.terminationDate && new Date(employee.terminationDate),
        complianceList: employee.complianceList.map((compliance) => {
          // Ensure every key has a boolean value (true or false)
          const cleanedCompliance = Object.fromEntries(
            Object.entries(compliance).map(([key, value]) => [
              key,
              value ?? false,
            ]) // Set undefined to false
          );
          return cleanedCompliance;
        }),
      }));
      setData(employeeData);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title="Personnel"
        subtitle="Assign roles, track responsibilities, and keep your team audit-ready with real-time monitoring, collaborative tools, and automated reminders."
        // action={<NewControlSheet />}
      />
      {data.length > 0 ? (
        <div className="flex gap-10">
          {/* FILTERS */}
          <div className="flex flex-col rounded-lg min-w-[260px]">
            {/* Filter heading */}
            <div className="flex text-sm 2xl:text-md items-center px-3 justify-between text-secondary border border-b-0 rounded-2xl rounded-b-none bg-muted h-[40px]">
              <div className="flex gap-2 text-secondary">
                <span className="font-semibold">Filters</span>
                <ListFilter className="w-5" />
                {/* <SortByDown01Icon /> */}
              </div>
              <ChevronRight className="w-5" />
            </div>
            {/* Selected compliances */}
            <div className="flex text-xs 2xl:text-sm items-center h-[46px] pl-3  border border-t-0 border-b-2">
              <div className="rounded-3xl flex justify-between items-center px-2 gap-2 bg-primary/20 h-7 2xl:h-8">
                All <Star className="w-4" />
              </div>
            </div>
            {/* List of all compliances */}
            <div className="flex flex-col text-sm 2xl:text-md border rounded-2xl rounded-t-none border-t-0">
              <div className="px-2.5 py-2.5 hover:bg-muted cursor-pointer last:rounded-b-2xl">
                Compliant
              </div>
              <div className="px-2.5 py-2.5 hover:bg-muted cursor-pointer last:rounded-b-2xl">
                Non-compliant
              </div>
              <div className="px-2.5 py-2.5 hover:bg-muted cursor-pointer last:rounded-b-2xl">
                Background Check
              </div>
              <div className="px-2.5 py-2.5 hover:bg-muted cursor-pointer last:rounded-b-2xl">
                Identity MFA
              </div>
              <div className="px-2.5 py-2.5 hover:bg-muted cursor-pointer last:rounded-b-2xl">
                Policies
              </div>
              <div className="px-2.5 py-2.5 hover:bg-muted cursor-pointer last:rounded-b-2xl">
                Security Training
              </div>
              <div className="px-2.5 py-2.5 hover:bg-muted cursor-pointer last:rounded-b-2xl">
                HIPAA Training
              </div>
              <div className="px-2.5 py-2.5 hover:bg-muted cursor-pointer last:rounded-b-2xl">
                AI Awareness Training
              </div>
              <div className="px-2.5 py-2.5 hover:bg-muted cursor-pointer last:rounded-b-2xl">
                Device Compliance
              </div>
            </div>
          </div>

          {/* EMPLOYEE TABLE */}
          <PersonnelContainer data={data} />
        </div>
      ) : (
        <div className="flex flex-col items-center mx-auto mt-5 w-[827px] ">
          <UserMultipleIcon className="w-[224px] h-[224px] text-[#E0E1E6]" />
          <div className="flex justify-center w-[412px] gap-4">
            <Button variant="outline" className="rounded-md text-secondary">
              <PlusSignIcon className="mr-2" />
              Import Employee
            </Button>
            <Button variant="outline" className="rounded-md text-secondary">
              <CurvyRightDirectionIcon className="mr-2" /> Integrations
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
