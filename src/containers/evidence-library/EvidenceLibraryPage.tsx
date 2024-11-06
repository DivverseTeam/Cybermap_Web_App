// /app/dashboard/evidences/page.js
"use client";

// import { Pagination, Table, Button, Input } from '@shadcn/ui';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Search01Icon } from "hugeicons-react";
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
import { formatDate } from "~/lib/utils";
import { NewEvidenceSheet } from "./components/new-evidence-sheet";
import type { IEvidence } from "./types";

import { PaginationWithLinks } from "~/app/_components/ui/pagination-with-links";
import { Tabs, TabsList, TabsTrigger } from "~/app/_components/ui/tabs";
import { evidences } from "./_lib/constant";
import { columns } from "./components/evidence-table-columns";

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
	const [statusFilter, setStatusFilter] = useState<any>(null);

	useEffect(() => {
		const fetchData = async () => {
			// const res = await fetch(
			//   `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/evidences?page=${page}&limit=${limit}&search=${search}&sortColumn=${sortColumn}&sortOrder=${sortOrder}`,
			//   { cache: "no-store" }
			// );
			// const { evidences, total } = await res.json();
			const data = evidences;
			const filteredData = ["needs artifact", "updated"].includes(
				statusFilter?.toLocaleLowerCase(),
			)
				? evidences.filter(
						(evidence) =>
							evidence.status.toLocaleLowerCase() ===
							statusFilter.toLocaleLowerCase(),
					)
				: evidences;

			setData(filteredData);
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
		<div className="flex flex-col gap-6">
			<PageTitle
				title="Evidence Library"
				subtitle="View and manage your evidences and files"
				action={<NewEvidenceSheet />}
			/>

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
								<TabsTrigger value="Needs artifact">Needs artifact</TabsTrigger>
								<TabsTrigger value="Updated">Updated</TabsTrigger>
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
										<button
											onClick={() =>
												router.push(
													`/dashboard/evidences?page=${currentPage}&limit=${itemsPerPage}`,
												)
											}
										>
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
	);
}
