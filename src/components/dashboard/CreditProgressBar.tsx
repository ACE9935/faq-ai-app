
import React from 'react';
import { useCredits } from '@/hooks/useCredits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Zap, Crown, Mail } from 'lucide-react';

const CreditProgressBar = () => {
  const { creditsData, isLoading } = useCredits();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>Crédits mensuels</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!creditsData) {
    return null;
  }

  const { credits_remaining, monthly_limit, credits_used } = creditsData;
  const usagePercentage = monthly_limit > 0 ? ((monthly_limit - credits_remaining) / monthly_limit) * 100 : 0;
  
  const getStatusColor = () => {
    if (credits_remaining === 0) return 'text-red-500';
    if (credits_remaining <= monthly_limit * 0.25) return 'text-orange-500';
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (monthly_limit === 20) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (monthly_limit === 5) return <Mail className="h-4 w-4 text-blue-500" />;
    return <Zap className="h-4 w-4 text-gray-500" />;
  };

  const getStatusText = () => {
    if (monthly_limit === 20) return 'Abonné Premium';
    if (monthly_limit === 5) return 'Email vérifié';
    return 'Non vérifié';
  };

  return (
    <Card className="w-full bg-gradient-to-br from-white to-gray-50 border-2 border-transparent bg-clip-border shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span className="text-lg font-semibold">Crédits mensuels</span>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            {getStatusIcon()}
            <span className="text-gray-600">{getStatusText()}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Credit Counter */}
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-800">
            <span className={getStatusColor()}>{credits_remaining}</span>
            <span className="text-gray-400 text-lg"> / {monthly_limit}</span>
          </span>
          <span className="text-sm text-gray-500">crédits restants</span>
        </div>

        {/* Gradient Progress Bar */}
        <div className="space-y-2">
          <div className="relative">
            <Progress 
              value={usagePercentage} 
              className="h-3 bg-gray-200"
            />
            <div 
              className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${usagePercentage}%` }}
            />
            {/* Glow effect */}
            <div 
              className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 opacity-50 blur-sm transition-all duration-500 ease-out"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
          
          {/* Usage Text */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>{credits_used} utilisés</span>
            <span>{Math.round(usagePercentage)}% consommés</span>
          </div>
        </div>

        {/* Status Message */}
        {credits_remaining === 0 ? (
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600 font-medium">Limite mensuelle atteinte</p>
            <p className="text-red-500 text-sm">Vos crédits se renouvellent le mois prochain ou souscrivez à un abonnement</p>
          </div>
        ) : credits_remaining <= monthly_limit * 0.25 ? (
          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-orange-600 font-medium">Attention: Peu de crédits restants</p>
            <p className="text-orange-500 text-sm">Pensez à souscrire pour plus de crédits</p>
          </div>
        ) : (
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-600 font-medium">Vous avez encore {credits_remaining} crédits ce mois</p>
            <p className="text-green-500 text-sm">Profitez-en pour générer vos FAQs!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreditProgressBar;