#!/usr/bin/env node
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListResourcesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_SCOPES = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/presentations",
];
const CREDENTIALS_PATH = process.env.GDRIVE_CREDENTIALS_PATH || path.join(__dirname, "../../.credentials.json");
const OAUTH_KEY_PATH = process.env.GDRIVE_OAUTH_PATH || path.join(__dirname, "../../gcp-oauth.keys.json");
const SCOPES = (process.env.GDRIVE_SCOPES ? process.env.GDRIVE_SCOPES.split(/\s+/) : DEFAULT_SCOPES).filter(Boolean);
const drive = google.drive("v3");
async function doAuth() {
    console.log("Launching auth flow…");
    const auth = await authenticate({
        keyfilePath: OAUTH_KEY_PATH,
        scopes: SCOPES,
    });
    fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(auth.credentials));
    console.log(`Credentials saved at ${CREDENTIALS_PATH}. You can now run the server.`);
}
async function loadAuth() {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
        console.error("Credentials not found. Please run with 'auth' first.");
        process.exit(1);
    }
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
    const auth = new google.auth.OAuth2();
    auth.setCredentials(credentials);
    google.options({ auth });
}
const server = new Server({ name: "gdrive-write", version: "0.1.0" }, { capabilities: { resources: {}, tools: {} } });
server.setRequestHandler(ListResourcesRequestSchema, async (request) => {
    const res = await drive.files.list({
        pageSize: 10,
        fields: "nextPageToken, files(id, name, mimeType)",
        pageToken: request.params?.cursor,
    });
    return {
        resources: (res.data.files || []).map((f) => ({
            uri: `gdrive:///${f.id}`,
            mimeType: f.mimeType,
            name: f.name,
        })),
        nextCursor: res.data.nextPageToken,
    };
});
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const fileId = request.params.uri.replace("gdrive:///", "");
    const meta = await drive.files.get({ fileId, fields: "mimeType,name" });
    const mime = meta.data.mimeType || "application/octet-stream";
    if (mime.startsWith("application/vnd.google-apps")) {
        const exportMime = mime === "application/vnd.google-apps.document"
            ? "text/markdown"
            : mime === "application/vnd.google-apps.spreadsheet"
                ? "text/csv"
                : mime === "application/vnd.google-apps.presentation"
                    ? "text/plain"
                    : "text/plain";
        const res = await drive.files.export({ fileId, mimeType: exportMime }, { responseType: "text" });
        return { contents: [{ uri: request.params.uri, mimeType: exportMime, text: String(res.data) }] };
    }
    const res = await drive.files.get({ fileId, alt: "media" }, { responseType: "arraybuffer" });
    if (mime.startsWith("text/") || mime === "application/json") {
        return { contents: [{ uri: request.params.uri, mimeType: mime, text: Buffer.from(res.data).toString("utf-8") }] };
    }
    return { contents: [{ uri: request.params.uri, mimeType: mime, blob: Buffer.from(res.data).toString("base64") }] };
});
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "search",
                description: "Search for files in Google Drive",
                inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
            },
            {
                name: "create_file",
                description: "Create a new file (Docs/Sheets/Slides or binary)",
                inputSchema: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        mimeType: { type: "string" },
                        parents: { type: "array", items: { type: "string" } },
                        content: { type: "string", description: "Optional text content for non-Google types" },
                    },
                    required: ["name", "mimeType"],
                },
            },
            {
                name: "update_file",
                description: "Update file metadata or content by fileId",
                inputSchema: {
                    type: "object",
                    properties: {
                        fileId: { type: "string" },
                        name: { type: "string" },
                        content: { type: "string" },
                        mimeType: { type: "string" },
                    },
                    required: ["fileId"],
                },
            },
        ],
    };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    if (name === "search") {
        const q = args?.query || "";
        const res = await drive.files.list({
            q: q ? `fullText contains '${q.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'` : undefined,
            pageSize: 10,
            fields: "files(id,name,mimeType,modifiedTime,size)",
        });
        return { content: [{ type: "text", text: JSON.stringify(res.data.files || [], null, 2) }] };
    }
    if (name === "create_file") {
        const name = String(args?.name || "Untitled");
        const mimeType = String(args?.mimeType || "application/octet-stream");
        const parents = Array.isArray(args?.parents) ? args?.parents : undefined;
        // Google types just need metadata
        if (mimeType.startsWith("application/vnd.google-apps")) {
            const file = await drive.files.create({ requestBody: { name, mimeType, parents } });
            return { content: [{ type: "text", text: JSON.stringify(file.data, null, 2) }] };
        }
        // Regular files can include content
        const media = args?.content ? { body: args?.content } : undefined;
        const file = await drive.files.create({ requestBody: { name, mimeType, parents }, media });
        return { content: [{ type: "text", text: JSON.stringify(file.data, null, 2) }] };
    }
    if (name === "update_file") {
        const fileId = String(args?.fileId || "");
        const name = args?.name;
        const mimeType = args?.mimeType;
        const content = args?.content;
        const requestBody = {};
        if (name)
            requestBody.name = name;
        if (mimeType)
            requestBody.mimeType = mimeType;
        const media = content ? { body: content } : undefined;
        const updated = await drive.files.update({ fileId, requestBody, media });
        return { content: [{ type: "text", text: JSON.stringify(updated.data, null, 2) }] };
    }
    throw new Error("Tool not found");
});
async function main() {
    if (process.argv[2] === "auth") {
        await doAuth();
        return;
    }
    await loadAuth();
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
