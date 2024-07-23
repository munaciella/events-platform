/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { ModeToggle } from './ModeToggle';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useSupabaseAuth } from './AuthContext';
import { supabase } from '../../supabaseClient';
import Modal from './ui/Modal';

const MobileNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentLocation, setCurrentLocation] = useState('Manchester, UK');
  const { session, setSession } = useSupabaseAuth();
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setModalMessage('Successfully logged out');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) return;

    try {

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
    } catch (err) {
      console.error('Unexpected error:', err);
      setModalMessage(`Unexpected error: ${err.message}`);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full shadow-sm py-4 px-6 flex items-center justify-between md:hidden z-50 bg-gradient-to-b from-transparent via-gray-100 to-gray-200 dark:from-transparent dark:via-gray-800 dark:to-gray-900">
        <div className="flex items-center justify-between w-full">
          <Button onClick={toggleMenu} className="mr-3">
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </Button>
          <Link to="/" className="mx-auto">
            <img
              src="/assets/Eventsphere_red_nobg.png"
              alt="EventSphere logo"
              className="h-16 w-auto"
            />
          </Link>
          <ModeToggle />
        </div>
      </nav>

      {isMenuOpen && (
        <div className="mt-16 sm:mt-28">
          <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-800 shadow-md py-4 px-6 z-40 mt-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700">
                <Input
                  type="text"
                  placeholder="Search events"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-transparent focus:outline-none"
                />
                <Button
                  variant="solid"
                  color="primary"
                  onClick={handleSearchSubmit}
                >
                  <FiSearch
                    size={20}
                    className="text-gray-500 dark:text-gray-300 ml-0"
                  />
                </Button>
              </div>
              <Link
                to="/create-event"
                className="hover:text-primary"
                onClick={toggleMenu}
              >
                Create Event
              </Link>
              {!session ? (
                <>
                  <Link
                    to="/signup"
                    className="hover:text-primary"
                    onClick={toggleMenu}
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="hover:text-primary"
                    onClick={toggleMenu}
                  >
                    Log In
                  </Link>
                </>
              ) : (
                <div className="flex flex-col items-start space-y-2 mt-4">
                  <Button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="px-4 py-2 max-w-xs w-auto"
                  >
                    Log Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        title="Authentication"
        message={modalMessage}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default MobileNavbar;
