import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthForm from './components/Auth/AuthForm';
import PageLayout from './components/Layout/PageLayout';
import Home from './pages/Home';
import WeekPage from './pages/WeekPage';
import ProjectsPage from './pages/ProjectsPage';
import DailyReviewPage from './pages/DailyReviewPage';
import IndustryInsightsPage from './pages/IndustryInsightsPage';
import PracticePage from './pages/PracticePage';
import QuizPage from './pages/QuizPage';
import ReviewsPage from './pages/ReviewsPage';
import NotesPage from './pages/NotesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LoadingSpinner from './components/common/LoadingSpinner';

function ProtectedRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
        <Route path="/" element={<Home />} />
        <Route path="/week/:weekId" element={<WeekPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/daily-review" element={<DailyReviewPage />} />
        <Route path="/industry-insights" element={<IndustryInsightsPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </PageLayout>
  );
}

function LoginPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
