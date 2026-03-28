import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedUserRoutes = () => {
  const isAuthenticated  = useSelector((state) => state.user.isAuthenticated);

  // If not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedUserRoutes;