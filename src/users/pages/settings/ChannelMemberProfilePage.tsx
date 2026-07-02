import { useNavigate, useParams } from 'react-router-dom';
import {
  MessageCircle,
  UserMinus,
  Crown,
  MapPin,
  Calendar,
  Users,
  ExternalLink,
  BadgeCheck,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { getChannelById, getChannelMember } from './channelData';
import { useSettings } from './settingsComponents';

export function ChannelMemberProfilePage() {
  const { channelId = '', memberId = '' } = useParams();
  const navigate = useNavigate();
  const { showToast, showConfirm } = useSettings();

  const channel = getChannelById(channelId);
  const member = getChannelMember(channelId, memberId);

  if (!channel || !member) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-sm text-[#71767b] mb-4">Member not found</p>
        <button
          type="button"
          onClick={() => navigate(`/settings/account/channels/${channelId}/members`)}
          className="text-sm font-bold text-[#ef4444] hover:underline"
        >
          Back to members
        </button>
      </div>
    );
  }

  const removeMember = () => {
    showConfirm({
      title: `Remove ${member.name}?`,
      desc: 'They will lose access to this channel and stop receiving your predictions.',
      onConfirm: () => {
        showToast(`${member.name} removed from channel`);
        navigate(`/settings/account/channels/${channelId}/members`);
      },
    });
  };

  return (
    <div className="pb-8">
      {/* Profile hero */}
      <div className="flex flex-col items-center px-4 pt-6 pb-5 border-b border-[#1f1f1f] bg-[#12121A]">
        <div className="relative mb-4">
          <div
            className={cn(
              'w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black text-white ring-4 ring-[#ef4444]/20',
              member.avatarColor
            )}
          >
            {member.name[0]?.toUpperCase()}
          </div>
          {member.isOnline && (
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-[#12121A] rounded-full" />
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <h2 className="text-xl font-black text-white">{member.name}</h2>
          {member.verified && <BadgeCheck className="w-5 h-5 text-blue-400" />}
          {member.plan === 'vip' && <Crown className="w-4 h-4 text-yellow-400" />}
        </div>
        <p className="text-sm text-[#71767b] mt-0.5">{member.handle}</p>

        <p className="text-sm text-[#b0b3b8] text-center leading-relaxed mt-3 max-w-xs">
          {member.bio}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-xs text-[#71767b]">
          {member.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {member.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> {member.followers.toLocaleString()} followers
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          <span
            className={cn(
              'text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border',
              member.status === 'active'
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : 'bg-[#71767b]/10 text-[#71767b] border-[#71767b]/20'
            )}
          >
            {member.status}
          </span>
          <span
            className={cn(
              'text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border',
              member.plan === 'vip'
                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                : 'bg-green-500/10 text-green-400 border-green-500/20'
            )}
          >
            {member.plan} member
          </span>
          {member.isNew && (
            <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20">
              new
            </span>
          )}
        </div>
      </div>

      {/* Channel info */}
      <div className="px-4 py-4 border-b border-[#1f1f1f] space-y-3">
        <p className="text-xs font-black text-[#71767b] uppercase tracking-wider">In this channel</p>
        <div className="flex items-center gap-3 text-sm">
          <Calendar className="w-4 h-4 text-[#71767b] shrink-0" />
          <div>
            <p className="text-white font-semibold">Joined {channel.name}</p>
            <p className="text-xs text-[#71767b]">{member.joinedAt}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <MessageCircle className="w-4 h-4 text-[#71767b] shrink-0" />
          <p className="text-[#71767b]">
            {member.isOnline ? (
              <span className="text-green-400 font-semibold">Online now</span>
            ) : (
              <>Last seen {member.lastSeen ?? 'recently'}</>
            )}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-2.5">
        <button
          type="button"
          onClick={() => navigate('/messages')}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#ef4444] text-white text-sm font-bold hover:bg-[#dc2626] transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Send Message
        </button>

        <button
          type="button"
          onClick={() => navigate(`/user/${encodeURIComponent(member.name)}`)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#1f1f1f] text-white text-sm font-bold hover:bg-white/5 transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-[#71767b]" />
          View Full Arena Profile
        </button>

        <button
          type="button"
          onClick={removeMember}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#ef4444]/30 text-[#ef4444] text-sm font-bold hover:bg-[#ef4444]/10 transition-colors"
        >
          <UserMinus className="w-4 h-4" />
          Remove from Channel
        </button>
      </div>
    </div>
  );
}
