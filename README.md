# FinTrack

**FinTrack** is a personal finance management application that helps users organize their accounts, track income and expenses, and understand their financial activity through a simple dashboard.

![FinTrack — Personal Finance Management](https://cdn.phototourl.com/free/2026-08-28-07d3a30a-b232-40d3-8fe7-34c8a75aa28d.png)

## Features

- **Dashboard**
  - Total balance across active accounts
  - Income and expenses for a selected period
  - Net cash flow
  - Cash-flow visualization
  - Spending breakdown by category
  - Recent transactions
  - Account balance overview
  - Monthly and multi-month views

- **Accounts**
  - Create and manage financial accounts
  - Support for bank accounts, cash, wallets, credit cards, investments, and other account types
  - Track current balances

- **Transactions**
  - Record income, expenses, and transfers
  - Categorize transactions
  - Associate transactions with accounts
  - Track transaction dates and descriptions

- **Authentication**
  - Secure user registration and login
  - Session-based authentication
  - User-specific financial data

- **System Categories**
  - Predefined income and expense categories
  - System categories shared across users
  - Seed script for initializing categories

## Tech Stack

### Frontend

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide React](https://lucide.dev/)
- [Recharts](https://recharts.github.io/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

### Backend & Database

- [Next.js](https://nextjs.org/) App Router
- [Drizzle ORM](https://orm.drizzle.team/)
- Postgres.js
- PostgreSQL
- [Supabase](https://supabase.com/)
- [Better Auth](https://www.better-auth.com/)

### Development

- Vercel
- TypeScript
- ESLint
- Drizzle Kit
- TSX

## Project Structure

```text
fintrack/
├── public/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   ├── accounts/
│   │   ├── login/
│   │   └── register/
│   │
│   ├── components/
│   │   ├── auth/
│   │   └── ui/
│   │
│   ├── db/
│   │   ├── schema/
│   │   ├── drizzle/
│   │   ├── index.ts
│   │   ├── seed.ts
│   │   └── seed-db.ts
│   │
│   ├── features/
│   │   ├── dashboard/
│   │   ├── accounts/
│   │   └── transactions/
│   │
│   └── lib/
│
├── drizzle.config.ts
├── package.json
├── tsconfig.json
└── ...
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 20+
- npm
- PostgreSQL database

A hosted PostgreSQL database such as Supabase can be used for production.

### 1. Clone the repository

```bash
git clone https://github.com/BharatBhati14/FinTrack
cd fintrack
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=your_postgresql_connection_string
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development #production
```

For production, use your production database URL and production authentication URL.

### 4. Run database migrations

Generate migrations when the schema changes:

```bash
npx drizzle-kit generate
```

Apply the migrations to your database using your configured Drizzle migration workflow.

```bash
npx drizzle-kit migrate
```

### 5. Seed system categories

The project includes a seed script for creating the default system categories.

```bash
npm run db:seed
```

The seed operation is safe to run multiple times when the corresponding database uniqueness constraints are in place.

### 6. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start the development server |
| `npm run build`   | Create a production build    |
| `npm run start`   | Start the production server  |
| `npm run lint`    | Run ESLint                   |
| `npm run db:seed` | Seed system categories       |

## Database

FinTrack uses PostgreSQL with Drizzle ORM.

The application database connection uses:

```text
Drizzle ORM
     ↓
Postgres.js
     ↓
PostgreSQL
```

The production database can be hosted using Supabase.

Database schema files are located in:

```text
src/db/schema/
```

Drizzle configuration is located at:

```text
drizzle.config.ts
```

## Production Deployment

FinTrack is designed to be deployed on Vercel.

### 1. Push the project to GitHub

Make sure the complete source code is committed to your repository.

Do not commit:

```text
node_modules/
.next/
.env
```

### 2. Import the repository into Vercel

Create a new Vercel project and connect the GitHub repository.

Vercel automatically detects the Next.js application and runs the production build.

### 3. Configure environment variables

Add the required production environment variables in the Vercel project settings.

For example:

```env
DATABASE_URL=your_production_database_url
BETTER_AUTH_SECRET=your_production_secret
BETTER_AUTH_URL=https://your-domain.com
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NODE_ENV=production
```

### 4. Verify the production build

Before deployment, run:

```bash
npm run lint
npm run build
```

Both commands should complete successfully.

### 5. Configure your custom domain

After deployment, a custom domain can be added through the Vercel project settings.

If the authentication URL changes, update:

```env
BETTER_AUTH_URL=https://your-domain.com
```

and redeploy.

## Security

FinTrack is designed so that financial data is associated with authenticated users.

Important production practices include:

- Keep environment variables private
- Use a strong production authentication secret
- Use HTTPS in production
- Never commit `.env` files
- Keep production database credentials private
- Validate user input before writing to the database
- Ensure database queries are scoped to the authenticated user
- Run production builds before deployment

## Development Workflow

A typical development workflow is:

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Check code
npm run lint

# Verify production build
npm run build

# Seed system categories when required
npm run db:seed
```

## License

This project is currently intended for personal and portfolio use.

If you plan to distribute or commercialize FinTrack, add an appropriate license before doing so.
