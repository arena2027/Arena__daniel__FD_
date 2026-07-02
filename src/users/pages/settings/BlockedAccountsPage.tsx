import { useState } from 'react';
import { UserX } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useSettings } from './settingsComponents';

const INITIAL_BLOCKED = [
  { id: '1', name: 'SpamBot99', handle: '@spambot99' },
  { id: '2', name: 'TrollKing', handle: '@trollking' },
];

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-10 h-10 rounded-full bg-[#ef4444]/20 flex items-center justify-center text-sm font-black text-[#ef4444] shrink-0">
      {name[0]?.toUpperCase()}
    </div>
  );
}

export function BlockedAccountsPage() {
  const { showToast } = useSettings();
  const [blocked, setBlocked] = useState(INITIAL_BLOCKED);

  const unblock = (id: string, name: string) => {
    setBlocked((prev) => prev.filter((u) => u.id !== id));
    showToast(`${name} has been unblocked`);
  };

  return (
    <div>
      <p className="px-4 py-3 text-xs text-[#71767b] leading-relaxed border-b border-[#1f1f1f]">
        Blocked accounts cannot see your profile, message you, or interact with your posts.
      </p>

      {blocked.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <UserX className="w-10 h-10 text-[#71767b] mb-3" />
          <p className="text-sm font-bold text-white">No blocked accounts</p>
          <p className="text-xs text-[#71767b] mt-1">Accounts you block will appear here.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#1f1f1f]">
          {blocked.map((user) => (
            <div key={user.id} className="flex items-center gap-3 px-4 py-3">
              <Avatar name={user.name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <p className="text-xs text-[#71767b] truncate">{user.handle}</p>
              </div>
              <button
                type="button"
                onClick={() => unblock(user.id, user.name)}
                className={cn(
                  'px-3 py-1.5 rounded-full border border-[#1f1f1f] text-xs font-bold text-white',
                  'hover:bg-white/5 transition-colors shrink-0'
                )}
              >
                Unblock
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
