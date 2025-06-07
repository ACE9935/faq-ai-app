
import React from 'react';
import { Upload, RotateCcw } from 'lucide-react';
import Button from '@/tool-components/Button';

interface ProfilePictureControlsProps {
  isUploading: boolean;
  isResetting: boolean;
  profilePicture?: string;
  defaultProfilePicture: string;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResetToDefault: () => void;
}

const ProfilePictureControls: React.FC<ProfilePictureControlsProps> = ({
  isUploading,
  isResetting,
  profilePicture,
  defaultProfilePicture,
  onFileUpload,
  onResetToDefault
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <input
            type="file"
            id="profile-picture-upload"
            accept="image/*"
            onChange={onFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <Button
            variant="primary"
            disabled={isUploading}
            loading={isUploading}
            Icon={Upload}
          >
            {isUploading ? 'Téléchargement...' : 'Télécharger'}
          </Button>
        </div>

        <Button
          variant="secondary"
          onClick={onResetToDefault}
          disabled={isResetting || profilePicture === defaultProfilePicture}
          Icon={RotateCcw}
        >
          {isResetting ? 'Réinitialisation...' : 'Par défaut'}
        </Button>
      </div>

      <p className="text-sm text-gray-500 text-center">
        Formats acceptés: JPG, PNG, GIF. Taille max: 5MB
      </p>
    </>
  );
};

export default ProfilePictureControls;