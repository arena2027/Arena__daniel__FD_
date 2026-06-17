import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import {
  Home,
  Zap,
  Users,
  Trophy,
  Target,
  User,
  Wallet,
  Settings,
  Bookmark,
  X,
  Video,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import type { UserRole, AppUser } from '../core/types';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
  isLive?: boolean;
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  userRole: UserRole;
  appUser: AppUser;
}

const userNavItems: NavItem[] = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Zap, label: 'Live', path: '/live', isLive: true },
  { icon: Target, label: 'Predictions', path: '/predictions' },
  { icon: Video, label: 'Videos', path: '/videos' },
  { icon: Users, label: 'Communities', path: '/communities' },
  { icon: Wallet, label: 'Wallet', path: '/wallet' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
  { icon: User, label: 'Profile', path: '/profile' },
];

const tipsterNavItems: NavItem[] = [
  ...userNavItems.filter(item => item.label !== 'Settings'),
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: Trophy, label: 'Dashboard', path: '/dashboard' },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Sidebar({ open, onClose, userRole, appUser }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = userRole === 'tipster' ? tipsterNavItems : userNavItems;
  const isOpen = open;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed inset-y-14 left-0 z-50 w-72 bg-[#09090c] border-r border-[#1f1f1f] p-4 transition-transform duration-300 ease-out overflow-y-auto md:relative md:w-auto md:inset-auto md:z-auto md:border-none md:p-4 md:flex md:flex-col md:translate-x-0 md:h-full md:bg-transparent md:overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div>
            <div className="flex items-center justify-between mb-6 md:hidden">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#ef4444] flex items-center justify-center text-white font-black">
                  {getInitials(appUser.name || 'A')}
                </div>
                <span className="text-white font-bold">Arena</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Section */}
            <div className="mb-6 relative z-10">
              <p className="text-xs font-bold text-[#71767b] uppercase px-4 mb-2">Navigation</p>
              <nav className="space-y-1">
                {navItems.slice(0, 5).map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => {
                        navigate(item.path);
                        onClose();
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left relative z-20',
                        isActive ? 'bg-[#1f1f1f] text-[#ef4444]' : 'text-[#e7e9ea] hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <Icon className={cn('w-5 h-5 shrink-0', isActive && 'text-[#ef4444]')} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] bg-[#ef4444] text-white font-bold rounded-full px-2 py-0.5">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                      {item.isLive && (
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Other Sections */}
            <div className="border-t border-white/10 pt-6 relative">
              <p className="text-xs font-bold text-[#71767b] uppercase px-4 mb-2">More</p>
              <nav className="space-y-1">
                {navItems.slice(5).map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => {
                        navigate(item.path);
                        onClose();
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left relative z-10',
                        isActive ? 'bg-[#1f1f1f] text-[#ef4444]' : 'text-[#e7e9ea] hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <Icon className={cn('w-5 h-5 shrink-0', isActive && 'text-[#ef4444]')} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] bg-[#ef4444] text-white font-bold rounded-full px-2 py-0.5">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* User Profile Section - always at bottom */}
          <div className="shrink-0 border-t border-white/10 pt-4 mt-auto">
            <button
              onClick={() => {
                navigate('/profile');
                onClose();
              }}
              className="w-full flex items-start gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-[#ef4444] flex items-center justify-center text-white font-black flex-shrink-0">
                {getInitials(appUser.name || 'A')}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-bold text-white truncate">{appUser.name || 'Arena User'}</p>
                <p className="text-xs text-[#71767b] truncate">{appUser.handle || '@arena'}</p>
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
