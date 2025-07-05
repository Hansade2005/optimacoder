import { getPrisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { cache } from "react";
import PageClient from "./page.client";
import { SandpackPredefinedTemplate } from "@codesandbox/sandpack-react"; // Import SandpackPredefinedTemplate

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const chat = await getChatById(id);

  if (!chat) notFound();

  return <PageClient chat={chat} />;
}

const getChatById = cache(async (id: string) => {
  const prisma = getPrisma();
  return await prisma.chat.findFirst({
    where: { id },
    include: { messages: { orderBy: { position: "asc" } } },
  });
});

export type Chat = NonNullable<Awaited<ReturnType<typeof getChatById>>> & {
  template: SandpackPredefinedTemplate; // Ensure template is of SandpackPredefinedTemplate type
};
export type Message = Chat["messages"][number];

// Removed edge runtime to reduce bundle size
// export const runtime = "edge";
export const maxDuration = 300; // Increased to handle long AI responses