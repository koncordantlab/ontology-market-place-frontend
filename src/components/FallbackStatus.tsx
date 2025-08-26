import React from 'react';
import { ontologyService } from '../services/ontologyService';

interface FallbackStatusProps {
  className?: string;
}

export const FallbackStatus: React.FC<FallbackStatusProps> = ({ className = '' }) => {
  const [fallbackInfo, setFallbackInfo] = React.useState(() => ontologyService.wasFallbackUsed());

  React.useEffect(() => {
    // Check fallback status every 5 seconds
    const interval = setInterval(() => {
      setFallbackInfo(ontologyService.wasFallbackUsed());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!fallbackInfo.used) {
    return null; // Don't show anything if no fallback was used
  }

  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-md p-3 ${className}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Using Fallback Data
          </h3>
          <div className="mt-1 text-sm text-yellow-700">
            <p>Reason: {fallbackInfo.reason}</p>
            <p className="mt-1">
              Some data may not be up-to-date. Please check your connection and refresh.
            </p>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={() => {
              ontologyService.resetFallbackTracking();
              setFallbackInfo({ used: false, reason: '' });
            }}
            className="text-yellow-800 hover:text-yellow-900 text-sm font-medium"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
