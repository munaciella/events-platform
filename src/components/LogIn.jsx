/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const LogIn = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // TODO Simulate a login process
    setIsLoggedIn(true);
    navigate('/');
  };

  return (
    <div>
      <h2>Log In</h2>
      <Button onClick={handleLogin} className="px-4 py-2">
        Log In
      </Button>
    </div>
  );
};

export default LogIn;