import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../../supabase/supabase";
import BasicInput from "../tool-components/BasicInput";
import Heading1 from "../components/Heading1";
import GoogleButton from "../form-components/GoogleButton";
import Button from "../tool-components/Button";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState<null | string>(null);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowError(null);

    // Validation
    if (!user.email || !user.password) {
      toast({
        title: "Erreur de connexion",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Sign in with Supabase
    const { error } = await signIn(user.email, user.password);

    if (error) {
      setShowError("Veuillez vérifier votre adresse e-mail et votre mot de passe.");
    } else {
      toast({
        title: "Connexion réussie",
        description: "Bienvenue ! Vous êtes maintenant connecté.",
      });
      navigate('/');
    }

    setIsLoading(false);
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error with Google login:', error);
      toast({
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion avec Google",
        variant: "destructive",
      });
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetLoading(true);

    if (!resetEmail) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre adresse e-mail",
        variant: "destructive",
      });
      setIsResetLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Erreur",
          description: error.message || "Impossible d'envoyer l'e-mail de réinitialisation",
          variant: "destructive",
        });
      } else {
        toast({
          title: "E-mail envoyé",
          description: "Vérifiez votre boîte e-mail pour réinitialiser votre mot de passe",
        });
        setShowResetDialog(false);
        setResetEmail("");
      }
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'e-mail",
        variant: "destructive",
      });
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen justify-center py-6 px-6">
      <form onSubmit={handleSubmit} className="bg-white flex flex-col gap-4 p-12 rounded-md shadow-md w-full max-w-[35rem]">
        <div className="mb-6"><Heading1>Connectez-vous</Heading1></div>
        <GoogleButton type="button" onClick={(e:any)=>{e.preventDefault();handleGoogleSignUp()}}>Se connecter avec Google</GoogleButton>
        
        <BasicInput 
          type="email" 
          label="Email" 
          placeholder="Entrez votre email"
          value={user.email}
          onChange={(value: string) => handleInputChange('email', value)}
          required
        />
        
        <BasicInput 
          type="password" 
          label="Mot de passe" 
          placeholder="Entrez votre mot de passe"
          value={user.password}
          onChange={(value: string) => handleInputChange('password', value)}
          required
        />
        
        <Button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </Button>

        {showError && 
        <Alert severity="error">
            <AlertTitle>Erreur de connexion</AlertTitle>
            {showError}
        </Alert>}

        <div className="text-center">
          <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <DialogTrigger asChild>
              <ShadcnButton variant="link" className="text-sm text-faq-gradient hover:underline p-0 cursor-pointer">
                Mot de passe oublié ?
              </ShadcnButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
              </DialogHeader>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <BasicInput
                  type="email"
                  label=""
                  placeholder="Entrez votre adresse e-mail"
                  value={resetEmail}
                  onChange={(value: string) => setResetEmail(value)}
                  required
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowResetDialog(false);
                      setResetEmail("");
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isResetLoading}
                  >
                    {isResetLoading ? "Envoi..." : "Envoyer"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <p className="text-center text-sm text-gray-500">
          Vous n'avez pas de compte?{' '}
          <a href="/signup" className="text-faq-gradient underline">S'inscrire</a>
        </p>
      </form>
    </main>
  );
}

export default Login;