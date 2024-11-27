export interface IFramework {
  name: string;
  logo?: string;
  controlsCompletion: {
    completedControls: number;
    totalControls: number;
  };
  modulesCompletion: {
    completedModules: number;
    totalModules: number;
  };
}
