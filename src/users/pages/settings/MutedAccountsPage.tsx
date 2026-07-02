import { useState } from 'react';
import { VolumeX } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useSettings } from './settingsComponents';

const INITIAL_MUTED = [
  { id: '1', name: 'Transfer Rumours', handle: '@transferrumours' },
  { id: '2', name: 'Hot Takes FC', handle: '@hottakesfc' },
  { id: '3', name: 'BetSlip Daily', handle: '@betslipdaily' },
];

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-10 h-10 rounded-full bg-[#71767b]/20 flex items-center justify-center text-sm font-black text-[#71767b] shrink-0">
      {name[0]?.toUpperCase()}
    </div>
  );
}

export function MutedAccountsPage() {
  const { showToast } = useSettings();
  const [muted, setMuted] = useState(INITIAL_MUTED);

  const unmute = (id: string, name: string) => {
    setMuted((prev) => prev.filter((u) => u.id !== id));
    showToast(`${name} has been unmuted`);
  };

  return (
    <div>
      <p className="px-4 py-3 text-xs text-[#71767b] leading-relaxed border-b border-[#1f1f1f]">
        Muted accounts stay followed but their posts and notifications are hidden from your feed.
      </p>

      {muted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <VolumeX className="w-10 h-10 text-[#71767b] mb-3" />
          <p className="text-sm font-bold text-white">No muted accounts</p>
          <p className="text-xs text-[#71767b] mt-1">Accounts you mute will appear here.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#1f1f1f]">
          {muted.map((user) => (
            <div key={user.id} className="flex items-center gap-3 px-4 py-3">
              <Avatar name={user.name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <p className="text-xs text-[#71767b] truncate">{user.handle}</p>
              </div>
              <button
                type="button"
                onClick={() => unmute(user.id, user.name)}
                className={cn(
                  'px-3 py-1.5 rounded-full border border-[#1f1f1f] text-xs font-bold text-white',
                  'hover:bg-white/5 transition-colors shrink-0'
                )}
              >
                Unmute
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
