// ═══════════════════════════════════════════════════════════════════════════════
// WIJA - Auth Context Provider
// React context for authentication state management
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail,
    logOut,
    resetPassword,
    subscribeToAuthState,
    updateUserProfile
} from '@/lib/firebase/auth';
import { UserProfile, MemberRole } from '@/types';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface AuthContextValue {
    // State
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    error: string | null;

    // Auth methods
    signIn: (email: string, password: string) => Promise<void>;
    signInGoogle: () => Promise<void>;
    signUp: (email: string, password: string, displayName: string) => Promise<void>;
    signOut: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    updateProfile: (updates: { displayName?: string; photoURL?: string }) => Promise<void>;

    // Helper methods
    isAuthenticated: boolean;
    hasRole: (familyId: string, roles: MemberRole[]) => Promise<boolean>;
    clearError: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─────────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────────

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch or create user profile
    const fetchUserProfile = useCallback(async (firebaseUser: User) => {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            setUserProfile(userSnap.data() as UserProfile);
        } else {
            // Create new user profile
            const newProfile: UserProfile = {
                userId: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || '',
                photoUrl: firebaseUser.photoURL || undefined,
                preferredScript: 'both',
                preferredTheme: 'light',
                preferredLanguage: 'id',
                familyIds: [],
                createdAt: serverTimestamp() as Timestamp,
                updatedAt: serverTimestamp() as Timestamp
            };

            await setDoc(userRef, newProfile);
            setUserProfile(newProfile);
        }
    }, []);

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = subscribeToAuthState(async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                try {
                    await fetchUserProfile(firebaseUser);
                } catch (err) {
                    console.error('Error fetching user profile:', err);
                }
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [fetchUserProfile]);

    // Auth methods
    const signIn = useCallback(async (email: string, password: string) => {
        try {
            setError(null);
            setLoading(true);
            await signInWithEmail(email, password);
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const signInGoogle = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const signUp = useCallback(async (email: string, password: string, displayName: string) => {
        try {
            setError(null);
            setLoading(true);
            await signUpWithEmail(email, password, displayName);
        } catch (err: any) {
            setError(err.message || 'Failed to sign up');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSignOut = useCallback(async () => {
        try {
            setError(null);
            await logOut();
            setUserProfile(null);
        } catch (err: any) {
            setError(err.message || 'Failed to sign out');
            throw err;
        }
    }, []);

    const forgotPassword = useCallback(async (email: string) => {
        try {
            setError(null);
            await resetPassword(email);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email');
            throw err;
        }
    }, []);

    const handleUpdateProfile = useCallback(async (updates: { displayName?: string; photoURL?: string }) => {
        try {
            setError(null);
            await updateUserProfile(updates);

            // Update user profile in Firestore
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                await setDoc(userRef, {
                    displayName: updates.displayName,
                    photoUrl: updates.photoURL,
                    updatedAt: serverTimestamp()
                }, { merge: true });

                // Refetch profile
                await fetchUserProfile(user);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
            throw err;
        }
    }, [user, fetchUserProfile]);

    const hasRole = useCallback(async (familyId: string, roles: MemberRole[]): Promise<boolean> => {
        if (!user) return false;

        try {
            const memberRef = doc(db, 'families', familyId, 'members', user.uid);
            const memberSnap = await getDoc(memberRef);

            if (!memberSnap.exists()) return false;

            const memberRole = memberSnap.data().role as MemberRole;
            return roles.includes(memberRole);
        } catch {
            return false;
        }
    }, [user]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value: AuthContextValue = {
        user,
        userProfile,
        loading,
        error,
        signIn,
        signInGoogle,
        signUp,
        signOut: handleSignOut,
        forgotPassword,
        updateProfile: handleUpdateProfile,
        isAuthenticated: user !== null,
        hasRole,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// ─────────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────────

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

export default AuthContext;
