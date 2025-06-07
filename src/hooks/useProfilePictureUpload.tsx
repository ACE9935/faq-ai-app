
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '../../supabase/supabase';
import { useToast } from '@/hooks/use-toast';

export const useProfilePictureUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const defaultProfilePicture = 'https://uukudqrtanandyzcnsaz.supabase.co/storage/v1/object/public/faq-app-storage//user-svgrepo-com.png';

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image valide",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `profile-picture-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Uploading file to path:', filePath);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('faq-app-storage')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: "Erreur",
          description: "Impossible de télécharger l'image",
          variant: "destructive",
        });
        return;
      }

      console.log('File uploaded successfully:', uploadData);

      // Get public URL - don't use signed URL for public bucket
      const { data: { publicUrl } } = supabase.storage
        .from('faq-app-storage')
        .getPublicUrl(filePath);

      console.log('Generated public URL:', publicUrl);

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          avatar_url: publicUrl,
        }
      });

      if (updateError) {
        console.error('Update error:', updateError);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le profil",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Photo de profil mise à jour avec succès",
        variant: "success",
      });

    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Clear the input
      event.target.value = '';
    }
  };

  const handleResetToDefault = async () => {
    if (!user) return;

    setIsResetting(true);
    
    try {
      // Update user metadata with default avatar
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          avatar_url: defaultProfilePicture,
        }
      });

      if (error) {
        console.error('Reset error:', error);
        toast({
          title: "Erreur",
          description: "Impossible de réinitialiser la photo de profil",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Photo de profil réinitialisée par défaut",
        variant: "success",
      });

    } catch (error) {
      console.error('Error resetting profile picture:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réinitialisation",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return {
    isUploading,
    isResetting,
    defaultProfilePicture,
    handleFileUpload,
    handleResetToDefault
  };
};