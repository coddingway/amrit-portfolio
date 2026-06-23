# Hosting — Firebase Hosting at `lens.shankar.design`

Lens is a static SPA (Vite builds to `dist/`), so this is plain Firebase Hosting —
no Functions, no SSR, nothing server-side.

## Already in the repo

- **`firebase.json`** — serves `dist/`, rewrites everything to `/index.html` (SPA),
  long-caches hashed `/assets/**`, no-caches `index.html`, and runs `pnpm run build`
  as a `predeploy` hook.
- **`.firebaserc`** — project alias. **Replace `REPLACE_WITH_YOUR_FIREBASE_PROJECT_ID`**
  with your real Firebase project id.
- **`pnpm deploy`** script (`firebase deploy --only hosting`).

## One-time setup (you — needs your Firebase login)

1. Install the CLI and log in:
   ```bash
   pnpm add -g firebase-tools     # or: npm i -g firebase-tools
   firebase login
   ```
2. Create or pick a project at <https://console.firebase.google.com> and note its
   **Project ID** (e.g. `lens-shankar`).
3. Point the repo at it — either edit `.firebaserc`, or run:
   ```bash
   firebase use --add             # choose the project, alias it "default"
   ```

## Deploy

```bash
pnpm deploy                       # predeploy builds, then deploys hosting
# or explicitly:
pnpm build && firebase deploy --only hosting
```

The first deploy gives you the default URLs `https://<project-id>.web.app` and
`…firebaseapp.com`. Confirm the app works there before wiring the domain.

## Custom domain → `lens.shankar.design` (the DNS part)

1. Firebase Console → **Hosting** → **Add custom domain** → enter `lens.shankar.design`.
2. Firebase will ask you to **verify ownership** of `shankar.design` (a one-time `TXT`
   record) if it isn't verified yet, then hand you **DNS records** that point the
   subdomain at Firebase (usually two **A** records).
3. Add exactly those records wherever **`shankar.design`'s DNS is managed** (registrar,
   Cloudflare, etc.) — host `lens`, with the values Firebase shows.
   - **Cloudflare:** set the records to **DNS only (grey cloud)** until Firebase finishes
     issuing the cert — the orange-cloud proxy can stall provisioning and double up TLS.
4. Wait. DNS propagates (minutes–hours) and Firebase **auto-provisions a free SSL cert**;
   the console status goes Pending → Connected. Once green, `https://lens.shankar.design`
   is live. Re-deploys (`pnpm deploy`) keep the domain wired.

## Optional — auto-deploy from GitHub

```bash
firebase init hosting:github      # adds a GitHub Action that deploys on push/PR to main
```

Nice to add once the repo settles — it writes a workflow file and a deploy service-account
secret, so every merge to `main` ships automatically.
