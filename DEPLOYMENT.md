# Google Cloud Serverless Deployment Guide

This guide provides step-by-step instructions for deploying the Ontology Management Application to Google Cloud using serverless architecture.

## 🎯 Deployment Architecture

- **Frontend**: Firebase Hosting (Static Site)
- **Authentication**: Firebase Auth
- **Database**: Firestore + Neo4j (Cloud or Aura)
- **Functions**: Cloud Functions (Node.js)
- **Storage**: Cloud Storage (file uploads)
- **CDN**: Firebase Hosting CDN

## ✅ Pre-Deployment TODO List

### 1. Google Cloud Setup
- [ ] Create Google Cloud Project
- [ ] Enable billing for the project
- [ ] Install Google Cloud CLI (`gcloud`)
- [ ] Authenticate: `gcloud auth login`
- [ ] Set project: `gcloud config set project YOUR_PROJECT_ID`

### 2. Firebase Project Setup
- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Create new project (or use existing Google Cloud project)
- [ ] Enable Authentication
  - [ ] Email/Password provider
  - [ ] Google provider
  - [ ] Configure OAuth consent screen
- [ ] Enable Firestore Database
  - [ ] Start in production mode
  - [ ] Choose region (same as Cloud Functions)
- [ ] Enable Firebase Hosting
- [ ] Enable Cloud Storage

### 3. Environment Configuration
- [ ] Copy `.env.example` to `.env.production`
- [ ] Fill in Firebase configuration values
- [ ] Set up service account keys
- [ ] Configure CORS settings

### 4. Neo4j Database Setup
Choose one option:

**Option A: Neo4j Aura (Recommended)**
- [ ] Create [Neo4j Aura](https://neo4j.com/cloud/aura/) account
- [ ] Create database instance
- [ ] Download connection credentials
- [ ] Configure firewall rules

**Option B: Neo4j on Google Cloud**
- [ ] Deploy Neo4j on Compute Engine
- [ ] Configure networking and security
- [ ] Set up SSL certificates
- [ ] Configure backup strategy

### 5. Cloud Functions Setup
- [ ] Enable Cloud Functions API
- [ ] Set up function deployment
- [ ] Configure environment variables
- [ ] Set up monitoring and logging

### 6. Security Configuration
- [ ] Configure Firestore security rules
- [ ] Set up Cloud Storage security rules
- [ ] Configure CORS policies
- [ ] Set up API key restrictions
- [ ] Configure OAuth domains

### 7. Domain and SSL
- [ ] Purchase/configure custom domain
- [ ] Set up DNS records
- [ ] Configure SSL certificates
- [ ] Set up redirects

## 🔧 Detailed Setup Instructions

### Step 1: Google Cloud Project Setup

```bash
# Install Google Cloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Authenticate
gcloud auth login

# Create new project (or use existing)
gcloud projects create YOUR_PROJECT_ID --name="Ontology Manager"

# Set active project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable \
  cloudfunctions.googleapis.com \
  firebase.googleapis.com \
  firestore.googleapis.com \
  storage.googleapis.com \
  cloudbuild.googleapis.com
```

### Step 2: Firebase Project Configuration

1. **Create Firebase Project**
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Initialize Firebase in your project
   firebase init
   ```

2. **Select Services**
   - [x] Firestore
   - [x] Functions
   - [x] Hosting
   - [x] Storage

3. **Configuration Options**
   - Firestore: Use default rules for now
   - Functions: TypeScript, ESLint
   - Hosting: `dist` directory, SPA
   - Storage: Default rules

### Step 3: Environment Variables Setup

Create `.env.production`:

```env
# Firebase Configuration (Get from Firebase Console > Project Settings)
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Neo4j Configuration
NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your-password

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_REGION=us-central1
```

### Step 4: Firestore Security Rules

Update `firestore.rules`:

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

### Step 5: Cloud Storage Rules

Update `storage.rules`:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload files to their own directory
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public ontology files (read-only)
    match /ontologies/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 6: Build and Deploy Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "build:prod": "vite build --mode production",
    "deploy:hosting": "firebase deploy --only hosting",
    "deploy:functions": "firebase deploy --only functions",
    "deploy:firestore": "firebase deploy --only firestore:rules",
    "deploy:storage": "firebase deploy --only storage",
    "deploy:all": "npm run build:prod && firebase deploy",
    "preview:prod": "vite preview --mode production"
  }
}
```

## 🚀 Deployment Steps

### 1. Build Application
```bash
# Install dependencies
npm install

# Build for production
npm run build:prod
```

### 2. Deploy to Firebase
```bash
# Deploy everything
npm run deploy:all

# Or deploy individually
npm run deploy:hosting
npm run deploy:functions
npm run deploy:firestore
npm run deploy:storage
```

### 3. Configure Custom Domain (Optional)
```bash
# Add custom domain
firebase hosting:sites:create your-domain-com

# Configure DNS
# Add these records to your DNS:
# A record: @ -> 151.101.1.195
# A record: @ -> 151.101.65.195
# CNAME: www -> your-project.web.app
```

## 🔍 Post-Deployment Verification

### 1. Test Authentication
- [ ] Email/password signup works
- [ ] Google OAuth works
- [ ] Password reset works
- [ ] Demo mode works

### 2. Test Core Features
- [ ] Create new ontology
- [ ] Edit existing ontology
- [ ] File upload works
- [ ] Neo4j connection works
- [ ] Comments system works

### 3. Test Performance
- [ ] Page load times < 3 seconds
- [ ] Image optimization working
- [ ] CDN serving static assets
- [ ] Mobile responsiveness

### 4. Test Security
- [ ] Firestore rules working
- [ ] Storage rules working
- [ ] API keys restricted
- [ ] HTTPS enforcing

## 📊 Monitoring and Maintenance

### 1. Set Up Monitoring
```bash
# Enable monitoring
gcloud services enable monitoring.googleapis.com

# Set up alerts for:
# - High error rates
# - Slow response times
# - Storage usage
# - Function invocations
```

### 2. Regular Maintenance Tasks
- [ ] Monitor Firebase usage and costs
- [ ] Update dependencies monthly
- [ ] Review security rules quarterly
- [ ] Backup Firestore data
- [ ] Monitor Neo4j performance

### 3. Cost Optimization
- [ ] Set up billing alerts
- [ ] Monitor function execution time
- [ ] Optimize bundle size
- [ ] Use Firebase Analytics
- [ ] Review storage usage

## 🔒 Security Checklist

### Firebase Security
- [ ] API keys restricted to specific domains
- [ ] Firestore rules tested and secure
- [ ] Storage rules prevent unauthorized access
- [ ] OAuth domains configured correctly

### Application Security
- [ ] Environment variables secured
- [ ] No sensitive data in client code
- [ ] HTTPS enforced everywhere
- [ ] Content Security Policy configured

### Neo4j Security
- [ ] Database credentials secured
- [ ] Network access restricted
- [ ] Regular security updates
- [ ] Backup encryption enabled

## 💰 Cost Estimation

### Firebase Costs (Monthly)
- **Hosting**: Free tier (10GB storage, 10GB transfer)
- **Authentication**: Free tier (50,000 MAU)
- **Firestore**: ~$0.18 per 100K reads, $0.18 per 100K writes
- **Functions**: $0.40 per million invocations
- **Storage**: $0.026 per GB

### Neo4j Aura Costs
- **AuraDB Free**: Free tier (50K nodes, 175K relationships)
- **AuraDB Professional**: Starting at $65/month
- **AuraDS**: Starting at $300/month

### Estimated Total
- **Development/Demo**: $0-20/month
- **Small Production**: $50-200/month
- **Medium Production**: $200-1000/month

## 🆘 Troubleshooting

### Common Deployment Issues

**Build Failures**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json dist
npm install
npm run build:prod
```

**Firebase Deploy Errors**
```bash
# Check Firebase CLI version
firebase --version

# Update if needed
npm install -g firebase-tools@latest

# Re-authenticate
firebase logout
firebase login
```

**Environment Variable Issues**
- Ensure all variables are prefixed with `VITE_`
- Check `.env.production` file exists
- Verify Firebase config values

**Neo4j Connection Issues**
- Check firewall rules
- Verify credentials
- Test connection from local machine
- Check SSL certificate validity

### Getting Help
- [Firebase Support](https://firebase.google.com/support)
- [Google Cloud Support](https://cloud.google.com/support)
- [Neo4j Support](https://neo4j.com/support/)
- [GitHub Issues](https://github.com/yourusername/ontology-management-app/issues)

---

## 📋 Quick Deployment Checklist

Print this checklist and check off items as you complete them:

**Pre-Deployment**
- [ ] Google Cloud project created
- [ ] Firebase project configured
- [ ] Environment variables set
- [ ] Neo4j database ready
- [ ] Security rules configured

**Deployment**
- [ ] Application built successfully
- [ ] Firebase hosting deployed
- [ ] Functions deployed (if any)
- [ ] Database rules deployed
- [ ] Custom domain configured

**Post-Deployment**
- [ ] Authentication tested
- [ ] Core features working
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Monitoring configured

**Maintenance**
- [ ] Backup strategy implemented
- [ ] Cost monitoring set up
- [ ] Update schedule planned
- [ ] Support contacts documented

---

**Estimated Setup Time**: 4-8 hours for first deployment
**Maintenance Time**: 2-4 hours per month
