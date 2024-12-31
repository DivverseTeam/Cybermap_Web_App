import { ControlStatus } from "~/lib/types/controls";

export interface StatusResponseDTO {
  status: ControlStatus;
  integrationIds: string[];
}
