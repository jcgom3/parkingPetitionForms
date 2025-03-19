import React from "react";

interface AddressProps {
  title: string;
  addresses: string[];
}

export default function AddressList({ title, addresses }: AddressProps) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 space-y-4 border border-gray-200 w-full max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-gray-700 text-center">
        {title}
      </h2>

      <ul className="space-y-2">
        {addresses.map((address, index) => (
          <li
            key={index}
            className="p-3 bg-gray-100 rounded-md text-gray-800 border border-gray-300 shadow-sm"
          >
            {address}
          </li>
        ))}
      </ul>
    </div>
  );
}
