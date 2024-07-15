/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const AuthContext = createContext();

export function SupabaseAuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      updateSession(session);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      updateSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateSession = (session) => {
    setSession(session);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ session, setSession, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useSupabaseAuth = () => useContext(AuthContext);

// /* eslint-disable react-refresh/only-export-components */
// /* eslint-disable react/prop-types */
// import { createContext, useContext, useState, useEffect } from 'react';
// import { supabase } from '../../supabaseClient';

// const AuthContext = createContext();

// export function SupabaseAuthProvider({ children }) {
//   const [session, setSession] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkSession = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       setSession(session);
//       setLoading(false);
//     };

//     checkSession();

//     const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//       setLoading(false);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ session, setSession, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useSupabaseAuth = () => useContext(AuthContext);