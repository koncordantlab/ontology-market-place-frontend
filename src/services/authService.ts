import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt?: Date;
  lastLoginAt?: Date;
}

export interface AuthError {
  code: string;
  message: string;
}

class AuthService {
  private currentUser: User | null = null;
  private authStateListeners: ((user: User | null) => void)[] = [];

  constructor() {
    // Listen for authentication state changes
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await this.createUserFromFirebaseUser(firebaseUser);
        this.currentUser = user;
        await this.updateLastLogin(user.id);
      } else {
        this.currentUser = null;
      }
      
      // Notify all listeners
      this.authStateListeners.forEach(listener => listener(this.currentUser));
    });
  }

  // Convert Firebase User to our User interface
  private async createUserFromFirebaseUser(firebaseUser: FirebaseUser): Promise<User> {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.data();

    return {
      id: firebaseUser.uid,
      name: userData?.name || firebaseUser.displayName || 'User',
      email: firebaseUser.email || '',
      photoURL: firebaseUser.photoURL || undefined,
      createdAt: userData?.createdAt?.toDate(),
      lastLoginAt: new Date()
    };
  }

  // Register new user with email and password
  async register(email: string, password: string, name: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update the user's display name
      await updateProfile(firebaseUser, { displayName: name });

      // Create user document in Firestore
      const userData = {
        name,
        email,
        createdAt: new Date(),
        lastLoginAt: new Date()
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

      return {
        id: firebaseUser.uid,
        name,
        email,
        createdAt: new Date(),
        lastLoginAt: new Date()
      };
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return await this.createUserFromFirebaseUser(userCredential.user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      // Check if this is a new user and create/update their document
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        // New user - create document
        const userData = {
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          createdAt: new Date(),
          lastLoginAt: new Date()
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      }

      return await this.createUserFromFirebaseUser(firebaseUser);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
      this.currentUser = null;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Send password reset email
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Update user profile
  async updateUserProfile(updates: { name?: string; photoURL?: string }): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }

    try {
      // Update Firebase Auth profile
      if (updates.name || updates.photoURL) {
        await updateProfile(auth.currentUser, {
          displayName: updates.name,
          photoURL: updates.photoURL
        });
      }

      // Update Firestore document
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        ...updates,
        updatedAt: new Date()
      });

      // Update current user
      if (this.currentUser) {
        this.currentUser = {
          ...this.currentUser,
          ...updates
        };
      }
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error('No user is currently signed in');
    }

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update password
      await updatePassword(auth.currentUser, newPassword);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Update last login timestamp
  private async updateLastLogin(userId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        lastLoginAt: new Date()
      });
    } catch (error) {
      console.error('Failed to update last login:', error);
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // Add auth state listener
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.authStateListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  // Handle Firebase Auth errors
  private handleAuthError(error: any): AuthError {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed before completion.',
      'auth/cancelled-popup-request': 'Sign-in was cancelled.',
      'auth/requires-recent-login': 'Please sign in again to perform this action.'
    };

    return {
      code: error.code || 'auth/unknown-error',
      message: errorMessages[error.code] || error.message || 'An unexpected error occurred.'
    };
  }
}

export const authService = new AuthService();