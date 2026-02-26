import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * Extends the global object to hold a single PrismaClient instance.
 * This prevents multiple instances from being created in development
 * due to Next.js hot reloading.
 */
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

/**
 * Creates and returns a new PrismaClient instance backed by a pg connection
 * pool. Uses the `@prisma/adapter-pg` driver adapter for compatibility with
 * the Prisma Postgres proxy (MiniPG).
 *
 * @throws {Error} If the `DIRECT_DATABASE_URL` environment variable is not set.
 */
function createPrismaClient(): PrismaClient {
    const connectionString = process.env.DIRECT_DATABASE_URL;

    if (!connectionString) {
        throw new Error(
            "Missing environment variable: DIRECT_DATABASE_URL. " +
            "Please add it to your .env file. See .env.example for reference."
        );
    }

    // Pool configured for single-use connections, as required by the Prisma MiniPG proxy.
    const pool = new Pool({
        connectionString,
        max: 1,
        idleTimeoutMillis: 0,
        allowExitOnIdle: true,
    });

    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
}

/**
 * Singleton PrismaClient instance.
 * In production a fresh client is created each time the module is loaded.
 * In development the instance is reused across hot reloads via `globalThis`.
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
