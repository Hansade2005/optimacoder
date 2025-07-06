import { getPrisma } from "../lib/prisma";

async function main() {
  try {
    const prisma = getPrisma();
    // Try a simple query: list all tables (Postgres information_schema)
    // Or, if you have a model, try: await prisma.message.findFirst()
    const result = await prisma.$queryRaw`SELECT 1 as ok`;
    console.log("✅ Prisma DB connection successful:", result);
    process.exit(0);
  } catch (err) {
    console.error("❌ Prisma DB connection failed:", err);
    process.exit(1);
  }
}

main();
