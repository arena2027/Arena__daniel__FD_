import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ArrowLeft, Send, MoreHorizontal,
  Phone, Video, X, MessageSquare, Bell, Bookmark, Slash,
  Eye, AlertCircle, Trash2
} from 'lucide-react';
import type { Message } from './MessageBubble';
import type { Chat } from './types';
import { Avatar } from './Avatar';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
  chat: Chat;
  onBack: () => void;
}

export function ChatWindow({ chat, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(chat.messages);
  const [input, setInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: `m${Date.now()}`,
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mine: true,
    }]);
    setInput('');
  };

  const handleReact = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, reaction: msg.reaction === emoji ? undefined : emoji };
      }
      return msg;
    }));
  };

  const handleDelete = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const startCall = () => {
    alert(`Calling ${chat.name}...`);
  };

  const startVideoCall = () => {
    alert(`Starting video call with ${chat.name}...`);
  };

  const handleMenuOption = (action: string) => {
    switch (action) {
      case 'search':
        alert('Search in conversation coming soon');
        break;
      case 'mute':
        alert('Notifications muted for this conversation');
        break;
      case 'pin':
        alert('Conversation pinned');
        break;
      case 'unread':
        alert('Marked as unread');
        break;
      case 'archive':
        alert('Conversation archived');
        break;
      case 'block':
        alert(`${chat.name} has been blocked`);
        break;
      case 'report':
        alert('Report submitted');
        break;
      case 'clear':
        setMessages([]);
        alert('Chat history cleared');
        break;
      case 'delete':
        alert('Conversation deleted');
        break;
      default:
        break;
    }
    setShowMenu(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1f1f1f] bg-black/95 backdrop-blur-sm shrink-0">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <Avatar name={chat.name} online={chat.online} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-white leading-tight">{chat.name}</p>
          <p className="text-[11px] text-[#71767b] mt-0.5">
            {chat.online ? '🟢 Online' : 'Last seen recently'}
          </p>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={startCall}
            className="p-2.5 rounded-full hover:bg-white/10 text-[#71767b] hover:text-white transition-colors duration-200"
            title="Call"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            onClick={startVideoCall}
            className="p-2.5 rounded-full hover:bg-white/10 text-[#71767b] hover:text-white transition-colors duration-200"
            title="Video call"
          >
            <Video className="w-5 h-5" />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2.5 rounded-full hover:bg-white/10 text-[#71767b] hover:text-white transition-colors duration-200"
              title="More options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-sm"
                >
                  <div className="divide-y divide-[#1f1f1f]">
                    {/* Conversation Actions */}
                    <div className="py-2 px-1">
                      <button
                        onClick={() => handleMenuOption('search')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#e7e9ea] hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Search className="w-4 h-4 text-[#71767b]" />
                        <span>Search in conversation</span>
                      </button>
                      <button
                        onClick={() => handleMenuOption('mute')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#e7e9ea] hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Bell className="w-4 h-4 text-[#71767b]" />
                        <span>Mute notifications</span>
                      </button>
                      <button
                        onClick={() => handleMenuOption('pin')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#e7e9ea] hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Bookmark className="w-4 h-4 text-[#71767b]" />
                        <span>Pin chat</span>
                      </button>
                      <button
                        onClick={() => handleMenuOption('unread')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#e7e9ea] hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-[#71767b]" />
                        <span>Mark as unread</span>
                      </button>
                      <button
                        onClick={() => handleMenuOption('archive')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#e7e9ea] hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-[#71767b]" />
                        <span>Archive conversation</span>
                      </button>
                    </div>
                    
                    {/* Safety / Control Actions */}
                    <div className="py-2 px-1">
                      <button
                        onClick={() => handleMenuOption('block')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#f4212e] hover:bg-red-600/10 rounded-lg transition-colors"
                      >
                        <Slash className="w-4 h-4" />
                        <span>Block user</span>
                      </button>
                      <button
                        onClick={() => handleMenuOption('report')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#f4212e] hover:bg-red-600/10 rounded-lg transition-colors"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>Report conversation/user</span>
                      </button>
                      <button
                        onClick={() => handleMenuOption('clear')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#f4212e] hover:bg-red-600/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Clear chat history</span>
                      </button>
                      <button
                        onClick={() => handleMenuOption('delete')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#f4212e] hover:bg-red-600/10 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Delete conversation</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            index={i} 
            onReact={handleReact} 
            onDelete={handleDelete} 
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-3.5 py-3 border-t border-[#1f1f1f] bg-black shrink-0">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Type a message..."
          className="flex-1 bg-[#111] border border-[#1f1f1f] px-4 py-2.5 rounded-full text-sm outline-none text-white placeholder:text-[#71767b] focus:border-[#ef4444]/40 focus:bg-[#0a0a0a] transition-all duration-200"
        />
        <button
          onClick={send}
          disabled={!input.trim()}
          className="w-10 h-10 bg-[#ef4444] rounded-full flex items-center justify-center hover:bg-[#dc2626] active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-md"
          title="Send message"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
