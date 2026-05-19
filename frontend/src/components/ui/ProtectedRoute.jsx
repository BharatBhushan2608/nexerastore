import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user } = useSelector((store) => store.user);

    //  If user not logged in → redirect to login
    if (!user) {
        return <Navigate to="/login" />;
    }


    //  If admin route but user is not admin → redirect to home
    if (adminOnly && user.role !== "admin") {
        return <Navigate to="/" />;
    }

    // ✅ If everything is fine → render children
    return children;
}

export default ProtectedRoute