import { isAfter, isBefore } from "date-fns";
import { evidences } from "./constant";

// Types for Evidence and the response
export interface Evidence {
	id: string;
	name: string;
	owner: string;
	description: string;
	implementationGuide: string;
	status: string;
	linkedControls: string[];
	renewalDate: string;
	createdAt: string;
	updatedAt: string;
}

interface GetEvidencesSchema {
	page: number;
	per_page: number;
	sort?: string;
	name?: string;
	status?: string;
	linkedControls?: string[]; // Array of linked control strings
	renewalDate?: Date;
	operator?: string;
	from?: string;
	to?: string;
}

export interface EvidenceResponse {
	data: Evidence[];
	totalRows: number;
	pageCount: number;
}

// Filter evidences based on the provided filters
function filterEvidences(
	evidences: Evidence[],
	filters: Partial<GetEvidencesSchema>,
): Evidence[] {
	const { name, status, from, to, linkedControls } = filters;

	return evidences.filter((evidence) => {
		let isValid = true;

		// Filter by name
		if (name && !evidence.name.toLowerCase().includes(name.toLowerCase())) {
			isValid = false;
		}

		// Filter by status
		if (status && evidence.status !== status) {
			isValid = false;
		}

		// Filter by linkedControls array (check if any linked control matches)
		if (linkedControls && linkedControls.length > 0) {
			const evidenceControls = evidence.linkedControls;
			const matches = linkedControls.some((control) =>
				evidenceControls.includes(control),
			);
			if (!matches) {
				isValid = false;
			}
		}

		// Filter by date range
		if (from || to) {
			const fromDate = from ? new Date(from) : undefined;
			const toDate = to ? new Date(to) : undefined;

			const createdAt = new Date(evidence.createdAt);

			if (fromDate && isBefore(createdAt, fromDate)) {
				isValid = false;
			}

			if (toDate && isAfter(createdAt, toDate)) {
				isValid = false;
			}
		}

		return isValid;
	});
}

// Sort evidences based on the provided column and order
function sortEvidences(evidences: Evidence[], sort?: string): Evidence[] {
	const [column = "createdAt", order = "desc"] = sort?.split(".") ?? [
		"createdAt",
		"desc",
	];

	return evidences.sort((a, b) => {
		const aValue = a[column as keyof Evidence];
		const bValue = b[column as keyof Evidence];

		if (order === "asc") {
			return aValue > bValue ? 1 : -1;
		} else {
			return aValue < bValue ? 1 : -1;
		}
	});
}

// Paginate evidences using skip (offset) and take (limit)
function paginateEvidences(
	evidences: Evidence[],
	page: number,
	per_page: number,
): Evidence[] {
	const offset = (page - 1) * per_page;
	return evidences.slice(offset, offset + per_page);
}

// Main function to get evidences with pagination, filters, and sorting
export function getEvidences(input: GetEvidencesSchema): EvidenceResponse {
	const { page, per_page, sort, name, status, linkedControls, from, to } =
		input;

	try {
		// Apply filters
		let filteredEvidences = filterEvidences(evidences, {
			name,
			status,
			linkedControls,
			from,
			to,
		});

		// Apply sorting
		filteredEvidences = sortEvidences(filteredEvidences, sort);

		// Get total number of filtered rows
		const totalRows = filteredEvidences.length;

		// Apply pagination
		const paginatedEvidences = paginateEvidences(
			filteredEvidences,
			page,
			per_page,
		);

		// Calculate the total number of pages
		const pageCount = Math.ceil(totalRows / per_page);

		return { data: paginatedEvidences, totalRows, pageCount };
	} catch (err) {
		console.error(err);
		return { data: [], totalRows: 0, pageCount: 0 };
	}
}
