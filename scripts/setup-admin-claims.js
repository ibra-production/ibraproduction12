/**
 * IBRA PRODUCTION — SECURE ADMIN CLAIMS SCRIPT
 * Project ID: ibra-production-web
 * Target Admin UID: v6CIpSmqqEWOFMvGu9ZxIapl4Ln1
 * Admin Email: bahibarhouma56@gmail.com
 *
 * This script safely retrieves existing custom claims and merges `admin: true`
 * without overwriting or deleting any existing user claims.
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin with application default credentials or service account
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'ibra-production-web'
  });
}

const TARGET_UID = 'v6CIpSmqqEWOFMvGu9ZxIapl4Ln1';
const EXPECTED_EMAIL = 'bahibarhouma56@gmail.com';

async function grantAdminClaims() {
  console.log(`[IBRA PRODUCTION] Starting Admin Claims Assignment...`);
  console.log(`Target UID: ${TARGET_UID}`);

  try {
    // 1. Fetch user to verify identity and inspect current claims
    const userRecord = await admin.auth().getUser(TARGET_UID);
    console.log(`User found: ${userRecord.email} (${userRecord.uid})`);

    if (userRecord.email && userRecord.email.toLowerCase() !== EXPECTED_EMAIL.toLowerCase()) {
      console.warn(`[WARNING] Target user email (${userRecord.email}) does not match expected (${EXPECTED_EMAIL}).`);
    }

    const existingClaims = userRecord.customClaims || {};
    console.log('Existing claims:', JSON.stringify(existingClaims));

    // 2. Merge admin: true while preserving all other claims
    const updatedClaims = {
      ...existingClaims,
      admin: true,
      role: 'superadmin',
      updatedAt: new Date().toISOString()
    };

    await admin.auth().setCustomUserClaims(TARGET_UID, updatedClaims);
    console.log(`Successfully assigned custom claims to UID ${TARGET_UID}:`, updatedClaims);

    // 3. Verification check
    const verifiedUser = await admin.auth().getUser(TARGET_UID);
    console.log(`[VERIFIED] User claims are now:`, verifiedUser.customClaims);

    // 4. Also record/update the admin document in Firestore for double verification
    const db = admin.firestore();
    await db.collection('clients').doc(TARGET_UID).set({
      uid: TARGET_UID,
      email: userRecord.email,
      role: 'admin',
      isAdmin: true,
      lastLogin: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log(`[SUCCESS] Firestore document in 'clients/${TARGET_UID}' updated with admin role.`);
    console.log('\nNOTE: The admin user must log out and log back in, or call getIdToken(true) to refresh their token.');
  } catch (error) {
    console.error('[ERROR] Failed to grant admin claims:', error);
    process.exit(1);
  }
}

grantAdminClaims();
