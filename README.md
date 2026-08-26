# TourNature-Bio — Frontend

Next.js 15 (App Router) + TypeScript + Tailwind CSS frontend for the TourNature-Bio travel platform.

## Getting started
```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev
```

The API backend lives in a separate repository (Django + DRF).
Set `NEXT_PUBLIC_API_URL` to the API base URL (e.g. `https://api.tournature-bio.com/api`).

## Deploy
Deploy to Vercel and set the `NEXT_PUBLIC_API_URL` environment variable in the project settings.
