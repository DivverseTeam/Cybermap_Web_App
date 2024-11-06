export interface IControl {
	id: string;
	name: string;
	description: string;
	mappedControls?: string[];
	status: string;
	createdAt?: string;
	updatedAt?: string;
}
