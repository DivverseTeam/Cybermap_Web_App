export interface ICategory {
  name: string;
  controlGroup: {
    name: string;
    controls: {
      name: string;
      description: string;
      evidencesCollected: number;
      evidencesExpected: number;
      assignedTo: string;
    }[];
  }[];
}
