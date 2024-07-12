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
    <nav className="bg-none shadow-sm py-4 px-6 flex items-center justify-between md:hidden dark:bg-primary">
      <div className="text-2xl font-bold">
        <Link to="/">Event Platform</Link>
      </div>

      <Button onClick={toggleMenu} className="">
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </Button>

      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full shadow-sm py-4 px-6">
          <div className="flex flex-col space-y-4">
            <Link
              to="/create-event"
              className=""
              onClick={toggleMenu}
            >
              Create Event
            </Link>
            <Input
              type="text"
              placeholder="Search events"
              className="px-4 py-2"
            />
            <Button variant="solid" color="primary" onClick={toggleMenu}>
              Search
            </Button>
            {!isLoggedIn ? (
              <>
                <Link
                  to="/signup"
                  className=""
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className=""
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
                  className="w-full text-left px-4 py-2"
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
