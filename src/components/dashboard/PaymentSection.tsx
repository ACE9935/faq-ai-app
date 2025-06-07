import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, XCircle, Loader, Settings, Star, Plus, HistoryIcon } from 'lucide-react';
import Button from '@/tool-components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from 'supabase/supabase';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

const PaymentSection: React.FC = () => {
  const { user, session, setSubscribed } = useAuth();
  const { toast } = useToast();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({ subscribed: false });
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const checkSubscriptionStatus = async () => {
    if (!session?.access_token) return;
    
    setIsCheckingStatus(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      setSubscriptionData(data);
      setSubscribed(data?.subscribed || false);
      
      // If subscription status changed, show a toast
      if (isCheckingStatus && (data.subscribed !== subscriptionData.subscribed)) {
        toast({
          title: data.subscribed ? "Abonnement activé !" : "Abonnement annulé",
          description: data.subscribed 
            ? `Votre abonnement ${data.subscription_tier || 'Premium'} est maintenant actif.`
            : "Votre abonnement a été annulé.",
          variant: data.subscribed ? "default" : "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast({
        title: "Erreur",
        description: "Impossible de vérifier le statut de l'abonnement",
        variant: "destructive",
      });
    } finally {
      setIsCheckingStatus(false);
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkSubscriptionStatus();
      
      // Set up periodic checking every 30 seconds when component is mounted
      const interval = setInterval(checkSubscriptionStatus, 30000);
      
      return () => clearInterval(interval);
    } else {
      setIsInitialLoading(false);
    }
  }, [user]);

  // Also check when the window regains focus (user returns from Stripe checkout)
  useEffect(() => {
    const handleFocus = () => {
      if (user && session?.access_token) {
        setTimeout(checkSubscriptionStatus, 2000); // Wait 2 seconds then check
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, session]);

  const handleSubscribe = async () => {
    if (!session?.access_token) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la session de paiement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!session?.access_token) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le portail client",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Abonnement</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subscription status skeleton */}

        {/* Action section skeleton */}
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg">
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-3 w-full mb-3" />
            <div className="space-y-1 mb-4">
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-44" />
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-36" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Show loading skeleton while checking initial subscription status
  if (isInitialLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span className="text-lg font-semibold">Abonnement</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg border border-slate-300">
          <div className="flex items-center space-x-3">
            {subscriptionData.subscribed ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-gray-400" />
            )}
            <div>
              <p className="font-medium">
                {subscriptionData.subscribed ? 'Abonnement Actif' : 'Aucun Abonnement'}
              </p>
              {subscriptionData.subscribed && (
                <p className="text-sm text-gray-600">
                  Plan: {subscriptionData.subscription_tier || 'Premium'}
                  {subscriptionData.subscription_end && (
                    <span className="block">
                      Expire le: {new Date(subscriptionData.subscription_end).toLocaleDateString()}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
          
          <Button
            onClick={checkSubscriptionStatus}
            variant='secondary'
            disabled={isCheckingStatus}
          >
            {isCheckingStatus ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <><HistoryIcon className='h-5 w-5'/> Actualiser</>
            )}
          </Button>
        </div>

        <div className="space-y-3">
          {!subscriptionData.subscribed ? (
            <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
  <div className="text-center max-w-sm">
    {/* Icon with gradient background */}
    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
      <CreditCard className="h-8 w-8 text-white" />
    </div>

    {/* Main heading */}
    <h3 className="text-xl font-bold text-gray-900 mb-3">
      Abonnement Premium
    </h3>

    {/* Description */}
    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
      Accédez à toutes les fonctionnalités premium pour seulement 9,99€/mois
    </p>

    {/* Features list */}
    <div className="space-y-3 mb-6">
      <div className="flex items-center gap-3 text-sm text-gray-700">
        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Star className="h-3 w-3 text-green-600" />
        </div>
        <span>20 crédits par mois</span>
      </div>
      
      <div className="flex items-center gap-3 text-sm text-gray-700">
        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Plus className="h-3 w-3 text-blue-600" />
        </div>
        <span>Questions personnalisées dans les FAQs</span>
      </div>
    </div>

    {/* Subscribe button */}
    <Button
      onClick={handleSubscribe}
      disabled={isLoading}
      variant="primary-2"
      style={{width:"100%"}}
    >
      {isLoading ? (
        <Loader className="h-5 w-5 animate-spin mr-2" />
      ) : (
        <CreditCard className="h-4 w-4 mr-2" />
      )}
      S'abonner maintenant
    </Button>
  </div>
</div>
          ) : (
            <Button
              onClick={handleManageSubscription}
              disabled={isLoading}
              variant="secondary"
            >
              {isLoading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <Settings className="h-5 w-5" />
              )}
              Gérer l'abonnement
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSection;