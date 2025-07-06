import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, PoolConfig } from "@neondatabase/serverless";
import { cache } from "react";

export const getPrisma = cache(() => {
  const neon = new Pool({ connectionString: process.env.DATABASE_URL }) as unknown as PoolConfig;
  const adapter = new PrismaNeon(neon);
  return new PrismaClient({ adapter });
});
