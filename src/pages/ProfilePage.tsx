import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Heart, MessageCircle, Repeat2, Share, Bookmark, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import type { AppUser } from '../App';

// ── Mock Data ─────────────────────────────────────────────────
const followedTipsters = [
  { id: 1, name: 'GoldTips', handle: '@goldtips', winRate: '74%', streak: 8 },
  { id: 2, name: 'UCL King', handle: '@uclking', winRate: '71%', streak: 11 },
  { id: 3, name: 'NBA Pro', handle: '@nbapro', winRate: '67%', streak: 6 },
  { id: 4, name: 'LaLiga', handle: '@laliga', winRate: '69%', streak: 5 },
];

const recentActivity = [
  { id: 1, text: 'Voted on Man City vs Arsenal prediction', time: '2h ago', emoji: '⚽' },
  { id: 2, text: 'Joined Premier League Fans community', time: '5h ago', emoji: '👥' },
  { id: 3, text: 'Subscribed to GoldTips VIP channel', time: '1d ago', emoji: '🎯' },
  { id: 4, text: 'Posted a prediction on UCL final', time: '2d ago', emoji: '🏆' },
  { id: 5, text: 'Followed NBA Central tipster', time: '3d ago', emoji: '🏀' },
];

const recentPredictions = ['W', 'W', 'L', 'W', 'L', 'W', 'W'];

const myPosts = [
  { id: 'p1', content: 'Man City are going to win the treble this season. Book it. 🏆🏆🏆', time: '2h ago', likes: 234, comments: 45, reposts: 12 },
  { id: 'p2', content: 'That Haaland hat-trick last night was something else. The man is not human 🤖⚽', time: '1d ago', likes: 891, comments: 123, reposts: 67 },
  { id: 'p3', content: 'Champions League is the best competition in world football. Nothing comes close.', time: '3d ago', likes: 445, comments: 89, reposts: 34 },
];

const followersList = [
  { id: 1, name: 'John Pulse', handle: '@johnpulse', verified: true },
  { id: 2, name: 'Sarah Kicks', handle: '@sarahkicks', verified: false },
  { id: 3, name: 'NBA Central', handle: '@nbacentral', verified: true },
  { id: 4, name: 'Transfer News', handle: '@transfernews', verified: true },
];

const subscriptions = [
  { id: 1, name: 'GoldTips VIP', handle: '@goldtipster', price: '₦2,500/mo', winRate: '74%', type: 'paid' },
  { id: 2, name: 'Arena Free Tips', handle: '@arenaofficial', price: 'Free', winRate: '61%', type: 'free' },
  { id: 3, name: 'Champions Elite', handle: '@uclking', price: '₦3,500/mo', winRate: '71%', type: 'paid' },
];

// ── Avatar ────────────────────────────────────────────────────
function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const colors = ['bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600'];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-[88px] h-[88px] text-3xl',
  };
  return (
    <div className={cn('rounded-full flex items-center justify-center font-black text-white shrink-0', sizes[size], color)}>
      {name[0].toUpperCase()}
    </div>
  );
}

// ── Win/Loss Row ──────────────────────────────────────────────
function WinLossRow({ data }: { data: string[] }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {data.map((d, i) => (
        <div key={i} className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white', d === 'W' ? 'bg-green-500' : 'bg-[#ef4444]')}>
          {d}
        </div>
      ))}
    </div>
  );
}

// ── Tipsters Grid ─────────────────────────────────────────────
function TipstersGrid() {
  const [following, setFollowing] = useState<Record<number, boolean>>({});
  return (
    <div className="bg-[#12121A] p-4 rounded-2xl border border-[#1f1f1f]">
      <h3 className="mb-4 text-sm font-bold text-white">Followed Tipsters</h3>
      <div className="grid grid-cols-2 gap-3">
        {followedTipsters.map(t => (
          <div key={t.id} className="bg-[#0d0d0d] p-3 rounded-xl border border-[#1f1f1f] flex flex-col gap-2">
            <Avatar name={t.name} size="md" />
            <div>
              <p className="text-sm font-bold text-white">{t.name}</p>
              <p className="text-xs text-[#71767b]">{t.handle}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-green-400 font-bold">{t.winRate} WR</span>
                <span className="text-[10px] text-[#ef4444] font-bold">🔥 {t.streak}</span>
              </div>
            </div>
            <button
              onClick={() => setFollowing(f => ({ ...f, [t.id]: !f[t.id] }))}
              className={cn('h-8 text-xs rounded-lg font-bold transition-all', following[t.id] ? 'border border-white/20 text-[#71767b]' : 'bg-[#ef4444] text-white hover:bg-[#dc2626]')}
            >
              {following[t.id] ? 'Following ✓' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Activity List ─────────────────────────────────────────────
function ActivityList() {
  return (
    <div className="bg-[#12121A] p-4 rounded-2xl border border-[#1f1f1f]">
      <h3 className="mb-3 text-sm font-bold text-white">Recent Activity</h3>
      {recentActivity.map(item => (
        <div key={item.id} className="flex items-center justify-between h-[56px] px-3 rounded-lg hover:bg-[#1A1A25] transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-full flex items-center justify-center text-sm shrink-0">
              {item.emoji}
            </div>
            <p className="text-sm text-[#e7e9ea] truncate max-w-[180px]">{item.text}</p>
          </div>
          <span className="text-xs text-[#71767b] shrink-0 ml-2">{item.time}</span>
        </div>
      ))}
    </div>
  );
}

// ── Right Panel ───────────────────────────────────────────────
function RightPanel({ isTipster, onBecomeTipster }: { isTipster: boolean; onBecomeTipster: () => void }) {
  const stats = [
    { value: '63%', label: 'Accuracy' },
    { value: '32', label: 'Predictions' },
    { value: '+12%', label: 'ROI' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-[#12121A] p-4 rounded-2xl border border-[#1f1f1f]">
        <h4 className="text-sm font-bold text-white mb-3">Prediction Record</h4>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {stats.map(s => (
            <div key={s.label} className="bg-[#0d0d0d] p-3 rounded-xl border border-[#1f1f1f] text-center">
              <p className="text-lg font-black text-white">{s.value}</p>
              <p className="text-[10px] text-[#71767b] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#71767b] mb-2">Last 7 predictions</p>
        <WinLossRow data={recentPredictions} />
      </div>

      <div className="bg-[#12121A] p-4 rounded-2xl border border-[#1f1f1f]">
        <h4 className="text-sm font-bold text-white mb-2">About</h4>
        <p className="text-sm text-[#71767b] leading-relaxed">Sports fan. Love predictions and good vibes.</p>
      </div>

      {/* Become Tipster CTA — only for regular users */}
      {!isTipster && (
        <div className="bg-gradient-to-br from-[#ef4444]/20 to-[#dc2626]/10 border border-[#ef4444]/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-[#ef4444]" />
            <p className="text-sm font-bold text-white">Become a Tipster</p>
          </div>
          <p className="text-xs text-[#71767b] mb-3 leading-relaxed">
            Share your expertise, build a channel and earn from your predictions.
          </p>
          <button
            onClick={onBecomeTipster}
            className="w-full py-2 bg-[#ef4444] rounded-xl text-xs font-bold text-white hover:bg-[#dc2626] transition-colors"
          >
            Apply Now
          </button>
        </div>
      )}

      {/* Tipster badge — only for tipsters */}
      {isTipster && (
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <p className="text-sm font-bold text-white">Verified Tipster</p>
          </div>
          <p className="text-xs text-[#71767b] leading-relaxed">
            You are a verified tipster. Your predictions and channels are featured across the platform.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────
function OverviewTab({ isTipster, onBecomeTipster }: { isTipster: boolean; onBecomeTipster: () => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-4">
        <TipstersGrid />
        <ActivityList />
      </div>
      <div className="flex flex-col gap-4">
        <RightPanel isTipster={isTipster} onBecomeTipster={onBecomeTipster} />
      </div>
    </div>
  );
}

// ── Posts Tab ─────────────────────────────────────────────────
function PostsTab({ appUser }: { appUser: AppUser }) {
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

  return (
    <div className="mt-2">
      {myPosts.map((post, i) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="px-4 py-3 border-b border-[#1f1f1f] hover:bg-white/[0.02] transition-colors cursor-pointer"
        >
          <div className="flex gap-3">
            <Avatar name={appUser.name} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <span className="font-bold text-sm text-white">{appUser.name}</span>
                {appUser.role === 'tipster' && (
                  <span className="text-[9px] bg-[#ef4444]/20 text-[#ef4444] px-1.5 py-0.5 rounded-full font-bold">TIPSTER</span>
                )}
                <span className="text-[#71767b] text-xs">{appUser.handle} · {post.time}</span>
              </div>
              <p className="text-sm text-[#e7e9ea] leading-relaxed mb-3">{post.content}</p>
              <div className="flex items-center justify-between text-[#71767b]">
                <button className="flex items-center gap-1.5 hover:text-[#ef4444] transition-colors group">
                  <div className="p-1.5 rounded-full group-hover:bg-[#ef4444]/10"><MessageCircle className="w-4 h-4" /></div>
                  <span className="text-xs">{fmt(post.comments)}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors group">
                  <div className="p-1.5 rounded-full group-hover:bg-green-500/10"><Repeat2 className="w-4 h-4" /></div>
                  <span className="text-xs">{fmt(post.reposts)}</span>
                </button>
                <button
                  onClick={() => setLiked(l => ({ ...l, [post.id]: !l[post.id] }))}
                  className={cn('flex items-center gap-1.5 transition-colors group', liked[post.id] ? 'text-[#ef4444]' : 'hover:text-[#ef4444]')}
                >
                  <div className="p-1.5 rounded-full group-hover:bg-[#ef4444]/10">
                    <Heart className={cn('w-4 h-4', liked[post.id] && 'fill-[#ef4444]')} />
                  </div>
                  <span className="text-xs">{fmt(post.likes + (liked[post.id] ? 1 : 0))}</span>
                </button>
                <button
                  onClick={() => setBookmarked(b => ({ ...b, [post.id]: !b[post.id] }))}
                  className={cn('flex items-center gap-1.5 transition-colors group', bookmarked[post.id] ? 'text-[#ef4444]' : 'hover:text-[#ef4444]')}
                >
                  <div className="p-1.5 rounded-full group-hover:bg-[#ef4444]/10">
                    <Bookmark className={cn('w-4 h-4', bookmarked[post.id] && 'fill-[#ef4444]')} />
                  </div>
                </button>
                <button className="flex items-center gap-1.5 hover:text-[#ef4444] transition-colors group">
                  <div className="p-1.5 rounded-full group-hover:bg-[#ef4444]/10"><Share className="w-4 h-4" /></div>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── People Tab ────────────────────────────────────────────────
function PeopleTab() {
  const [following, setFollowing] = useState<Record<number, boolean>>({});
  return (
    <div className="mt-2">
      {followersList.map((f, i) => (
        <motion.div
          key={f.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f1f] hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Avatar name={f.name} size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-sm text-white">{f.name}</p>
                {f.verified && (
                  <div className="w-4 h-4 rounded-full bg-[#ef4444] flex items-center justify-center shrink-0">
                    <Zap className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
              <p className="text-xs text-[#71767b]">{f.handle}</p>
            </div>
          </div>
          <button
            onClick={() => setFollowing(prev => ({ ...prev, [f.id]: !prev[f.id] }))}
            className={cn('px-3 py-1.5 rounded-full text-xs font-bold transition-all', following[f.id] ? 'border border-white/20 text-white' : 'bg-white text-black hover:bg-white/90')}
          >
            {following[f.id] ? 'Following ✓' : 'Follow'}
          </button>
        </motion.div>
      ))}
    </div>
  );
}

// ── Subscriptions Tab ─────────────────────────────────────────
function SubscriptionsTab() {
  return (
    <div className="mt-2 p-4 space-y-3">
      {subscriptions.map((sub, i) => (
        <motion.div
          key={sub.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-[#12121A] border border-[#1f1f1f] rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar name={sub.name} size="md" />
              <div>
                <p className="font-bold text-sm text-white">{sub.name}</p>
                <p className="text-xs text-[#71767b]">{sub.handle}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={cn('text-xs font-bold px-2 py-0.5 rounded-full', sub.type === 'paid' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400')}>
                {sub.type === 'paid' ? 'VIP' : 'FREE'}
              </p>
              <p className="text-sm font-black text-white mt-1">{sub.price}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-400 font-bold">{sub.winRate} Win Rate</span>
            <button className="px-3 py-1.5 border border-[#ef4444]/30 text-[#ef4444] text-xs font-bold rounded-full hover:bg-[#ef4444]/10 transition-colors">
              Manage
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Profile Page ──────────────────────────────────────────────
interface ProfilePageProps {
  appUser: AppUser;
  onBecameTipster: () => void;
}

export function ProfilePage({ appUser, onBecameTipster }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const isTipster = appUser.role === 'tipster';

  const tabs = ['Overview', 'Posts', 'Following', 'Followers', 'Subscriptions'];

  const handleBecomeTipster = () => {
    navigate('/become-tipster');
  };

  return (
    <div className="min-h-screen">
      {/* Cover */}
      <div className={cn(
        'h-24',
        isTipster
          ? 'bg-gradient-to-br from-yellow-500/30 via-orange-500/20 to-transparent'
          : 'bg-gradient-to-br from-[#ef4444]/30 via-[#dc2626]/20 to-transparent'
      )} />

      {/* Profile Header */}
      <div className="bg-[#12121A] border-b border-[#1f1f1f] px-4 pb-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end -mt-10 mb-4">
          <div className="ring-4 ring-[#12121A] rounded-full">
            <Avatar name={appUser.name || 'U'} size="xl" />
          </div>
          <div className="flex-1 mt-2 md:mt-0 md:pb-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-xl font-black text-white">{appUser.name || 'SportX Fan'}</h2>
              {isTipster && (
                <div className="flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-2 py-0.5">
                  <Trophy className="w-3 h-3 text-yellow-400" />
                  <span className="text-[10px] font-black text-yellow-400">TIPSTER</span>
                </div>
              )}
            </div>
            <p className="text-sm text-[#71767b]">{appUser.handle || '@user'}</p>
            <p className="text-sm text-[#e7e9ea] mt-1 max-w-[400px]">Sports fan. Love predictions and good vibes.</p>
            <div className="flex gap-6 mt-3">
              {[
                { value: 56, label: 'Followers' },
                { value: 28, label: 'Following' },
                { value: 3, label: 'Subscribed' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-lg font-black text-white">{s.value}</p>
                  <p className="text-xs text-[#71767b]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => setEditMode(e => !e)}
              className="h-10 px-4 rounded-xl border border-[#1f1f1f] text-sm font-bold text-white hover:border-white/20 transition-colors"
            >
              Edit Profile
            </button>
            {!isTipster && (
              <button
                onClick={handleBecomeTipster}
                className="h-10 px-4 rounded-xl bg-[#ef4444] text-sm font-bold text-white hover:bg-[#dc2626] transition-colors flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4" />
                Become Tipster
              </button>
            )}
            {isTipster && (
              <button
                onClick={() => navigate('/dashboard')}
                className="h-10 px-4 rounded-xl bg-yellow-500 text-sm font-bold text-black hover:bg-yellow-400 transition-colors flex items-center gap-1.5"
              >
                <Trophy className="w-4 h-4" />
                Dashboard
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {editMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 border-t border-[#1f1f1f] pt-4"
            >
              <input
                defaultValue={appUser.name}
                className="w-full bg-[#0d0d0d] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all"
                placeholder="Display Name"
              />
              <textarea
                defaultValue="Sports fan. Love predictions and good vibes."
                rows={2}
                className="w-full bg-[#0d0d0d] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none resize-none transition-all"
                placeholder="Bio"
              />
              <div className="flex gap-2">
                <button onClick={() => setEditMode(false)} className="flex-1 py-2 bg-[#ef4444] rounded-full text-sm font-bold text-white hover:bg-[#dc2626] transition-colors">Save</button>
                <button onClick={() => setEditMode(false)} className="flex-1 py-2 border border-[#1f1f1f] rounded-full text-sm font-bold text-[#71767b] hover:text-white transition-colors">Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1f1f1f] overflow-x-auto scrollbar-hide px-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'pb-3 pt-3 px-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2',
              activeTab === tab
                ? 'border-[#ef4444] text-white'
                : 'border-transparent text-[#71767b] hover:text-white'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="px-2 md:px-4"
        >
          {activeTab === 'Overview'      && <OverviewTab isTipster={isTipster} onBecomeTipster={handleBecomeTipster} />}
          {activeTab === 'Posts'         && <PostsTab appUser={appUser} />}
          {activeTab === 'Following'     && <PeopleTab />}
          {activeTab === 'Followers'     && <PeopleTab />}
          {activeTab === 'Subscriptions' && <SubscriptionsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}