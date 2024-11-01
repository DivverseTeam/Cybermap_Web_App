import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const unslugify = (slug: string) =>
	slug
		.replace(/\-/g, " ")
		.replace(
			/\w\S*/g,
			(text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
		);

export const slugify = (str: string) => {
	str = str.replace(/^\s+|\s+$/g, "");
	str = str.toLowerCase();
	str = str
		.replace(/[^a-z0-9 -]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
	return str;
};
