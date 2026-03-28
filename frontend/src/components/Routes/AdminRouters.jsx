import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoutes = () => {
  const isAuthenticated  = useSelector((state) => state.user?.isAuthenticated);
  const sessionid = useSelector((state) => state.user?.sessionid);
  const isAdmin = useSelector((state) => state.user?.isAdmin);
   const userData = useSelector((state) => state.user?.userData);

  // If not authenticated, redirect to the login page
  if (!isAuthenticated && !sessionid && !isAdmin || !userData) {
    return <Navigate to="/" replace />;
  }
  // If authenticated, render the child routes
  return <Outlet />;
};

export default AdminRoutes;