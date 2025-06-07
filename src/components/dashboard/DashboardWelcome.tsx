
import React from 'react';

interface DashboardWelcomeProps {
  firstName: string | null;
  fullName: string;
  profilePicture: string;
}

const DashboardWelcome: React.FC<DashboardWelcomeProps> = ({ profilePicture, firstName, fullName }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex gap-4">
      <img src={profilePicture} className="h-20 w-20 rounded-full object-cover"/>
      
      <div>
      <h2 className="text-xl font-semibold mb-2">
        Bienvenue, {firstName || fullName}!
      </h2>
      <p className="text-gray-600">
        Gérez vos informations personnelles et de sécurité
      </p>
      </div>
    </div>
  );
};

export default DashboardWelcome;
