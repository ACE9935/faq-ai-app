
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfileAvatarProps {
  profilePicture?: string;
  userFullName: string;
  defaultProfilePicture: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  profilePicture,
  userFullName,
  defaultProfilePicture
}) => {

  return (
    <div className="relative">
      <Avatar className="w-30 h-30 border border-purple-main">
        <AvatarImage 
          src={profilePicture || defaultProfilePicture} 
          alt={userFullName}
          onError={(e:any) => {
            console.error('Avatar image failed to load:', profilePicture);
            // Fallback to default if image fails to load
            (e.target as HTMLImageElement).src = defaultProfilePicture;
          }}
        />
        <AvatarFallback className="text-lg">
          {userFullName ? userFullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default ProfileAvatar;