import { Star, History, Search } from "lucide-react";
import Button from "@/tool-components/Button";
import { useNavigate } from "react-router-dom";

function LoginModal({Icon, title}:{Icon: any,title:string}) {
    const navigate = useNavigate();
    return ( 
        <div className="flex-1 flex items-center justify-center p-6">
                  <div className="text-center max-w-sm">
                    {/* Icon with gradient background */}
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
        
                    {/* Main heading */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {title}
                    </h3>
        
                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                      Connectez-vous pour accéder à toutes vos FAQs sauvegardées et profiter de fonctionnalités exclusives
                    </p>
        
                    {/* Features list */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <History className="h-3 w-3 text-green-600" />
                        </div>
                        <span>Accédez à votre historique complet</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Star className="h-3 w-3 text-blue-600" />
                        </div>
                        <span>Sauvegardez vos FAQs favorites</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Search className="h-3 w-3 text-purple-600" />
                        </div>
                        <span>Recherchez dans vos créations</span>
                      </div>
                    </div>
        
                    {/* Login button */}
                    <Button 
                      onClick={() => navigate('/login')}
                      style={{width:"100%"}}
                      variant='primary-2'
                    >
                      Se connecter
                    </Button>
        
                    {/* Sign up link */}
                    <p className="mt-4 text-xs text-gray-500">
                      Pas encore de compte ?{' '}
                      <button 
                        onClick={() => navigate('/signup')}
                        className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer font-medium"
                      >
                        S'inscrire gratuitement
                      </button>
                    </p>
                  </div>
                </div>
     );
}

export default LoginModal;