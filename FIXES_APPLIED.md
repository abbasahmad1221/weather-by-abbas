# Fixes applied to Weather by Abbas

- Added the missing Prisma PostgreSQL migration and migration lock.
- Production build now runs `prisma migrate deploy` before `next build`.
- Vercel defaults to S3-compatible storage instead of local disk.
- Uploads verify actual image content with Sharp and use safe UUID filenames.
- Fixed the forecast form double-submit bug.
- Added validation and uniqueness checks to forecast PATCH/POST flows.
- Added an authenticated Admin Settings page for changing the password.
- Seed script now requires a real 12+ character password and skips sample forecasts unless explicitly enabled.
- Restricted Next/Image remote hosts to the configured `S3_PUBLIC_URL`.
- Added `DEPLOYMENT_CHECKLIST.md`.
