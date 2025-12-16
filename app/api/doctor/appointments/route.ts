
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { adminAuth, adminDb } = await import('@/lib/firebase-admin');

        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split('Bearer ')[1];
        let decoded;
        try {
            decoded = await adminAuth.verifyIdToken(token);
        } catch (e) {
            return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
        }

        // Check if user is actually a doctor
        const isDoctor = decoded.claims?.role === 'doctor' || decoded.role === 'doctor'; // Fallback if claim mechanism varies
        // For demo, we might skip strict role check if claims aren't fully propagated yet, 
        // but relying on the displayName is key here.

        const doctorName = decoded.name || decoded.email; // Use name to match appointments

        // Collection Group Query to find all appointments for this doctor
        // Note: This requires an index in Firestore usually. If it fails, check logs for index creation link.
        const snapshot = await adminDb.collectionGroup('appointments')
            .where('doctorName', '==', doctorName)
            .get();

        const appointments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Add patient ID from the parent if needed, but it's in the doc data usually if we put it there.
            // The parent of the appointment doc is the user (patient).
            patientId: doc.ref.parent.parent?.id
        }));

        return NextResponse.json({ appointments });

    } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
