import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import Layout from '@/pages/Layout';
import AdminUsersTable from '@/components/admin/AdminUsersTable';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, BarChart } from 'lucide-react';

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminAccess();

  if (authLoading || adminLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Chargement...</div>
        </div>
    );
  }

  if (!user) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-red-600">Accès refusé. Veuillez vous connecter.</div>
        </div>
    );
  }

  if (!isAdmin) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-red-600">Accès refusé</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                Vous n'avez pas les permissions administrateur nécessaires pour accéder à cette page.
              </p>
            </CardContent>
          </Card>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-radial from-white to-gray-100">
        <main className="py-8 px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tableau de bord administrateur
              </h1>
              <p className="text-gray-600">
                Gestion des utilisateurs et analytics de la plateforme
              </p>
            </div>

            {/* Analytics Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart className="h-5 w-5" />
                  <span>Analytics quotidiennes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdminAnalytics />
              </CardContent>
            </Card>

            {/* Users Table Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Gestion des utilisateurs</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdminUsersTable />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
  );
};

export default AdminDashboard;