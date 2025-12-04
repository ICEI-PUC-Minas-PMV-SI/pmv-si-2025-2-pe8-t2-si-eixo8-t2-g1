import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, UserPlus, ArrowLeft, User, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { registerUser } from "@/services/authService";
import { createPerfil } from "@/services/profissionalService";
import { Role } from "@/types/api";

const PROFESSIONAL_TYPES = [
  "Terapeuta",
  "Psicologo",
  "RH",
  "Fisioterapeuta",
  "Nutricionista",
  "Fonoaudiologo",
  "Outro"
];

const registerSchema = z.object({
  email: z.string().trim().email({ message: "Email inválido" }).max(255, { message: "Email deve ter menos de 255 caracteres" }),
  password: z.string().trim().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string().trim(),
  nomeCompleto: z.string().trim().min(2, { message: "Nome completo deve ter pelo menos 2 caracteres" }),
  tipoProfissional: z.string({ required_error: "Selecione o tipo de profissional" }).min(1, "Selecione o tipo de profissional"),
  especialidade: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // 1. Register User (Auth)
      const tokenResponse = await registerUser({
        email: data.email,
        password: data.password,
        role: Role.Profissional
      });

      if (tokenResponse.accessToken) {
        // 2. Save token temporarily for the next request
        sessionStorage.setItem('token', tokenResponse.accessToken);

        // 3. Create Profile
        await createPerfil({
          nomeCompleto: data.nomeCompleto,
          tipo: 'pro',
          especialidade: data.especialidade,
          registroConselho: ''
        });

        toast({
          title: "Cadastro realizado com sucesso",
          description: "Você já pode fazer login com suas credenciais.",
        });

        // Clear token to force fresh login
        sessionStorage.removeItem('token');

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }

    } catch (error: any) {
      console.error(error);
      let errorText = "Não foi possível criar a conta";
      if (error.message && error.message.includes("Email already exists")) {
        errorText = "Email já possui uma conta vinculada.";
      }
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: errorText,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Health Scheduler</CardTitle>
          <CardDescription className="text-muted-foreground">
            Cadastre-se como profissional para começar
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
              <Label htmlFor="nomeCompleto" className="text-sm font-medium text-foreground">
                Nome Completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="nomeCompleto"
                  type="text"
                  placeholder="Seu nome completo"
                  className="pl-10"
                  {...register("nomeCompleto")}
                />
              </div>
              {errors.nomeCompleto && (
                <p className="text-sm text-destructive">{errors.nomeCompleto.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoProfissional" className="text-sm font-medium text-foreground">
                Tipo de Profissional
              </Label>
              <Select onValueChange={(value) => setValue("tipoProfissional", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {PROFESSIONAL_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tipoProfissional && (
                <p className="text-sm text-destructive">{errors.tipoProfissional.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="especialidade" className="text-sm font-medium text-foreground">
                Especialidade (Opcional)
              </Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="especialidade"
                  type="text"
                  placeholder="Ex: Terapia Cognitiva, Neuropsicologia"
                  className="pl-10"
                  {...register("especialidade")}
                />
              </div>
              {errors.especialidade && (
                <p className="text-sm text-destructive">{errors.especialidade.message}</p>
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

            <Button
              type="submit"
              className="w-full"
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
                  Cadastrar Profissional
                </div>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar para Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;