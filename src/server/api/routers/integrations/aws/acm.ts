import { acmClient } from "./init";
import {
  ListCertificatesCommand,
  DescribeCertificateCommand,
  CertificateSummary,
} from "@aws-sdk/client-acm";

// Certificate management logs: Logs showing encryption certificates being issued or renewed.

/**
 * Lists all ACM certificates with their statuses.
 */
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
