export interface IEvidence {
  id: string;
  name: string;
  implementationGuide?: string;
  status: string;
  linkedControls: string[];
  renewalDate: string;
  createdAt?: string;
  updatedAt?: string;
}
