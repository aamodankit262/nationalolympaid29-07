import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth/authStore";
import { useEffect, useState } from "react";
import LoaderWithBackground from "./LoaderWithBackground";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requirePayment?: boolean;
}

const ProtectedRoute = ({
  children,
  requiredRoles = [],
  requirePayment = false
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isLogin, userDetails, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking authentication state
    const checkAuth = async () => {
      // Add a small delay to ensure auth state is properly loaded from storage
      await new Promise(resolve => setTimeout(resolve, 100));
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // Show loading while checking authentication
  if (isLoading) {
    return <LoaderWithBackground visible={true} />;
  }

  // If not logged in or no token, redirect to login
  if (!isLogin || !token || !userDetails) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user role is allowed (only if specific roles are required)
  if (requiredRoles.length > 0 && !requiredRoles.includes(userDetails?.type)) {
    // Redirect based on user type to their appropriate dashboard
    switch (userDetails?.type) {
      case 'student':
        // if (userDetails?.isPayment !== 1) {
        //   return <Navigate to="/plans" replace />;
        // }
        return <Navigate to="/dashboard" replace />;
      case 'institute':
        return <Navigate to="/school-dashboard" replace />;
      case 'resource':
        return <Navigate to="/resource-person-dashboard" replace />;
      default:
        return <Navigate to="/home" replace />;
    }
  }

  // Check if payment is required for students
  if (requirePayment && userDetails?.type === 'student' && userDetails?.isPayment !== 1) {
    return <Navigate to="/plans" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
// This component protects routes that require authentication and specific user roles.
// It checks if the user is logged in, has the correct role, and if payment is required, whether the user has paid.
// If any condition fails, it redirects the user to the appropriate page (login, dashboard, or plans).
// If all conditions are met, it renders the children components, allowing access to the protected route.