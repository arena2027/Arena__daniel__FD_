import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/hooks/AuthContext';
import { RouteGuard, AuthGuard } from './middleware/guards/RouteGuards';
import MainLayout from './layouts/MainLayout';

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

// Lazy load page components
const AuthPage = lazy(() => import('./auth/pages/AuthPage').then(m => ({ default: m.AuthPage })));

// ── App Content Component ─────────────────────────────────────────────────────
function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        path="/auth"
        element={
          <AuthGuard user={user}>
            <Suspense fallback={<LoadingFallback />}>
              <AuthPage />
            </Suspense>
          </AuthGuard>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <RouteGuard user={user}>
            <MainLayout />
          </RouteGuard>
        }
      />
    </Routes>
  );
}

// ── Main App Component ───────────────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;