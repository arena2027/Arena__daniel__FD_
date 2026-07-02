import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, Crown, Users, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import {
  getChannelById,
  getChannelMembers,
  getNewMembers,
  groupMembersAlphabetically,
  getOnlineMembers,
  type ChannelMember,
} from './channelData';

function MemberAvatar({ member, size = 'md' }: { member: ChannelMember; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'w-9 h-9 text-xs' : 'w-11 h-11 text-sm';
  return (
    <div className="relative shrink-0">
      <div
        className={cn(
          dim,
          'rounded-full flex items-center justify-center font-black text-white',
          member.avatarColor
        )}
      >
        {member.name[0]?.toUpperCase()}
      </div>
      {member.isOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#050505] rounded-full" />
      )}
    </div>
  );
}

function MemberRow({
  member,
  onClick,
}: {
  member: ChannelMember;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] active:bg-white/[0.05] transition-colors text-left min-h-touch"
    >
      <MemberAvatar member={member} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-bold text-white truncate">{member.name}</p>
          {member.verified && (
            <span className="text-[10px] text-blue-400 font-bold">✓</span>
          )}
          {member.plan === 'vip' && <Crown className="w-3.5 h-3.5 text-yellow-400 shrink-0" />}
        </div>
        <p className="text-xs text-[#71767b] truncate">
          {member.isOnline ? 'online' : member.lastSeen ? `last seen ${member.lastSeen}` : member.handle}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {member.isNew && (
          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#ef4444]/20 text-[#ef4444]">
            new
          </span>
        )}
        <ChevronRight className="w-4 h-4 text-[#71767b]" />
      </div>
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-2 bg-[#0a0a0c] border-y border-[#1f1f1f]">
      <p className="text-[11px] font-black text-[#71767b] uppercase tracking-widest">{children}</p>
    </div>
  );
}

function LetterHeader({ letter }: { letter: string }) {
  return (
    <div className="px-4 py-1.5 bg-[#111] border-b border-[#1f1f1f] sticky top-0 z-10">
      <p className="text-sm font-black text-[#ef4444]">{letter}</p>
    </div>
  );
}

type Filter = 'all' | 'online' | 'new' | 'vip';

export function ChannelMembersPage() {
  const { channelId = '' } = useParams();
  const navigate = useNavigate();
  const channel = getChannelById(channelId);
  const allMembers = useMemo(() => getChannelMembers(channelId), [channelId]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    return allMembers.filter((member) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        member.name.toLowerCase().includes(q) ||
        member.handle.toLowerCase().includes(q) ||
        member.bio.toLowerCase().includes(q);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'online' && member.isOnline) ||
        (filter === 'new' && member.isNew) ||
        (filter === 'vip' && member.plan === 'vip');
      return matchesSearch && matchesFilter;
    });
  }, [allMembers, search, filter]);

  const newMembers = useMemo(() => getNewMembers(filtered), [filtered]);
  const onlineCount = useMemo(() => getOnlineMembers(allMembers).length, [allMembers]);
  const alphaGroups = useMemo(() => groupMembersAlphabetically(filtered), [filtered]);
  const showSections = filter === 'all' && !search;

  const openProfile = (member: ChannelMember) => {
    navigate(`/settings/account/channels/${channelId}/members/${member.id}`);
  };

  if (!channel) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-sm text-[#71767b] mb-4">Channel not found</p>
        <button
          type="button"
          onClick={() => navigate('/settings/account/channels')}
          className="text-sm font-bold text-[#ef4444] hover:underline"
        >
          Back to channels
        </button>
      </div>
    );
  }

  return (
    <div className="pb-4">
      {/* Channel summary */}
      <div className="px-4 py-4 border-b border-[#1f1f1f] bg-[#12121A]">
        <p className="text-2xl font-black text-white">{allMembers.length}</p>
        <p className="text-sm text-[#71767b]">
          members · {onlineCount} online · {newMembers.length} new
        </p>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-[#1f1f1f] sticky top-0 z-20 bg-[#050505]/95 backdrop-blur-md">
        <div className="flex items-center gap-2 bg-[#111] border border-[#1f1f1f] focus-within:border-[#ef4444]/50 rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-[#71767b] shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or username..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-[#71767b] outline-none"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-4 py-3 border-b border-[#1f1f1f] overflow-x-auto scrollbar-none">
        {([
          { key: 'all', label: `All (${allMembers.length})` },
          { key: 'online', label: `Online (${onlineCount})` },
          { key: 'new', label: 'New' },
          { key: 'vip', label: 'VIP' },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors',
              filter === tab.key ? 'bg-[#ef4444] text-white' : 'bg-[#111] text-[#71767b] hover:text-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <Users className="w-10 h-10 text-[#71767b] mb-3" />
          <p className="text-sm font-bold text-white">No members found</p>
          <p className="text-xs text-[#71767b] mt-1">Try a different search or filter.</p>
        </div>
      ) : showSections ? (
        <>
          {newMembers.length > 0 && (
            <>
              <SectionLabel>New Members</SectionLabel>
              <div className="divide-y divide-[#1f1f1f]">
                {newMembers.map((member) => (
                  <MemberRow key={member.id} member={member} onClick={() => openProfile(member)} />
                ))}
              </div>
            </>
          )}

          <SectionLabel>All Members — A to Z</SectionLabel>
          {alphaGroups.map((group) => (
            <div key={group.letter}>
              <LetterHeader letter={group.letter} />
              <div className="divide-y divide-[#1f1f1f]">
                {group.members.map((member) => (
                  <MemberRow key={member.id} member={member} onClick={() => openProfile(member)} />
                ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="divide-y divide-[#1f1f1f]">
          {filtered
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((member) => (
              <MemberRow key={member.id} member={member} onClick={() => openProfile(member)} />
            ))}
        </div>
      )}
    </div>
  );
}
