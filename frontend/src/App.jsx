import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import OTP from './pages/OTP';
import Dashboard from './pages/Dashboard';
import IssueSelection from './pages/IssueSelection';
import ActionPage from './pages/ActionPage';
import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';
import GeneratorForm from './pages/GeneratorForm';
import GeneratorOutput from './pages/GeneratorOutput';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import Blog from './pages/Blog';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
export default function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal/:section" element={<Legal />} />
          <Route path="/blog" element={<Blog />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/issues" 
            element={
              <ProtectedRoute>
                <IssueSelection />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/action" 
            element={
              <ProtectedRoute>
                <ActionPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/result" 
            element={
              <ProtectedRoute>
                <ResultPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/generate" 
            element={
              <ProtectedRoute>
                <GeneratorForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/generate/output" 
            element={
              <ProtectedRoute>
                <GeneratorOutput />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
