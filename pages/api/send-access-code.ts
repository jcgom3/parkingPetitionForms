import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { marked } from "marked";

dotenv.config();

// ✅ Store access codes temporarily in memory (Use a DB for production)
const accessCodes: Record<string, string> = {};

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

  const { signerEmail, signerName, accessCode } = req.body;

  if (!signerEmail || !signerName || !accessCode) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // ✅ Store access code before sending email
  accessCodes[signerEmail] = accessCode;
  console.log(`✅ Access code stored for ${signerEmail}: ${accessCode}`);

  try {
    // ✅ Markdown Email Template
    const markdownContent = `
# ✍️ Authenticate to Sign the Petition

Hello **${signerName}**,

To sign the petition, **please use the unique access code below**:

🔒 **Your Access Code:** \`${accessCode}\`

---

## **📌 How to Sign the Petition**
1️⃣ Visit the petition signing page:  
👉 [Sign the Petition Now](https://parking-petition-forms.vercel.app/)

2️⃣ Enter your email: **${signerEmail}**  
3️⃣ Use the access code **\`${accessCode}\`** when prompted  
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

    return res
      .status(200)
      .json({ message: "Authentication email sent successfully" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return res.status(500).json({ message: "Error sending email" });
  }
}
