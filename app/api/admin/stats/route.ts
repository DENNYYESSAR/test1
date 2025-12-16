
import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify token and check for admin role
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(token);

        if (decodedToken.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Parallel fetch for stats
        const [usersSnap, clinicsSnap, postsSnap, diagnosesSnap] = await Promise.all([
            adminDb.collection('users').get(),
            adminDb.collection('clinics').get(),
            adminDb.collection('posts').get(),
            adminDb.collectionGroup('diagnoses').get()
        ]);

        // Calculate breakdowns
        let totalUsers = usersSnap.size;
        let activeUsers = 0; // heuristic: last login within 30 days? Or just total for now.
        let doctors = 0;

        usersSnap.forEach(doc => {
            const data = doc.data();
            if (data.role === 'doctor') doctors++;
            activeUsers++; // all registered are "active" for now
        });

        const stats = {
            users: {
                total: totalUsers,
                active: activeUsers,
                doctors: doctors,
                patients: totalUsers - doctors
            },
            clinics: clinicsSnap.size,
            posts: postsSnap.size,
            diagnoses: diagnosesSnap.size,
            system: {
                status: 'Operational',
                uptime: '99.9%',
                version: '1.0.0'
            }
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
