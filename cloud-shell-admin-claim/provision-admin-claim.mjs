import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const projectId = "ibra-production-web";
const targetUid = "v6CIpSmqqEWOFMvGu9ZxIapl4Ln1";
const targetEmail = "bahibarhouma15@gmail.com";
const [mode, ...extraArgs] = process.argv.slice(2);

if (extraArgs.length > 0 || !["--dry-run", "--apply"].includes(mode)) {
  throw new Error(
    "Usage: node provision-admin-claim.mjs --dry-run | --apply"
  );
}

if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error(
    "For Cloud Shell ADC, unset GOOGLE_APPLICATION_CREDENTIALS; do not use a service-account key file."
  );
}

const app = initializeApp({
  credential: applicationDefault(),
  projectId,
});
const auth = getAuth(app);
const user = await auth.getUser(targetUid);

if (
  user.uid !== targetUid ||
  user.email?.trim().toLowerCase() !== targetEmail ||
  !user.emailVerified ||
  user.disabled
) {
  throw new Error(
    `Refusing to continue: expected enabled, email-verified UID ${targetUid} belonging to ${targetEmail}.`
  );
}

const otherAdminUids = [];
let pageToken;
do {
  const page = await auth.listUsers(1000, pageToken);
  otherAdminUids.push(
    ...page.users
      .filter(
        (listedUser) =>
          listedUser.uid !== targetUid &&
          listedUser.customClaims?.admin === true
      )
      .map((listedUser) => listedUser.uid)
  );
  pageToken = page.pageToken;
} while (pageToken);

console.log(`Project: ${projectId}`);
console.log(`Target UID: ${user.uid}`);
console.log(`Verified email: ${user.email}`);
console.log(`Account enabled: ${!user.disabled}`);
console.log(`Already has admin=true: ${user.customClaims?.admin === true}`);
console.log(`Other accounts with admin=true: ${otherAdminUids.length}`);

if (mode === "--dry-run") {
  console.log("Dry run complete. No data or custom claims were changed.");
  console.log(
    "Dry run confirmed Auth read/list access; it cannot verify claim-update permission without making a change."
  );
  if (otherAdminUids.length > 0) {
    console.log("Apply is blocked until other administrator claims are reviewed.");
  } else {
    console.log("To request the claim update, run this script with --apply.");
  }
} else if (otherAdminUids.length > 0) {
  throw new Error(
    `Refusing to apply: ${otherAdminUids.length} other account(s) already have admin=true. Review them manually first.`
  );
} else if (user.customClaims?.admin === true) {
  console.log("No change made; the target already has admin=true.");
} else {
  await auth.setCustomUserClaims(targetUid, {
    ...user.customClaims,
    admin: true,
  });

  const updatedUser = await auth.getUser(targetUid);
  if (updatedUser.customClaims?.admin !== true) {
    throw new Error(
      "The update request completed, but Firebase Auth did not return admin=true on verification. Check the user in Firebase Console before retrying."
    );
  }

  console.log(`Verified admin=true for ${targetUid} in ${projectId}.`);
  console.log("No account was created and no password was changed.");
  console.log("Sign out and sign in again to refresh the user's ID token.");
}
