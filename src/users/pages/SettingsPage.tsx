import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Lock, Bell, Monitor, Shield,
  ChevronRight, LogOut, Moon, Sun,
  Eye, EyeOff, Trash2, AlertTriangle, X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { UserRole } from '../../core/types';
import { useAuth } from '../../auth/hooks/AuthContext';
import { apiClient } from '../../api/clients/ApiClient';
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className={cn('w-11 h-6 rounded-full transition-all relative shrink-0', value ? 'bg-[#ef4444]' : 'bg-[#71767b]/40')}
    >
      <motion.div animate={{ x: value ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
      />
    </button>
  );
}
function SettingRow({ label, desc, toggle, value, onChange, onClick, danger }: {
  label: string; desc?: string; toggle?: boolean; value?: boolean;
  onChange?: (v: boolean) => void; onClick?: () => void; danger?: boolean;
}) {
  return (
    <div onClick={onClick}
      className={cn('flex items-center justify-between px-4 py-3 border-b border-[#1f1f1f] transition-colors', onClick && 'cursor-pointer hover:bg-white/[0.02]', danger && 'hover:bg-[#ef4444]/5')}
    >
      <div className="flex-1 min-w-0 mr-4">
        <p className={cn('text-sm font-semibold', danger ? 'text-[#ef4444]' : 'text-white')}>{label}</p>
        {desc && <p className="text-xs text-[#71767b] mt-0.5">{desc}</p>}
      </div>
      {toggle && value !== undefined && onChange
        ? <Toggle value={value} onChange={onChange} />
        : onClick && <ChevronRight className={cn('w-4 h-4 shrink-0', danger ? 'text-[#ef4444]' : 'text-[#71767b]')} />
      }
    </div>
  );
}
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="px-4 py-2 bg-[#111]">
      <p className="text-xs font-black text-[#71767b] uppercase tracking-wider">{title}</p>
    </div>
  );
}
interface SettingsPageProps {
  userRole: UserRole;
}
export function SettingsPage({ userRole }: SettingsPageProps) {
  const isTipster = userRole === 'tipster';
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'account' | 'privacy' | 'notifications' | 'display' | 'security'>('account');
  const [name, setName] = useState('SportX Fan');
  const [email, setEmail] = useState('sportxfan@gmail.com');
  const [handle, setHandle] = useState('@sportxfan');
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [channelPrice, setChannelPrice] = useState('2500');
  const [savingPrice, setSavingPrice] = useState(false);

  useEffect(() => {
    if (isTipster) {
      apiClient.get<{ data: any }>('/tipster/profile')
        .then(res => {
          if (res?.data?.premiumPrice !== undefined) {
            setChannelPrice(String(res.data.premiumPrice || 0));
          }
        })
        .catch(err => console.error('Failed to load tipster profile price:', err));
    }
  }, [isTipster]);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [showActivity, setShowActivity] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);
  const [showPredictions, setShowPredictions] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [predictionResults, setPredictionResults] = useState(true);
  const [newFollowers, setNewFollowers] = useState(true);
  const [mentions, setMentions] = useState(true);
  const [messages, setMessages] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [autoplayVideos, setAutoplayVideos] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const tabs = [
    { key: 'account',       label: 'Account',      icon: User },
    { key: 'privacy',       label: 'Privacy',       icon: Eye },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'display',       label: 'Display',       icon: Monitor },
    { key: 'security',      label: 'Security',      icon: Shield },
  ] as const;
  return (
    <div>
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-[#1f1f1f]">
        <div className="px-4 py-3">
          <h1 className="text-lg font-black text-white mb-3">Settings</h1>
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0',
                    activeTab === tab.key ? 'bg-[#ef4444] text-white' : 'text-[#71767b] hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />{tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {activeTab === 'account' && (
            <div>
              <SectionHeader title="Profile Information" />
              <div className="p-4 space-y-3 border-b border-[#1f1f1f]">
                <div>
                  <label className="text-xs text-[#71767b] font-semibold mb-1 block">Display Name</label>
                  <input value={name} onChange={e => setName(e.target.value)}
                    className="w-full bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#71767b] font-semibold mb-1 block">Username</label>
                  <input value={handle} onChange={e => setHandle(e.target.value)}
                    className="w-full bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#71767b] font-semibold mb-1 block">Email</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                    className="w-full bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all"
                  />
                </div>
                <button className="w-full py-2.5 bg-[#ef4444] rounded-full text-sm font-bold text-white hover:bg-[#dc2626] transition-colors">
                  Save Changes
                </button>
              </div>
              {/* Tipster payout settings */}
              {isTipster && (
                <>
                  <SectionHeader title="Tipster Settings" />
                  <SettingRow label="Payout Account" desc="Manage your bank account for payouts" onClick={() => {}} />
                  <SettingRow label="Channel Settings" desc="Manage your prediction channels" onClick={() => {}} />
                  <SettingRow label="Subscription Pricing" desc="Set prices for your paid channels" onClick={() => setShowPriceModal(true)} />
                </>
              )}
              <SectionHeader title="Account Actions" />
              <SettingRow label="Change Password" desc="Update your password" onClick={() => {}} />
              <SettingRow label="Connected Accounts" desc="Google, Apple" onClick={() => {}} />
              <SettingRow label="Download My Data" desc="Get a copy of your Arena data" onClick={() => {}} />
              <SectionHeader title="Danger Zone" />
              <SettingRow label="Deactivate Account" desc="Temporarily disable your account" onClick={() => {}} danger />
              <SettingRow label="Delete Account" desc="Permanently delete your account and data" onClick={() => {}} danger />
              <div className="p-4">
                <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3 border border-[#ef4444]/30 rounded-full text-[#ef4444] text-sm font-bold hover:bg-[#ef4444]/10 transition-all">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
          {activeTab === 'privacy' && (
            <div>
              <SectionHeader title="Account Privacy" />
              <SettingRow label="Private Account" desc="Only approved followers can see your posts" toggle value={privateAccount} onChange={setPrivateAccount} />
              <SettingRow label="Show Activity Status" desc="Let others see when you were last active" toggle value={showActivity} onChange={setShowActivity} />
              <SectionHeader title="Interactions" />
              <SettingRow label="Allow Direct Messages" desc="Anyone can send you messages" toggle value={allowMessages} onChange={setAllowMessages} />
              <SettingRow label="Show Predictions Publicly" desc="Others can see your prediction history" toggle value={showPredictions} onChange={setShowPredictions} />
              <SectionHeader title="Data" />
              <SettingRow label="Blocked Accounts" desc="Manage blocked users" onClick={() => {}} />
              <SettingRow label="Muted Accounts" desc="Manage muted users" onClick={() => {}} />
            </div>
          )}
          {activeTab === 'notifications' && (
            <div>
              <SectionHeader title="Push Notifications" />
              <SettingRow label="Enable Push Notifications" desc="Receive notifications on your device" toggle value={pushNotifs} onChange={setPushNotifs} />
              <SectionHeader title="Notification Types" />
              <SettingRow label="Match Alerts" desc="Goals, results, and live updates" toggle value={matchAlerts} onChange={setMatchAlerts} />
              <SettingRow label="Prediction Results" desc="When tipsters post results" toggle value={predictionResults} onChange={setPredictionResults} />
              <SettingRow label="New Followers" desc="When someone follows you" toggle value={newFollowers} onChange={setNewFollowers} />
              <SettingRow label="Mentions & Replies" desc="When someone mentions or replies to you" toggle value={mentions} onChange={setMentions} />
              <SettingRow label="Messages" desc="New direct messages" toggle value={messages} onChange={setMessages} />
              <SectionHeader title="Email" />
              <SettingRow label="Email Notifications" desc="Receive updates via email" toggle value={emailNotifs} onChange={setEmailNotifs} />
            </div>
          )}
          {activeTab === 'display' && (
            <div>
              <SectionHeader title="Theme" />
              <div className="px-4 py-3 border-b border-[#1f1f1f]">
                <div className="grid grid-cols-2 gap-3">
                  {[{ mode: true, icon: Moon, label: 'Dark' }, { mode: false, icon: Sun, label: 'Light' }].map(t => {
                    const Icon = t.icon;
                    return (
                      <button key={t.label} onClick={() => setDarkMode(t.mode)}
                        className={cn('flex flex-col items-center gap-2 p-4 rounded-xl border transition-all', darkMode === t.mode ? 'bg-[#ef4444]/10 border-[#ef4444]/30' : 'bg-[#111] border-[#1f1f1f] hover:border-white/10')}
                      >
                        <Icon className={cn('w-6 h-6', darkMode === t.mode ? 'text-[#ef4444]' : 'text-[#71767b]')} />
                        <span className={cn('text-xs font-bold', darkMode === t.mode ? 'text-[#ef4444]' : 'text-[#71767b]')}>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <SectionHeader title="Layout" />
              <SettingRow label="Compact Mode" desc="Show more content with smaller spacing" toggle value={compactMode} onChange={setCompactMode} />
              <SettingRow label="Autoplay Videos" desc="Videos play automatically in feed" toggle value={autoplayVideos} onChange={setAutoplayVideos} />
              <SettingRow label="Reduce Motion" desc="Minimize animations throughout the app" toggle value={reduceMotion} onChange={setReduceMotion} />
              <SectionHeader title="Language" />
              <SettingRow label="App Language" desc="English (UK)" onClick={() => {}} />
            </div>
          )}
          {activeTab === 'security' && (
            <div>
              <SectionHeader title="Login Security" />
              <SettingRow label="Two-Factor Authentication" desc="Add an extra layer of security" toggle value={twoFA} onChange={setTwoFA} />
              <SettingRow label="Login Alerts" desc="Get notified of new logins" toggle value={loginAlerts} onChange={setLoginAlerts} />
              <SectionHeader title="Password" />
              <div className="p-4 space-y-3 border-b border-[#1f1f1f]">
                <div className="flex items-center gap-2 bg-[#111] border border-[#1f1f1f] focus-within:border-[#ef4444]/50 rounded-xl px-4 py-2.5 transition-all">
                  <Lock className="w-4 h-4 text-[#71767b] shrink-0" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Current password"
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-[#71767b] outline-none"
                  />
                  <button onClick={() => setShowPassword(s => !s)} className="text-[#71767b] hover:text-white">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <input type="password" placeholder="New password"
                  className="w-full bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#71767b] outline-none transition-all"
                />
                <input type="password" placeholder="Confirm new password"
                  className="w-full bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#71767b] outline-none transition-all"
                />
                <button className="w-full py-2.5 bg-[#ef4444] rounded-full text-sm font-bold text-white hover:bg-[#dc2626] transition-colors">
                  Update Password
                </button>
              </div>
              <SectionHeader title="Sessions" />
              <SettingRow label="Active Sessions" desc="Manage devices logged in to your account" onClick={() => {}} />
              <SettingRow label="Sign Out All Devices" onClick={() => {}} danger />
              <SectionHeader title="Danger" />
              <div className="px-4 py-3 border-b border-[#1f1f1f]">
                <div className="flex items-start gap-3 p-3 bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-white">Delete Account</p>
                    <p className="text-xs text-[#71767b] mt-0.5 mb-2 leading-relaxed">This action is permanent and cannot be undone.</p>
                    <button className="flex items-center gap-1.5 text-xs text-[#ef4444] font-bold hover:underline">
                      <Trash2 className="w-3 h-3" /> Permanently Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Price Management Modal */}
      <AnimatePresence>
        {showPriceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPriceModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#0d0d0d] border border-[#1f1f1f] rounded-2xl p-6 shadow-2xl relative z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
                <h3 className="text-base font-black text-white">Subscription Pricing</h3>
                <button onClick={() => setShowPriceModal(false)} className="p-1 rounded-lg hover:bg-white/5 text-[#71767b] hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="text-xs text-[#71767b] font-semibold mb-2 block">Monthly VIP Subscription Price (₦)</label>
                <div className="flex items-center gap-2 bg-[#111] border border-[#1f1f1f] focus-within:border-[#ef4444]/50 rounded-xl px-4 py-3 transition-all">
                  <span className="text-white font-bold shrink-0">₦</span>
                  <input
                    type="number"
                    value={channelPrice}
                    onChange={(e) => setChannelPrice(e.target.value)}
                    placeholder="e.g. 2500"
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-[#71767b] outline-none"
                  />
                </div>
                <p className="text-[10px] text-[#71767b] mt-1.5 leading-relaxed">
                  Enter the price subscribers will pay monthly to join your VIP channel. Set to 0 or leave empty for a free channel.
                </p>
              </div>

              <button
                onClick={async () => {
                  setSavingPrice(true);
                  try {
                    const priceNum = Number(channelPrice) || 0;
                    await apiClient.put('/tipster/profile', { premiumPrice: priceNum });
                    alert('VIP channel price updated successfully!');
                    setShowPriceModal(false);
                  } catch (error) {
                    console.error('Failed to update price:', error);
                    alert('Failed to save changes. Please try again.');
                  } finally {
                    setSavingPrice(false);
                  }
                }}
                disabled={savingPrice}
                className="w-full py-3 bg-gradient-to-r from-[#dc2626] to-[#ef4444] rounded-xl text-sm font-bold text-white hover:shadow-lg hover:shadow-red-500/30 hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                {savingPrice ? 'Saving Changes...' : 'Save Settings'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
