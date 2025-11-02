import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, GraduationCap, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { createProfissional } from "@/services/profissionalService";
import logo from "@/assets/logo.png";

const profissionalSchema = z.object({
  nomeCompleto: z.string().trim().min(2, { message: "Nome completo deve ter pelo menos 2 caracteres" }),
  especialidade: z.string().trim().min(2, { message: "Especialidade é obrigatória" })
});

type ProfissionalFormData = z.infer<typeof profissionalSchema>;

const RegisterProfissional = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState<{ email: string; password: string; accessToken: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('credentialsData');
    if (!stored) {
      navigate('/register-credentials');
      return;
    }
    setCredentials(JSON.parse(stored));
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfissionalFormData>({
    resolver: zodResolver(profissionalSchema),
  });

  const onSubmit = async (data: ProfissionalFormData) => {
    if (!credentials) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Credenciais não encontradas. Recomece o cadastro.",
      });
      navigate('/register-credentials');
      return;
    }

    try {
      setIsLoading(true);

      localStorage.setItem('token', credentials.accessToken);

      await createProfissional({
        nomeCompleto: data.nomeCompleto,
        especialidade: data.especialidade,
        registroConselho: ''
      });

      localStorage.removeItem('credentialsData');

      toast({
        title: "Cadastro realizado com sucesso",
        description: "Você já pode fazer login com suas credenciais.",
      });

      setTimeout(() => navigate('/'), 2000);
    } catch (error: any) {
      let errorText = "Não foi possível criar o perfil do profissional";
      if (error?.message?.includes("Unauthorized")) {
        errorText = "Token de acesso inválido. Recomece o cadastro.";
      }
      toast({ variant: "destructive", title: "Erro no cadastro", description: errorText });
    } finally {
      setIsLoading(false);
    }
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
            Etapa 1 de 2 - Dados do Profissional
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <Label htmlFor="especialidade" className="text-sm font-medium text-foreground">
                Especialidade
              </Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="especialidade"
                  type="text"
                  placeholder="Ex: Fisioterapia, Terapia Ocupacional, Fonoaudiologia"
                  className="pl-10"
                  {...register("especialidade")}
                />
              </div>
              {errors.especialidade && (
                <p className="text-sm text-destructive">{errors.especialidade.message}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/")}
              >
                <ArrowLeft size={16} className="mr-2" />
                Voltar para Login
              </Button>

              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                <ArrowRight size={16} className="mr-2" />
                {isLoading ? 'Enviando...' : 'Finalizar Cadastro'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterProfissional;
