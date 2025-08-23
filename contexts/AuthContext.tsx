import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Models } from 'react-native-appwrite';
import {
  createUser,
  login,
  getCurrentUser,
  logout,
  createUserDocument,
} from '@/services/appwrite';

interface AuthContextProps {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const current = await getCurrentUser();
        setUser(current);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    await login(email, password);
    const current = await getCurrentUser();
    setUser(current);
  };

  const signUp = async (email: string, password: string, name: string) => {
    const newUser = await createUser(email, password, name);
    await login(email, password);
    await createUserDocument(newUser.$id, name, email);
    const current = await getCurrentUser();
    setUser(current);
  };

  const logOut = async () => {
    await logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
