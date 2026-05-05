import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { LivePage } from './pages/LivePage';
import { PredictionsPage } from './pages/PredictionsPage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { MessagesPage } from './pages/MessagesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { WalletPage } from './pages/WalletPage';
import { SettingsPage } from './pages/SettingsPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { DashboardPage } from './pages/DashboardPage';
import { BecomeTipsterPage } from './pages/BecomeTipsterPage';

// ── Types ─────────────────────────────────────────────────────
export type UserRole = 'user' | 'tipster';

export interface AppUser {
  name: string;
  handle: string;
  email: string;
  role: UserRole;
}

// ── App ───────────────────────────────────────────────────────
function App() {
  const [authed, setAuthed] = useState(false);
  const [appUser, setAppUser] = useState<AppUser>({
    name: '',
    handle: '',
    email: '',
    role: 'user',
  });

  const handleAuthComplete = (role: UserRole, name?: string, email?: string) => {
    setAppUser({
      name: name ?? 'SportX Fan',
      handle: `@${(name ?? 'sportxfan').toLowerCase().replace(/\s+/g, '')}`,
      email: email ?? '',
      role,
    });
    setAuthed(true);
  };

  const handleBecameTipster = () => {
    setAppUser(prev => ({ ...prev, role: 'tipster' }));
  };

  const handleLogout = () => {
    setAuthed(false);
    setAppUser({ name: '', handle: '', email: '', role: 'user' });
  };

  if (!authed) {
    return <AuthPage onComplete={handleAuthComplete} />;
  }

  return (
    <MainLayout
      onLogout={handleLogout}
      userRole={appUser.role}
      appUser={appUser}
    >
      <Routes>
        {/* ── All Users ── */}
        <Route path="/"              element={<HomePage />} />
        <Route path="/explore"       element={<ExplorePage />} />
        <Route path="/live"          element={<LivePage />} />
        <Route path="/predictions"   element={<PredictionsPage />} />
        <Route path="/communities"   element={<CommunitiesPage />} />
        <Route path="/messages"      element={<MessagesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/bookmarks"     element={<BookmarksPage />} />
        <Route path="/wallet"        element={<WalletPage userRole={appUser.role} />} />
        <Route path="/settings"      element={<SettingsPage userRole={appUser.role} />} />
        <Route path="/profile"       element={<ProfilePage appUser={appUser} onBecameTipster={handleBecameTipster} />} />

        {/* ── Regular User Only ── */}
        <Route path="/become-tipster" element={
          appUser.role === 'tipster'
            ? <Navigate to="/dashboard" replace />
            : <BecomeTipsterPage onComplete={handleBecameTipster} />
        } />

        {/* ── Tipster Only ── */}
        <Route path="/dashboard" element={
          appUser.role === 'tipster'
            ? <DashboardPage appUser={appUser} />
            : <Navigate to="/" replace />
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;