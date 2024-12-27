import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { PlusSignIcon, Search01Icon } from "hugeicons-react";
import React, { useMemo, useState } from "react";

import { Input } from "~/app/_components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/_components/ui/table";
import type { IEmployee } from "../types";
import { columns } from "./personnel-table-columns";
import { ImportEmployeeDialog } from "./import-employee-dialog";
import type { EmployeeType } from "~/server/models/Employee";
import { useDebounce } from "~/hooks/use-debounce";
import EmployeeProfileSheet from "./employee-profile-sheet";

type Props = {
  data: EmployeeType[];
  // employees: EmployeeType[] | undefined;
};

const preprocessData = (data: EmployeeType[]) =>
  data.map((row) => ({
    ...row,
    firstNameLower: row.firstName.toLowerCase(),
    lastNameLower: row.lastName.toLowerCase(),
  }));

export default function PersonnelContainer({ data }: Props) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  // State for selected employee and sheet visibility
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType>(
    {} as EmployeeType
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Preprocess data to include lowercase fields for faster comparisons
  const normalizedData = useMemo(() => preprocessData(data), [data]);

  // Filter data outside of the table setup
  const filteredData = useMemo(() => {
    const query = (debouncedSearchQuery ?? "").toLowerCase();
    if (!query) return normalizedData;
    return normalizedData.filter(
      (row) =>
        row.firstNameLower.includes(query) || row.lastNameLower.includes(query)
    );
  }, [debouncedSearchQuery, normalizedData]);

  // Employee tanstack table is created here
  const table = useReactTable<EmployeeType>({
    data: filteredData,
    columns: columns,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  // Dialog for employee upload
  const [showImportEmployeesDialog, setShowImportEmployeesDialog] =
    useState(false);

  const handleRowClick = (employee: EmployeeType) => {
    setSelectedEmployee(employee);
    setIsSheetOpen(true);
  };

  return (
    <div className="bg-gray-100 p-1 h-full rounded-lg border border-neutral-2 border-solid">
      <div className="flex grow flex-col rounded-lg h-max bg-white shadow-md">
        <div className="mx-auto flex w-full gap-3 bg-gray-100 p-3 [@media(min-width:1400px)]:p-4 2xl:p-5">
          <Input
            type="text"
            placeholder="Search for employees"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="min-w-[260px] h-[36px] [@media(min-width:1400px)]:h-[44px] rounded-md bg-[#F9F9FB]"
            suffix={
              <span className="cursor-pointer">
                <Search01Icon size="12" />
              </span>
            }
          />

          <ImportEmployeeDialog
            open={showImportEmployeesDialog}
            onOpenChange={setShowImportEmployeesDialog}
            showTrigger={true}
          />
        </div>
        <div className="border">
          <Table className="rounded-none">
            <TableHeader className="bg-muted text-[#40566D] ">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      <button className="rounded-none">
                        {header.isPlaceholder
                          ? null
                          : typeof header.column.columnDef.header === "function"
                          ? header.column.columnDef.header(header.getContext()) // Call the function to get the rendered header
                          : header.column.columnDef.header}
                      </button>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="bg-white">
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => handleRowClick(row.original)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!data && (
            <span className="mt-20 flex h-[400px] justify-center font-semibold text-2xl text-secondary 2xl:mt-30">
              No employee matches your filter query
            </span>
          )}
        </div>
      </div>

      {/* Sheet for Employee Profile */}
      {selectedEmployee ? (
        <EmployeeProfileSheet
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          employee={selectedEmployee as unknown as IEmployee}
        />
      ) : (
        ""
      )}
    </div>
  );
}
