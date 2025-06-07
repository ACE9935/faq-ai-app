
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useDashboard } from '@/hooks/useDashboard';
import DashboardLoading from '@/components/dashboard/DashboardLoading';
import DashboardContent from '@/components/dashboard/DashboardContent';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const {
    formData,
    isEditing,
    isSaving,
    isResettingPassword,
    isDeletingAccount,
    handleInputChange,
    handleSave,
    handlePasswordReset,
    handleDeleteAccount,
    handleEditToggle,
    handleCancel,
  } = useDashboard();

  if (loading) {
    return <DashboardLoading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardContent
      user={user}
      formData={formData}
      isEditing={isEditing}
      isSaving={isSaving}
      isResettingPassword={isResettingPassword}
      isDeletingAccount={isDeletingAccount}
      onInputChange={handleInputChange}
      onEditToggle={handleEditToggle}
      onCancel={handleCancel}
      onSave={handleSave}
      onPasswordReset={handlePasswordReset}
      onDeleteAccount={handleDeleteAccount}
    />
  );
};

export default Dashboard;
