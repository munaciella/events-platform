import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './components/ThemeProvider';
import Navbar from './components/NavBar';
import MobileNavbar from './components/MobileNavbar';
import Home from './components/HomePage';
import CreateEvent from './components/CreateEvent';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <div className="hidden md:block">
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          </div>
          <div className="md:hidden">
            <MobileNavbar
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/login"
              element={<LogIn setIsLoggedIn={setIsLoggedIn} />}
            />
          </Routes>
        </ThemeProvider>
      </div>
    </Router>
  );
}

export default App;
