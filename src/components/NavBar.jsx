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
import { FiSearch } from 'react-icons/fi';

const Navbar = () => {
  const { session, setSession } = useSupabaseAuth();
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentLocation, setCurrentLocation] = useState('Manchester, UK');

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

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      console.log('Search Query:', searchQuery);
      console.log('Current Location:', currentLocation);

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .ilike('title', `%${searchQuery}%`)
        .ilike('city', `%${currentLocation}%`);

      if (error) {
        console.error('Error fetching search results:', error);
        setModalMessage(`Error: ${error.message}`);
        setIsModalOpen(true);
      } else {
        console.log('Search Results:', data);
        setSearchResults(data);
        
        if (data.length === 0) {
          setModalMessage('No events found in your location');
          setIsModalOpen(true);
        } else {
          setIsModalOpen(false);
          navigate('/search-results', {
            state: { searchResults: data },
          });
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setModalMessage(`Unexpected error: ${error.message}`);
      setIsModalOpen(true);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-transparent via-gray-100 to-gray-200 dark:from-transparent dark:via-gray-800 dark:to-gray-900 shadow-sm py-4 px-6 flex items-center justify-between flex-wrap">
      <div className="text-2xl font-bold flex-shrink-0">
        <Link to="/">
          <img
            src="/assets/Eventsphere_red_nobg.png"
            alt="EventSphere logo"
            className="h-16 w-auto ml-0"
          />
        </Link>
      </div>

      <div className="flex items-center space-x-0.5 flex-grow sm:flex-grow-0 sm:space-x-2 ml-4 sm:ml-0">
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="Search events"
            className="px-2 py-1 w-40 sm:w-24 flex-grow"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="solid"
            color="primary"
            className="h-full px-2 py-1 flex-shrink-0"
            onClick={handleSearch}
          >
            <FiSearch size={16} className="text-gray-500 dark:text-gray-300" />
          </Button>
        </div>
        <div className="relative">
          <Input
            type="text"
            placeholder="Current location"
            className="px-2 py-1 w-40 sm:w-24"
            value={currentLocation}
            onChange={(e) => setCurrentLocation(e.target.value)}
          />
        </div>
      </div>

      <div className="flex space-x-3 items-center sm:space-x-1 mr-10 sm:mr-4 flex-shrink-0">
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
          <Button onClick={handleLogout} className="px-2 dark:bg-primary">
            Log Out
          </Button>
        )}
      </div>
      <div className="mr-8 md:mr-0">
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
