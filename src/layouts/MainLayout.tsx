// ── Main Layout ───────────────────────────────────────────────────────────────

import React, { Suspense } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/hooks/AuthContext';
import type { UserRole } from '../core/types';
import { RouteGuard } from '../middleware/guards/RouteGuards';
import TipsterDashboard from '../dashboard/tipster/TipsterDashboard';
import AdminDashboard from '../admin/pages/AdminDashboard';

// Lazy load page components
const HomePage = React.lazy(() => import('../users/pages/HomePage').then(m => ({ default: m.HomePage })));
const ExplorePage = React.lazy(() => import('../users/pages/ExplorePage').then(m => ({ default: m.ExplorePage })));
const LivePage = React.lazy(() => import('../users/pages/LivePage').then(m => ({ default: m.LivePage })));
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <div>Loading...</div>; // Or redirect to auth
  }

  const navigationItems = getNavigationItems(user.role);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black/90 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">Arena</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white/60">
                Welcome, {user.name} ({user.role})
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm text-[#ef4444] hover:text-[#dc2626] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-black/80 border-r border-white/10 min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className="w-full text-left px-4 py-2 text-sm text-white/70 hover:text-[#ef4444] hover:bg-[#ef4444]/10 rounded-md transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-black">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes (accessible by all authenticated users) */}
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/live" element={<LivePage />} />
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
        </main>
      </div>
    </div>
  );
};

function getNavigationItems(role: UserRole) {
  const baseItems = [
    { path: '/', label: 'Home' },
    { path: '/explore', label: 'Explore' },
    { path: '/live', label: 'Live' },
    { path: '/predictions', label: 'Predictions' },
    { path: '/communities', label: 'Communities' },
    { path: '/messages', label: 'Messages' },
    { path: '/notifications', label: 'Notifications' },
    { path: '/bookmarks', label: 'Bookmarks' },
    { path: '/wallet', label: 'Wallet' },
    { path: '/settings', label: 'Settings' },
    { path: '/profile', label: 'Profile' },
  ];

  const tipsterItems = [
    ...baseItems,
    { path: '/dashboard', label: 'Dashboard' },
  ];

  const adminItems = [
    ...tipsterItems,
    { path: '/admin', label: 'Admin Panel' },
  ];

  switch (role) {
    case 'user':
      return baseItems;
    case 'tipster':
      return tipsterItems;
    case 'admin':
      return adminItems;
    default:
      return baseItems;
  }
}

export default MainLayout;