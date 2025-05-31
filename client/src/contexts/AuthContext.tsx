import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ message: string }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('🔄 Attempting login...');

      const response = await fetch(`${backendURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Login response status:', response.status);
      const data = await response.json();
      console.log('📦 Login response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      toast({
        title: "Welcome Back!",
        description: "You've successfully logged in to your account.",
      });

    } catch (error) {
      console.error('❌ Login error:', error);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        toast({
          title: "Connection Error",
          description: "Cannot connect to server. Please ensure backend is running on port 5000.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Failed",
          description: error instanceof Error ? error.message : "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('🔄 Attempting registration...');
      console.log('📝 Registration data:', { name, email, passwordLength: password.length });

      // Test backend connectivity first
      try {
        const healthResponse = await fetch(`${backendURL}/api/health`);
        console.log('🏥 Backend health check:', healthResponse.status);
      } catch (healthError) {
        console.error('❌ Backend health check failed:', healthError);
        throw new Error('Cannot connect to server. Please ensure backend is running.');
      }

      const response = await fetch(`${backendURL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      console.log('📡 Registration response status:', response.status);
      const data = await response.json();
      console.log('📦 Registration response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      toast({
        title: "Registration Successful!",
        description: "Your account has been created and you're now logged in.",
      });

    } catch (error) {
      console.error('❌ Registration error:', error);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        toast({
          title: "Connection Error",
          description: "Cannot connect to server. Please ensure backend is running.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Failed",
          description: error instanceof Error ? error.message : "Please try again later.",
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<{ message: string }> => {
    try {
      console.log('🔄 Attempting password reset for:', email);

      const response = await fetch(`${backendURL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed');
      }

      toast({
        title: "Reset Email Sent",
        description: "Please check your email for password reset instructions.",
      });

      return data;
    } catch (error) {
      console.error('❌ Password reset error:', error);
      toast({
        title: "Reset Failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You've been successfully logged out.",
    });
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
