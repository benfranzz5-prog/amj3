# AMJ Produce CMS

Payload CMS v3 for the AMJ Produce website. Requires **Node.js 20+**.

## Setup

```bash
cd cms
npm install
```

Edit `.env` and set a strong `PAYLOAD_SECRET`.

## Running

```bash
npm run dev
```

Opens at **http://localhost:3000/admin**

## First-time setup

1. On first run, Payload will prompt you to create an admin user.
2. When creating your account, paste a **GitHub Personal Access Token** into the "GitHub Personal Access Token" field.  
   - Generate one at https://github.com/settings/tokens (no special scopes needed)
3. Every login re-validates the token live against GitHub — revoking the token immediately locks the CMS.

## Rebuilding the site

After editing content in the CMS, run:

```bash
npm run build:site
```

This reads `index.template.html` (the source), substitutes all `{{tokens}}` with live CMS data, and writes `index.html`.

> **Note:** `index.template.html` must be created first. Copy `index.html` and replace editable text with `{{tokens}}` from `src/scripts/build-site.ts`.

## Token reference

See `src/scripts/build-site.ts` for the full list of `{{tokens}}` and which CMS field each maps to.
