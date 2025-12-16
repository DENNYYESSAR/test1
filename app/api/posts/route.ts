
import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

async function verifyAdmin(request: Request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.split('Bearer ')[1];
    try {
        const decoded = await adminAuth.verifyIdToken(token);
        if (decoded.role === 'admin') return decoded;
    } catch (e) {
        return null;
    }
    return null;
}

export async function GET(request: Request) {
    try {
        const snapshot = await adminDb.collection('posts').orderBy('publishDate', 'desc').get();
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json({ posts });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!await verifyAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const data = await request.json();
        const docRef = await adminDb.collection('posts').add({
            ...data,
            createdAt: new Date().toISOString()
        });
        return NextResponse.json({ success: true, id: docRef.id });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    if (!await verifyAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { id, ...data } = body;
        if (!id) return NextResponse.json({ error: 'Missing post ID' }, { status: 400 });

        await adminDb.collection('posts').doc(id).update(data);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!await verifyAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        await adminDb.collection('posts').doc(id).delete();
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
