"use client";

import React, { useRef, useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/app/_components/ui/accordion";

import { User, X } from "lucide-react";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { Progress } from "~/app/_components/ui/progress";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "~/app/_components/ui/table";
import { ViewControlSheet } from "./view-control-sheet";

type Props = {
	frameworkCategory: any;
};

export default function CategoryCard({ frameworkCategory }: Props) {
	const [showViewControlSheet, setShowViewControlSheet] = useState(false);

	return (
		<div className="rounded-md bg-muted p-4  mb-3 text-secondary-foreground">
			<Accordion
				type="single"
				collapsible
				className="w-full"
				key={frameworkCategory.name}
			>
				<AccordionItem value="item-1" className="border-none">
					<AccordionTrigger className="hover:no-underline">
						{frameworkCategory.name}
					</AccordionTrigger>
					{frameworkCategory.controlGroup.map((group: any, key: any) => (
						<AccordionContent key={group.name}>
							<div className="py-5 px-4 flex flex-col bg-white rounded-sm">
								<div className="flex flex-col">
									<div className="flex justify-between items-center">
										<h5 className="font-bold text-secondary-foreground">
											{group.name}
										</h5>
										<ViewControlSheet
											open={showViewControlSheet}
											onOpenChange={setShowViewControlSheet}
											control={group}
										/>
									</div>
									<div className="p-3">
										<Table className="w-full">
											<TableHeader>
												<TableRow className="font-extrabold text-muted text-xs">
													<TableHead className="w-3/5 ">CONTROL</TableHead>
													<TableHead>STATUS</TableHead>
													<TableHead>ASSIGNED TO</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody className="text-xs font-normal">
												{group.controls.map((control: any, key: any) => (
													<TableRow key={control.name}>
														<TableCell className="font-medium flex flex-col ">
															<span>{control.name}</span>
															<span className="text-secondary">
																{control.description}
															</span>
														</TableCell>
														<TableCell>
															<div className="flex flex-col">
																{control.evidencesCollected ===
																	control.evidencesExpected && (
																	<span className="text-[#008743] bg-[#008743]/20 font-semibold h-4 rounded-full text-[10px] flex items-center justify-center">
																		Fully Implemented
																	</span>
																)}
																{control.evidencesCollected > 0 &&
																	control.evidencesCollected <
																		control.evidencesExpected && (
																		<span className="text-[#C65C10] px-1 bg-[#C65C10]/20 font-semibold h-4 rounded-full text-[10px] flex items-center justify-center">
																			Partially Implemented
																		</span>
																	)}
																{control.evidencesCollected === 0 && (
																	<span className="text-destructive bg-destructive/20 font-semibold h-4 rounded-full text-[10px] flex items-center justify-center">
																		Not Implemented
																	</span>
																)}
																{/* <Progress
                                value={
                                  (+control.evidencesCollected /
                                    +control.evidencesExpected) *
                                  100
                                }
                              /> */}
															</div>
														</TableCell>
														<TableCell className="font-semibold ">
															{control.assignedTo}
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								</div>
							</div>
						</AccordionContent>
					))}
				</AccordionItem>
			</Accordion>
		</div>
	);
}
