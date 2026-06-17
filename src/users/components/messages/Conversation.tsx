import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Chat } from './types';
import { Avatar } from './Avatar';

interface ConversationListProps {
  chats: Chat[];
  activeChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
}

export function Conversation({ chats, activeChat, onSelectChat }: ConversationListProps) {
  const [query, setQuery] = useState('');

  const filtered = chats.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.handle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <aside className="w-full md:w-[380px] border-r border-[#1f1f1f] bg-[#08090b] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#1f1f1f] bg-black/80 backdrop-blur-sm px-4 py-4 shrink-0">
        <h1 className="text-xl font-black text-white mb-3.5 tracking-tight">Messages</h1>
        <div className="flex items-center gap-2 bg-[#111] rounded-full px-4 py-2.5 border border-[#1f1f1f] focus-within:border-[#ef4444]/40 transition-all duration-200">
          <Search className="w-4 h-4 text-[#71767b] shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search conversations..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-[#71767b] outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200">
              <X className="w-4 h-4 text-[#71767b] hover:text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-8">
              <p className="text-5xl mb-4">💬</p>
              <p className="font-bold text-white mb-1.5 text-base">No messages found</p>
              <p className="text-sm text-[#71767b] leading-relaxed">Start a conversation with someone to begin</p>
            </div>
          ) : filtered.map((chat, i) => (
            <motion.button
              key={chat.id}
              type="button"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.25 }}
              onClick={() => onSelectChat(chat)}
              className={cn(
                'w-full flex items-start gap-3 px-4 py-3 border-b border-[#1f1f1f] text-left transition-colors duration-200',
                activeChat?.id === chat.id ? 'bg-[#ef4444]/8 border-b border-[#ef4444]/20' : 'hover:bg-white/[0.03]'
              )}
            >
              <Avatar name={chat.name} online={chat.online} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <p className="font-bold text-sm text-white truncate">{chat.name}</p>
                  <span className="text-[10px] text-[#71767b] shrink-0 font-medium">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between gap-2 min-h-5">
                  <p className="text-xs text-[#71767b] truncate flex-1 leading-snug">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="min-w-[20px] h-5 bg-[#ef4444] text-white text-[9px] font-black rounded-full flex items-center justify-center px-1.5 shrink-0 shadow-sm">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </aside>
  );
}
