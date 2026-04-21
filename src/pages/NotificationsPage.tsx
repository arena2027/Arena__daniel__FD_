import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Heart, MessageCircle, Repeat2, Zap, Trophy, Target } from 'lucide-react';
import { cn } from '../lib/utils';

// ── Types ─────────────────────────────────────────────────────
interface Notification {
  id: string;
  type: 'like' | 'comment' | 'repost' | 'follow' | 'match' | 'prediction' | 'tipster';
  user?: string;
  text: string;
  time: string;
  read: boolean;
  category: 'all' | 'matches' | 'mentions' | 'predictions';
}

// ── Mock Data ─────────────────────────────────────────────────
const notifications: Notification[] = [
  { id: 'n1', type: 'like', user: 'John Pulse', text: 'liked your post about Man City', time: '2m ago', read: false, category: 'mentions' },
  { id: 'n2', type: 'match', text: '🔴 LIVE: Man City vs Arsenal just kicked off', time: '5m ago', read: false, category: 'matches' },
  { id: 'n3', type: 'comment', user: 'Sarah Kicks', text: 'replied to your post: "I agree, Liverpool are unstoppable"', time: '12m ago', read: false, category: 'mentions' },
  { id: 'n4', type: 'prediction', text: '🎯 GoldTips VIP posted a new ticket — GOLD-8K2X', time: '30m ago', read: false, category: 'predictions' },
  { id: 'n5', type: 'match', text: '⚽ GOAL! Haaland scores for Man City — 2-1', time: '45m ago', read: true, category: 'matches' },
  { id: 'n6', type: 'follow', user: 'NBA Central', text: 'started following you', time: '1h ago', read: true, category: 'mentions' },
  { id: 'n7', type: 'repost', user: 'Transfer News', text: 'reposted your prediction about Real Madrid', time: '2h ago', read: true, category: 'mentions' },
  { id: 'n8', type: 'prediction', text: '✅ Arena Free Tips ticket settled — 4 wins, 1 loss', time: '2h ago', read: true, category: 'predictions' },
  { id: 'n9', type: 'match', text: '🏀 FINAL: Lakers 112 - 98 Warriors', time: '3h ago', read: true, category: 'matches' },
  { id: 'n10', type: 'tipster', text: '🏆 Champions Elite posted new UCL predictions', time: '4h ago', read: true, category: 'predictions' },
  { id: 'n11', type: 'like', user: 'UCL King', text: 'liked your comment on the Champions League post', time: '5h ago', read: true, category: 'mentions' },
  { id: 'n12', type: 'match', text: '⚽ FULL TIME: Barcelona 4-0 Valencia', time: '6h ago', read: true, category: 'matches' },
];

// ── Icon map ──────────────────────────────────────────────────
function NotifIcon({ type }: { type: Notification['type'] }) {
  const map = {
    like: { icon: Heart, color: 'bg-pink-500/20 text-pink-400' },
    comment: { icon: MessageCircle, color: 'bg-blue-500/20 text-blue-400' },
    repost: { icon: Repeat2, color: 'bg-green-500/20 text-green-400' },
    follow: { icon: Zap, color: 'bg-[#ef4444]/20 text-[#ef4444]' },
    match: { icon: Trophy, color: 'bg-yellow-500/20 text-yellow-400' },
    prediction: { icon: Target, color: 'bg-purple-500/20 text-purple-400' },
    tipster: { icon: Trophy, color: 'bg-[#ef4444]/20 text-[#ef4444]' },
  };
  const { icon: Icon, color } = map[type];
  return (
    <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shrink-0', color)}>
      <Icon className="w-4 h-4" />
    </div>
  );
}

// ── Notifications Page ────────────────────────────────────────
export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'matches' | 'mentions' | 'predictions'>('all');

  const tabs = [
    { key: 'all',         label: 'All' },
    { key: 'matches',     label: 'Matches' },
    { key: 'mentions',    label: 'Mentions' },
    { key: 'predictions', label: 'Predictions' },
  ] as const;

  const filtered = notifications.filter(n =>
    activeTab === 'all' ? true : n.category === activeTab
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div>
      {/* Header */}
      <div className="sticky top-14 z-20 bg-black/90 backdrop-blur-md border-b border-[#1f1f1f]">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-black text-white">Notifications</h1>
            {unreadCount > 0 && (
              <span className="text-xs text-[#71767b]">{unreadCount} unread</span>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0',
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
      </div>

      {/* Notifications List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-8">
              <Bell className="w-12 h-12 text-[#71767b] mb-3" />
              <p className="font-bold text-white mb-1">No notifications</p>
              <p className="text-sm text-[#71767b]">You're all caught up!</p>
            </div>
          ) : filtered.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={cn(
                'flex items-start gap-3 px-4 py-3 border-b border-[#1f1f1f] cursor-pointer transition-colors hover:bg-white/[0.02]',
                !notif.read && 'bg-[#ef4444]/[0.03] border-l-2 border-l-[#ef4444]'
              )}
            >
              <NotifIcon type={notif.type} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#e7e9ea] leading-relaxed">
                  {notif.user && (
                    <span className="font-bold text-white">{notif.user} </span>
                  )}
                  {notif.text}
                </p>
                <p className="text-xs text-[#71767b] mt-0.5">{notif.time}</p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-[#ef4444] shrink-0 mt-1.5" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}