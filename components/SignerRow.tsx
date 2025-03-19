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
  const [message, setMessage] = useState("");

  const requestAccessCode = async () => {
    if (!email) {
      setMessage("⚠️ Please enter an email first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/generate-access-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signerEmail: email }),
      });

      const data = await response.json();
      if (response.ok && data.accessCode) {
        setAccessCode(data.accessCode);
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

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 space-y-4 border border-gray-300 w-full max-w-md mx-auto text-center">
      <h3 className="text-xl font-semibold text-gray-800">{address}</h3>

      <div className="grid grid-cols-2 gap-4">
        <input
          className="border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className="border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Last Initial"
          maxLength={1}
          value={lastInitial}
          onChange={(e) => setLastInitial(e.target.value.toUpperCase())}
        />
      </div>

      <input
        className="border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-blue-500"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-blue-500"
        type="text"
        placeholder="Access Code"
        value={accessCode}
        readOnly
      />

      <div className="flex flex-col gap-3">
        <button
          onClick={requestAccessCode}
          disabled={loading}
          className={`w-full py-3 text-white font-bold rounded-lg transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Generating..." : "Get Access Code"}
        </button>

        <button
          onClick={() =>
            onSign(address, firstName, lastInitial, email, accessCode)
          }
          disabled={!accessCode} // ❌ Disabled until access code is received
          className={`w-full py-3 font-semibold rounded-lg transition ${
            accessCode
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-400 text-gray-800 cursor-not-allowed"
          }`}
        >
          Sign Petition
        </button>
      </div>

      {message && (
        <p
          className={`text-sm text-center ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
