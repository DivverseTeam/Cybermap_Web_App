import {
  PutObjectCommand,
  S3Client,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { ControlStatus } from "~/lib/types/controls";

export interface AzureToken {
  token: string;
  expiresOnTimestamp: number;
  subscriptionId: string;
}

export interface AzureAUth extends EvidenceMetaData {
  azureCloud: AzureToken | null;
  azureAd: AzureToken | null;
}

export interface EvidenceMetaData {
  controlId: string;
  controlName: string;
  organisationId: string;
  controls?: string[];
}

const bucket: string = "cybermap-dev-evidences-bbsvusex";

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
    console.log("Error in evaluate...", error);
    if (
      error.code === "ExpiredAuthenticationToken" ||
      error.code === "InvalidAuthenticationToken"
    ) {
      throw error;
    }
  }
}

async function saveEvidence(input: {
  fileName: string;
  controlId: string;
  organisationId: string;
  body: Object;
  controls: string[];
}) {
  const client = new S3Client({});

  const key: string = `evidence/${input.organisationId}/${input.fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: JSON.stringify({
      ...input,
      fileName: `${input.fileName}-${new Date().toISOString()}`,
    }),
    ContentType: "application/json",
  });

  try {
    const response = await client.send(command);
    // console.log("Upload successful:", response);
    return { key, response };
  } catch (error) {
    console.error("Error uploading to S3:", error);
  }
}

async function getEvidencesForOrganization(organisationId: string) {
  const client = new S3Client({});
  const prefix: string = `evidence/${organisationId}/`;

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  });

  try {
    const response = await client.send(command);

    if (response.Contents) {
      const evidences = response.Contents.map((item) => ({
        key: item.Key,
        lastModified: item.LastModified,
        size: item.Size,
      }));
      return response.Contents;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error listing evidences from S3:", error);
    throw error;
  }
}

function getStatusByCount({
  fullyImplemented,
  notImplemented,
  partiallyImplemented,
}: {
  fullyImplemented: number;
  notImplemented: number;
  partiallyImplemented: number;
}) {
  if (
    fullyImplemented > 0 &&
    notImplemented === 0 &&
    partiallyImplemented === 0
  ) {
    return ControlStatus.Enum.FULLY_IMPLEMENTED;
  } else if (
    notImplemented > 0 &&
    fullyImplemented === 0 &&
    partiallyImplemented === 0
  ) {
    return ControlStatus.Enum.NOT_IMPLEMENTED;
  } else {
    return ControlStatus.Enum.PARTIALLY_IMPLEMENTED;
  }
}

export {
  evaluate,
  getStatusByCount,
  saveEvidence,
  getEvidencesForOrganization,
};
