
import React from 'react';

interface AccountStatusProps {
  verified: boolean | null;
  subscribed: boolean | null;
}

const AccountStatus: React.FC<AccountStatusProps> = ({ verified, subscribed }) => {
  return (
    <div className="border-t border-slate-300 pt-6">
      <h4 className="text-md font-semibold mb-4">Statut du Compte</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <span className="text-sm font-medium">Compte vérifié</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            verified 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {verified ? 'Vérifié' : 'En attente'}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <span className="text-sm font-medium">Abonnement</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            subscribed 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {subscribed ? 'Actif' : 'Inactif'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountStatus;