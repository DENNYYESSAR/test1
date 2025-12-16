import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { adminAuth, adminDb } = await import('@/lib/firebase-admin');
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    let uid;
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      uid = decoded.uid;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
    }

    const snapshot = await adminDb.collection('users').doc(uid).collection('medications')
      .orderBy('createdAt', 'desc')
      .get();

    const medications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Map for frontend compatibility
      next_refill: doc.data().nextRefill,
      created_at: doc.data().createdAt?.toDate().toISOString()
    }));

    return NextResponse.json({
      success: true,
      medications
    });

  } catch (error) {
    console.error('Error fetching medications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { adminAuth, adminDb } = await import('@/lib/firebase-admin');
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    let uid;
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      uid = decoded.uid;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      dosage,
      frequency,
      remaining,
      nextRefill,
      notes
    } = body;

    if (!name || !dosage || !frequency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newMedication = {
      name,
      dosage,
      frequency,
      remaining: remaining || 0,
      nextRefill: nextRefill || null,
      notes: notes || null,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: uid
    };

    const docRef = await adminDb.collection('users').doc(uid).collection('medications').add(newMedication);

    return NextResponse.json({
      success: true,
      medication: {
        id: docRef.id,
        ...newMedication,
        next_refill: newMedication.nextRefill
      }
    });

  } catch (error) {
    console.error('Error creating medication:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { adminAuth, adminDb } = await import('@/lib/firebase-admin');
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    let uid;
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      uid = decoded.uid;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const docRef = adminDb.collection('users').doc(uid).collection('medications').doc(id);

    // Check if doc exists? set({ ... }, { merge: true }) handles creation if not exists but we want PATCH logic
    // We can just use update.
    await docRef.update({
      ...updates,
      updatedAt: new Date()
    });

    const updatedDoc = await docRef.get();

    return NextResponse.json({
      success: true,
      medication: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        next_refill: updatedDoc.data()?.nextRefill
      }
    });

  } catch (error) {
    console.error('Error updating medication:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { adminAuth, adminDb } = await import('@/lib/firebase-admin');
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    let uid;
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      uid = decoded.uid;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await adminDb.collection('users').doc(uid).collection('medications').doc(id).delete();

    return NextResponse.json({
      success: true,
      message: 'Medication deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting medication:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
