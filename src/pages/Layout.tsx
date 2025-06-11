
import React, { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../tool-components/Button';
import { Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Dashboard } from '@mui/icons-material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminAccess();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
          setProfilePicture(user?.user_metadata?.avatar_url)
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-white to-gray-100 flex flex-col">
      <header className="w-full py-2 px-6 flex justify-between items-center border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-faq-gradient p-2 rounded-lg">
          </div>
          <img src='/logo_ema.png' width={60}/>
        </Link>
        
        <div className="flex items-center space-x-2">
          {user ? (
            <> 
            {isAdmin && (
                <Link to="/admin">
                  <Button Icon={Shield} variant='primary-3'>
                    Admin
                  </Button>
                </Link>
              )}
              
              <Link to="/dashboard">
                <Button Icon={Dashboard} variant="primary">
                  Tableau de bord
                </Button>
              </Link>
              <Button 
                onClick={handleSignOut}
                variant="secondary"
              >
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant='primary'>
                Connexion
              </Button>
            </Link>
          )}
        </div>
      </header>
      
      <div className="flex-grow">
        {children}
      </div>
      
      <footer className="text-center py-4 border-t border-gray-200 text-sm text-gray-500">
        © 2025 FAQ Wizard Forge. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
