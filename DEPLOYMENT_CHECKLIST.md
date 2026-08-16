# Weather by Abbas — Safe Deployment Checklist

## Database
- Create a managed PostgreSQL database.
- Set `DATABASE_URL` in Vercel.
- This project now includes `prisma/migrations/`.
- Production builds run `prisma migrate deploy` before `next build`.

## Admin
- Set `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, and `SEED_ADMIN_NAME` for the first seed.
- The seed password must be at least 12 characters.
- Never commit `.env`.
- After login, use **Admin → Settings** to change the password.

## Images on Vercel
Use an S3-compatible object store such as Cloudflare R2:
- `STORAGE_DRIVER=s3`
- `S3_BUCKET`
- `S3_REGION=auto`
- `S3_ENDPOINT`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `S3_PUBLIC_URL`

Do not use local disk storage on Vercel.

## Seed
Run `npm run seed` once against the production database from a trusted environment after migrations have been applied.
Demo forecasts are disabled unless `SEED_INCLUDE_SAMPLES=true`.

## Test after deployment
- `/admin/login`
- Create draft forecast
- Edit forecast
- Publish forecast
- Unpublish forecast
- Delete forecast
- Upload featured image
- Attach map
- Change admin password
- Open the public forecast URL
- Check sitemap and robots
