
'use client';

import { useParams } from 'next/navigation';
import VideoCall from '@/components/VideoCall';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

export default function ConsultationPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const [role, setRole] = useState<'create' | 'join'>('join'); // Default to joiner

    useEffect(() => {
        // Naive logic: if ID starts with user ID, they are the creator (Doctor or Patient initiator)
        if (user && id && (id as string).startsWith(user.uid)) {
            setRole('create'); // I am the host
        } else {
            setRole('join'); // I am the guest
        }
    }, [user, id]);

    if (!user || !id) return <div className="text-white text-center pt-20">Loading room...</div>;

    return (
        <div className="h-screen bg-gray-900 flex flex-col p-4">
            <div className="flex-1 max-w-6xl mx-auto w-full">
                <VideoCall callId={id as string} mode={role} />
            </div>
        </div>
    );
}
