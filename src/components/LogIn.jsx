/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Input } from './ui/input';
import { useSupabaseAuth } from './AuthContext';
import Modal from './ui/Modal';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setSession } = useSupabaseAuth();
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          setSession(session);
          setModalMessage('Successfully logged in');
          setIsModalOpen(true);
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else if (event === 'SIGNED_OUT') {
          setModalMessage('Successfully logged out');
          setIsModalOpen(true);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setSession, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Error during sign in:', error.message);
      setModalMessage(`Error: ${error.message}`);
      setIsModalOpen(true);
    } else {
      setSession(data.session);
      setModalMessage('Successfully logged in');
      setIsModalOpen(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  const handleLoginGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      console.error('Error during sign in:', error.message);
      setModalMessage(`Error: ${error.message}`);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background dark:bg-background">
      <div className="bg-card dark:bg-card rounded-lg shadow-md p-8 w-full max-w-md border border-border dark:border-border">
        <h2 className="text-2xl font-bold mb-6 text-center text-card-foreground dark:text-card-foreground">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground dark:text-input"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground dark:text-input"
          />
          <Button
            type="submit"
            className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground"
          >
            Sign in with Email
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Button
            onClick={handleLoginGoogle}
            className="w-full py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 dark:bg-accent dark:text-accent-foreground"
          >
            Sign in with Google
          </Button>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        title="Authentication"
        message={modalMessage}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Login;
