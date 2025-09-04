import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import ChatAILanding from './pages/home';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpiner';
import EmailPage from './pages/Email';
const AuthRedirect = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  console.log('AuthRedirect: Checking auth', { isAuthenticated, isLoading });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to dashboard if authenticated, otherwise show LandingPage
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <ChatAILanding />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthRedirect />} />
          
          {/* Layout routes - these will render inside the Layout component */}
          <Route element={<Layout />}>
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/email" 
              element={
                <ProtectedRoute>
                  <EmailPage />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Catch-all route for 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;