### Google Drive MCP setup for Cursor (project-level)

Follow these steps to enable Google Drive access inside Cursor via MCP for this project.

- **Prereqs**
  - Node.js 18+
  - Cursor 0.45+ with MCP enabled

- **Create Google OAuth client**
  1) Go to Google Cloud Console → create a project.
  2) Enable these APIs: "Google Drive API", "Google Docs API", "Google Sheets API", "Google Slides API".
  3) OAuth consent screen: configure as Internal (testing) and save.
  4) Credentials → Create Credentials → OAuth client ID → Application type: Desktop app.
  5) Download the JSON. Save it to:
     ` /Users/alguo/Documents/Cursor/Placeholder/.secrets/gdrive-client-secret.json `

- **Authenticate (first time)**
  - Run the helper script to start the server and complete OAuth:
    ` ./scripts/gdrive-mcp-auth.sh `
  - Browser will open; sign in and approve.

- **Cursor integration**
  - Project config file created at ` .cursor/mcp.json ` with the following server:
    - name: `gdrive`
    - command: `npx -y @modelcontextprotocol/server-gdrive`
    - env: `GDRIVE_CREDENTIALS_PATH` and `GDRIVE_SCOPES` (space-separated scopes)
      - Recommended full read/write scopes:
        - `https://www.googleapis.com/auth/drive`
        - `https://www.googleapis.com/auth/documents`
        - `https://www.googleapis.com/auth/spreadsheets`
        - `https://www.googleapis.com/auth/presentations`
  - Restart Cursor. In `Settings → Features → MCP`, ensure `gdrive` is enabled.

- **Use it**
  - In a new chat, you can now: list, search, open, create, and update files; create and edit Google Docs/Sheets/Slides.
  - The first request may prompt auth if not already completed.
  - If you previously authenticated with read-only scopes, re-run ` ./scripts/gdrive-mcp-auth.sh ` to re-consent with the expanded scopes.

- **Security**
  - Keep ` .secrets/gdrive-client-secret.json ` private. Do not commit it.

