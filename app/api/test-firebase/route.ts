import { NextResponse } from 'next/server';
import { adminDb, adminAuth, initError } from '@/lib/firebase-admin';

export async function GET() {
    const debugInfo = {
        routeTriggered: true,
        envKeyPresent: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
        envKeyLength: process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.length,
        initError: initError ? { message: initError.message, stack: initError.stack } : null
    };

    const checks: { auth?: string; firestore?: string } = {};

    try {
        // 1. Test Auth
        try {
            if (initError) throw new Error('Skipping Auth check due to Init Error');
            const listUsersResult = await adminAuth.listUsers(1);
            checks.auth = `Success: Found ${listUsersResult.users.length} users`;
        } catch (e: any) {
            checks.auth = `Failed: ${e.message}`;
        }

        // 2. Test Firestore
        try {
            if (initError) throw new Error('Skipping Firestore check due to Init Error');
            const testDocRef = adminDb.collection('_system_checks').doc('connection_test');
            await testDocRef.set({
                connected: true,
                timestamp: new Date().toISOString(),
                checkedBy: 'AfyaLynx System'
            });
            checks.firestore = 'Success: Write successful';
        } catch (e: any) {
            checks.firestore = `Failed: ${e.message}`;
        }

        return NextResponse.json({
            success: !initError,
            message: initError ? 'Firebase Initialization Failed' : 'Firebase Connection Test Completed',
            checks,
            debugInfo,
            projectId: 'firebase-admin'
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                debugInfo,
                hint: 'Check debugInfo for details'
            },
            { status: 500 }
        );
    }
}
