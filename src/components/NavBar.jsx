import React from 'react';
import { Link } from 'react-router-dom';
import { ModeToggle } from './ModeToggle';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <nav className="w-screen bg-none shadow-sm py-4 px-6 flex items-center justify-between dark:bg-primary">
      <div className="text-2xl font-bold">
        <Link to="/">Event Platform</Link>
      </div>

      <div className="flex items-center space-x-1">
        <Input
          type="text"
          placeholder="Search events"
          className="px-4 py-2"
        />
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
          <div className="relative">
            <Button variant="solid" color="primary" className="relative z-10">
              User Menu
            </Button>
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-20">
              <button
                onClick={() => setIsLoggedIn(false)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
      <ModeToggle />
    </nav>
  );
};

export default Navbar;
