/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ModeToggle } from './ModeToggle';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useSupabaseAuth } from './AuthContext';
import { supabase } from '../../supabaseClient';
import Modal from './ui/Modal';

const Navbar = () => {
  const { session, setSession } = useSupabaseAuth();
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setModalMessage('Successfully logged out');
    setIsModalOpen(true);
    navigate('/');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <nav className="w-screen bg-none shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="text-2xl font-bold">
        <Link to="/">
          <img src="/assets/Eventsphere_red_nobg.png" alt="EventSphere logo" className="h-16 w-auto ml-3" />
        </Link>
      </div>

      <div className="flex items-center space-x-1">
        <Input type="text" placeholder="Search events" className="px-4 py-2" />
        <Input type="text" placeholder="Current location" className="px-4 py-2" />
        <Button variant="solid" color="primary">
          Search
        </Button>
      </div>

      <div className="flex space-x-4 items-center mr-6">
        <Link to="/create-event" className="hover:text-primary">
          Create Event
        </Link>
        {!session ? (
          <>
            <Link to="/signup" className="hover:text-primary">
              Sign Up
            </Link>
            <Link to="/login" className="hover:text-primary">
              Log In
            </Link>
          </>
        ) : (
          <>
            <div className="mt-0">
              <Button onClick={handleLogout} className="px-2 dark:bg-primary">
                Log Out
              </Button>
            </div>
          </>
        )}
      </div>
      <div className="mr-8">
        <ModeToggle />
      </div>
      <Modal
        isOpen={isModalOpen}
        title="Authentication"
        message={modalMessage}
        onClose={handleCloseModal}
      />
    </nav>
  );
};

export default Navbar;
