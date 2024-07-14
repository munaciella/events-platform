/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
//import { signInWithGoogle } from '../../supabaseClient';

// const LogIn = () => {
//   return (
//     <div className="flex flex-col items-center p-4">
//       <h1 className="text-3xl font-bold mb-6">Log In</h1>
//      <Button onClick={signInWithGoogle} className="px-4 py-2">
//      Log In
//      </Button>
//      </div>
//      );
//     }

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