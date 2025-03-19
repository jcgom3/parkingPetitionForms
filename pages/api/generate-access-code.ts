import { NextApiRequest, NextApiResponse } from "next";

// Temporary in-memory storage (Use a database for production)
const accessCodes: Record<string, string> = {};

/**
 * Generates a random 6-digit access code
 */
const generateAccessCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit code
};

/**
 * API to generate an access code for a signer.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method Not Allowed" });

  const { signerEmail } = req.body;
  if (!signerEmail)
    return res.status(400).json({ message: "Missing signer email" });

  // Generate a new access code
  const accessCode = generateAccessCode();
  accessCodes[signerEmail] = accessCode; // Store in-memory (replace with a database in production)

  console.log(`Generated access code for ${signerEmail}: ${accessCode}`);
}
