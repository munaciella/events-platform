/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Input } from './ui/input';
import { useSupabaseAuth } from './AuthContext';
import Modal from './ui/Modal';
import { SkeletonCard } from './ui/SkeletonCard';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setSession, getStoredIntendedURL, clearStoredIntendedURL } =
    useSupabaseAuth();
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          setSession(session);
          setModalMessage('Successfully logged in');
          setIsModalOpen(true);
          setError(null);
          setTimeout(() => {
            const intendedURL = getStoredIntendedURL();
            if (intendedURL) {
              clearStoredIntendedURL();
              navigate(intendedURL);
            } else {
              navigate('/');
            }
          }, 2000);
        } else if (event === 'SIGNED_OUT') {
          setModalMessage('Successfully logged out');
          setIsModalOpen(true);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setSession, navigate, getStoredIntendedURL, clearStoredIntendedURL]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Error during sign in:', error.message);
      setModalMessage(`Error: ${error.message}`);
      setIsModalOpen(true);
      setLoading(false);
    } else {
      setSession(data.session);
      setModalMessage('Successfully logged in');
      setIsModalOpen(true);
      setTimeout(() => {
        const intendedURL = getStoredIntendedURL();
        if (intendedURL) {
          clearStoredIntendedURL();
          navigate(intendedURL);
        } else {
          navigate('/');
        }
        setLoading(false);
      }, 2000);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="flex flex-col items-center p-4 max-w-3xl mx-auto bg-background mt-20 dark:bg-background">
      <h1 className="text-3xl font-bold mb-6 mt-14 text-center">
        Login to EventSphere
      </h1>

      {loading && <SkeletonCard />}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
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
                Sign in with Email
              </Button>
            </form>
          </div>
          <Modal
            isOpen={isModalOpen}
            title="Authentication"
            message={modalMessage}
            onClose={handleCloseModal}
          />
        </>
      )}
    </section>
  );
};

export default Login;
