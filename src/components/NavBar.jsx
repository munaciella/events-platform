/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { Link } from 'react-router-dom';
import { ModeToggle } from './ModeToggle';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <nav className="w-screen bg-none shadow-sm py-4 px-6 flex items-center justify-between dark:bg-primary">
      <div className="text-2xl font-bold">
        <Link to="/">Home Page</Link>
      </div>

      <div className="flex items-center space-x-1">
        <Input type="text" placeholder="Search events" className="px-4 py-2" />
        <Input
          type="text"
          placeholder="Current location"
          className="px-4 py-2"
        />
        <Button variant="solid" color="primary">
          Search
        </Button>
      </div>

      <div className="flex space-x-4 items-center">
        <Link to="/create-event" className=" hover:text-gray-900">
          Create Event
        </Link>
        {!isLoggedIn ? (
          <>
            <Link to="/signup" className=" hover:text-gray-900">
              Sign Up
            </Link>
            <Link to="/login" className=" hover:text-gray-900">
              Log In
            </Link>
          </>
        ) : (
            <>
          <div className="mt-0">
            <Button
              onClick={() => setIsLoggedIn(false)}
              className="px-2 dark:bg-secondary"
            >
              Log Out
            </Button>
          </div>
          </>
        )}
      </div>
      <ModeToggle />
    </nav>
  );
};

export default Navbar;
