// ═══════════════════════════════════════════════════════════════════════════════
// WIJA - Authentication Utilities
// Firebase Auth helper functions
// ═══════════════════════════════════════════════════════════════════════════════

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    sendEmailVerification,
    updatePassword,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    User,
    UserCredential
} from 'firebase/auth';
import { auth } from './config';

// ─────────────────────────────────────────────────────────────────────────────────
// AUTH PROVIDERS
// ─────────────────────────────────────────────────────────────────────────────────

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// ─────────────────────────────────────────────────────────────────────────────────
// SIGN IN
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
    email: string,
    password: string
): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<UserCredential> {
    return signInWithPopup(auth, googleProvider);
}

// ─────────────────────────────────────────────────────────────────────────────────
// SIGN UP
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
    email: string,
    password: string,
    displayName?: string
): Promise<UserCredential> {
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    // Update profile with display name if provided
    if (displayName && credential.user) {
        await updateProfile(credential.user, { displayName });
    }

    // Send email verification
    if (credential.user) {
        await sendEmailVerification(credential.user);
    }

    return credential;
}

// ─────────────────────────────────────────────────────────────────────────────────
// SIGN OUT
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Sign out current user
 */
export async function logOut(): Promise<void> {
    return signOut(auth);
}

// ─────────────────────────────────────────────────────────────────────────────────
// PASSWORD MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(auth, email);
}

/**
 * Update user password
 */
export async function changePassword(newPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    return updatePassword(user, newPassword);
}

// ─────────────────────────────────────────────────────────────────────────────────
// PROFILE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Update user profile
 */
export async function updateUserProfile(
    updates: { displayName?: string; photoURL?: string }
): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    return updateProfile(user, updates);
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
    return auth.currentUser;
}

/**
 * Subscribe to auth state changes
 */
export function subscribeToAuthState(
    callback: (user: User | null) => void
): () => void {
    return onAuthStateChanged(auth, callback);
}

// ─────────────────────────────────────────────────────────────────────────────────
// EMAIL VERIFICATION
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Resend email verification
 */
export async function resendVerificationEmail(): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    return sendEmailVerification(user);
}

/**
 * Check if email is verified
 */
export function isEmailVerified(): boolean {
    const user = auth.currentUser;
    return user?.emailVerified ?? false;
}

// ─────────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return auth.currentUser !== null;
}

/**
 * Get user ID
 */
export function getUserId(): string | null {
    return auth.currentUser?.uid ?? null;
}

/**
 * Get user email
 */
export function getUserEmail(): string | null {
    return auth.currentUser?.email ?? null;
}

/**
 * Get user display name
 */
export function getUserDisplayName(): string | null {
    return auth.currentUser?.displayName ?? null;
}

/**
 * Get user photo URL
 */
export function getUserPhotoURL(): string | null {
    return auth.currentUser?.photoURL ?? null;
}
