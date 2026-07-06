// hooks/useAuth.js
//
// WHAT: Thin convenience hook to read AuthContext.
// WHY: Lets components write `const { user, login } = useAuth()` instead
//      of importing useContext + AuthContext everywhere.

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
