import React from "react";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-nile-blue-950 text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white border-opacity-70 mb-4"></div>
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
}
