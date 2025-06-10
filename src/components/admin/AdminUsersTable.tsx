import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from 'supabase/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface UserStats {
  user_id: string;
  email: string;
  created_at: string;
  email_verified: boolean;
  subscribed: boolean;
  faq_count: number;
  credits_used: number;
  last_login: string | null;
}

const AdminUsersTable = () => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_stats');
      
      if (error) {
        console.error('Error fetching user stats:', error);
        throw error;
      }
      
      return data as UserStats[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Chargement des données utilisateurs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-red-600">
          Erreur lors du chargement des données utilisateurs
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-gray-600">Aucun utilisateur trouvé</div>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: fr });
  };

  const getSubscriptionBadge = (subscribed: boolean) => {
    return subscribed ? (
      <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>
    ) : (
      <Badge variant="outline">Gratuit</Badge>
    );
  };

  const getVerificationBadge = (verified: boolean) => {
    return verified ? (
      <Badge className="bg-green-100 text-green-800">Vérifié</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Non vérifié</Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Total des utilisateurs: {users.length}
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Abonnement</TableHead>
              <TableHead>FAQs créées</TableHead>
              <TableHead>Crédits utilisés</TableHead>
              <TableHead>Inscription</TableHead>
              <TableHead>Dernière connexion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user:any) => (
              <TableRow key={user.user_id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>{getVerificationBadge(user.email_verified)}</TableCell>
                <TableCell>{getSubscriptionBadge(user.subscribed)}</TableCell>
                <TableCell>{user.faq_count}</TableCell>
                <TableCell>{user.credits_used}</TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>{formatDate(user.last_login)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsersTable;