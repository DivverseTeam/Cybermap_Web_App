"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search01Icon } from "hugeicons-react";
import { ArrowUpToLine, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "~/app/_components/ui/button";
import { Checkbox } from "~/app/_components/ui/checkbox";
import { Input } from "~/app/_components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/_components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "~/app/_components/ui/tabs";
import PageTitle from "~/components/PageTitle";
import { controls } from "./_lib/constants";
import { columns } from "./components/control-table-columns";
import { NewControlSheet } from "./components/new-controls-sheet";
import type { IControl } from "./types";

// const frameworksList = [
//   { name: "hipaa", label: "HIPAA" },
//   { name: "gdpr", label: "GDPR" },
//   { name: "iso27001", label: "ISO 27001" },
//   { name: "soc2ii", label: "SOC 2 II" },
//   { name: "pcidss", label: "PCI DSS" },
//   { name: "nist", label: "NIST" },
// ];

export default function ControlsPage({}) {
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

  // const searchParams = useSearchParams();
  // const search = searchParams.get("search") || "";
  // const sortColumn = searchParams.get("sortColumn") || "title";
  // const sortOrder = searchParams.get("sortOrder") || "asc";

  // const router = useRouter();
  const [data, setData] = useState<IControl[]>([]);
  // const [total, setTotal] = useState(0);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(10);

  // Status filter goes here
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);

  // Unique list of frameworks
  const frameworks = Array.from(
    new Set(controls.flatMap((control) => control.mappedControls))
  );

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    if (value === "All frameworks") {
      // Select all frameworks
      setSelectedFrameworks(checked ? frameworks : []);
    } else if (value === "No framework") {
      // Select "No framework" only if checked, otherwise clear it
      setSelectedFrameworks(checked ? ["No framework"] : []);
    } else {
      // Toggle individual frameworks
      setSelectedFrameworks((prev) =>
        checked
          ? [...prev, value]
          : prev.filter((framework) => framework !== value)
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // const res = await fetch(
      //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/evidences?page=${page}&limit=${limit}&search=${search}&sortColumn=${sortColumn}&sortOrder=${sortOrder}`,
      //   { cache: "no-store" }
      // );
      // const { evidences, total } = await res.json();
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

      // Filter controls based on selected frameworks
      const filteredControlsData = filteredData.filter((control) => {
        if (selectedFrameworks.includes("No framework")) {
          return control.mappedControls.length === 0;
        }
        if (
          selectedFrameworks.length === 0 ||
          selectedFrameworks.includes("All frameworks")
        ) {
          return true; // Show all controls if no specific filter is applied
        }
        return selectedFrameworks.some((framework) =>
          control.mappedControls.includes(framework)
        );
      });
      setData(filteredControlsData);
      // setTotal(total);
      console.log(statusFilter);
    };
    fetchData();
  }, [statusFilter, selectedFrameworks]);

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

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title="Controls"
        subtitle="View and manage your controls"
        action={<NewControlSheet />}
      />
      <div className="flex gap-7 [@media(min-width:1400px)]:gap-10">
        <div className="flex w-[136px] [@media(min-width:1400px)]:w-[142px] flex-col gap-1 [@media(min-width:1400px)]:gap-2 2xl:w-[200px]">
          <h5 className="mb-3 font-semibold">Frameworks</h5>

          <label className="flex items-center text-xs 2xl:text-sm">
            <input
              type="checkbox"
              value="All frameworks"
              onChange={handleCheckboxChange}
              checked={selectedFrameworks.length === frameworks.length}
              className="mr-[6px] h-4 w-4 cursor-pointer appearance-none rounded-sm border border-primary checked:border-transparent checked:bg-primary focus:outline-none "
            />
            {selectedFrameworks.length === frameworks.length && (
              <Check className="pointer-events-none absolute h-4 w-4 text-white" />
            )}
            All frameworks
          </label>
          {frameworks.map((framework: string) => (
            <label
              key={framework}
              className="flex items-center text-xs 2xl:text-sm"
            >
              <input
                type="checkbox"
                value={framework}
                onChange={handleCheckboxChange}
                checked={selectedFrameworks.includes(framework)}
                className="mr-[6px] h-4 w-4 cursor-pointer appearance-none rounded-sm border border-primary checked:border-transparent checked:bg-primary focus:outline-none "
              />
              {selectedFrameworks.includes(framework) && (
                <Check className="pointer-events-none absolute h-4 w-4 text-white" />
              )}
              {framework}
            </label>
          ))}
          <label className="flex items-center text-xs 2xl:text-sm">
            <input
              type="checkbox"
              value="No framework"
              onChange={handleCheckboxChange}
              checked={selectedFrameworks.includes("No framework")}
              className="mr-[6px] h-4 w-4 cursor-pointer appearance-none rounded-sm border border-primary checked:border-transparent checked:bg-primary focus:outline-none "
            />
            {selectedFrameworks.includes("No framework") && (
              <Check className="pointer-events-none absolute h-4 w-4 text-white" />
            )}
            No framework
          </label>
        </div>

        <div className="container flex flex-col gap-4 [@media(min-width:1400px)]:gap-6 bg-white p-3 [@media(min-width:1400px)]:p-4 py-4 [@media(min-width:1400px)]:py-6">
          <div className="flex justify-between">
            <div>
              <Tabs
                defaultValue="All"
                className="w-[100px]"
                onValueChange={(value) =>
                  setStatusFilter(value === "All" ? "" : value)
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
              className="w-54 [@media(min-width:1400px)]:w-72 bg-[#F9F9FB]"
              suffix={
                <span className="cursor-pointer">
                  <Search01Icon size="12" />
                </span>
              }
            />
          </div>

          <Table className="border">
            <TableHeader className="bg-white border text-[#40566D] text-xs [@media(min-width:1400px)]:text-sm">
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
      <Button
        variant="outline"
        onClick={scrollToTop}
        className={`fixed right-4 bottom-4 rounded-full bg-muted p-2 shadow-lg transition hover:bg-gray-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUpToLine />
      </Button>
    </div>
  );
}
