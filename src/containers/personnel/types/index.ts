export interface IEmployee {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	gender: string;
	hireDate: Date | string;
	terminationDate?: Date | string | undefined;
	complianceList: Array<{ [key: string]: boolean | undefined }>;
}
