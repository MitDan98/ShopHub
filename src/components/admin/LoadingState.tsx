
import React from 'react';

interface LoadingStateProps {
  message?: string;
  error?: string;
}

export const LoadingState = ({ message = "Loading dashboard...", error }: LoadingStateProps) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] w-full">
      {!error ? (
        <div className="animate-pulse flex items-center">
          <svg 
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {message}
        </div>
      ) : (
        <div className="text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            <p className="font-semibold">Authentication Error</p>
            <p className="text-sm">{error}</p>
            {error.includes("UPDATE requires a WHERE clause") && (
              <p className="mt-2 text-sm">Database error: Please contact an administrator.</p>
            )}
          </div>
          <a href="/signin" className="text-blue-600 hover:underline">
            Back to Sign In
          </a>
        </div>
      )}
    </div>
  );
};
