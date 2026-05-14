import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Heart, MessageCircle, Repeat2,
  Bookmark, Share, MoreHorizontal, Zap, Send, Image, Smile
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ── Types ─────────────────────────────────────────────────────
interface Comment {
  id: string;
  user: { name: string; handle: string; verified: boolean; tipster: boolean };
  content: string;
  time: string;
  likes: number;
  replies: number;
}

interface ThreadPost {
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

// ── Mock Comments ─────────────────────────────────────────────
const mockComments: Comment[] = [
  {
    id: 'c1',
    user: { name: 'Sarah Kicks', handle: '@sarahkicks', verified: false, tipster: false },
    content: 'Completely agree! City are on another level this season. Haaland alone is worth 3 points every game 🔥',
    time: '1m ago', likes: 45, replies: 3,
  },
  {
    id: 'c2',
    user: { name: 'UCL King', handle: '@uclking', verified: true, tipster: true },
    content: 'The stats back this up 100%. City have the best attack and defense in the league right now.',
    time: '3m ago', likes: 89, replies: 7,
  },
  {
    id: 'c3',
    user: { name: 'Transfer News', handle: '@transfernews', verified: true, tipster: false },
    content: 'Arsenal fans are going to be furious at this 😂 but facts are facts',
    time: '5m ago', likes: 234, replies: 12,
  },
  {
    id: 'c4',
    user: { name: 'NBA Central', handle: '@nbacentral', verified: true, tipster: false },
    content: 'Even as a non football fan I can see City are special this year',
    time: '8m ago', likes: 23, replies: 1,
  },
  {
    id: 'c5',
    user: { name: 'Messi Watch', handle: '@messiwatch', verified: false, tipster: false },
    content: 'De Bruyne being fit again is the difference. That man is the best midfielder in the world',
    time: '12m ago', likes: 156, replies: 8,
  },
  {
    id: 'c6',
    user: { name: 'SportX Fan', handle: '@sportxfan', verified: false, tipster: false },
    content: '7 wins in a row is crazy form. I think they go unbeaten for the rest of the season',
    time: '15m ago', likes: 67, replies: 4,
  },
];

// ── Avatar ────────────────────────────────────────────────────
function Avatar({ name, size = 'md', onClick }: {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}) {
  const colors = ['bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600', 'bg-pink-600'];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  return (
    <div
      onClick={onClick}
      className={cn('rounded-full flex items-center justify-center font-black text-white shrink-0', sizes[size], color, onClick && 'cursor-pointer')}
    >
      {name[0].toUpperCase()}
    </div>
  );
}

// ── Comment Card ──────────────────────────────────────────────
function CommentCard({ comment, onUserClick }: { comment: Comment; onUserClick: (name: string) => void }) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 px-4 py-3 border-b border-[#1f1f1f] hover:bg-white/[0.02] transition-colors"
    >
      <Avatar name={comment.user.name} size="sm" onClick={() => onUserClick(comment.user.name)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          <button
            onClick={() => onUserClick(comment.user.name)}
            className="font-bold text-sm text-white hover:underline"
          >
            {comment.user.name}
          </button>
          {comment.user.verified && (
            <div className="w-3.5 h-3.5 rounded-full bg-[#ef4444] flex items-center justify-center shrink-0">
              <Zap className="w-2 h-2 text-white" />
            </div>
          )}
          {comment.user.tipster && (
            <span className="text-[9px] bg-[#ef4444]/20 text-[#ef4444] px-1.5 py-0.5 rounded-full font-bold">TIPSTER</span>
          )}
          <span className="text-[#71767b] text-xs">{comment.user.handle} · {comment.time}</span>
          <button className="ml-auto p-1 rounded-full hover:bg-white/5 text-[#71767b]">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-sm text-[#e7e9ea] leading-relaxed mb-2">{comment.content}</p>
        <div className="flex items-center gap-4 text-[#71767b]">
          <button className="flex items-center gap-1 text-xs hover:text-[#ef4444] transition-colors">
            <MessageCircle className="w-3.5 h-3.5" />
            {comment.replies}
          </button>
          <button
            onClick={() => setLiked(l => !l)}
            className={cn('flex items-center gap-1 text-xs transition-colors', liked ? 'text-[#ef4444]' : 'hover:text-[#ef4444]')}
          >
            <Heart className={cn('w-3.5 h-3.5', liked && 'fill-[#ef4444]')} />
            {comment.likes + (liked ? 1 : 0)}
          </button>
          <button className="flex items-center gap-1 text-xs hover:text-[#ef4444] transition-colors">
            <Share className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Post Thread Page ──────────────────────────────────────────
interface PostThreadPageProps {
  post: ThreadPost;
  onBack: () => void;
  onUserClick: (name: string) => void;
}

export function PostThreadPage({ post, onBack, onUserClick }: PostThreadPageProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [comments, setComments] = useState(mockComments);
  const replyRef = useRef<HTMLTextAreaElement>(null);

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

  const sendReply = () => {
    if (!replyText.trim()) return;
    const newComment: Comment = {
      id: `c${Date.now()}`,
      user: { name: 'SportX Fan', handle: '@sportxfan', verified: false, tipster: false },
      content: replyText.trim(),
      time: 'Just now',
      likes: 0,
      replies: 0,
    };
    setComments(prev => [newComment, ...prev]);
    setReplyText('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-14 z-20 bg-black/90 backdrop-blur-md border-b border-[#1f1f1f] px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <p className="font-black text-white">Post</p>
      </div>

      {/* Original Post */}
      <div className="px-4 py-4 border-b border-[#1f1f1f]">
        <div className="flex gap-3 mb-3">
          <Avatar
            name={post.user.name}
            size="lg"
            onClick={() => onUserClick(post.user.name)}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => onUserClick(post.user.name)}
                className="font-bold text-base text-white hover:underline"
              >
                {post.user.name}
              </button>
              {post.user.verified && (
                <div className="w-4 h-4 rounded-full bg-[#ef4444] flex items-center justify-center shrink-0">
                  <Zap className="w-2.5 h-2.5 text-white" />
                </div>
              )}
              {post.user.tipster && (
                <span className="text-[9px] bg-[#ef4444]/20 text-[#ef4444] px-1.5 py-0.5 rounded-full font-bold">TIPSTER</span>
              )}
            </div>
            <p className="text-sm text-[#71767b]">{post.user.handle}</p>
          </div>
          <button className="p-1 rounded-full hover:bg-white/5 text-[#71767b] shrink-0">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {post.tag && (
          <span className="inline-block text-[10px] text-[#ef4444] bg-[#ef4444]/10 px-2 py-0.5 rounded-full mb-2 font-semibold">
            {post.tag}
          </span>
        )}

        <p className="text-base text-[#e7e9ea] leading-relaxed mb-3">{post.content}</p>

        {post.image && (
          <div className="mb-3 rounded-2xl overflow-hidden border border-[#1f1f1f]">
            <img src={post.image} alt="Post" className="w-full max-h-80 object-cover" />
          </div>
        )}

        {post.video && (
          <div className="mb-3 rounded-2xl overflow-hidden border border-[#1f1f1f]">
            <video src={post.video} controls className="w-full max-h-80 rounded-2xl" />
          </div>
        )}

        <p className="text-xs text-[#71767b] mb-3">{post.time}</p>

        {/* Stats row */}
        <div className="flex items-center gap-4 py-3 border-y border-[#1f1f1f] text-sm text-[#71767b] mb-3">
          <span><span className="font-bold text-white">{fmt(post.reposts)}</span> Reposts</span>
          <span><span className="font-bold text-white">{fmt(post.likes)}</span> Likes</span>
          <span><span className="font-bold text-white">{fmt(post.comments)}</span> Replies</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between text-[#71767b]">
          <button
            onClick={() => replyRef.current?.focus()}
            className="flex items-center gap-1.5 hover:text-[#ef4444] transition-colors group"
          >
            <div className="p-2 rounded-full group-hover:bg-[#ef4444]/10 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </div>
          </button>
          <button
            onClick={() => setReposted(r => !r)}
            className={cn('flex items-center gap-1.5 transition-colors group', reposted ? 'text-green-500' : 'hover:text-green-500')}
          >
            <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
              <Repeat2 className="w-5 h-5" />
            </div>
          </button>
          <button
            onClick={() => setLiked(l => !l)}
            className={cn('flex items-center gap-1.5 transition-colors group', liked ? 'text-[#ef4444]' : 'hover:text-[#ef4444]')}
          >
            <div className="p-2 rounded-full group-hover:bg-[#ef4444]/10 transition-colors">
              <Heart className={cn('w-5 h-5', liked && 'fill-[#ef4444]')} />
            </div>
          </button>
          <button
            onClick={() => setBookmarked(b => !b)}
            className={cn('flex items-center gap-1.5 transition-colors group', bookmarked ? 'text-[#ef4444]' : 'hover:text-[#ef4444]')}
          >
            <div className="p-2 rounded-full group-hover:bg-[#ef4444]/10 transition-colors">
              <Bookmark className={cn('w-5 h-5', bookmarked && 'fill-[#ef4444]')} />
            </div>
          </button>
          <button className="flex items-center gap-1.5 hover:text-[#ef4444] transition-colors group">
            <div className="p-2 rounded-full group-hover:bg-[#ef4444]/10 transition-colors">
              <Share className="w-5 h-5" />
            </div>
          </button>
        </div>
      </div>

      {/* Reply composer */}
      <div className="flex gap-3 px-4 py-3 border-b border-[#1f1f1f]">
        <Avatar name="Me" size="sm" />
        <div className="flex-1">
          <textarea
            ref={replyRef}
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Post your reply..."
            rows={2}
            className="w-full bg-transparent text-sm text-white placeholder:text-[#71767b] outline-none resize-none leading-relaxed"
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 text-[#ef4444]">
              <button className="p-1.5 rounded-full hover:bg-[#ef4444]/10 transition-colors">
                <Image className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-full hover:bg-[#ef4444]/10 transition-colors">
                <Smile className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={sendReply}
              disabled={!replyText.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#ef4444] rounded-full text-xs font-bold text-white disabled:opacity-40 hover:bg-[#dc2626] transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Reply
            </button>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div>
        <div className="px-4 py-2 border-b border-[#1f1f1f]">
          <p className="text-xs text-[#71767b] font-bold">{comments.length} REPLIES</p>
        </div>
        <AnimatePresence>
          {comments.map(comment => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onUserClick={onUserClick}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
