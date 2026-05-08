import { useState, useCallback, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';

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

const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ExplorePage = lazy(() => import('./pages/ExplorePage').then(m => ({ default: m.ExplorePage })));
const LivePage = lazy(() => import('./pages/LivePage').then(m => ({ default: m.LivePage })));
const PredictionsPage = lazy(() => import('./pages/PredictionsPage').then(m => ({ default: m.PredictionsPage })));
const CommunitiesPage = lazy(() => import('./pages/CommunitiesPage').then(m => ({ default: m.CommunitiesPage })));
const MessagesPage = lazy(() => import('./pages/MessagesPage').then(m => ({ default: m.MessagesPage })));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const WalletPage = lazy(() => import('./pages/WalletPage').then(m => ({ default: m.WalletPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const BookmarksPage = lazy(() => import('./pages/BookmarksPage').then(m => ({ default: m.BookmarksPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const BecomeTipsterPage = lazy(() => import('./pages/BecomeTipsterPage').then(m => ({ default: m.BecomeTipsterPage })));

// ── Types ─────────────────────────────────────────────────────
export type UserRole = 'user' | 'tipster';

export interface AppUser {
  name: string;
  handle: string;
  email: string;
  role: UserRole;
}

// ── Helper Functions ──────────────────────────────────────────
const createDefaultUser = (): AppUser => ({
  name: '',
  handle: '',
  email: '',
  role: 'user',
});

const generateHandle = (name: string): string => {
  return `@${name.toLowerCase().replace(/\s+/g, '')}`;
};

// ── App ───────────────────────────────────────────────────────
function App() {
  const [authed, setAuthed] = useState(false);
  const [appUser, setAppUser] = useState<AppUser>(createDefaultUser());

  const handleAuthComplete = useCallback((
    role: UserRole,
    name?: string,
    email?: string
  ) => {
    const displayName = name ?? 'SportX Fan';
    setAppUser({
      name: displayName,
      handle: generateHandle(displayName),
      email: email ?? '',
      role,
    });
    setAuthed(true);
  }, []);

  const handleBecameTipster = useCallback(() => {
    setAppUser(prev => ({ ...prev, role: 'tipster' }));
  }, []);

  const handleLogout = useCallback(() => {
    setAuthed(false);
    setAppUser(createDefaultUser());
  }, []);

  if (!authed) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <AuthPage onComplete={handleAuthComplete} />
      </Suspense>
    );
  }

  return (
    <MainLayout
      onLogout={handleLogout}
      userRole={appUser.role}
      appUser={appUser}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
        {/* ── All Users ── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/live" element={<LivePage />} />
        <Route path="/predictions" element={<PredictionsPage />} />
        <Route path="/communities" element={<CommunitiesPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/wallet" element={<WalletPage userRole={appUser.role} />} />
        <Route path="/settings" element={<SettingsPage userRole={appUser.role} />} />
        <Route
          path="/profile"
          element={
            <ProfilePage
              appUser={appUser}
              onBecameTipster={handleBecameTipster}
            />
          }
        />

        {/* ── Regular User Only ── */}
        <Route
          path="/become-tipster"
          element={
            appUser.role === 'tipster' ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <BecomeTipsterPage onComplete={handleBecameTipster} />
            )
          }
        />

        {/* ── Tipster Only ── */}
        <Route
          path="/dashboard"
          element={
            appUser.role === 'tipster' ? (
              <DashboardPage appUser={appUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </MainLayout>
  );
}

export default App;