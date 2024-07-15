import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { SupabaseAuthProvider } from './components/AuthContext.jsx';
import { ToastProvider } from './components/ui/toast.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SupabaseAuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </SupabaseAuthProvider>
  </React.StrictMode>
);
