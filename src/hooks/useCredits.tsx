import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from 'supabase/supabase';

interface CreditsData {
  id: string;
  user_id: string;
  credits_used: number;
  last_reset_date: string;
  credits_remaining: number;
  daily_limit: number;
}

export const useCredits = () => {
  const [creditsData, setCreditsData] = useState<CreditsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchCredits = async () => {
    if (!user) {
      setCreditsData(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.rpc('get_or_create_user_credits', {
        user_id_param: user.id
      });

      if (error) {
        console.error('Error fetching credits:', error);
        return;
      }

      if (data && data.length > 0) {
        setCreditsData(data[0]);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const useCredit = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('use_credit', {
        user_id_param: user.id
      });

      if (error) {
        console.error('Error using credit:', error);
        return false;
      }

      // Refresh credits data after using a credit
      await fetchCredits();
      
      return data;
    } catch (error) {
      console.error('Error using credit:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [user]);

  return {
    creditsData,
    isLoading,
    fetchCredits,
    useCredit,
    hasCredits: creditsData ? creditsData.credits_remaining > 0 : false
  };
};
