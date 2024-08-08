#!/bin/bash
set -e

# Fetch the Google Cloud credentials from Secret Manager
PROJECT_ID="nifty-yeti-429817-d1"
SECRET_ID="google-cloud-credentials"

# Use gcloud to access the secret and write to a file
gcloud secrets versions access latest --secret="${SECRET_ID}" > "${GOOGLE_APPLICATION_CREDENTIALS}"

# Execute the CMD
exec "$@"
