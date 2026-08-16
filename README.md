# Weather by Abbas

A professional, independent weather forecast website for Jammu & Kashmir —
built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma, and
NextAuth. Forecasts are fully database-driven, so you publish new content
from the admin dashboard without ever touching code.

---

## 1. How to start the website

**Requirements:** Node.js 18.18+, npm, and a PostgreSQL database (a free
[Neon](https://neon.tech) or [Supabase](https://supabase.com) project works
fine for local development too — you don't need Postgres installed locally).

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment file and edit it (see section 7 below)
cp .env.example .env
# → at minimum, set DATABASE_URL to a real Postgres connection string

# 3. Create the database tables
npx prisma migrate dev --name init

# 4. Seed the database (creates your admin login + sample forecasts)
npm run seed

# 5. Start the dev server
npm run dev
```

Visit **http://localhost:3000** — you'll see the homepage with the sample
forecasts already published.

For production:

```bash
npm run build
npm start
```

> **Note on this delivery:** the code in this ZIP was inspected and
> reviewed file-by-file, including a full TypeScript type-check pass. The
> sandbox this was prepared in blocks the domain Prisma uses to download
> its query-engine binary (`binaries.prisma.sh`), so a complete
> `npx prisma generate && npm run build` could not be executed end-to-end
> here — this is a restriction of the review sandbox, not of your machine
> or hosting platform. Run the three commands below yourself once (they
> need normal internet access) to get the final build confirmation:
> ```bash
> npm install
> npx prisma generate
> npm run build
> ```
> If anything does fail, paste me the exact error and I'll fix it.

---

## 2. How to log into the admin dashboard

Go to **`/admin/login`** (e.g. `http://localhost:3000/admin/login`).

Use the email/password you set in `.env` as `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` (these are turned into your real admin account the
first time you run `npm run seed`).

**Change your password afterwards** by editing the `Admin` row directly
(via `npx prisma studio`) with a freshly bcrypt-hashed password, or by
building a "change password" screen later — the seed script only runs once
per email (it won't overwrite an existing admin).

---

## 3. How to create a forecast

1. Log into `/admin/dashboard`.
2. Click **"+ New Forecast"**.
3. Fill in:
   - **Title** — e.g. "Jammu & Kashmir Weather Forecast — 14 August 2026"
   - **URL slug** — leave blank to auto-generate (e.g.
     `/forecast/jammu-kashmir-weather-forecast-13-august-2026`)
   - **Severity** — Normal / Watch / Warning / Severe Alert (controls the
     colored badge shown everywhere)
   - **Region** and **Category**
   - **Summary** — used on cards and as the fallback meta description
   - **Advisory** (optional) — shown in a highlighted alert box
   - **Full forecast content** — supports HTML (headings, paragraphs, lists)
   - **Featured image** — upload directly in the form
   - **Valid from / until** — optional forecast validity window
   - **SEO overrides** — optional custom meta title/description
4. Click **"Save as draft"** or **"Publish now"**.

---

## 4. How to upload a forecast graphic (weather maps)

1. Save the forecast first (draft or published).
2. Open it again from the dashboard (**Edit**).
3. Scroll to the **"Weather Maps"** panel at the bottom.
4. Add an optional caption/source, choose an image, and it uploads
   immediately. Maps appear on the public forecast page in a responsive
   gallery with **zoom** and a **full-screen viewer** — the original image
   file is never altered or recompressed by the app.

**Where uploads are stored** is controlled by `STORAGE_DRIVER`:

- **`local` (default)** — files are saved to `public/uploads` on the
  server's own disk. This only works if your host gives the app a
  *persistent* filesystem (a VPS, or Docker with a mounted volume).
- **`s3`** — files are uploaded to any S3-compatible object store (AWS S3,
  Cloudflare R2, Supabase Storage, MinIO, etc.) instead. **Use this if you
  deploy to a platform with an ephemeral filesystem** (e.g. Vercel) —
  otherwise uploaded images disappear on the next deploy or server restart.
  Set the `S3_*` variables in `.env` (see section 7).

---

## 5. How to publish / unpublish a forecast

From **`/admin/dashboard`**, each forecast row has **Publish/Unpublish** and
**Delete** buttons — no need to open the editor. Publishing:

- Sets `publishedAt` (first publish only — republishing doesn't reset the date)
- Makes it appear on the homepage (if it's the newest), the Forecasts page,
  the Archive, and the sitemap
- Automatically moves the previously-newest forecast into the "Recent
  Forecasts" grid / archive

Unpublishing immediately removes it from all public pages without deleting
the data.

---

## 6. How to change the website logo / name

- **Logo:** replace `public/logo.jpg` with your own image (any image file —
  update the extension in `lib/site.ts` → `logo: "/logo.jpg"` if you use a
  different format).
- **Site name / description / keywords / social handle:** edit
  `lib/site.ts` (`siteConfig` object) — this single file drives the name
  shown in the header, footer, browser tab, and all SEO metadata.
- **Colors:** edit `tailwind.config.ts` (`storm` and `amber` color scales).

---

## 7. Where environment variables & database credentials live

Everything is in **`.env`** (created from `.env.example`, which is safe to
commit — it contains no real secrets, only placeholders):

| Variable | Required? | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string (`postgresql://user:pass@host:5432/db?sslmode=require`). |
| `NEXTAUTH_SECRET` | Yes | Random secret used to sign admin session tokens. Generate one with `openssl rand -base64 32`. |
| `NEXTAUTH_URL` | Yes | Your site's real base URL in production (e.g. `https://weatherbyabbas.com`). |
| `NEXT_PUBLIC_SITE_URL` | Yes | Used for canonical URLs, sitemap, robots.txt, and Open Graph image URLs. |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` / `SEED_ADMIN_NAME` | Yes | Used **once** by `npm run seed` to create your first admin login. Use a strong, unique password. |
| `STORAGE_DRIVER` | No (defaults to `local`) | Set to `s3` to store uploaded weather maps in S3-compatible object storage instead of local disk. **Required if you deploy anywhere without a persistent filesystem** (see section 4 below). |
| `S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_PUBLIC_URL` | Only if `STORAGE_DRIVER=s3` | Object storage credentials and the public URL uploaded files are served from. |

`.env` itself (not `.env.example`) is git-ignored and never committed or
exposed to the browser — only variables prefixed `NEXT_PUBLIC_` are ever
sent to the client, and none of your secrets use that prefix. Never share
your real `.env` file publicly.

---

## 8. Production deployment

These steps apply to any Node.js host (VPS, Railway, Render, Docker, etc.).
If deploying to a platform with an **ephemeral filesystem** (e.g. Vercel),
also set `STORAGE_DRIVER=s3` and the `S3_*` variables first (section 7) —
otherwise uploaded weather maps will be lost.

1. **Provision a PostgreSQL database** (Neon, Supabase, Railway, RDS, or
   self-hosted) and copy its connection string.
2. **Set environment variables** on your host: every variable listed in
   section 7, using your real production values — never the placeholders
   from `.env.example`. In particular:
   - `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` → your real domain, e.g.
     `https://weatherbyabbas.com`
   - `NEXTAUTH_SECRET` → a freshly generated secret (`openssl rand -base64 32`),
     different from anything used in development
   - `SEED_ADMIN_PASSWORD` → a strong password you haven't used elsewhere
3. **Install, generate the Prisma client, and run migrations:**
   ```bash
   npm install
   npx prisma generate
   npx prisma migrate deploy
   ```
   (`migrate deploy` applies existing migrations without prompting — use
   this instead of `migrate dev` in production.)
4. **Seed the admin account** (creates your login; safe to re-run — it
   skips creating a duplicate if the email already exists):
   ```bash
   npm run seed
   ```
5. **Build and start:**
   ```bash
   npm run build
   npm start
   ```
   Or, if your platform builds automatically from a `build` command (Railway,
   Render, etc.), point it at `npm run build` and the start command at
   `npm start`.
6. **Remove the sample forecasts** once you've published real content — see
   section 9 below.

**Manual steps only you can do** (no code change can automate these):
- Buying/pointing your domain's DNS at your hosting platform
- Creating the production Postgres database and S3 bucket (if used)
- Generating and storing your real `NEXTAUTH_SECRET` and admin password
  somewhere safe (a password manager)
- Uploading your logo (`public/logo.jpg`) if you want to change it

---

## 9. How to remove the sample forecasts

The four sample forecasts created by `npm run seed` are tagged
`isSample: true` in the database and shown with a small "Sample" badge in
the admin dashboard, so they're easy to find. To remove them before going
live, either:

- **From the dashboard:** open each one and click **Delete**, or
- **All at once via Prisma Studio:**
  ```bash
  npx prisma studio
  ```
  Open the `Forecast` table, filter `isSample = true`, select all, and
  delete.

This never touches your own real forecasts (they're created with
`isSample: false` automatically).

---

## What's built in

- **SEO**: per-forecast SEO title, meta description, dynamically generated
  Open Graph image, clean date-based URL slugs, `WeatherForecast` +
  `BreadcrumbList` JSON-LD structured data, auto-generated `sitemap.xml`
  and `robots.txt`, canonical URLs on every page.
- **Responsive design**: mobile-first Tailwind layout tested for phone,
  tablet, and desktop breakpoints; responsive `next/image` sizing
  throughout.
- **Database-driven publishing**: nothing is hard-coded — forecasts,
  categories, and media all come from Prisma models (`Forecast`,
  `Category`, `Media`, `Admin`), so publishing is entirely a database
  operation triggered from the dashboard.
- **Secure admin area**: `/admin/*` routes are protected by NextAuth
  middleware; passwords are bcrypt-hashed; nothing sensitive is exposed to
  the frontend bundle.
- **Weather map viewer**: zoomable, full-screen image viewer with caption,
  source, and captured-date fields; original map images are never modified.
- **Archive**: filterable by year, month, category, and region.
- **Sample content**: 4 realistic sample forecasts covering North Kashmir,
  South Kashmir, Jammu division, and a severe-weather alert, each tagged
  `isSample: true` (shown with a "Sample" badge) so you can find and
  replace/delete them easily once you add real forecasts.

## Project structure

```
app/                    # Next.js App Router pages & API routes
  admin/                # Protected admin dashboard, login, editor
  api/                  # forecasts, categories, upload, auth endpoints
  forecast/[slug]/      # Public forecast detail page + OG image route
  forecasts/, archive/  # Listing & archive pages
  sitemap.ts, robots.ts # SEO
components/             # Header, Footer, ForecastCard, MapViewer, etc.
components/admin/       # Admin-only form components
lib/                    # Prisma client, auth config, site config, utils
prisma/schema.prisma    # Database schema
scripts/seed.ts         # Seeds admin account + sample forecasts
```
