import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ArrowLeft, Send, MoreHorizontal,
  Phone, Video, X
} from 'lucide-react';
import { cn } from '../../lib/utils';

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
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-11 h-11 text-sm' };
  return (
    <div className="relative shrink-0">
      <div className={cn('rounded-full flex items-center justify-center font-black text-white', sizes[size], color)}>
        {name[0].toUpperCase()}
      </div>
      {online && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-black" />
      )}
    </div>
  );
}

// ── Chat View ─────────────────────────────────────────────────
function ChatView({ chat, onBack }: { chat: Chat; onBack: () => void }) {
  const [messages, setMessages] = useState(chat.messages);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const openChatOptions = () => {
    alert('More chat actions will be added soon.');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1f1f1f] bg-black/90 backdrop-blur shrink-0">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <Avatar name={chat.name} online={chat.online} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-white">{chat.name}</p>
          <p className="text-[11px] text-[#71767b]">
            {chat.online ? '🟢 Online' : 'Last seen recently'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={startCall}
            className="p-2 rounded-full hover:bg-white/5 text-[#71767b] hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={startVideoCall}
            className="p-2 rounded-full hover:bg-white/5 text-[#71767b] hover:text-white transition-colors"
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            onClick={openChatOptions}
            className="p-2 rounded-full hover:bg-white/5 text-[#71767b] hover:text-white transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={cn('flex', msg.mine ? 'justify-end' : 'justify-start')}
          >
            <div className={cn(
              'max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
              msg.mine
                ? 'bg-[#ef4444] text-white rounded-br-sm'
                : 'bg-[#111] text-[#e7e9ea] border border-[#1f1f1f] rounded-bl-sm'
            )}>
              <p>{msg.text}</p>
              <p className={cn('text-[10px] mt-1', msg.mine ? 'text-white/60 text-right' : 'text-[#71767b]')}>
                {msg.time}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 px-3 py-2 border-t border-[#1f1f1f] bg-black shrink-0">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Type a message..."
          className="flex-1 bg-[#111] border border-[#1f1f1f] px-4 py-2.5 rounded-full text-sm outline-none text-white placeholder:text-[#71767b] focus:border-[#ef4444]/30 transition-all"
        />
        <button
          onClick={send}
          disabled={!input.trim()}
          className="w-9 h-9 bg-[#ef4444] rounded-full flex items-center justify-center hover:bg-[#dc2626] transition-colors disabled:opacity-40 shrink-0"
        >
          <Send className="w-4 h-4 text-white" />
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

  const filtered = chats.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.handle.toLowerCase().includes(query.toLowerCase())
  );

  if (activeChat && !isDesktop) {
    return <ChatView chat={activeChat} onBack={() => setActiveChat(null)} />;
  }

  return (
    <div className="h-[calc(100vh-56px)] flex overflow-hidden rounded-[28px] border border-[#1f1f1f] bg-[#070708] shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
      <aside className="w-full md:w-[380px] border-r border-[#1f1f1f] bg-[#08090b] flex flex-col">
        <div className="border-b border-[#1f1f1f] bg-black/70 backdrop-blur-md px-4 py-4 shrink-0">
          <h1 className="text-lg font-black text-white mb-3">Messages</h1>
          <div className="flex items-center gap-2 bg-[#111] rounded-full px-4 py-2 border border-[#1f1f1f] focus-within:border-[#ef4444]/30 transition-all">
            <Search className="w-4 h-4 text-[#71767b] shrink-0" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search conversations..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-[#71767b] outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')}>
                <X className="w-4 h-4 text-[#71767b] hover:text-white" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-8">
                <p className="text-4xl mb-3">💬</p>
                <p className="font-bold text-white mb-1">No messages found</p>
                <p className="text-sm text-[#71767b]">Start a conversation with someone</p>
              </div>
            ) : filtered.map((chat, i) => (
              <motion.button
                key={chat.id}
                type="button"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setActiveChat(chat)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 border-b border-[#1f1f1f] text-left transition-colors',
                  activeChat?.id === chat.id ? 'bg-[#ef4444]/10' : 'hover:bg-white/[0.02]'
                )}
              >
                <Avatar name={chat.name} online={chat.online} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-bold text-sm text-white truncate">{chat.name}</p>
                    <span className="text-[11px] text-[#71767b] shrink-0 ml-2">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-[#71767b] truncate flex-1">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <span className="min-w-[18px] h-[18px] bg-[#ef4444] text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 shrink-0">
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
