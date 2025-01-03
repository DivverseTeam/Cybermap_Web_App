// /app/dashboard/evidences/page.js
"use client";

// import { Pagination, Table, Button, Input } from '@shadcn/ui';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LibraryIcon, Search01Icon } from "hugeicons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
// import { evidences } from "../evidence-libraryOLD/_lib/constant";
import { Input } from "~/app/_components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/_components/ui/table";
import PageTitle from "~/components/PageTitle";
import type { IEvidence } from "./types";

import { PaginationWithLinks } from "~/app/_components/ui/pagination-with-links";
import { Tabs, TabsList, TabsTrigger } from "~/app/_components/ui/tabs";
import { evidences } from "./_lib/constant";
import { columns } from "./components/evidence-table-columns";
import { NewEvidenceSheet } from "./components/new-evidence-sheet";

interface EvidencesTableProps {
  searchParams: { [key: string]: string | undefined };
}

export default function EvidenceLibraryPage({
  searchParams,
}: EvidencesTableProps) {
  // const searchParams = useSearchParams();
  const currentPage = parseInt((searchParams.page as string) || "1");
  const itemsPerPage = parseInt((searchParams.pageSize as string) || "10");
  // const search = searchParams.get("search") || "";
  // const sortColumn = searchParams.get("sortColumn") || "title";
  // const sortOrder = searchParams.get("sortOrder") || "asc";

  const router = useRouter();
  const [data, setData] = useState<IEvidence[]>([]);
  // const [total, setTotal] = useState(0);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(10);

  // Status filter goes here
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // const res = await fetch(
      //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/evidences?page=${page}&limit=${limit}&search=${search}&sortColumn=${sortColumn}&sortOrder=${sortOrder}`,
      //   { cache: "no-store" }
      // );
      // const { evidences, total } = await res.json();
      // const data = evidences;
      const filteredData =
        statusFilter &&
        ["needs artifact", "updated"].includes(
          statusFilter?.toLocaleLowerCase()
        )
          ? evidences.filter(
              (evidence) =>
                evidence.status.toLocaleLowerCase() ===
                statusFilter.toLocaleLowerCase()
            )
          : evidences;

      // setData(filteredData);
      setData([]);
      // setTotal(total);
      console.log(statusFilter);
    };
    fetchData();
  }, [currentPage, itemsPerPage, statusFilter]);

  const lastPostIndex = currentPage * itemsPerPage;
  const firstPostIndex = lastPostIndex - itemsPerPage;
  const currentItems = data.slice(firstPostIndex, lastPostIndex);
  if (currentItems) {
    const pageCount = currentItems.length / itemsPerPage;
    console.log("data", currentItems);
    console.log("items per page", itemsPerPage);
    console.log("page count", pageCount);
  }

  const table = useReactTable({
    data: currentItems,
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

  return (
    <div className="flex flex-col gap-6 px-4 [@media(min-width:1400px)]:px-6">
      <PageTitle
        title="Evidence Library"
        subtitle="View and manage your evidences and files"
        action={<NewEvidenceSheet />}
      />

      <div className="bg-gray-100 p-1 h-full rounded-lg border border-neutral-2 border-solid">
        <div className="container flex flex-col gap-6 bg-white p-6 rounded-lg h-max shadow-md">
          <div className="flex justify-between">
            <div>
              <Tabs
                defaultValue="All"
                className="w-[400px]"
                onValueChange={(value: string | null) =>
                  setStatusFilter(value === "All" ? null : value)
                }
              >
                <TabsList>
                  <TabsTrigger value="All">All</TabsTrigger>
                  <TabsTrigger value="Needs artifact">
                    Needs artifact
                  </TabsTrigger>
                  <TabsTrigger value="Updated">Updated</TabsTrigger>
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

          {data.length > 0 ? (
            <Table className="border ">
              <TableHeader className="bg-muted border text-[#40566D] text-xs [@media(min-width:1400px)]:text-sm">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/evidences?page=${currentPage}&limit=${itemsPerPage}`
                            )
                          }
                        >
                          {header.isPlaceholder
                            ? null
                            : typeof header.column.columnDef.header ===
                              "function"
                            ? header.column.columnDef.header(
                                header.getContext()
                              ) // Call the function to get the rendered header
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
          ) : (
            <div className="flex items-center justify-center m-auto h-[550px] 2xl:h-[835px]">
              <div className="flex items-center flex-col gap-4">
                <LibraryIcon className="w-44 h-44 text-gray-200" />
                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-xl font-medium">No evidences here yet</h2>
                  <p className="text-secondary font-normal">
                    Evidences collected will appear here after they are
                    collected
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* <PaginationSection
          currentPage={page}
          onPageChange={(newPage: any) => handlePageChange(newPage)}
          totalItems={total}
          itemsPerPage={limit}
        /> */}
          <PaginationWithLinks
            page={currentPage}
            pageSize={itemsPerPage}
            totalCount={data.length}
            pageSizeSelectOptions={{
              pageSizeOptions: [5, 10, 25, 50],
            }}
          />
        </div>
      </div>
    </div>
  );
}
