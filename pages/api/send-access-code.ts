import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { marked } from "marked";
import redisClient from "@/lib/redis"; // ✅ Use Redis for storage

dotenv.config();

/**
 * API to send an email with an access code.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { signerEmail, signerName } = req.body;

  if (!signerEmail || !signerName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const accessCodeKey = `accessCode:${signerEmail}`;

    // ✅ Delete old access code before setting a new one (avoids stale codes)
    await redisClient.del(accessCodeKey);

    // ✅ Generate a new access code
    const newAccessCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // ✅ Store the access code in Redis with a 10-minute expiration
    await redisClient.set(accessCodeKey, newAccessCode);
    await redisClient.expire(accessCodeKey, 600);

    console.log(
      `✅ Stored access code in Redis for ${signerEmail}: ${newAccessCode}`
    );

    // ✅ Retrieve the stored access code to confirm it's correct
    const storedCode = await redisClient.get(accessCodeKey);
    console.log(
      `🔍 Retrieved from Redis: ${storedCode} (Expected: ${newAccessCode})`
    );

    if (!storedCode || storedCode !== newAccessCode) {
      console.error("❌ Redis storage mismatch! Code not properly saved.");
      return res
        .status(500)
        .json({ message: "Error storing access code. Please try again." });
    }

    // ✅ Markdown Email Template
    const markdownContent = `
# ✍️ Authenticate to Sign the Petition

Hello **${signerName}**,

To sign the petition, **please use the unique access code below**:

🔒 **Your Access Code:** \`${newAccessCode}\`

---

## **📌 How to Sign the Petition**
1️⃣ Visit the petition signing page:  
👉 [Sign the Petition Now](https://parking-petition-forms.vercel.app/)

2️⃣ Enter your email: **${signerEmail}**  
3️⃣ Use the access code **\`${newAccessCode}\`** when prompted  
4️⃣ Submit your signature to support the petition!

---

## **❓ Need Help?**
If you have any questions, please contact:

**Juan Carlos Gomez**  
📞 **321-297-9042**  
🏡 **Neighbor at 2103 Desert Rose Dr**
`;

    // ✅ Convert Markdown to HTML
    const htmlContent = marked(markdownContent);

    // ✅ Email Content
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: signerEmail,
      subject: `Authenticate to Sign the Petition`,
      text: markdownContent, // Plaintext fallback
      html: htmlContent, // Converted HTML
    };

    // ✅ Send Email
    await transporter.sendMail(mailOptions);

    console.log(`✅ Email successfully sent to ${signerEmail}`);

    return res.status(200).json({
      message: "Authentication email sent successfully",
      accessCode: newAccessCode, // ✅ Corrected: Send the correct variable
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return res.status(500).json({ message: "Error sending email" });
  }
}
