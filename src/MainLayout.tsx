import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Compass, Zap, Target, MessageCircle,
  Wallet, Settings, 
  Users, LayoutDashboard, Bookmark} from 'lucide-react';
import { cn } from './lib/utils';

// ✅ FIX: define types locally (instead of importing from App)
type UserRole = 'user' | 'tipster' | any;

type AppUser = {
  name?: string;
  role?: UserRole;
  [key: string]: any;
};

// ── Nav Items ─────────────────────────────────────────────────
const userNavItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: Zap, label: 'Live', path: '/live' },
  { icon: Target, label: 'Predictions', path: '/predictions' },
  { icon: Users, label: 'Communities', path: '/communities' },
  { icon: MessageCircle, label: 'Messages', path: '/messages' },
  { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
  { icon: Wallet, label: 'Wallet', path: '/wallet' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const tipsterNavItems = [
  ...userNavItems,
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
];


// ── Sidebar ───────────────────────────────────────────────────
function Sidebar({
  open,
  onClose,
  onLogout,
  userRole,
  appUser,
}: {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  userRole: UserRole;
  appUser: AppUser;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const navItems = userRole === 'tipster' ? tipsterNavItems : userNavItems;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-black/50 z-40" />
          <motion.div
            ref={sidebarRef}
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            className="fixed left-0 top-0 h-screen w-60 bg-[#0d0d0d] border-r border-[#1f1f1f] z-50 flex flex-col py-6 px-3"
          >
            <div className="flex items-center gap-3 px-3 mb-6">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-[#ef4444]">
                <img src="/logo.jpg" className="w-full h-full object-cover" />
              </div>
              <span className="text-white font-black text-xl">Arena</span>
            </div>

            {userRole === 'tipster' && (
              <div className="mx-3 mb-4 px-3 py-2 bg-[#ef4444]/10 rounded-xl">
                <p className="text-xs text-[#ef4444]">TIPSTER</p>
                <p className="text-[10px] text-gray-400">{appUser?.name}</p>
              </div>
            )}

            <nav className="flex-1 space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-xl',
                      active ? 'text-red-500' : 'text-gray-400'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <button onClick={onLogout} className="text-red-500 mt-4">
              Logout
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Main Layout ───────────────────────────────────────────────
interface MainLayoutProps {
  children: ReactNode;
  onLogout: () => void;
  userRole: UserRole;
  appUser: AppUser;
}

export function MainLayout({
  children,
  onLogout,
  userRole,
  appUser
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <button onClick={() => setSidebarOpen(true)}>Menu</button>

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
        userRole={userRole}
        appUser={appUser}
      />

      <main>{children}</main>
    </div>
  );
}