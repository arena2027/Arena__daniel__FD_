import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ArrowLeft, Send, MoreHorizontal,
  Phone, Video, X, MessageSquare, Bell, Bookmark, Slash,
  Eye, AlertCircle, Trash2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useDetailView } from '../../contexts/DetailViewContext';

// ── Types ─────────────────────────────────────────────────────
interface Message {
  id: string;
  text: string;
  time: string;
  mine: boolean;
}

interface Chat {
  id: string;
  name: string;
  handle: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

// ── Mock Data ─────────────────────────────────────────────────
const chats: Chat[] = [
  {
    id: 'c1', name: 'John Pulse', handle: '@johnpulse',
    lastMessage: 'Did you see that goal last night? 🔥', time: '2m ago', unread: 3, online: true,
    messages: [
      { id: 'm1', text: 'Hey! Did you watch the match last night?', time: '20:01', mine: false },
      { id: 'm2', text: 'Yes! That goal was absolutely insane 🔥', time: '20:03', mine: true },
      { id: 'm3', text: 'Haaland is on another level this season', time: '20:04', mine: false },
      { id: 'm4', text: 'Did you see that goal last night? 🔥', time: '20:10', mine: false },
    ],
  },
  {
    id: 'c2', name: 'Sarah Kicks', handle: '@sarahkicks',
    lastMessage: 'I told you Liverpool would win 😂', time: '1h ago', unread: 0, online: true,
    messages: [
      { id: 'm1', text: 'Liverpool are going to smash Arsenal today', time: '15:00', mine: false },
      { id: 'm2', text: 'No way, Arsenal are in great form', time: '15:02', mine: true },
      { id: 'm3', text: 'I told you Liverpool would win 😂', time: '17:45', mine: false },
    ],
  },
  {
    id: 'c3', name: 'NBA Central', handle: '@nbacentral',
    lastMessage: 'Lakers vs Warriors tonight. You watching?', time: '2h ago', unread: 1, online: false,
    messages: [
      { id: 'm1', text: 'Lakers vs Warriors tonight. You watching?', time: '14:00', mine: false },
      { id: 'm2', text: 'Definitely! Big game tonight', time: '14:05', mine: true },
    ],
  },
  {
    id: 'c4', name: 'Transfer News', handle: '@transfernews',
    lastMessage: 'Big signing incoming tomorrow 👀', time: '3h ago', unread: 0, online: false,
    messages: [
      { id: 'm1', text: 'Big signing incoming tomorrow 👀', time: '12:00', mine: false },
      { id: 'm2', text: 'Who is it?? Tell me!', time: '12:01', mine: true },
      { id: 'm3', text: "Can't say yet. Watch this space 🤫", time: '12:03', mine: false },
    ],
  },
  {
    id: 'c5', name: 'UCL King', handle: '@uclking',
    lastMessage: 'Real Madrid to win the UCL. Final answer.', time: '5h ago', unread: 0, online: true,
    messages: [
      { id: 'm1', text: 'Who do you think wins the UCL this year?', time: '10:00', mine: true },
      { id: 'm2', text: 'Real Madrid to win the UCL. Final answer.', time: '10:05', mine: false },
    ],
  },
];

// ── Avatar ────────────────────────────────────────────────────
function Avatar({ name, online, size = 'md' }: { name: string; online?: boolean; size?: 'sm' | 'md' }) {
  const colors = ['bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600'];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-11 h-11 text-sm font-bold' };
  return (
    <div className="relative shrink-0">
      <div className={cn('rounded-full flex items-center justify-center font-black text-white', sizes[size], color)}>
        {name[0].toUpperCase()}
      </div>
      {online && (
        <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-black" />
      )}
    </div>
  );
}

// ── Chat View ─────────────────────────────────────────────────
function ChatView({ chat, onBack }: { chat: Chat; onBack: () => void }) {
  const [messages, setMessages] = useState(chat.messages);
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

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02, duration: 0.3 }}
            className={cn('flex', msg.mine ? 'justify-end' : 'justify-start')}
          >
            <div className={cn(
              'max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words',
              msg.mine
                ? 'bg-[#ef4444] text-white rounded-br-sm shadow-md'
                : 'bg-[#111] text-[#e7e9ea] border border-[#1f1f1f] rounded-bl-sm'
            )}>
              <p className="font-medium">{msg.text}</p>
              <p className={cn('text-[10px] mt-1.5', msg.mine ? 'text-white/50' : 'text-[#71767b]')}>
                {msg.time}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

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

// ── Messages Page ─────────────────────────────────────────────
export function MessagesPage() {
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [query, setQuery] = useState('');
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : false);
  const { setShowDetailView } = useDetailView();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isDesktop && !activeChat) {
      setActiveChat(chats[0]);
    }
  }, [isDesktop, activeChat]);

  // Update detail view state when chat is selected on mobile
  useEffect(() => {
    setShowDetailView(activeChat !== null && !isDesktop);
  }, [activeChat, isDesktop, setShowDetailView]);

  const filtered = chats.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.handle.toLowerCase().includes(query.toLowerCase())
  );

  const handleBackFromChat = () => {
    setActiveChat(null);
    setShowDetailView(false);
  };

  if (activeChat && !isDesktop) {
    return <ChatView chat={activeChat} onBack={handleBackFromChat} />;
  }

  return (
    <div className="h-[calc(100vh-56px)] flex overflow-hidden rounded-[28px] border border-[#1f1f1f] bg-[#070708] shadow-lg">
      <aside className="w-full md:w-[380px] border-r border-[#1f1f1f] bg-[#08090b] flex flex-col overflow-hidden">
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
                onClick={() => setActiveChat(chat)}
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

      <section className="hidden md:flex flex-1 flex-col bg-[#0b141a]">
        {activeChat ? <ChatView chat={activeChat} onBack={() => setActiveChat(null)} /> : <div className="flex h-full items-center justify-center text-[#71767b]">Select a conversation to view the thread.</div>}
      </section>
    </div>
  );
}
