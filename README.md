# Prometric Hero: 45-Day Challenge 🦸‍♂️

A gamified exam preparation PWA designed for medical professionals (Nurses, Pharmacists, GPs) preparing for Gulf licensing exams (DHA, MOH, SLE, HAAD).

## 🚀 Live Demo
**[Launch App](https://frontend-jw33kr5mp-buddhas-projects-000b427b.vercel.app)**  
*(Uses LocalStorage - data persists on your device)*

---

## 🏗 Architecture
This project uses a **Serverless / Local-First** architecture to ensure zero hosting costs and offline capability.

- **Frontend**: React + TypeScript + Vite
- **State Management**: Zustand
- **Database**: LocalStorage (Browser) + JSON (Static Data)
- **Auth**: Local Simulation (No backend required)
- **Hosting**: Vercel (Static Site)

### Why LocalStorage?
We switched from Firebase to a LocalStorage-based approach to:
1.  **Eliminate Costs**: No Firestore billing or cloud function quotas.
2.  **Simplify Deployment**: Runs as a pure static site.
3.  **Offline First**: ideal for study on the go.

> **Note**: User data is stored **only on the device**. Clearing browser cache will delete progress.

---

## 🛠 Project Structure

```bash
Prometric/
├── frontend/               # Main React Application
│   ├── src/
│   │   ├── features/       # Feature-based modules (Auth, Questions, etc.)
│   │   ├── services/       # Core business logic (localAuth, localStore)
│   │   ├── data/           # Static JSON data (Questions, Curriculum)
│   │   └── App.tsx         # Main Entry
│   └── public/             # Static Assets (Manifest, Icons)
```

## 💻 Running Locally

1.  **Clone the repo**
    ```bash
    git clone <repo-url>
    cd Prometric/frontend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Build for Production**
    ```bash
    npm run build
    ```

## 📚 Documentation
- [Product Requirements (PRD)](./prd.md)
- [Deployment Notes](./deploy.md)

---
**Maintained by**: Antigravity & User
