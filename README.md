# अधिकार Adhikaar — Civic Assistance Platform

> **Democratizing statutory awareness, welfare entitlements, and legal aid access for every Indian citizen.**

Adhikaar is a sovereign, open-access civic assistance platform built to simplify statutory rights, discover central and state government schemes, and connect citizens with District Legal Services Authorities (DLSA).

---

## 1. Monorepo Architecture

Adhikaar is architected as a clean, modular Turborepo monorepo designed to support web, future WhatsApp bots, and mobile clients:

```
Adhikaar/
├── apps/
│   ├── web/                     # Next.js 16 (App Router) + React 19 + Tailwind CSS v4
│   └── api/                     # Express + TypeScript + Mongoose + Centralized Error Handling
│
├── packages/
│   └── shared/                  # Shared TypeScript types, validation, and API contracts
│
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI (Lint, Typecheck, Test, Build)
│
├── turbo.json                   # Turborepo build pipeline
├── package.json                 # Monorepo workspaces configuration
└── README.md
```

### Workspaces

- **`apps/web`** (`@adhikaar/web`): The citizen-facing web application. Features the Tricolour Dawn civic design system, dark mode, split-screen AI assistant panel, and live API status reporting.
- **`apps/api`** (`@adhikaar/api`): Modular Express TypeScript API providing system health diagnostics, MongoDB Atlas connection resilience, centralized error handling, and structured request logging.
- **`packages/shared`** (`@adhikaar/shared`): Single source of truth for TypeScript types, API contracts, and validation rules shared across all apps.

---

## 2. Prerequisites

- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or `v11.x`
- Optional: MongoDB Atlas cluster URI (if connecting to a live database)

---

## 3. Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/mayankyadav-11/Adhikaar.git
   cd Adhikaar
   ```

2. **Install all dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to create your local `.env`:
   ```bash
   cp .env.example .env
   ```

---

## 4. Environment Variables

The project uses the following environment variables:

| Variable              | Workspace  | Description                                            | Default                         |
| --------------------- | ---------- | ------------------------------------------------------ | ------------------------------- |
| `PORT`                | `apps/api` | Port number for Express API                            | `5000`                          |
| `NODE_ENV`            | `apps/api` | Node environment (`development`, `production`, `test`) | `development`                   |
| `CLIENT_URL`          | `apps/api` | Allowed frontend origin for CORS                       | `http://localhost:3000`         |
| `MONGODB_URI`         | `apps/api` | MongoDB Atlas connection string                        | `""` (runs standalone if unset) |
| `NEXT_PUBLIC_API_URL` | `apps/web` | Backend API base URL consumed by web client            | `http://localhost:5000`         |

> [!NOTE]
> If `MONGODB_URI` is not provided, the API runs safely in standalone mode and reports `"not_configured"` in the health status check without crashing or faking a connection.

---

## 5. Development & Running

### Run the Entire Project (One Command)

Start both Next.js Web and Express API concurrently with Turborepo:

```bash
npm run dev
```

- **Web App**: [http://localhost:3000](http://localhost:3000)
- **API Server**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

### Run Applications Independently

- **Start Web only:**
  ```bash
  npm run dev:web
  ```
- **Start API only:**
  ```bash
  npm run dev:api
  ```

---

## 6. Verification & Quality Commands

| Command                | Action                                                           |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run lint`         | Runs ESLint across `apps/web`, `apps/api`, and `packages/shared` |
| `npm run typecheck`    | Runs `tsc --noEmit` across all workspaces                        |
| `npm run test`         | Runs Vitest unit tests (including `GET /health` tests)           |
| `npm run build`        | Compiles API TypeScript and builds production Next.js bundle     |
| `npm run format:check` | Checks code formatting with Prettier                             |
| `npm run format`       | Auto-formats code with Prettier                                  |

---

## 7. Health & Status Endpoints

### `GET /health`

Returns live system health and database connectivity diagnostics:

```json
{
  "status": "ok",
  "service": "adhikaar-api",
  "version": "0.1.0",
  "timestamp": "2026-09-19T08:00:00.000Z",
  "uptimeSeconds": 42,
  "database": {
    "status": "connected | disconnected | not_configured"
  },
  "environment": "development"
}
```

The frontend automatically communicates with this endpoint and displays real-time connectivity status on the homepage and footer.

---

## 8. Continuous Integration (CI)

A GitHub Actions workflow is located at [`.github/workflows/ci.yml`](.github/workflows/ci.yml). On every push or pull request to `main`, it automatically executes:

1. `npm ci` (clean dependency installation)
2. `npm run lint` (ESLint verification)
3. `npm run typecheck` (TypeScript validation across all workspaces)
4. `npm run test` (API endpoint unit tests)
5. `npm run build` (Next.js and Express production build verification)

---

## 9. Phase 0 Scope & Future Roadmaps

### Completed in Phase 0:

- [x] Turborepo monorepo with `apps/web`, `apps/api`, and `packages/shared`
- [x] Complete preservation of approved Adhikaar frontend design and split-screen AI experience
- [x] Express TypeScript backend with health endpoint (`GET /health`)
- [x] Web-to-API connection with live system status badge
- [x] Safe MongoDB Atlas configuration with graceful fallback
- [x] Centralized error handling and request logging
- [x] Shared TypeScript definitions and validation
- [x] ESLint, Prettier, and TypeScript configuration
- [x] English-first i18n scaffold (ready for Hindi and Punjabi)
- [x] PWA foundation (`manifest.ts`)
- [x] GitHub Actions CI workflow
- [x] Automated tests for API endpoints

### Intentionally Deferred to Later Phases:

The following are **NOT** implemented in Phase 0 and will be added in subsequent milestones:

- User Authentication (Phone OTP, Google OAuth, JWT sessions)
- Citizen Profiles and Saved Applications
- Schemes Database & Eligibility Matching Engine
- LLM Integration, Claude API, and RAG Pipeline
- Legal Corpus Retrieval & DLSA geo-search
- Document Generation & Scam Checker
- WhatsApp Bot & Native Mobile Applications
- Redis caching & BullMQ background queues
