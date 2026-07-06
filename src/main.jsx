// main.jsx
//
// WHAT: The application's entry point — mounts React, and wraps the app
//       in BrowserRouter (routing), AuthProvider (auth context), and
//       ToastContainer (global toast notifications).
// WHY: Anything that needs to be available everywhere (routing, auth
//      state, toasts) is set up once, here, at the very top of the tree.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
