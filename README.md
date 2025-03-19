# 📌 Setting Up Google OAuth for Gmail API in This Project

This guide explains **how to set up Google OAuth 2.0** for sending emails using **Gmail API** in this project.

---

## 🔹 1️⃣ Enable Gmail API & Create OAuth Credentials

To use Gmail API, you need to **create OAuth credentials** in **Google Cloud Console**.

### ✅ Steps to Enable Gmail API

1. **Go to Google Cloud Console**:  
   👉 [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. **Create a new project** (or select an existing one).
3. **Enable the Gmail API**:  
   👉 [https://console.cloud.google.com/apis/library/gmail.googleapis.com](https://console.cloud.google.com/apis/library/gmail.googleapis.com)
4. **Go to "Credentials" section**:  
   👉 [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
5. **Click "Create Credentials" → Choose "OAuth Client ID"**

# My Steps, remember to apply your own

6. **Set up the OAuth Consent Screen**:
   - App Name: `Parking Petition`
   - User Support Email: `jcgom3@gmail.com`
   - Add yourself as a Test User
   - Click **Save and Continue**
7. **Create OAuth Client ID**:
   - **Application Type**: Web Application
   - **Authorized Redirect URIs**:
     - `http://localhost:3000/api/auth/callback`
     - `https://parking-petition-forms.vercel.app/api/auth/callback`
   - **Click "Create"** → **Copy** `Client ID` & `Client Secret`

---

## 🔹 2️⃣ Update Environment Variables

### ✅ Add Credentials to `.env.local`

📌 **Create `.env.local` in the root of this project and add the following:**

```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REDIRECT_URI=https://YOUR-DOMAIN/api/auth/callback
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
EMAIL_FROM=YOUR-EMAIL@gmail.com
```
