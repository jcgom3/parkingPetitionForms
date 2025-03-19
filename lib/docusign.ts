import docusign from "docusign-esign";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import axios from "axios";

dotenv.config();

/**
 * Retrieves an OAuth2 access token for DocuSign authentication using JWT Grant.
 * @returns A promise that resolves to the OAuth2 access token as a string.
 */
const getAccessToken = async (): Promise<string> => {
  try {
    const privateKeyPath = path.join(process.cwd(), "docusign_private_key.pem"); // Ensure this exists
    const privateKey = fs.readFileSync(privateKeyPath, "utf8");

    const payload = {
      iss: process.env.DOCUSIGN_CLIENT_ID,
      sub: process.env.DOCUSIGN_USER_ID, // Your DocuSign User ID
      aud: "account-d.docusign.com",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      scope: "signature impersonation",
    };

    const jwtToken = jwt.sign(payload, privateKey, { algorithm: "RS256" });

    const response = await axios.post(
      "https://account-d.docusign.com/oauth/token",
      {
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwtToken,
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("❌ ERROR: Failed to get DocuSign access token:", error);
    throw new Error("Failed to retrieve DocuSign access token");
  }
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
 */
export async function createEnvelope(signer: Signer): Promise<string> {
  const accessToken = await getAccessToken(); // Fetch a fresh access token
  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH!);
  apiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

  const envelopesApi = new docusign.EnvelopesApi(apiClient);

  // Load the document (Petition PDF)
  const documentPath = path.join(process.cwd(), "public", "petition.pdf");
  const documentBytes = fs.readFileSync(documentPath).toString("base64");

  // Define the document structure
  const document = new docusign.Document({
    documentBase64: documentBytes,
    name: "Petition Document",
    fileExtension: "pdf",
    documentId: "1",
  });

  // Define signer details
  const signerFullName = `${signer.firstName} ${signer.lastInitial}.`;

  const signerDefinition = new docusign.Signer({
    email: signer.email,
    name: signerFullName,
    recipientId: "1",
    clientUserId: "1001", // Required for embedded signing
    accessCode: signer.accessCode,
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
  const envelopeDefinition = new docusign.EnvelopeDefinition({
    emailSubject: `Petition Signature Request for ${signerFullName}`,
    documents: [document],
    recipients: new docusign.Recipients({ signers: [signerDefinition] }),
    status: "sent",
  });

  // Send envelope to DocuSign
  const envelope = await envelopesApi.createEnvelope(
    process.env.DOCUSIGN_ACCOUNT_ID!,
    { envelopeDefinition }
  );

  return envelope.envelopeId!;
}
