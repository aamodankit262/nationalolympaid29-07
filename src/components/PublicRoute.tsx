import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth/authStore";

interface PublicRouteProps {
  children: React.ReactNode;
  restricted?: boolean; // If true, authenticated users will be redirected
}

const PublicRoute = ({ children, restricted = true }: PublicRouteProps) => {
  const { isLogin, userDetails, token } = useAuthStore();

  // If user is authenticated and trying to access restricted public route
  if (restricted && isLogin && token && userDetails) {
    // Redirect based on user type
    switch (userDetails?.type) {
      case 'student':
        // Check if student needs to pay
        if (userDetails?.isPayment !== 1) {
          return <Navigate to="/plans" replace />;
        }
        return <Navigate to="/dashboard" replace />;
      case 'institute':
        return <Navigate to="/school-dashboard" replace />;
      case 'resource':
        return <Navigate to="/resource-person-dashboard" replace />;
      default:
        return <Navigate to="/home" replace />;
    }
  }

  return <>{children}</>;
};

export default PublicRoute;
