import { useState } from "react";

interface SignatureButtonProps {
  firstName: string;
  lastInitial: string;
  signerEmail: string;
  phone?: string;
  accessCode: string;
}

export default function SignatureButton({
  firstName,
  lastInitial,
  signerEmail,
  phone,
  accessCode,
}: SignatureButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSign = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/docusign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastInitial,
          signerEmail,
          phone,
          accessCode,
        }),
      });

      const data = await response.json();
      if (data.url) window.open(data.url, "_blank");
    } catch (error) {
      console.error("Error creating signing session", error);
    }
    setLoading(false);
  };

  return (
    <button onClick={handleSign} disabled={loading}>
      {loading ? "Generating..." : "Sign Petition"}
    </button>
  );
}
