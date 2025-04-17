import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getBreeds } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

// --- Authentication Context ---
export interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const defaultAuthValue: AuthContextType = {
  isAuthenticated: false,
  login: () => {
    throw new Error('Login function called outside of AuthProvider');
  },
  logout: async () => {
    throw new Error('Logout function called outside of AuthProvider');
  },
  isLoading: true,
};

export const AuthContext = createContext<AuthContextType>(defaultAuthValue);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        await getBreeds();
        setIsAuthenticated(true);
      } catch (error) {
        console.warn('Auth check failed, assuming logged out:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logout();
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsAuthenticated(false);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const value = {
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
    isLoading,
  };

  if (isLoading && !isAuthenticated) {
    return <LoadingSpinner />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context || context === defaultAuthValue) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
