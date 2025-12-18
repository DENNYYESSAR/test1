'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

interface Diagnosis {
    condition: string;
    confidence: number;
    description: string;
    severity: string;
    recommendations: string[];
    specialists: string[];
    nextSteps: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function analyzeSymptoms(data: {
    symptoms: string;
    age: string;
    gender: string;
}): Promise<Diagnosis> {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured');
    }

    try {
        console.log('Starting AI Analysis...');
        // Using gemini-2.5-flash for advanced AI responses
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        console.log('Model initialized: gemini-1.5-flash-latest');

        const prompt = `
      Act as an advanced medical diagnostic AI. Application name is AfyaLynx.
      Analyze the following patient data:
      - Age: ${data.age}
      - Gender: ${data.gender}
      - Symptoms: ${data.symptoms}

      Provide a preliminary diagnosis in stric JSON format with the following structure:
      {
        "condition": "Name of the condition",
        "confidence": number (0-100),
        "description": "Brief description of the condition and why it matches the symptoms",
        "severity": "Mild" | "Moderate" | "Severe" | "Critical",
        "recommendations": ["Array of specific actionable advice"],
        "specialists": ["Array of recommended specialist types"],
        "nextSteps": "Clear instruction on what to do next"
      }

      IMPORTANT:
      - Return ONLY the JSON object, no markdown formatting like \`\`\`json.
      - Be conservative and safety-oriented.
      - If symptoms are vague, provide the most likely general condition but lower confidence.
      - If symptoms indicate an emergency (chest pain, stroke signs, etc.), mark severity as Critical and nextSteps as "Seek immediate emergency medical attention".
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Cleanup simple markdown if present
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const diagnosis: Diagnosis = JSON.parse(cleanJson);
        return diagnosis;

    } catch (error: any) {
        console.error('Diagnosis Error:', error);

        if (error.message?.includes('429') || error.message?.includes('Quota exceeded')) {
            console.error('Rate Limit hit');
            throw new Error('Free Tier Rate Limit Reached. Please wait 60 seconds and try again.');
        }

        if (error.message?.includes('404')) {
            console.error('Model Not Found');
            throw new Error(`AI Model not found. Please check your API key permissions.`);
        }

        throw new Error(`Analysis Failed: ${error.message}`);
    }
}
