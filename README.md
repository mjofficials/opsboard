# Opsboard

> A comprehensive web application for managing operations tasks, teams, and projects efficiently.

Opsboard is a modern, full-stack application built to streamline operational workflows. It provides a robust platform for tracking tickets, managing team collaborations, organizing projects, and monitoring dashboard analytics—all within a secure, role-based environment.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Backend/Database:** [Supabase](https://supabase.com/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & [React Query](https://tanstack.com/query/v5)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## ✨ Key Features

1. **Ticket Management:** Create, track, and manage operational tasks and tickets with a detailed commenting system.
2. **Project & Team Organization:** Structure your workflow by grouping tasks into projects and assigning them to specific teams.
3. **Role-Based Authentication:** Secure user access and role management powered by Supabase Auth.
4. **Dashboard Analytics:** Comprehensive metrics and visual overviews to keep track of operational health.

## 📦 Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/opsboard.git
   cd opsboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add the following required placeholders (replace with your actual Supabase credentials):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 🗂️ Project Structure

```text
opsboard/
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router pages and layouts
│   │   ├── (auth)/       # Authentication routes
│   │   └── (dashboard)/  # Main dashboard routes
│   ├── components/       # Reusable UI components (Shadcn UI)
│   ├── features/         # Feature-based modules (auth, tickets, teams, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and Supabase client
│   ├── store/            # Redux store configuration
│   ├── styles/           # Global styles
│   └── types/            # TypeScript type definitions
├── .env.local            # Environment variables (not committed)
├── components.json       # Shadcn UI configuration
├── next.config.ts        # Next.js configuration
└── package.json          # Project dependencies and scripts
```