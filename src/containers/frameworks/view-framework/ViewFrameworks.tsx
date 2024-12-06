// "use client";

// import { useState } from "react";
// import CategoryCard from "./components/CategoryCard";
// import CategoryList from "./components/CategoryList";
// import ControlCompletionCard from "./components/ControlCompletionCard";
// import type { ICategory } from "./types";
// import { PanelRightClose, PanelRightOpen } from "lucide-react";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "~/app/_components/ui/tooltip";
// import { Button } from "~/app/_components/ui/button";
// import { frameworkList } from "../_lib/constants";
// import { useParams } from "next/navigation";

// const frameworkCategories = [
//   {
//     name: "CC1.0 Control Environment",
//     controlGroup: [
//       {
//         name: "CC1.1",
//         controls: [
//           {
//             name: "Risk management program established",
//             description:
//               "The employee performs background checks on new employees",
//             evidencesCollected: 3,
//             evidencesExpected: 4,
//             assignedTo: "John Doe",
//           },
//           {
//             name: "Employee background checks performed",
//             description:
//               "The employee performs background checks on new employees",
//             evidencesCollected: 2,
//             evidencesExpected: 5,
//             assignedTo: "John Doe",
//           },
//           {
//             name: "Office equipments checked ",
//             description:
//               "The employee performs background checks on new employees",
//             evidencesCollected: 7,
//             evidencesExpected: 8,
//             assignedTo: "John Doe",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     name: "CC2.0 Communication and information",
//     controlGroup: [
//       {
//         name: "CC1.1",
//         controls: [
//           {
//             name: "Risk management program established",
//             description:
//               "The employee performs background checks on new employees",
//             evidencesCollected: 3,
//             evidencesExpected: 4,
//             assignedTo: "John Doe",
//           },
//           {
//             name: "Employee background checks performed",
//             description:
//               "The employee performs background checks on new employees",
//             evidencesCollected: 2,
//             evidencesExpected: 5,
//             assignedTo: "John Doe",
//           },
//           {
//             name: "Office equipments checked ",
//             description:
//               "The employee performs background checks on new employees",
//             evidencesCollected: 7,
//             evidencesExpected: 8,
//             assignedTo: "John Doe",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     name: "CC3.0 Risk Assessment",
//     controlGroup: [
//       {
//         name: "CC1.1",
//         controls: [
//           {
//             name: "Risk management program established",
//             description:
//               "The employee performs background checks on new employees",
//             evidencesCollected: 3,
//             evidencesExpected: 4,
//             assignedTo: "John Doe",
//           },
//           {
//             name: "Employee background checks performed",
//             description:
//               "The employee performs background checks on new employees",
//             evidencesCollected: 2,
//             evidencesExpected: 5,
//             assignedTo: "John Doe",
//           },
//           {
//             name: "Office equipments checked ",
//             description:
//               "The employee performs background checks on new employees",
//             evidencesCollected: 7,
//             evidencesExpected: 8,
//             assignedTo: "John Doe",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     name: "CC4.0 Monitoring Activities",
//     controlGroup: [
//       {
//         name: "CC1.1",
//         controls: [
//           {
//             name: "Risk management program established",
//             description:
//               "The employee performs background checks on new employees",
//             evidencesCollected: 3,
//             evidencesExpected: 4,
//             assignedTo: "John Doe",
//           },
//           {
//             name: "Employee background checks performed",
//             description:
//               "The employee performs background checks on new employees",
//             evidencesCollected: 2,
//             evidencesExpected: 5,
//             assignedTo: "John Doe",
//           },
//           {
//             name: "Office equipments checked ",
//             description:
//               "The employee performs background checks on new employees",
//             evidencesCollected: 7,
//             evidencesExpected: 8,
//             assignedTo: "John Doe",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     name: "CC5.0 Control Activities",
//     controlGroup: [
//       {
//         name: "CC1.1",
//         controls: [
//           {
//             name: "Risk management program established",
//             description:
//               "The employee performs background checks on new employees",
//             evidencesCollected: 3,
//             evidencesExpected: 4,
//             assignedTo: "John Doe",
//           },
//           {
//             name: "Employee background checks performed",
//             description:
//               "The employee performs background checks on new employees",
//             evidencesCollected: 2,
//             evidencesExpected: 5,
//             assignedTo: "John Doe",
//           },
//           {
//             name: "Office equipments checked ",
//             description:
//               "The employee performs background checks on new employees",
//             evidencesCollected: 7,
//             evidencesExpected: 8,
//             assignedTo: "John Doe",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     name: "CC6.0 Logical and Physical Access Controls",
//     controlGroup: [
//       {
//         name: "CC1.1",
//         controls: [
//           {
//             name: "Risk management program established",
//             description:
//               "The employee performs background checks on new employees",
//             evidencesCollected: 3,
//             evidencesExpected: 4,
//             assignedTo: "John Doe",
//           },
//           {
//             name: "Employee background checks performed",
//             description:
//               "The employee performs background checks on new employees",
//             evidencesCollected: 2,
//             evidencesExpected: 5,
//             assignedTo: "John Doe",
//           },
//           {
//             name: "Office equipments checked ",
//             description:
//               "The employee performs background checks on new employees",
//             evidencesCollected: 7,
//             evidencesExpected: 8,
//             assignedTo: "John Doe",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     name: "CC7.0 System Operations",
//     controlGroup: [
//       {
//         name: "CC1.1",
//         controls: [
//           {
//             name: "Risk management program established",
//             description:
//               "The employee performs background checks on new employees",
//             evidencesCollected: 3,
//             evidencesExpected: 4,
//             assignedTo: "John Doe",
//           },
//           {
//             name: "Employee background checks performed",
//             description:
//               "The employee performs background checks on new employees",
//             evidencesCollected: 2,
//             evidencesExpected: 5,
//             assignedTo: "John Doe",
//           },
//           {
//             name: "Office equipments checked ",
//             description:
//               "The employee performs background checks on new employees",
//             evidencesCollected: 7,
//             evidencesExpected: 8,
//             assignedTo: "John Doe",
//           },
//         ],
//       },
//     ],
//   },
// ];

// export default function ViewFrameworks() {
//   const [isFrameworkInfoOpen, setIsFrameworkInfoOpen] = useState(true);
//   const params = useParams();
//   const frameworkId = params.id as string;

//   const framework = frameworkList.find(
//     (framework) => framework.name === frameworkId?.replace(/%20/g, " ")
//   );

//   return (
//     <div className="mx-auto flex justify-between gap-5 py-3">
//       {/* framework info */}
//       <div className="flex flex-col gap-2">
//         {/* Toggle info open panel */}
//         {isFrameworkInfoOpen ? (
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className="w-20"
//                   onClick={() => setIsFrameworkInfoOpen(false)}
//                 >
//                   <PanelRightOpen className="text-secondary cursor-pointer" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>Close info panel</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         ) : (
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className="w-20"
//                   onClick={() => setIsFrameworkInfoOpen(true)}
//                 >
//                   <PanelRightClose className="text-secondary cursor-pointer" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>Open info panel</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         )}
//         {isFrameworkInfoOpen && (
//           <div className="flex w-[261px] min-w-[28%] flex-col gap-8">
//             {/* progress */}
//             {framework && <ControlCompletionCard framework={framework} />}

//             {/* categories list */}
//             <CategoryList />
//           </div>
//         )}
//       </div>

//       {/* framework categories details  */}
//       <div className="flex w-full flex-col">
//         {frameworkCategories.map((category: ICategory) => (
//           <CategoryCard frameworkCategory={category} key={category.name} />
//         ))}
//       </div>
//     </div>
//   );
// }
