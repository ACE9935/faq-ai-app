import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/useAuth";
import Register from './pages/Register';
import Layout from './pages/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ResetPasswordPage from './pages/ResetPassword';
import FaqShowcase from './pages/FaqShowcase';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {

  return (
  <QueryClientProvider client={queryClient}>
  <AuthProvider>
    <Toaster />
   <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/admin" element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/reset-password" element={<ResetPasswordPage/>} />
        <Route path="/faq/:id" element={<FaqShowcase />} />
      </Routes>
      </Layout>
    </Router>

    </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
