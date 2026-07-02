export interface TipsterChannel {
  id: string;
  name: string;
  type: 'free' | 'vip';
  subscribers: number;
  active: boolean;
}

export interface ChannelMember {
  id: string;
  name: string;
  handle: string;
  username: string;
  plan: 'free' | 'vip';
  status: 'active' | 'expired';
  joinedAt: string;
  joinedTimestamp: number;
  isOnline: boolean;
  lastSeen?: string;
  isNew: boolean;
  bio: string;
  location?: string;
  followers: number;
  verified: boolean;
  avatarColor: string;
}

export const TIPSTER_CHANNELS: TipsterChannel[] = [
  { id: '1', name: 'Arena Free Tips', type: 'free', subscribers: 12, active: true },
  { id: '2', name: 'VIP Predictions', type: 'vip', subscribers: 18, active: true },
  { id: '3', name: 'Live Match Picks', type: 'free', subscribers: 6, active: false },
];

function member(
  partial: Omit<ChannelMember, 'username'> & { username?: string }
): ChannelMember {
  const handle = partial.handle.startsWith('@') ? partial.handle : `@${partial.handle}`;
  return {
    ...partial,
    handle,
    username: partial.username ?? handle.slice(1),
  };
}

const now = Date.now();
const day = 86400000;

export const CHANNEL_MEMBERS: Record<string, ChannelMember[]> = {
  '1': [
    member({ id: 'm1', name: 'John Pulse', handle: '@johnpulse', plan: 'free', status: 'active', joinedAt: 'Today', joinedTimestamp: now - day * 0.2, isOnline: true, isNew: true, bio: 'Football analyst. Following every Premier League match.', location: 'Lagos, Nigeria', followers: 456, verified: true, avatarColor: 'bg-[#ef4444]' }),
    member({ id: 'm2', name: 'Sarah Kicks', handle: '@sarahkicks', plan: 'free', status: 'active', joinedAt: 'Yesterday', joinedTimestamp: now - day, isOnline: false, lastSeen: '2h ago', isNew: true, bio: 'Arsenal fan. Love predictions and banter.', location: 'Abuja, Nigeria', followers: 890, verified: false, avatarColor: 'bg-blue-600' }),
    member({ id: 'm3', name: 'Mike Odds', handle: '@mikeodds', plan: 'free', status: 'active', joinedAt: 'Mar 1, 2026', joinedTimestamp: now - day * 5, isOnline: true, isNew: true, bio: 'Stats-driven bettor. NBA & football.', followers: 234, verified: false, avatarColor: 'bg-green-600' }),
    member({ id: 'm4', name: 'Ada Bets', handle: '@adabets', plan: 'free', status: 'expired', joinedAt: 'Dec 8, 2025', joinedTimestamp: now - day * 90, isOnline: false, lastSeen: '3d ago', isNew: false, bio: 'Weekend punter.', followers: 112, verified: false, avatarColor: 'bg-purple-600' }),
    member({ id: 'm5', name: 'Chidi Plays', handle: '@chidiplays', plan: 'free', status: 'active', joinedAt: 'Feb 14, 2026', joinedTimestamp: now - day * 20, isOnline: false, lastSeen: '1d ago', isNew: false, bio: 'UCL nights only.', followers: 78, verified: false, avatarColor: 'bg-orange-600' }),
    member({ id: 'm6', name: 'Emeka Tips', handle: '@emekatips', plan: 'free', status: 'active', joinedAt: 'Jan 20, 2026', joinedTimestamp: now - day * 45, isOnline: false, lastSeen: '5h ago', isNew: false, bio: 'Following top tipsters.', followers: 201, verified: false, avatarColor: 'bg-cyan-600' }),
    member({ id: 'm7', name: 'Funke FC', handle: '@funkefc', plan: 'free', status: 'active', joinedAt: 'Nov 2, 2025', joinedTimestamp: now - day * 120, isOnline: true, isNew: false, bio: 'Women\'s football & La Liga.', followers: 340, verified: false, avatarColor: 'bg-pink-600' }),
    member({ id: 'm8', name: 'Gbenga Goal', handle: '@gbengagoal', plan: 'free', status: 'active', joinedAt: 'Oct 18, 2025', joinedTimestamp: now - day * 140, isOnline: false, lastSeen: '1w ago', isNew: false, bio: 'Over 2.5 specialist.', followers: 56, verified: false, avatarColor: 'bg-yellow-600' }),
    member({ id: 'm9', name: 'Hassan Heat', handle: '@hassanheat', plan: 'free', status: 'active', joinedAt: 'Sep 5, 2025', joinedTimestamp: now - day * 180, isOnline: false, lastSeen: '2w ago', isNew: false, bio: 'Live betting enthusiast.', followers: 129, verified: false, avatarColor: 'bg-indigo-600' }),
    member({ id: 'm10', name: 'Ivy Innings', handle: '@ivyinnings', plan: 'free', status: 'expired', joinedAt: 'Aug 1, 2025', joinedTimestamp: now - day * 210, isOnline: false, lastSeen: '1mo ago', isNew: false, bio: 'Cricket & football.', followers: 44, verified: false, avatarColor: 'bg-teal-600' }),
    member({ id: 'm11', name: 'Jide Junction', handle: '@jidejunction', plan: 'free', status: 'active', joinedAt: 'Jul 12, 2025', joinedTimestamp: now - day * 230, isOnline: false, lastSeen: '4d ago', isNew: false, bio: 'Community mod hopeful.', followers: 312, verified: false, avatarColor: 'bg-rose-600' }),
    member({ id: 'm12', name: 'Kemi Kicks', handle: '@kemikicks', plan: 'free', status: 'active', joinedAt: 'Jun 3, 2025', joinedTimestamp: now - day * 270, isOnline: true, isNew: false, bio: 'Premier League die-hard.', followers: 167, verified: false, avatarColor: 'bg-violet-600' }),
  ],
  '2': [
    member({ id: 'v1', name: 'GoldTips Fan', handle: '@goldfan', plan: 'vip', status: 'active', joinedAt: 'Today', joinedTimestamp: now - day * 0.1, isOnline: true, isNew: true, bio: 'VIP subscriber. Tracking every pick.', followers: 89, verified: false, avatarColor: 'bg-yellow-500' }),
    member({ id: 'v2', name: 'UCL Watcher', handle: '@uclwatch', plan: 'vip', status: 'active', joinedAt: 'Yesterday', joinedTimestamp: now - day * 0.8, isOnline: false, lastSeen: '30m ago', isNew: true, bio: 'Champions League only. VIP member.', followers: 234, verified: true, avatarColor: 'bg-blue-600' }),
    member({ id: 'v3', name: 'Premier Picks', handle: '@premierpicks', plan: 'vip', status: 'active', joinedAt: '2 days ago', joinedTimestamp: now - day * 2, isOnline: true, isNew: true, bio: 'EPL accumulator fan.', followers: 567, verified: false, avatarColor: 'bg-green-600' }),
    member({ id: 'v4', name: 'Lagos Bettor', handle: '@lagosbettor', plan: 'vip', status: 'active', joinedAt: 'Feb 22, 2026', joinedTimestamp: now - day * 12, isOnline: false, lastSeen: '3h ago', isNew: false, bio: 'Local leagues + EPL.', location: 'Lagos, Nigeria', followers: 1204, verified: true, avatarColor: 'bg-[#ef4444]' }),
    member({ id: 'v5', name: 'Weekend VIP', handle: '@weekendvip', plan: 'vip', status: 'expired', joinedAt: 'Nov 30, 2025', joinedTimestamp: now - day * 95, isOnline: false, lastSeen: '2w ago', isNew: false, bio: 'Subscription lapsed.', followers: 45, verified: false, avatarColor: 'bg-gray-600' }),
    member({ id: 'v6', name: 'Abuja Analyst', handle: '@abujaanalyst', plan: 'vip', status: 'active', joinedAt: 'Jan 18, 2026', joinedTimestamp: now - day * 48, isOnline: false, lastSeen: '6h ago', isNew: false, bio: 'Data-led predictions.', followers: 890, verified: false, avatarColor: 'bg-purple-600' }),
    member({ id: 'v7', name: 'Benin Bets', handle: '@beninbets', plan: 'vip', status: 'active', joinedAt: 'Dec 20, 2025', joinedTimestamp: now - day * 75, isOnline: true, isNew: false, bio: 'High-stakes weekends.', followers: 178, verified: false, avatarColor: 'bg-orange-600' }),
    member({ id: 'v8', name: 'Chelsea Core', handle: '@chelseacore', plan: 'vip', status: 'active', joinedAt: 'Nov 8, 2025', joinedTimestamp: now - day * 110, isOnline: false, lastSeen: '1d ago', isNew: false, bio: 'Blues fan. VIP since day one.', followers: 445, verified: false, avatarColor: 'bg-cyan-600' }),
    member({ id: 'v9', name: 'Delta Doubles', handle: '@deltadoubles', plan: 'vip', status: 'active', joinedAt: 'Oct 1, 2025', joinedTimestamp: now - day * 150, isOnline: false, lastSeen: '3d ago', isNew: false, bio: 'Accumulator builder.', followers: 92, verified: false, avatarColor: 'bg-teal-600' }),
    member({ id: 'v10', name: 'Enugu Edge', handle: '@enuguedge', plan: 'vip', status: 'active', joinedAt: 'Sep 14, 2025', joinedTimestamp: now - day * 170, isOnline: false, lastSeen: '5d ago', isNew: false, bio: 'Value bet hunter.', followers: 203, verified: false, avatarColor: 'bg-indigo-600' }),
    member({ id: 'v11', name: 'Faithful Fan', handle: '@faithfulfan', plan: 'vip', status: 'active', joinedAt: 'Aug 22, 2025', joinedTimestamp: now - day * 195, isOnline: true, isNew: false, bio: 'Never misses a VIP drop.', followers: 334, verified: false, avatarColor: 'bg-pink-600' }),
    member({ id: 'v12', name: 'Ghana Goals', handle: '@ghanagoals', plan: 'vip', status: 'active', joinedAt: 'Jul 30, 2025', joinedTimestamp: now - day * 220, isOnline: false, lastSeen: '1w ago', isNew: false, bio: 'AFCON & EPL.', location: 'Accra, Ghana', followers: 678, verified: true, avatarColor: 'bg-lime-600' }),
    member({ id: 'v13', name: 'Henry Handicap', handle: '@henryhandicap', plan: 'vip', status: 'active', joinedAt: 'Jun 15, 2025', joinedTimestamp: now - day * 260, isOnline: false, lastSeen: '2w ago', isNew: false, bio: 'Asian handicap specialist.', followers: 156, verified: false, avatarColor: 'bg-amber-600' }),
    member({ id: 'v14', name: 'Ibadan Insider', handle: '@ibadaninsider', plan: 'vip', status: 'expired', joinedAt: 'May 2, 2025', joinedTimestamp: now - day * 300, isOnline: false, lastSeen: '1mo ago', isNew: false, bio: 'Former VIP member.', followers: 67, verified: false, avatarColor: 'bg-stone-600' }),
    member({ id: 'v15', name: 'Jos Jumper', handle: '@josjumper', plan: 'vip', status: 'active', joinedAt: 'Apr 10, 2025', joinedTimestamp: now - day * 330, isOnline: false, lastSeen: '4d ago', isNew: false, bio: 'Long-term subscriber.', followers: 289, verified: false, avatarColor: 'bg-sky-600' }),
    member({ id: 'v16', name: 'Kano King', handle: '@kanoking', plan: 'vip', status: 'active', joinedAt: 'Mar 1, 2025', joinedTimestamp: now - day * 370, isOnline: false, lastSeen: '12h ago', isNew: false, bio: 'OG VIP member since launch.', followers: 1024, verified: true, avatarColor: 'bg-red-700' }),
    member({ id: 'v17', name: 'Lekki Lines', handle: '@lekkillines', plan: 'vip', status: 'active', joinedAt: 'Feb 8, 2025', joinedTimestamp: now - day * 395, isOnline: true, isNew: false, bio: 'Premium picks collector.', followers: 412, verified: false, avatarColor: 'bg-emerald-600' }),
    member({ id: 'v18', name: 'Maiduguri Match', handle: '@maidugurimatch', plan: 'vip', status: 'active', joinedAt: 'Jan 5, 2025', joinedTimestamp: now - day * 430, isOnline: false, lastSeen: '8h ago', isNew: false, bio: 'Early believer.', followers: 198, verified: false, avatarColor: 'bg-fuchsia-600' }),
  ],
  '3': [
    member({ id: 'l1', name: 'Live Fan 01', handle: '@livefan01', plan: 'free', status: 'active', joinedAt: 'Today', joinedTimestamp: now - day * 0.3, isOnline: true, isNew: true, bio: 'Live match alerts only.', followers: 23, verified: false, avatarColor: 'bg-[#ef4444]' }),
    member({ id: 'l2', name: 'Match Day', handle: '@matchday', plan: 'free', status: 'active', joinedAt: 'Yesterday', joinedTimestamp: now - day, isOnline: false, lastSeen: '1h ago', isNew: true, bio: 'In-play bettor.', followers: 56, verified: false, avatarColor: 'bg-blue-600' }),
    member({ id: 'l3', name: 'Naija Live', handle: '@naijalive', plan: 'free', status: 'active', joinedAt: 'Mar 8, 2026', joinedTimestamp: now - day * 3, isOnline: true, isNew: true, bio: 'Never miss kickoff.', followers: 134, verified: false, avatarColor: 'bg-green-600' }),
    member({ id: 'l4', name: 'Onitsha Odds', handle: '@onitshaodds', plan: 'free', status: 'active', joinedAt: 'Feb 1, 2026', joinedTimestamp: now - day * 30, isOnline: false, lastSeen: '2d ago', isNew: false, bio: 'Live channel regular.', followers: 87, verified: false, avatarColor: 'bg-purple-600' }),
    member({ id: 'l5', name: 'Port Harcourt Pro', handle: '@phpro', plan: 'free', status: 'active', joinedAt: 'Jan 10, 2026', joinedTimestamp: now - day * 55, isOnline: false, lastSeen: '1w ago', isNew: false, bio: 'Weekend live picks.', followers: 201, verified: false, avatarColor: 'bg-orange-600' }),
    member({ id: 'l6', name: 'Quick Kick', handle: '@quickkick', plan: 'free', status: 'expired', joinedAt: 'Dec 1, 2025', joinedTimestamp: now - day * 100, isOnline: false, lastSeen: '3w ago', isNew: false, bio: 'Inactive member.', followers: 12, verified: false, avatarColor: 'bg-gray-600' }),
  ],
};

export function getChannelById(channelId: string) {
  return TIPSTER_CHANNELS.find((c) => c.id === channelId);
}

export function getChannelMembers(channelId: string) {
  return CHANNEL_MEMBERS[channelId] ?? [];
}

export function getChannelMember(channelId: string, memberId: string) {
  return getChannelMembers(channelId).find((m) => m.id === memberId);
}

export function groupMembersAlphabetically(members: ChannelMember[]) {
  const sorted = [...members].sort((a, b) => a.name.localeCompare(b.name));
  const groups: { letter: string; members: ChannelMember[] }[] = [];

  for (const member of sorted) {
    const letter = member.name[0]?.toUpperCase() ?? '#';
    const last = groups[groups.length - 1];
    if (last?.letter === letter) {
      last.members.push(member);
    } else {
      groups.push({ letter, members: [member] });
    }
  }

  return groups;
}

export function getNewMembers(members: ChannelMember[]) {
  return [...members]
    .filter((m) => m.isNew)
    .sort((a, b) => b.joinedTimestamp - a.joinedTimestamp);
}

export function getOnlineMembers(members: ChannelMember[]) {
  return members.filter((m) => m.isOnline);
}
