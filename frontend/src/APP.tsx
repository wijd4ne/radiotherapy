import { Navigate, Route, Routes } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nContext';
import { AuthProvider, useAuth } from './lib/auth';
import PatientLayout from './layouts/PatientLayout';
import DoctorLayout from './layouts/DoctorLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientHome from './pages/patient/PatientHome';
import Discovery from './pages/patient/Discovery';
import Questionnaire from './pages/patient/Questionnaire';
import Result from './pages/patient/Result';
import PatientDashboard from './pages/patient/PatientDashboard';
import Profile from './pages/patient/Profile';
import Help from './pages/patient/Help';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientDetail from './pages/doctor/PatientDetail';
import Cohort from './pages/doctor/Cohort';
import DoctorConfig from './pages/doctor/DoctorConfig';
import type { Role } from './mock/data';
import type { ReactNode } from 'react';

function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to={`/login?role=${role}`} replace />;
  if (user.role !== role && user.role !== 'admin') {
    return <Navigate to={user.role === 'doctor' ? '/medecin/dashboard' : '/patient'} replace />;
  }
  return <>{children}</>;
}

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/:role" element={<Register />} />

      <Route
        path="/patient"
        element={
          <RequireRole role="patient">
            <PatientLayout />
          </RequireRole>
        }
      >
        <Route index element={<PatientHome />} />
        <Route path="decouverte" element={<Discovery />} />
        <Route path="questionnaire" element={<Questionnaire />} />
        <Route path="resultat" element={<Result />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="profil" element={<Profile />} />
        <Route path="aide" element={<Help />} />
      </Route>

      <Route
        path="/medecin"
        element={
          <RequireRole role="doctor">
            <DoctorLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="/medecin/dashboard" replace />} />
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="patients" element={<Cohort />} />
        <Route path="patient/:id" element={<PatientDetail />} />
        <Route path="config" element={<DoctorConfig />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </I18nProvider>
  );
}
