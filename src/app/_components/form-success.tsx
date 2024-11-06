import { CircleCheck, TriangleAlert } from "lucide-react";

interface FormErrorProps {
	message?: string;
}

export const FormSuccess = ({ message }: FormErrorProps) => {
	if (!message) return null;

	return (
		<div className="mt-2 flex items-center gap-x-2 rounded-md bg-emerald-500/15 px-3 py-1 text-emerald-500 text-sm ">
			<CircleCheck className="h-4 w-4" />
			<p>{message}</p>
		</div>
	);
};
