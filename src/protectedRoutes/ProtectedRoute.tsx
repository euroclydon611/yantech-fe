import { memo } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  hasAccess: boolean;
  children: React.ReactNode;
}

const ProtectedRoute = memo(({ hasAccess, children }: ProtectedRouteProps) => {
  return hasAccess ? <>{children}</> : <Navigate to="/" />;
});

ProtectedRoute.displayName = "ProtectedRoute";

export default ProtectedRoute;
