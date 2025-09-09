# Ontology Marketplace

A modern web application for creating, managing, and using ontologies with Firebase Cloud Functions integration, real-time data management, and comprehensive user dashboards.

## 🚀 Quick Start

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd ontology-marketplace
npm install
```

### Step 2: Firebase Project Setup

#### 2.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `ontology-marketplace-efv1v3`
4. Enable Google Analytics (optional)
5. Click "Create project"

#### 2.2 Enable Required Services

**Authentication**
1. Go to "Authentication" → "Sign-in method"
2. Enable "Email/Password" provider
3. Enable "Google" provider
4. Add authorized domains: `localhost` (for development)

**Firestore Database**
1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode"
3. Select location: `us-central1`
4. Click "Done"

**Cloud Functions**
1. Go to "Functions" → "Get started"
2. Choose "Blaze" plan (required for external API calls)
3. Select Node.js 20 runtime
4. Choose location: `us-central1`

### Step 3: Environment Configuration

#### 3.1 Create Environment File
```bash
# Create .env file
cp .env.example .env
```

#### 3.2 Add Firebase Configuration
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=437525635911614
VITE_FIREBASE_AUTH_DOMAIN=ontology-marketplace-efv1v3.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ontology-marketplace-efv1v3
VITE_FIREBASE_STORAGE_BUCKET=ontology-marketplace-efv1v3.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here

# Application Settings
VITE_APP_ENV=development
VITE_API_BASE_URL=https://us-central1-ontology-marketplace-efv1v3.cloudfunctions.net
```

**Get Firebase Config:**
1. Go to Firebase Console → Project Settings
2. Scroll down to "Your apps"
3. Click "Add app" → "Web"
4. Copy the configuration values

### Step 4: Cloudinary Setup (for Image Uploads)

#### 4.1 Create Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for free account
3. Note your cloud name, API key, and API secret

#### 4.2 Configure Cloudinary
The application is already configured with:
- **Cloud Name**: `dpy6hjz0c`
- **Upload Preset**: `ontologymarketplace`
- **API Key**: `437525635911614`
- **API Secret**: `ahL6jaoclt0G92E1KOxQ13gq1uY`

### Step 5: Deploy Cloud Functions

#### 5.1 Install Firebase CLI
```bash
npm install -g firebase-tools
```

#### 5.2 Login and Initialize
```bash
# Login to Firebase
firebase login

# Set your project
firebase use ontology-marketplace-efv1v3

# Deploy Cloud Functions
firebase deploy --only functions
```

### Step 6: Start Development Server
```bash
npm run dev
```

### Step 7: Access Application
- Open http://localhost:5173
- Sign up or log in with Firebase
- Start creating and managing ontologies!

## 🎯 Features

### Core Functionality
- **Create Ontologies**: Add new ontologies with metadata and thumbnails
- **Import from URL**: Import ontologies from external sources (OWL format only)
- **Search & Filter**: Find ontologies by name, description, tags, or status
- **User Management**: Complete authentication and profile system
- **Database Integration**: Upload ontologies to databases like Neo4j

### Dashboard Features
- **Real-time Overview**: View all your ontologies at a glance
- **Categories**: Filter by All, Recently Modified, Public, Private
- **Tags**: Dynamic tagging system for easy organization
- **Thumbnail Support**: Visual representation with automatic fallbacks
- **Responsive Design**: Works on desktop, tablet, and mobile

### User Experience
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Loading States**: Proper feedback during operations
- **Error Handling**: Clear error messages and fallbacks
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend
- **Firebase Authentication** for user management
- **Firebase Cloud Functions** for API endpoints
- **Firestore** for data storage
- **Cloudinary** for image uploads

### Development Tools
- **ESLint** for code quality
- **TypeScript** for type safety
- **PostCSS** for CSS processing

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── OntologySelector.tsx    # Ontology selection dropdown
│   ├── ThumbnailUpload.tsx     # Image upload component
│   ├── Toggle.tsx              # Toggle switch component
│   └── UserProfileSettings.tsx # User profile management
├── views/               # Main application views
│   ├── DashboardView.tsx       # Main dashboard
│   ├── LoginView.tsx           # Authentication
│   ├── NewOntologyView.tsx     # Create new ontology
│   ├── UseOntologyView.tsx     # Use/upload ontologies
│   ├── EditOntologyView.tsx    # Edit existing ontologies
│   └── OntologyDetailsView.tsx # View ontology details
├── services/            # Business logic and API services
│   ├── authService.ts          # Firebase authentication
│   ├── ontologyService.ts      # Ontology API operations
│   ├── cloudinaryService.ts    # Image upload service
│   └── simpleUploadService.ts  # Simple upload service
├── config/              # Configuration files
│   ├── firebase.ts             # Firebase configuration
│   ├── firebaseFunctions.ts    # Cloud Functions URLs
│   └── cloudinary.ts           # Cloudinary configuration
└── App.tsx              # Main application component

functions/               # Firebase Cloud Functions
└── index.js             # Cloud Functions implementation
```

## 🔧 API Endpoints

### Cloud Functions URLs
All functions use the new cloud functions URL pattern:
```
https://us-central1-ontology-marketplace-efv1v3.cloudfunctions.net/
```

### Available Endpoints

#### Search Ontologies
- **URL**: `/search_ontologies`
- **Method**: GET
- **Auth**: Bearer token required
- **Returns**: List of user's ontologies and public ontologies

#### Add Ontology
- **URL**: `/add_ontology`
- **Method**: POST
- **Auth**: Bearer token required
- **Payload**: Ontology data (name, description, properties)
- **Returns**: Created ontology with ID

#### Process Ontology URL
- **URL**: `/process_ontology_url`
- **Method**: POST
- **Auth**: Bearer token required
- **Payload**: URL to process
- **Returns**: Processed ontology data

#### Upload to Database
- **URL**: `/upload_ontology_to_database`
- **Method**: POST
- **Auth**: Bearer token required
- **Payload**: ontologyId, targetDatabase, mergeStrategy
- **Returns**: Upload result

#### Generate Cloudinary Signature
- **URL**: `/generate_cloudinary_signature`
- **Method**: POST
- **Auth**: Bearer token required
- **Payload**: Upload parameters
- **Returns**: Signature data for secure uploads

## 🎮 Usage Guide

### Getting Started
1. **Sign Up/Login**: Use Firebase authentication (email/password or Google)
2. **Dashboard**: View your ontologies and explore features
3. **Create Ontology**: Add new ontologies with metadata
4. **Import from URL**: Import ontologies from external sources
5. **Manage**: Edit, delete, and organize your ontologies

### Creating Ontologies
1. Click "Create New Ontology" or navigate to the create page
2. Fill in required fields:
   - **Title**: Name of the ontology
   - **Description**: Detailed description
   - **Source URL** (optional): URL to import from
   - **Tags**: Comma-separated tags
   - **Public/Private**: Control visibility
3. Upload thumbnail (optional)
4. Click "CREATE ONTOLOGY"

### Using Ontologies
1. Go to "Use Ontology" view
2. Select an ontology from the dropdown
3. Choose upload strategy (merge or replace)
4. Click "UPLOAD" to send to target database

### Managing Ontologies
- **View**: Click on ontology cards to see details
- **Edit**: Modify ontology properties and metadata
- **Delete**: Remove ontologies with confirmation
- **Search**: Use the search bar to find specific ontologies
- **Filter**: Use categories and tags to organize

## 🔒 Security

### Authentication
- Firebase Authentication with email/password and Google OAuth
- Secure token-based API authentication
- Protected routes and user-specific data access

### Data Protection
- User-specific ontology access
- Public/private ontology controls
- Secure Cloud Functions with authentication
- Environment variables for sensitive data

### Firestore Security Rules
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

## 🚀 Production Deployment

### Pre-deployment Checklist
- [ ] Firebase project configured with Blaze plan
- [ ] Cloud Functions deployed and tested
- [ ] Environment variables set for production
- [ ] Firestore security rules updated
- [ ] CORS settings configured for production domains

### Build for Production
```bash
# Build frontend
npm run build

# Deploy functions
firebase deploy --only functions

# Deploy hosting (optional)
firebase deploy --only hosting
```

### Deployment Options

#### Netlify (Recommended)
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy automatically on push to main branch

#### Vercel
1. Import project from GitHub
2. Set framework preset: Vite
3. Configure build settings
4. Add environment variables
5. Deploy automatically

#### Firebase Hosting
1. Initialize hosting: `firebase init hosting`
2. Configure `firebase.json`
3. Deploy: `firebase deploy --only hosting`

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Development Workflow
1. **Local Development**: `npm run dev`
2. **Function Development**: `firebase emulators:start --only functions`
3. **Testing**: Test all features with real Firebase services
4. **Deployment**: Deploy functions and test in production

### Firebase Commands
```bash
firebase login                    # Login to Firebase
firebase use your-project-id      # Set project
firebase deploy --only functions  # Deploy functions
firebase functions:log            # View function logs
firebase emulators:start          # Start local emulators
```

## 🆘 Troubleshooting

### Common Issues

#### Firebase Authentication Issues
**Problem**: Users can't sign in
**Solution**: 
1. Check Firebase configuration in `.env`
2. Verify Authentication providers are enabled
3. Add localhost to authorized domains

#### Cloud Functions Errors
**Problem**: API calls failing
**Solution**:
1. Check function logs: `firebase functions:log`
2. Verify Blaze plan is enabled
3. Check CORS configuration
4. Ensure functions are deployed

#### Build Errors
**Problem**: `npm run build` fails
**Solution**:
1. Clear caches: `rm -rf node_modules package-lock.json`
2. Reinstall: `npm install`
3. Check TypeScript errors: `npx tsc --noEmit`

#### Image Upload Issues
**Problem**: Thumbnails not uploading
**Solution**:
1. Verify Cloudinary configuration
2. Check upload preset exists
3. Ensure proper CORS settings

### Getting Help
1. Check browser console for errors
2. View Firebase function logs
3. Verify environment variables
4. Test in different browser/incognito mode

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use proper error handling
- Ensure responsive design
- Test with real Firebase services
- Add comments for complex logic

## 📊 Project Status

✅ **Production Ready**
- Firebase Cloud Functions integration
- Real-time dashboard with filtering
- Comprehensive user management
- Responsive design
- TypeScript support
- Image upload functionality
- Database integration

### Current Features
- **Dashboard**: Complete ontology management interface
- **API Integration**: Firebase Cloud Functions backend
- **User Management**: Full authentication and profile system
- **Ontology Operations**: Create, read, update, delete
- **Search & Filter**: Advanced filtering and search capabilities
- **Image Upload**: Cloudinary integration for thumbnails
- **Database Upload**: Upload ontologies to external databases

**Ready to use**: Clone, configure Firebase, deploy functions, and run `npm run dev`!
