export type IntegrationType = {
  id?: string;
  name: string;
  category: string;
  image?: string;
  isConnected: boolean;
};
export type IntegrationType2 = {
  id?: string;
  name: string;
  category: string;
  icon?: string;
  status: string;
};

type Preparedness = {
  completed: number;
  total: number;
};

export type FrameworkType = {
  id?: string;
  name: string;
  preparedness: Preparedness;
};
