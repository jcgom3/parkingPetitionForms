// import { NextApiRequest, NextApiResponse } from "next";
// import { createEnvelope } from "@/lib/docusign";
// import dotenv from "dotenv";
// import redisClient from "@/lib/redis"; // ✅ Use Redis

// dotenv.config();

// /**
//  * API route to validate an access code and generate a signing session.
//  */
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   const { firstName, lastInitial, email, accessCode } = req.body;

//   console.log("🔍 Incoming Signing Request:", {
//     firstName,
//     lastInitial,
//     email,
//     accessCode,
//   });

//   if (!firstName || !lastInitial || !email || !accessCode) {
//     console.error("❌ Missing required fields.");
//     return res.status(400).json({ message: "Missing required fields." });
//   }

//   // ✅ Check if access code exists & matches in Redis
//   const storedCode = await redisClient.get(`accessCode:${email}`);

//   console.log(`🔍 Retrieved from Redis: ${storedCode} (for ${email})`);
//   console.log(`🔍 Incoming Access Code: ${accessCode}`);

//   if (storedCode !== accessCode) {
//     console.log(`❌ Mismatch! Expected: ${storedCode}, Got: ${accessCode}`);
//     return res.status(403).json({ message: "Invalid access code." });
//   }

//   if (!storedCode || storedCode !== accessCode) {
//     console.error(`❌ Invalid or expired access code for: ${email}`);
//     return res.status(403).json({ message: "Invalid or expired access code." });
//   }

//   try {
//     // ✅ Create a DocuSign envelope for the signer
//     const envelopeId = await createEnvelope({
//       firstName,
//       lastInitial,
//       email,
//       accessCode,
//     });

//     // ✅ Remove access code after successful signing (One-time use)
//     await redisClient.del(`accessCode:${email}`);
//     console.log(
//       `✅ Signing initiated for ${email}. Envelope ID: ${envelopeId}`
//     );

//     return res.status(200).json({ envelopeId });
//   } catch (error) {
//     console.error("❌ Error generating signing session:", error);
//     return res
//       .status(500)
//       .json({ message: "Failed to create signing session." });
//   }
// }

import { NextApiRequest, NextApiResponse } from "next";
import { createEnvelope } from "@/lib/docusign";
import dotenv from "dotenv";
import redisClient from "@/lib/redis"; // ✅ Use Redis

dotenv.config();

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

  // ✅ Check if access code exists & matches in Redis
  const storedCode = await redisClient.get(`accessCode:${email}`);

  console.log(`🔍 Retrieved from Redis: ${storedCode} (for ${email})`);
  console.log(`🔍 Incoming Access Code: ${accessCode}`);

  if (!storedCode) {
    console.log(`❌ No access code found for ${email}`);
    return res
      .status(403)
      .json({ message: "Access code not found or expired." });
  }

  if (storedCode !== accessCode) {
    console.log(`❌ Mismatch! Expected: ${storedCode}, Got: ${accessCode}`);
    return res.status(403).json({ message: "Invalid access code." });
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
    await redisClient.del(`accessCode:${email}`);
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
