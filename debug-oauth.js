const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

const { google } = require("googleapis");

console.log("🔎 Checking Environment Variables...");
console.log("📌 GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("📌 GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
console.log("📌 GOOGLE_REFRESH_TOKEN:", process.env.GOOGLE_REFRESH_TOKEN);
console.log("📌 GOOGLE_REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI);
console.log("📌 EMAIL_FROM:", process.env.EMAIL_FROM);

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

(async () => {
  try {
    console.log("🔄 Fetching Access Token...");
    const accessToken = await oauth2Client.getAccessToken();
    if (!accessToken.token) throw new Error("No Access Token Retrieved");
    console.log("✅ Access Token Retrieved:", accessToken.token);
  } catch (error) {
    console.error("❌ ERROR: Failed to Retrieve Access Token");
    console.error(error);
  }
})();
