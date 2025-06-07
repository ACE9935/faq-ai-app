import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../supabase/supabase';
import { useToast } from '@/hooks/use-toast';
import BasicInput from '@/tool-components/BasicInput';
import Button from '../tool-components/Button';
import { Key, Eye, EyeOff, FileText, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have valid reset session
    const checkResetSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          setIsValidSession(false);
        } else if (session) {
          setIsValidSession(true);
        } else {
          // Check if we have the necessary tokens in URL
          const accessToken = searchParams.get('access_token');
          const refreshToken = searchParams.get('refresh_token');
          
          if (accessToken && refreshToken) {
            // Set the session with the tokens from URL
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (!sessionError) {
              setIsValidSession(true);
            } else {
              console.error('Error setting session:', sessionError);
              setIsValidSession(false);
            }
          } else {
            setIsValidSession(false);
          }
        }
      } catch (error) {
        console.error('Error in checkResetSession:', error);
        setIsValidSession(false);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkResetSession();
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast({
          title: "Erreur",
          description: error.message || "Impossible de réinitialiser le mot de passe",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Mot de passe réinitialisé avec succès",
        variant: "success",
      });

      // Redirect to dashboard after successful reset
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réinitialisation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-radial from-white to-gray-100 flex items-center justify-center">
        <div className="text-lg">Vérification de la session...</div>
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-gradient-radial from-white to-gray-100 flex flex-col">
        
        <main className="flex-grow flex items-center justify-center py-12 px-4">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
            <Key className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Lien expiré</h2>
            <p className="text-gray-600 mb-6">
              Ce lien de réinitialisation de mot de passe a expiré ou n'est pas valide.
            </p>
            <div className="space-y-3 flex flex-col items-center">
              <Link to="/login">
                <Button variant='primary'>
                  Retour à la connexion
                </Button>
              </Link>
              <p className="text-sm text-gray-500">
                Vous pouvez demander un nouveau lien de réinitialisation depuis la page de connexion.
              </p>
            </div>
          </div>
        </main>

      </div>
    );
  }

  return (
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <Key className="h-12 w-12 text-faq-gradient mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Nouveau mot de passe
            </h2>
            <p className="text-gray-600">
              Choisissez un nouveau mot de passe sécurisé pour votre compte
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="relative">
              <BasicInput
                type={showPassword ? "text" : "password"}
                label="Nouveau mot de passe"
                placeholder="Entrez votre nouveau mot de passe"
                value={password}
                onChange={setPassword}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[46px] text-gray-400 cursor-pointer hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="relative">
              <BasicInput
                type={showConfirmPassword ? "text" : "password"}
                label="Confirmer le mot de passe"
                placeholder="Confirmez votre nouveau mot de passe"
                value={confirmPassword}
                onChange={setConfirmPassword}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[46px] cursor-pointer text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>Le mot de passe doit contenir :</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li className={password.length >= 6 ? "text-green-600" : "text-gray-400"}>
                  Au moins 6 caractères
                </li>
                <li className={password === confirmPassword && password.length > 0 ? "text-green-600" : "text-gray-400"}>
                  Les deux mots de passe doivent correspondre
                </li>
              </ul>
            </div>
            <div className='w-full flex justify-center'>
            <Button
              type="submit"
              disabled={isLoading || password !== confirmPassword || password.length < 6}
              Icon={Check}
              loading={isLoading}
            >
              {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-sm text-faq-gradient underline"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </main>
  );
};

export default ResetPasswordPage;
