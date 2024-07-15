/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Input } from './ui/input';
import { useSupabaseAuth } from './AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setSession } = useSupabaseAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Error during sign in:', error.message);
    } else {
      setSession(data.session);
      toast({
        title: 'Login successful',
        description: `Welcome back, ${data.user.email}`,
      });
      navigate('/');
    }
  };

  const handleLoginGoogle = async () => {
    const { user, session, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      console.error('Error during sign in:', error.message);
    } else {
      setSession(session);
      navigate('/');
    }
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
    </>
  );
};

export default Login;
