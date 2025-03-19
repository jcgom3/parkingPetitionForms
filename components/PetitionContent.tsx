export default function PetitionContent({
  onProceed,
  signedAddresses,
}: {
  onProceed: () => void;
  signedAddresses: string[];
}) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 space-y-6 border border-gray-300 w-full max-w-3xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-gray-800">
        🚗 Proposed Parking Change
      </h2>

      <p className="text-gray-700 leading-relaxed text-left">
        I hope you're doing well. I wanted to reach out regarding a
        <strong> petition to relocate the parking sign</strong> from the
        opposite side of the street to <strong>our side</strong>—which includes
        your lot, the one behind you, my lot at
        <strong> Desert Rose Dr & Victoria St</strong>, and the lot at{" "}
        <strong>Cascade & Victoria St</strong>.
      </p>

      <h3 className="text-lg font-semibold text-gray-800">
        🏡 Why This Change Is Necessary
      </h3>

      <ul className="text-gray-700 text-left list-disc list-inside space-y-2">
        <li>
          <strong>Fair Parking for Corner Lots:</strong> Other homes get more
          street parking while corner lot owners face unfair limitations.
        </li>
        <li>
          <strong>More Efficient Parking:</strong> Our side of the street has no
          driveways, allowing for more available spaces.
        </li>
        <li>
          <strong>Support from Neighbors:</strong> Residents near the existing
          sign agree that our side makes more sense.
        </li>
      </ul>

      <p className="text-gray-700 leading-relaxed text-left">
        I will bring this to the <strong>CDD meeting on Wednesday</strong>, and
        your
        <strong> signature will help support our request</strong> for a fair
        solution.
      </p>

      <button
        onClick={onProceed}
        className="mt-4 w-full py-3 text-white font-bold rounded-lg bg-blue-600 hover:bg-blue-700 transition"
      >
        Sign the Petition
      </button>

      {/* 📜 Signed Addresses Section */}
      <div className="w-full max-w-3xl mt-8">
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
          ✅ Homes That Have Signed
        </h2>
        <div className="bg-white shadow-md rounded-lg p-6 space-y-4 border border-gray-300">
          {signedAddresses.length > 0 ? (
            <ul className="text-gray-700 text-center space-y-2">
              {signedAddresses.map((address, index) => (
                <li
                  key={index}
                  className="p-2 bg-gray-100 rounded-md border border-gray-200"
                >
                  {address}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">
              No signatures yet. Be the first to sign!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
