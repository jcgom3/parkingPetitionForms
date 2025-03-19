import { NextApiRequest, NextApiResponse } from "next";
import { createEnvelope } from "@/lib/docusign";
import dotenv from "dotenv";

dotenv.config();

// ✅ Store access codes in memory (TEMPORARY: Use a database in production)
const accessCodes: Record<string, string> = {};

/**
 * API route to validate an access code and generate a signing session.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { firstName, lastInitial, email, accessCode } = req.body;

  console.log("🔍 Incoming Signing Request:", {
    firstName,
    lastInitial,
    email,
    accessCode,
  });

  if (!firstName || !lastInitial || !email || !accessCode) {
    console.error("❌ Missing required fields.");
    return res.status(400).json({ message: "Missing required fields." });
  }

  // ✅ Check if access code exists & matches
  if (!accessCodes[email] || accessCodes[email] !== accessCode) {
    console.error(`❌ Invalid or expired access code for: ${email}`);
    return res.status(403).json({ message: "Invalid or expired access code." });
  }

  try {
    // ✅ Create a DocuSign envelope for the signer
    const envelopeId = await createEnvelope({
      firstName,
      lastInitial,
      email,
      accessCode,
    });

    // ✅ Remove access code after successful signing (One-time use)
    delete accessCodes[email];

    console.log(
      `✅ Signing initiated for ${email}. Envelope ID: ${envelopeId}`
    );

    return res.status(200).json({ envelopeId });
  } catch (error) {
    console.error("❌ Error generating signing session:", error);
    return res
      .status(500)
      .json({ message: "Failed to create signing session." });
  }
}
