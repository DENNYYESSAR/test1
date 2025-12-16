
import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

// Helper to verify admin
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
    const snapshot = await adminDb.collection('clinics').get();
    const clinics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ clinics });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch clinics' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!await verifyAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const docRef = await adminDb.collection('clinics').add({
      ...data,
      createdAt: new Date().toISOString()
    });
    return NextResponse.json({ success: true, id: docRef.id });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create clinic' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!await verifyAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'Missing clinic ID' }, { status: 400 });

    await adminDb.collection('clinics').doc(id).update(data);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update clinic' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!await verifyAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await adminDb.collection('clinics').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete clinic' }, { status: 500 });
  }
}
