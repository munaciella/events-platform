import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { SupabaseAuthProvider } from './components/AuthContext.jsx';
import StripeProvider from './components/StripeProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SupabaseAuthProvider>
      <StripeProvider>
        <App />
      </StripeProvider>
    </SupabaseAuthProvider>
  </React.StrictMode>
);
