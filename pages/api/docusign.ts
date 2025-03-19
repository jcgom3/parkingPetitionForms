import { NextApiRequest, NextApiResponse } from "next";
import { createEnvelope } from "@/lib/docusign";
import dotenv from "dotenv";

dotenv.config();

// Temporary in-memory storage (Use a database for production)
const accessCodes: Record<string, string> = {};

/**
 * API route to validate an access code and generate a signing session.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method Not Allowed" });

  const { firstName, lastInitial, email, accessCode } = req.body;
  if (!firstName || !lastInitial || !email || !accessCode) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  // Validate the access code
  if (accessCodes[email] !== accessCode) {
    return res.status(403).json({ message: "Invalid access code." });
  }

  try {
    // Create a DocuSign envelope for the signer
    const envelopeId = await createEnvelope({
      firstName,
      lastInitial,
      email,
      accessCode,
    });

    res.status(200).json({ envelopeId });
  } catch (error) {
    console.error("Error generating signing session:", error);
    res.status(500).json({ error: "Failed to create signing session." });
  }
}
