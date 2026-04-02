import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import OTP from './pages/OTP';
import Dashboard from './pages/Dashboard';
import IssueSelection from './pages/IssueSelection';
import ActionPage from './pages/ActionPage';
import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';
import GeneratorForm from './pages/GeneratorForm';
import GeneratorOutput from './pages/GeneratorOutput';
import Profile from './pages/Profile';

export default function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/issues" element={<IssueSelection />} />
          <Route path="/action" element={<ActionPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/generate" element={<GeneratorForm />} />
          <Route path="/generate/output" element={<GeneratorOutput />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
