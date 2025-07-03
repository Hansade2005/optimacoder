"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import ChatSidebar from "@/components/chat-sidebar";
import { deleteChat, updateChatTitle, getChats } from "@/app/(main)/actions";

interface Chat {
  id: string;
  title: string;
  createdAt: string;
  model: string;
}

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Extract current chat ID from URL
  const currentChatId = pathname.startsWith('/chats/') ? pathname.split('/')[2] : undefined;

  // Load chats on mount
  useEffect(() => {
    const loadChats = async () => {
      try {
        const fetchedChats = await getChats();
        setChats(fetchedChats.map(chat => ({
          ...chat,
          createdAt: chat.createdAt.toISOString()
        })));
      } catch (error) {
        console.error('Failed to load chats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

  // Refresh chats when a new chat is created (detect route changes)
  useEffect(() => {
    const refreshChats = async () => {
      if (currentChatId && !chats.some(chat => chat.id === currentChatId)) {
        const fetchedChats = await getChats();
        setChats(fetchedChats.map(chat => ({
          ...chat,
          createdAt: chat.createdAt.toISOString()
        })));
      }
    };

    refreshChats();
  }, [currentChatId, chats]);

  const handleDeleteChat = async (chatId: string) => {
    try {
      await deleteChat(chatId);
      setChats(chats.filter(chat => chat.id !== chatId));
      
      // If we're currently viewing the deleted chat, redirect to home
      if (currentChatId === chatId) {
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const handleUpdateTitle = async (chatId: string, newTitle: string) => {
    try {
      await updateChatTitle(chatId, newTitle);
      setChats(chats.map(chat => 
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      ));
    } catch (error) {
      console.error('Failed to update chat title:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        onDeleteChat={handleDeleteChat}
        onUpdateTitle={handleUpdateTitle}
      />
      
      {/* Main content area with sidebar spacing */}
      <div className="flex-1 transition-all duration-300 ml-12">
        <div className="h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
