// src/components/PublicRoute.tsx
import { useAuthStore } from "@/store/auth/authStore";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLogin } = useAuthStore();
  if (isLogin) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export default PublicRoute;