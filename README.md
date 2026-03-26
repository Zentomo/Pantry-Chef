# Pantry Chef

A cross-platform mobile app (iOS, Android, and web) that helps you make the most of what's already in your kitchen. Enter the ingredients you have on hand and Pantry Chef surfaces recipes you can actually cook — no unnecessary trips to the store.

## Features

- **Pantry Management** — Add, edit, and track ingredients you have at home
- **Recipe Discovery** — Browse recipes filtered to what's in your pantry
- **Favourites** — Save recipes you love for quick access later
- **Recipe Detail** — Full ingredient lists, instructions, and serving info
- **Cross-Platform** — Runs natively on iOS, Android, and in the browser

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile / Web | React Native + Expo (SDK 54) |
| Routing | Expo Router (file-based, tab + stack navigation) |
| UI | React Native StyleSheet, Expo Vector Icons, Expo Linear Gradient |
| State | React Query (@tanstack/react-query) + React Context |
| Backend | Express.js (TypeScript) |
| Database | PostgreSQL with Drizzle ORM |
| Language | TypeScript throughout |

## Project Structure

```
├── app/                   # Expo Router screens
│   ├── (tabs)/            # Bottom-tab navigation
│   │   ├── index.tsx      # Pantry / home screen
│   │   ├── recipes.tsx    # Recipe browser
│   │   └── favorites.tsx  # Saved favourites
│   └── recipe/
│       └── [id].tsx       # Recipe detail screen
├── components/            # Shared UI components
├── constants/             # Theme colours, spacing, etc.
├── lib/                   # Query client and API helpers
├── server/                # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route handlers
│   └── storage.ts         # Database access layer
├── shared/
│   └── schema.ts          # Drizzle schema + Zod types (shared by client and server)
└── assets/                # App icons, splash screen, fonts
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Expo Go app on your device (optional, for physical device testing)

### Installation

```bash
# Install dependencies
npm install

# Push the database schema
npm run db:push
```

### Development

```bash
# Start the backend (port 5000)
npm run server:dev

# Start the Expo dev server (port 8081)
npm run expo:dev
```

Open Expo Go on your device and scan the QR code, or press `w` to open in your browser.

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |

## Scripts

| Script | Description |
|---|---|
| `npm run expo:dev` | Start Expo development server |
| `npm run server:dev` | Start Express backend in development mode |
| `npm run db:push` | Push Drizzle schema changes to the database |
| `npm run lint` | Run ESLint |

## License

MIT
