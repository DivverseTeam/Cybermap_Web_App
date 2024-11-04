// import { useRouter } from "next/navigation";
// import React from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
// } from "~/app/_components/ui/table";
// import { Evidence } from "~/containers/evidence-library/_lib/queries";
// import { EvidenceStatus } from "~/containers/evidence-library/_lib/validations";
// import { SearchParams } from "~/types";
// // import { PencilIcon, TrashIcon } from '@heroicons/react/solid'; // Adjust icon library if needed

// type Props = {
//   evidences: Evidence[];
//   total: number;
//   page: number;
//   limit: number;
//   search: string;
//   status: EvidenceStatus;
// };

// export default function DataTable({
//   evidences,
//   total,
//   page,
//   limit,
//   search,
//   status,
// }: Props) {
//   const router = useRouter();

//   const handlePageChange = (newPage: any) => {
//     router.push(
//       `/dashboard/evidences?page=${newPage}&limit=${limit}&search=${search}&status=${status}&priority=${priority}`
//     );
//   };

//   const handleSearch = (e: any) => {
//     router.push(
//       `/dashboard/evidences?page=1&limit=${limit}&search=${e.target.value}&status=${status}&priority=${priority}`
//     );
//   };

//   const handleFilter = (filter: any) => {
//     router.push(
//       `/dashboard/evidences?page=1&limit=${limit}&search=${search}&${filter}`
//     );
//   };

//   return (
//     <div className="container">
//       <input
//         type="text"
//         placeholder="Search..."
//         onChange={handleSearch}
//         defaultValue={search}
//         className="mb-4 p-2 border border-gray-300 rounded"
//       />
//       <select
//         onChange={(e) => handleFilter(`status=${e.target.value}`)}
//         className="mb-4 p-2 border border-gray-300 rounded"
//       >
//         <option value="">All Status</option>
//         <option value="open">Open</option>
//         <option value="closed">Closed</option>
//       </select>
//       <select
//         onChange={(e) => handleFilter(`priority=${e.target.value}`)}
//         className="mb-4 p-2 border border-gray-300 rounded"
//       >
//         <option value="">All Priority</option>
//         <option value="low">Low</option>
//         <option value="medium">Medium</option>
//         <option value="high">High</option>
//       </select>

//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Title</TableCell>
//             <TableCell>Label</TableCell>
//             <TableCell>Status</TableCell>
//             <TableCell>Priority</TableCell>
//             <TableCell>Linked Controls</TableCell>
//             <TableCell>Renewal Date</TableCell>
//             <TableCell>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {evidences.map((evidence) => (
//             <TableRow key={evidence.id}>
//               <TableCell>{evidence.name}</TableCell>
//               <TableCell>{evidence.status}</TableCell>
//               <TableCell>{evidence.linkedControls.join(", ")}</TableCell>
//               <TableCell>{evidence.renewalDate}</TableCell>
//               {/* <TableCell>
//                 <IconButton
//                   onClick={() => handleEdit(evidence.id)}
//                   icon={<PencilIcon />}
//                   className="text-blue-600 mr-2"
//                 />
//                 <IconButton
//                   onClick={() => handleDelete(evidence.id)}
//                   icon={<TrashIcon />}
//                   className="text-red-600"
//                 />
//               </TableCell> */}
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       <TablePagination
//         component="div"
//         count={total}
//         page={page - 1}
//         onPageChange={(e, newPage) => handlePageChange(newPage + 1)}
//         rowsPerPage={limit}
//         rowsPerPageOptions={[5, 10, 20]}
//         onRowsPerPageChange={(e) =>
//           router.push(
//             `/dashboard/evidences?page=1&limit=${e.target.value}&search=${search}&status=${status}&priority=${priority}`
//           )
//         }
//       />
//     </div>
//   );
// }
