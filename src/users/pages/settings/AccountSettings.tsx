import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import type { UserRole } from '../../../core/types';
import { useAuth } from '../../../auth/hooks/AuthContext';
import {
  SectionHeader,
  SettingRow,
  SettingsNote,
  BACKEND_NOTE,
  useSettings,
} from './settingsComponents';

interface AccountSettingsProps {
  userRole: UserRole;
}

export function AccountSettings({ userRole }: AccountSettingsProps) {
  const isTipster = userRole === 'tipster';
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast, showConfirm } = useSettings();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [handle, setHandle] = useState(user?.handle ?? '');

  return (
    <div>
      <SettingsNote>{BACKEND_NOTE}</SettingsNote>

      <SectionHeader title="Profile Information" />
      <div className="p-4 space-y-3 border-b border-[#1f1f1f]">
        <div>
          <label className="text-xs text-[#71767b] font-semibold mb-1 block">Display Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all"
          />
        </div>
        <div>
          <label className="text-xs text-[#71767b] font-semibold mb-1 block">Username</label>
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="w-full bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all"
          />
        </div>
        <div>
          <label className="text-xs text-[#71767b] font-semibold mb-1 block">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            if (!name.trim()) {
              showToast('Display name cannot be empty', 'error');
              return;
            }
            showToast('Profile saved locally — server sync pending');
          }}
          className="w-full py-2.5 bg-[#ef4444] rounded-full text-sm font-bold text-white hover:bg-[#dc2626] transition-colors"
        >
          Save Changes
        </button>
      </div>

      {isTipster && (
        <>
          <SectionHeader title="Tipster Settings" />
          <SettingRow
            label="Payout Account"
            desc="Manage your bank account for payouts"
            onClick={() => navigate('/settings/account/payout')}
          />
          <SettingRow
            label="Channel Settings"
            desc="Manage your prediction channels"
            onClick={() => navigate('/settings/account/channels')}
          />
          <SettingRow
            label="Subscription Pricing"
            desc="Set prices for your paid channels"
            onClick={() => navigate('/settings/account/pricing')}
          />
        </>
      )}

      <SectionHeader title="Account Actions" />
      <SettingRow
        label="Change Password"
        desc="Update your password"
        onClick={() => navigate('/settings/security')}
      />
      <SettingRow
        label="Connected Accounts"
        desc="Google, Apple"
        onClick={() => navigate('/settings/account/connected')}
      />
      <SettingRow
        label="Download My Data"
        desc="Get a copy of your Arena data"
        onClick={() => navigate('/settings/account/download-data')}
      />

      <SectionHeader title="Danger Zone" />
      <SettingRow
        label="Deactivate Account"
        desc="Temporarily disable your account"
        danger
        onClick={() =>
          showConfirm({
            title: 'Deactivate Account?',
            desc: 'Your account will be hidden from other users. You can reactivate at any time.',
            onConfirm: () => showToast('Account deactivation requires server connection', 'error'),
          })
        }
      />
      <SettingRow
        label="Delete Account"
        desc="Permanently delete your account and data"
        danger
        onClick={() =>
          showConfirm({
            title: 'Delete Account?',
            desc: 'This is permanent and cannot be undone. All your data will be erased.',
            onConfirm: () => logout(),
          })
        }
      />

      <div className="p-4">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 border border-[#ef4444]/30 rounded-full text-[#ef4444] text-sm font-bold hover:bg-[#ef4444]/10 transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
