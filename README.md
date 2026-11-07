# NEXUS — Personal Operating System
> **Tagline:** One workspace. Your entire life.

NEXUS is an AI-powered Personal Operating System designed to help individuals organize and orchestrate their entire personal and professional lives. Built with a production-grade monorepo architecture, NEXUS unifies task management, strategic initiatives, smart scheduling, networked notes, habit tracking, life milestones, and personal finance under an autonomous, ambient intelligence.

---

## 1. Visual & Design Philosophy

NEXUS implements an **ambient aurora aesthetic** crafted for clarity, calm focus, and cognitive ergonomics:
- **Ethereal Aurora Mesh:** Subtle pastel gradients (periwinkle, soft lavender, blush peach, and airy sky blues).
- **Translucent Frosted Surfaces:** High-blur glassmorphic panels (`backdrop-blur-xl`, `bg-white/80`, `border-white/70`).
- **Tactile Micro-Actions:** Rounded pill controls (`rounded-full`, micro-actions like *Mark as Complete*, *Message*, *Calendar Invite*, and *Assign to Agent*).
- **Command & Voice Entry:** Floating ambient top pill (`How can I help? [⌘K]`) providing unified voice and keyboard search.
- **Adaptive Display:** Responsive layouts engineered independently for large desktop screens, standard laptops, tablets, and mobile devices.

---

## 2. Technology Stack

### Monorepo & Build Tooling
- **Package Manager:** `pnpm` workspaces (v12)
- **Monorepo Engine:** `Turborepo` (v2)
- **Language:** TypeScript 5.7+ (strict mode, zero unconstrained `any`)

### Web Application (`apps/web`)
- **Framework:** React 18 / Vite 6
- **Routing:** React Router v6
- **Styling:** Tailwind CSS 3.4 with custom aurora color tokens & glassmorphic utilities
- **State Management:** Zustand 5
- **Server Cache & Data Fetching:** TanStack Query v5
- **Motion & Interactions:** Framer Motion 12
- **Validation:** Zod 3
- **Iconography:** Lucide React

### Mobile Application (`apps/mobile`)
- **Framework:** React Native 0.76+ & Expo 52
- **Routing:** Expo Router v4 (file-based navigation with native bottom tabs)
- **State Management:** Zustand 5
- **Data Fetching:** TanStack Query v5
- **Shared Integration:** Unified `@nexus/api` client with `@react-native-async-storage/async-storage`

### Backend & Cloud Infrastructure (`supabase/`)
- **Database:** PostgreSQL (with Row Level Security and automated updated triggers)
- **Authentication:** Supabase Auth (Email/Password, session recovery, OAuth-ready)
- **Data Access:** Centralized typed data access layer in `@nexus/api`

---

## 3. Monorepo Architecture

```
nexus/
├── apps/
│   ├── web/                     # React + Vite desktop & web application
│   │   ├── src/
│   │   │   ├── app/             # Application entry, router providers & query client
│   │   │   ├── components/ui/   # Reusable design system (Buttons, Cards, Dialogs, etc.)
│   │   │   ├── features/
│   │   │   │   ├── auth/        # Login, Register, Forgot Password, Profile, Settings
│   │   │   │   ├── dashboard/   # Command Center, Actions, For You, Events, Projects
│   │   │   │   └── placeholders/# Intentional roadmap placeholders (Tasks, Notes, etc.)
│   │   │   ├── layouts/         # AppShell, Collapsible Sidebar, Topbar, CommandPalette
│   │   │   ├── lib/             # Typed Supabase client, services & utilities
│   │   │   ├── routes/          # Declarative router hierarchy & AuthGuard
│   │   │   └── styles/          # Aurora theme mesh, glassmorphism, & globals.css
│   │   └── package.json
│   │
│   └── mobile/                  # Native React Native + Expo mobile application
│       ├── app/                 # Expo Router (Tabs, Auth Stack)
│       │   ├── (auth)/          # Native Mobile Login & Registration
│       │   ├── (tabs)/          # Native Bottom Tab Nav (Command, Actions, AI, Profile)
│       │   └── _layout.tsx      # Root QueryClient & Auth provider
│       ├── components/          # Native Cards, Buttons, Inputs, Avatars
│       ├── lib/                 # Native Supabase integration with AsyncStorage
│       └── package.json
│
├── packages/
│   ├── types/                   # Shared TypeScript models (Profiles, Auth, Actions, DB)
│   ├── validation/              # Shared Zod schemas (Auth, Profile, Tasks)
│   ├── api/                     # Centralized Supabase client factory, Auth & Profile services
│   ├── shared/                  # Navigation constants, date helpers, shared utilities
│   └── config/                  # Shared Tailwind aurora presets & TypeScript base configs
│
├── supabase/
│   ├── migrations/
│   │   ├── 20260101000000_create_profiles.sql         # Profiles schema + RLS + trigger
│   │   └── 20260101000001_create_user_preferences.sql # Preferences schema + RLS + trigger
│   ├── seed.sql                                       # Seed blueprint for local Supabase testing
│   └── README.md
│
├── turbo.json                   # Turborepo task pipeline orchestration
├── pnpm-workspace.yaml          # Workspace package registry
├── .env.example                 # Environment variable templates
├── package.json                 # Monorepo root scripts
└── README.md
```

---

## 4. Prerequisites

Before running the project locally, ensure you have:
- **Node.js:** `v20.x` or `v22.x` / `v24.x`
- **pnpm:** `v10+` or `v12+` (Install with `npm install -g pnpm`)
- **Git**
- *(Optional for Mobile):* **Expo Go** on iOS / Android or Android Studio / Xcode

---

## 5. Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url> nexus
   cd nexus
   ```

2. **Install all dependencies across the monorepo:**
   ```bash
   pnpm install
   ```

3. **Build shared packages:**
   ```bash
   pnpm run build
   ```

---

## 6. Environment Configuration

Copy `.env.example` to the application environment files:

### Web Application (`apps/web/.env.local`)
```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_ENABLE_DEV_PREVIEW=true
```

### Mobile Application (`apps/mobile/.env`)
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
EXPO_PUBLIC_ENABLE_DEV_PREVIEW=true
```

> [!NOTE]
> **Zero-Friction Development Preview:**
> If you have not yet created a Supabase project, NEXUS automatically enables **Development Preview Mode**. You can freely sign in as demo user `Cassius Vance`, test the Command Center, toggle between the UI design spec dataset and authentic clean empty states, and test navigation without any remote blockers.

---

## 7. Connecting Supabase Backend

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **Project Settings > API** to retrieve your `URL` and `anon public` key.
3. Apply the database migrations:
   - **Option A (Supabase Dashboard SQL Editor):**
     1. Copy `supabase/migrations/20260101000000_create_profiles.sql` and run it in the SQL Editor.
     2. Copy `supabase/migrations/20260101000001_create_user_preferences.sql` and run it in the SQL Editor.
   - **Option B (Supabase CLI):**
     ```bash
     npx supabase login
     npx supabase link --project-ref <your-project-id>
     npx supabase db push
     ```

### Database Security Architecture
- **Row Level Security (RLS)** is strictly enabled on both `profiles` and `user_preferences`.
- Users can only read, insert, and update their own records (`auth.uid() = id` / `auth.uid() = user_id`).
- When a user signs up via `auth.users`, a database trigger (`handle_new_user_profile` and `handle_new_user_preferences`) automatically initializes their linked profile and default workspace preferences safely.

---

## 8. Development & Execution Commands

### Run Everything Simultaneously
```bash
pnpm run dev
```

### Web Application Only
```bash
# Starts Vite development server at http://localhost:3000
pnpm run dev:web
```

### Mobile Application Only
```bash
# Starts Expo development server with QR code for Expo Go
pnpm run dev:mobile
```

### Type Checking & Quality Control
```bash
# Type check all workspaces (web, mobile, shared packages)
pnpm run type-check

# Run production builds across all packages
pnpm run build
```

---

## 9. Stage 1 Deliverables & Implemented Modules

| Feature / Area | Status | Implementation Details |
|---|---|---|
| **Monorepo Architecture** | Complete | pnpm workspaces + Turborepo pipeline |
| **Shared Types (`@nexus/types`)** | Complete | Auth, Profile, Preferences, Actions, Navigation, DB types |
| **Shared Validation (`@nexus/validation`)** | Complete | Zod schemas for auth, profiles, and quick tasks |
| **Centralized API (`@nexus/api`)** | Complete | Supabase client factory, Auth & Profile services, Query keys |
| **Design System Preset (`@nexus/config`)** | Complete | Aurora theme colors, glass surfaces, shadows & blur |
| **Web Shell (`apps/web`)** | Complete | Collapsible sidebar, ambient topbar, Cmd+K palette |
| **Command Center Dashboard** | Complete | Actions card, For You feed, Projects, Events, Habits, Goals |
| **Dual State Support** | Complete | One-click toggle between Reference Spec dataset and Empty State |
| **Mobile Foundation (`apps/mobile`)** | Complete | Genuine Expo React Native app with bottom tab bar |
| **Supabase Migrations** | Complete | `profiles` and `user_preferences` with RLS & auth triggers |
| **Roadmap Placeholders** | Complete | Dedicated intentional placeholders for Modules 2–10 |

---

## 10. Next Stage Roadmap

- **Stage 2:** Tasks & Projects Engine (Kanban, matrices, milestones, cross-app bidirectional sync).
- **Stage 3:** Smart Calendar & Knowledge Vault (Time-blocking, markdown wiki, vector semantic search).
- **Stage 4:** Habits, Personal Finance, and NEXUS AI Copilot (Autonomous tool-calling agents).
