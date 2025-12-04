import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword as resetPasswordService } from "@/services/authService";
import logo from "@/assets/logo.png";

const resetPasswordSchema = z.object({
  password: z.string().trim().nonempty({ message: "Senha é obrigatória" }).min(4, { message: "Senha deve ter pelo menos 4 caracteres" }),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);

    try {
      if (token) {
        await resetPasswordService(data, token);
        toast({
          title: "Senha redefinida com sucesso",
          description: "Você já pode fazer login com sua nova senha.",
        });
        navigate("/login");
      }
    } catch (error: any) {
      if (error.message.includes('401')) {
        toast({
          variant: "destructive",
          title: "Token inválido ou expirado",
          description: "O link de redefinição de senha expirou ou é inválido. Solicite uma nova redefinição.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao redefinir senha",
          description: "Ocorreu um erro ao tentar redefinir sua senha.",
        });
      }
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
            Redefina sua senha
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Nova Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua nova senha"
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

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                  Redefinindo...
                </div>
              ) : (
                "Redefinir Senha"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
