/* eslint-disable react/prop-types */
'use client';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { ModeToggle } from './ModeToggle';
import { Button } from './ui/button';
import { Input } from './ui/input';

const MobileNavbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-none shadow-sm py-4 px-6 flex items-center justify-between md:hidden">
      <div className="text-2xl font-bold">
        <Link to="/"><img src="assets/Eventsphere_red_nobg.png" alt="EventSphere logo" className="h-16 w-auto" /></Link>
      </div>

      <Button onClick={toggleMenu} className="">
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </Button>

      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full shadow-sm py-4 px-6">
          <div className="flex flex-col space-y-4">
            <Input
              type="text"
              placeholder="Search events"
              className="px-4 py-2 mt-6"
            />
            <Button variant="solid" color="primary" onClick={toggleMenu}>
              Search
            </Button>
            <Link
              to="/create-event"
              className="hover:text-primary"
              onClick={toggleMenu}
            >
              Create Event
            </Link>
            {!isLoggedIn ? (
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
              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setIsLoggedIn(false);
                    toggleMenu();
                  }}
                  className="px-4 py-2"
                >
                  Log Out
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      <ModeToggle />
    </nav>
  );
};

export default MobileNavbar;
