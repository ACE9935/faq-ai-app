
import React from 'react';
import { User } from '@supabase/supabase-js';
import DashboardWelcome from './DashboardWelcome';
import ProfilePictureUpload from './ProfilePictureUpload';
import AccountSettings from './AccountSettings';
import SecuritySettings from './SecuritySettings';
import PaymentSection from './PaymentSection';
import { useAuth } from '@/hooks/useAuth';
import CreditProgressBar from './CreditProgressBar';

interface FormData {
  first_name: string;
  last_name: string;
  company_name: string;
  phone_number: string;
}

interface DashboardContentProps {
  user: User;
  formData: FormData;
  isEditing: boolean;
  isSaving: boolean;
  isResettingPassword: boolean;
  isDeletingAccount: boolean;
  onInputChange: (field: keyof FormData, value: string) => void;
  onEditToggle: () => void;
  onCancel: () => void;
  onSave: () => void;
  onPasswordReset: () => void;
  onDeleteAccount: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  user,
  formData,
  isEditing,
  isSaving,
  isResettingPassword,
  isDeletingAccount,
  onInputChange,
  onEditToggle,
  onCancel,
  onSave,
  onPasswordReset,
  onDeleteAccount,
}) => {
  const userFullName = user?.user_metadata ? 
    `${user.user_metadata.first_name || ''} ${user.user_metadata.last_name || ''}`.trim() : 
    '';
    const {subscribed}=useAuth()

  return (
    <div className="min-h-screen bg-gradient-radial from-white to-gray-100">
      <main className="py-8 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <DashboardWelcome 
            profilePicture={user?.user_metadata?.avatar_url}
            firstName={user?.user_metadata?.first_name}
            fullName={user.user_metadata.full_name || ''}
          />
          
          <CreditProgressBar/>

          <ProfilePictureUpload
            profilePicture={user?.user_metadata?.avatar_url}
            userFullName={userFullName || user.email || ''}
          />
          <PaymentSection />

          <AccountSettings
            userEmail={user.email || ''}
            formData={formData}
            isEditing={isEditing}
            isSaving={isSaving}
            verified={user.user_metadata.email_verified}
            subscribed={subscribed}
            onInputChange={onInputChange}
            onEditToggle={onEditToggle}
            onCancel={onCancel}
            onSave={onSave}
          />

          <SecuritySettings
            isResettingPassword={isResettingPassword}
            isDeletingAccount={isDeletingAccount}
            onPasswordReset={onPasswordReset}
            onDeleteAccount={onDeleteAccount}
          />
        </div>
      </main>
    </div>
  );
};

export default DashboardContent;