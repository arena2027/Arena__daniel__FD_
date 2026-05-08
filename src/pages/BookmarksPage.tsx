import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageCircle, Repeat2,
  Bookmark, Share, Zap, Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';

const initialBookmarks = [
  { id: 'b1', user: { name: 'Transfer News', handle: '@transfernews', verified: true, tipster: false }, content: '🚨 BREAKING: Real Madrid are closing in on a summer deal. More details dropping in the next hour. #TransferNews', time: '3h ago', likes: 5621, comments: 892, reposts: 1203, tag: 'Transfers' },
  { id: 'b2', user: { name: 'UCL King', handle: '@uclking', verified: true, tipster: true }, content: 'Champions League quarterfinals preview: Bayern vs Real Madrid is the tie of the round. Both teams in brilliant form ⚽🏆', time: '5h ago', likes: 2341, comments: 445, reposts: 312, tag: 'UCL' },
  { id: 'b3', user: { name: 'NBA Central', handle: '@nbacentral', verified: true, tipster: true }, content: 'LeBron at 39 years old still dropping 30 points a night is the most impressive thing in sports history 🏀', time: '1d ago', likes: 8921, comments: 1234, reposts: 2341, tag: 'NBA' },
  { id: 'b4', user: { name: 'John Pulse', handle: '@johnpulse', verified: true, tipster: true }, content: 'Haaland is going to finish this season with 40+ goals. The man is simply not human ⚽🤖', time: '2d ago', likes: 3421, comments: 567, reposts: 234, tag: 'Football' },
];

function Avatar({ name }: { name: string }) {
  const colors = ['bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600'];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={cn('w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm shrink-0', color)}>
      {name[0].toUpperCase()}
    </div>
  );
}

export function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

  const removeBookmark = (id: string) => setBookmarks(prev => prev.filter(b => b.id !== id));

  return (
    <div>
      <div className="sticky top-14 z-20 bg-black/90 backdrop-blur-md border-b border-[#1f1f1f] px-4 py-3">
        <h1 className="text-lg font-black text-white">Bookmarks</h1>
        <p className="text-xs text-[#71767b] mt-0.5">{bookmarks.length} saved posts</p>
      </div>

      <AnimatePresence>
        {bookmarks.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center px-8"
          >
            <Bookmark className="w-12 h-12 text-[#71767b] mb-3" />
            <p className="font-bold text-white mb-1">No bookmarks yet</p>
            <p className="text-sm text-[#71767b]">Save posts by tapping the bookmark icon</p>
          </motion.div>
        ) : bookmarks.map((post, i) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }}
            transition={{ delay: i * 0.04 }}
            className="flex gap-3 px-4 py-3 border-b border-[#1f1f1f] hover:bg-white/[0.02] transition-colors"
          >
            <Avatar name={post.user.name} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
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
                <button onClick={() => removeBookmark(post.id)}
                  className="ml-auto p-1 rounded-full hover:bg-[#ef4444]/10 text-[#71767b] hover:text-[#ef4444] transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {post.tag && (
                <span className="inline-block text-[10px] text-[#ef4444] bg-[#ef4444]/10 px-2 py-0.5 rounded-full mb-1.5 font-semibold">{post.tag}</span>
              )}
              <p className="text-sm text-[#e7e9ea] leading-relaxed mb-3">{post.content}</p>
              <div className="flex items-center justify-between text-[#71767b]">
                <button className="flex items-center gap-1 text-xs hover:text-[#ef4444] transition-colors">
                  <MessageCircle className="w-4 h-4" />{fmt(post.comments)}
                </button>
                <button className="flex items-center gap-1 text-xs hover:text-green-500 transition-colors">
                  <Repeat2 className="w-4 h-4" />{fmt(post.reposts)}
                </button>
                <button onClick={() => setLiked(l => ({ ...l, [post.id]: !l[post.id] }))}
                  className={cn('flex items-center gap-1 text-xs transition-colors', liked[post.id] ? 'text-[#ef4444]' : 'hover:text-[#ef4444]')}
                >
                  <Heart className={cn('w-4 h-4', liked[post.id] && 'fill-[#ef4444]')} />
                  {fmt(post.likes + (liked[post.id] ? 1 : 0))}
                </button>
                <button onClick={() => removeBookmark(post.id)} className="flex items-center gap-1 text-xs text-[#ef4444] hover:text-red-300 transition-colors">
                  <Bookmark className="w-4 h-4 fill-[#ef4444]" />
                </button>
                <button className="flex items-center gap-1 text-xs hover:text-[#ef4444] transition-colors">
                  <Share className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}