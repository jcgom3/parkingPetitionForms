const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

const { google } = require("googleapis");
const readline = require("readline");

// ✅ Debugging: Print Loaded Environment Variables
console.log("🔎 Checking Environment Variables...");
console.log("📌 GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("📌 GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
console.log("📌 GOOGLE_REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI);

// ✅ Ensure Required Environment Variables Are Loaded
if (
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.GOOGLE_REDIRECT_URI
) {
  console.error(
    "❌ ERROR: Missing required environment variables. Check your .env.local file."
  );
  process.exit(1);
}

// ✅ Create OAuth2 Client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// ✅ Generate Authorization URL
const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];
const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent",
});

console.log("🔗 Authorize this app by visiting this URL:\n", authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the code from that page here: ", (code) => {
  rl.close();
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      console.error("❌ ERROR: Failed to retrieve access token", err);
      return;
    }
    console.log(
      "\n✅ SUCCESS! Here is your refresh token:\n",
      token.refresh_token
    );
    console.log("\n🔹 Add this to your `.env.local` file:");
    console.log(`GOOGLE_REFRESH_TOKEN=${token.refresh_token}`);
  });
});
