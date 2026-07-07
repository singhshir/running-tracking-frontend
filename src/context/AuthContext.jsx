// context/AuthContext.jsx
//
// WHAT: React Context that holds the current user, their JWT, and
//       loading state, plus login/logout/updateUser actions.
// WHY: Auth state is needed all over the app (navbar, protected routes,
//      profile page) so it lives here instead of being re-fetched
//      or passed down through props everywhere.

import { createContext, useEffect, useState } from "react";
import {
  loginUser,
  logoutUser,
  registerUser,
  fetchProfile,
  resetPassword as resetPasswordApi,
} from "../api/authApi";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // On first load, if a token exists, try to restore the session by
  // fetching the profile. This is what keeps a user logged in after
  // refreshing the page.
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await fetchProfile();
        setUser(data.data);
        setToken(storedToken);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    const { data } = await loginUser({ email, password });
    const { user: loggedInUser, token: newToken } = data.data;

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setToken(newToken);

    return loggedInUser;
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const register = async (payload) => {
    const { data } = await registerUser(payload);
    const { user: newUser, token: newToken } = data.data;

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    setToken(newToken);

    return newUser;
  };

  const resetPassword = async (token, password) => {
    const { data } = await resetPasswordApi(token, password);
    const { user: resetUser, token: newToken } = data.data;

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(resetUser));
    setUser(resetUser);
    setToken(newToken);

    return resetUser;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      // Even if the network call fails, clear local session state so
      // the user isn't stuck "logged in" on the frontend.
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(token),
        login,
        register,
        updateUser,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
