import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Users, Zap, Plus,
  Ticket, ChevronRight, ArrowUpRight,
  Check, Clock, Star
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { AppUser } from '../../core/types';
const recentTickets = [
  { id: 't1', code: 'GOLD-7X2K', matches: 12, wins: 7, losses: 3, pending: 2, time: '2h ago', status: 'active' },
  { id: 't2', code: 'GOLD-6W9P', matches: 8, wins: 5, losses: 2, pending: 1, time: '1d ago', status: 'settled' },
  { id: 't3', code: 'GOLD-5M3R', matches: 6, wins: 6, losses: 0, pending: 0, time: '2d ago', status: 'won' },
  { id: 't4', code: 'GOLD-4K1L', matches: 10, wins: 3, losses: 7, pending: 0, time: '3d ago', status: 'lost' },
];
const channels = [
  { id: 'c1', name: 'GoldTips VIP', type: 'paid', price: '₦2,500/mo', subscribers: 12400, revenue: '₦31,000,000', active: true },
  { id: 'c2', name: 'GoldTips Free', type: 'free', price: null, subscribers: 48200, revenue: '₦12,500,000', active: false },
];
const sports = ['Football', 'Basketball', 'Tennis', 'Cricket', 'Rugby', 'F1'];
interface DashboardPageProps {
  appUser: AppUser;
}
export function DashboardPage({ appUser }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'channels' | 'create' | 'payouts'>('overview');
  const [ticketMatches, setTicketMatches] = useState([{ home: '', away: '', odds: '', sport: 'Football' }]);
  const [ticketSport, setTicketSport] = useState('Football');
  const addMatch = () => setTicketMatches(prev => [...prev, { home: '', away: '', odds: '', sport: ticketSport }]);
  const removeMatch = (i: number) => setTicketMatches(prev => prev.filter((_, idx) => idx !== i));
  const updateMatch = (i: number, field: string, value: string) =>
    setTicketMatches(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: value } : m));
  const stats = [
    { label: 'Subscribers', value: '12,400', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Win Rate', value: '74%', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Streak', value: '8', icon: Zap, color: 'text-[#ef4444]', bg: 'bg-[#ef4444]/10' },
    { label: 'Tickets', value: '234', icon: Ticket, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];
  const tabs = [
    { key: 'overview', label: ' Overview' },
    { key: 'channels', label: ' Channels' },
    { key: 'create',   label: ' New Ticket' },
    { key: 'payouts',  label: ' Payouts' },
  ] as const;
  return (
    <div>
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-[#1f1f1f]">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-3">
            <div>
              <h1 className="text-lg font-black text-white">Tipster Dashboard</h1>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-[#ef4444] fill-[#ef4444]" />
                <span className="text-xs text-[#ef4444] font-bold">Verified Tipster · {appUser.name}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={cn('px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0',
                  activeTab === tab.key ? 'bg-[#ef4444] text-white' : 'text-[#71767b] hover:text-white hover:bg-white/5'
                )}
              >{tab.label}</button>
            ))}
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                      className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-4"
                    >
                      <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center mb-3', stat.bg)}>
                        <Icon className={cn('w-4 h-4', stat.color)} />
                      </div>
                      <p className="text-2xl font-black text-white">{stat.value}</p>
                      <p className="text-xs text-[#71767b] mt-0.5">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>
              <div className="bg-gradient-to-br from-[#ef4444] to-[#b91c1c] rounded-2xl p-5 text-white">
                <p className="text-sm opacity-80 mb-1">Total Revenue This Month</p>
                <p className="text-3xl font-black mb-1">₦31,000,000</p>
                <div className="flex items-center gap-1 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+12% from last month</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-white text-sm">Recent Tickets</p>
                  <button onClick={() => setActiveTab('create')} className="text-xs text-[#ef4444] font-bold hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> New
                  </button>
                </div>
                <div className="space-y-2">
                  {recentTickets.map((ticket, i) => (
                    <motion.div key={ticket.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="bg-[#111] border border-[#1f1f1f] rounded-xl p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-white flex items-center gap-1.5">
                          <Ticket className="w-3.5 h-3.5 text-[#ef4444]" />{ticket.code}
                        </span>
                        <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-black',
                          ticket.status === 'won' && 'bg-green-500/20 text-green-400',
                          ticket.status === 'lost' && 'bg-[#ef4444]/20 text-[#ef4444]',
                          ticket.status === 'active' && 'bg-blue-500/20 text-blue-400',
                          ticket.status === 'settled' && 'bg-[#71767b]/20 text-[#71767b]',
                        )}>{ticket.status.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-[#71767b]">{ticket.matches} games</span>
                        <span className="text-green-400">✓ {ticket.wins}W</span>
                        <span className="text-[#ef4444]">✗ {ticket.losses}L</span>
                        {ticket.pending > 0 && <span className="text-yellow-400"> {ticket.pending}</span>}
                        <span className="text-[#71767b] ml-auto">{ticket.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-4">
                <p className="font-bold text-white text-sm mb-3">Win Rate Trend</p>
                <div className="flex items-end gap-1.5 h-20">
                  {[65, 70, 68, 74, 72, 74, 76, 74].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-[#ef4444] rounded-t" style={{ height: `${val}%` }} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'].map(w => (
                    <p key={w} className="text-[9px] text-[#71767b] flex-1 text-center">{w}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Channels */}
          {activeTab === 'channels' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-bold text-white">My Channels</p>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ef4444] rounded-full text-xs font-bold text-white hover:bg-[#dc2626] transition-colors">
                  <Plus className="w-3.5 h-3.5" /> New Channel
                </button>
              </div>
              {channels.map((ch, i) => (
                <motion.div key={ch.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-white">{ch.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {ch.type === 'paid'
                          ? <span className="text-[9px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full font-bold">VIP</span>
                          : <span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full font-bold">FREE</span>
                        }
                        {ch.active && (
                          <span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full font-bold">ACTIVE</span>
                        )}
                      </div>
                    </div>
                    <button className="px-3 py-1.5 border border-[#1f1f1f] rounded-full text-xs font-bold text-[#71767b] hover:border-white hover:text-white transition-colors">
                      Manage
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/40 rounded-xl p-3">
                      <p className="text-xs text-[#71767b] mb-1">Subscribers</p>
                      <p className="font-black text-white">{ch.subscribers.toLocaleString()}</p>
                    </div>
                    <div className="bg-black/40 rounded-xl p-3">
                      <p className="text-xs text-[#71767b] mb-1">Revenue</p>
                      <p className="font-black text-green-400">{ch.revenue}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              <button className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-[#1f1f1f] rounded-2xl text-[#71767b] hover:border-[#ef4444]/30 hover:text-[#ef4444] transition-all">
                <Plus className="w-5 h-5" />
                <span className="text-sm font-bold">Create New Channel</span>
              </button>
            </div>
          )}
          {/* Create Ticket */}
          {activeTab === 'create' && (
            <div className="p-4 space-y-4">
              <div>
                <p className="font-bold text-white mb-1">Create New Ticket</p>
                <p className="text-xs text-[#71767b]">Add matches and set odds for your prediction ticket</p>
              </div>
              <div>
                <p className="text-xs text-[#71767b] font-semibold mb-2">Sport Category</p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {sports.map(sport => (
                    <button key={sport} onClick={() => setTicketSport(sport)}
                      className={cn('px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0',
                        ticketSport === sport ? 'bg-[#ef4444] text-white' : 'bg-[#111] border border-[#1f1f1f] text-[#71767b] hover:text-white'
                      )}
                    >{sport}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xs text-[#71767b] font-semibold">Matches ({ticketMatches.length})</p>
                {ticketMatches.map((match, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-[#111] border border-[#1f1f1f] rounded-xl p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#71767b] font-semibold">Match {i + 1}</p>
                      {ticketMatches.length > 1 && (
                        <button onClick={() => removeMatch(i)} className="text-[#ef4444] text-xs hover:text-red-300">
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input value={match.home} onChange={e => updateMatch(i, 'home', e.target.value)} placeholder="Home team"
                        className="bg-black border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#71767b] outline-none transition-all"
                      />
                      <input value={match.away} onChange={e => updateMatch(i, 'away', e.target.value)} placeholder="Away team"
                        className="bg-black border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#71767b] outline-none transition-all"
                      />
                    </div>
                    <input value={match.odds} onChange={e => updateMatch(i, 'odds', e.target.value)} placeholder="Odds (e.g. 1.85)"
                      className="w-full bg-black border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#71767b] outline-none transition-all"
                    />
                  </motion.div>
                ))}
                <button onClick={addMatch}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-[#1f1f1f] rounded-xl text-[#71767b] hover:border-[#ef4444]/30 hover:text-[#ef4444] transition-all text-sm font-bold"
                >
                  <Plus className="w-4 h-4" /> Add Match
                </button>
              </div>
              <div>
                <p className="text-xs text-[#71767b] font-semibold mb-2">Post to Channel</p>
                <div className="space-y-2">
                  {channels.map(ch => (
                    <button key={ch.id} className="w-full flex items-center gap-3 p-3 bg-[#111] border border-[#1f1f1f] hover:border-[#ef4444]/30 rounded-xl transition-all">
                      <div className="w-8 h-8 rounded-full bg-[#ef4444]/20 flex items-center justify-center font-black text-[#ef4444] text-sm shrink-0">
                        {ch.name[0]}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-bold text-white">{ch.name}</p>
                        <p className="text-xs text-[#71767b]">{ch.subscribers.toLocaleString()} subscribers</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#71767b]" />
                    </button>
                  ))}
                </div>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-[#dc2626] to-[#ef4444] rounded-full text-sm font-bold text-white hover:opacity-90 transition-all shadow-lg shadow-red-500/20">
                Post Ticket
              </button>
            </div>
          )}
          {/* Payouts */}
          {activeTab === 'payouts' && (
            <div className="p-4 space-y-4">
              <div className="bg-gradient-to-br from-[#ef4444] to-[#b91c1c] rounded-2xl p-5 text-white">
                <p className="text-sm opacity-80 mb-1">Available for Payout</p>
                <p className="text-3xl font-black mb-4">₦31,000,000</p>
                <button className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl py-2.5 text-sm font-bold transition-all">
                  <ArrowUpRight className="w-4 h-4" /> Request Payout
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-4">
                  <p className="text-xs text-[#71767b] mb-1">This Month</p>
                  <p className="text-xl font-black text-white">₦5,000,000</p>
                  <p className="text-xs text-green-400 mt-0.5">+12%</p>
                </div>
                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-4">
                  <p className="text-xs text-[#71767b] mb-1">All Time</p>
                  <p className="text-xl font-black text-white">₦87,500,000</p>
                  <p className="text-xs text-[#71767b] mt-0.5">Since Jan 2024</p>
                </div>
              </div>
              <div>
                <p className="font-bold text-white text-sm mb-3">Payout History</p>
                <div className="space-y-2">
                  {[
                    { amount: '₦5,000,000', date: 'Apr 1, 2026' },
                    { amount: '₦4,200,000', date: 'Mar 1, 2026' },
                    { amount: '₦3,800,000', date: 'Feb 1, 2026' },
                    { amount: '₦2,500,000', date: 'Jan 1, 2026' },
                  ].map((payout, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 bg-[#111] border border-[#1f1f1f] rounded-xl px-3 py-2.5"
                    >
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{payout.amount}</p>
                        <p className="text-xs text-[#71767b]">{payout.date}</p>
                      </div>
                      <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">PAID</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-white text-sm">Payout Account</p>
                  <button className="text-xs text-[#ef4444] font-bold hover:underline">Edit</button>
                </div>
                <p className="text-sm text-white font-semibold">First Bank Nigeria</p>
                <p className="text-xs text-[#71767b]">**** **** 4521</p>
                <p className="text-xs text-[#71767b]">{appUser.name}</p>
              </div>
              <div className="flex items-center gap-2 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                <Clock className="w-4 h-4 text-yellow-400 shrink-0" />
                <p className="text-xs text-yellow-400">Payouts are processed on the 1st of every month</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
