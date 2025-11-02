import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, UserPlus, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { registerUser, login } from "@/services/authService";

const credentialsSchema = z.object({
  email: z.string().trim().email({ message: "Email inválido" }).max(255, { message: "Email deve ter menos de 255 caracteres" }),
  password: z.string().trim().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string().trim()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type CredentialsFormData = z.infer<typeof credentialsSchema>;

const RegisterCredentials = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialsFormData>({
    resolver: zodResolver(credentialsSchema),
  });

  const onSubmit = async (data: CredentialsFormData) => {
    try {
      setIsLoading(true);
      
      const tokenResponse = await registerUser({
        email: data.email,
        password: data.password
      });
      
      const loginResponse = await login({
        email: data.email,
        password: data.password
      });
      localStorage.setItem('credentialsData', JSON.stringify({
        email: data.email,
        password: data.password,
        accessToken: loginResponse.accessToken
      }));
      
      navigate('/register-profissional');
    } catch (error: any) {
      console.error('Erro no registro:', error);
      
      let errorText = "Não foi possível criar a conta";
      if (error.message && error.message.includes("Email already exists")) {
        errorText = "Este email já possui uma conta vinculada. Tente fazer login ou use outro email.";
      } else if (error.message && error.message.includes("400")) {
        errorText = "Dados inválidos. Verifique se o email está correto e a senha tem pelo menos 6 caracteres.";
      }
      
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: errorText,
        action: error.message && error.message.includes("Email already exists") ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
          >
            Ir para Login
          </Button>
        ) : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-10 h-10" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">neurohabiliTo</CardTitle>
          <CardDescription className="text-muted-foreground">
            Etapa 1 de 2 - Credenciais de Acesso
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  className="pl-10 pr-10"
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirmar Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua senha"
                  className="pl-10 pr-10"
                  {...register("confirmPassword")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleBack}
              >
                <ArrowLeft size={16} className="mr-2" />
                Voltar
              </Button>
              
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                    Cadastrando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus size={16} />
                    Finalizar Cadastro
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterCredentials;
