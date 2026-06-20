import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import VideosPage from './pages/VideosPage';
import SpotifyPage from './pages/SpotifyPage';
import ArtistPage from './pages/ArtistPage';
import TestimonialsPage from './pages/TestimonialsPage';
import NewsPage from './pages/NewsPage';
import SettingsPage from './pages/SettingsPage';
import { Toaster } from 'react-hot-toast';

const AdminLayout = ({ children }) => (
  <div className="admin-layout">
    <Sidebar />
    <main className="admin-main">{children}</main>
  </div>
);

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />

      {/* All protected admin routes */}
      <Route path="/" element={<ProtectedRoute><AdminLayout><DashboardPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/videos" element={<ProtectedRoute><AdminLayout><VideosPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/spotify" element={<ProtectedRoute><AdminLayout><SpotifyPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/artist" element={<ProtectedRoute><AdminLayout><ArtistPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/testimonials" element={<ProtectedRoute><AdminLayout><TestimonialsPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/news" element={<ProtectedRoute><AdminLayout><NewsPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AdminLayout><SettingsPage /></AdminLayout></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a24',
              color: '#f1f1f5',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              borderRadius: '12px',
              fontFamily: "'Outfit', sans-serif",
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
