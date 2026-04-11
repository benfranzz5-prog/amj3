# AMJ Produce — Project Structure

## Overview

Static website hosted on **Vercel** with a serverless API layer. Content is managed through a custom CMS at `/admin/` and persisted to GitHub via the GitHub Contents API. Vercel auto-deploys on every commit.

**Stack:** Vanilla HTML/CSS/JS · Vercel Serverless Functions (Node.js) · GitHub as CMS storage backend

---

## Directory Layout

```
amj-produce/
├── api/                        # Vercel serverless functions (Node.js)
│   ├── _auth.js                # HMAC auth helper — sign/verify session tokens
│   ├── admin-auth-check.js     # GET /api/admin-auth-check — validates session cookie
│   ├── admin-content.js        # GET /api/admin-content?section=X — reads JSON from GitHub
│   ├── admin-delete-photo.js   # POST /api/admin-delete-photo — deletes an image via GitHub API
│   ├── admin-login.js          # POST /api/admin-login — password auth → sets HttpOnly cookie
│   ├── admin-replace-image.js  # POST /api/admin-replace-image — base64 upload → GitHub
│   ├── admin-save.js           # POST /api/admin-save — writes section JSON to GitHub
│   └── admin-upload.js         # POST /api/admin-upload — gallery image upload
│
├── public/                     # Vercel output directory (all served files)
│   │
│   ├── _data/                  # CMS content store — flat JSON files, one per section
│   │   ├── about.json          # About section text
│   │   ├── commitment.json     # Customer commitment section
│   │   ├── contact.json        # Contact details (phone, email, address, persons)
│   │   ├── delivery.json       # Delivery section text + bullet points
│   │   ├── environment.json    # Environment/sustainability section + stats
│   │   ├── footer.json         # Footer text and company info
│   │   ├── fresho.json         # Fresho ordering section
│   │   ├── gallery.json        # Array of gallery image objects [{src}]
│   │   ├── hero.json           # Hero section (eyebrow, title, sub, CTAs)
│   │   ├── images.json         # Named image slots used across the site {slot: {src}}
│   │   ├── mission.json        # Mission & vision section
│   │   ├── nav.json            # Navigation link labels
│   │   ├── products.json       # Product array [{name, src, description, category, price}]
│   │   └── testimonials.json   # Testimonials array [{quote, author, stars}]
│   │
│   ├── images/
│   │   ├── gallery/            # Gallery photos uploaded via CMS
│   │   ├── managed/            # Legacy managed image uploads
│   │   └── products/           # Product images (150+ produce photos)
│   │
│   ├── js/
│   │   └── cms-loader.js       # Client-side data binding — loads all _data/*.json,
│   │                           # applies data-cms attributes, renders products/gallery/testimonials
│   │
│   ├── admin/
│   │   └── index.html          # CMS admin panel (single file, self-contained)
│   │                           # Dark UI · Inter font · AMJ green accent · Full CRUD
│   │
│   ├── index.html              # Public website (single page)
│   ├── login.html              # Market report login gate
│   ├── market-report.html      # Protected market report page
│   │
│   ├── favicon.png             # Site favicon
│   ├── logo-small.webp         # Nav bar logo
│   ├── freshologo.webp         # Fresho partner logo
│   ├── 1freshologo.webp        # Fresho logo variant
│   ├── spinach.webp            # Hero background image
│   ├── 1_scrub_kf.mp4          # Hero scroll-scrub video
│   └── delivery_scrub_keyframes.mp4  # Delivery section scroll-scrub video
│
├── vercel.json                 # Vercel config — output dir, API rewrites, security headers
├── .vercelignore               # Excludes node_modules/, cms/, .next/, .opencode/
├── .env.example                # Template for required environment variables
├── package.json                # Root package (minimal — dev tooling only)
└── PROJECT-STRUCTURE.md        # This file
```

---

## How the CMS Works

### Content Flow

```
Admin edits text/images in /admin/
    ↓
POST /api/admin-save (or /api/admin-replace-image)
    ↓
GitHub Contents API writes public/_data/*.json (or image file)
    ↓
Vercel detects commit → auto-deploy
    ↓
public/js/cms-loader.js reads _data/*.json on every page load
    ↓
data-cms attributes on DOM elements are populated
```

### Data Binding System

`cms-loader.js` loads all section JSON files in parallel on page load, prefixes their keys by section name (e.g. `hero.json → hero_eyebrow`, `about.json → about_heading`), then applies them to DOM elements:

| Attribute | Effect |
|-----------|--------|
| `data-cms="key"` | Sets `textContent` |
| `data-cms-html="key"` | Sets `innerHTML` |
| `data-cms-href="key"` | Sets `href` attribute |
| `data-cms-bg="key"` | Sets `backgroundImage` from `images.json` slot |
| `data-cms-src="key"` | Sets `src` from `images.json` slot |

### Authentication

CMS login posts to `/api/admin-login`. On success, an HMAC-signed session token is set as an HttpOnly cookie (`amj_sess`). All admin API routes validate this token via `_auth.js → verifyRequest()`.

### Environment Variables (required on Vercel)

```
ADMIN_PASSWORD      — CMS login password
HMAC_SECRET         — Secret for signing session tokens
GITHUB_TOKEN        — Personal access token with repo write access
GITHUB_REPO         — owner/repo (e.g. "benfranzz5-prog/amj-2")
GITHUB_BRANCH       — Target branch (e.g. "main")
```

---

## CMS Admin Panel Features

Accessible at `/admin/` (password protected).

| Section | What's editable |
|---------|----------------|
| Hero | Eyebrow tag, headline (2 lines), subheading, CTA button text + links |
| Navigation | All 7 nav link labels |
| About | Section label, heading, lead + 3 body paragraphs, 3 awards, 4 value pillars |
| Fresho | Section label, heading, body, button text + URL |
| Delivery | Section label, heading, lead paragraph, 5 bullet points |
| Mission | Mission heading, intro, 7 list items; vision heading, body, 8 guiding principles |
| Environment | Section label, heading, lead, 6 sustainability cards, 3 stats |
| Commitment | Heading, 2 paragraphs, 6 value tags |
| Contact | Section label, heading, subheading, phone, fax, email, address, persons, form note |
| Footer | Company name/subtitle, commitment paragraph, contact details, designer credit |
| Testimonials | Full CRUD — add/edit/delete testimonials with star rating |
| Products | Full CRUD — add/edit/delete products with name, image upload, category, price, description |
| Gallery | Drag-drop image upload, delete photos |
| Site Images | Named image slots (hero bg, delivery bg, etc.) — click to replace |

---

## Audit Summary (performed 2026-04-12)

### Files Deleted
- `public/.next/` — Next.js build artifact from abandoned Payload CMS attempt (~7MB)
- `public/delivery_scrub2_270.mp4`, `delivery_scrub2_480.mp4`, `delivery_scrub2_720.mp4` — unused video variants
- `public/delivery_scrub2.mp4`, `scrub.mp4`, `scrub2.mp4`, `scrub3.mp4` — unused/orphaned videos
- `public/kf.mp4`, `kf2.mp4` — unused keyframe videos
- `public/spinach_small.webp`, `margy.jpg` — unused images
- `public/template.html` — unused page template
- `tsconfig.json` — stray TypeScript config with no TypeScript in project

### Notes
- `cms/` directory (a Next.js/Payload CMS attempt) could not be fully deleted due to Windows file locks on `node_modules`. It is excluded from Vercel deploys via `.vercelignore`.
- All content sections are now fully wired to CMS data via `data-cms` attributes.
- Testimonials were previously hardcoded in HTML; they now render dynamically from `testimonials.json`.
