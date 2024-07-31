import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { useSupabaseAuth } from './components/AuthContext';
import Navbar from './components/custom/NavBar';
import MobileNavbar from './components/custom/MobileNavbar';
import Home from './components/routes/home/HomePage';
import CreateEvent from './components/routes/createevent/CreateEvent';
import SignUp from './components/routes/signup/SignUp';
import LogIn from './components/routes/login/LogIn';
import EventPage from './components/routes/eventpage/EventPage';
import Confirmation from './components/routes/confirmation/ConfirmationPage';
import PaymentPage from './components/routes/payment/PaymentPage';
import SearchResults from './components/routes/searchresults/SearchResults';
import ErrorPage from './components/routes/error/ErrorPage';
import { Footer } from './components/custom/Footer';

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
              <Route path="/search-results" element={<SearchResults />} />
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
