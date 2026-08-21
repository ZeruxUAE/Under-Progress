# Under Progress Website

This is the standalone, Vercel-ready public website for **Under Progress**. It has no service-specific runtime, analytics loader, storage proxy, or hosted asset dependency. All design artwork is included locally under `public/assets`.

## Run locally

```bash
npm install
npm run dev
```

## Build and deploy on Vercel

```bash
npm run build
```

Import this folder into a new Vercel project. The included `vercel.json` uses a static Vite build and preserves client-side navigation for `/setup`.

## Product scope

The website includes the Under Progress landing experience, a preference-led setup flow, a live reading preview, and browser-local profile saving. It is deliberately backend-free: the local profile never leaves the visitor’s device. Production sign-in, cross-device synchronization, consent logging, and account recovery need a separate secure backend before they can be offered.
