# PrayerKeeper 

A Vue.js application for managing prayer times and requests.

![image](https://github.com/user-attachments/assets/97867b89-8a0c-405d-8251-0733fc842ac9)

## Features

- Authentication & Security:
  - Email/Password login
  - Social login with X (Twitter)
  - Password reset
  - Protected routes
  - Persistent sessions
- Prayer Management:
  - Categorized lists (Unbelievers, Brethren)
  - Add, edit, delete prayers
  - Mark prayers as resolved
  - Prayer history tracking
  - Real-time updates
- User Experience:
  - Modern, responsive interface
  - Modal-based forms
  - Loading indicators
  - Error handling

## Technologies

Frontend:
- Vue 3 (Composition API + `<script setup>` SFCs)
- Vite (Development & Build Tool)
- Tailwind CSS (Styling)
- Vue Router (Routing)
- Pinia (State Management)

Backend & Services:
- Supabase (Backend as a Service)
  - Authentication
  - Real-time Database
  - Row Level Security
  - OAuth Integration (X/Twitter)

Development Tools:
- Node.js v20
- npm (Package Manager)
- ESLint (Code Quality)
- Vercel (Production Config)

## Getting Started

### Prerequisites

- Node.js (v16 or later recommended)
- npm or yarn
- Supabase account (free tier available at [supabase.com](https://supabase.com))

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd prayer-app
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Set up Supabase
   - Create a new Supabase project
   - Set up authentication and required database tables
   - Obtain your Supabase URL and anon key from the project settings

4. Set up environment variables
   - Copy `.env_example` to `.env`
   - Update with your Supabase URL and anon key

```bash
cp .env_example .env
```

Example `.env` file:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_KEY=your-supabase-anon-key
```

5. Start the development server
```bash
npm run dev
# or
yarn dev
```

## Build for Production

```bash
npm run build
# or
yarn build
```

## Preview Production Build

```bash
npm run preview
# or
yarn preview
```
