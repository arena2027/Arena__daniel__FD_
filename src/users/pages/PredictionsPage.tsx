import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, TrendingUp, Zap, Star, Plus, X,
  Ticket, Lock, Check, ArrowLeft,
  Users, Smile, Mic, ChevronRight, Send,
  BarChart3, Layers, FileText, Image, Video,
  MessageCircle, Calendar, PieChart, Rocket
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useDetailView } from '../../contexts/DetailViewContext';
import { useAuth } from '../../auth/hooks/AuthContext';
import { CreatePredictionModal } from '../../components/modals/CreatePredictionModal';

// ── Types ─────────────────────────────────────────────────────
interface Match {
  home: string;
  away: string;
  odds: string;
  status: 'win' | 'lost' | 'pending';
}

interface FeedPost {
  id: string;
  code: string;
  time: string;
  matches: Match[];
  total: number;
  wins: number;
  losses: number;
  pending: number;
  reactions: { like: number; heart: number; fire: number; laugh: number; wow: number };
}

interface Channel {
  id: string;
  name: string;
  handle: string;
  verified: boolean;
  members: number;
  winRate: string;
  streak: number;
  type: 'paid' | 'free';
  price: string | null;
  lastPost: string;
  lastMessage: string;
  unread: number;
  joined: boolean;
  feed: FeedPost[];
}

// ── Mock Data ─────────────────────────────────────────────────
const channels: Channel[] = [
  {
    id: 'ch1', name: 'GoldTips VIP', handle: '@goldtipster',
    verified: true, members: 12400, winRate: '74%', streak: 8,
    type: 'paid', price: '₦2,500/mo', lastPost: '2h ago',
    lastMessage: 'Primary sidebar → chat list → main chat pane with fixed header and input bar.', unread: 3, joined: false,
    feed: [
      {
        id: 'f1', code: 'GOLD-7X2K', time: '2h ago',
        matches: [
          { home: 'Real Madrid', away: 'Bayern', odds: 'Lost', status: 'lost' },
          { home: 'Liverpool', away: 'AC Milan', odds: '1.85', status: 'win' },
          { home: 'Man City', away: 'PSG', odds: '2.10', status: 'pending' },
          { home: 'Barcelona', away: 'Atletico', odds: '1.75', status: 'win' },
        ],
        total: 12, wins: 7, losses: 3, pending: 2,
        reactions: { like: 107, heart: 65, fire: 82, laugh: 12, wow: 8 }
      },
      {
        id: 'f2', code: 'GOLD-6W9P', time: '1d ago',
        matches: [
          { home: 'Chelsea', away: 'Arsenal', odds: '2.10', status: 'win' },
          { home: 'Juventus', away: 'Napoli', odds: 'Lost', status: 'lost' },
          { home: 'Dortmund', away: 'Leipzig', odds: '1.90', status: 'win' },
        ],
        total: 8, wins: 5, losses: 2, pending: 1,
        reactions: { like: 891, heart: 340, fire: 210, laugh: 30, wow: 55 }
      },
    ],
  },
  {
    id: 'ch2', name: 'Arena Free Tips', handle: '@arenaofficial',
    verified: true, members: 48200, winRate: '61%', streak: 3,
    type: 'free', price: null, lastPost: '30m ago',
    lastMessage: 'Left-to-right hierarchy, unread badges, and responsive Tailwind layout summary.', unread: 12, joined: true,
    feed: [
      {
        id: 'f1', code: 'ARENA-MC1', time: '30m ago',
        matches: [
          { home: 'Man City', away: 'Arsenal', odds: '1.90', status: 'win' },
          { home: 'Lakers', away: 'Warriors', odds: '1.75', status: 'pending' },
          { home: 'PSG', away: 'Lyon', odds: '1.65', status: 'win' },
        ],
        total: 6, wins: 4, losses: 1, pending: 1,
        reactions: { like: 567, heart: 200, fire: 310, laugh: 20, wow: 45 }
      },
    ],
  },
  {
    id: 'ch3', name: 'LaLiga Insider', handle: '@spainexpert',
    verified: false, members: 5800, winRate: '69%', streak: 5,
    type: 'paid', price: '₦1,500/mo', lastPost: '4h ago',
    lastMessage: 'Scrollable message feed and fixed footer structure for the main chat screen.', unread: 0, joined: false,
    feed: [
      {
        id: 'f1', code: 'LALIGA-RC1', time: '4h ago',
        matches: [
          { home: 'Real Madrid', away: 'Man City', odds: '2.10', status: 'win' },
          { home: 'Atletico', away: 'Barcelona', odds: '1.85', status: 'pending' },
        ],
        total: 5, wins: 3, losses: 1, pending: 1,
        reactions: { like: 189, heart: 90, fire: 120, laugh: 8, wow: 15 }
      },
    ],
  },
  {
    id: 'ch4', name: 'NBA Picks Daily', handle: '@basketballpro',
    verified: true, members: 9100, winRate: '67%', streak: 6,
    type: 'free', price: null, lastPost: '1h ago',
    lastMessage: 'Navigation, conversation directory, and content pane arranged for mobile-first clarity.', unread: 5, joined: true,
    feed: [
      {
        id: 'f1', code: 'NBA-LW22', time: '1h ago',
        matches: [
          { home: 'Lakers', away: 'Warriors', odds: '1.91', status: 'win' },
          { home: 'Celtics', away: 'Heat', odds: '1.70', status: 'win' },
          { home: 'Bucks', away: 'Nets', odds: '1.85', status: 'pending' },
        ],
        total: 7, wins: 5, losses: 1, pending: 1,
        reactions: { like: 445, heart: 180, fire: 290, laugh: 25, wow: 60 }
      },
    ],
  },
  {
    id: 'ch5', name: 'Champions Elite', handle: '@uclking',
    verified: true, members: 22000, winRate: '71%', streak: 11,
    type: 'paid', price: '₦3,500/mo', lastPost: '6h ago',
    lastMessage: 'Fixed sidebar, chat list, and main content area to resolve overlap and nested scrolling.', unread: 0, joined: false,
    feed: [
      {
        id: 'f1', code: 'UCL-QF01', time: '6h ago',
        matches: [
          { home: 'Real Madrid', away: 'Man City', odds: '1.80', status: 'win' },
          { home: 'Bayern', away: 'Arsenal', odds: '2.00', status: 'win' },
          { home: 'PSG', away: 'Dortmund', odds: '1.75', status: 'pending' },
        ],
        total: 10, wins: 8, losses: 1, pending: 1,
        reactions: { like: 1100, heart: 520, fire: 780, laugh: 40, wow: 110 }
      },
    ],
  },
];

// ── Avatar ────────────────────────────────────────────────────
function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const colors = ['bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600'];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-11 h-11 text-sm' };
  return (
    <div className={cn('rounded-full flex items-center justify-center font-black text-white shrink-0', sizes[size], color)}>
      {name[0].toUpperCase()}
    </div>
  );
}

// ── Channel Row ───────────────────────────────────────────────
function ChannelRow({ ch, active, onTap }: { ch: Channel; active: boolean; onTap: () => void }) {
  return (
    <motion.div
      whileTap={{ scale: 0.99 }}
      onClick={onTap}
      className={cn(
        'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-[#1f1f1f]',
        active ? 'bg-[#ef4444]/10 border-l-2 border-l-[#ef4444]' : 'hover:bg-white/[0.02]'
      )}
    >
      <div className="relative shrink-0">
        <Avatar name={ch.name} />
        {ch.verified && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#ef4444] rounded-full flex items-center justify-center ring-2 ring-black">
            <Star className="w-2.5 h-2.5 text-white fill-white" />
          </div>
        )}
        {!ch.joined && ch.type === 'paid' && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center ring-2 ring-black">
            <Lock className="w-2.5 h-2.5 text-black" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <p className="text-sm font-bold truncate text-white">{ch.name}</p>
            {ch.type === 'paid'
              ? <span className="text-[9px] bg-yellow-500/20 text-yellow-400 px-1 rounded font-bold shrink-0">VIP</span>
              : <span className="text-[9px] bg-green-500/20 text-green-400 px-1 rounded font-bold shrink-0">FREE</span>
            }
          </div>
          <span className="text-[11px] text-[#71767b] shrink-0 ml-2">{ch.lastPost}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-[#71767b] truncate flex-1">{ch.lastMessage}</p>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] text-green-400 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" />{ch.winRate}
            </span>
            <span className="text-[10px] text-[#ef4444] font-bold flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5" />{ch.streak}
            </span>
            {ch.unread > 0 && (
              <span className="min-w-[18px] h-[18px] bg-[#ef4444] text-white text-[9px] font-black rounded-full flex items-center justify-center px-1">
                {ch.unread > 9 ? '9+' : ch.unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Action Menu Item ─────────────────────────────────────────
function ActionMenuItem({
  icon,
  label,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm text-white group"
    >
      <span className="text-[#ef4444] group-hover:text-white transition-colors">{icon}</span>
      <span className="text-left">{label}</span>
      <ChevronRight className="w-3.5 h-3.5 text-[#71767b] group-hover:text-[#ef4444] transition-colors ml-auto" />
    </button>
  );
}

// ── Channel Feed ──────────────────────────────────────────────
function ChannelFeed({ ch, onBack }: { ch: Channel; onBack: () => void }) {
  const [joined, setJoined] = useState(ch.joined);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [message, setMessage] = useState('');
  const [showCreatePredictionModal, setShowCreatePredictionModal] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1f1f1f] bg-black/90 backdrop-blur shrink-0">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <Avatar name={ch.name} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <p className="font-bold text-sm text-white">{ch.name}</p>
            {ch.verified && <Star className="w-3 h-3 text-[#ef4444] fill-[#ef4444]" />}
          </div>
          <p className="text-[11px] text-[#71767b]">{ch.members.toLocaleString()} members · {ch.winRate} win rate</p>
        </div>
        <button
          onClick={() => setJoined(j => !j)}
          className={cn(
            'px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0',
            joined
              ? 'border border-white/20 text-[#71767b] hover:border-[#ef4444]/50 hover:text-[#ef4444]'
              : 'bg-gradient-to-r from-[#dc2626] to-[#ef4444] text-white'
          )}
        >
          {joined ? 'Joined ✓' : ch.type === 'paid' ? `Join · ${ch.price}` : 'Join Free'}
        </button>
      </div>

      <div className="flex items-center gap-4 px-4 py-2 border-b border-[#1f1f1f] shrink-0">
        <span className="flex items-center gap-1 text-[11px] text-green-400 font-bold">
          <TrendingUp className="w-3 h-3" />{ch.winRate} Win Rate
        </span>
        <span className="flex items-center gap-1 text-[11px] text-[#ef4444] font-bold">
          <Zap className="w-3 h-3" />{ch.streak} Streak
        </span>
        <span className="flex items-center gap-1 text-[11px] text-[#71767b]">
          <Users className="w-3 h-3" />{ch.members.toLocaleString()}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {ch.type === 'paid' && !joined && (
          <div className="p-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 text-center">
            <Lock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="font-bold text-sm mb-1 text-white">VIP Channel</p>
            <p className="text-xs text-[#71767b] mb-3">Join to unlock all tips and predictions</p>
            <button
              onClick={() => setJoined(true)}
              className="px-5 py-2 bg-gradient-to-r from-[#dc2626] to-[#ef4444] rounded-full text-sm font-bold text-white"
            >
              Join for {ch.price}
            </button>
            <p className="text-[10px] text-[#71767b] mt-2">Preview below ↓</p>
          </div>
        )}

        {ch.feed.map((post, i) => {
          const isExpanded = expanded[post.id];
          const visible = isExpanded ? post.matches : post.matches.slice(0, 3);
          const isBlurred = ch.type === 'paid' && !joined && i > 0;

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn(isBlurred && 'blur-sm pointer-events-none select-none')}
            >
              <div className="bg-[#111] border border-[#ef4444]/20 rounded-xl p-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-[#ef4444]" />
                    Code: {post.code}
                  </span>
                  <span className="text-[#71767b] text-xs">{post.time}</span>
                </div>
                <div className="text-xs text-[#71767b] mb-2 flex items-center gap-2">
                  <span>Total: {post.total}</span>
                  <span className="text-green-400 font-bold">✓ {post.wins}W</span>
                  <span className="text-[#ef4444] font-bold">✗ {post.losses}L</span>
                  <span className="text-yellow-400 font-bold">⏳ {post.pending}</span>
                </div>
                <div className="space-y-1.5 mb-3">
                  {visible.map((m, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b border-white/[0.04] last:border-0">
                      <span className="text-sm text-white/80">{m.home} vs {m.away}</span>
                      <span className={cn('text-xs font-bold',
                        m.status === 'win' && 'text-green-400',
                        m.status === 'lost' && 'text-[#ef4444]',
                        m.status === 'pending' && 'text-yellow-400'
                      )}>
                        {m.status === 'win' ? `✓ ${m.odds}` : m.status === 'lost' ? '✗ Lost' : `⏳ ${m.odds}`}
                      </span>
                    </div>
                  ))}
                </div>
                {post.total > 3 && (
                  <button
                    onClick={() => setExpanded(e => ({ ...e, [post.id]: !e[post.id] }))}
                    className="w-full text-center text-xs border border-[#ef4444]/30 rounded-lg py-2 text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors mb-3"
                  >
                    {isExpanded ? 'Show less ↑' : `View all ${post.total} games (+${post.total - 3} more)`}
                  </button>
                )}
                <div className="flex items-center gap-4 text-xs text-[#71767b]">
                  <span>👍 {post.reactions.like}</span>
                  <span>❤️ {post.reactions.heart}</span>
                  <span>🔥 {post.reactions.fire}</span>
                  <span>😂 {post.reactions.laugh}</span>
                  <span>😮 {post.reactions.wow}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 px-3 py-2 border-t border-[#1f1f1f] bg-black shrink-0">
          {/* Action Button */}
          <button
            onClick={() => setShowActionMenu(!showActionMenu)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#111] border border-[#1f1f1f] text-[#71767b] hover:border-[#ef4444]/30 hover:text-white transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Message Input */}
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && message.trim()) {
                setMessage('');
              }
            }}
            placeholder="Message..."
            className="flex-1 bg-[#111] px-3 py-2 rounded-full text-sm outline-none text-white placeholder:text-[#71767b] border border-[#1f1f1f] focus:border-[#ef4444]/30 transition-all"
          />

          {/* Emoji & Mic */}
          <Smile className="w-5 h-5 text-[#71767b] cursor-pointer hover:text-white transition-colors" />
          <Mic className="w-5 h-5 text-[#71767b] cursor-pointer hover:text-white transition-colors" />

          {/* Post Button */}
          <button
            onClick={() => {
              if (message.trim()) {
                setMessage('');
              }
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#dc2626] to-[#ef4444] text-white hover:shadow-lg hover:shadow-red-500/50 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Action Menu */}
        <AnimatePresence>
          {showActionMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-14 left-3 z-50 w-56 bg-[#0d0d0d] border border-[#1f1f1f] rounded-2xl shadow-xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-2">
                {/* Predictions Section */}
                <div className="mb-2">
                  <p className="text-[10px] font-bold text-[#71767b] uppercase px-2 py-1.5">Predictions</p>
                  <ActionMenuItem icon={<BarChart3 className="w-4 h-4" />} label="Create Prediction" onClick={() => {
                    setShowActionMenu(false);
                    setShowCreatePredictionModal(true);
                  }} />
                  <ActionMenuItem icon={<Star className="w-4 h-4" />} label="Premium Prediction" onClick={() => setShowActionMenu(false)} />
                  <ActionMenuItem icon={<Layers className="w-4 h-4" />} label="Multi-Bet" onClick={() => setShowActionMenu(false)} />
                  <ActionMenuItem icon={<Zap className="w-4 h-4" />} label="Live Prediction" onClick={() => setShowActionMenu(false)} />
                </div>

                <div className="h-px bg-[#1f1f1f] my-2" />

                {/* Content Section */}
                <div className="mb-2">
                  <p className="text-[10px] font-bold text-[#71767b] uppercase px-2 py-1.5">Content</p>
                  <ActionMenuItem icon={<FileText className="w-4 h-4" />} label="Match Analysis" onClick={() => setShowActionMenu(false)} />
                  <ActionMenuItem icon={<Ticket className="w-4 h-4" />} label="Betting Slip" onClick={() => setShowActionMenu(false)} />
                  <ActionMenuItem icon={<Image className="w-4 h-4" />} label="Upload Screenshot" onClick={() => setShowActionMenu(false)} />
                  <ActionMenuItem icon={<Video className="w-4 h-4" />} label="Upload Video" onClick={() => setShowActionMenu(false)} />
                </div>

                <div className="h-px bg-[#1f1f1f] my-2" />

                {/* Engagement Section */}
                <div>
                  <p className="text-[10px] font-bold text-[#71767b] uppercase px-2 py-1.5">Engagement</p>
                  <ActionMenuItem icon={<MessageCircle className="w-4 h-4" />} label="Subscriber Update" onClick={() => setShowActionMenu(false)} />
                  <ActionMenuItem icon={<Calendar className="w-4 h-4" />} label="Schedule Post" onClick={() => setShowActionMenu(false)} />
                  <ActionMenuItem icon={<PieChart className="w-4 h-4" />} label="Poll" onClick={() => setShowActionMenu(false)} />
                  <ActionMenuItem icon={<Rocket className="w-4 h-4" />} label="Promote Prediction" onClick={() => setShowActionMenu(false)} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Prediction Modal */}
      <CreatePredictionModal
        isOpen={showCreatePredictionModal}
        onClose={() => setShowCreatePredictionModal(false)}
        onSubmit={(data) => {
          console.log('Prediction submitted:', data);
          setShowCreatePredictionModal(false);
          // TODO: Send to backend
        }}
      />
    </div>
  );
}

// ── Add Modal ─────────────────────────────────────────────────
function AddModal({ onClose }: { onClose: () => void }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { found: boolean; name?: string }>(null);

  const find = async () => {
    if (!code.trim()) return;
    setLoading(true); setResult(null);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);
    setResult(code.length > 3 ? { found: true, name: 'Elite Tips Channel' } : { found: false });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="w-full bg-[#0d0d0d] border-t border-[#1f1f1f] rounded-t-3xl px-5 pt-3 pb-10"
      >
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-black text-base text-white">Join a Channel</h3>
            <p className="text-xs text-[#71767b] mt-0.5">Enter invite code or channel name</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10">
            <X className="w-4 h-4 text-[#71767b]" />
          </button>
        </div>
        <div className="flex gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 focus-within:border-[#ef4444]/50 rounded-xl px-3 py-2.5 transition-all">
            <Ticket className="w-4 h-4 text-[#71767b] shrink-0" />
            <input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="GOLD-7X2K or channel name"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-[#71767b] outline-none tracking-wider"
            />
          </div>
          <button
            onClick={find}
            className="px-4 bg-gradient-to-r from-[#dc2626] to-[#ef4444] rounded-xl text-xs font-black text-white"
          >
            {loading ? '...' : 'Find'}
          </button>
        </div>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={cn('p-4 rounded-xl border', result.found ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10')}
          >
            {result.found ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-white">{result.name}</p>
                  <p className="text-xs text-green-400 mt-0.5">Channel found ✓</p>
                </div>
                <button onClick={onClose} className="px-4 py-2 bg-green-500 rounded-lg text-xs font-bold text-white flex items-center gap-1">
                  <Check className="w-3 h-3" /> Join
                </button>
              </div>
            ) : (
              <p className="text-sm text-[#71767b] text-center">No channel found for that code</p>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Leaderboard ───────────────────────────────────────────────
function Leaderboard({ onSelect }: { onSelect: (name: string) => void }) {
  const tipsters = [
    { rank: 1, name: 'GoldTips VIP', winRate: '74%', streak: 8, members: 12400, badge: '🥇' },
    { rank: 2, name: 'Champions Elite', winRate: '71%', streak: 11, members: 22000, badge: '🥈' },
    { rank: 3, name: 'LaLiga Insider', winRate: '69%', streak: 5, members: 5800, badge: '🥉' },
    { rank: 4, name: 'NBA Picks Daily', winRate: '67%', streak: 6, members: 9100, badge: '' },
    { rank: 5, name: 'Arena Free Tips', winRate: '61%', streak: 3, members: 48200, badge: '' },
  ];

  return (
    <div>
      <div className="px-4 py-3 border-b border-[#1f1f1f]">
        <h2 className="text-base font-black text-white">Top Tipsters</h2>
        <p className="text-xs text-[#71767b] mt-0.5">Ranked by win rate this month</p>
      </div>
      {tipsters.map((t, i) => (
        <motion.div
          key={t.rank}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSelect(t.name)}
          className="flex items-center gap-3 px-4 py-3 border-b border-[#1f1f1f] hover:bg-white/[0.02] cursor-pointer transition-colors"
        >
          <div className="w-8 text-center">
            {t.badge
              ? <span className="text-lg">{t.badge}</span>
              : <span className="text-sm font-black text-[#71767b]">#{t.rank}</span>
            }
          </div>
          <div className="w-9 h-9 rounded-full bg-[#ef4444]/10 border border-[#ef4444]/20 flex items-center justify-center font-black text-[#ef4444] text-sm shrink-0">
            {t.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-white truncate">{t.name}</p>
            <p className="text-xs text-[#71767b]">{t.members.toLocaleString()} members</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-black text-green-400">{t.winRate}</p>
            <p className="text-xs text-[#ef4444] flex items-center gap-0.5 justify-end">
              <Zap className="w-3 h-3" />{t.streak}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#71767b]" />
        </motion.div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export function PredictionsPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [tab, setTab] = useState<'channels' | 'leaderboard'>('channels');
  const navigate = useNavigate();
  const { setShowDetailView } = useDetailView();
  const { user } = useAuth();

  const isTipster = user?.role === 'tipster';

  const activeChannel = channels.find(c => c.id === activeId) ?? null;

  // Update detail view state when channel is selected
  const handleSelectChannel = (channelId: string) => {
    setActiveId(channelId);
    setShowDetailView(true);
  };

  const handleBackFromChannel = () => {
    setActiveId(null);
    setShowDetailView(false);
  };

  const filtered = channels.filter(ch => {
    const q = query.toLowerCase();
    return ch.name.toLowerCase().includes(q) || ch.handle.toLowerCase().includes(q);
  });

  if (activeChannel) {
    return <ChannelFeed ch={activeChannel} onBack={handleBackFromChannel} />;
  }

  return (
    <div>
      <div className="sticky top-14 z-20 bg-black/90 backdrop-blur-md border-b border-[#1f1f1f]">
        <div className="flex items-center gap-2 px-4 py-3">
          <h1 className="text-lg font-black text-white flex-1">Predictions</h1>
          {isTipster && (
            <button
              onClick={() => setShowAdd(true)}
              title="Create a new prediction channel (Tipsters only)"
              className="w-8 h-8 bg-gradient-to-br from-[#dc2626] to-[#ef4444] rounded-xl flex items-center justify-center shadow-md shadow-red-500/30 hover:shadow-lg hover:shadow-red-500/50 transition-all"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 px-4 pb-2">
          {(['channels', 'leaderboard'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-bold transition-all',
                tab === t ? 'bg-[#ef4444] text-white' : 'text-[#71767b] hover:text-white hover:bg-white/5'
              )}
            >
              {t === 'channels' ? '📡 Channels' : '🏆 Leaderboard'}
            </button>
          ))}
        </div>

        {tab === 'channels' && (
          <div className="px-3 pb-3">
            <div className="flex items-center gap-2 bg-[#111] rounded-full px-3 py-2 border border-[#1f1f1f] focus-within:border-[#ef4444]/30 transition-all">
              <Search className="w-4 h-4 text-[#71767b] shrink-0" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search channels..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-[#71767b] outline-none"
              />
              {query && <button onClick={() => setQuery('')}><X className="w-3.5 h-3.5 text-[#71767b]" /></button>}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'channels' && (
          <motion.div key="channels" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center gap-3 px-4 py-2 border-b border-[#1f1f1f]">
              <span className="text-[10px] text-[#71767b]">{channels.length} channels</span>
              <span className="text-[10px] text-green-400">{channels.filter(c => c.joined).length} joined</span>
              <span className="text-[10px] text-[#71767b]">{channels.filter(c => c.type === 'free').length} free</span>
            </div>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-3xl mb-3">📡</p>
                <p className="font-bold text-sm text-white">No channels found</p>
              </div>
            ) : filtered.map(ch => (
              <ChannelRow key={ch.id} ch={ch} active={activeId === ch.id} onTap={() => handleSelectChannel(ch.id)} />
            ))}
          </motion.div>
        )}

        {tab === 'leaderboard' && (
          <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Leaderboard onSelect={(name) => navigate(`/user/${encodeURIComponent(name)}`)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdd && <AddModal onClose={() => setShowAdd(false)} />}
      </AnimatePresence>
    </div>
  );
}
