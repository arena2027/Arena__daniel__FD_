import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Heart, MessageCircle, Repeat2,
  Bookmark, Share, MoreHorizontal, Zap,
  Image, Smile, X, Plus, Video, BarChart2,
  MapPin, ChevronRight, Play
} from 'lucide-react';
import { cn } from '../lib/utils';
import { MatchDetailPage } from './Matchdetailpage';

// ── Live Games ────────────────────────────────────────────────
const liveGames = [
  { id: 'l1', home: 'Man City', away: 'Arsenal', homeScore: 2, awayScore: 1, minute: "67'", league: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 PL' },
  { id: 'l2', home: 'Real Madrid', away: 'Barca', homeScore: 3, awayScore: 2, minute: "78'", league: '🇪🇸 LaLiga' },
  { id: 'l3', home: 'Lakers', away: 'Warriors', homeScore: 89, awayScore: 84, minute: 'Q3', league: '🏀 NBA' },
];

// ── Types ─────────────────────────────────────────────────────
interface Post {
  id: string;
  user: { name: string; handle: string; verified: boolean; tipster: boolean };
  content: string;
  time: string;
  likes: number;
  comments: number;
  reposts: number;
  tag?: string;
  image?: string;
  video?: string;
}

// ── Mock Posts ────────────────────────────────────────────────
const mockPosts: Post[] = [
  {
    id: '1',
    user: { name: 'John Pulse', handle: '@johnpulse', verified: true, tipster: true },
    content: 'Man City are going to destroy Arsenal tonight. The form difference is massive right now 🔴🔵',
    time: '2m ago', likes: 847, comments: 134, reposts: 56, tag: 'Football',
  },
  {
    id: '2',
    user: { name: 'Sarah Kicks', handle: '@sarahkicks', verified: false, tipster: false },
    content: 'Unpopular opinion: Liverpool will finish above Arsenal this season 🏆',
    time: '15m ago', likes: 312, comments: 89, reposts: 23, tag: 'Football',
  },
  {
    id: '3',
    user: { name: 'NBA Central', handle: '@nbacentral', verified: true, tipster: true },
    content: 'Lakers vs Warriors tonight is going to be a classic. Who you got? 👇🏀',
    time: '32m ago', likes: 1204, comments: 341, reposts: 178, tag: 'NBA',
  },
  {
    id: '4',
    user: { name: 'Transfer News', handle: '@transfernews', verified: true, tipster: false },
    content: '🚨 BREAKING: Real Madrid are closing in on a summer deal. #TransferNews',
    time: '1h ago', likes: 5621, comments: 892, reposts: 1203, tag: 'Transfers',
  },
  {
    id: '5',
    user: { name: 'Messi Watch', handle: '@messiwatch', verified: false, tipster: false },
    content: 'Messi at Inter Miami is genuinely must-watch football. GOAT conversation over 🐐',
    time: '2h ago', likes: 9872, comments: 1432, reposts: 2341, tag: 'MLS',
  },
  {
    id: '6',
    user: { name: 'UCL King', handle: '@uclking', verified: true, tipster: true },
    content: 'Champions League quarterfinals: Bayern vs Real Madrid is the tie of the round ⚽🏆',
    time: '3h ago', likes: 2341, comments: 445, reposts: 312, tag: 'UCL',
  },
];

// ── Avatar ────────────────────────────────────────────────────
function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const colors = ['bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600', 'bg-pink-600'];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  return (
    <div className={cn('rounded-full flex items-center justify-center font-black text-white shrink-0', sizes[size], color)}>
      {name[0].toUpperCase()}
    </div>
  );
}

// ── Live Ticker ───────────────────────────────────────────────
function LiveTicker({ onMatchClick }: { onMatchClick: (id: string) => void }) {
  return (
    <div className="px-4 py-2 border-b border-[#1f1f1f]">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
        <span className="text-xs font-black text-[#ef4444]">LIVE NOW</span>
        <span className="text-xs text-[#71767b]">{liveGames.length} matches</span>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {liveGames.map(game => (
          <motion.button
            key={game.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => onMatchClick(game.id)}
            className="shrink-0 bg-[#111] border border-[#ef4444]/20 rounded-xl px-3 py-2 flex items-center gap-2 hover:border-[#ef4444]/50 hover:bg-[#ef4444]/5 transition-all"
          >
            <div className="text-center shrink-0">
              <p className="text-[10px] text-[#71767b] mb-0.5">{game.league}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">{game.home}</span>
                <div className="flex items-center gap-1 bg-[#ef4444]/20 rounded px-1.5 py-0.5">
                  <span className="text-xs font-black text-[#ef4444]">{game.homeScore}</span>
                  <span className="text-[10px] text-[#71767b]">-</span>
                  <span className="text-xs font-black text-[#ef4444]">{game.awayScore}</span>
                </div>
                <span className="text-xs font-bold text-white">{game.away}</span>
              </div>
              <p className="text-[10px] text-[#ef4444] font-bold mt-0.5">{game.minute}</p>
            </div>
            <ChevronRight className="w-3 h-3 text-[#71767b] shrink-0" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ── Post Modal ────────────────────────────────────────────────
function PostModal({ onClose, onPost }: {
  onClose: () => void;
  onPost: (text: string, image?: string, video?: string) => void;
}) {
  const [text, setText] = useState('');
  const [activeType, setActiveType] = useState<'post' | 'prediction'>('post');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Clear video if image selected
    setVideoPreview(null);
    setVideoName('');
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Clear image if video selected
    setImagePreview(null);
    setVideoName(file.name);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };

  const clearMedia = () => {
    setImagePreview(null);
    setVideoPreview(null);
    setVideoName('');
  };

  const handlePost = () => {
    if (!text.trim() && !imagePreview && !videoPreview) return;
    onPost(text, imagePreview ?? undefined, videoPreview ?? undefined);
    onClose();
  };

  const tools = [
    { icon: Image, label: 'Photo', action: () => imageInputRef.current?.click() },
    { icon: Video, label: 'Video', action: () => videoInputRef.current?.click() },
    { icon: BarChart2, label: 'Poll', action: () => {} },
    { icon: Smile, label: 'Emoji', action: () => {} },
    { icon: MapPin, label: 'Location', action: () => {} },
  ];

  const canPost = text.trim() || imagePreview || videoPreview;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center md:justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="w-full md:max-w-lg bg-[#0d0d0d] border border-[#1f1f1f] rounded-t-3xl md:rounded-3xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f1f]">
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-1 bg-[#111] rounded-full p-1">
            <button
              onClick={() => setActiveType('post')}
              className={cn('px-3 py-1 rounded-full text-xs font-bold transition-all', activeType === 'post' ? 'bg-[#ef4444] text-white' : 'text-[#71767b]')}
            >
              Post
            </button>
            <button
              onClick={() => setActiveType('prediction')}
              className={cn('px-3 py-1 rounded-full text-xs font-bold transition-all', activeType === 'prediction' ? 'bg-[#ef4444] text-white' : 'text-[#71767b]')}
            >
              Prediction
            </button>
          </div>

          <button
            onClick={handlePost}
            disabled={!canPost}
            className="px-4 py-1.5 bg-[#ef4444] rounded-full text-sm font-bold text-white disabled:opacity-40 hover:bg-[#dc2626] transition-colors"
          >
            Post
          </button>
        </div>

        {/* Composer */}
        <div className="flex gap-3 px-4 py-4">
          <Avatar name="Me" size="md" />
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={activeType === 'post' ? "What's happening in sports?" : "Share your prediction or hot take..."}
              rows={4}
              className="w-full bg-transparent text-white placeholder:text-[#71767b] text-base outline-none resize-none leading-relaxed"
            />

            {/* Image Preview */}
            <AnimatePresence>
              {imagePreview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative mt-2 rounded-2xl overflow-hidden border border-[#1f1f1f]"
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-64 object-cover rounded-2xl"
                  />
                  <button
                    onClick={clearMedia}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/70 rounded-full flex items-center justify-center hover:bg-black transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Video Preview */}
            <AnimatePresence>
              {videoPreview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative mt-2 rounded-2xl overflow-hidden border border-[#1f1f1f] bg-[#111]"
                >
                  <video
                    src={videoPreview}
                    controls
                    className="w-full max-h-64 rounded-2xl"
                  />
                  <button
                    onClick={clearMedia}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/70 rounded-full flex items-center justify-center hover:bg-black transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  <div className="px-3 py-1.5 flex items-center gap-2">
                    <Play className="w-3.5 h-3.5 text-[#71767b]" />
                    <p className="text-xs text-[#71767b] truncate">{videoName}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Prediction extras */}
            <AnimatePresence>
              {activeType === 'prediction' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 space-y-2"
                >
                  <input
                    placeholder="Match (e.g. Man City vs Arsenal)"
                    className="w-full bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-[#71767b] outline-none transition-all"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Your prediction"
                      className="bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-[#71767b] outline-none transition-all"
                    />
                    <input
                      placeholder="Odds (optional)"
                      className="bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-[#71767b] outline-none transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Hidden inputs */}
        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
        <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoSelect} />

        {/* Tools + Counter */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#1f1f1f]">
          <div className="flex items-center gap-1 text-[#ef4444]">
            {tools.map(tool => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.label}
                  onClick={tool.action}
                  className="p-2 rounded-full hover:bg-[#ef4444]/10 transition-colors"
                  title={tool.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
          {text && (
            <span className={cn('text-xs font-semibold', text.length > 260 ? 'text-[#ef4444]' : 'text-[#71767b]')}>
              {280 - text.length}
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Post Card ─────────────────────────────────────────────────
function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-3 border-b border-[#1f1f1f] hover:bg-white/[0.02] transition-colors cursor-pointer"
    >
      <div className="flex gap-3">
        <Avatar name={post.user.name} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
              <span className="font-bold text-sm text-white truncate">{post.user.name}</span>
              {post.user.verified && (
                <div className="w-4 h-4 rounded-full bg-[#ef4444] flex items-center justify-center shrink-0">
                  <Zap className="w-2.5 h-2.5 text-white" />
                </div>
              )}
              {post.user.tipster && (
                <span className="text-[9px] bg-[#ef4444]/20 text-[#ef4444] px-1.5 py-0.5 rounded-full font-bold shrink-0">TIPSTER</span>
              )}
              <span className="text-[#71767b] text-xs">{post.user.handle} · {post.time}</span>
            </div>
            <button className="p-1 rounded-full hover:bg-white/5 text-[#71767b] shrink-0">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {post.tag && (
            <span className="inline-block text-[10px] text-[#ef4444] bg-[#ef4444]/10 px-2 py-0.5 rounded-full mb-1.5 font-semibold">
              {post.tag}
            </span>
          )}

          <p className="text-sm text-[#e7e9ea] leading-relaxed mb-2">{post.content}</p>

          {/* Image */}
          {post.image && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-[#1f1f1f]">
              <img src={post.image} alt="Post" className="w-full max-h-80 object-cover" />
            </div>
          )}

          {/* Video */}
          {post.video && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-[#1f1f1f] bg-[#111]">
              <video
                src={post.video}
                controls
                className="w-full max-h-80 rounded-2xl"
              />
            </div>
          )}

          <div className="flex items-center justify-between text-[#71767b]">
            <button className="flex items-center gap-1.5 hover:text-[#ef4444] transition-colors group">
              <div className="p-1.5 rounded-full group-hover:bg-[#ef4444]/10 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-xs">{fmt(post.comments)}</span>
            </button>
            <button
              onClick={() => setReposted(r => !r)}
              className={cn('flex items-center gap-1.5 transition-colors group', reposted ? 'text-green-500' : 'hover:text-green-500')}
            >
              <div className="p-1.5 rounded-full group-hover:bg-green-500/10 transition-colors">
                <Repeat2 className="w-4 h-4" />
              </div>
              <span className="text-xs">{fmt(post.reposts + (reposted ? 1 : 0))}</span>
            </button>
            <button
              onClick={() => setLiked(l => !l)}
              className={cn('flex items-center gap-1.5 transition-colors group', liked ? 'text-[#ef4444]' : 'hover:text-[#ef4444]')}
            >
              <div className="p-1.5 rounded-full group-hover:bg-[#ef4444]/10 transition-colors">
                <Heart className={cn('w-4 h-4', liked && 'fill-[#ef4444]')} />
              </div>
              <span className="text-xs">{fmt(post.likes + (liked ? 1 : 0))}</span>
            </button>
            <button
              onClick={() => setBookmarked(b => !b)}
              className={cn('flex items-center gap-1.5 transition-colors group', bookmarked ? 'text-[#ef4444]' : 'hover:text-[#ef4444]')}
            >
              <div className="p-1.5 rounded-full group-hover:bg-[#ef4444]/10 transition-colors">
                <Bookmark className={cn('w-4 h-4', bookmarked && 'fill-[#ef4444]')} />
              </div>
            </button>
            <button className="flex items-center gap-1.5 hover:text-[#ef4444] transition-colors group">
              <div className="p-1.5 rounded-full group-hover:bg-[#ef4444]/10 transition-colors">
                <Share className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Home Page ─────────────────────────────────────────────────
export function HomePage() {
  const [activeTab, setActiveTab] = useState<'trending' | 'new' | 'following'>('trending');
  const [showModal, setShowModal] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [posts, setPosts] = useState(mockPosts);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 100) {
        setShowButton(false);
      } else {
        setShowButton(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (selectedMatch) {
    return <MatchDetailPage onBack={() => setSelectedMatch(null)} />;
  }

  const handleNewPost = (text: string, image?: string, video?: string) => {
    const newPost: Post = {
      id: `new-${Date.now()}`,
      user: { name: 'SportX Fan', handle: '@sportxfan', verified: false, tipster: false },
      content: text,
      time: 'Just now',
      likes: 0,
      comments: 0,
      reposts: 0,
      image,
      video,
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const tabs = [
    { key: 'trending',  label: 'Trending' },
    { key: 'new',       label: 'New' },
    { key: 'following', label: 'Following' },
  ] as const;

  return (
    <div>
      {/* Sticky tabs + search */}
      <div className="sticky top-14 z-20 bg-black/90 backdrop-blur-md border-b border-[#1f1f1f]">
        <div className="flex items-center gap-1 px-4 pt-3 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-bold transition-all',
                activeTab === tab.key
                  ? 'bg-[#ef4444] text-white'
                  : 'text-[#71767b] hover:text-white hover:bg-white/5'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-[#111] rounded-full px-4 py-2 border border-[#1f1f1f] focus-within:border-[#ef4444]/30 transition-all">
            <Search className="w-4 h-4 text-[#71767b] shrink-0" />
            <input
              placeholder="Search Arena..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-[#71767b] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Live Ticker */}
      <LiveTicker onMatchClick={setSelectedMatch} />

      {/* Feed */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Floating Post Button */}
      <AnimatePresence>
        {showButton && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowModal(true)}
            className="fixed bottom-24 right-4 md:bottom-8 md:right-8 w-14 h-14 bg-gradient-to-br from-[#dc2626] to-[#ef4444] rounded-full flex items-center justify-center shadow-xl shadow-red-500/40 z-20"
          >
            <Plus className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Post Modal */}
      <AnimatePresence>
        {showModal && (
          <PostModal
            onClose={() => setShowModal(false)}
            onPost={handleNewPost}
          />
        )}
      </AnimatePresence>
    </div>
  );
}