# Ontology Management Application

A modern, full-featured web application for creating, managing, and visualizing ontologies with Firebase Cloud Functions integration, real-time data management, and comprehensive user dashboards.

![Ontology Manager]([https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop](https://private-user-images.githubusercontent.com/9831332/460401688-91c5ffc6-56c5-4304-8f6f-3b6c7e90a025.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTUxMjA4MzMsIm5iZiI6MTc1NTEyMDUzMywicGF0aCI6Ii85ODMxMzMyLzQ2MDQwMTY4OC05MWM1ZmZjNi01NmM1LTQzMDQtOGY2Zi0zYjZjN2U5MGEwMjUucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI1MDgxMyUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA4MTNUMjEyODUzWiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9MDI0N2FmYmU2MzY0ZjBkOTZjZmU4ZjkxNzkzODU0MmEyM2Y5MzM0ZDRkNzk2MzFmMDA3YWIwMTEwNDIwZGE1ZSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.h0awuPu0-z66cVJKha_5PM6iVmYwDfsuWx8QwgqM8y8))

## 🚀 Features

### Core Functionality
- **Ontology Creation & Management**: Create, edit, and manage ontologies with rich metadata
- **Real-time Dashboard**: Comprehensive dashboard with categories, filtering, and search
- **Firebase Cloud Functions**: Backend API integration for ontology operations
- **File Import/Export**: Support for URL-based ontology imports with thumbnails
- **User Management**: Complete user profile and account management system

### Authentication & User Management
- **Firebase Authentication**: Secure login with email/password and Google OAuth
- **User Profiles**: Customizable user profiles with avatar support
- **Account Settings**: Password reset, profile updates, and ontology management
- **Role-based Access**: Different access levels for different user types

### Dashboard & Visualization
- **Interactive Dashboard**: Real-time ontology overview with categories and tags
- **Dynamic Filtering**: Search, category, and tag-based filtering
- **Responsive Grid Layout**: Beautiful card-based ontology display
- **Thumbnail Support**: Visual representation of ontologies with fallback icons

### Modern UI/UX
- **Responsive Design**: Mobile-first design that works on all devices
- **Clean Interface**: Modern, intuitive user interface
- **Accessibility**: Keyboard navigation and screen reader support
- **Loading States**: Proper loading indicators and error handling

## 🛠️ Technology Stack

### Frontend
- **React**: v18.3.1 - UI framework
- **TypeScript**: v5.5.3 - Type safety and development experience
- **Vite**: v5.4.2 - Build tool and development server
- **Tailwind CSS**: v3.4.1 - Utility-first CSS framework
- **Lucide React**: v0.344.0 - Icon library

### Backend & Services
- **Firebase Auth**: v10.7.1 - Authentication service
- **Firebase Cloud Functions**: v5.0.0 (2nd Gen) - Backend API
- **Firebase Admin**: v12.0.0 - Server-side Firebase SDK
- **Firestore**: NoSQL database for user data and ontologies

### Development Tools
- **ESLint**: v9.9.1 - Code linting
- **PostCSS**: v8.4.35 - CSS processing
- **Autoprefixer**: v10.4.18 - CSS vendor prefixing

### Key Dependencies

#### Frontend Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "firebase": "^10.7.1",
  "lucide-react": "^0.344.0"
}
```

#### Backend Dependencies (Cloud Functions)
```json
{
  "firebase-admin": "^12.0.0",
  "firebase-functions": "^5.0.0",
  "cors": "^2.8.5"
}
```

#### Development Dependencies
```json
{
  "typescript": "^5.5.3",
  "vite": "^5.4.2",
  "tailwindcss": "^3.4.1",
  "eslint": "^9.9.1"
}
```

## 📋 Prerequisites

### System Requirements

#### Development Environment
- **Node.js**: v18.0.0 or higher (LTS recommended)
- **npm**: v8.0.0 or higher (comes with Node.js)
- **Git**: v2.30.0 or higher
- **Firebase CLI**: v12.0.0 or higher (for Cloud Functions deployment)

#### Production Environment
- **Node.js**: v18.0.0 or higher (LTS recommended)
- **npm**: v8.0.0 or higher
- **Firebase Project**: Active Firebase project with billing enabled
- **Hosting Platform**: Netlify, Vercel, or Firebase Hosting

### Firebase Services Required
- **Authentication**: Email/Password and Google OAuth enabled
- **Firestore Database**: Rules configured for user access
- **Cloud Functions**: 2nd Gen functions with Node.js 20 runtime
- **Storage**: (Optional) For file uploads and thumbnails

### Browser Support
- **Chrome**: v90+
- **Firefox**: v88+
- **Safari**: v14+
- **Edge**: v90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/yourusername/ontology-management-app.git
cd ontology-management-app
npm install
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or use existing project
3. Enter project name and enable Google Analytics (optional)
4. Choose default account for Firebase (recommended)
5. Click "Create project"

#### Enable Required Services

**Authentication**
1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Email/Password" provider
3. Enable "Google" provider
4. Add authorized domains (localhost for development)

**Firestore Database**
1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (for development)
3. Select location closest to your users
4. Click "Done"

**Cloud Functions**
1. Go to "Functions" → "Get started"
2. Choose "Blaze" plan (required for external API calls)
3. Select Node.js 20 runtime
4. Choose location (same as Firestore recommended)

#### Configure Environment Variables
```bash
# Create .env file
cp .env.example .env
```

Add your Firebase configuration to `.env`:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here

# Optional: Development settings
VITE_APP_ENV=development
VITE_API_BASE_URL=https://us-central1-your-project.cloudfunctions.net
```

#### Firestore Security Rules
Update your Firestore rules for production:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Ontologies: users can read public ones, write their own
    match /ontologies/{ontologyId} {
      allow read: if resource.data.is_public == true || 
                   (request.auth != null && resource.data.ownerId == request.auth.uid);
      allow write: if request.auth != null && 
                    (resource.data.ownerId == request.auth.uid || 
                     request.resource.data.ownerId == request.auth.uid);
    }
  }
}
```

### 3. Deploy Cloud Functions
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Set your project
firebase use your-project-id

# Deploy Cloud Functions
firebase deploy --only functions
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Access Application
- Open http://localhost:5173 (or the port shown in terminal)
- Sign up or log in with Firebase
- Start creating and managing ontologies!

## 🎯 Application Features

### Dashboard Overview
The main dashboard provides a comprehensive view of your ontologies:

- **User Profile**: Avatar, name, email, and ontology count
- **Categories**: All Ontologies, Recently Modified, Public, Private
- **Tags**: Dynamic tags based on ontology content (Medical, E-commerce, Academic, Research)
- **Search**: Real-time search across ontology names and descriptions
- **Grid View**: Responsive card layout with thumbnails and metadata

### Ontology Management
- **Create New**: Add ontologies with name, description, and metadata
- **Upload from URL**: Import ontologies from external sources
- **Thumbnail Support**: Visual representation with automatic fallbacks
- **Public/Private**: Control visibility of your ontologies
- **Edit & Delete**: Full CRUD operations on ontologies

### User Profile & Settings
- **Profile Management**: Update name, email, and avatar
- **Password Reset**: Secure password change functionality
- **My Ontologies**: Dedicated view of user-created ontologies
- **Account Settings**: Comprehensive account management

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── OntologySelector.tsx
│   ├── UserProfileSettings.tsx
│   └── Toggle.tsx
├── views/               # Main application views
│   ├── DashboardView.tsx        # Main dashboard
│   ├── LoginView.tsx
│   ├── NewOntologyView.tsx
│   ├── UseOntologyView.tsx
│   ├── EditOntologyView.tsx
│   └── OntologyDetailsView.tsx
├── services/            # Business logic and API services
│   ├── authService.ts           # Firebase authentication
│   └── ontologyService.ts       # Cloud Functions API
├── config/              # Configuration files
│   └── firebase.ts
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles

functions/               # Firebase Cloud Functions
├── index.js             # Cloud Functions implementation
└── package.json         # Functions dependencies
```

## 🔧 API Integration

### Cloud Functions Endpoints

The application integrates with Firebase Cloud Functions for backend operations:

#### `search_ontologies`
- **Method**: GET
- **Authentication**: Bearer token required
- **Response**: List of ontologies with metadata
- **Features**: Returns user's ontologies and public ontologies

#### `add_ontology`
- **Method**: POST
- **Authentication**: Bearer token required
- **Payload**: Ontology data with name, description, properties
- **Response**: Created ontology with ID and metadata

### Data Structure
```typescript
interface Ontology {
  id: string;
  name: string;
  description: string;
  properties: {
    source_url?: string;
    image_url?: string;
    is_public: boolean;
  };
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎮 Usage Guide

### Getting Started
1. **Sign Up/Login**: Use Firebase authentication
2. **Dashboard**: View your ontologies and explore features
3. **Create Ontology**: Add new ontologies with metadata
4. **Manage**: Edit, delete, and organize your ontologies

### Dashboard Navigation
- **Categories**: Filter by All, Recently Modified, Public, Private
- **Tags**: Click tags to filter ontologies
- **Search**: Type to search across all ontologies
- **Create New**: Quick access to ontology creation

### Ontology Operations
- **View**: Click on ontology cards to view details
- **Edit**: Modify ontology properties and metadata
- **Delete**: Remove ontologies with confirmation
- **Share**: Control public/private visibility

## 🔒 Security

### Authentication
- Firebase Authentication with email/password and Google OAuth
- Secure token-based API authentication
- Protected routes and user-specific data access

### Data Protection
- User-specific ontology access
- Public/private ontology controls
- Secure Cloud Functions with authentication

### Environment Variables
- Firebase configuration in environment variables
- No hardcoded secrets in source code
- Secure deployment practices

## 🚀 Production Deployment

### Pre-deployment Checklist

#### 1. Firebase Project Setup
- [ ] Firebase project created and configured
- [ ] Blaze plan enabled (required for Cloud Functions)
- [ ] Authentication providers configured
- [ ] Firestore database created
- [ ] Security rules updated for production
- [ ] Cloud Functions deployed and tested

#### 2. Environment Configuration
- [ ] All environment variables set in production
- [ ] Firebase configuration verified
- [ ] API endpoints tested
- [ ] CORS settings configured

#### 3. Application Testing
- [ ] All features tested in production environment
- [ ] Authentication flows verified
- [ ] Database operations tested
- [ ] Error handling verified
- [ ] Performance optimized

### Build for Production

#### 1. Build Frontend
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview build locally
npm run preview
```

#### 2. Deploy Cloud Functions
```bash
# Deploy functions to production
firebase deploy --only functions

# Verify deployment
firebase functions:list
```

### Deployment Options

#### Option 1: Netlify (Recommended)
1. **Connect Repository**
   - Push code to GitHub/GitLab
   - Connect repository to Netlify

2. **Configure Build Settings**
   ```bash
   Build command: npm run build
   Publish directory: dist
   Node version: 18
   ```

3. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add all Firebase configuration variables

4. **Deploy**
   - Netlify will automatically deploy on push to main branch

#### Option 2: Vercel
1. **Import Project**
   - Connect GitHub repository to Vercel
   - Import project

2. **Configure Settings**
   ```bash
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Environment Variables**
   - Add all Firebase configuration in Vercel dashboard

4. **Deploy**
   - Vercel will deploy automatically

#### Option 3: Firebase Hosting
1. **Initialize Hosting**
   ```bash
   firebase init hosting
   ```

2. **Configure Hosting**
   ```javascript
   // firebase.json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

3. **Deploy**
   ```bash
   firebase deploy --only hosting
   ```

### Production Environment Variables

#### Required Variables
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_production_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Application Settings
VITE_APP_ENV=production
VITE_API_BASE_URL=https://us-central1-your-project.cloudfunctions.net
```

#### Security Considerations
- Use production Firebase project (not development)
- Enable proper Firestore security rules
- Configure CORS for production domains
- Set up proper authentication providers
- Monitor function logs and performance

### Post-deployment Verification

#### 1. Function Testing
```bash
# Test API endpoints
curl -X GET "https://us-central1-your-project.cloudfunctions.net/search_ontologies" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 2. Application Testing
- [ ] User registration and login
- [ ] Ontology creation and management
- [ ] Dashboard functionality
- [ ] Search and filtering
- [ ] User profile management

#### 3. Performance Monitoring
- [ ] Firebase Console monitoring
- [ ] Function execution times
- [ ] Database query performance
- [ ] Frontend load times

### Production Maintenance

#### Regular Tasks
- Monitor Firebase usage and costs
- Review function logs for errors
- Update dependencies regularly
- Backup important data
- Monitor application performance

#### Scaling Considerations
- Firestore read/write limits
- Cloud Functions concurrency
- Authentication quotas
- Storage usage limits

## 🧪 Development

### Available Scripts
```bash
# Development
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint for code quality

# Firebase Functions
firebase deploy --only functions    # Deploy Cloud Functions
firebase functions:log              # View function logs
firebase emulators:start --only functions  # Test functions locally
```

### Development Workflow

#### 1. Local Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# In another terminal, deploy functions (first time)
firebase deploy --only functions
```

#### 2. Development Environment
- **Frontend**: http://localhost:5173 (or port shown in terminal)
- **Firebase Console**: Monitor authentication and database
- **Function Logs**: `firebase functions:log` for debugging

#### 3. Testing Workflow
1. **Local Testing**: Use real Firebase services
2. **Function Testing**: Deploy functions and test API endpoints
3. **UI Testing**: Test all user flows and edge cases
4. **Cross-browser Testing**: Test in Chrome, Firefox, Safari, Edge

### Development Best Practices

#### Code Quality
```bash
# Run linting before commits
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

#### TypeScript Configuration
- **Target**: ES2020
- **Strict Mode**: Enabled
- **Module Resolution**: Bundler
- **JSX**: React JSX

#### Environment Variables
```bash
# Development
VITE_APP_ENV=development
VITE_API_BASE_URL=https://us-central1-your-project.cloudfunctions.net

# Production
VITE_APP_ENV=production
VITE_API_BASE_URL=https://us-central1-your-project.cloudfunctions.net
```

### Firebase Development Commands
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project (first time)
firebase init

# Set project
firebase use your-project-id

# Deploy functions
firebase deploy --only functions

# View function logs
firebase functions:log

# Test functions locally
firebase emulators:start --only functions

# Deploy everything
firebase deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use proper error handling
- Ensure responsive design
- Test with real Firebase services
- Add comments for complex logic

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues & Solutions

#### Firebase Authentication Issues
**Problem**: Users can't sign in or register
```bash
# Check Firebase configuration
1. Verify .env file has correct Firebase config
2. Check Firebase Console → Authentication → Sign-in methods
3. Ensure Email/Password and Google providers are enabled
4. Add localhost to authorized domains for development
```

**Solution**:
```env
# Verify these in your .env file
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
```

#### Cloud Functions Errors
**Problem**: API calls failing with 500 errors
```bash
# Check function logs
firebase functions:log

# Verify function deployment
firebase functions:list

# Test function locally
firebase emulators:start --only functions
```

**Common Solutions**:
- Ensure Blaze plan is enabled (required for external API calls)
- Check CORS configuration in functions
- Verify function deployment completed successfully
- Check function logs for specific error messages

#### Build Errors
**Problem**: `npm run build` fails
```bash
# Clear all caches and reinstall
rm -rf node_modules package-lock.json
rm -rf .vite dist
npm install

# Check for TypeScript errors
npx tsc --noEmit

# Run linting
npm run lint
```

**Common Solutions**:
- Update Node.js to v18+ if using older version
- Clear npm cache: `npm cache clean --force`
- Check for conflicting dependencies
- Verify TypeScript configuration

#### Date Display Issues
**Problem**: Dates showing as "Invalid Date" or wrong format
```javascript
// Check browser console for errors
// Verify Firestore timestamp format in functions
// Ensure proper date normalization in API responses
```

**Solution**: Check the date parsing logic in `ontologyService.ts`

#### CORS Issues
**Problem**: API calls blocked by CORS
```javascript
// Verify CORS configuration in functions/index.js
const cors = require('cors')({ origin: true });
```

**Solution**: Ensure CORS middleware is properly configured in Cloud Functions

### Environment-Specific Issues

#### Development Environment
**Port Already in Use**
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

**Firebase Emulator Issues**
```bash
# Kill existing emulator processes
npx kill-port 9099 8080 4000 5001

# Restart emulators
firebase emulators:start
```

#### Production Environment
**Function Timeout**
- Check function execution time in Firebase Console
- Optimize function code for faster execution
- Consider increasing function timeout limit

**Cold Start Issues**
- Monitor function cold start times
- Consider function warm-up strategies
- Optimize function dependencies

### Performance Issues

#### Slow Loading Times
**Frontend**:
- Check bundle size: `npm run build` and review dist folder
- Optimize images and assets
- Enable gzip compression on hosting platform

**Backend**:
- Monitor function execution times
- Optimize database queries
- Use proper indexing in Firestore

#### Memory Issues
**Frontend**:
- Check for memory leaks in React components
- Optimize re-renders with React.memo and useMemo
- Monitor bundle size

**Backend**:
- Monitor function memory usage
- Optimize data processing in functions
- Use streaming for large datasets

### Debugging Tools

#### Frontend Debugging
```bash
# Enable React DevTools
# Check browser console for errors
# Use React Developer Tools extension
# Monitor network requests in DevTools
```

#### Backend Debugging
```bash
# View function logs
firebase functions:log

# Test functions locally
firebase emulators:start --only functions

# Monitor Firebase Console
# Check Firestore data directly
```

### Getting Help

#### Before Asking for Help
1. **Check Logs**: Browser console, Firebase function logs
2. **Verify Configuration**: Environment variables, Firebase settings
3. **Test Isolation**: Try in different browser, incognito mode
4. **Check Documentation**: Firebase docs, React docs, Vite docs

#### Useful Commands
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Firebase CLI version
firebase --version

# List all Firebase projects
firebase projects:list

# Check current project
firebase use
```

#### Support Resources
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://reactjs.org/docs)
- [Vite Documentation](https://vitejs.dev/guide)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI framework
- [Firebase](https://firebase.google.com/) - Authentication, database, and cloud functions
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Lucide](https://lucide.dev/) - Icon library
- [Vite](https://vitejs.dev/) - Build tool
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## 📊 Project Status

This project is actively maintained and production-ready with:
- ✅ Firebase Cloud Functions integration
- ✅ Real-time dashboard with filtering
- ✅ Comprehensive user management
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Production deployment ready

### Current Features
- **Dashboard**: Complete ontology management interface
- **API Integration**: Firebase Cloud Functions backend
- **User Management**: Full authentication and profile system
- **Ontology Operations**: Create, read, update, delete
- **Search & Filter**: Advanced filtering and search capabilities

---

Made with ❤️ by [Your Name](https://github.com/yourusername)

**Get Started**: Clone, configure Firebase, deploy functions, and run `npm run dev`!
