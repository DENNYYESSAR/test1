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

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : null;

    let query = adminDb.collection('users').doc(uid).collection('health_records')
      .orderBy('recordedAt', 'desc');

    if (limit) {
      query = query.limit(limit);
    }

    const snapshot = await query.get();
    const healthRecords = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      recorded_at: doc.data().recordedAt, // Map for frontend compatibility
      created_at: doc.data().createdAt?.toDate().toISOString(),
      // database uses snake_case in UI, let's map keys if needed or ensure UI uses camelCase
      // The current UI expects snake_case for some fields based on my reading of dashboard/page.tsx
      heart_rate: doc.data().heartRate,
      blood_pressure_systolic: doc.data().bloodPressureSystolic,
      blood_pressure_diastolic: doc.data().bloodPressureDiastolic,
      blood_sugar: doc.data().bloodSugar
    }));

    return NextResponse.json({
      success: true,
      healthRecords
    });

  } catch (error) {
    console.error('Error fetching health records:', error);
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
      heartRate,
      bloodPressureSystolic,
      bloodPressureDiastolic,
      weight,
      temperature,
      bloodSugar,
      notes,
      recordedAt
    } = body;

    if (!heartRate && !bloodPressureSystolic && !weight && !temperature && !bloodSugar) {
      return NextResponse.json(
        { error: 'At least one health metric is required' },
        { status: 400 }
      );
    }

    const newRecord = {
      heartRate: heartRate || null,
      bloodPressureSystolic: bloodPressureSystolic || null,
      bloodPressureDiastolic: bloodPressureDiastolic || null,
      weight: weight || null,
      temperature: temperature || null,
      bloodSugar: bloodSugar || null,
      notes: notes || null,
      recordedAt: recordedAt || new Date().toISOString(),
      createdAt: new Date(),
      userId: uid
    };

    const docRef = await adminDb.collection('users').doc(uid).collection('health_records').add(newRecord);

    return NextResponse.json({
      success: true,
      healthRecord: {
        id: docRef.id,
        ...newRecord,
        // Map for frontend compatibility
        recorded_at: newRecord.recordedAt,
        heart_rate: newRecord.heartRate,
        blood_pressure_systolic: newRecord.bloodPressureSystolic,
        blood_pressure_diastolic: newRecord.bloodPressureDiastolic,
        blood_sugar: newRecord.bloodSugar
      }
    });

  } catch (error) {
    console.error('Error creating health record:', error);
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

    // Verify ownership/existence before delete?
    // Firestore security rules handle client access, but here we are admin.
    // We strictly delete from users/{uid}/health_records/{id} so it is safe.
    await adminDb.collection('users').doc(uid).collection('health_records').doc(id).delete();

    return NextResponse.json({
      success: true,
      message: 'Health record deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting health record:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
