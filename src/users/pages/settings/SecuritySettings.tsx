import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertTriangle, Trash2 } from 'lucide-react';
import {
  SectionHeader,
  SettingRow,
  SettingsNote,
  BACKEND_NOTE,
  useSettings,
} from './settingsComponents';
import { useAuth } from '../../../auth/hooks/AuthContext';

export function SecuritySettings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast, showConfirm } = useSettings();

  const [twoFA, setTwoFA] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleToggle = (setter: (v: boolean) => void, value: boolean, label: string) => {
    setter(value);
    showToast(`${label} updated locally — server sync pending`);
  };

  return (
    <div>
      <SettingsNote>{BACKEND_NOTE}</SettingsNote>

      <SectionHeader title="Login Security" />
      <SettingRow
        label="Two-Factor Authentication"
        desc="Add an extra layer of security"
        toggle
        value={twoFA}
        onChange={(v) => handleToggle(setTwoFA, v, 'Two-factor authentication')}
      />
      <SettingRow
        label="Login Alerts"
        desc="Get notified of new logins"
        toggle
        value={loginAlerts}
        onChange={(v) => handleToggle(setLoginAlerts, v, 'Login alerts')}
      />

      <SectionHeader title="Password" />
      <div className="p-4 space-y-3 border-b border-[#1f1f1f]">
        <div className="flex items-center gap-2 bg-[#111] border border-[#1f1f1f] focus-within:border-[#ef4444]/50 rounded-xl px-4 py-2.5 transition-all">
          <Lock className="w-4 h-4 text-[#71767b] shrink-0" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Current password"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-[#71767b] outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="text-[#71767b] hover:text-white"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#71767b] outline-none transition-all"
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#71767b] outline-none transition-all"
        />
        <button
          type="button"
          onClick={() => {
            if (!newPassword) {
              showToast('Enter your new password', 'error');
              return;
            }
            if (newPassword !== confirmPassword) {
              showToast('Passwords do not match', 'error');
              return;
            }
            if (newPassword.length < 8) {
              showToast('Password must be at least 8 characters', 'error');
              return;
            }
            showToast('Password change requires server connection', 'error');
            setNewPassword('');
            setConfirmPassword('');
          }}
          className="w-full py-2.5 bg-[#ef4444] rounded-full text-sm font-bold text-white hover:bg-[#dc2626] transition-colors"
        >
          Update Password
        </button>
      </div>

      <SectionHeader title="Sessions" />
      <SettingRow
        label="Active Sessions"
        desc="Manage devices logged in to your account"
        onClick={() => navigate('/settings/security/sessions')}
      />
      <SettingRow
        label="Sign Out All Devices"
        danger
        onClick={() =>
          showConfirm({
            title: 'Sign out all devices?',
            desc: 'You will be logged out from all active sessions across all devices.',
            onConfirm: () => {
              showToast('Sign out all devices requires server connection', 'error');
            },
          })
        }
      />

      <SectionHeader title="Danger" />
      <div className="px-4 py-3 border-b border-[#1f1f1f]">
        <div className="flex items-start gap-3 p-3 bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-white">Delete Account</p>
            <p className="text-xs text-[#71767b] mt-0.5 mb-2 leading-relaxed">
              This action is permanent and cannot be undone.
            </p>
            <button
              type="button"
              onClick={() =>
                showConfirm({
                  title: 'Delete Account?',
                  desc: 'This is permanent and cannot be undone.',
                  onConfirm: () => logout(),
                })
              }
              className="flex items-center gap-1.5 text-xs text-[#ef4444] font-bold hover:underline"
            >
              <Trash2 className="w-3 h-3" /> Permanently Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
