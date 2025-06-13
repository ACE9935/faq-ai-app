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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Drawer } from '@mui/material';
import FaqSidebar from './components/FaqSideBar';
import { useState } from 'react';

const queryClient = new QueryClient();

function App() {

  const [open, setOpen] = useState(false);
  
  const toggleDrawer = (newOpen: boolean) => {
   setOpen(newOpen);
  };


  return (
  <QueryClientProvider client={queryClient}>
  <AuthProvider>
    <Toaster />
   <Router>
    <Layout toggleDrawer={()=>toggleDrawer(true)}>
      <Drawer open={open} onClose={()=>toggleDrawer(false)}>
        <FaqSidebar className="border-0" toggle={()=>toggleDrawer(false)}/>
      </Drawer>
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
    </QueryClientProvider>
  )
}

export default App