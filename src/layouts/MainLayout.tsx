// ── Main Layout ───────────────────────────────────────────────────────────────

import React, { Suspense, useEffect, useState } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/hooks/AuthContext';
import { cn } from '../lib/utils';
import { RouteGuard } from '../middleware/guards/RouteGuards';
import { Header } from '../layout/Header';
import { Sidebar } from '../layout/Sidebar';
import { FeedProvider } from '../stores/feedStore';
import TipsterDashboard from '../dashboard/tipster/TipsterDashboard';
import AdminDashboard from '../admin/pages/AdminDashboard';

// Lazy load page components
const HomePage = React.lazy(() => import('../users/pages/HomePage').then(m => ({ default: m.HomePage })));
const ExplorePage = React.lazy(() => import('../users/pages/ExplorePage').then(m => ({ default: m.ExplorePage })));
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
const BecomeTipsterPage = React.lazy(() => import('../users/pages/BecomeTipsterPage').then(m => ({ default: m.BecomeTipsterPage })));
const UserProfileView = React.lazy(() => import('../users/pages/UserProfileView').then(m => ({ default: m.UserProfileRoute })));

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

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>; // Or redirect to auth
  }

  const location = useLocation();
  const isFullBleedLayout = ['/messages', '/predictions'].includes(location.pathname);
  const activeTab = (
    Object.entries({
      Home: '/',
      Explore: '/explore',
      Live: '/live',
      Predictions: '/predictions',
    }) as [string, string][]
  ).find(([, path]) => path === location.pathname)?.[0] ?? 'Home';

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Header
        title="Arena"
        activeTab={activeTab}
        onTabChange={(tab: string) => {
          const tabRoutes: Record<string, string> = {
            Home: '/',
            Explore: '/explore',
            Live: '/live',
            Predictions: '/predictions',
          };
          navigate(tabRoutes[tab] ?? '/');
        }}
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userRole={user.role}
          appUser={user}
        />

        <main className="flex-1 overflow-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`
            main::-webkit-scrollbar {
              width: 0 !important;
              display: none !important;
            }
          `}</style>
          <div className={cn('h-full', isFullBleedLayout ? 'w-full' : 'max-w-[680px] mx-auto px-4 sm:px-6 py-6')}>
            <div className={cn(
              'h-full',
              isFullBleedLayout
                ? 'bg-[#070708]'
                : 'border-x border-[#1f1f1f] bg-[#070708] rounded-[32px] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.45)] pb-6'
            )}>
              <div className="px-4 py-6 sm:px-6">
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Public Routes (accessible by all authenticated users) */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/explore" element={<ExplorePage />} />
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

                    {/* User-only Routes */}
                    <Route
                      path="/become-tipster"
                      element={
                        <RouteGuard user={user} allowedRoles={['user']}>
                          <BecomeTipsterPage />
                        </RouteGuard>
                      }
                    />

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
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;