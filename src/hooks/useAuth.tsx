import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from 'supabase/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  subscribed: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  loading: boolean;
  setSubscribed: any;
  checkSubscription: (currentSession?: Session | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const checkSubscription = async (currentSession: Session | null = session) => {

    if (!currentSession?.access_token) {
      setSubscribed(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        setSubscribed(false);
        return;
      }

      setSubscribed(data?.subscribed || false);
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscribed(false);
    }
  };

  const initializeCredits = async (userId: string) => {
    try {
      supabase.rpc('get_or_create_user_credits', {
        user_id_param: userId,
      }).then(({ error }) => {
        if (error) {
          console.error('Error initializing credits:', error);
        } else {
          console.log('Credits initialized successfully');
        }
      });
    } catch (error) {
      console.error('Error initializing credits:', error);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);

        if (event === 'SIGNED_IN' && newSession?.user && !newSession.user.user_metadata?.avatar_url) {
          const defaultProfilePicture = 'https://uukudqrtanandyzcnsaz.supabase.co/storage/v1/object/sign/faq-app-storage/user-svgrepo-com.png?...';

          const { data: updatedUser } = await supabase.auth.updateUser({
            data: {
              ...newSession.user.user_metadata,
              avatar_url: defaultProfilePicture,
            },
          });

          setUser(updatedUser?.user ?? newSession?.user ?? null);
        } else {
          setUser(newSession?.user ?? null);
        }

        if (newSession?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          initializeCredits(newSession.user.id);
        }

        if (newSession?.user) {
          setSubscribed(newSession.user.user_metadata?.subscribed || false);
          checkSubscription(newSession); // ✅ Pass session explicitly
        } else {
          setSubscribed(false);
        }

        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);

      if (existingSession?.user) {
        setSubscribed(existingSession.user.user_metadata?.subscribed || false);
        initializeCredits(existingSession.user.id);
        checkSubscription(existingSession); // ✅ Pass session explicitly
      } else {
        setSubscribed(false);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user?.user_metadata?.subscribed !== undefined) {
      setSubscribed(session.user.user_metadata.subscribed);
    }
  }, [session?.user?.user_metadata?.subscribed]);

  const signUp = async (email: string, password: string, userData: any) => {
    const defaultProfilePicture = 'https://uukudqrtanandyzcnsaz.supabase.co/storage/v1/object/sign/faq-app-storage/user-svgrepo-com.png?...';

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          company_name: userData.companyName,
          phone_number: userData.phoneNumber,
          avatar_url: defaultProfilePicture,
        },
      },
    });

    return { error };
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: window.location.origin,
      },
    });
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    setSubscribed(false);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      subscribed,
      signUp,
      signIn,
      signOut,
      signInWithGoogle,
      loading,
      setSubscribed,
      checkSubscription
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
