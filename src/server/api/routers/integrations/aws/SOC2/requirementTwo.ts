// Encryption (Security, Confidentiality)
import {
  CertificateSummary,
  DescribeCertificateCommand,
  ListCertificatesCommand,
} from "@aws-sdk/client-acm";
import {
  DescribeKeyCommand,
  GetKeyPolicyCommand,
  GetKeyRotationStatusCommand,
  ListKeysCommand,
} from "@aws-sdk/client-kms";
import {
  GetBucketEncryptionCommand,
  ListBucketsCommand,
} from "@aws-sdk/client-s3";
import { acmClient, kmsClient, s3Client } from "../init";

// Encryption policies: Documentation of how encryption is enforced at rest and in transit.
async function getKeyDetails() {
  try {
    // List all key IDs
    const listKeysCommand = new ListKeysCommand({});
    const { Keys } = await kmsClient.send(listKeysCommand);
    if (!Keys) return [];

    const keyDetails = await Promise.all(
      Keys.map(async ({ KeyId }: any) => {
        // Describe the key to get general information
        const describeKeyCommand = new DescribeKeyCommand({ KeyId });
        const { KeyMetadata } = await kmsClient.send(describeKeyCommand);

        // Get the key policy
        const getKeyPolicyCommand = new GetKeyPolicyCommand({
          KeyId,
          PolicyName: "default",
        });
        const { Policy } = await kmsClient.send(getKeyPolicyCommand);

        // Check if key rotation is enabled
        let rotationEnabled;
        try {
          const getKeyRotationStatusCommand = new GetKeyRotationStatusCommand({
            KeyId,
          });
          const { KeyRotationEnabled } = await kmsClient.send(
            getKeyRotationStatusCommand
          );
          rotationEnabled = KeyRotationEnabled;
        } catch (error) {
          rotationEnabled = "Not Applicable";
        }

        return {
          KeyId: KeyMetadata?.KeyId,
          KeyArn: KeyMetadata?.Arn,
          KeyState: KeyMetadata?.KeyState,
          CreationDate: KeyMetadata?.CreationDate,
          Description: KeyMetadata?.Description,
          KeyUsage: KeyMetadata?.KeyUsage,
          Origin: KeyMetadata?.Origin,
          Policy,
          RotationEnabled: rotationEnabled,
        };
      })
    );

    return keyDetails;
  } catch (error) {
    console.error("Error retrieving key details:", error);
    throw error;
  }
}

// Key rotation schedules: Proof that encryption keys are rotated according to policy
async function getKeyRotationStatus() {
  try {
    // List all keys
    const listKeysCommand = new ListKeysCommand({});
    const { Keys } = await kmsClient.send(listKeysCommand);
    if (!Keys) return [];

    const keyRotationDetails = await Promise.all(
      Keys.map(async ({ KeyId }: any) => {
        // Get key metadata
        const describeKeyCommand = new DescribeKeyCommand({ KeyId });
        const { KeyMetadata } = await kmsClient.send(describeKeyCommand);

        // Check if key rotation is enabled (only applies to customer-managed keys)
        let rotationEnabled = false;
        if (KeyMetadata) {
          if (KeyMetadata.KeyManager === "CUSTOMER") {
            const getKeyRotationStatusCommand = new GetKeyRotationStatusCommand(
              {
                KeyId,
              }
            );
            const { KeyRotationEnabled } = await kmsClient.send(
              getKeyRotationStatusCommand
            );
            rotationEnabled = KeyRotationEnabled ?? false;
          }

          return {
            KeyId: KeyMetadata.KeyId,
            KeyArn: KeyMetadata.Arn,
            Description: KeyMetadata.Description,
            KeyManager: KeyMetadata.KeyManager,
            RotationEnabled: rotationEnabled,
            RotationFrequency: rotationEnabled ? "365 days" : "Not Applicable",
          };
        } else {
          return {
            KeyId,
            KeyArn: "Not Applicable",
            Description: "Not Applicable",
            KeyManager: "Not Applicable",
            RotationEnabled: "Not Applicable",
            RotationFrequency: "Not Applicable",
          };
        }
      })
    );

    return keyRotationDetails;
  } catch (error) {
    console.error("Error retrieving key rotation status:", error);
    throw error;
  }
}

// Certificate management logs: Logs showing encryption certificates being issued or renewed.
async function checkBucketEncryption() {
  try {
    // List all S3 buckets in the account
    const listBucketsCommand = new ListBucketsCommand({});
    const { Buckets } = await s3Client.send(listBucketsCommand);
    if (!Buckets) return [];

    // Loop through each bucket and check its encryption settings
    const bucketEncryptionDetails = await Promise.all(
      Buckets.map(async (bucket: any) => {
        const bucketName = bucket.Name;
        try {
          // Get the encryption configuration for the bucket
          const getBucketEncryptionCommand = new GetBucketEncryptionCommand({
            Bucket: bucketName,
          });
          const encryptionConfig = await s3Client.send(
            getBucketEncryptionCommand
          );

          const kmsMasterKeyId =
            encryptionConfig?.ServerSideEncryptionConfiguration?.Rules?.[0]
              ?.ApplyServerSideEncryptionByDefault?.KMSMasterKeyID;

          return {
            BucketName: bucketName,
            EncryptionStatus: "Enabled",
            EncryptionType:
              encryptionConfig.ServerSideEncryptionConfiguration?.Rules?.map(
                (rule: any) =>
                  rule.ApplyServerSideEncryptionByDefault.SSEAlgorithm
              ).join(", "),
            KMSMasterKeyID: kmsMasterKeyId || "Not Applicable",
          };
        } catch (error: any) {
          // Handle buckets without encryption (NoSuchBucketEncryption error)
          if (error.code === "ServerSideEncryptionConfigurationNotFoundError") {
            return {
              BucketName: bucketName,
              EncryptionStatus: "Not Enabled",
              EncryptionType: "None",
              KMSMasterKeyID: "None",
            };
          } else {
            throw error;
          }
        }
      })
    );

    return bucketEncryptionDetails;
  } catch (error) {
    console.error("Error checking bucket encryption:", error);
    throw error;
  }
}

// Certificate management logs: Logs showing encryption certificates being issued or renewed.
// Lists all ACM certificates with their statuses.
async function listACMCertificates() {
  try {
    const listCertificatesCommand = new ListCertificatesCommand();
    const certificates = await acmClient.send(listCertificatesCommand);
    if (!certificates.CertificateSummaryList) return [];

    // Fetch details of each certificate
    const certificateDetails = await Promise.all(
      certificates.CertificateSummaryList.map(
        async (cert: CertificateSummary) => {
          const describeCertificateCommand = new DescribeCertificateCommand({
            CertificateArn: cert.CertificateArn,
          });
          const certDetail = await acmClient.send(describeCertificateCommand);
          return certDetail.Certificate;
        }
      )
    );

    console.log(
      "ACM Certificates:",
      JSON.stringify(certificateDetails, null, 2)
    );
  } catch (error) {
    console.error("Error retrieving ACM certificates:", error);
  }
}

async function getEncryptionPoliciesEvidence() {
  try {
    // Get KMS key details related to encryption policies
    const keyDetails = await getKeyDetails();

    // Get bucket encryption details
    const bucketEncryptionDetails = await checkBucketEncryption();

    return {
      KeyDetails: keyDetails,
      BucketEncryptionDetails: bucketEncryptionDetails,
    };
  } catch (error) {
    console.error("Error retrieving encryption policy evidence:", error);
    throw error;
  }
}

async function getKeyRotationEvidence() {
  try {
    // Get key rotation details
    const keyRotationDetails = await getKeyRotationStatus();

    return {
      KeyRotationDetails: keyRotationDetails,
    };
  } catch (error) {
    console.error("Error retrieving key rotation evidence:", error);
    throw error;
  }
}

async function getCertManagementLogsEvidence() {
  try {
    // Get ACM certificate details
    const certificateDetails = await listACMCertificates();

    return {
      CertificateManagementLogs: certificateDetails,
    };
  } catch (error) {
    console.error(
      "Error retrieving certificate management logs evidence:",
      error
    );
    throw error;
  }
}

export {
  getCertManagementLogsEvidence,
  getEncryptionPoliciesEvidence,
  getKeyRotationEvidence,
};
