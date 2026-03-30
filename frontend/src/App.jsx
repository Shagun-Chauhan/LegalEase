import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import OTP from './pages/OTP';
import Dashboard from './pages/Dashboard';
import IssueSelection from './pages/IssueSelection';
import ActionPage from './pages/ActionPage';
import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';
import GeneratorForm from './pages/GeneratorForm';
import GeneratorOutput from './pages/GeneratorOutput';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/issues" element={<IssueSelection />} />
        <Route path="/action" element={<ActionPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/generate" element={<GeneratorForm />} />
        <Route path="/generate/output" element={<GeneratorOutput />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
