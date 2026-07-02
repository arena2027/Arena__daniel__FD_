import { Trophy, Zap, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

interface TopTipster {
  id: string;
  name: string;
  handle: string;
  winRate: number;
  followers: number;
  badge?: 'hot' | 'trending';
}

interface TrendingCommunity {
  id: string;
  name: string;
  members: number;
}

const topTipsters: TopTipster[] = [
  { id: '1', name: 'GoldTips', handle: '@goldtips', winRate: 74, followers: 12400, badge: 'hot' },
  { id: '2', name: 'UCL King', handle: '@uclking', winRate: 71, followers: 8900 },
  { id: '3', name: 'NBA Pro', handle: '@nbapro', winRate: 67, followers: 6200 },
  { id: '4', name: 'LaLiga Master', handle: '@laligamaster', winRate: 69, followers: 5400 },
];

const trendingCommunities: TrendingCommunity[] = [
  { id: '1', name: 'Football Fans', members: 125000 },
  { id: '2', name: 'Premier League', members: 98400 },
  { id: '3', name: 'Champions League', members: 87600 },
  { id: '4', name: 'NBA Predictions', members: 56200 },
];

export function RightSidebar() {
  const navigate = useNavigate();
  return (
    <aside className="w-full p-4" style={{ scrollbarWidth: 'none' }}>
      <div>
        {/* Top Tipsters */}
        <div className="bg-[#12121A] border border-[#1f1f1f] rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-[#ef4444]" />
          <h3 className="text-sm font-bold text-white">Top Tipsters</h3>
        </div>
        <div className="space-y-2">
          {topTipsters.map((tipster, idx) => (
            <div
              key={tipster.id}
              className={cn(
                'p-3 rounded-xl border transition-colors cursor-pointer hover:border-[#ef4444]/50',
                idx === 0
                  ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20'
                  : 'bg-[#0d0d0d] border-[#1f1f1f]'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-sm text-white">{tipster.name}</p>
                  <p className="text-xs text-[#71767b]">{tipster.handle}</p>
                </div>
                {idx === 0 && (
                  <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] font-bold rounded-full">
                    HOT
                  </span>
                )}
              </div>
              <div className="flex gap-3 text-xs">
                <span className="text-green-400 font-bold">{tipster.winRate}% WR</span>
                <span className="text-[#71767b]">{(tipster.followers / 1000).toFixed(0)}K followers</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Communities */}
      <div className="bg-[#12121A] border border-[#1f1f1f] rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-[#ef4444]" />
          <h3 className="text-sm font-bold text-white">Trending Communities</h3>
        </div>
        <div className="space-y-2">
          {trendingCommunities.map((community) => (
            <div
              key={community.id}
              className="p-3 rounded-xl bg-[#0d0d0d] border border-[#1f1f1f] hover:border-[#ef4444]/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-white">{community.name}</p>
                  <p className="text-xs text-[#71767b]">{(community.members / 1000).toFixed(0)}K members</p>
                </div>
                <Users className="w-4 h-4 text-[#71767b]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promoted/Sponsored */}
      <div className="bg-gradient-to-br from-[#ef4444]/10 to-[#dc2626]/5 border border-[#ef4444]/20 rounded-2xl p-4">
        <Zap className="w-4 h-4 text-[#ef4444] mb-2" />
        <h3 className="text-sm font-bold text-white mb-2">Become a Tipster</h3>
        <p className="text-xs text-[#71767b] mb-3 leading-relaxed">
          Join thousands of experts sharing predictions and earning from your expertise.
        </p>
        <button
          onClick={() => navigate('/become-tipster')}
          className="w-full py-2 bg-[#ef4444] text-white font-bold text-xs rounded-lg hover:bg-[#dc2626] transition-colors"
        >
          Learn More
        </button>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-[#1f1f1f]">
        <div className="space-y-1">
          <p className="text-[10px] text-[#71767b]">
            <a href="#" className="hover:underline">About Arena</a> • <a href="/privacy" className="hover:underline">Privacy</a>
          </p>
          <p className="text-[10px] text-[#71767b]">
            © 2024 Arena. All rights reserved.
          </p>
        </div>
      </div>
      </div>
    </aside>
  );
}
