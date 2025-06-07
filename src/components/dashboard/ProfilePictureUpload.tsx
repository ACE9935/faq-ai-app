
import React from 'react';
import { Camera } from 'lucide-react';
import { useProfilePictureUpload } from '@/hooks/useProfilePictureUpload';
import ProfileAvatar from './ProfileAvatar';
import ProfilePictureControls from './ProfilePictureControls';

interface ProfilePictureUploadProps {
  profilePicture?: string;
  userFullName: string;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  profilePicture,
  userFullName
}) => {
  const {
    isUploading,
    isResetting,
    defaultProfilePicture,
    handleFileUpload,
    handleResetToDefault
  } = useProfilePictureUpload();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Camera className="h-6 w-6 text-faq-gradient" />
        <h3 className="text-lg font-semibold">Photo de Profil</h3>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <ProfileAvatar
          profilePicture={profilePicture}
          userFullName={userFullName}
          defaultProfilePicture={defaultProfilePicture}
        />

        <ProfilePictureControls
          isUploading={isUploading}
          isResetting={isResetting}
          profilePicture={profilePicture}
          defaultProfilePicture={defaultProfilePicture}
          onFileUpload={handleFileUpload}
          onResetToDefault={handleResetToDefault}
        />
      </div>
    </div>
  );
};

export default ProfilePictureUpload;