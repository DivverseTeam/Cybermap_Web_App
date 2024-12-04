import React from "react";

type Props = {
  show: boolean;
};

export default function SpinnerModal({ show }: Props) {
  if (!show) return null;

  return (
    <div className="fixed w-full h-full ml-[-20px] mt-[-40px] z-50 flex items-center justify-center bg-gray-200 bg-opacity-50">
      <div className="flex flex-col items-center justify-center mr-56">
        <div className="w-24 h-24 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
