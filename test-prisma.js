const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const connectionString = process.env.DIRECT_DATABASE_URL;
console.log("Using URL:", connectionString);

const pool = new Pool({
    connectionString,
    max: 1,
});

pool.on('error', (err) => console.error('Pool Error:', err));

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        const users = await prisma.user.findMany();
        console.log('Users:', users.length);
    } catch (e) {
        console.error('Prisma Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
