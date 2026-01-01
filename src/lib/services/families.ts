// ═══════════════════════════════════════════════════════════════════════════════
// WIJA - Families Service
// Firestore CRUD operations for Family documents
// ═══════════════════════════════════════════════════════════════════════════════

import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Family, CreateFamilyInput, FamilyMember, MemberRole } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────────
// COLLECTION REFERENCES
// ─────────────────────────────────────────────────────────────────────────────────

const FAMILIES_COLLECTION = 'families';

export const familiesCollection = collection(db, FAMILIES_COLLECTION);

export const getFamilyRef = (familyId: string) =>
    doc(db, FAMILIES_COLLECTION, familyId);

export const getMembersCollection = (familyId: string) =>
    collection(db, FAMILIES_COLLECTION, familyId, 'members');

// ─────────────────────────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Create a new family
 */
export async function createFamily(
    input: CreateFamilyInput,
    userId: string
): Promise<Family> {
    const familyRef = doc(collection(db, FAMILIES_COLLECTION));
    const familyId = familyRef.id;

    // Generate slug from name
    const slug = input.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    // Create family data object without undefined values
    const familyData: Record<string, any> = {
        familyId,
        name: input.name,
        displayName: input.displayName || input.name,
        slug,
        ownerId: userId,
        subscription: {
            plan: 'free',
            status: 'active'
        },
        settings: {
            script: input.settings?.script || 'both',
            theme: input.settings?.theme || 'light',
            language: input.settings?.language || 'id'
        },
        stats: {
            memberCount: 1,
            personCount: 0,
            relationshipCount: 0
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };

    await setDoc(familyRef, familyData);

    // Return family object for TypeScript
    const family: Family = {
        ...familyData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    } as Family;

    // Add owner as first member
    const memberRef = doc(getMembersCollection(familyId), userId);
    const ownerMember: FamilyMember = {
        memberId: userId,
        userId,
        familyId,
        role: 'owner',
        displayName: '',
        email: '',
        joinedAt: serverTimestamp() as Timestamp,
        invitedBy: userId,
        lastActiveAt: serverTimestamp() as Timestamp
    };

    await setDoc(memberRef, ownerMember);

    return family;
}

// ─────────────────────────────────────────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Get a family by ID
 */
export async function getFamily(familyId: string): Promise<Family | null> {
    const docSnap = await getDoc(getFamilyRef(familyId));

    if (docSnap.exists()) {
        return docSnap.data() as Family;
    }

    return null;
}

/**
 * Get all families for a user
 */
export async function getUserFamilies(userId: string): Promise<Family[]> {
    // First get all family IDs where user is a member
    // This requires querying across subcollections which is complex
    // For now, we'll query families where user is owner
    const q = query(
        familiesCollection,
        where('ownerId', '==', userId),
        orderBy('updatedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Family);
}

/**
 * Get family members
 */
export async function getFamilyMembers(familyId: string): Promise<FamilyMember[]> {
    const membersRef = getMembersCollection(familyId);
    const snapshot = await getDocs(membersRef);
    return snapshot.docs.map(doc => doc.data() as FamilyMember);
}

/**
 * Get a specific member
 */
export async function getFamilyMember(
    familyId: string,
    userId: string
): Promise<FamilyMember | null> {
    const memberRef = doc(getMembersCollection(familyId), userId);
    const docSnap = await getDoc(memberRef);

    if (docSnap.exists()) {
        return docSnap.data() as FamilyMember;
    }

    return null;
}

// ─────────────────────────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Update a family
 */
export async function updateFamily(
    familyId: string,
    updates: Partial<Omit<Family, 'familyId' | 'createdAt'>>
): Promise<void> {
    const familyRef = getFamilyRef(familyId);

    await updateDoc(familyRef, {
        ...updates,
        updatedAt: serverTimestamp()
    });
}

/**
 * Update family settings
 */
export async function updateFamilySettings(
    familyId: string,
    settings: Partial<Family['settings']>
): Promise<void> {
    const family = await getFamily(familyId);
    if (!family) throw new Error('Family not found');

    await updateFamily(familyId, {
        settings: { ...family.settings, ...settings }
    });
}

/**
 * Set root ancestor
 */
export async function setRootAncestor(
    familyId: string,
    personId: string
): Promise<void> {
    await updateFamily(familyId, { rootAncestorId: personId });
}

/**
 * Update family stats
 */
export async function updateFamilyStats(
    familyId: string,
    stats: Partial<Family['stats']>
): Promise<void> {
    const family = await getFamily(familyId);
    if (!family) throw new Error('Family not found');

    await updateFamily(familyId, {
        stats: { ...family.stats, ...stats }
    });
}

/**
 * Update member role
 */
export async function updateMemberRole(
    familyId: string,
    userId: string,
    role: MemberRole
): Promise<void> {
    const memberRef = doc(getMembersCollection(familyId), userId);
    await updateDoc(memberRef, { role });
}

// ─────────────────────────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Delete a family (and all subcollections)
 */
export async function deleteFamily(familyId: string): Promise<void> {
    // Note: In production, this should be a Cloud Function
    // that recursively deletes all subcollections
    await deleteDoc(getFamilyRef(familyId));
}

/**
 * Remove a member from family
 */
export async function removeFamilyMember(
    familyId: string,
    userId: string
): Promise<void> {
    const memberRef = doc(getMembersCollection(familyId), userId);
    await deleteDoc(memberRef);

    // Update stats
    const family = await getFamily(familyId);
    if (family) {
        await updateFamilyStats(familyId, {
            memberCount: Math.max(0, family.stats.memberCount - 1)
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────────
// MEMBER MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Add a member to family
 */
export async function addFamilyMember(
    familyId: string,
    userId: string,
    role: MemberRole,
    invitedBy: string,
    displayName: string,
    email: string
): Promise<FamilyMember> {
    const memberRef = doc(getMembersCollection(familyId), userId);

    const member: FamilyMember = {
        memberId: userId,
        userId,
        familyId,
        role,
        displayName,
        email,
        joinedAt: serverTimestamp() as Timestamp,
        invitedBy,
        lastActiveAt: serverTimestamp() as Timestamp
    };

    await setDoc(memberRef, member);

    // Update stats
    const family = await getFamily(familyId);
    if (family) {
        await updateFamilyStats(familyId, {
            memberCount: family.stats.memberCount + 1
        });
    }

    return member;
}

/**
 * Check if user is member of family
 */
export async function isFamilyMember(
    familyId: string,
    userId: string
): Promise<boolean> {
    const member = await getFamilyMember(familyId, userId);
    return member !== null;
}

/**
 * Check if user can edit family
 */
export async function canEditFamily(
    familyId: string,
    userId: string
): Promise<boolean> {
    const member = await getFamilyMember(familyId, userId);
    if (!member) return false;
    return ['owner', 'admin', 'editor'].includes(member.role);
}

/**
 * Check if user is family owner or admin
 */
export async function isAdminOrOwner(
    familyId: string,
    userId: string
): Promise<boolean> {
    const member = await getFamilyMember(familyId, userId);
    if (!member) return false;
    return ['owner', 'admin'].includes(member.role);
}
