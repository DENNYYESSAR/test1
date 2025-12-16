import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery } from '@/lib/db-config';

export async function POST(request: NextRequest) {
  try {
    const { adminAuth, adminDb } = await import('@/lib/firebase-admin');

    // Get token from Authorization header
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

    const { symptoms, age, gender } = await request.json();

    if (!symptoms || !age || !gender) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize Google Gemini AI
    const { GoogleGenerativeAI } = await import('@google/generative-ai');

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is missing');
      return NextResponse.json(
        { error: 'AI Service configuration error' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert AI medical assistant. Analyze the following patient symptoms and provide a preliminary diagnosis.
      
      Patient Profile:
      - Age: ${age}
      - Gender: ${gender}
      - Symptoms: ${symptoms}
      
      Provide a JSON response with the following structure (do NOT use markdown code blocks, just raw JSON):
      {
        "condition": "Name of the condition",
        "confidence": 0-100 (number),
        "description": "Brief description of the condition",
        "recommendations": ["List of 3-4 actionable recommendations"],
        "severity": "Mild" | "Moderate" | "Severe" | "Critical",
        "nextSteps": "What the patient should do next",
        "specialists": ["List of 1-3 relevant medical specialists"]
      }
      
      Disclaimer: This is not a professional medical diagnosis.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

    let diagnosis;
    try {
      diagnosis = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse AI response:', text);
      // Fallback if AI fails
      diagnosis = {
        condition: 'Assessment Incomplete',
        confidence: 0,
        description: 'Unable to process symptoms securely at this time.',
        recommendations: ['Consult a doctor directly.'],
        severity: 'Unknown',
        nextSteps: 'Please visit a clinic.',
        specialists: ['General Practitioner']
      };
    }

    const { Timestamp } = await import('firebase-admin/firestore');

    const diagnosisData = {
      userId: uid,
      symptoms,
      age,
      gender,
      diagnosis_result: JSON.stringify(diagnosis), // Keep compat with frontend if it expects this
      condition_name: diagnosis.condition,
      confidence_score: diagnosis.confidence,
      severity: diagnosis.severity,
      // Also store structured data for easier firestore usage
      data: diagnosis,
      createdAt: Timestamp.now(),
      status: 'Reviewed'
    };

    // Save to Firestore: users/{uid}/diagnoses
    const docRef = await adminDb.collection('users').doc(uid).collection('diagnoses').add(diagnosisData);

    return NextResponse.json({
      success: true,
      diagnosis: {
        id: docRef.id,
        ...diagnosis,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error creating diagnosis:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { adminAuth, adminDb } = await import('@/lib/firebase-admin');

    // Get token from Authorization header or cookie
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

    // Query Firestore: users/{uid}/diagnoses
    const snapshot = await adminDb.collection('users').doc(uid).collection('diagnoses')
      .orderBy('createdAt', 'desc')
      .get();

    const diagnoses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // specific fields mapped if necessary, convert Timestamp to string
      created_at: doc.data().createdAt?.toDate().toISOString()
    }));

    return NextResponse.json({
      success: true,
      diagnoses
    });

  } catch (error) {
    console.error('Error fetching diagnoses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
