"use client";

import React, { useEffect, useState } from "react";
import PageTitle from "~/components/PageTitle";
import { NewControlSheet } from "./components/new-controls-sheet";
import { useRouter } from "next/navigation";
import { IControl } from "./types";
import { controls } from "./_lib/constants";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columns } from "./components/control-table-columns";
import { Tabs, TabsList, TabsTrigger } from "~/app/_components/ui/tabs";
import { Input } from "~/app/_components/ui/input";
import { Search01Icon } from "hugeicons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/_components/ui/table";
import { Checkbox } from "~/app/_components/ui/checkbox";

type Props = {};

const frameworksList = [
  { name: "hipaa", label: "HIPAA" },
  { name: "gdpr", label: "GDPR" },
  { name: "iso27001", label: "ISO 27001" },
  { name: "soc2i", label: "SOC 2 II" },
  { name: "pcidss", label: "PCI DSS" },
  { name: "nist", label: "NIST" },
];

export default function ControlsPage({}) {
  // const searchParams = useSearchParams();
  // const search = searchParams.get("search") || "";
  // const sortColumn = searchParams.get("sortColumn") || "title";
  // const sortOrder = searchParams.get("sortOrder") || "asc";

  const router = useRouter();
  const [data, setData] = useState<IControl[]>([]);
  // const [total, setTotal] = useState(0);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(10);

  // Status filter goes here
  const [statusFilter, setStatusFilter] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      // const res = await fetch(
      //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/evidences?page=${page}&limit=${limit}&search=${search}&sortColumn=${sortColumn}&sortOrder=${sortOrder}`,
      //   { cache: "no-store" }
      // );
      // const { evidences, total } = await res.json();
      const data = controls;
      const filteredData = [
        "partially implemented",
        "fully implemented",
        "not implemented",
      ].includes(statusFilter?.toLocaleLowerCase())
        ? controls.filter(
            (control) =>
              control.status.toLocaleLowerCase() ===
              statusFilter.toLocaleLowerCase()
          )
        : controls;

      setData(filteredData);
      // setTotal(total);
      console.log(statusFilter);
    };
    fetchData();
  }, [statusFilter]);

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

  // const handleSearch = (e: any) => {
  //   router.push(
  //     `/dashboard/evidences?page=1&limit=${itemsPerPage}&search=${e.target.value}`
  //   );
  // };

  // const handlePageChange = (newPage: any) => {
  //   setCurrentPage(newPage);
  //   router.push(
  //     `/dashboard/evidences?page=${newPage}&limit=${limit}&search=${search}&sortColumn=${sortColumn}&sortOrder=${sortOrder}`
  //   );
  // };

  // Frameworks checked options
  const [checkedItems, setCheckedItems] = useState(["All frameworks"]);

  // Handle checkbox change
  const handleCheckboxChange = (event: any) => {
    const { value, checked } = event.target;

    // Add or remove checked items based on their status
    setCheckedItems((prev: any) =>
      checked ? [...prev, value] : prev.filter((item: any) => item !== value)
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title="Controls"
        subtitle="View and manage your controls"
        action={<NewControlSheet />}
      />
      <div className="flex gap-10">
        <div className="w-[142px] 2xl:w-[200px] flex flex-col gap-1">
          <h5 className="mb-3">Frameworks</h5>

          <div className="flex items-center space-x-2 text-xs">
            <Checkbox
              id="allFrameworks"
              value="All frameworks"
              onChange={handleCheckboxChange}
              checked={checkedItems.includes("All frameworks")}
            />
            <label
              htmlFor="allFrameworks"
              className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              All frameworks
            </label>
          </div>
          {frameworksList.map((framework, index) => (
            <div className="flex items-center space-x-2 text-xs" key={index}>
              <Checkbox
                id={framework.name}
                value={framework.label}
                onChange={handleCheckboxChange}
                checked={checkedItems.includes(framework.label)}
              />
              <label
                htmlFor={framework.name}
                className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {framework.label}
              </label>
            </div>
          ))}
          <div className="flex items-center space-x-2 text-xs">
            <Checkbox
              id="noFrameworks"
              value="No frameworks"
              onChange={handleCheckboxChange}
              checked={checkedItems.includes("No frameworks")}
            />
            <label
              htmlFor="noFrameworks"
              className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              No frameworks
            </label>
          </div>
        </div>

        <div className="container flex flex-col gap-6 bg-white p-4 py-6">
          <div className="flex justify-between">
            <div>
              <Tabs
                defaultValue="All"
                className="w-[400px]"
                onValueChange={(value) =>
                  setStatusFilter(value === "All" ? null : value)
                }
              >
                <TabsList>
                  <TabsTrigger value="All">All</TabsTrigger>
                  <TabsTrigger value="Partially implemented">
                    Partially implemented
                  </TabsTrigger>
                  <TabsTrigger value="Fully implemented">
                    Fully implemented
                  </TabsTrigger>
                  <TabsTrigger value="Not implemented">
                    Not implemented
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Input
              type="text"
              placeholder="Search for a file"
              // onChange={handleSearch}
              // defaultValue={search}
              className="bg-[#F9F9FB] w-72"
              suffix={
                <span className="cursor-pointer">
                  <Search01Icon size="12" />
                </span>
              }
            />
          </div>

          <Table>
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
        </div>
      </div>
    </div>
  );
}
