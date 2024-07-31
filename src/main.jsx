import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import StripeProvider from './components/StripeProvider.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SupabaseAuthProvider } from './components/AuthContext.jsx';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <GoogleOAuthProvider clientId={googleClientId}>
    <SupabaseAuthProvider>
      <StripeProvider>
        <App />
      </StripeProvider>
    </SupabaseAuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
