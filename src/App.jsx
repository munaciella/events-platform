import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './components/ThemeProvider';
import Navbar from './components/NavBar';
import MobileNavbar from './components/MobileNavbar';
import Home from './components/HomePage';
import CreateEvent from './components/CreateEvent';
import SignUp from './components/SignUp';
import { Footer } from './components/Footer';
import EventPage from './components/EventPage';
import LogIn from './components/LogIn';
import { useSupabaseAuth } from './components/AuthContext';
import Confirmation from './components/ConfirmationPage';
import PaymentPage from './components/PaymentPage';
import SearchResults from './components/SearchResults';
import ErrorPage from './components/ErrorPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useSupabaseAuth();

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
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
          <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/login"
              element={<LogIn setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="/event/:event_id" element={<EventPage />} />
            <Route
              path="/confirmation/:event_id/:registration_id"
              element={<Confirmation />}
            />
            <Route
              path="/payment/:event_id/:registration_id"
              element={<PaymentPage />}
            />
            <Route path="/search-results" element={<SearchResults/>} />
            <Route
          path="*"
          element={
            <ErrorPage
              title="404 Page Not Found"
              message="Sorry, this page doesn't exist yet... 😢"
            />
          }
        />
          </Routes>
          </main>
        </ThemeProvider>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
