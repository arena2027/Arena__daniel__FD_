import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Heart, MessageCircle, Repeat2, Share, Bookmark, Trophy, Upload, X, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import type { AppUser } from '../../core/types';

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
function Avatar({ name, size = 'md', image }: { name: string; size?: 'sm' | 'md' | 'lg' | 'xl'; image?: string }) {
  const colors = ['bg-[#ef4444]', 'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600'];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-24 h-24 text-4xl',
  };

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={cn('rounded-full object-cover shrink-0', sizes[size])}
      />
    );
  }

  return (
    <div className={cn('rounded-full flex items-center justify-center font-black text-white shrink-0', sizes[size], color)}>
      {name[0].toUpperCase()}
    </div>
  );
}



// ── Tipsters Grid ─────────────────────────────────────────────
function TipstersGrid() {
  const [following, setFollowing] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
  });

  return (
    <div className="py-2">
      <h3 className="text-base font-bold text-white mb-3">Followed Tipsters</h3>
      <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {followedTipsters.map(t => (
          <div 
            key={t.id} 
            className="bg-[#0b0c0e] p-3 rounded-2xl border border-[#1f1f1f] flex items-center justify-between min-w-[245px] w-[245px] shrink-0"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 flex items-center justify-center font-black text-black text-sm shrink-0 shadow-md">
                {t.name[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate leading-tight">{t.name}</p>
                <p className="text-xs text-green-400 font-bold mt-0.5">{t.winRate} WR 🔥</p>
              </div>
            </div>
            <button
              onClick={() => setFollowing(f => ({ ...f, [t.id]: !f[t.id] }))}
              className={cn(
                'h-8 px-4 text-xs font-bold rounded-full transition-all shrink-0',
                following[t.id] 
                  ? 'bg-[#ef4444] text-white hover:bg-[#dc2626]' 
                  : 'border border-white/20 text-[#71767b]'
              )}
            >
              {following[t.id] ? 'Follow' : 'Followed'}
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
    <div className="bg-[#0b0c0e] p-4 rounded-2xl border border-[#1f1f1f] relative">
      <h3 className="mb-4 text-base font-bold text-white">Recent Activity</h3>
      
      {/* Vertical timeline line on the right side */}
      <div className="absolute right-[54px] top-[74px] bottom-[34px] w-[1px] bg-[#1f1f1f] z-0" />
      
      <div className="space-y-4">
        {recentActivity.map(item => (
          <div key={item.id} className="flex items-center gap-3 relative z-10">
            {/* Left Icon */}
            <div className="w-8 h-8 rounded-full bg-[#16171a] flex items-center justify-center text-sm shrink-0 border border-[#1f1f1f]">
              {item.emoji}
            </div>
            
            {/* Middle Text */}
            <div className="flex-1 min-w-0 pr-8">
              <p className="text-xs md:text-sm text-[#e7e9ea] truncate font-medium">
                {item.text}
              </p>
            </div>

            {/* Timeline Dot */}
            <div className="absolute right-[49px] w-2.5 h-2.5 rounded-full bg-[#ef4444] border border-black shrink-0" />

            {/* Right Timestamp */}
            <span className="text-xs text-[#71767b] w-8 text-right shrink-0">
              {item.time.replace(' ago', '')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Prediction Record ─────────────────────────────────────────
function PredictionRecord() {
  const badges = [
    { outcome: 'W', label: '4W-30' },
    { outcome: 'W', label: '4W-2L' },
    { outcome: 'L', label: '06-28' },
    { outcome: 'W', label: '06-28' },
    { outcome: 'L', label: '06-29' },
    { outcome: 'L', label: '06-23' },
    { outcome: 'W', label: '06-21' },
    { outcome: 'L', label: '06-21' },
  ];

  const stats = [
    { value: '71%', label: '% WR', isGreen: false },
    { value: '1.8', label: 'Avg Odds', isGreen: false },
    { value: '32', label: 'Predictions', isGreen: false },
    { value: '+12%', label: 'ROI', isGreen: true },
  ];

  return (
    <div className="bg-[#0b0c0e] p-4 rounded-2xl border border-[#1f1f1f]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-base font-bold text-white">Prediction Record</h3>
        <div className="text-xs font-semibold text-[#71767b]">
          Record: <span className="text-green-500 font-bold">4W</span>-<span className="text-[#ef4444] font-bold">3L</span>, Streak: <span className="text-green-500 font-bold">W2</span>
        </div>
      </div>

      {/* Badges Row */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none pb-4 border-b border-[#1f1f1f] mb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {badges.map((b, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 min-w-[36px]">
            <div 
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shadow-sm',
                b.outcome === 'W' ? 'bg-green-500' : 'bg-[#ef4444]'
              )}
            >
              {b.outcome}
            </div>
            <span className="text-[10px] text-[#71767b] font-medium">{b.label}</span>
          </div>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {stats.map(s => (
          <div key={s.label}>
            <p className={cn('text-lg font-black', s.isGreen ? 'text-green-400' : 'text-white')}>
              {s.value}
            </p>
            <p className="text-[10px] text-[#71767b] font-bold mt-0.5 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────
function OverviewTab({ isTipster, onBecomeTipster }: { isTipster: boolean; onBecomeTipster: () => void }) {
  return (
    <div className="flex flex-col gap-4 mt-4 max-w-2xl mx-auto">
      <TipstersGrid />
      <ActivityList />
      <PredictionRecord />
      
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
}

export function ProfilePage({ appUser }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [editMode, setEditMode] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [editForm, setEditForm] = useState({
    name: appUser.name,
    bio: 'Sports fan. Love predictions and good vibes.',
    profilePicture: appUser.profilePicture,
  });
  const [uploading, _setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>(appUser.profilePicture);
  const navigate = useNavigate();
  const isTipster = appUser.role === 'tipster';

  const tabs = ['Overview', 'Posts', 'Following', 'Followers', 'Subscriptions'];

  const handleBecomeTipster = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    navigate('/become-tipster');
  };

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreviewImage(result);
      setEditForm(prev => ({ ...prev, profilePicture: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePicture = () => {
    setPreviewImage(undefined);
    setEditForm(prev => ({ ...prev, profilePicture: undefined }));
  };

  const handleSaveProfile = () => {
    setEditMode(false);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Redesigned Header: Centered layout matching reference image */}
      <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-md border-b border-[#1f1f1f] px-4 py-3.5 flex items-center justify-between">
        <div className="w-10 shrink-0" />
        <h1 className="text-base font-black text-white text-center flex-1">Profile</h1>
        <button 
          onClick={() => navigate('/settings')} 
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors shrink-0"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Centered Profile Details Section */}
      <div className="bg-black border-b border-[#1f1f1f] px-4 py-8 flex flex-col items-center">
        {/* Avatar */}
        <div className="ring-4 ring-black rounded-full overflow-hidden bg-black mb-4 shadow-xl shrink-0">
          <Avatar name={appUser.name || 'U'} size="xl" image={previewImage} />
        </div>

        {/* User Metadata */}
        <div className="text-center mb-3">
          <h2 className="text-xl font-black text-white leading-tight">{appUser.name || 'SportX Fan'}</h2>
          <p className="text-sm text-[#71767b] mt-0.5">{appUser.handle || '@user'}</p>
        </div>

        {/* Bio */}
        <p className="text-sm text-[#e7e9ea] text-center leading-relaxed max-w-[400px] mb-4 font-medium">
          {editForm.bio}
        </p>

        {/* Follower / Subscriber Stats */}
        <div className="flex gap-8 text-center mb-6">
          <div className="hover:opacity-80 cursor-pointer">
            <p className="text-base font-black text-white">56</p>
            <p className="text-xs text-[#71767b] mt-0.5">Followers</p>
          </div>
          <div className="hover:opacity-80 cursor-pointer">
            <p className="text-base font-black text-white">28</p>
            <p className="text-xs text-[#71767b] mt-0.5">Following</p>
          </div>
          <div>
            <p className="text-base font-black text-white">3</p>
            <p className="text-xs text-[#71767b] mt-0.5">Subscribed</p>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex gap-3 w-full max-w-[340px] px-2 shrink-0">
          <button
            onClick={() => setEditMode(true)}
            className="flex-1 h-11 rounded-full border border-[#2a2a30] text-xs font-bold text-white hover:bg-white/5 transition-all active:scale-98 animate-fade-in"
          >
            Edit Profile
          </button>
          {!isTipster && (
            <button
              onClick={handleBecomeTipster}
              disabled={isNavigating}
              className={cn(
                'flex-1 h-11 rounded-full text-xs font-black text-black bg-white hover:bg-white/90 transition-all flex items-center justify-center gap-1.5 active:scale-98 shadow-md',
                isNavigating && 'opacity-50 cursor-wait'
              )}
            >
              <Zap className="w-3.5 h-3.5 fill-black text-black" />
              {isNavigating ? 'Opening...' : 'Become Tipster'}
            </button>
          )}
          {isTipster && (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 h-11 rounded-full bg-yellow-500 text-xs font-black text-black hover:bg-yellow-400 transition-all flex items-center justify-center gap-1.5 active:scale-98 shadow-md"
            >
              <Trophy className="w-3.5 h-3.5 fill-black text-black" />
              Dashboard
            </button>
          )}
        </div>
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
                ? 'border-[#ef4444] text-[#ef4444]'
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

      {/* Edit Profile Modal Dialog with Full Screen Blur Backdrop */}
      <AnimatePresence>
        {editMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            {/* Backdrop click to close */}
            <div className="absolute inset-0 bg-transparent" onClick={() => setEditMode(false)} />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-[#0d0d0f] border border-[#2a2a30] rounded-3xl overflow-hidden shadow-2xl flex flex-col z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f1f1f]">
                <h3 className="text-base font-black text-white">Edit Profile</h3>
                <button 
                  onClick={() => setEditMode(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-[#71767b] hover:text-white transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-220px)]">
                {/* Profile Picture Upload Section */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#ef4444]/20 group bg-black shrink-0 shadow-lg">
                    <Avatar name={editForm.name || 'U'} size="xl" image={previewImage} />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/65 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePictureChange}
                        className="hidden"
                        disabled={uploading}
                      />
                      <Upload className="w-6 h-6 text-white" />
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <label className="px-3 py-1.5 rounded-lg border border-[#1f1f1f] text-xs font-bold text-white hover:bg-white/5 cursor-pointer select-none">
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePictureChange}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                    {previewImage && (
                      <button
                        onClick={handleRemovePicture}
                        type="button"
                        className="px-3 py-1.5 rounded-lg border border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444]/5 text-xs font-bold transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Display Name Input */}
                <div>
                  <label className="text-[10px] font-bold text-[#71767b] mb-1.5 block uppercase tracking-wider">Display Name</label>
                  <input
                    value={editForm.name}
                    onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#16161a] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                    placeholder="Display Name"
                  />
                </div>

                {/* Bio Textarea Input */}
                <div>
                  <label className="text-[10px] font-bold text-[#71767b] mb-1.5 block uppercase tracking-wider">Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={e => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full bg-[#16161a] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-4 py-3 text-sm text-white outline-none resize-none transition-all"
                    placeholder="Bio"
                  />
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="flex gap-3 px-6 py-4 border-t border-[#1f1f1f] bg-[#09090b]">
                <button 
                  onClick={() => setEditMode(false)}
                  className="flex-1 py-3 border border-[#1f1f1f] rounded-full text-sm font-bold text-[#71767b] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveProfile}
                  disabled={uploading}
                  className="flex-1 py-3 bg-[#ef4444] rounded-full text-sm font-bold text-white hover:bg-[#dc2626] transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
