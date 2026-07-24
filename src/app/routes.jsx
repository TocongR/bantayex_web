import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import AuthenticatedLayout from '../components/layout/AuthenticatedLayout';
import ProtectedRoute from '../routes/ProtectedRoute';
import PublicOnlyRoute from '../routes/PublicOnlyRoute';

import LandingPage from '../pages/LandingPage';
import AboutPage from '../pages/AboutPage';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ExamsListPage from '../features/exams/ExamsListPage';
import CreateExamPage from '../features/exams/CreateExamPage';
import EditExamPage from '../features/exams/EditExamPage';
// import ExamDetailPage from '../features/exams/ExamDetailPage';
// import ExamResultsPage from '../features/exams/ExamResultsPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/exams" element={<ExamsListPage />} />
          <Route path="/exams/create" element={<CreateExamPage />} />
          {/* <Route path="/exams/:id" element={<ExamDetailPage />} /> */}
          <Route path="/exams/:id/edit" element={<EditExamPage />} />
          {/* <Route path="/exams/:id/results" element={<ExamResultsPage />} /> */}
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;