# ontology-market-place-frontend

A modern, full-featured web application for creating, managing, and visualizing ontologies with Neo4j database integration and Firebase authentication.

![Ontology Manager](https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## 🚀 Features

### Core Functionality
- **Ontology Creation & Editing**: Visual graph-based ontology editor with drag-and-drop functionality
- **Database Integration**: Connect to Neo4j databases for real-time data visualization and management
- **File Import/Export**: Support for CSV, TXT, OWL, and RDF file formats
- **Ontology Mixing**: Combine multiple ontologies to create comprehensive knowledge graphs
- **Real-time Collaboration**: Comment system for collaborative ontology development

### Authentication & User Management
- **Firebase Authentication**: Secure login with email/password and Google OAuth
- **Demo Mode**: Instant access with pre-configured demo accounts
- **Firebase Emulator**: Local development with emulated authentication
- **User Profiles**: Customizable user profiles with avatar support
- **Account Management**: Password reset, profile updates, and account settings

### Visualization & Analysis
- **Interactive Graph Visualization**: Dynamic, interactive graph rendering with Neo4j integration
- **Query Console**: Built-in Cypher query interface for advanced database operations
- **Data Export**: Export ontologies and query results in multiple formats

### Modern UI/UX
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark/Light Theme**: Adaptive theming for better user experience
- **Accessibility**: WCAG compliant with keyboard navigation support

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth + Demo Mode
- **Database**: Neo4j + Firestore
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Git
- (Optional) Firebase project for production
- (Optional) Neo4j database for database features

## 🚀 Quick Start

### Option 1: Demo Mode (Fastest)

1. **Clone and Install**
   ```bash
   git clone https://github.com/yourusername/ontology-management-app.git
   cd ontology-management-app
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access Demo Mode**
   - Open http://localhost:5173
   - Click "Demo Mode" tab
   - Choose any demo account to instantly explore the application

### Option 2: Firebase Emulator (Development)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Start Firebase Emulators**
   ```bash
   firebase emulators:start
   ```

3. **Start Development Server** (in another terminal)
   ```bash
   npm run dev
   ```

4. **Access Application**
   - Open http://localhost:5173
   - Create accounts and test authentication locally

### Option 3: Production Firebase

1. **Set Up Firebase Project**
   - Follow detailed instructions in [SETUP.md](SETUP.md)

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase configuration
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🎮 Demo Accounts

The application includes several pre-configured demo accounts for immediate testing:

### Admin Account
- **Dr. Sarah Chen** - Computer Science Department
- Full administrative access to all features

### Researcher Accounts
- **Prof. Michael Rodriguez** - Biomedical Engineering
- **Dr. Emily Watson** - Medical Informatics
- Create and manage ontologies, full collaboration features

### Student Accounts
- **Alex Thompson** - Data Science
- **Jordan Kim** - Information Systems
- View and use ontologies, limited editing capabilities

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CommentSystem.tsx
│   ├── DatabaseConnectionForm.tsx
│   ├── DemoLoginPanel.tsx          # Demo authentication UI
│   ├── FirebaseEmulatorSetup.tsx   # Emulator setup guide
│   ├── FileDropZone.tsx
│   ├── GraphVisualization.tsx
│   ├── Neo4jGraphVisualization.tsx
│   ├── Neo4jQueryPanel.tsx
│   ├── OntologyCard.tsx
│   ├── OntologyDetailsForm.tsx
│   ├── OntologyMixPanel.tsx
│   ├── OntologySelector.tsx
│   ├── Toggle.tsx
│   └── UserProfileSettings.tsx
├── views/               # Main application views
│   ├── EditOntologyView.tsx
│   ├── LoginView.tsx
│   ├── NewOntologyView.tsx
│   ├── OntologyDetailsView.tsx
│   ├── ProfileView.tsx
│   └── UseOntologyView.tsx
├── services/            # Business logic and API services
│   ├── authService.ts
│   ├── demoAuthService.ts          # Demo authentication service
│   └── neo4jService.ts
├── config/              # Configuration files
│   └── firebase.ts
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## 🎯 Usage Guide

### Demo Mode Usage

1. **Quick Access**
   - Click "Demo Mode" on the login screen
   - Select any demo account
   - Instantly explore all features with sample data

2. **Demo Features**
   - Pre-loaded ontologies for each user type
   - Sample Neo4j data connections
   - Full feature access based on user role
   - Persistent demo sessions (stored locally)

### Development with Emulator

1. **Start Emulators**
   ```bash
   firebase emulators:start
   ```

2. **Access Emulator UI**
   - Open http://localhost:4000
   - View authentication and Firestore data
   - Monitor real-time changes

3. **Development Benefits**
   - No Firebase project setup required
   - Unlimited test accounts
   - Local data storage
   - Fast development cycle

### Production Usage

1. **Firebase Setup**
   - Create Firebase project
   - Enable Authentication and Firestore
   - Configure environment variables

2. **Deploy**
   - Build: `npm run build`
   - Deploy to your preferred hosting platform

## 🔧 Development Features

### Authentication Modes

1. **Demo Mode**
   - Instant access with pre-configured accounts
   - No setup required
   - Perfect for demonstrations and testing

2. **Firebase Emulator**
   - Local Firebase emulation
   - Full authentication testing
   - Ideal for development

3. **Production Firebase**
   - Real Firebase project
   - Production-ready authentication
   - Scalable for real users

### Demo Data

The application includes:
- **5 Demo Users** with different roles and departments
- **Sample Ontologies** for each user type
- **Mock Neo4j Data** for database integration testing
- **Realistic User Profiles** with avatars and information

## 🔒 Security

### Demo Mode Security
- Demo accounts are local-only
- No real authentication required
- Data stored in localStorage
- Perfect for public demonstrations

### Development Security
- Firebase emulators run locally
- No production data exposure
- Safe for development and testing

### Production Security
- Full Firebase Authentication
- Secure Firestore rules
- Environment variable protection

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

For production deployment, set these environment variables:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Deploy Options

- **Netlify**: Connect GitHub repo, set env vars, deploy
- **Vercel**: Import project, configure environment, deploy
- **Firebase Hosting**: `firebase deploy`

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `firebase emulators:start` - Start Firebase emulators

### Firebase Emulator Commands

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize emulators (one-time setup)
firebase init emulators

# Start all emulators
firebase emulators:start

# Start specific emulators
firebase emulators:start --only auth,firestore

# Start with UI
firebase emulators:start --import=./emulator-data --export-on-exit
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Test with demo mode or emulators
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines

- Test with demo accounts before submitting
- Use Firebase emulators for authentication testing
- Ensure responsive design
- Follow TypeScript best practices
- Add comments for complex logic

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Demo Mode Issues

**Demo accounts not working**
- Clear localStorage: `localStorage.clear()`
- Refresh the page
- Try a different demo account

### Emulator Issues

**Emulators won't start**
```bash
# Kill existing processes
npx kill-port 9099 8080 4000 5001

# Restart emulators
firebase emulators:start
```

**Connection refused**
- Check if emulators are running: `firebase emulators:start`
- Verify ports are not in use
- Check firewall settings

### General Issues

**Build errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
```

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI framework
- [Firebase](https://firebase.google.com/) - Authentication and database
- [Neo4j](https://neo4j.com/) - Graph database
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Lucide](https://lucide.dev/) - Icon library
- [Vite](https://vitejs.dev/) - Build tool

## 📊 Project Status

This project is actively maintained and under development. The demo mode makes it easy for anyone to explore the application without any setup requirements.

### Demo Access
- ✅ Instant demo accounts
- ✅ Pre-loaded sample data
- ✅ Full feature access
- ✅ No configuration required

### Development Ready
- ✅ Firebase emulator support
- ✅ Local development environment
- ✅ Hot reload and fast refresh
- ✅ TypeScript support

---

Made with ❤️ by [Your Name](https://github.com/yourusername)

**Try it now**: Clone, run `npm install && npm run dev`, and click "Demo Mode" for instant access!