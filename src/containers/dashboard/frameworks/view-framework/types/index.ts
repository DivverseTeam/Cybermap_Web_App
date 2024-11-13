export interface IControl {
  name: string;
  description: string;
  evidencesCollected: number;
  evidencesExpected: number;
  assignedTo: string;
}
export interface IControlGroup {
  name: string;
  controls: IControl[];
}

export interface ICategory {
  name: string;
  controlGroup: {
    name: string;
    controls: IControl[];
  }[];
}
