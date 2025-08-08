"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'customer' | 'admin' | 'super_admin';
  phone?: string;
  avatar_url?: string;
  date_of_birth?: string;
  sport_interests?: string[];
  fitness_goals?: string[];
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string, userData: {
    first_name: string;
    last_name: string;
    phone?: string;
  }) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'profiles', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({ id: firebaseUser.uid, ...userDoc.data() } as UserProfile);
          } else {
            // Create default profile if it doesn't exist
            const defaultProfile: UserProfile = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              first_name: firebaseUser.displayName?.split(' ')[0] || '',
              last_name: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
              role: 'customer',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            await setDoc(doc(db, 'profiles', firebaseUser.uid), defaultProfile);
            setUser(defaultProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, userData: {
    first_name: string;
    last_name: string;
    phone?: string;
  }) => {
    try {
      console.log('Attempting to create user with email:', email);

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      // Validate password length
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      console.log('Creating user in Firebase Auth...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created successfully:', userCredential.user.uid);

      console.log('Updating Firebase Auth display name...');
      // Update Firebase Auth display name
      await updateProfile(userCredential.user, {
        displayName: `${userData.first_name} ${userData.last_name}`
      });
      console.log('Display name updated successfully');

      console.log('Creating user profile in Firestore...');
      // Create user profile in Firestore
      const profile = {
        id: userCredential.user.uid,
        email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone || null,
        role: 'customer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('Profile data to save:', profile);
      await setDoc(doc(db, 'profiles', userCredential.user.uid), profile);
      console.log('User profile created in Firestore successfully');

      return userCredential;
    } catch (error: any) {
      console.error('Signup error details:', {
        code: error.code,
        message: error.message,
        email: email,
        passwordLength: password.length,
        stack: error.stack
      });

      // Provide more specific error messages
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please use a different email or try logging in.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email format. Please enter a valid email address.');
      } else {
        throw new Error(`Signup failed: ${error.message}`);
      }
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    const updatedProfile = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    await updateDoc(doc(db, 'profiles', user.id), updatedProfile);
    setUser({ ...user, ...updatedProfile });
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};