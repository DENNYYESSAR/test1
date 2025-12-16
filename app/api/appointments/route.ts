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

    const snapshot = await adminDb.collection('users').doc(uid).collection('appointments')
      .orderBy('appointmentDate', 'asc')
      .get();

    // Sort logic might need refining if time is separate, but order by date is a good start. 
    // If strict date+time sorting is needed, we'll need a combined timestamp field or do it in memory.
    // For now, let's keep it simple.

    const appointments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // frontend expects snake_case for some fields
      appointment_date: doc.data().appointmentDate,
      appointment_time: doc.data().appointmentTime,
      appointment_type: doc.data().appointmentType,
      doctor_name: doc.data().doctorName,
      clinic_name: doc.data().clinicName
    }));

    return NextResponse.json({
      success: true,
      appointments
    });

  } catch (error) {
    console.error('Error fetching appointments:', error);
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
      clinicId,
      doctorName,
      clinicName,
      specialty,
      appointmentDate,
      appointmentTime,
      appointmentType,
      notes
    } = body;

    if (!doctorName || !clinicName || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newAppointment = {
      clinicId: clinicId || null,
      doctorName,
      clinicName,
      specialty: specialty || null,
      appointmentDate,
      appointmentTime,
      appointmentType: appointmentType || 'Consultation',
      notes: notes || null,
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: uid
    };

    const docRef = await adminDb.collection('users').doc(uid).collection('appointments').add(newAppointment);

    return NextResponse.json({
      success: true,
      appointment: {
        id: docRef.id,
        ...newAppointment,
        appointment_date: newAppointment.appointmentDate,
        appointment_time: newAppointment.appointmentTime,
        appointment_type: newAppointment.appointmentType,
        doctor_name: newAppointment.doctorName,
        clinic_name: newAppointment.clinicName
      }
    });

  } catch (error) {
    console.error('Error creating appointment:', error);
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

    const docRef = adminDb.collection('users').doc(uid).collection('appointments').doc(id);
    await docRef.update({
      ...updates,
      updatedAt: new Date()
    });

    const updatedDoc = await docRef.get();

    return NextResponse.json({
      success: true,
      appointment: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        appointment_date: updatedDoc.data()?.appointmentDate,
        appointment_time: updatedDoc.data()?.appointmentTime,
        appointment_type: updatedDoc.data()?.appointmentType,
        doctor_name: updatedDoc.data()?.doctorName,
        clinic_name: updatedDoc.data()?.clinicName
      }
    });

  } catch (error) {
    console.error('Error updating appointment:', error);
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

    await adminDb.collection('users').doc(uid).collection('appointments').doc(id).delete();

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
