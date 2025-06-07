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

function App() {

  return (
  <AuthProvider>
    <Toaster />
   <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/reset-password" element={<ResetPasswordPage/>} />
        <Route path="/faq/:id" element={<FaqShowcase />} />
      </Routes>
      </Layout>
    </Router>

    </AuthProvider>
  )
}

export default App
