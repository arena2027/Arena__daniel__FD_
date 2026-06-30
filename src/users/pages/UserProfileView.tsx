import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Heart, MessageCircle, Repeat2, Bookmark,
  Share, MoreHorizontal, Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';
const mockUsers: Record<string, {
  name: string; handle: string; bio: string;
  location: string; joined: string; following: number;
  followers: number; verified: boolean; tipster: boolean;
  winRate?: string; streak?: number;
  profilePicture?: string;
  coverImage?: string;
}> = {
  'John Pulse': { name: 'John Pulse', handle: '@johnpulse', bio: 'Football analyst and tipster', location: 'London, UK', joined: 'January 2023', following: 123, followers: 456, verified: true, tipster: true, winRate: '65%', streak: 5, profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150', coverImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800' },
  'Sarah Kicks': { name: 'Sarah Kicks', handle: '@sarahkicks', bio: 'Die hard Arsenal fan  | Football is life', location: 'Manchester, UK', joined: 'June 2023', following: 445, followers: 890, verified: false, tipster: false, profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150', coverImage: 'https://images.unsplash.com/photo-1540747737956-378724044282?q=80&w=800' },
  'NBA Central': { name: 'NBA Central', handle: '@nbacentral', bio: 'Your #1 source for NBA news, stats and predictions', location: 'New York, US', joined: 'March 2022', following: 1000, followers: 5000, verified: true, tipster: false, profilePicture: 'https://images.unsplash.com/photo-1519764622345-23439dd774f7?q=80&w=150', coverImage: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?q=80&w=800' },
  'Transfer News': { name: 'Transfer News', handle: '@transfernews', bio: 'Latest transfer rumours and confirmed deals', location: 'London, UK', joined: 'February 2021', following: 2000, followers: 10000, verified: true, tipster: false, profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150', coverImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800' },
  'UCL King': { name: 'UCL King', handle: '@uclking', bio: 'Champions League specialist  | 71% win rate', location: 'Madrid, Spain', joined: 'April 2023', following: 567, followers: 22000, verified: true, tipster: true, winRate: '71%', streak: 11, profilePicture: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=150', coverImage: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=800' },
  'Messi Watch': { name: 'Messi Watch', handle: '@messiwatch', bio: 'Dedicated to the greatest of all time', location: 'Barcelona, Spain', joined: 'May 2020', following: 800, followers: 15000, verified: false, tipster: false, profilePicture: 'https://images.unsplash.com/photo-1527983359383-4758693f760c?q=80&w=150', coverImage: 'https://images.unsplash.com/photo-1540747737956-378724044282?q=80&w=800' },
};
const mockPosts = [
  { id: 'p1', content: 'Man City are going to destroy Arsenal tonight. The form difference is massive', time: '4h ago', likes: 567, comments: 89, reposts: 12, tag: 'Football' },
  { id: 'p2', content: 'Haaland hat trick incoming tonight. Book it. ', time: '1h ago', likes: 423, comments: 67, reposts: 34, tag: 'Football' },
  { id: 'p3', content: 'Champions League this week is going to be incredible. 4 massive ties', time: '3h ago', likes: 234, comments: 45, reposts: 23, tag: 'UCL' },
];
function Avatar({ name, size = 'lg', image }: { name: string; size?: 'sm' | 'md' | 'lg'; image?: string }) {
  const colors = ['bg-[#ef4444]', 'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600'];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-12 h-12 text-base', lg: 'w-24 h-24 text-4xl' };

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

export function UserProfileRoute() {
  const params = useParams<{ name: string }>();
  const navigate = useNavigate();
  const userName = params.name ? decodeURIComponent(params.name) : 'Unknown';

  return <UserProfileView userName={userName} onBack={() => navigate(-1)} />;
}
interface UserProfileViewProps {
  userName: string;
  onBack: () => void;
}
export function UserProfileView({ userName, onBack }: UserProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'replies'>('posts');
  const [following, setFollowing] = useState(false);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const user = mockUsers[userName] ?? {
    name: userName, handle: `@${userName.toLowerCase().replace(' ', '')}`,
    bio: 'Arena sports fan', location: '', joined: '2024',
    following: 0, followers: 0, verified: false, tipster: false,
  };
  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
  return (
    <div className="pb-24">
      {/* Centered Header */}
      <div className="sticky top-0 z-20 bg-black/95 backdrop-blur-md border-b border-[#1f1f1f] px-4 py-3.5 flex items-center justify-between">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white shrink-0" title="Back">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-black text-white text-center flex-1">{user.name}</h1>
        <button
          onClick={() => setShowMoreMenu(m => !m)}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-[#71767b] hover:text-white shrink-0 relative"
        >
          <MoreHorizontal className="w-5 h-5" />
          {showMoreMenu && (
            <div className="absolute right-0 top-10 w-48 bg-[#0f0f11] border border-[#2a2a30] rounded-2xl overflow-hidden shadow-2xl z-50">
              {[
                { label: 'Share Profile', action: () => { navigator.share?.({ title: user.name, url: window.location.href }); setShowMoreMenu(false); } },
                { label: 'Copy Profile Link', action: () => { navigator.clipboard?.writeText(window.location.href); setShowMoreMenu(false); } },
                { label: 'Report Account', action: () => setShowMoreMenu(false) },
                { label: 'Block', action: () => setShowMoreMenu(false) },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors border-b border-[#1f1f1f] last:border-0"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </button>
      </div>


      {/* Centered Profile Details Section */}
      <div className="bg-black border-b border-[#1f1f1f] px-4 py-8 flex flex-col items-center">
        {/* Avatar */}
        <div className="ring-4 ring-black rounded-full overflow-hidden bg-black mb-4 shadow-xl shrink-0">
          <Avatar name={user.name} size="lg" image={user.profilePicture} />
        </div>

        {/* User Metadata */}
        <div className="text-center mb-3">
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <h1 className="text-xl font-black text-white">{user.name}</h1>
            {user.verified && (
              <div className="w-4 h-4 rounded-full bg-[#ef4444] flex items-center justify-center shrink-0">
                <Zap className="w-2.5 h-2.5 text-white" />
              </div>
            )}
            {user.tipster && (
              <span className="text-[10px] bg-[#ef4444]/20 text-[#ef4444] px-2 py-0.5 rounded-full font-bold">TIPSTER</span>
            )}
          </div>
          <p className="text-sm text-[#71767b] mt-0.5">{user.handle}</p>
        </div>

        {/* Bio */}
        <p className="text-sm text-[#e7e9ea] text-center leading-relaxed max-w-[400px] mb-4 font-medium">
          {user.bio}
        </p>

        {user.tipster && user.winRate && (
          <div className="flex items-center gap-3 mb-4 flex-wrap justify-center">
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-bold">{user.winRate} Win Rate</span>
            {user.streak ? (
              <span className="text-xs bg-[#ef4444]/20 text-[#ef4444] px-2 py-1 rounded-full font-bold">{user.streak}-win streak</span>
            ) : (
              <span className="text-xs bg-[#ef4444]/20 text-[#ef4444] px-2 py-1 rounded-full font-bold">Top tipster</span>
            )}
          </div>
        )}

        {/* Followers / Stats */}
        <div className="flex gap-8 text-center mb-6">
          <div className="hover:opacity-80 cursor-pointer">
            <p className="text-base font-black text-white">{fmt(user.followers)}</p>
            <p className="text-xs text-[#71767b] mt-0.5">Followers</p>
          </div>
          <div className="hover:opacity-80 cursor-pointer">
            <p className="text-base font-black text-white">{fmt(user.following)}</p>
            <p className="text-xs text-[#71767b] mt-0.5">Following</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full max-w-[170px] shrink-0">
          <button onClick={() => setFollowing(f => !f)}
            className={cn('w-full h-11 rounded-full text-xs font-black transition-all active:scale-98 shadow-md',
              following
                ? 'border border-[#2a2a30] text-[#71767b] hover:border-[#ef4444]/50 hover:text-[#ef4444] hover:bg-white/5'
                : 'bg-white text-black hover:bg-white/90'
            )}
          >
            {following ? 'Following ✓' : 'Follow'}
          </button>
        </div>
      </div>
      <div className="flex items-center px-4 py-2 gap-1 border-b border-[#1f1f1f]">
        {(['posts', 'replies'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all',
              activeTab === tab ? 'bg-[#ef4444] text-white' : 'text-[#71767b] hover:text-white hover:bg-white/5'
            )}
          >{tab}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {mockPosts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="px-4 py-3 border-b border-[#1f1f1f] hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              {post.tag && (
                <span className="inline-block text-[10px] text-[#ef4444] bg-[#ef4444]/10 px-2 py-0.5 rounded-full mb-1.5 font-semibold">{post.tag}</span>
              )}
              <p className="text-sm text-[#e7e9ea] leading-relaxed mb-2">{post.content}</p>
              <p className="text-xs text-[#71767b] mb-2">{post.time}</p>
              <div className="flex items-center gap-5 text-[#71767b]">
                <button className="flex items-center gap-1 text-xs hover:text-[#ef4444] transition-colors">
                  <MessageCircle className="w-4 h-4" />{post.comments}
                </button>
                <button className="flex items-center gap-1 text-xs hover:text-green-500 transition-colors">
                  <Repeat2 className="w-4 h-4" />{post.reposts}
                </button>
                <button onClick={() => setLiked(l => ({ ...l, [post.id]: !l[post.id] }))}
                  className={cn('flex items-center gap-1 text-xs transition-colors', liked[post.id] ? 'text-[#ef4444]' : 'hover:text-[#ef4444]')}
                >
                  <Heart className={cn('w-4 h-4', liked[post.id] && 'fill-[#ef4444]')} />{post.likes + (liked[post.id] ? 1 : 0)}
                </button>
                <button className="flex items-center gap-1 text-xs hover:text-[#ef4444] transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-1 text-xs hover:text-[#ef4444] transition-colors">
                  <Share className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
