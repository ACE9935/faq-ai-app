import { useQuery } from '@tanstack/react-query';
import { supabase } from 'supabase/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DailyAnalytics {
  date: string;
  faqs_generated: number;
  new_users: number;
  new_subscriptions: number;
  total_active_users: number;
}

const AdminAnalytics = () => {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_daily_analytics', { days_back: 30 });
      
      if (error) {
        console.error('Error fetching analytics:', error);
        throw error;
      }
      
      return data as DailyAnalytics[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Chargement des analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-red-600">
          Erreur lors du chargement des analytics
        </div>
      </div>
    );
  }

  if (!analytics || analytics.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-gray-600">Aucune donnée analytique disponible</div>
      </div>
    );
  }

  // Prepare data for charts (reverse to show chronological order)
  const chartData = analytics
    .slice()
    .reverse()
    .map(item => ({
      ...item,
      dateFormatted: format(new Date(item.date), 'dd/MM', { locale: fr })
    }));

  // Calculate totals
  const totalFaqs = analytics.reduce((sum, item) => sum + item.faqs_generated, 0);
  const totalNewUsers = analytics.reduce((sum, item) => sum + item.new_users, 0);
  const totalSubscriptions = analytics.reduce((sum, item) => sum + item.new_subscriptions, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className='shadow-none border-2 border-slate-300'>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              FAQs générées (30j)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalFaqs}</div>
          </CardContent>
        </Card>
        
        <Card className='shadow-none border-2 border-slate-300'>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Nouveaux utilisateurs (30j)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalNewUsers}</div>
          </CardContent>
        </Card>
        
        <Card className='shadow-none border-2 border-slate-300'>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Nouveaux abonnements (30j)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{totalSubscriptions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FAQs Generated Chart */}
        <Card className='shadow-none border-2 border-slate-300'>
          <CardHeader>
            <CardTitle>FAQs générées par jour</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateFormatted" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value, payload) => {
                    if (payload && payload[0]) {
                      const item = payload[0].payload;
                      return format(new Date(item.date), 'dd MMMM yyyy', { locale: fr });
                    }
                    return value;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="faqs_generated" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="FAQs générées"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Users & Subscriptions Chart */}
        <Card className='shadow-none border-2 border-slate-300'>
          <CardHeader>
            <CardTitle>Nouveaux utilisateurs et abonnements</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateFormatted" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value, payload) => {
                    if (payload && payload[0]) {
                      const item = payload[0].payload;
                      return format(new Date(item.date), 'dd MMMM yyyy', { locale: fr });
                    }
                    return value;
                  }}
                />
                <Bar dataKey="new_users" fill="#10B981" name="Nouveaux utilisateurs" />
                <Bar dataKey="new_subscriptions" fill="#F59E0B" name="Nouveaux abonnements" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;