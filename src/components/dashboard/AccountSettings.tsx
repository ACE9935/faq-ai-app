import React from 'react';
import { Settings, Save } from 'lucide-react';
import BasicInput from '@/tool-components/BasicInput';
import Button from '@/tool-components/Button';
import AccountStatus from './AccountStatus';
import { Edit } from '@mui/icons-material';

interface FormData {
  first_name: string;
  last_name: string;
  company_name: string;
  phone_number: string;
}

interface AccountSettingsProps {
  userEmail: string;
  formData: FormData;
  isEditing: boolean;
  isSaving: boolean;
  verified: boolean | null;
  subscribed: boolean | null;
  onInputChange: (field: keyof FormData, value: string) => void;
  onEditToggle: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({
  userEmail,
  formData,
  isEditing,
  isSaving,
  verified,
  subscribed,
  onInputChange,
  onEditToggle,
  onCancel,
  onSave
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-faq-gradient" />
          <h3 className="text-lg font-semibold">Paramètres du Compte</h3>
        </div>
        {!isEditing ? (
          <Button 
            onClick={onEditToggle}
            variant='primary'
            Icon={Edit}
          >
            Modifier
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="secondary"
              onClick={onCancel}
            >
              Annuler
            </Button>
            <Button 
              onClick={onSave}
              disabled={isSaving}
              loading={isSaving}
              variant='primary'
              Icon={Save}
            >
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        )}
      </div>

      {/* KYC - Personal Information */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BasicInput
            label="Prénom"
            placeholder="Votre prénom"
            value={formData.first_name}
            onChange={(value: string) => onInputChange('first_name', value)}
            {...(!isEditing && { readOnly: true })}
          />
          <BasicInput
            label="Nom"
            placeholder="Votre nom"
            value={formData.last_name}
            onChange={(value: string) => onInputChange('last_name', value)}
            {...(!isEditing && { readOnly: true })}
          />
        </div>
        
        <div className="mt-4">
          <BasicInput
            type="email"
            label="Adresse e-mail"
            placeholder="Votre email"
            value={userEmail}
            disabled={true}
            readOnly={true}
          />
        </div>

        <div className="mt-4">
          <BasicInput
            label="Numéro de téléphone"
            placeholder="Votre numéro de téléphone"
            value={formData.phone_number}
            onChange={(value: string) => onInputChange('phone_number', value)}
            {...(!isEditing && { readOnly: true })}
          />
        </div>

        <div className="mt-4">
          <BasicInput
            label="Nom d'entreprise"
            placeholder="Nom de votre entreprise"
            value={formData.company_name}
            onChange={(value: string) => onInputChange('company_name', value)}
            {...(!isEditing && { readOnly: true })}
          />
        </div>
      </div>

      <AccountStatus verified={verified} subscribed={subscribed} />
    </div>
  );
};

export default AccountSettings;