# Firestore security and client-linking

## Deployment status

The local `firestore.rules` source now matches the reviewed secure candidate in
`firestore.rules.proposed`. The emulator config and tests use the separate
proposed file. No rules were deployed and no production Auth claims were
changed; the live Firebase project continues using its previously deployed
rules until an owner explicitly approves deployment.

## Authorization changes

The previous `isAdmin()` returned true for every signed-in Firebase user. The
secure rules require the trusted Firebase custom claim `admin: true` for
administrative collections, including bookings and clients. Public booking
creation remains available only for new records with status `new` and an
allowlisted website booking schema. Public booking payloads cannot set
``clientId`, `clientCode`, or `barcode`, and cannot read or update bookings or
read/write client files. `bookingClientLinks` and `clientPhoneIndex` are private
admin-only idempotency/identity collections.

The website's public booking form now writes only the booking. It no longer
depends on permission to query or write `clients`, so a restricted client-file
operation cannot turn a successfully saved booking into a failed submission.
After a claimed administrator signs in, the website and Android app reconcile
unlinked bookings in Firestore transactions. They normalize phone formatting,
reuse an existing client document and its identifiers, and use a stable
SHA-256-derived client code for new records. A private per-booking link marker
prevents the same booking from incrementing the client project count twice.
`clientPhoneIndex/{stablePhoneIdentity}` is written in the same transaction as
the client and booking; concurrent writers therefore converge on one client
document for a normalized phone. Existing client document IDs and barcode
values are retained when a matching legacy profile is found. The index does
not merge pre-existing duplicate client profiles; those require a separate,
reviewed data cleanup.

## Provisioning the initial administrator

Cloud Functions and Firebase Extensions are not required. Get the UID directly
from Firebase Console → `ibra-production-web` → Authentication → Users. Confirm
that it belongs to the existing, email-verified `admin@ibraprod.online`
account. First run the script without applying changes:

```powershell
node scripts/provision-admin-claim.mjs <firebase-auth-uid>
```

The default is a dry run. The script verifies the UID against the fixed project
and refuses mismatched or unverified accounts. It creates no users and never
changes passwords. Only after explicit owner approval, apply the claim with:

```powershell
node scripts/provision-admin-claim.mjs <firebase-auth-uid> --apply
```

The script preserves that user's existing custom claims and uses local
Application Default Credentials. Do not place service-account keys in the
repository, website, or APK. Review the Firebase Auth user list separately to
confirm no other account has `admin: true`; this single-user script does not
revoke claims from other accounts. After the claim update, sign out and back in
on the website and Android app to obtain a refreshed ID token.

This uses Firebase Authentication, Firestore, and local Admin SDK credentials;
it does not deploy a paid server resource and is compatible with Spark subject
to the project's normal free quotas. The website and app must not be used for
admin operations until the claim is provisioned and the reviewed rules are
approved and deployed.

## Emulator checks

With the project's development dependencies installed, run:

```powershell
npm run test:client-identity
npm run test:firestore-rules
```

The second command starts only the Firestore Emulator under a `demo-*` project
ID and tests `firestore.rules.proposed`. The production `firebase.json` and
`firestore.rules` are not used by that test command.

## Required approval before production changes

Review the difference between `firestore.rules` and
`firestore.rules.proposed` before replacing/deploying production rules. Confirm
the owner UID and review all existing claims before running the script. Neither
action was performed as part of this change.
