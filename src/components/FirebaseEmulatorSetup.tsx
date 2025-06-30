import React, { useState, useEffect } from 'react';
import { Server, AlertTriangle, CheckCircle, Settings, Code } from 'lucide-react';

interface FirebaseEmulatorSetupProps {
  onEmulatorReady?: () => void;
}

export const FirebaseEmulatorSetup: React.FC<FirebaseEmulatorSetupProps> = ({ onEmulatorReady }) => {
  const [isEmulatorRunning, setIsEmulatorRunning] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkEmulatorStatus = async () => {
    setIsChecking(true);
    try {
      // Try to connect to Firebase Auth Emulator
      const response = await fetch('http://localhost:9099', { method: 'HEAD' });
      setIsEmulatorRunning(response.ok);
      if (response.ok && onEmulatorReady) {
        onEmulatorReady();
      }
    } catch (error) {
      setIsEmulatorRunning(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkEmulatorStatus();
    // Check every 5 seconds
    const interval = setInterval(checkEmulatorStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Server className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Firebase Emulator</h3>
      </div>

      <div className="space-y-4">
        {/* Status */}
        <div className="flex items-center space-x-3">
          {isChecking ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          ) : isEmulatorRunning ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          )}
          <span className={`font-medium ${
            isEmulatorRunning ? 'text-green-800' : 'text-yellow-800'
          }`}>
            {isChecking ? 'Checking...' : isEmulatorRunning ? 'Emulator Running' : 'Emulator Not Running'}
          </span>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-md p-4">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Setup Instructions
          </h4>
          
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <p className="font-medium">1. Install Firebase CLI:</p>
              <div className="bg-gray-800 text-green-400 p-2 rounded mt-1 font-mono text-xs">
                npm install -g firebase-tools
              </div>
            </div>

            <div>
              <p className="font-medium">2. Initialize Firebase in your project:</p>
              <div className="bg-gray-800 text-green-400 p-2 rounded mt-1 font-mono text-xs">
                firebase init emulators
              </div>
            </div>

            <div>
              <p className="font-medium">3. Start the emulators:</p>
              <div className="bg-gray-800 text-green-400 p-2 rounded mt-1 font-mono text-xs">
                firebase emulators:start
              </div>
            </div>
          </div>
        </div>

        {/* Configuration */}
        <div className="bg-blue-50 rounded-md p-4">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center">
            <Code className="h-4 w-4 mr-2" />
            Emulator Configuration
          </h4>
          
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>Auth Emulator:</strong> http://localhost:9099</p>
            <p><strong>Firestore Emulator:</strong> http://localhost:8080</p>
            <p><strong>Functions Emulator:</strong> http://localhost:5001</p>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-green-50 rounded-md p-4">
          <h4 className="font-medium text-green-900 mb-2">Benefits of Using Emulator</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• No Firebase project setup required</li>
            <li>• Unlimited authentication for testing</li>
            <li>• Local data storage (no cloud costs)</li>
            <li>• Fast development and testing</li>
            <li>• Offline development capability</li>
          </ul>
        </div>

        {/* Action Button */}
        <button
          onClick={checkEmulatorStatus}
          disabled={isChecking}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
        >
          <Server className="h-4 w-4" />
          <span>{isChecking ? 'Checking...' : 'Check Emulator Status'}</span>
        </button>
      </div>
    </div>
  );
};