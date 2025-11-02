import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, login as loginService } from "@/services/authService";
import { UserDto } from "@/types/api";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: UserDto) => Promise<void>;
  logout: () => void;
  validateToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const validateStoredToken = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          await getAuth();
          setToken(storedToken);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };

    validateStoredToken();
  }, []);

  useEffect(() => {
    if (isAuthenticated && (location.pathname === "/" || location.pathname === "/login")) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, location, navigate]);

  const login = async (data: UserDto) => {
    const response = await loginService(data);
    if (response.accessToken) {
      localStorage.setItem("token", response.accessToken);
      setToken(response.accessToken);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  const validateToken = async (): Promise<boolean> => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) return false;

    try {
      await getAuth();
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, isLoading, login, logout, validateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
