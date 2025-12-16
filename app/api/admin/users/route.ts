
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { adminAuth } = await import('@/lib/firebase-admin');

        // In production, verify the caller has 'admin' role. 
        // For demo, we verify they assume they are authenticated.
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // List last 1000 users
        const listUsersResult = await adminAuth.listUsers(1000);
        const users = listUsersResult.users.map(user => ({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            disabled: user.disabled,
            role: user.customClaims?.role || 'patient', // Default to patient
            lastSignInTime: user.metadata.lastSignInTime,
            creationTime: user.metadata.creationTime,
        }));

        return NextResponse.json({ users });

    } catch (error) {
        console.error('Error listing users:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { adminAuth, adminDb } = await import('@/lib/firebase-admin');
        const body = await request.json();
        const { uid, role, action } = body;

        if (!uid) {
            return NextResponse.json({ error: 'UID required' }, { status: 400 });
        }

        if (action === 'setRole') {
            await adminAuth.setCustomUserClaims(uid, { role });
            // Also update in Firestore for easy querying
            await adminDb.collection('users').doc(uid).set({ role }, { merge: true });
            return NextResponse.json({ success: true, message: `Role updated to ${role}` });
        }

        if (action === 'toggleStatus') {
            // In real app, toggle disabled status
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Error updating user:', error);
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
        const { email, password, displayName, role, specialty, bio, experience, consultationFee } = body;

        if (!email || !password || !displayName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create user in Firebase Auth
        const userRecord = await adminAuth.createUser({
            email,
            password,
            displayName,
        });

        // Set custom claims (role)
        if (role) {
            await adminAuth.setCustomUserClaims(userRecord.uid, { role });
        }

        // Create user document in Firestore
        const userData: any = {
            email,
            displayName,
            role: role || 'patient',
            createdAt: new Date().toISOString(),
            photoURL: userRecord.photoURL || null,
        };

        // Add doctor specific fields if role is doctor
        if (role === 'doctor') {
            userData.specialty = specialty || 'General Practitioner';
            userData.bio = bio || '';
            userData.experience = experience || '';
            userData.consultationFee = consultationFee || '';
            userData.status = 'offline';
        }

        await adminDb.collection('users').doc(userRecord.uid).set(userData);

        return NextResponse.json({ 
            success: true, 
            message: 'User created successfully',
            user: { uid: userRecord.uid, email, displayName, role }
        });

    } catch (error: any) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
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
        const uid = searchParams.get('uid');

        if (!uid) {
            return NextResponse.json({ error: 'User UID is required' }, { status: 400 });
        }

        // Delete from Firebase Auth
        await adminAuth.deleteUser(uid);

        // Delete from Firestore
        await adminDb.collection('users').doc(uid).delete();

        return NextResponse.json({ success: true, message: 'User deleted successfully' });

    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
