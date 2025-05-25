
// src/hooks/useAuth.tsx
"use client";

import type { User as FirebaseUser, AuthError } from 'firebase/auth';
import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode,
  useCallback
} from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import type { LoginFormData, SignupFormData } from '@/lib/types'; // We'll define these types

interface AuthContextType {
  user: FirebaseUser | null;
  isLoading: boolean;
  error: AuthError | null;
  signUp: (data: SignupFormData) => Promise<FirebaseUser | null>;
  login: (data: LoginFormData) => Promise<FirebaseUser | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
      setError(null);
    });
    return () => unsubscribe();
  }, []);

  const signUp = useCallback(async (data: SignupFormData): Promise<FirebaseUser | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      setUser(userCredential.user);
      setIsLoading(false);
      return userCredential.user;
    } catch (e) {
      setError(e as AuthError);
      setIsLoading(false);
      console.error("Sign up error:", e);
      return null;
    }
  }, []);

  const login = useCallback(async (data: LoginFormData): Promise<FirebaseUser | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      setUser(userCredential.user);
      setIsLoading(false);
      return userCredential.user;
    } catch (e) {
      setError(e as AuthError);
      setIsLoading(false);
      console.error("Login error:", e);
      return null;
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (e) {
      setError(e as AuthError);
      console.error("Sign out error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, signUp, login, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
