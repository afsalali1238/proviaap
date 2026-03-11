# Project Structure & File Paths

## Root Directory: `Prometric/frontend`

## Directory Tree

```
frontend/
├── dist/                        # Production build output
├── public/                      # Static assets
│   ├── favicon.ico
│   ├── icon-192.svg             # PWA icon
│   ├── icon-512.svg             # PWA icon
│   ├── logo-provia.png          # App logo
│   ├── logo.png                 # App logo (alt)
│   ├── manifest.json            # PWA manifest
│   ├── offline.html             # Offline fallback page
│   └── service-worker.js        # Service Worker (cache v2)
│
├── src/
│   ├── features/                # Feature-based architecture
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   ├── store/
│   │   │   │   └── authStore.ts
│   │   │   └── types/
│   │   │       └── user.types.ts
│   │   │
│   │   ├── battle/
│   │   │   ├── data/
│   │   │   │   └── battle.data.ts
│   │   │   └── pages/
│   │   │       ├── BattleArena.tsx
│   │   │       ├── ChatPage.tsx
│   │   │       └── OpponentSelect.tsx
│   │   │
│   │   ├── onboarding/
│   │   │   ├── components/
│   │   │   │   └── StepIndicator.tsx
│   │   │   ├── pages/
│   │   │   │   ├── AuthorityPicker.tsx
│   │   │   │   ├── ContractPledge.tsx
│   │   │   │   ├── SpecialtySelection.tsx
│   │   │   │   ├── TerritorySelection.tsx
│   │   │   │   └── Welcome.tsx
│   │   │   └── types/
│   │   │       └── onboarding.types.ts
│   │   │
│   │   ├── progress/
│   │   │   └── components/
│   │   │       ├── StatsCard.tsx
│   │   │       └── StreakCounter.tsx
│   │   │
│   │   ├── questions/
│   │   │   ├── components/
│   │   │   │   ├── QuestionCard.tsx
│   │   │   │   └── QuizResults.tsx
│   │   │   ├── data/
│   │   │   │   └── mockQuestions.ts      # ← 2,253 questions (generated)
│   │   │   ├── pages/
│   │   │   │   └── DailyQuestions.tsx
│   │   │   └── types/
│   │   │       └── question.types.ts
│   │   │
│   │   ├── quiz/
│   │   │   ├── QuizEngine.tsx
│   │   │   └── store/
│   │   │       └── quizStore.ts          # Quiz state (persistence: provia-quiz-storage-v3)
│   │   │
│   │   ├── roadmap/
│   │   │   ├── Roadmap.tsx               # Uses ALL_QUESTIONS from mockQuestions.ts
│   │   │   └── store/
│   │   │       └── proviaStore.ts
│   │   │
│   │   ├── social/
│   │   │   ├── TheLounge.tsx
│   │   │   ├── data/
│   │   │   │   └── social.data.ts
│   │   │   └── pages/
│   │   │       ├── Achievements.tsx
│   │   │       ├── Leaderboard.tsx
│   │   │       └── Referral.tsx
│   │   │
│   │   └── theme/
│   │       └── themeStore.ts
│   │
│   ├── lib/
│   │   └── firebase/
│   │       └── config.ts
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx                 # Main app (uses ALL_QUESTIONS, shows v2.1 tag)
│   │   └── LandingPage.tsx
│   │
│   ├── services/
│   │   ├── auth.ts
│   │   ├── localAuth.ts
│   │   ├── localStore.ts                 # Uses ALL_QUESTIONS from mockQuestions.ts
│   │   ├── store.ts                      # Uses ALL_QUESTIONS from mockQuestions.ts
│   │   └── database/
│   │       ├── index.ts
│   │       ├── firestore.service.ts
│   │       ├── questions.db.ts
│   │       └── users.db.ts
│   │
│   ├── utils/
│   │   ├── pwa.utils.tsx
│   │   └── registerSW.ts
│   │
│   ├── App.tsx                           # Root component & routing
│   ├── App.css                           # Component styles
│   ├── main.tsx                          # Entry point
│   ├── index.css                         # Global + Tailwind styles
│   └── vite-env.d.ts
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── vercel.json                           # SPA rewrite rules
└── README.md
```

## Key Files
- **`src/pages/Dashboard.tsx`**: Main app — 4 tabs (Home, Tests, Battle, Discussions), roadmap grid, settings, v2.1 version tag.
- **`src/features/quiz/QuizEngine.tsx`**: Quiz flow with 30-question limit, attempt limits, cooldowns, scoring.
- **`src/features/quiz/store/quizStore.ts`**: Quiz state (attempts, cooldowns, scores). Persistence key: `provia-quiz-storage-v3`.
- **`src/features/roadmap/store/proviaStore.ts`**: Core state (45-day roadmap, hero credits, streak, duels).
- **`src/features/questions/data/mockQuestions.ts`**: All 2,253 questions (generated from `final_questions.json`).
- **`src/features/roadmap/Roadmap.tsx`**: Uses `ALL_QUESTIONS` from `mockQuestions.ts`.
- **`src/pages/LandingPage.tsx`**: Marketing page.
- **`public/service-worker.js`**: Service Worker with cache version v2.

## Output Config
- Build output: `./dist`
- Vercel serves from `./dist` (SPA mode via `vercel.json`).
- Deploy: Push to `origin/main` on `https://github.com/afsalali1238/proviaap`.
- Vercel Root Directory: `frontend`.
