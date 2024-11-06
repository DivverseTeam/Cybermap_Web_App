import { twMerge } from "tailwind-merge";
import { CompletedIcon } from "~/components/svgs/Completed";
import { CyberMapLogo } from "~/components/svgs/CyberMapLogo";

export default function SideBar({ step }: { step: number }) {
	return (
		<div className="flex min-h-screen w-[28.563rem] flex-col justify-between bg-[#192839] pt-12 pr-8 pb-20 pl-12">
			<div className="flex flex-col gap-20">
				<div className="flex items-center gap-2">
					<CyberMapLogo />
					<span className="font-semibold text-sm text-white">CyberMap</span>
				</div>
				<div className="flex flex-col gap-1">
					{[
						{
							title: "Company info",
							subtitle: "Fill details about your company",
						},
						{
							title: "Frameworks",
							subtitle: "Select the framework that you need",
						},
						{
							title: "Integrations",
							subtitle: "Select your cloud provider",
						},
						{
							title: "Finish",
							subtitle: "Finalize setup and start running",
						},
					].map(({ title, subtitle }, index, arr) => (
						<>
							{(() => {
								const active = step === index + 1;
								const completed = step > index + 1;
								return (
									<div className="flex gap-[1.188rem]" key={title}>
										<div className="flex flex-col items-center gap-[4px]">
											<div
												className={twMerge(
													"flex h-8 w-8 items-center justify-center rounded-[50%] border-2 border-solid",
													active
														? "border-white"
														: completed
															? "border-none bg-[#00A251]"
															: "border-[#6C849D2E]",
												)}
											>
												{!completed ? (
													<span
														className={twMerge(
															"text-sm",
															active ? "text-white" : "text-[#6C849D2E]",
														)}
													>
														{index + 1}
													</span>
												) : (
													<CompletedIcon />
												)}
											</div>
											{Boolean(index + 1 !== arr.length) && (
												<div className="h-10 border-[#6C849D2E] border-l-2 border-solid"></div>
											)}
										</div>
										<div className="flex flex-col">
											<span
												className={
													active
														? "font-semibold text-base text-white leading-8"
														: "font-semibold text-[#40566D] text-base leading-8"
												}
											>
												{title}
											</span>
											<span
												className={
													active
														? "font-normal text-base text-white leading-8 opacity-40"
														: "font-normal text-[#6C849D52] text-base leading-8 "
												}
											>
												{subtitle}
											</span>
										</div>
									</div>
								);
							})()}
						</>
					))}
				</div>
			</div>
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-6">
					<CyberMapLogo />
					<div className="flex flex-col gap-1">
						<span className="font-semibold text-base text-white opacity-85">
							Having trouble?
						</span>
						<span className="font-normal text-sm text-white opacity-85">
							Feel free to contact us and we will always help you through the
							process
						</span>
					</div>
					<button className="h-8 w-[5.5rem] rounded-sm border border-white border-solid font-semibold text-white text-xs outline-none">
						Contact us
					</button>
				</div>
			</div>
		</div>
	);
}
