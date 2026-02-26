# RePaired

**Connecting people with orphaned earbuds and charging cases.**

RePaired is a community marketplace built to reduce e-waste. Instead of throwing away a single lost earbud or broken charging case, users can list their spares and find matches from others in the same situation — sustainable, affordable, and community-driven.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Auth | [Auth.js v5](https://authjs.dev) — Google OAuth |
| Database | PostgreSQL via [Prisma Postgres](https://www.prisma.io/postgres) |
| ORM | [Prisma](https://prisma.io) with `@prisma/adapter-pg` |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Maps | Leaflet + React Leaflet |
| Icons | Lucide React |

---

## Features

- 🔐 **Google OAuth** sign-in via Auth.js
- 📋 **List spare parts** — charging cases or individual earbuds
- 🗺️ **Map-based discovery** — browse listings by location
- 💬 **In-app messaging** — contact listing owners directly
- 👤 **User profiles** — view your listings and account details

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 20+
- [pnpm](https://pnpm.io) 9+
- A PostgreSQL database (local or via [Prisma Postgres](https://www.prisma.io/postgres))
- A [Google OAuth app](https://console.developers.google.com/)

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/repaired.git
cd repaired
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your values (see [Environment Variables](#environment-variables) below).

### 4. Set up the database

```bash
# Push the Prisma schema to your database
pnpm prisma db push
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the following:

| Variable | Description |
|---|---|
| `AUTH_SECRET` | Secret for Auth.js session signing. Generate with `openssl rand -base64 32`. |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID. |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret. |
| `DATABASE_URL` | Prisma Postgres proxy URL (used by Prisma CLI / migrations). |
| `DIRECT_DATABASE_URL` | Direct PostgreSQL connection URL (used at runtime by the PrismaPg adapter). |

---

## Project Structure

```
repaired/
├── app/
│   ├── api/
│   │   ├── auth/          # Auth.js catch-all route handler
│   │   ├── listings/      # GET, POST listings; PATCH, DELETE by ID
│   │   ├── messages/      # GET, POST messages for a listing
│   │   └── profile/       # GET current user profile + listings
│   ├── donate/            # "Donate / Sell" page with listing form
│   ├── find/              # Browse listings page with map
│   ├── login/             # Sign-in page
│   └── profile/           # Authenticated user profile page
├── components/            # Shared UI components
├── lib/
│   ├── prisma.ts          # Singleton Prisma client
│   └── utils.ts           # Utility helpers (cn, etc.)
├── prisma/
│   └── schema.prisma      # Database schema
├── auth.ts                # Auth.js configuration
└── .env.example           # Environment variable reference
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/listings` | Public | List available listings (filterable by `type`, `product`) |
| `POST` | `/api/listings` | Required | Create a new listing |
| `GET` | `/api/listings/:id` | Public | Get a single listing with messages |
| `PATCH` | `/api/listings/:id` | Required | Update a listing (owner only) |
| `DELETE` | `/api/listings/:id` | Required | Delete a listing (owner only) |
| `GET` | `/api/messages?listingId=` | Required | Get messages for a listing |
| `POST` | `/api/messages` | Required | Send a message about a listing |
| `GET` | `/api/profile` | Required | Get the current user's profile and listings |

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

## License

[MIT](LICENSE)
