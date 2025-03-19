import docusign from "docusign-esign";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

/**
 * Retrieves an OAuth2 access token for DocuSign authentication.
 * @returns A promise that resolves to the OAuth2 access token as a string.
 */
const getAccessToken = async (): Promise<string> => {
  return "your_access_token"; // TODO: Replace with proper OAuth 2.0 JWT token logic
};

/**
 * Defines the structure of a signer for the petition.
 */
interface Signer {
  firstName: string;
  lastInitial: string;
  email: string;
  phone?: string;
  accessCode: string;
}

/**
 * Creates a DocuSign envelope with authentication via an access code.
 * @param signer - Object containing signer details: first name, last initial, email, phone (optional), and access code.
 * @returns A promise that resolves to the Envelope ID from DocuSign.
 */
export async function createEnvelope(signer: Signer): Promise<string> {
  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH!);
  apiClient.addDefaultHeader(
    "Authorization",
    `Bearer ${await getAccessToken()}`
  );

  const envelopesApi = new docusign.EnvelopesApi(apiClient);

  // Load the document (Petition PDF)
  const documentPath: string = path.join(
    process.cwd(),
    "public",
    "petition.pdf"
  );
  const documentBytes: string = fs
    .readFileSync(documentPath)
    .toString("base64");

  // Define the document structure
  const document: docusign.Document = new docusign.Document({
    documentBase64: documentBytes,
    name: "Petition Document",
    fileExtension: "pdf",
    documentId: "1",
  });

  // Define signer details, ensuring the name format "First LastInitial."
  const signerFullName: string = `${signer.firstName} ${signer.lastInitial}.`;

  const signerDefinition: docusign.Signer = new docusign.Signer({
    email: signer.email,
    name: signerFullName,
    recipientId: "1",
    clientUserId: "1001", // Required for embedded signing
    accessCode: signer.accessCode, // 🔑 Requires signer to enter this code before signing
    tabs: new docusign.Tabs({
      signHereTabs: [
        new docusign.SignHere({
          documentId: "1",
          pageNumber: "1",
          recipientId: "1",
          xPosition: "200",
          yPosition: "400",
          tabLabel: "Sign Here",
        }),
      ],
    }),
  });

  // Create the envelope request definition
  const envelopeDefinition: docusign.EnvelopeDefinition = new docusign.EnvelopeDefinition(
    {
      emailSubject: `Petition Signature Request for ${signerFullName}`,
      documents: [document],
      recipients: new docusign.Recipients({ signers: [signerDefinition] }),
      status: "sent", // "sent" sends the envelope immediately
    }
  );

  // Send envelope to DocuSign and return the Envelope ID
  const envelope = await envelopesApi.createEnvelope(
    process.env.DOCUSIGN_ACCOUNT_ID!,
    { envelopeDefinition }
  );

  return envelope.envelopeId!;
}
