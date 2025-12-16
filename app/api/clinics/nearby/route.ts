import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');

    // Fetch registered clinics from Firestore
    const clinicsSnapshot = await adminDb.collection('clinics').get();
    
    const clinics = clinicsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        specialty: data.specialty || 'General Practice',
        rating: data.rating || 'New',
        reviews: data.reviews || 0,
        distance: 'Registered', // We can calculate this if we have lat/lng
        address: data.address,
        phone: data.phone,
        hours: data.hours || '9:00 AM - 5:00 PM',
        insurance: data.insurance ? (Array.isArray(data.insurance) ? data.insurance : [data.insurance]) : ['All Accepted'],
        image: data.image || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop',
        services: data.services ? (Array.isArray(data.services) ? data.services : [data.services]) : ['General Consultation'],
        nextAvailable: 'Book Online',
        latitude: data.latitude,
        longitude: data.longitude,
        source: 'registered',
        website: data.website
      };
    });

    return NextResponse.json({
      success: true,
      clinics: clinics
    });

  } catch (error) {
    console.error('Error fetching registered clinics:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch clinics' }, { status: 500 });
  }
}
