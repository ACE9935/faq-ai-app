import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { UserRaw } from "../types/UserRaw";
import BasicInput from "../tool-components/BasicInput";
import Heading1 from "../components/Heading1";
import GoogleButton from "../form-components/GoogleButton";
import Button from "../tool-components/Button";

function Register() {
  const [user, setUser] = useState<UserRaw>({
    firstName: "",
    lastName: "",
    companyName: "",
    phoneNumber: "",
    password: "",
    rePassword: "",
    email: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: keyof UserRaw, value: string) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: "Inscription réussie",
        description: "Bienvenue ! Vous êtes maintenant connecté avec Google.",
      });
    } catch (error) {
      console.error('Error with Google signup:', error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription avec Google",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!user.firstName || !user.lastName || !user.email || !user.password || !user.rePassword) {
      toast({
        title: "Erreur d'inscription",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (user.password !== user.rePassword) {
      toast({
        title: "Erreur d'inscription",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (user.password.length < 6) {
      toast({
        title: "Erreur d'inscription",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Sign up with Supabase
    const { error } = await signUp(user.email, user.password, {
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName,
      phoneNumber: user.phoneNumber,
    });

    if (error) {
      toast({
        title: "Erreur d'inscription",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Inscription réussie",
        description: `Bienvenue ${user.firstName}! Vérifiez votre email pour confirmer votre compte.`,
      });
      navigate('/');
    }

    setIsLoading(false);
  };

  return (
    <main className="flex flex-col items-center py-6">
      <form onSubmit={handleSubmit} className="bg-white flex flex-col gap-4 p-12 rounded-md shadow-md w-full max-w-[45rem]">
        <div className="mb-6"><Heading1>Inscrivez-vous</Heading1></div>
        <GoogleButton type="button" onClick={(e:any)=>{e.preventDefault();handleGoogleSignUp()}}>Inscrivez-vous avec Google</GoogleButton>
        <div className="flex gap-6">
          <BasicInput 
            type="text" 
            label="Prénom" 
            placeholder="Entrez votre prénom"
            value={user.firstName}
            onChange={(value: string) => handleInputChange('firstName', value)}
            required
          />
          <BasicInput 
            type="text" 
            label="Nom" 
            placeholder="Entrez votre nom"
            value={user.lastName}
            onChange={(value: string) => handleInputChange('lastName', value)}
            required
          />
        </div>
        <BasicInput 
          type="text" 
          label="Nom de la compagnie" 
          placeholder="Entrez le nom de votre compagnie"
          value={user.companyName}
          onChange={(value: string) => handleInputChange('companyName', value)}
        />
        <BasicInput 
          type="email" 
          label="Email" 
          placeholder="Entrez votre email"
          value={user.email}
          onChange={(value: string) => handleInputChange('email', value)}
          required
        />
        <BasicInput 
          label="Numéro de téléphone" 
          placeholder="Entrez votre numéro de téléphone"
          value={user.phoneNumber}
          onChange={(value: string) => handleInputChange('phoneNumber', value)}
        />
        <BasicInput 
          type="password" 
          label="Mot de passe" 
          placeholder="Entrez votre mot de passe"
          value={user.password}
          onChange={(value: string) => handleInputChange('password', value)}
          required
        />
        <BasicInput 
          type="password" 
          label="Confirmer le mot de passe" 
          placeholder="Confirmez votre mot de passe"
          value={user.rePassword}
          onChange={(value: string) => handleInputChange('rePassword', value)}
          required
        />
        
        <Button 
          type="submit" 
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? "Inscription en cours..." : "S'inscrire"}
        </Button>
        
        <p className="mt-4 text-center text-sm text-gray-500">
          Vous avez déjà un compte?{' '}
          <a href="/login" className="text-faq-gradient underline">Se connecter</a>
        </p>
      </form>
    </main>
  );
}

export default Register;