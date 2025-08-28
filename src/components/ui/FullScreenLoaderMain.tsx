// components/ui/FullScreenLoader.tsx
"use client";

import { FaSpinner } from "react-icons/fa";

const FullScreenLoaderMain = ({ message = "Chargement en cours..." }: { message?: string }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <FaSpinner className="h-12 w-12 text-primary animate-spin" />
          <p className="mt-4 text-lg text-gray-600 font-medium">
            {message}
          </p>
        </div>
      </div>
  );
};

export default FullScreenLoaderMain;
