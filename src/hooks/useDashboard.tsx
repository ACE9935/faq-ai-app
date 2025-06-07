
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '../../supabase/supabase';
import { useToast } from '@/hooks/use-toast';

export const useDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.user_metadata?.first_name || '',
    last_name: user?.user_metadata?.last_name || '',
    company_name: user?.user_metadata?.company_name || '',
    phone_number: user?.user_metadata?.phone_number || '',
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          company_name: formData.company_name,
          phone_number: formData.phone_number,
        }
      });

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder les modifications",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
        variant: "success",
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    
    setIsResettingPassword(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer l'email de réinitialisation",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Email envoyé",
        description: "Un email de réinitialisation a été envoyé à votre adresse",
        variant: "success",
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email",
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast({
          title: "Erreur",
          description: "Session expirée, veuillez vous reconnecter",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.functions.invoke('delete-user', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error calling delete-user function:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression du compte",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès",
        variant: "success",
      });

    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du compte",
        variant: "destructive",
      });
    } finally {
      signOut();
      setIsDeletingAccount(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      first_name: user?.user_metadata?.first_name || '',
      last_name: user?.user_metadata?.last_name || '',
      company_name: user?.user_metadata?.company_name || '',
      phone_number: user?.user_metadata?.phone_number || '',
    });
  };

  return {
    user,
    formData,
    isEditing,
    isSaving,
    isResettingPassword,
    isDeletingAccount,
    handleInputChange,
    handleSave,
    handlePasswordReset,
    handleDeleteAccount,
    handleEditToggle,
    handleCancel,
  };
};
