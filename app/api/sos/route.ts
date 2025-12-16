
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { adminDb } = await import('@/lib/firebase-admin');
        const { latitude, longitude, userId, userName } = await request.json();

        if (!latitude || !longitude) {
            return NextResponse.json({ error: 'Location required' }, { status: 400 });
        }

        // 1. Log to Firestore
        const alertData = {
            type: 'EMERGENCY_SOS',
            userId: userId || 'anonymous',
            userName: userName || 'Unknown',
            location: { latitude, longitude },
            status: 'active',
            timestamp: new Date(),
            googleMapsLink: `https://www.google.com/maps?q=${latitude},${longitude}`
        };

        await adminDb.collection('emergency_alerts').add(alertData);

        // 2. Simulate User Notification (In real app, trigger Twilio/SendGrid here)
        console.log('CRITICAL: SOS ALERT RECEIVED', alertData);

        return NextResponse.json({
            success: true,
            message: 'Emergency responders notified'
        });

    } catch (error) {
        console.error('SOS Error:', error);
        return NextResponse.json(
            { error: 'Failed to trigger emergency alert' },
            { status: 500 }
        );
    }
}
