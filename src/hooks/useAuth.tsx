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
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const checkSubscription = async () => {
    if (!session?.access_token) {
      setSubscribed(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

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
      // Don't await this - run it in background to avoid blocking auth flow
      supabase.rpc('get_or_create_user_credits', {
        user_id_param: userId
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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        // If user just signed in and doesn't have avatar_url, set the default
        if (event === 'SIGNED_IN' && session?.user && !session.user.user_metadata?.avatar_url) {
          const defaultProfilePicture = 'https://uukudqrtanandyzcnsaz.supabase.co/storage/v1/object/sign/faq-app-storage/user-svgrepo-com.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2Q5YjFiMTg0LTM3MDQtNDc3YS05OTIyLTZkMjBmNzQwYzEzOCJ9.eyJ1cmwiOiJmYXEtYXBwLXN0b3JhZ2UvdXNlci1zdmdyZXBvLWNvbS5wbmciLCJpYXQiOjE3NDg0NjU1NjAsImV4cCI6MjA2MzgyNTU2MH0.TLGIxPtYiXhPVOc-D1zW90t1BrJpUhGlIbT3rKS5VJc';
          
          // Update user metadata with default avatar
          const { data: updatedUser } = await supabase.auth.updateUser({
            data: {
              ...session.user.user_metadata,
              avatar_url: defaultProfilePicture,
            }
          });
          
          if (updatedUser?.user) {
            setUser(updatedUser.user);
          } else {
            setUser(session?.user ?? null);
          }
        } else {
          setUser(session?.user ?? null);
        }

        // Initialize credits for new or existing users (non-blocking)
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          initializeCredits(session.user.id);
        }

        // Check subscription status when auth state changes
        if (session?.user) {
          // Set subscribed from user metadata if available
          setSubscribed(session.user.user_metadata?.subscribed || false);
          
          // Also check via edge function to ensure it's up to date
          checkSubscription();
        } else {
          setSubscribed(false);
        }

        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setSubscribed(session.user.user_metadata?.subscribed || false);
        // Initialize credits and check subscription status on initial load (non-blocking)
        initializeCredits(session.user.id);
        checkSubscription();
      } else {
        setSubscribed(false);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Update subscribed state when session changes
  useEffect(() => {
    if (session?.user?.user_metadata?.subscribed !== undefined) {
      setSubscribed(session.user.user_metadata.subscribed);
    }
  }, [session?.user?.user_metadata?.subscribed]);

  const signUp = async (email: string, password: string, userData: any) => {
    const defaultProfilePicture = 'https://uukudqrtanandyzcnsaz.supabase.co/storage/v1/object/sign/faq-app-storage/user-svgrepo-com.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2Q5YjFiMTg0LTM3MDQtNDc3YS05OTIyLTZkMjBmNzQwYzEzOCJ9.eyJ1cmwiOiJmYXEtYXBwLXN0b3JhZ2UvdXNlci1zdmdyZXBvLWNvbS5wbmciLCJpYXQiOjE3NDg0NjU1NjAsImV4cCI6MjA2MzgyNTU2MH0.TLGIxPtYiXhPVOc-D1zW90t1BrJpUhGlIbT3rKS5VJc';
    
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
        }
      }
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
      }
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
