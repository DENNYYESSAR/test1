'use server';

// import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function saveDiagnosis(diagnosis: any, idToken: string) {
    if (!idToken) {
        throw new Error('User must be logged in to save diagnosis');
    }

    try {
        // Verify the ID token
        const { adminAuth, adminDb } = await import('@/lib/firebase-admin');
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // Save to Firestore: users/{uid}/diagnoses
        // We can also save to a top-level collection if we want querying across users, 
        // but subcollection is good for isolation.
        const { Timestamp } = await import('firebase-admin/firestore');

        const diagnosisData = {
            ...diagnosis,
            userId: uid,
            createdAt: Timestamp.now(),
            status: 'Reviewed'
        };

        // Add to subcollection
        await adminDb.collection('users').doc(uid).collection('diagnoses').add(diagnosisData);

        return { success: true };

    } catch (error: any) {
        console.error('Error saving diagnosis:', error);
        throw new Error(`Failed to save diagnosis: ${error.message}`);
    }
}
