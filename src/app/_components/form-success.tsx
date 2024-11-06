import { CircleCheck, TriangleAlert } from "lucide-react";

interface FormErrorProps {
	message?: string;
}

export const FormSuccess = ({ message }: FormErrorProps) => {
	if (!message) return null;

	return (
		<div className="bg-emerald-500/15 text-sm py-1 px-3 rounded-md mt-2 flex items-center gap-x-2 text-emerald-500 ">
			<CircleCheck className="h-4 w-4" />
			<p>{message}</p>
		</div>
	);
};
