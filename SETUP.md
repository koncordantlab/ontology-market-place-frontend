# Setup Instructions

This document provides detailed setup instructions for the Ontology Management Application.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- A Firebase account
- (Optional) Neo4j database for advanced features

## Step-by-Step Setup

### 1. Project Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/ontology-management-app.git
cd ontology-management-app

# Install dependencies
npm install
```

### 2. Firebase Configuration

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "ontology-manager")
4. Choose whether to enable Google Analytics
5. Click "Create project"

#### Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click and toggle "Enable"
   - **Google**: Click, toggle "Enable", and configure:
     - Project support email: Your email
     - Click "Save"

#### Set Up Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location (choose closest to your users)
5. Click "Done"

#### Configure Security Rules

In Firestore, go to "Rules" tab and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Ontologies are readable by authenticated users, writable by owner
    match /ontologies/{ontologyId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource == null || resource.data.ownerId == request.auth.uid);
    }
    
    // Comments are readable by authenticated users, writable by author
    match /comments/{commentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource == null || resource.data.authorId == request.auth.uid);
    }
  }
}
```

#### Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Web" icon (</>) to add a web app
4. Register app with nickname (e.g., "Ontology Manager Web")
5. Copy the configuration object

### 3. Environment Configuration

Create `.env` file in project root:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase configuration:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 4. Neo4j Setup (Optional)

For database integration features, you can use either:

#### Option A: Neo4j Desktop (Local)

1. Download [Neo4j Desktop](https://neo4j.com/download/)
2. Install and create a new project
3. Create a new database:
   - Name: `ontology-db`
   - Password: Set a secure password
   - Version: Latest stable
4. Start the database
5. Note the connection details:
   - URI: `bolt://localhost:7687`
   - Username: `neo4j`
   - Password: Your chosen password

#### Option B: Neo4j Aura (Cloud)

1. Go to [Neo4j Aura](https://neo4j.com/cloud/aura/)
2. Create a free account
3. Create a new database instance
4. Download the credentials file
5. Note the connection details from the credentials

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Verification Steps

### 1. Test Authentication

1. Open the application
2. Try creating a new account
3. Test Google Sign-In
4. Verify user profile creation

### 2. Test Basic Features

1. Create a new ontology
2. Try the visual editor
3. Test file upload functionality
4. Check profile management

### 3. Test Neo4j Integration (if configured)

1. Go to "Use Ontology" view
2. Enter your Neo4j credentials
3. Test connection
4. Try running a simple query

## Troubleshooting

### Common Issues

#### Firebase Authentication Error
```
Firebase: Error (auth/invalid-api-key)
```
**Solution**: Check your `.env` file has correct Firebase configuration

#### Environment Variables Not Loading
```
Cannot read properties of undefined
```
**Solution**: Ensure all environment variables are prefixed with `VITE_`

#### Neo4j Connection Failed
```
Connection failed: ServiceUnavailable
```
**Solutions**:
- Check Neo4j is running
- Verify connection URI, username, and password
- Check firewall settings

#### Build Errors
```
Module not found or TypeScript errors
```
**Solutions**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
```

### Getting Help

1. Check the main [README.md](README.md) for general information
2. Look at existing [GitHub Issues](https://github.com/yourusername/ontology-management-app/issues)
3. Create a new issue with:
   - Detailed error message
   - Steps to reproduce
   - Your environment details

## Next Steps

After successful setup:

1. Explore the application features
2. Read the [User Guide](USER_GUIDE.md) for detailed usage instructions
3. Check the [API Documentation](API.md) for integration details
4. Consider contributing to the project

## Production Deployment

For production deployment instructions, see:
- [Deployment Guide](DEPLOYMENT.md)
- [Security Best Practices](SECURITY.md)