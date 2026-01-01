// ═══════════════════════════════════════════════════════════════════════════════
// WIJA - Invitation Service
// Handles family invitation system
// ═══════════════════════════════════════════════════════════════════════════════

import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Invitation, MemberRole, FamilyMember } from '@/types';

const INVITATIONS_COLLECTION = 'invitations';

// ─────────────────────────────────────────────────────────────────────────────────
// CREATE INVITATION
// ─────────────────────────────────────────────────────────────────────────────────

export interface CreateInvitationInput {
    familyId: string;
    familyName: string;
    email: string;
    role: MemberRole;
    invitedBy: string;
    invitedByName: string;
    expiresInDays?: number; // Default 7 days
}

export async function createInvitation(input: CreateInvitationInput): Promise<Invitation> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (input.expiresInDays || 7));

    const invitationData = {
        familyId: input.familyId,
        familyName: input.familyName,
        email: input.email.toLowerCase().trim(),
        role: input.role,
        invitedBy: input.invitedBy,
        invitedByName: input.invitedByName,
        status: 'pending' as const,
        expiresAt: Timestamp.fromDate(expiresAt),
        createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, INVITATIONS_COLLECTION), invitationData);

    return {
        invitationId: docRef.id,
        ...invitationData,
        createdAt: Timestamp.now()
    } as Invitation;
}

// ─────────────────────────────────────────────────────────────────────────────────
// GET INVITATION BY ID
// ─────────────────────────────────────────────────────────────────────────────────

export async function getInvitation(invitationId: string): Promise<Invitation | null> {
    const docSnap = await getDoc(doc(db, INVITATIONS_COLLECTION, invitationId));

    if (!docSnap.exists()) return null;

    return { invitationId, ...docSnap.data() } as Invitation;
}

// ─────────────────────────────────────────────────────────────────────────────────
// GET PENDING INVITATIONS FOR EMAIL
// ─────────────────────────────────────────────────────────────────────────────────

export async function getPendingInvitationsForEmail(email: string): Promise<Invitation[]> {
    const q = query(
        collection(db, INVITATIONS_COLLECTION),
        where('email', '==', email.toLowerCase().trim()),
        where('status', '==', 'pending')
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        invitationId: doc.id,
        ...doc.data()
    })) as Invitation[];
}

// ─────────────────────────────────────────────────────────────────────────────────
// GET INVITATIONS FOR FAMILY
// ─────────────────────────────────────────────────────────────────────────────────

export async function getInvitationsForFamily(familyId: string): Promise<Invitation[]> {
    const q = query(
        collection(db, INVITATIONS_COLLECTION),
        where('familyId', '==', familyId)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        invitationId: doc.id,
        ...doc.data()
    })) as Invitation[];
}

// ─────────────────────────────────────────────────────────────────────────────────
// ACCEPT INVITATION
// ─────────────────────────────────────────────────────────────────────────────────

export async function acceptInvitation(
    invitationId: string,
    userId: string,
    userDisplayName: string,
    userEmail: string,
    userPhotoUrl?: string
): Promise<void> {
    const invitation = await getInvitation(invitationId);

    if (!invitation) {
        throw new Error('Invitation not found');
    }

    if (invitation.status !== 'pending') {
        throw new Error('Invitation is no longer valid');
    }

    // Check if expired
    if (invitation.expiresAt.toDate() < new Date()) {
        await updateDoc(doc(db, INVITATIONS_COLLECTION, invitationId), {
            status: 'expired'
        });
        throw new Error('Invitation has expired');
    }

    // Add user as family member - build data without undefined fields
    const memberData: Record<string, any> = {
        userId,
        familyId: invitation.familyId,
        role: invitation.role,
        displayName: userDisplayName,
        email: userEmail,
        joinedAt: serverTimestamp(),
        invitedBy: invitation.invitedBy,
        lastActiveAt: serverTimestamp()
    };

    // Only add photoUrl if provided
    if (userPhotoUrl) {
        memberData.photoUrl = userPhotoUrl;
    }

    await addDoc(
        collection(db, `families/${invitation.familyId}/members`),
        memberData
    );

    // Update invitation status
    await updateDoc(doc(db, INVITATIONS_COLLECTION, invitationId), {
        status: 'accepted',
        respondedAt: serverTimestamp()
    });
}

// ─────────────────────────────────────────────────────────────────────────────────
// DECLINE INVITATION
// ─────────────────────────────────────────────────────────────────────────────────

export async function declineInvitation(invitationId: string): Promise<void> {
    await updateDoc(doc(db, INVITATIONS_COLLECTION, invitationId), {
        status: 'declined',
        respondedAt: serverTimestamp()
    });
}

// ─────────────────────────────────────────────────────────────────────────────────
// REVOKE/DELETE INVITATION
// ─────────────────────────────────────────────────────────────────────────────────

export async function revokeInvitation(invitationId: string): Promise<void> {
    await deleteDoc(doc(db, INVITATIONS_COLLECTION, invitationId));
}

// ─────────────────────────────────────────────────────────────────────────────────
// RESEND INVITATION (update expiry)
// ─────────────────────────────────────────────────────────────────────────────────

export async function resendInvitation(invitationId: string): Promise<void> {
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7);

    await updateDoc(doc(db, INVITATIONS_COLLECTION, invitationId), {
        status: 'pending',
        expiresAt: Timestamp.fromDate(newExpiresAt)
    });
}

// ─────────────────────────────────────────────────────────────────────────────────
// CHECK IF EMAIL ALREADY INVITED
// ─────────────────────────────────────────────────────────────────────────────────

export async function isEmailAlreadyInvited(familyId: string, email: string): Promise<boolean> {
    const q = query(
        collection(db, INVITATIONS_COLLECTION),
        where('familyId', '==', familyId),
        where('email', '==', email.toLowerCase().trim()),
        where('status', '==', 'pending')
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
}

export default {
    createInvitation,
    getInvitation,
    getPendingInvitationsForEmail,
    getInvitationsForFamily,
    acceptInvitation,
    declineInvitation,
    revokeInvitation,
    resendInvitation,
    isEmailAlreadyInvited
};
