import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Search,
  Zap,
  Users,
  Trophy,
  Target,
  Mail,
  Bell,
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
  { icon: Search, label: 'Explore', path: '/explore' },
  { icon: Zap, label: 'Live', path: '/live', isLive: true },
  { icon: Target, label: 'Predictions', path: '/predictions' },
  { icon: Video, label: 'Videos', path: '/videos' },
  { icon: Users, label: 'Communities', path: '/communities' },
  { icon: Mail, label: 'Messages', path: '/messages', badge: 2 },
  { icon: Bell, label: 'Notifications', path: '/notifications', badge: 9 },
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
          'fixed inset-y-0 left-0 z-50 w-72 bg-[#09090c] border-r border-[#1f1f1f] p-4 transition-transform duration-300 ease-out md:sticky md:top-0 md:h-screen md:overflow-hidden md:flex md:flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
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

        <nav className="space-y-1.5 flex-1 overflow-y-auto">
          {navItems.map(item => {
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
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left',
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

        <div className="shrink-0 border-t border-white/10 pt-4 mt-auto">
          <button
            onClick={() => {
              navigate('/profile');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#ef4444] flex items-center justify-center text-white font-black">
              {getInitials(appUser.name || 'A')}
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{appUser.name || 'Arena User'}</p>
              <p className="text-xs text-[#71767b] truncate">{appUser.handle || '@arena'}</p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
