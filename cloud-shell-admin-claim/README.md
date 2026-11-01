# Cloud Shell administrator claim utility

This standalone tool uses Firebase Admin SDK 14.4.0 with Application Default
Credentials (ADC). It targets only the existing project, UID, and email
configured in `provision-admin-claim.mjs`. It does not create accounts, change
passwords, access Firestore, or deploy rules.

Use a Cloud Shell identity that has Firebase Authentication user list/read
permissions. Applying a claim also requires permission to update Firebase Auth
users. The dry run verifies read/list access and the target account, but cannot
prove update permission without changing a claim.

Upload this folder's files to Cloud Shell, then run:

```sh
node --version
npm install
gcloud auth list --filter=status:ACTIVE --format='value(account)'
node provision-admin-claim.mjs --dry-run
```

Use Node.js 22 or later. Cloud Shell supplies ADC from the signed-in Cloud
Shell identity; `gcloud auth application-default login` is not used in Cloud
Shell. If the active identity is wrong, sign in to Cloud Shell with the
intended Google account before continuing.

Confirm the active Cloud Shell identity is the intended operator and that the
dry run reports the expected project, UID, verified email, and no other admin
accounts. Stop here until the project owner explicitly approves changing the
claim. Only after approval, run:

```sh
node provision-admin-claim.mjs --apply
```

The apply mode refuses a mismatched, unverified, or disabled target account and
refuses to proceed if another account already has `admin=true`. It verifies
the claim by reading the user again after the update. Then sign out and back in
to refresh the user's ID token. Do not upload or configure a service-account
private key; the script rejects `GOOGLE_APPLICATION_CREDENTIALS` and uses
Cloud Shell ADC.
