export interface FrameworkComplianceScore {
  name: string;
  value: number;
  color: string;
  // icon: JSX.Element;
}

export interface IFrameworkData {
  name: string;
  keyVal: string;
  icon: string;
  complianceScore: FrameworkComplianceScore[];
  // icon: JSX.Element;
}
