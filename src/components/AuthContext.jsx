/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const AuthContext = createContext();

export function SupabaseAuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({
    user_id: null,
    user_uuid: null,
    name: null,
    email: null,
    role: null,
    created_at: null,
    business_code: null
  });

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      updateSession(session);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      updateSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateSession = async (session) => {
    setSession(session);
    if (session) {
      const user = session.user;
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('user_uuid', user.id)
          .single();

        if (error) {
          console.error('Error fetching user details:', error);
        } else {
          setUserDetails(data);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    }
    setLoading(false);
  };

  const storeIntendedURL = (url) => {
    localStorage.setItem('intendedURL', url);
  };

  const getStoredIntendedURL = () => {
    return localStorage.getItem('intendedURL');
  };

  const clearStoredIntendedURL = () => {
    localStorage.removeItem('intendedURL');
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        setSession,
        loading,
        userDetails,
        setUserDetails,
        storeIntendedURL,
        getStoredIntendedURL,
        clearStoredIntendedURL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useSupabaseAuth = () => useContext(AuthContext);
