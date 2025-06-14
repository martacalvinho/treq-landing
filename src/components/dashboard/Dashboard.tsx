
import { useAuth } from '@/hooks/useAuth';
import AdminDashboard from './AdminDashboard';
import StudioDashboard from './StudioDashboard';

const Dashboard = () => {
  const { isAdmin } = useAuth();

  return isAdmin ? <AdminDashboard /> : <StudioDashboard />;
};

export default Dashboard;
