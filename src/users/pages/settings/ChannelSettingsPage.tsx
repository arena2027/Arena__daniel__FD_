import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { SectionHeader, useSettings } from './settingsComponents';
import { TIPSTER_CHANNELS, getChannelMembers } from './channelData';

export function ChannelSettingsPage() {
  const navigate = useNavigate();
  const { showToast } = useSettings();
  const [channels, setChannels] = useState(TIPSTER_CHANNELS);

  const toggleActive = (id: string) => {
    setChannels((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const next = !c.active;
        showToast(`${c.name} ${next ? 'enabled' : 'paused'}`);
        return { ...c, active: next };
      })
    );
  };

  return (
    <div>
      <p className="px-4 py-3 text-xs text-[#71767b] leading-relaxed border-b border-[#1f1f1f]">
        Manage your prediction channels. View members, pause channels, or update pricing from account settings.
      </p>

      <SectionHeader title="Your Channels" />
      <div className="divide-y divide-[#1f1f1f]">
        {channels.map((channel) => (
          <div key={channel.id} className="px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-white">{channel.name}</p>
                  <span
                    className={cn(
                      'text-[10px] font-bold uppercase px-2 py-0.5 rounded-full',
                      channel.type === 'vip'
                        ? 'bg-yellow-500/15 text-yellow-400'
                        : 'bg-green-500/15 text-green-400'
                    )}
                  >
                    {channel.type}
                  </span>
                  {!channel.active && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#71767b]/15 text-[#71767b]">
                      paused
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#71767b] mt-1">
                  {getChannelMembers(channel.id).length} members · tap to view all
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleActive(channel.id)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-bold transition-colors shrink-0',
                  channel.active
                    ? 'border border-[#1f1f1f] text-white hover:bg-white/5'
                    : 'bg-[#ef4444] text-white hover:bg-[#dc2626]'
                )}
              >
                {channel.active ? 'Pause' : 'Enable'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/settings/account/channels/${channel.id}/members`)}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#1f1f1f] text-sm font-bold text-white hover:bg-white/5 transition-colors"
            >
              <Users className="w-4 h-4 text-[#ef4444]" />
              View Members
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
