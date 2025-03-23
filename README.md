# TrackPrayer 

A Vue.js application for managing prayer times and requests.

![image](https://github.com/user-attachments/assets/03855433-0312-498e-ba2c-c7c59061d1c2)

## Features

- User authentication via Supabase
- Prayer tracking and management
- Responsive design with Tailwind CSS
- State management with Pinia

## Technologies

- Vue 3 with Composition API and `<script setup>` SFCs
- Vite for fast development and bundling
- Supabase for backend and authentication
- Tailwind CSS for styling
- Vue Router for navigation
- Pinia for state management

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
