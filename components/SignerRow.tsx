import { useState } from "react";

interface SignerRowProps {
  address: string;
  onSign: (
    address: string,
    firstName: string,
    lastInitial: string,
    email: string,
    accessCode: string
  ) => void;
}

export default function SignerRow({ address, onSign }: SignerRowProps) {
  const [firstName, setFirstName] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Function to Request Access Code via API
  const requestAccessCode = async () => {
    if (!email || !firstName || !lastInitial) {
      setMessage("⚠️ Please fill in your name and email first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Generate a random 6-digit access code
      const generatedAccessCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const response = await fetch("/api/send-access-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signerEmail: email,
          signerName: `${firstName} ${lastInitial}`,
          accessCode: generatedAccessCode,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setAccessCode(generatedAccessCode);
        setMessage("✅ Access code sent to your email.");
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      console.error("Error getting access code:", err);
      setMessage("❌ An error occurred. Please try again.");
    }
    setLoading(false);
  };

  // ✅ Function to Sign the Petition via DocuSign
  const handleSignPetition = async () => {
    if (!accessCode) {
      setMessage("⚠️ You must request an access code first.");
      return;
    }

    setSigning(true);
    setMessage("");

    try {
      const response = await fetch("/api/docusign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastInitial,
          email,
          accessCode,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSigned(true);
        alert(
          "✅ Signature request sent! Check your email to sign via DocuSign."
        );
      } else {
        setMessage(`❌ Error: ${data.error || "Failed to initiate signing."}`);
      }
    } catch (err) {
      console.error("Error signing the petition:", err);
      setMessage("❌ An error occurred. Please try again.");
    }
    setSigning(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800">{address}</h3>

      <div className="grid grid-cols-2 gap-4">
        <input
          className="border rounded-lg p-2 w-full shadow-sm focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className="border rounded-lg p-2 w-full shadow-sm focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Last Initial"
          maxLength={1}
          value={lastInitial}
          onChange={(e) => setLastInitial(e.target.value.toUpperCase())}
        />
      </div>

      <input
        className="border rounded-lg p-2 w-full shadow-sm focus:ring-2 focus:ring-blue-500"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border rounded-lg p-2 w-full shadow-sm focus:ring-2 focus:ring-blue-500"
        type="text"
        placeholder="Access Code"
        value={accessCode}
        readOnly
      />

      <div className="flex flex-col gap-3">
        <button
          onClick={requestAccessCode}
          disabled={loading}
          className={`w-full py-2 text-white font-bold rounded-lg transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Generating..." : "Get Access Code"}
        </button>

        <button
          onClick={handleSignPetition}
          disabled={!accessCode || signing || signed} // ✅ Disable until access code is received & prevent duplicate signing
          className={`w-full py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 ${
            accessCode && !signed
              ? "hover:bg-gray-100 transition"
              : "cursor-not-allowed opacity-50"
          }`}
        >
          {signed ? "✅ Signed!" : signing ? "Processing..." : "Sign Petition"}
        </button>
      </div>

      {message && (
        <p
          className={`text-sm ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
