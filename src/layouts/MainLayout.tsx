// ── Main Layout ───────────────────────────────────────────────────────────────

import React, { Suspense, useEffect, useState } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { Home, Zap, Target, Plus, User } from 'lucide-react';
import { useAuth } from '../auth/hooks/AuthContext';
import { useDetailView } from '../contexts/DetailViewContext';
import { cn } from '../lib/utils';
import { RouteGuard } from '../middleware/guards/RouteGuards';
import { Header } from '../layout/Header';
import { Sidebar } from '../layout/Sidebar';
import { RightSidebar } from '../layout/RightSidebar';
import { FeedProvider } from '../stores/feedStore';
import TipsterDashboard from '../dashboard/tipster/TipsterDashboard';
import AdminDashboard from '../admin/pages/AdminDashboard';

// Lazy load page components
const HomePage = React.lazy(() => import('../users/pages/HomePage').then(m => ({ default: m.HomePage })));
const LivePage = React.lazy(() => import('../users/pages/LivePage').then(m => ({ default: m.LivePage })));
const FeedPage = React.lazy(() => import('../pages/FeedPage').then(m => ({ default: m.FeedPage })));
const VideoPage = React.lazy(() => import('../pages/VideoPage').then(m => ({ default: m.VideoPage })));
const PredictionsPage = React.lazy(() => import('../users/pages/PredictionsPage').then(m => ({ default: m.PredictionsPage })));
const CommunitiesPage = React.lazy(() => import('../users/pages/CommunitiesPage').then(m => ({ default: m.CommunitiesPage })));
const MessagesPage = React.lazy(() => import('../users/pages/MessagesPage').then(m => ({ default: m.MessagesPage })));
const NotificationsPage = React.lazy(() => import('../users/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const ProfilePage = React.lazy(() => import('../users/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const WalletPage = React.lazy(() => import('../users/pages/WalletPage').then(m => ({ default: m.WalletPage })));
const SettingsPage = React.lazy(() => import('../users/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const BookmarksPage = React.lazy(() => import('../users/pages/BookmarksPage').then(m => ({ default: m.BookmarksPage })));
const UserProfileView = React.lazy(() => import('../users/pages/UserProfileView').then(m => ({ default: m.UserProfileRoute })));
const BecomeTipsterPage = React.lazy(() => import('../users/pages/BecomeTipsterPage'));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border-4 border-[#ef4444] border-t-transparent animate-spin" />
        <p className="text-sm font-bold tracking-wider">Loading Arena...</p>
      </div>
    </div>
  );
}


// ── Mobile Bottom Navigation ──────────────────────────────────────
function MobileBottomNav({ visible }: { visible: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { showDetailView } = useDetailView();

  // Pages where bottom nav should NOT appear at all
  const hideOnPaths = ['/auth', '/auth/otp', '/admin'];
  
  // Hide if on hidden paths or if a detail view is open
  const shouldShow = 
    visible &&
    !hideOnPaths.includes(location.pathname) && 
    !showDetailView;

  if (!shouldShow) {
    return null;
  }

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Zap, label: 'Live', path: '/live' },
    { icon: Target, label: 'Predictions', path: '/predictions' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const handleCreatePost = () => {
    navigate('/');
    window.dispatchEvent(new CustomEvent('openPostModal'));
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#09090c] border-t border-[#1f1f1f]">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex-1 flex flex-col items-center justify-center py-2 transition-colors duration-200',
                isActive ? 'text-[#ef4444]' : 'text-[#71767b] hover:text-white'
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={handleCreatePost}
          className="flex-1 flex flex-col items-center justify-center py-2 text-[#71767b] hover:text-[#ef4444] transition-colors duration-200"
        >
          <div className="w-10 h-10 rounded-full bg-[#ef4444] flex items-center justify-center mb-1 shadow-lg shadow-red-500/40">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-semibold">Create</span>
        </button>
      </div>
    </nav>
  );
}

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>; // Or redirect to auth
  }

  const location = useLocation();
  const { showDetailView } = useDetailView();

  const hideMobileNavAndHeaderPaths = [
    '/messages',
    '/predictions',
    '/profile',
    '/user',
    '/become-tipster',
    '/wallet',
    '/settings',
    '/bookmarks',
    '/notifications'
  ];

  const hideOnMobile = hideMobileNavAndHeaderPaths.some(path => location.pathname.startsWith(path)) || showDetailView;
  const shouldShowGlobalHeader = !mobileView || !hideOnMobile;
  const shouldShowBottomNav = !sidebarOpen && (!mobileView || !hideOnMobile);

  const isFullBleedLayout = ['/messages', '/predictions', '/profile', '/user'].some(path => location.pathname.startsWith(path));
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {shouldShowGlobalHeader && (
        <Header
          title="Arena"
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
        />
      )}

      {/* 3-Column Layout with Fixed Sidebar */}
      <div className="flex flex-1 overflow-hidden pr-0 xl:pr-80">
        {/* Left Sidebar - LOCKED (no scrolling) */}
        <div className="hidden md:block md:w-64 lg:w-72 md:border-r md:border-[#1f1f1f] md:h-[calc(100vh-56px)] md:overflow-hidden">
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            userRole={user.role}
            appUser={user}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)}>
            <div onClick={e => e.stopPropagation()}>
              <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                userRole={user.role}
                appUser={user}
              />
            </div>
          </div>
        )}

        {/* Center + Right Container */}
        <div className={cn(
          "flex flex-1 relative",
          shouldShowGlobalHeader ? "h-[calc(100vh-56px)]" : "h-screen"
        )}>
          {/* Center Main Feed - Scrollable */}
          <main 
            className={cn(
              "flex-1 border-r border-[#1f1f1f]",
              location.pathname.startsWith('/messages') ? "h-full overflow-hidden flex flex-col" : "overflow-y-auto"
            )} 
            style={{ msOverflowStyle: 'auto', scrollbarWidth: 'none' }}
          >
            <div 
              className={cn(
                'w-full', 
                isFullBleedLayout ? 'w-full' : 'max-w-2xl mx-auto',
                location.pathname.startsWith('/messages') && 'h-full flex flex-col'
              )}
            >
              <div 
                className={cn(
                  "px-4 py-6 sm:px-6", 
                  isFullBleedLayout && "px-0 py-0 sm:px-0",
                  location.pathname.startsWith('/messages') && 'h-full flex flex-col flex-1'
                )}
              >
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Public Routes (accessible by all authenticated users) */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/live" element={<LivePage />} />
                    <Route path="/feed" element={<FeedProvider><FeedPage /></FeedProvider>} />
                    <Route path="/videos" element={<VideoPage />} />
                    <Route path="/predictions" element={<PredictionsPage />} />
                    <Route path="/communities" element={<CommunitiesPage />} />
                    <Route path="/messages" element={<MessagesPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/bookmarks" element={<BookmarksPage />} />
                    <Route path="/wallet" element={<WalletPage userRole={user.role} />} />
                    <Route path="/settings" element={<SettingsPage userRole={user.role} />} />
                    <Route path="/profile" element={<ProfilePage appUser={user} />} />
                    <Route path="/user/:name" element={<UserProfileView />} />
                    <Route path="/become-tipster" element={<BecomeTipsterPage />} />

                    {/* Tipster-only Routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <RouteGuard user={user} allowedRoles={['tipster']}>
                          <TipsterDashboard />
                        </RouteGuard>
                      }
                    />

                    {/* Admin-only Routes */}
                    <Route
                      path="/admin"
                      element={
                        <RouteGuard user={user} allowedRoles={['admin']}>
                          <AdminDashboard />
                        </RouteGuard>
                      }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </div>
            </div>
          </main>

          {/* Right Sidebar - Fully Independent Scrolling */}
          <div className="hidden xl:flex xl:fixed xl:top-14 xl:right-0 xl:w-80 xl:h-[calc(100vh-56px)] xl:overflow-y-auto xl:border-l xl:border-[#1f1f1f] xl:bg-[#050505]" style={{ scrollbarWidth: 'none' }}>
            <RightSidebar />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav visible={shouldShowBottomNav} />
    </div>
  );
};

export default MainLayout;
