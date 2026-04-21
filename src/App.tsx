import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { LivePage } from './pages/LivePage';
import { PredictionsPage } from './pages/PredictionsPage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { MessagesPage } from './pages/MessagesPage';
import { WalletPage } from './pages/WalletPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { DashboardPage } from './pages/DashboardPage';

function App() {
  const [authed, setAuthed] = useState(false);

  const handleLogout = () => {
    setAuthed(false);
  };

  if (!authed) {
    return <AuthPage onComplete={() => setAuthed(true)} />;
  }

  return (
    <MainLayout onLogout={handleLogout}>
      <Routes>
        <Route path="/"             element={<HomePage />} />
        <Route path="/explore"      element={<ExplorePage />} />
        <Route path="/live"         element={<LivePage />} />
        <Route path="/predictions"  element={<PredictionsPage />} />
        <Route path="/communities"  element={<CommunitiesPage />} />
        <Route path="/messages"     element={<MessagesPage />} />
        <Route path="/wallet"       element={<WalletPage />} />
        <Route path="/settings"     element={<SettingsPage />} />
        <Route path="/profile"      element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/dashboard"    element={<DashboardPage />} />
        <Route path="*"             element={<HomePage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;