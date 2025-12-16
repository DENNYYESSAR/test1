import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
    console.warn('Warning: FIREBASE_SERVICE_ACCOUNT_KEY is not set in environment variables.');
}

let serviceAccount;
try {
    if (serviceAccountKey) {
        serviceAccount = JSON.parse(serviceAccountKey);
    }
} catch (error) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error);
}

export let initError: any = null;

if (!getApps().length) {
    try {
        if (!serviceAccount || !serviceAccount.private_key || !serviceAccount.client_email) {
            throw new Error('Invalid or missing FIREBASE_SERVICE_ACCOUNT_KEY. Cannot initialize Firebase Admin.');
        }

        console.log('Initializing Firebase Admin with Service Account...');
        // Handle escaped newlines in private_key if present
        if (typeof serviceAccount.private_key === 'string') {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
        initializeApp({
            credential: cert(serviceAccount)
        });
        console.log('Firebase Admin Initialized Successfully');
    } catch (error) {
        console.error('Firebase Admin Initialization FAILED:', error);
        initError = error;
        // We catch here to prevent app crash on import, but logs will show it
    }
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
