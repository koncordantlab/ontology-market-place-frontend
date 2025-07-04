import React, { useState, useEffect } from 'react';
import { User, Menu, X, LogOut, Settings } from 'lucide-react';
import { UseOntologyView } from './views/UseOntologyView';
import { OntologyDetailsView } from './views/OntologyDetailsView';
import { EditOntologyView } from './views/EditOntologyView';
import { NewOntologyView } from './views/NewOntologyView';
import { ProfileView } from './views/ProfileView';
import { LoginView } from './views/LoginView';
import { UserProfileSettings } from './components/UserProfileSettings';
import { authService } from './services/authService';

type ViewType = 'login' | 'profile' | 'use-ontology' | 'ontology-details' | 'edit-ontology' | 'new-ontology';

interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('login');
  const [selectedOntologyId, setSelectedOntologyId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = authService.onAuthStateChange((user) => {
      setCurrentUser(user);
      if (user) {
        setCurrentView('profile');
      } else {
        setCurrentView('login');
      }
      setIsLoading(false);
    });

    // Check if user is already authenticated
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentView('profile');
    }
    setIsLoading(false);

    return unsubscribe;
  }, []);

  const getPageTitle = () => {
    if (!currentUser) return 'Login';
    
    switch (currentView) {
      case 'profile':
        return `${currentUser.name}'s Profile`;
      case 'use-ontology':
        return 'Use Ontology';
      case 'ontology-details':
        return 'Ontology Details';
      case 'edit-ontology':
        return 'Edit Ontology';
      case 'new-ontology':
        return 'New Ontology';
      default:
        return 'Ontology Manager';
    }
  };

  const navigationItems = [
    { id: 'profile', label: 'My Profile' },
    { id: 'use-ontology', label: 'Use Ontology' },
    { id: 'new-ontology', label: 'Create New' },
  ];

  const handleViewChange = (view: ViewType, ontologyId?: string) => {
    setCurrentView(view);
    if (ontologyId) {
      setSelectedOntologyId(ontologyId);
    }
    setMobileMenuOpen(false);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('profile');
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setCurrentUser(null);
      setCurrentView('login');
      setSelectedOntologyId(null);
      setShowSettings(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <span className="text-white font-bold text-2xl">OM</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login view if not authenticated
  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Logo/Brand */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OM</span>
              </div>
              <span className="hidden sm:block text-lg font-semibold text-gray-900">
                Ontology Manager
              </span>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6 ml-8">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleViewChange(item.id as ViewType)}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    currentView === item.id 
                      ? 'text-blue-600 border-b-2 border-blue-500 pb-1' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Page title for mobile */}
            <h1 className="md:hidden text-lg font-semibold text-gray-900">
              {getPageTitle()}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* User menu */}
            <div className="relative">
              <button 
                onClick={() => handleViewChange('profile')}
                className="flex items-center space-x-2 p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.name}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-gray-600" />
                )}
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {currentUser.name}
                </span>
              </button>
            </div>
            
            {/* Settings button */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              title="Account Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2 mt-4">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleViewChange(item.id as ViewType)}
                  className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentView === item.id 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <button
                  onClick={() => setShowSettings(true)}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                >
                  Account Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="min-h-screen">
        {currentView === 'profile' && (
          <ProfileView onNavigate={handleViewChange} currentUser={currentUser} />
        )}
        {currentView === 'use-ontology' && (
          <UseOntologyView onNavigate={handleViewChange} />
        )}
        {currentView === 'ontology-details' && (
          <OntologyDetailsView 
            ontologyId={selectedOntologyId} 
            onNavigate={handleViewChange} 
          />
        )}
        {currentView === 'edit-ontology' && (
          <EditOntologyView 
            ontologyId={selectedOntologyId} 
            onNavigate={handleViewChange} 
          />
        )}
        {currentView === 'new-ontology' && (
          <NewOntologyView onNavigate={handleViewChange} />
        )}
      </main>

      {/* User Profile Settings Modal */}
      {showSettings && currentUser && (
        <UserProfileSettings
          user={currentUser}
          onUpdate={handleUserUpdate}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;