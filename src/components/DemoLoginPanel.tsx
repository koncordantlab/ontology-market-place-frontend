import React, { useState } from 'react';
import { User, Crown, GraduationCap, FlaskConical, Play, Info } from 'lucide-react';
import { DEMO_USERS, DemoUser, demoAuthService } from '../services/demoAuthService';

interface DemoLoginPanelProps {
  onDemoLogin: (user: DemoUser) => void;
  isLoading: boolean;
}

export const DemoLoginPanel: React.FC<DemoLoginPanelProps> = ({ onDemoLogin, isLoading }) => {
  const [selectedRole, setSelectedRole] = useState<'all' | 'admin' | 'researcher' | 'student'>('all');

  const handleDemoLogin = async (user: DemoUser) => {
    try {
      const loggedInUser = await demoAuthService.signInWithDemo(user.id);
      onDemoLogin(loggedInUser);
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'researcher': return <FlaskConical className="h-4 w-4 text-blue-600" />;
      case 'student': return <GraduationCap className="h-4 w-4 text-green-600" />;
      default: return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-yellow-100 text-yellow-800';
      case 'researcher': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = selectedRole === 'all' 
    ? DEMO_USERS 
    : DEMO_USERS.filter(user => user.role === selectedRole);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Play className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Demo Accounts</h3>
      </div>

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-start">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Quick Demo Access</p>
            <p className="mt-1">Click any profile below to instantly sign in and explore the application with pre-configured data.</p>
          </div>
        </div>
      </div>

      {/* Role Filter */}
      <div className="mb-4">
        <div className="flex space-x-2">
          {['all', 'admin', 'researcher', 'student'].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role as any)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                selectedRole === role
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Demo Users */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {filteredUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => handleDemoLogin(user)}
            disabled={isLoading}
            className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-medium text-gray-900 truncate">{user.name}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                    <span className="ml-1">{user.role}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">{user.email}</p>
                {user.department && (
                  <p className="text-xs text-gray-500 truncate">{user.department}</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Admin:</strong> Full access to all features and settings</p>
          <p><strong>Researcher:</strong> Create and manage ontologies, collaborate</p>
          <p><strong>Student:</strong> View and use ontologies, limited editing</p>
        </div>
      </div>
    </div>
  );
};