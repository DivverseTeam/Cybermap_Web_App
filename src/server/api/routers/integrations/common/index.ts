import { ControlStatus } from "~/lib/types/controls";

export interface AzureToken {
  token: string;
  expiresOnTimestamp: number;
  subscriptionId: string;
}

export interface AzureAUth {
  azureCloud: AzureToken | null;
  azureAd: AzureToken | null;
}

async function evaluate(functions: (() => Promise<ControlStatus | null>)[]) {
  try {
    const statuses = await Promise.all(functions.map((fn) => fn()));

    if (
      statuses.every(
        (status) => status === ControlStatus.Enum.FULLY_IMPLEMENTED
      )
    ) {
      return ControlStatus.Enum.FULLY_IMPLEMENTED;
    } else if (
      statuses.some((status) => status === ControlStatus.Enum.NOT_IMPLEMENTED)
    ) {
      return ControlStatus.Enum.NOT_IMPLEMENTED;
    } else {
      return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
    }
  } catch (error: any) {
    console.log("Error in evaluate", error.code);
    if (
      error.code === "ExpiredAuthenticationToken" ||
      error.code === "InvalidAuthenticationToken" ||
      error.code === "AuthorizationFailed"
    ) {
      throw error;
    }
  }
}

export { evaluate };
