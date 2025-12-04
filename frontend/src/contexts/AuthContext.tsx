import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, login as loginService } from "@/services/authService";
import { getMeuPerfil } from "@/services/profissionalService";
import { UserDto, User, Role } from "@/types/api";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (data: UserDto) => Promise<void>;
  logout: () => void;
  validateToken: () => Promise<boolean>;
  updateToken: (newToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const validateStoredToken = async () => {
      const storedToken = sessionStorage.getItem("token");
      if (storedToken) {
        try {
          setToken(storedToken);
          // Try to get full profile first
          const perfil = await getMeuPerfil();
          setUser({
            id: perfil.userId || perfil.id || "",
            email: "", // Perfil doesn't have email, but we need it for User interface
            role: (perfil.tipo === 'ger' ? Role.Gerencia : Role.Profissional),
            especialidade: perfil.especialidade
          });
          setIsAuthenticated(true);
        } catch (error) {
          // If getMeuPerfil fails, maybe try getAuth as fallback or just fail?
          // If they are a user without a profile, getMeuPerfil might fail.
          // But for the purpose of accessing "Pacientes", they need a profile.
          console.error("Failed to validate token/profile", error);
          sessionStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };

    validateStoredToken();
  }, []);

  useEffect(() => {
    const checkRedirect = async () => {
      if (isAuthenticated && (location.pathname === "/" || location.pathname === "/login")) {
        try {
          await getMeuPerfil();
          navigate("/dashboard");
        } catch (error) {
          navigate("/register-perfil");
        }
      }
    };

    checkRedirect();
  }, [isAuthenticated, location, navigate]);

  const login = async (data: UserDto) => {
    const response = await loginService(data);
    if (response.accessToken) {
      sessionStorage.setItem("token", response.accessToken);
      setToken(response.accessToken);
      setIsAuthenticated(true);

      // Try to populate user from response or fetch profile
      if (response.user && typeof response.user !== 'string') {
        setUser(response.user);
      } else {
        try {
          const perfil = await getMeuPerfil();
          setUser({
            id: perfil.userId || perfil.id || "",
            email: "",
            role: (perfil.tipo === 'ger' ? Role.Gerencia : Role.Profissional),
            especialidade: perfil.especialidade
          });
        } catch (e) {
          console.error("Could not fetch profile after login", e);
          // Fallback to basic user if possible, or leave null
        }
      }
    }
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  const validateToken = async (): Promise<boolean> => {
    const currentToken = sessionStorage.getItem("token");
    if (!currentToken) return false;

    try {
      const perfil = await getMeuPerfil();
      setUser({
        id: perfil.userId || perfil.id || "",
        email: "",
        role: (perfil.tipo === 'ger' ? Role.Gerencia : Role.Profissional),
        especialidade: perfil.especialidade
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateToken = async (newToken: string) => {
    sessionStorage.setItem("token", newToken);
    setToken(newToken);
    try {
      const perfil = await getMeuPerfil();
      setUser({
        id: perfil.userId || perfil.id || "",
        email: "",
        role: (perfil.tipo === 'ger' ? Role.Gerencia : Role.Profissional),
        especialidade: perfil.especialidade
      });
      setIsAuthenticated(true);
    } catch (error) {
      // If validation fails, logout
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, isLoading, user, login, logout, validateToken, updateToken }}
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
