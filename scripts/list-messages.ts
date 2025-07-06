import { getPrisma } from "../lib/prisma";

async function main() {
  const prisma = getPrisma();
  const messages = await prisma.message.findMany({
    select: {
      id: true,
      chatId: true,
      position: true,
      role: true,
      content: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  console.log("Recent messages:", messages);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
