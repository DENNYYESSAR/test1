
import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

// Middleware-like auth check helper
async function checkAdminAuth(request: Request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        if (decodedToken.role !== 'admin') return null;
        return decodedToken;
    } catch (e) {
        return null;
    }
}

export async function GET(request: Request) {
    const auth = await checkAdminAuth(request);
    if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const reviewsSnapshot = await adminDb.collection('reviews')
            .orderBy('created_at', 'desc')
            .get();

        const reviews = reviewsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString()
            };
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching admin reviews:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const auth = await checkAdminAuth(request);
    if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
        }

        await adminDb.collection('reviews').doc(id).delete();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting review:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
