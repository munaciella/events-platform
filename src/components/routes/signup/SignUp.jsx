/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useSupabaseAuth } from '@/components/AuthContext';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { supabase } from '../../../../supabaseClient.js';
import { SkeletonCard } from '@/components/ui/SkeletonCard.jsx';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessCode, setBusinessCode] = useState(''); 
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setSession } = useSupabaseAuth();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(email);
  };

  const validateName = (name) => {
    const re = /^[a-zA-Z\s]+$/;
    return re.test(name);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{8,}$/;
    return re.test(password);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateEmail(email)) {
      setModalMessage('Please enter a valid email address.');
      setIsModalOpen(true);
      setLoading(false);
      return;
    }

    if (!validateName(name)) {
      setModalMessage('Name should only contain letters.');
      setIsModalOpen(true);
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setModalMessage('Password must be at least 8 characters long, include at least one uppercase letter, one number, one special character, and no spaces.');
      setIsModalOpen(true);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      const user = data.user;

      const role = businessCode === '2024' ? 'business' : 'user'; 

      const { error: insertError } = await supabase.from('users').insert([
        {
          user_uuid: user.id,
          email,
          name,
          role,
          business_code: businessCode ? parseInt(businessCode, 10) : null
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      setSession(data.session);

      setModalMessage('Successfully signed up and logged in');
      setIsModalOpen(true);

      setTimeout(() => {
        setIsModalOpen(false);
        navigate('/');
      }, 2500);
    } catch (error) {
      setModalMessage(`Error: ${error.message}`);
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="flex flex-col items-center p-4 max-w-3xl mx-auto bg-background mt-20 dark:bg-background">
      <h1 className="text-3xl font-bold mb-6 mt-14 text-center">
        Sign Up for EventSphere
      </h1>

      {loading && <SkeletonCard />}
      {!loading && (
        <>
          <div className="bg-card dark:bg-card rounded-lg shadow-md p-8 mt-8 w-full max-w-md border border-border dark:border-border">
            <h2 className="text-2xl font-bold mb-6 text-center text-card-foreground dark:text-card-foreground">
              Sign Up
            </h2>
            <form onSubmit={handleSignUp} className="space-y-4">
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => {
                  if (!validateName(name)) {
                    setModalMessage('Name should only contain letters.');
                    setIsModalOpen(true);
                  }
                }}
                className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => {
                  if (!validateEmail(email)) {
                    setModalMessage('Please enter a valid email address.');
                    setIsModalOpen(true);
                  }
                }}
                className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => {
                  if (!validatePassword(password)) {
                    setModalMessage('Password must be at least 8 characters long, include at least one uppercase letter, one number, one special character, and no spaces.');
                    setIsModalOpen(true);
                  }
                }}
                className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
              />
              <Input
                type="text"
                placeholder="Enter Business ID if Business User (optional)"
                value={businessCode}
                onChange={(e) => setBusinessCode(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
              />
              <Button
                type="submit"
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground"
              >
                Sign up
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

export default SignUp;