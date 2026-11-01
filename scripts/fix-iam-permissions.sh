#!/usr/bin/env bash
# ==============================================================================
# IBRA PRODUCTION — GOOGLE CLOUD IAM & PERMISSION FIX SCRIPT
# Solves 403 PERMISSION_DENIED on roles/serviceusage.serviceUsageConsumer
# Project ID: ibra-production-web
# Project Number: 794299708186
# User Account: bahibarhouma15@gmail.com
# Admin Account: bahibarhouma56@gmail.com
# ==============================================================================

set -e

PROJECT_ID="ibra-production-web"
CLOUD_SHELL_USER="bahibarhouma15@gmail.com"
ADMIN_EMAIL="bahibarhouma56@gmail.com"

echo "=========================================="
echo " 1. Setting active gcloud project"
echo "=========================================="
gcloud config set project "$PROJECT_ID"

echo "=========================================="
echo " 2. Enabling required Google Cloud APIs"
echo "=========================================="
gcloud services enable \
  serviceusage.googleapis.com \
  iam.googleapis.com \
  firestore.googleapis.com \
  identitytoolkit.googleapis.com \
  cloudresourcemanager.googleapis.com \
  --project="$PROJECT_ID" || true

echo "=========================================="
echo " 3. Granting Service Usage Consumer Role"
echo "=========================================="
# This directly resolves the 'roles/serviceusage.serviceUsageConsumer' 403 error:
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="user:$CLOUD_SHELL_USER" \
  --role="roles/serviceusage.serviceUsageConsumer"

# Grant Firebase Admin / Editor to allow full management:
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="user:$CLOUD_SHELL_USER" \
  --role="roles/firebase.admin"

# Ensure the admin user also has full privileges:
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="user:$ADMIN_EMAIL" \
  --role="roles/firebase.admin"

echo "=========================================="
echo " 4. Applying Admin Claims via Node.js"
echo "=========================================="
if [ -f "./scripts/setup-admin-claims.js" ]; then
  npm install firebase-admin --no-audit --no-fund
  node ./scripts/setup-admin-claims.js
fi

echo "=========================================="
echo " All IAM and Admin Claims updated successfully!"
echo "=========================================="
