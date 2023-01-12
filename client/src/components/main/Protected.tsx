import React, { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../store/Auth/AuthContext';

export default function Protected({ children }: PropsWithChildren) {
    const {
        state: { isAuthenticated },
    } = useAuth();

    return !isAuthenticated ? <Navigate to="/login" /> : <>{children}</>;
}
