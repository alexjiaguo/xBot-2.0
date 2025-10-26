#!/bin/zsh
set -euo pipefail

CREDENTIALS_PATH="/Users/alguo/Documents/Cursor/Placeholder/.secrets/gdrive-client-secret.json"

if [ ! -f "$CREDENTIALS_PATH" ]; then
  echo "Missing credentials at $CREDENTIALS_PATH" >&2
  echo "Download your Google OAuth client JSON (Desktop App) and save it there." >&2
  exit 1
fi

export GDRIVE_CREDENTIALS_PATH="$CREDENTIALS_PATH"
export GDRIVE_SCOPES="https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/presentations"

echo "Tip: For write access, run custom server auth:"
echo "node /Users/alguo/Documents/Cursor/Placeholder/servers/gdrive-write/dist/index.js auth"

echo "Starting Google Drive MCP server for auth..."
npx -y @modelcontextprotocol/server-gdrive auth

