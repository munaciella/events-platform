/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import Modal from '@/components/ui/Modal';
import { useSupabaseAuth } from '@/components/AuthContext';
import { supabase } from '../../../../supabaseClient.js';
import { Button } from '@/components/ui/button';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessCode, setBusinessCode] = useState('');
  const { setSession, getStoredIntendedURL, clearStoredIntendedURL } = useSupabaseAuth();
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBusinessUser, setIsBusinessUser] = useState(false);
  const [requiresBusinessCode, setRequiresBusinessCode] = useState(false);

  const handleSuccessfulLogin = useCallback(() => {
    setLoading(false);
    const intendedUrl = getStoredIntendedURL();
    clearStoredIntendedURL();
    navigate(intendedUrl || '/');
  }, [clearStoredIntendedURL, getStoredIntendedURL, navigate]);

  const checkIfBusinessUser = useCallback(async (session) => {
    try {
      if (session && session.user) {
        const { data: userDetails, error } = await supabase
          .from('users')
          .select('role, business_code')
          .eq('user_uuid', session.user.id)
          .single();

        if (error) {
          console.error("Error fetching user details:", error);
          setModalMessage(`Error: ${error.message}`);
          setIsModalOpen(true);
          setLoading(false);
          return;
        }

        const userRole = userDetails.role;
        const userBusinessCode = userDetails.business_code;

        if (userRole === 'business') {
          setIsBusinessUser(true);
          if (!userBusinessCode) {
            setRequiresBusinessCode(true);
            setModalMessage('Please enter your business code to continue.');
            setIsModalOpen(true);
          } else {
            handleSuccessfulLogin();
          }
        } else {
          handleSuccessfulLogin();
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setModalMessage(`Error: ${err.message}`);
      setIsModalOpen(true);
      setLoading(false);
    }
  }, [handleSuccessfulLogin]);

  useEffect(() => {
    setLoading(true);
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setSession(session);
        checkIfBusinessUser(session);
      } else if (event === 'SIGNED_OUT') {
        setModalMessage('Successfully logged out');
        setIsModalOpen(true);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setSession, checkIfBusinessUser]);

  const handleBusinessCodeSubmit = async () => {
    if (businessCode.trim() === '') {
      setModalMessage('Business code cannot be empty.');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
    
      if (!user) {
        throw new Error('User not found');
      }

      const { error } = await supabase
        .from('users')
        .update({ business_code: businessCode })
        .eq('user_uuid', user.id);

      if (error) {
        throw error;
      }

      setModalMessage('Business code accepted. Redirecting...');
      setTimeout(() => {
        handleSuccessfulLogin();
      }, 2000);
    } catch (error) {
      console.error("Error updating business code:", error);
      setModalMessage(`Error: ${error.message}`);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setModalMessage(`Error: ${error.message}`);
      setIsModalOpen(true);
      setLoading(false);
    } else {
      const { session } = data;
      setSession(session);
      checkIfBusinessUser(session);
    }
  };

  return (
    <section className="flex flex-col items-center p-4 max-w-3xl mx-auto bg-background mt-20 dark:bg-background">
      <h1 className="text-3xl font-bold mb-6 mt-14 text-center">
        Login to EventSphere
      </h1>

      {loading && <SkeletonCard />}
      {!loading && (
        <>
          <div className="bg-card dark:bg-card rounded-lg shadow-md p-8 mt-8 w-full max-w-md border border-border dark:border-border">
            <h2 className="text-2xl font-bold mb-6 text-center text-card-foreground dark:text-card-foreground">
              Login
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
              />
              <Button
                type="submit"
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground"
              >
                Login
              </Button>
            </form>
          </div>

          {isBusinessUser && requiresBusinessCode && (
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-4 text-center">
                Business Code Required
              </h2>
              <form onSubmit={handleBusinessCodeSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Business Code"
                  value={businessCode}
                  onChange={(e) => setBusinessCode(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
                />
                <Button
                  type="submit"
                  className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground"
                >
                  Submit
                </Button>
              </form>
            </div>
          )}

          <Modal
            isOpen={isModalOpen}
            title="Authentication"
            message={modalMessage}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}
    </section>
  );
};

export default Login;