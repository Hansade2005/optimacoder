"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSidebar } from "@/components/sidebar-context";
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { PanelLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Chat {
  id: string;
  title: string;
  createdAt: string;
  model: string;
}

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId?: string;
  onDeleteChat: (chatId: string) => void;
  onUpdateTitle: (chatId: string, newTitle: string) => void;
}

export default function ChatSidebar({ 
  chats, 
  currentChatId, 
  onDeleteChat, 
  onUpdateTitle 
}: ChatSidebarProps) {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true); // Auto-collapse on mobile
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsCollapsed]);

  // Filter chats based on search query
  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditStart = (chat: Chat) => {
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const handleEditSave = async () => {
    if (editingId && editTitle.trim()) {
      await onUpdateTitle(editingId, editTitle.trim());
      setEditingId(null);
      setEditTitle("");
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const truncateTitle = (title: string, maxLength: number = 30) => {
    return title.length > maxLength ? title.substring(0, maxLength) + "..." : title;
  };
  
  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
      
      {/* Floating hamburger button when sidebar is collapsed */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed top-4 left-4 z-50 p-3 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
          title="Open sidebar"
        >
          <PanelLeft className="size-5 bg-transparent" />
        </button>
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 z-50
        ${isCollapsed ? "w-0" : "w-80"}
        ${isMobile ? 'shadow-xl' : 'border-r border-gray-700'}
        overflow-hidden
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-white">Conversations</h2>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md hover:bg-gray-700 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <PanelLeft className="size-5" />
          </button>
        </div>

        {!isCollapsed && (
          <>
            {/* New Chat Button */}
            <div className="p-4 border-b border-gray-700">
              <Link
                href="/"
                className="flex items-center gap-3 w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                <span>New Chat</span>
              </Link>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-700">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.length === 0 ? (
                <div className="p-4 text-gray-400 text-center">
                  {searchQuery ? "No conversations found" : "No conversations yet"}
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`
                        group relative rounded-lg transition-all duration-200
                        ${currentChatId === chat.id 
                          ? 'bg-blue-600 text-white' 
                          : 'hover:bg-gray-800 text-gray-300'
                        }
                      `}
                    >
                      {editingId === chat.id ? (
                        // Edit mode
                        <div className="p-3 space-y-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleEditSave();
                              if (e.key === 'Escape') handleEditCancel();
                            }}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleEditSave}
                              className="p-1 rounded hover:bg-gray-600 text-green-400"
                            >
                              <CheckIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="p-1 rounded hover:bg-gray-600 text-red-400"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Normal mode
                        <>
                          <Link
                            href={`/chats/${chat.id}`}
                            className="block p-3 pr-12"
                          >
                            <div className="font-medium text-sm mb-1">
                              {truncateTitle(chat.title)}
                            </div>
                            <div className="text-xs opacity-75">
                              {formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
                            </div>
                            <div className="text-xs opacity-60 mt-1">
                              {chat.model}
                            </div>
                          </Link>
                          
                          {/* Action buttons */}
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-1">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleEditStart(chat);
                                }}
                                className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
                                title="Edit title"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (confirm('Delete this conversation?')) {
                                    onDeleteChat(chat.id);
                                  }
                                }}
                                className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-red-400"
                                title="Delete conversation"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
