import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, Calendar, Trophy, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MatchDetailPage } from './Matchdetailpage';

// ── Types ─────────────────────────────────────────────────────
interface Match {
  id: string;
  home: string;
  away: string;
  homeScore?: number;
  awayScore?: number;
  time: string;
  league: string;
  leagueEmoji: string;
  status: 'live' | 'today' | 'upcoming' | 'result';
  minute?: string;
  date?: string;
  stadium?: string;
}

// ── Mock Data ─────────────────────────────────────────────────
const matches: Match[] = [
  // Live
  { id: 'l1', home: 'Man City', away: 'Arsenal', homeScore: 2, awayScore: 1, time: "67'", league: 'Premier League', leagueEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', status: 'live', minute: "67'" },
  { id: 'l2', home: 'Real Madrid', away: 'Barcelona', homeScore: 3, awayScore: 2, time: "78'", league: 'La Liga', leagueEmoji: '🇪🇸', status: 'live', minute: "78'" },
  { id: 'l3', home: 'Lakers', away: 'Warriors', homeScore: 89, awayScore: 84, time: 'Q3', league: 'NBA', leagueEmoji: '🏀', status: 'live', minute: 'Q3' },
  // Today
  { id: 't1', home: 'Liverpool', away: 'Chelsea', time: '20:00', league: 'Premier League', leagueEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', status: 'today', stadium: 'Anfield' },
  { id: 't2', home: 'Bayern Munich', away: 'Dortmund', time: '18:30', league: 'Bundesliga', leagueEmoji: '🇩🇪', status: 'today', stadium: 'Allianz Arena' },
  { id: 't3', home: 'PSG', away: 'Lyon', time: '21:00', league: 'Ligue 1', leagueEmoji: '🇫🇷', status: 'today', stadium: 'Parc des Princes' },
  { id: 't4', home: 'Celtics', away: 'Heat', time: '19:30', league: 'NBA', leagueEmoji: '🏀', status: 'today', stadium: 'TD Garden' },
  // Upcoming
  { id: 'u1', home: 'Juventus', away: 'AC Milan', time: '20:45', league: 'Serie A', leagueEmoji: '🇮🇹', status: 'upcoming', date: 'Tomorrow' },
  { id: 'u2', home: 'Atletico Madrid', away: 'Sevilla', time: '21:00', league: 'La Liga', leagueEmoji: '🇪🇸', status: 'upcoming', date: 'Tomorrow' },
  { id: 'u3', home: 'Man United', away: 'Tottenham', time: '17:30', league: 'Premier League', leagueEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', status: 'upcoming', date: 'Sat 20 Apr' },
  { id: 'u4', home: 'Inter Milan', away: 'Napoli', time: '20:45', league: 'Serie A', leagueEmoji: '🇮🇹', status: 'upcoming', date: 'Sat 20 Apr' },
  { id: 'u5', home: 'Bulls', away: 'Bucks', time: '20:00', league: 'NBA', leagueEmoji: '🏀', status: 'upcoming', date: 'Sun 21 Apr' },
  // Results
  { id: 'r1', home: 'Arsenal', away: 'Chelsea', homeScore: 3, awayScore: 1, time: 'FT', league: 'Premier League', leagueEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', status: 'result', date: 'Yesterday' },
  { id: 'r2', home: 'Barcelona', away: 'Valencia', homeScore: 4, awayScore: 0, time: 'FT', league: 'La Liga', leagueEmoji: '🇪🇸', status: 'result', date: 'Yesterday' },
  { id: 'r3', home: 'Dortmund', away: 'Leipzig', homeScore: 2, awayScore: 2, time: 'FT', league: 'Bundesliga', leagueEmoji: '🇩🇪', status: 'result', date: 'Yesterday' },
  { id: 'r4', home: 'Knicks', away: 'Nets', homeScore: 112, awayScore: 98, time: 'FT', league: 'NBA', leagueEmoji: '🏀', status: 'result', date: 'Yesterday' },
  { id: 'r5', home: 'Napoli', away: 'Roma', homeScore: 1, awayScore: 3, time: 'FT', league: 'Serie A', leagueEmoji: '🇮🇹', status: 'result', date: '2 days ago' },
];

// ── Match Card ────────────────────────────────────────────────
function MatchCard({ match, onClick }: { match: Match; onClick: () => void }) {
  const isLive = match.status === 'live';
  const hasScore = match.homeScore !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="px-4 py-3 border-b border-[#1f1f1f] hover:bg-white/[0.02] cursor-pointer transition-colors"
    >
      {/* League */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{match.leagueEmoji}</span>
          <span className="text-xs text-[#71767b] font-semibold">{match.league}</span>
        </div>
        {isLive && (
          <div className="flex items-center gap-1 bg-[#ef4444]/15 px-2 py-0.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
            <span className="text-[10px] text-[#ef4444] font-bold">LIVE {match.minute}</span>
          </div>
        )}
        {match.status === 'result' && (
          <span className="text-[10px] text-[#71767b] font-semibold">{match.date}</span>
        )}
        {match.status === 'upcoming' && (
          <span className="text-[10px] text-[#71767b] font-semibold">{match.date}</span>
        )}
      </div>

      {/* Teams + Score */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 text-right">
          <p className={cn('font-bold text-sm', hasScore && match.homeScore! > match.awayScore! ? 'text-white' : 'text-[#e7e9ea]')}>
            {match.home}
          </p>
        </div>

        <div className="flex flex-col items-center shrink-0 min-w-[60px]">
          {hasScore ? (
            <div className="flex items-center gap-2">
              <span className={cn('text-xl font-black', isLive ? 'text-[#ef4444]' : 'text-white')}>
                {match.homeScore}
              </span>
              <span className="text-[#71767b] text-sm">-</span>
              <span className={cn('text-xl font-black', isLive ? 'text-[#ef4444]' : 'text-white')}>
                {match.awayScore}
              </span>
            </div>
          ) : (
            <span className="text-sm font-bold text-[#ef4444]">{match.time}</span>
          )}
          {match.status === 'result' && (
            <span className="text-[10px] text-[#71767b] mt-0.5">Full Time</span>
          )}
          {match.status === 'today' && (
            <span className="text-[10px] text-[#71767b] mt-0.5">{match.stadium}</span>
          )}
        </div>

        <div className="flex-1">
          <p className={cn('font-bold text-sm', hasScore && match.awayScore! > match.homeScore! ? 'text-white' : 'text-[#e7e9ea]')}>
            {match.away}
          </p>
        </div>

        <ChevronRight className="w-4 h-4 text-[#71767b] shrink-0" />
      </div>
    </motion.div>
  );
}

// ── Live Page ─────────────────────────────────────────────────
export function LivePage() {
  const [activeTab, setActiveTab] = useState<'live' | 'today' | 'upcoming' | 'results'>('live');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  // If a match is selected show the detail page
  if (selectedMatchId) {
    return <MatchDetailPage onBack={() => setSelectedMatchId(null)} />;
  }

  const tabs = [
    { key: 'live',     label: 'Live',     icon: Zap,      count: matches.filter(m => m.status === 'live').length },
    { key: 'today',    label: 'Today',    icon: Clock,    count: matches.filter(m => m.status === 'today').length },
    { key: 'upcoming', label: 'Upcoming', icon: Calendar, count: null },
    { key: 'results',  label: 'Results',  icon: Trophy,   count: null },
  ] as const;

  const filtered = matches.filter(m => {
    if (activeTab === 'live')     return m.status === 'live';
    if (activeTab === 'today')    return m.status === 'today';
    if (activeTab === 'upcoming') return m.status === 'upcoming';
    if (activeTab === 'results')  return m.status === 'result';
    return false;
  });

  return (
    <div>
      {/* Sticky Header */}
      <div className="sticky top-14 z-20 bg-black/90 backdrop-blur-md border-b border-[#1f1f1f]">
        <div className="px-4 py-3">
          <h1 className="text-lg font-black text-white mb-3">Matches</h1>
          <div className="flex items-center gap-1.5">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all',
                    isActive
                      ? 'bg-[#ef4444] text-white'
                      : 'text-[#71767b] hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {tab.count !== null && tab.count > 0 && (
                    <span className={cn(
                      'text-[9px] px-1.5 py-0.5 rounded-full font-black',
                      isActive ? 'bg-white/20 text-white' : 'bg-[#ef4444]/20 text-[#ef4444]'
                    )}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Match List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'live' && (
            <div className="px-4 py-2 bg-[#ef4444]/5 border-b border-[#ef4444]/10">
              <p className="text-xs text-[#ef4444] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse inline-block" />
                {filtered.length} matches live right now
              </p>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-8">
              <p className="text-4xl mb-3">⚽</p>
              <p className="font-bold text-white mb-1">No matches right now</p>
              <p className="text-sm text-[#71767b]">Check back soon for upcoming fixtures</p>
            </div>
          ) : (
            filtered.map(match => (
              <MatchCard
                key={match.id}
                match={match}
                onClick={() => setSelectedMatchId(match.id)}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
