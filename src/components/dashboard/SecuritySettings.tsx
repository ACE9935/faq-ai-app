
import React from 'react';
import { Key, Trash2 } from 'lucide-react';
import Button from '@/tool-components/Button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SecuritySettingsProps {
  isResettingPassword: boolean;
  isDeletingAccount: boolean;
  onPasswordReset: () => void;
  onDeleteAccount: () => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  isResettingPassword,
  isDeletingAccount,
  onPasswordReset,
  onDeleteAccount
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Key className="h-6 w-6 text-faq-gradient" />
        <h3 className="text-lg font-semibold">Sécurité</h3>
      </div>

      <div className="space-y-4">
        {/* Password Reset */}
        <div className="flex flex-col md:flex-row gap-y-4 md:items-center md:justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium">Réinitialiser le mot de passe</h4>
            <p className="text-sm text-gray-600">Recevoir un email pour changer votre mot de passe</p>
          </div>
          <Button
            onClick={onPasswordReset}
            disabled={isResettingPassword}
            loading={isResettingPassword}
            variant='secondary'
            style={{width: 'fit-content'}}          >
            {isResettingPassword ? 'Envoi...' : 'Réinitialiser'}
          </Button>
        </div>

        {/* Account Deletion */}
        <div className="flex flex-col md:flex-row gap-y-4 md:items-center md:justify-between p-4 border border-red-200 rounded-lg bg-red-50">
          <div>
            <h4 className="font-medium text-red-800">Supprimer le compte</h4>
            <p className="text-sm text-red-600">Cette action est irréversible</p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                Icon={Trash2}
                loading={isDeletingAccount}
                disabled={isDeletingAccount}
                variant='error'
                style={{width: 'fit-content'}}
              >
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut pas être annulée. Cela supprimera définitivement votre compte
                  et toutes vos données associées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDeleteAccount}
                  disabled={isDeletingAccount}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  {isDeletingAccount ? 'Suppression...' : 'Supprimer définitivement'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;