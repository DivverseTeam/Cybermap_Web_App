import {
	evidences,
	type Evidence,
} from "~/containers/evidence-library/db/schema";
import { faker } from "@faker-js/faker";
import {
	ArrowDownIcon,
	ArrowRightIcon,
	ArrowUpIcon,
	CheckCircledIcon,
	CircleIcon,
	CrossCircledIcon,
	QuestionMarkCircledIcon,
	StopwatchIcon,
} from "@radix-ui/react-icons";
import { customAlphabet } from "nanoid";

import { generateId } from "~/lib/id";

export function generateRandomEvidence(): Evidence {
	return {
		id: generateId(),
		// code: `EVIDENCE-${customAlphabet("0123456789", 4)()}`,
		name: faker.hacker
			.phrase()
			.replace(/^./, (letter: string) => letter.toUpperCase()),
		owner: faker.name.fullName(), // Random name for the owner
		description: faker.lorem.sentences(2), // Generate 2 random sentences for the description
		implementationGuide: faker.lorem.sentences(4), // Generate 2 random sentences for the description

		status:
			faker.helpers.shuffle(evidences.status.enumValues)[0] ?? "Needs artifact",
		// label: faker.helpers.shuffle(evidences.label.enumValues)[0] ?? "bug",
		// priority: faker.helpers.shuffle(evidences.priority.enumValues)[0] ?? "low",
		// Add linkedControls as an array of random strings
		linkedControls: JSON.stringify(
			faker.helpers.arrayElements(
				Array.from({ length: 5 }, () => faker.lorem.word()), // Generate 5 random words
				Math.floor(Math.random() * 3) + 1, // Random number between 1 and 5
			),
		),
		renewalDate: new Date(),
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}

/**
 * Returns the appropriate status icon based on the provided status.
 * @param status - The status of the task.
 * @returns A React component representing the status icon.
 */
// export function getStatusIcon(status: Evidence["status"]) {
//   const statusIcons = {
//     canceled: CrossCircledIcon,
//     done: CheckCircledIcon,
//     "in-progress": StopwatchIcon,
//     todo: QuestionMarkCircledIcon,
//   };

//   return statusIcons[status] || CircleIcon;
// }

/**
 * Returns the appropriate priority icon based on the provided priority.
 * @param priority - The priority of the task.
 * @returns A React component representing the priority icon.
 */
// export function getPriorityIcon(priority: Evidence["priority"]) {
//   const priorityIcons = {
//     high: ArrowUpIcon,
//     low: ArrowDownIcon,
//     medium: ArrowRightIcon,
//   };

//   return priorityIcons[priority] || CircleIcon;
// }
