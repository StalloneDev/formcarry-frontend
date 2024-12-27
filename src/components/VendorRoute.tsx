import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface VendorRouteProps {
    children: React.ReactNode;
}

export const VendorRoute = ({ children }: VendorRouteProps) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (user?.role !== 'VENDOR') {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};
