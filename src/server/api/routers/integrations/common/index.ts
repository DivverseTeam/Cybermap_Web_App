import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ControlStatus } from "~/lib/types/controls";
import { s3Client as client } from "~/server/api/routers/integrations/aws/init";
import EvidenceLibrary from "~/server/models/EvidenceLibrary";

export interface AzureToken {
  token: string;
  expiresOnTimestamp: number;
  subscriptionId: string;
  integrationId: string;
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

async function evaluate(
  functions: (() => Promise<ControlStatus | null>)[],
  integrationIds: string[]
) {
  try {
    const statuses = await Promise.all(functions.map((fn) => fn()));
    if (!statuses || statuses.length === 0) {
      return {
        status: ControlStatus.Enum.NOT_IMPLEMENTED,
        integrationIds,
      };
    }

    if (
      statuses.every(
        (status) => status === ControlStatus.Enum.FULLY_IMPLEMENTED
      )
    ) {
      return {
        status: ControlStatus.Enum.FULLY_IMPLEMENTED,
        integrationIds,
      };
    } else if (
      statuses.some((status) => status === ControlStatus.Enum.NOT_IMPLEMENTED)
    ) {
      return {
        status: ControlStatus.Enum.NOT_IMPLEMENTED,
        integrationIds,
      };
    } else {
      return {
        status: ControlStatus.Enum.PARTIALLY_IMPLEMENTED,
        integrationIds,
      };
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
    await EvidenceLibrary.findOneAndUpdate(
      {
        fileName: input.fileName,
        organisationId: input.organisationId,
      },
      {
        key,
        organisationId: input.organisationId,
        linkedControls: [input.controlId],
      },
      { upsert: true }
    );
    return { key, response };
  } catch (error) {
    console.error("Error uploading to S3:", error);
  }
}

async function generateEvidenceSignedUrl(key: string) {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 }); // Expires in 1 hour
  return signedUrl;
}

async function getEvidencesForOrganization(organisationId: string) {
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
  getEvidencesForOrganization,
  getStatusByCount,
  saveEvidence,
};
