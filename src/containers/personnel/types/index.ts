export type ComplianceItem = {
  [key: string]: boolean;
  // Each object has a single key-value pair with a string key and a boolean value
};

export interface IEmployee {
  _id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  email: string;
  jobTitle: string;
  gender: string;
  hireDate: string | Date;
  terminationDate?: string | Date | undefined;
  lastSeen: string | Date;
  lastPasswordUpdate?: string | Date | undefined;
  complianceList: ComplianceItem[];
}
