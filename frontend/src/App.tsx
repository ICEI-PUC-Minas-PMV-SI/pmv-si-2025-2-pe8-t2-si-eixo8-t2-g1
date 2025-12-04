import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Agendamento from "./pages/Agendamento";
import Atendimento from "./pages/Atendimento";
import Pacientes from "./pages/Pacientes";
import Documentos from "./pages/Documentos";
import Faturamento from "./pages/Faturamento";
import NovoFaturamento from "./pages/NovoFaturamento";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterPerfil from "./pages/RegisterPerfil";
import RegisterCredentials from "./pages/RegisterCredentials";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-perfil" element={<RegisterPerfil />} />
            <Route path="/register-credentials" element={<RegisterCredentials />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/home" element={<Index />} />
              <Route path="/agendamento" element={<Agendamento />} />
              <Route path="/atendimento" element={<Atendimento />} />
              <Route path="/pacientes" element={<Pacientes />} />
              <Route path="/documentos" element={<Documentos />} />
              <Route path="/faturamento" element={<Faturamento />} />
              <Route path="/faturamento/novo" element={<NovoFaturamento />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
