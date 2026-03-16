# DevPortfolio Builder

A production-level SaaS application for developers to create beautiful, modern portfolio websites automatically.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **Animations:** Framer Motion
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js (Email/Password + Google OAuth)
- **State:** Zustand
- **PDF:** jsPDF

## Features

- **Authentication** - Email/password + Google OAuth login
- **Dashboard** - Manage profile, projects, skills, experience, education, social links
- **4 Portfolio Templates** - Minimal Developer, Dark Hacker, Modern Tech, Creative Designer
- **Theme Customization** - Colors, fonts, layout, dark/light mode
- **Portfolio Analytics** - Track views, clicks, devices, referrers
- **Resume Generator** - Auto-generate PDF resume from profile data
- **GitHub Import** - Import repositories as projects with one click
- **AI Bio Generator** - Generate professional bios with OpenAI
- **Contact Form** - Visitors can send messages to portfolio owners
- **SEO Optimized** - OpenGraph meta tags, dynamic metadata
- **Fully Responsive** - Works on all devices

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd devportfolio-builder

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your database URL and other credentials

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | Secret for NextAuth JWT |
| `NEXTAUTH_URL` | Yes | App URL (http://localhost:3000) |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `GITHUB_TOKEN` | No | GitHub personal access token |
| `OPENAI_API_KEY` | No | OpenAI API key for AI features |
| `RESEND_API_KEY` | No | Resend API key for emails |

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login & Register pages
│   ├── (dashboard)/      # Protected dashboard pages
│   ├── (portfolio)/      # Public portfolio pages
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # Shadcn UI components
│   ├── dashboard/        # Dashboard components
│   ├── portfolio/        # Portfolio templates
│   ├── shared/           # Shared components
│   └── forms/            # Form components
├── lib/                  # Utilities, auth, validations
├── stores/               # Zustand state stores
├── types/                # TypeScript types
└── hooks/                # Custom React hooks
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

The `vercel.json` and build scripts are pre-configured.

### Database

Use a managed PostgreSQL provider:
- [Neon](https://neon.tech) (recommended)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)
- [PlanetScale](https://planetscale.com) (MySQL alternative)

## License

MIT
