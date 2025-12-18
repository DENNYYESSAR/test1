
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET() {
    try {
        const reviewsSnapshot = await adminDb.collection('reviews')
            .orderBy('created_at', 'desc')
            .limit(50)
            .get();

        const reviews = reviewsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Convert Firestore timestamp to ISO string for frontend
                created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString()
            };
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, comment, rating = 5, role = 'User', designation = '' } = body;

        if (!name || !comment) {
            return NextResponse.json({ error: 'Name and comment are required' }, { status: 400 });
        }

        const newReview = {
            name,
            designation,
            role,
            rating,
            comment,
            is_verified: false,
            created_at: FieldValue.serverTimestamp()
        };

        const docRef = await adminDb.collection('reviews').add(newReview);

        // Fetch it back to return the exact data
        const docSnap = await docRef.get();
        const data = docSnap.data();

        return NextResponse.json({
            id: docRef.id,
            ...data,
            created_at: new Date().toISOString() // Approximate for immediate return
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
