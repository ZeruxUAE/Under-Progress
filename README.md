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

The website includes the Under Progress landing experience, a disability-led multi-select setup flow, a named default accessibility preset, browser-local profile saving, and the website-to-extension connection flow. People can choose more than one disability or support need, fine-tune the preset, and change the choices later from either surface. The extension release is published at `https://github.com/ZeruxUAE/under-progress-extension/releases/latest` and the website’s download buttons use that release directly.

The project-support section deliberately lists only non-financial ways to help until verified creator pages exist. When a Ko-fi, Buy Me a Coffee, or GitHub Sponsors page is created, replace the relevant support card link in `src/pages/Home.tsx` with that verified creator URL. The website remains backend-free: local profiles stay in the browser. Production sign-in, cross-device synchronization, consent logging, donation processing, and account recovery need a separate secure backend or approved third-party platform before they can be offered.
