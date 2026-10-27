import { initializeApp, getApps, getApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import type { Auth, User } from 'firebase/auth';

// Standard Firebase configuration reading from Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.length > 5 &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    });
  } catch (error) {
    console.warn('Firebase initialization warning, falling back to simulated mode:', error);
    auth = null;
  }
}

export { auth, googleProvider };

export interface AuthUserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: 'google' | 'password' | 'demo';
}

/**
 * Handle Google Sign-In with real Firebase Auth if configured,
 * or seamless simulated Google Auth if API keys are not yet filled.
 */
export async function signInWithGoogleService(): Promise<AuthUserData> {
  if (isFirebaseConfigured && auth && googleProvider) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      return {
        uid: user.uid,
        email: user.email || 'user@gmail.com',
        displayName: user.displayName || 'Google User',
        photoURL: user.photoURL || undefined,
        provider: 'google',
      };
    } catch (err: unknown) {
      console.warn('Live Firebase Google sign-in failed, checking error:', err);
      const error = err as { code?: string; message?: string };
      // If popup was closed by user, rethrow
      if (error?.code === 'auth/popup-closed-by-user') {
        throw new Error('Jendela masuk Google ditutup oleh pengguna.');
      }
      // If invalid API key or configuration error, fallback to simulated account
      if (
        error?.code === 'auth/api-key-not-valid' ||
        error?.code === 'auth/configuration-not-found' ||
        error?.code === 'auth/invalid-api-key' ||
        !navigator.onLine
      ) {
        console.info('Switching to simulated Google Auth demo mode.');
        return simulateGoogleLogin();
      }
      throw err;
    }
  }

  // Fallback demo Google user when Firebase .env is not yet configured
  return simulateGoogleLogin();
}

/**
 * Simulated Google sign-in for seamless offline demo
 */
async function simulateGoogleLogin(): Promise<AuthUserData> {
  await new Promise((resolve) => setTimeout(resolve, 800)); // Smooth natural latency
  return {
    uid: `google-user-${Date.now().toString().slice(-6)}`,
    email: 'fadhil.mtq@gmail.com',
    displayName: 'Fadhil Al-Farabi (Google)',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    provider: 'google',
  };
}

/**
 * Email/Password Sign-In
 */
export async function signInWithEmailService(
  email: string,
  pass: string
): Promise<AuthUserData> {
  if (isFirebaseConfigured && auth) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      const user = result.user;
      return {
        uid: user.uid,
        email: user.email || email,
        displayName: user.displayName || email.split('@')[0],
        photoURL: user.photoURL || undefined,
        provider: 'password',
      };
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (
        error?.code === 'auth/api-key-not-valid' ||
        error?.code === 'auth/configuration-not-found'
      ) {
        return simulateEmailLogin(email);
      }
      throw err;
    }
  }
  return simulateEmailLogin(email);
}

/**
 * Email/Password Registration
 */
export async function signUpWithEmailService(
  email: string,
  pass: string,
  fullName: string
): Promise<AuthUserData> {
  if (isFirebaseConfigured && auth) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      const user = result.user;
      return {
        uid: user.uid,
        email: user.email || email,
        displayName: fullName || user.displayName || email.split('@')[0],
        photoURL: undefined,
        provider: 'password',
      };
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (
        error?.code === 'auth/api-key-not-valid' ||
        error?.code === 'auth/configuration-not-found'
      ) {
        return simulateEmailSignUp(email, fullName);
      }
      throw err;
    }
  }
  return simulateEmailSignUp(email, fullName);
}

async function simulateEmailLogin(email: string): Promise<AuthUserData> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    uid: `user-${Date.now().toString().slice(-6)}`,
    email,
    displayName: email.split('@')[0].replace(/[._]/g, ' '),
    provider: 'password',
  };
}

async function simulateEmailSignUp(email: string, fullName: string): Promise<AuthUserData> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return {
    uid: `user-${Date.now().toString().slice(-6)}`,
    email,
    displayName: fullName || email.split('@')[0],
    provider: 'password',
  };
}

/**
 * Sign out service
 */
export async function signOutService(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
  }
}
