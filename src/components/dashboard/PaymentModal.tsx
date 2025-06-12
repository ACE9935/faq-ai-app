import { CreditCard, Star, Plus, Loader } from "lucide-react";
import { supabase } from "supabase/supabase";
import { useState } from "react";
import Button from "@/tool-components/Button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

function PaymentModal() {

    const { toast } = useToast();
    const { user, session, setSubscribed } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

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
    
    return ( 
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
     );
}

export default PaymentModal;