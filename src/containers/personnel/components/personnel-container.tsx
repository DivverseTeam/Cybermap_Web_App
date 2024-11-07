import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { PlusSignIcon, Search01Icon } from "hugeicons-react";
import Image from "next/image";
import React from "react";
import { Button } from "~/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import { Input } from "~/app/_components/ui/input";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
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

type Props = {
  data: IEmployee[];
};

export default function PersonnelContainer({ data }: Props) {
  // Employee tanstack table is created here
  const table = useReactTable({
    data,
    columns: columns,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    // onSortingChange: (updater) => {
    //   const newSortingState =
    //     typeof updater === "function" ? updater([]) : updater;

    //   const sortBy = newSortingState[0];
    //   router.push(
    //     `/dashboard/evidences?page=1&limit=${itemsPerPage}&search=${search}&sortColumn=${
    //       sortBy?.id
    //     }&sortOrder=${sortBy?.desc ? "desc" : "asc"}`
    //   );
    // },
  });

  return (
    <div className="flex flex-col grow">
      <div className="flex bg-muted p-4 2xl:p-5 gap-3 rounded-2xl rounded-b-none border w-full mx-auto">
        <Input
          type="text"
          placeholder="Search for available integrations"
          // onChange={handleSearch}
          // defaultValue={search}
          className="bg-[#F9F9FB] w-72 rounded-md"
          suffix={
            <span className="cursor-pointer">
              <Search01Icon size="12" />
            </span>
          }
        />
        <Button variant="outline" className="rounded-md text-secondary">
          <PlusSignIcon className="mr-2" />
          Import Employee
        </Button>
      </div>
      <div className="border">
        <Table className="rounded-none">
          <TableHeader className="bg-gray-100 text-[#40566D]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    <button>
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
            {/* {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {cell.renderCell()}
                </td>
              ))}
            </tr>
          ))} */}
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}