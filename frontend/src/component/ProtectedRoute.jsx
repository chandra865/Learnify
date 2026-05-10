import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "./Loading";

/**
 * ProtectedRoute component to handle authentication and role-based access.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authorized.
 * @param {boolean} [props.authentication=true] - If true, requires user to be logged in. 
 *                                               If false, requires user to be NOT logged in (guest-only).
 * @param {string[]} [props.allowedRoles] - Optional array of roles allowed to access the route.
 */
/* eslint-disable react/prop-types */
const ProtectedRoute = ({ children, authentication = true, allowedRoles }) => {
  const { status, loading = false, userData } = useSelector((state) => state.user);
  const location = useLocation();

  // console.log("ProtectedRoute State:", { status, loading, role: userData?.role, authentication, path: location.pathname });

  // Show loading spinner while fetching authentication status
  if (loading) {
    return <Loading />;
  }

  // Case 1: Route requires authentication
  if (authentication) {
    if (!status) {
      // console.log("Unauthorized: Redirecting to login");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role-based check if allowedRoles is provided
    if (allowedRoles && !allowedRoles.includes(userData?.role)) {
      // console.log("Forbidden: Insufficient permissions, redirecting to home");
      return <Navigate to="/" replace />;
    }
  } 
  // Case 2: Guest-only route (authentication = false)
  else {
    if (status) {
      // console.log("Already logged in: Redirecting guest away from page");
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
