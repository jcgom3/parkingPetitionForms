import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { signerEmail, accessCode } = req.body;

  if (!signerEmail || !accessCode) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Configure Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT!),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email Content
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: signerEmail,
      subject: "Your DocuSign Access Code",
      text: `Hello,\n\nHere is your DocuSign access code: ${accessCode}\n\nUse this code to sign the petition.\n\nThank you!`,
      html: `
                <p>Hello,</p>
                <p>Here is your <strong>DocuSign access code</strong>: <code>${accessCode}</code></p>
                <p>Use this code to sign the petition.</p>
                <p>Thank you!</p>
            `,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Access code sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: "Error sending email" });
  }
}
