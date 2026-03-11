# Deployment Guide

## Project: PROVIA (Prometric Hero)
**Last Updated**: March 11, 2026

---

## 1. Git Push (Version Control)

### Quick Push
```powershell
cd c:\Users\HP\Desktop\antigravity\PROVIA\Prometric
git add -A
git commit -m "Your commit message"
git push origin main
```

### Repository
- **Remote**: `origin` → GitHub (`afsalali1238/proviaap`)
- **Branch**: `main`
- **URL**: https://github.com/afsalali1238/proviaap

---

## 2. Deploy to Vercel

### Option A: Auto-Deploy via Git (Recommended)
Pushing to `origin/main` triggers automatic Vercel deployment if the GitHub repo is connected in the Vercel dashboard.

### Option B: CLI Deploy
```powershell
cd c:\Users\HP\Desktop\antigravity\PROVIA\Prometric\frontend
npx vercel --prod --yes
```

### Vercel Project Settings
- **Framework**: Vite
- **Root Directory**: `frontend` *(CRITICAL — must be set in Vercel Settings > General)*
- **Build Command**: `npm run build` (runs `tsc -b && vite build`)
- **Output Directory**: `dist`
- **SPA Rewrites**: Configured in `frontend/vercel.json`

### Current Production URL
`https://proviaap.vercel.app/`

---

## 3. Local Development

### Start Dev Server
```powershell
cd c:\Users\HP\Desktop\antigravity\PROVIA\Prometric\frontend
npm run dev
```
Opens at `http://localhost:5173/`

### Build Check (Before Deploy)
```powershell
cd c:\Users\HP\Desktop\antigravity\PROVIA\Prometric\frontend
npx tsc -b
```
Fix any TypeScript errors before deploying.

---

## 4. Data Architecture
- **No backend server required** — fully static SPA.
- **State**: Zustand stores persisted to `localStorage`.
- **Auth**: Google OAuth via Firebase Auth SDK (client-side only).
- **Questions**: Generated TypeScript file (`mockQuestions.ts`) bundled at build time.
- **Question Pipeline**: `Check_Final_No_Media.csv` → `provia_question_bank.json` → `mockQuestions.ts`

---

## 5. Question Data Regeneration

If you need to update the question bank:

```powershell
# Step 1: Convert CSV to JSON
cd c:\Users\HP\Desktop\antigravity\PROVIA\Prometric\backend
python csv_to_json.py

# Step 2: Generate mockQuestions.ts
python generate_final.py

# Step 3: Build and push
cd ..\frontend
npm run build
cd ..
git add -A
git commit -m "update: regenerated question bank"
git push origin main
```

---

## 6. Common Issues

| Issue | Fix |
|-------|-----|
| Build fails with TS errors | Run `npx tsc -b` locally, fix reported errors |
| Vercel deploy fails | Check `Root Directory` is set to `frontend` in Vercel Settings |
| Vercel 404 error | Ensure `Root Directory = frontend` and `vercel.json` exists |
| Old data showing | Clear `localStorage` in browser DevTools, or bump persistence key in `quizStore.ts` |
| Service Worker caching old data | Increment cache versions in `public/service-worker.js` |

---

## 7. Version Verification
The Dashboard header shows a version tag (e.g., "v2.1 - NEW BANK") to confirm which build is live.
