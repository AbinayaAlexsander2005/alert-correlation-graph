import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import AlertCorrelationPage from './pages/AlertCorrelationPage';
import IncidentExplorerPage from './pages/IncidentExplorerPage';
import DependencyGraphPage from './pages/DependencyGraphPage';
import TimelinePage from './pages/TimelinePage';
import ProvenancePage from './pages/ProvenancePage';
import AuditTrailPage from './pages/AuditTrailPage';
import ChangeReviewPage from './pages/ChangeReviewPage';
import EvaluationPage from './pages/EvaluationPage';
import DatasetPage from './pages/DatasetPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useApp();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isLoggedIn } = useApp();
  return (
    <Routes>
      <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<OverviewPage />} />
        <Route path="alerts" element={<AlertCorrelationPage />} />
        <Route path="incidents" element={<IncidentExplorerPage />} />
        <Route path="graph" element={<DependencyGraphPage />} />
        <Route path="timeline" element={<TimelinePage />} />
        <Route path="provenance" element={<ProvenancePage />} />
        <Route path="audit" element={<AuditTrailPage />} />
        <Route path="changes" element={<ChangeReviewPage />} />
        <Route path="evaluation" element={<EvaluationPage />} />
        <Route path="dataset" element={<DatasetPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
