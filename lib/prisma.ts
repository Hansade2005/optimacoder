import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import { cache } from "react";

// Only assign ws in Node.js environments (not Vercel Edge/serverless)
if (typeof process !== "undefined" && process.versions?.node) {
  // Dynamically require ws to avoid bundling in serverless/edge
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  neonConfig.webSocketConstructor = require("ws");
}

export const getPrisma = cache(() => {
  const connectionString = process.env.DATABASE_URL!;
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
});
