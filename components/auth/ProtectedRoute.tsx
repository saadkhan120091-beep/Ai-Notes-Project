import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { RoutePath } from '../../types';
import { supabase } from '../../supabaseClient';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let active = true;
    const verifySession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (active) {
          setHasSession(!!session);
          setChecking(false);
        }
      } catch (err) {
        console.error('Error validating session in ProtectedRoute:', err);
        if (active) {
          setHasSession(false);
          setChecking(false);
        }
      }
    };

    verifySession();

    // Listen for auth state changes to seamlessly update hasSession if auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setHasSession(!!session);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F6F9]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!hasSession) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected.
    return <Navigate to={RoutePath.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};