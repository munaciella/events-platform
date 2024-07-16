/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useState } from 'react';
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

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Error during sign in:', error.message);
      setModalMessage(`Error: ${error.message}`);
    } else {
      setSession(data.session);
      setModalMessage('Successfully logged in');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
    setIsModalOpen(true);
  };

  const handleLoginGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      console.error('Error during sign in:', error.message);
      setModalMessage(`Error: ${error.message}`);
    } else {
      setSession(data.session);
      setModalMessage('Successfully logged in');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Sign in with Email</Button>
      </form>
      <Button onClick={handleLoginGoogle}>Sign in with Google</Button>
      <Modal
        isOpen={isModalOpen}
        title="Authentication"
        message={modalMessage}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default Login;
