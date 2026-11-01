import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const projectId = "ibra-production-web";
const requiredAdminEmail = "admin@ibraprod.online";
const args = process.argv.slice(2);
const [uidArgument, mode] = args;
const uid = uidArgument?.trim();

if (!uid || args.length > 2) {
  throw new Error(
    "Usage: node scripts/provision-admin-claim.mjs <verified-auth-uid> [--apply]"
  );
}
if (mode && mode !== "--apply") {
  throw new Error("The only supported optional argument is --apply.");
}

const app = initializeApp({
  credential: applicationDefault(),
  projectId,
});
const auth = getAuth(app);
const user = await auth.getUser(uid);

if (
  user.email?.trim().toLowerCase() !== requiredAdminEmail ||
  !user.emailVerified
) {
  throw new Error(
    `Refusing to grant admin claim: UID must belong to verified ${requiredAdminEmail}.`
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
          listedUser.uid !== uid && listedUser.customClaims?.admin === true
      )
      .map((listedUser) => listedUser.uid)
  );
  pageToken = page.pageToken;
} while (pageToken);

if (mode !== "--apply") {
  console.log("Dry run only. No account or custom claims were changed.");
  console.log(`Project: ${projectId}`);
  console.log(`Verified administrator UID: ${user.uid}`);
  console.log(`Verified administrator email: ${user.email}`);
  console.log(`Already has admin claim: ${user.customClaims?.admin === true}`);
  console.log(`Other accounts with admin=true: ${otherAdminUids.length}`);
  console.log("Re-run with the same UID and --apply only after owner approval.");
} else if (otherAdminUids.length > 0) {
  throw new Error(
    `Refusing to apply admin claim: ${otherAdminUids.length} other account(s) already have admin=true. Review them manually first.`
  );
} else if (user.customClaims?.admin === true) {
  console.log("The verified administrator already has admin=true; no change made.");
} else {
  await auth.setCustomUserClaims(uid, {
    ...user.customClaims,
    admin: true,
  });

  console.log(`Granted admin=true to the verified administrator UID in ${projectId}.`);
  console.log("No account was created and no password was changed.");
  console.log("The administrator must sign out and sign in again to refresh the ID token.");
}
