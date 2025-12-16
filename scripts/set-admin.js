
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Load environment variables manually since we are not in Next.js environment
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    // special handling for FIREBASE_SERVICE_ACCOUNT_KEY which might be multi-line and quoted
    const match = envConfig.match(/FIREBASE_SERVICE_ACCOUNT_KEY\s*=\s*'([\s\S]*?)'/);
    if (match && match[1]) {
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY = match[1];
    } else {
        // Fallback or other keys
        envConfig.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                if (key === 'FIREBASE_SERVICE_ACCOUNT_KEY') return; // Already handled
                let value = parts.slice(1).join('=').trim();
                if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
                    value = value.slice(1, -1);
                }
                process.env[key] = value;
            }
        });
    }
}

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
    console.error('Error: FIREBASE_SERVICE_ACCOUNT_KEY not found in .env.local');
    process.exit(1);
}

// Parse the service account key if it's a string
let serviceAccount;
try {
    // If it's a base64 string, decode it (common for some setups, but here it seems to be JSON string)
    // We'll assume it's a JSON string based on previous context, but handle potential issues.
    // Actually, in .env it might be a stringified JSON.
    serviceAccount = JSON.parse(serviceAccountKey);
} catch (e) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', e);
    process.exit(1);
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();
const auth = admin.auth();

const email = process.argv[2];

if (!email) {
    console.error('Usage: node scripts/set-admin.js <email>');
    process.exit(1);
}

async function setAdminRole(email) {
    try {
        console.log(`Looking up user with email: ${email}...`);
        const user = await auth.getUserByEmail(email);

        console.log(`Found user ${user.uid}. Setting role to 'admin'...`);

        // Update user claims
        await auth.setCustomUserClaims(user.uid, { role: 'admin' });

        // Update Firestore document
        await db.collection('users').doc(user.uid).set({
            role: 'admin'
        }, { merge: true }); // Merge to avoid overwriting other fields

        console.log(`SUCCESS: User ${email} is now an ADMIN.`);
        console.log('They may need to sign out and sign back in for changes to take effect.');
        process.exit(0);
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            console.error(`Error: No user found with email ${email}. Please sign up first.`);
        } else {
            console.error('Error setting admin role:', error);
        }
        process.exit(1);
    }
}

setAdminRole(email);
