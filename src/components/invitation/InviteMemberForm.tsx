// ═══════════════════════════════════════════════════════════════════════════════
// WIJA - Invite Member Form
// Form for inviting new members to family
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { MemberRole } from '@/types';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { createInvitation, isEmailAlreadyInvited, CreateInvitationInput } from '@/lib/services/invitations';

export interface InviteMemberFormProps {
    isOpen: boolean;
    onClose: () => void;
    familyId: string;
    familyName: string;
    inviterId: string;
    inviterName: string;
    onSuccess?: () => void;
}

const ROLE_OPTIONS = [
    { value: 'viewer', label: '👁️ Viewer - Hanya bisa melihat' },
    { value: 'editor', label: '✏️ Editor - Bisa mengedit anggota' },
    { value: 'admin', label: '⚙️ Admin - Bisa mengelola pengaturan' }
];

export function InviteMemberForm({
    isOpen,
    onClose,
    familyId,
    familyName,
    inviterId,
    inviterName,
    onSuccess
}: InviteMemberFormProps) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<MemberRole>('viewer');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate email
        if (!email || !email.includes('@')) {
            setError('Masukkan alamat email yang valid');
            return;
        }

        setLoading(true);

        try {
            // Check if already invited
            const alreadyInvited = await isEmailAlreadyInvited(familyId, email);
            if (alreadyInvited) {
                setError('Email ini sudah memiliki undangan pending');
                setLoading(false);
                return;
            }

            // Create invitation
            await createInvitation({
                familyId,
                familyName,
                email,
                role,
                invitedBy: inviterId,
                invitedByName: inviterName
            });

            setSuccess(true);
            onSuccess?.();

            // Reset after delay
            setTimeout(() => {
                handleClose();
            }, 2000);

        } catch (err) {
            console.error('Failed to create invitation:', err);
            setError('Gagal mengirim undangan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEmail('');
        setRole('viewer');
        setError('');
        setSuccess(false);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="✉️ Undang Anggota Baru"
            size="md"
        >
            {!success ? (
                <form onSubmit={handleSubmit}>
                    <ModalBody className="space-y-6">
                        {/* Family Info */}
                        <div className="p-4 bg-teal-50 rounded-xl border border-teal-200">
                            <div className="text-sm text-teal-600">Mengundang ke</div>
                            <div className="font-medium text-teal-800">{familyName}</div>
                        </div>

                        {/* Email */}
                        <Input
                            label="Alamat Email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                            placeholder="contoh@email.com"
                            error={error}
                        />

                        {/* Role */}
                        <Select
                            label="Role"
                            value={role}
                            onChange={(e) => setRole(e.target.value as MemberRole)}
                            options={ROLE_OPTIONS}
                        />

                        {/* Role Description */}
                        <div className="text-sm text-stone-500 bg-stone-50 rounded-lg p-3">
                            {role === 'viewer' && (
                                <p>👁️ <strong>Viewer</strong> hanya dapat melihat pohon keluarga tanpa melakukan perubahan.</p>
                            )}
                            {role === 'editor' && (
                                <p>✏️ <strong>Editor</strong> dapat menambah, mengedit, dan menghapus anggota keluarga.</p>
                            )}
                            {role === 'admin' && (
                                <p>⚙️ <strong>Admin</strong> memiliki akses penuh termasuk mengelola pengaturan dan mengundang anggota baru.</p>
                            )}
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
                            Batal
                        </Button>
                        <Button type="submit" loading={loading} className="flex-1">
                            📧 Kirim Undangan
                        </Button>
                    </ModalFooter>
                </form>
            ) : (
                <ModalBody>
                    <div className="py-8 text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <h3 className="text-lg font-semibold text-stone-800 mb-2">Undangan Terkirim!</h3>
                        <p className="text-stone-600">
                            Email undangan telah dikirim ke <strong>{email}</strong>
                        </p>
                    </div>
                </ModalBody>
            )}
        </Modal>
    );
}

export default InviteMemberForm;
