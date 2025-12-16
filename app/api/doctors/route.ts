
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { adminAuth, adminDb } = await import('@/lib/firebase-admin');

        // Check auth
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Query Firestore for users with role 'doctor'
        // Note: We sync role to Firestore in the Admin API, so we can query it easily here.
        const snapshot = await adminDb.collection('users').where('role', '==', 'doctor').get();

        const doctors = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().displayName || doc.data().name || 'Unknown Doctor',
            email: doc.data().email,
            specialty: doc.data().specialty || 'General Practitioner',
            photoURL: doc.data().photoURL,
            status: doc.data().status || 'offline',
        }));

        return NextResponse.json({ doctors });

    } catch (error) {
        console.error('Error fetching doctors:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { adminAuth, adminDb } = await import('@/lib/firebase-admin');

        // Check auth
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, specialty, bio, experience, availability, consultationFee } = body;

        if (!id) {
            return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
        }

        // Update doctor details in Firestore
        await adminDb.collection('users').doc(id).set({
            specialty,
            bio,
            experience,
            availability,
            consultationFee,
            updatedAt: new Date().toISOString()
        }, { merge: true });

        return NextResponse.json({ success: true, message: 'Doctor profile updated successfully' });

    } catch (error) {
        console.error('Error updating doctor:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { adminAuth, adminDb } = await import('@/lib/firebase-admin');

        // Check auth
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
        }

        // Delete from Firebase Auth
        await adminAuth.deleteUser(id);

        // Delete from Firestore
        await adminDb.collection('users').doc(id).delete();

        return NextResponse.json({ success: true, message: 'Doctor deleted successfully' });

    } catch (error) {
        console.error('Error deleting doctor:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
