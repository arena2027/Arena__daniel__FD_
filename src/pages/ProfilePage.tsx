import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, MapPin, Link, Edit, Heart,
  MessageCircle, Repeat2, Bookmark, Share,
  MoreHorizontal, Zap
} from 'lucide-react';
import { cn } from '../lib/utils';

// ── Mock Data ─────────────────────────────────────────────────
const user = {
  name: 'SportX Fan',
  handle: '@sportxfan',
  bio: 'Die-hard football fan ⚽ | NBA enthusiast 🏀 | Living for match days 🔥 | Predictions king 👑',
  location: 'Lagos, Nigeria',
  website: 'arena.sports',
  joined: 'January 2024',
  following: 342,
  followers: 1204,
  posts: 89,
};

const myPosts = [
  { id: 'p1', content: 'Man City are going to win the treble this season. Book it. 🏆🏆🏆', time: '2h ago', likes: 234, comments: 45, reposts: 12 },
  { id: 'p2', content: 'That Haaland hat-trick last night was something else. The man is not human 🤖⚽', time: '1d ago', likes: 891, comments: 123, reposts: 67 },
  { id: 'p3', content: 'Champions League is the best competition in world football. Nothing comes close.', time: '3d ago', likes: 445, comments: 89, reposts: 34 },
  { id: 'p4', content: 'If you think Arsenal can win the title this season raise your hand ✋ I\'m raising mine 🔴⚪', time: '5d ago', likes: 678, comments: 234, reposts: 45 },
];

const myPredictions = [
  { id: 'pr1', match: 'Man City vs Arsenal', prediction: 'Man City Win', odds: '1.75', status: 'won', time: '2h ago' },
  { id: 'pr2', match: 'Lakers vs Warriors', prediction: 'Lakers Win', odds: '1.90', status: 'pending', time: '5h ago' },
  { id: 'pr3', match: 'Real Madrid vs Barcelona', prediction: 'Both to Score', odds: '1.65', status: 'won', time: '1d ago' },
  { id: 'pr4', match: 'Liverpool vs Chelsea', prediction: 'Liverpool Win', odds: '1.80', status: 'lost', time: '2d ago' },
];

const savedPosts = [
  { id: 's1', user: 'Transfer News', content: '🚨 BREAKING: Real Madrid closing in on summer deal', time: '3h ago', likes: 5621, comments: 892, reposts: 1203 },
  { id: 's2', user: 'NBA Central', content: 'Lakers vs Warriors preview — this one is going to be a classic', time: '6h ago', likes: 1204, comments: 341, reposts: 178 },
];

// ── Avatar ────────────────────────────────────────────────────
function Avatar({ name, size = 'lg' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const colors = ['bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600'];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-12 h-12 text-base', lg: 'w-20 h-20 text-2xl' };
  return (
    <div className={cn('rounded-full flex items-center justify-center font-black text-white shrink-0', sizes[size], color)}>
      {name[0].toUpperCase()}
    </div>
  );
}

// ── Post Card ─────────────────────────────────────────────────
function PostCard({ content, time, likes, comments, reposts, userName }: {
  content: string; time: string; likes: number;
  comments: number; reposts: number; userName?: string;
}) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

  return (
    <div className="px-4 py-3 border-b border-[#1f1f1f] hover:bg-white/[0.02] transition-colors">
      {userName && (
        <p className="text-xs text-[#71767b] mb-2 font-semibold">{userName}</p>
      )}
      <p className="text-sm text-[#e7e9ea] leading-relaxed mb-3">{content}</p>
      <div className="flex items-center justify-between text-[#71767b]">
        <button className="flex items-center gap-1.5 hover:text-[#ef4444] transition-colors group">
          <div className="p-1.5 rounded-full group-hover:bg-[#ef4444]/10 transition-colors">
            <MessageCircle className="w-4 h-4" />
          </div>
          <span className="text-xs">{fmt(comments)}</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors group">
          <div className="p-1.5 rounded-full group-hover:bg-green-500/10 transition-colors">
            <Repeat2 className="w-4 h-4" />
          </div>
          <span className="text-xs">{fmt(reposts)}</span>
        </button>
        <button
          onClick={() => setLiked(l => !l)}
          className={cn('flex items-center gap-1.5 transition-colors group', liked ? 'text-[#ef4444]' : 'hover:text-[#ef4444]')}
        >
          <div className="p-1.5 rounded-full group-hover:bg-[#ef4444]/10 transition-colors">
            <Heart className={cn('w-4 h-4', liked && 'fill-[#ef4444]')} />
          </div>
          <span className="text-xs">{fmt(likes + (liked ? 1 : 0))}</span>
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
  );
}

// ── Profile Page ──────────────────────────────────────────────
export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'predictions' | 'saved'>('posts');
  const [editMode, setEditMode] = useState(false);

  const tabs = [
    { key: 'posts',       label: 'Posts' },
    { key: 'predictions', label: 'Predictions' },
    { key: 'saved',       label: 'Saved' },
  ] as const;

  const stats = [
    { label: 'Posts',     value: user.posts },
    { label: 'Following', value: user.following },
    { label: 'Followers', value: user.followers },
  ];

  return (
    <div>
      {/* Cover */}
      <div className="h-32 bg-gradient-to-br from-[#ef4444]/30 via-[#dc2626]/20 to-black relative">
        <button className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4 border-b border-[#1f1f1f]">
        <div className="flex items-end justify-between -mt-10 mb-3">
          <div className="ring-4 ring-black rounded-full">
            <Avatar name={user.name} size="lg" />
          </div>
          <button
            onClick={() => setEditMode(e => !e)}
            className="flex items-center gap-1.5 px-4 py-1.5 border border-[#71767b] rounded-full text-sm font-bold text-white hover:border-white transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        </div>

        <h1 className="text-xl font-black text-white">{user.name}</h1>
        <p className="text-sm text-[#71767b] mb-2">{user.handle}</p>
        <p className="text-sm text-[#e7e9ea] leading-relaxed mb-3">{user.bio}</p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-[#71767b] text-xs">
          {user.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {user.location}
            </span>
          )}
          {user.website && (
            <span className="flex items-center gap-1 text-[#ef4444]">
              <Link className="w-3.5 h-3.5" />
              {user.website}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Joined {user.joined}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          {stats.map(stat => (
            <div key={stat.label} className="text-center">
              <p className="font-black text-white text-sm">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-[#71767b]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Mode */}
      <AnimatePresence>
        {editMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-[#1f1f1f] px-4 py-4 space-y-3"
          >
            <h3 className="font-bold text-white text-sm">Edit Profile</h3>
            <input
              defaultValue={user.name}
              className="w-full bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-3 py-2.5 text-sm text-white outline-none transition-all"
              placeholder="Name"
            />
            <textarea
              defaultValue={user.bio}
              rows={3}
              className="w-full bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-3 py-2.5 text-sm text-white outline-none resize-none transition-all"
              placeholder="Bio"
            />
            <input
              defaultValue={user.location}
              className="w-full bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-3 py-2.5 text-sm text-white outline-none transition-all"
              placeholder="Location"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 py-2 bg-[#ef4444] rounded-full text-sm font-bold text-white hover:bg-[#dc2626] transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 py-2 border border-[#1f1f1f] rounded-full text-sm font-bold text-[#71767b] hover:border-white hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="sticky top-14 z-20 bg-black/90 backdrop-blur-md border-b border-[#1f1f1f]">
        <div className="flex items-center px-4 py-2 gap-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-bold transition-all',
                activeTab === tab.key
                  ? 'bg-[#ef4444] text-white'
                  : 'text-[#71767b] hover:text-white hover:bg-white/5'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Posts */}
          {activeTab === 'posts' && (
            <div>
              {myPosts.map(post => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          )}

          {/* Predictions */}
          {activeTab === 'predictions' && (
            <div>
              {myPredictions.map((pred, i) => (
                <motion.div
                  key={pred.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-4 py-3 border-b border-[#1f1f1f] hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-sm text-white">{pred.match}</p>
                    <span className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full font-black',
                      pred.status === 'won' && 'bg-green-500/20 text-green-400',
                      pred.status === 'lost' && 'bg-[#ef4444]/20 text-[#ef4444]',
                      pred.status === 'pending' && 'bg-yellow-500/20 text-yellow-400',
                    )}>
                      {pred.status === 'won' ? '✓ WON' : pred.status === 'lost' ? '✗ LOST' : '⏳ PENDING'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#71767b]">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#ef4444]" />
                      {pred.prediction}
                    </span>
                    <span>Odds: {pred.odds}</span>
                    <span>{pred.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Saved */}
          {activeTab === 'saved' && (
            <div>
              {savedPosts.map(post => (
                <PostCard
                  key={post.id}
                  content={post.content}
                  time={post.time}
                  likes={post.likes}
                  comments={post.comments}
                  reposts={post.reposts}
                  userName={post.user}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}