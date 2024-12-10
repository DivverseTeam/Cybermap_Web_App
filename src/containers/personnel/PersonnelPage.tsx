"use client";

import {
  CurvyRightDirectionIcon,
  PlusSignIcon,
  SortByDown01Icon,
  UserMultipleIcon,
} from "hugeicons-react";
import {
  ArrowUpToLine,
  ChevronRight,
  ListFilter,
  Star,
  TriangleAlert,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "~/app/_components/ui/button";
import PageTitle from "~/components/PageTitle";
// import { employees } from "./_lib/constants";
import PersonnelContainer from "./components/personnel-container";
import type { IEmployee } from "./types";
import { api } from "~/trpc/react";
import { ImportEmployeeDialog } from "./components/import-employee-dialog";
import type { EmployeeType } from "~/server/models/Employee";
import SpinnerModal from "./components/spinner-modal";
import { employees } from "./_lib/constants";

type Props = {};
// const employeesData = employees;

export default function PersonnelPage({}: Props) {
  const [data, setData] = useState<IEmployee[]>([]);

  // Scroll to top button logic
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // const {
  //   data: employees,
  //   isLoading,
  //   isError,
  // } = api.employees.getEmployees.useQuery();
  console.log(employees);

  // const employeesData = employees;

  const allCompliances = new Set();

  employees?.forEach((employee: IEmployee) => {
    employee.complianceList?.forEach((compliance) => {
      Object.keys(compliance).forEach((key) => allCompliances.add(key));
    });
  });

  const complianceList = Array.from(allCompliances);

  // FILTER LOGIC
  const [selectedCompliances, setSelectedCompliances] = useState<string[]>([]);

  // Function to remove a compliance from selectedCompliances
  const addSelectedCompliance = (compliance: string) => {
    setSelectedCompliances((prev) =>
      prev.includes(compliance)
        ? prev.filter((item) => item !== compliance)
        : [...prev, compliance]
    );
  };

  // Function to remove a compliance from selectedCompliances
  const removeSelectedCompliance = (compliance: string) => {
    setSelectedCompliances((prevCompliances) =>
      prevCompliances.filter((item) => item !== compliance)
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      // const res = await fetch(
      //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/evidences?page=${page}&limit=${limit}&search=${search}&sortColumn=${sortColumn}&sortOrder=${sortOrder}`,
      //   { cache: "no-store" }
      // );
      // const { evidences, total } = await res.json();
      const employeeData = employees?.map((employee: IEmployee) => ({
        ...employee,
        hireDate: new Date(employee.hireDate),
        terminationDate:
          employee.terminationDate && new Date(employee.terminationDate),
        complianceList: employee.complianceList?.map((compliance) => {
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
      const filteredData = employeeData?.filter((employee) => {
        // Check if "compliant" is selected in the list
        if (selectedCompliances.includes("Compliant")) {
          return employee.complianceList?.every(
            (compliance) => Object.values(compliance)[0] === true
          );
        }

        // Check if "non-compliant" is selected in the list
        if (selectedCompliances.includes("Non-compliant")) {
          return employee.complianceList?.some((compliance) =>
            Object.values(compliance).some((value) => value === false)
          );
        }

        // General case for specific compliance selections
        return selectedCompliances.every((compliance) =>
          employee.complianceList?.some(
            (complianceObj) => complianceObj[compliance] === true
          )
        );
      });
      setData(filteredData);
    };
    fetchData();
    console.log(selectedCompliances);
  }, [selectedCompliances]);

  // Dialog for employee upload
  const [showImportEmployeesDialog, setShowImportEmployeesDialog] =
    useState(false);

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title="Employees"
        subtitle="View and manage your employees."
        // action={<NewControlSheet />}
      />
      {(employees ?? []).length > 0 ? (
        <div className="flex gap-5 [@media(min-width:1400px)]:gap-6">
          {/* FILTERS */}
          <div className="bg-gray-100 p-1 h-full rounded-lg border border-neutral-2 border-solid">
            <div className="flex min-w-[200px] flex-col rounded-lg [@media(min-width:1400px)]:min-w-[260px] h-max bg-white shadow-md">
              {/* Filter heading */}
              <div className="flex h-[34px] [@media(min-width:1400px)]:h-[40px] items-center justify-between rounded-b-none shadow-none bg-gray-100 px-3 text-secondary text-sm 2xl:text-md">
                <div className="flex gap-2 text-secondary">
                  <span className="font-semibold">Filters</span>
                  <ListFilter className="w-5" />
                  {/* <SortByDown01Icon /> */}
                </div>
                <ChevronRight className="w-5" />
              </div>
              {/* Selected compliances */}
              <div className="flex flex-wrap items-center border border-x-0 border-t-0 border-b-2 py-2 pl-2 [@media(min-width:1400px)]:pl-3 text-xs 2xl:text-sm">
                <div className="mb-1 flex h-5 items-center justify-between gap-2 rounded-3xl bg-primary/20 px-2 2xl:h-8">
                  All <Star className="w-4" />
                </div>
                {selectedCompliances.map((selectedCompliance: string) => (
                  <div
                    key={selectedCompliance}
                    className="mb-1 ml-1 flex h-5 items-center justify-between gap-1 rounded-3xl bg-primary/20 px-2 font-semibold 2xl:h-8"
                  >
                    {selectedCompliance}
                    <X
                      className="w-3 cursor-pointer hover:w-4"
                      onClick={() =>
                        removeSelectedCompliance(selectedCompliance)
                      }
                      aria-label={`Remove ${selectedCompliance}`}
                    />
                  </div>
                ))}
              </div>
              {/* List of all compliances */}
              <div className="flex flex-col text-sm 2xl:text-md">
                {[
                  "Compliant",
                  "Non-compliant",
                  ...((complianceList as string[]) || []),
                ].map((compliance) => (
                  <div
                    key={compliance}
                    className="cursor-pointer px-1.5 py-1.5 [@media(min-width:1400px)]:px-2.5 [@media(min-width:1400px)]:py-2.5 last:rounded-b-2xl hover:bg-muted"
                    onClick={() => addSelectedCompliance(compliance)}
                  >
                    {compliance}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* EMPLOYEE TABLE */}
          <PersonnelContainer data={data} />
        </div>
      ) : (
        <div className="mx-auto mt-5 flex w-[827px] flex-col items-center ">
          <UserMultipleIcon className="h-[224px] w-[224px] text-[#E0E1E6]" />
          <div className="flex w-[412px] justify-center gap-4">
            <ImportEmployeeDialog
              open={showImportEmployeesDialog}
              onOpenChange={setShowImportEmployeesDialog}
              showTrigger={true}
            />
            <Button variant="outline" className="rounded-md text-secondary">
              <CurvyRightDirectionIcon className="mr-2" /> Integrations
            </Button>
          </div>
          {/* {isError && (
            <div className="flex items-center gap-1">
              <TriangleAlert className="text-[#C65C10]" />
              <span className="text-[#C65C10]">
                Error fetching employees. Please try again later
              </span>
            </div>
          )} */}
        </div>
      )}
      <Button
        variant="outline"
        onClick={scrollToTop}
        className={`fixed right-4 bottom-4 rounded-full bg-gray-300 p-2 shadow-lg transition hover:bg-gray-400 ${
          isVisible ? "opacity-80" : "opacity-10"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUpToLine />
      </Button>
      {/* <SpinnerModal show={isLoading} /> */}
    </div>
  );
}
