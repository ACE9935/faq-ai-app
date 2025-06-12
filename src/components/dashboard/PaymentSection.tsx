import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, XCircle, Loader, Settings, Star, Plus, HistoryIcon } from 'lucide-react';
import Button from '@/tool-components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from 'supabase/supabase';
import { useToast } from '@/hooks/use-toast';
import PaymentModal from './PaymentModal';

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
            <PaymentModal/>
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