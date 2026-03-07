import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Prisma Client singleton for Next.js.
 *
 * DIRECT_DATABASE_URL is the raw postgres:// URL pointing to the MiniPG
 * port managed by `prisma dev`. It includes `single_use_connections=true`
 * and `connection_limit=1` — MiniPG only allows a single connection at a
 * time and terminates idle ones.
 *
 * PrismaPg passes the config object directly to `new pg.Pool(config)`.
 * Without `max: 1`, Pool defaults to 10 connections; MiniPG terminates
 * the idle extras → "Connection terminated unexpectedly".
 *
 * Pool settings match MiniPG requirements:
 *   max: 1               – single connection to match connection_limit=1
 *   idleTimeoutMillis: 0 – don't close idle connections (let Prisma manage)
 *   allowExitOnIdle: true – allow process to exit without hanging on the pool
 *
 * DATABASE_URL (prisma+postgres://) is only used by the Prisma CLI.
 */
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({
    connectionString: process.env.DIRECT_DATABASE_URL,
    max: 1,
    idleTimeoutMillis: 0,
    allowExitOnIdle: true,
});

export const prisma =
    globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
