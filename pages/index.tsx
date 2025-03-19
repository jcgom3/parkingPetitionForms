import React, { useState } from "react";
import PetitionContent from "@/components/PetitionContent";
import SignerRow from "@/components/SignerRow";

export default function HomePage() {
  const [showPetition, setShowPetition] = useState(false);
  const [signedAddresses, setSignedAddresses] = useState<string[]>([]);

  const cornerLots = [
    "1941 Victoria St",
    "2104 Desert Rose Dr",
    "2103 Desert Rose Dr",
    "1170 Cascade Dr",
  ];

  const sideHomes = [
    "1902 Victoria St",
    "1906 Victoria St",
    "1910 Victoria St",
    "1914 Victoria St",
    "1918 Victoria St",
    "1922 Victoria St",
    "1926 Victoria St",
    "1930 Victoria St",
    "1934 Victoria St",
    "1938 Victoria St",
  ];

  const handleSign = (
    address: string,
    firstName: string,
    lastInitial: string,
    email: string,
    accessCode: string
  ) => {
    console.log(
      `✅ ${firstName} ${lastInitial} signed for ${address} with email ${email} using access code: ${accessCode}`
    );

    // Add the address to the signed list if not already present
    setSignedAddresses((prev) =>
      prev.includes(address) ? prev : [...prev, address]
    );
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
        Proposed Parking & Signatures
      </h1>

      {!showPetition ? (
        <PetitionContent
          onProceed={() => setShowPetition(true)}
          signedAddresses={signedAddresses}
        />
      ) : (
        <>
          {/* 🏡 Corner Lots */}
          <div className="w-full max-w-5xl flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">
              🏡 Proposed Parking for Corner Lots
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full place-items-center">
              {cornerLots.map((address) => (
                <SignerRow
                  key={address}
                  address={address}
                  onSign={handleSign}
                />
              ))}
            </div>
          </div>

          {/* 🚗 Current Parking & Side Homes */}
          <div className="w-full max-w-5xl flex flex-col items-center mt-12">
            <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">
              🚗 Current Parking / Side Homes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full place-items-center">
              {sideHomes.map((address) => (
                <SignerRow
                  key={address}
                  address={address}
                  onSign={handleSign}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
