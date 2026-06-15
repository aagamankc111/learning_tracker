import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import AuthForm from './components/Auth/AuthForm';
import PageLayout from './components/Layout/PageLayout';
import Dashboard from './pages/Dashboard';
import PhasePage from './pages/WeekPage';
import TopicDetailPage from './pages/TopicDetailPage';
import DailyReviewPage from './pages/DailyReviewPage';
import QuizEngine from './pages/QuizEngine';
import JourneyHub from './pages/JourneyHub';
import SettingsPage from './pages/SettingsPage';
import ResourcesPage from './pages/ResourcesPage';
import CheatsheetPage from './pages/CheatsheetPage';
import LoadingSpinner from './components/common/LoadingSpinner';

function ProtectedRoutes() {
  const { user, loading } = useAuth();
  const { notify } = useNotifications();

  useEffect(() => {
    const handler = (e) => {
      for (const ach of e.detail) {
        notify('achievement', ach);
      }
    };
    window.addEventListener('achievement-earned', handler);
    return () => window.removeEventListener('achievement-earned', handler);
  }, [notify]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <LoadingSpinner message="Checking session..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/phase/:phaseId" element={<PhasePage />} />
        <Route path="/phase/:phaseId/day/:dayNumber/topic/:topicName" element={<TopicDetailPage />} />
        <Route path="/daily-review" element={<DailyReviewPage />} />
        <Route path="/quiz" element={<QuizEngine />} />
        <Route path="/journey" element={<JourneyHub />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/cheatsheet" element={<CheatsheetPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </PageLayout>
  );
}

function LoginPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <LoadingSpinner message="Checking session..." />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <AuthForm />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
