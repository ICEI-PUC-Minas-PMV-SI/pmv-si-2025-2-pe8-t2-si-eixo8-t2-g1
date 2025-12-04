import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, GraduationCap, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { createPerfil } from "@/services/profissionalService";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

const PROFESSIONAL_TYPES = [
  "Terapeuta",
  "Psicologo",
  "RH",
  "Fisioterapeuta",
  "Nutricionista",
  "Fonoaudiologo",
  "Outro"
];

const profissionalSchema = z.object({
  nomeCompleto: z.string().trim().min(2, { message: "Nome completo deve ter pelo menos 2 caracteres" }),
  tipoPerfil: z.enum(["profissional", "gestor"], { required_error: "Selecione um tipo de perfil" }),
  tipoProfissional: z.string().optional(),
  especialidade: z.string().optional(),
}).refine((data) => {
  if (data.tipoPerfil === "profissional" && !data.tipoProfissional) {
    return false;
  }
  return true;
}, {
  message: "Selecione o tipo de profissional",
  path: ["tipoProfissional"],
});

type ProfissionalFormData = z.infer<typeof profissionalSchema>;

const RegisterPerfil = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfissionalFormData>({
    resolver: zodResolver(profissionalSchema),
    defaultValues: {
      tipoPerfil: "profissional"
    }
  });

  const tipoPerfil = watch("tipoPerfil");
  const tipoProfissional = watch("tipoProfissional");

  const onSubmit = async (data: ProfissionalFormData) => {
    try {
      setIsLoading(true);

      const response = await createPerfil({
        nomeCompleto: data.nomeCompleto,
        tipo: data.tipoPerfil === 'gestor' ? 'ger' : 'pro',
        especialidade: data.tipoPerfil === 'gestor' ? '' : (data.tipoProfissional === 'Outro' ? data.especialidade : data.tipoProfissional),
        registroConselho: ''
      });

      if (response.accessToken) {
        await updateToken(response.accessToken);
      }

      toast({
        title: "Cadastro realizado com sucesso",
        description: "Seu perfil profissional foi criado.",
      });

      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error: any) {
      let errorText = "Não foi possível criar o perfil do profissional";
      if (error?.message?.includes("Unauthorized")) {
        errorText = "Sessão expirada. Faça login novamente.";
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
            <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Health Scheduler</CardTitle>
          <CardDescription className="text-muted-foreground">
            Etapa 2 de 2 - Dados do Profissional
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
              <Label className="text-sm font-medium text-foreground">Tipo de Perfil</Label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${tipoPerfil === 'profissional' ? 'border-primary bg-primary/10 ring-2 ring-primary' : 'border-input hover:bg-accent'}`}>
                  <input
                    type="radio"
                    value="profissional"
                    className="sr-only"
                    {...register("tipoPerfil")}
                  />
                  <div className="text-center">
                    <User className="mx-auto mb-2 h-6 w-6" />
                    <span className="font-medium">Profissional</span>
                  </div>
                </label>
                <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${tipoPerfil === 'gestor' ? 'border-primary bg-primary/10 ring-2 ring-primary' : 'border-input hover:bg-accent'}`}>
                  <input
                    type="radio"
                    value="gestor"
                    className="sr-only"
                    {...register("tipoPerfil")}
                  />
                  <div className="text-center">
                    <GraduationCap className="mx-auto mb-2 h-6 w-6" />
                    <span className="font-medium">Gestor</span>
                  </div>
                </label>
              </div>
              {errors.tipoPerfil && (
                <p className="text-sm text-destructive">{errors.tipoPerfil.message}</p>
              )}
            </div>

            {tipoPerfil === 'profissional' && (
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
            )}

            {tipoPerfil === 'profissional' && tipoProfissional === 'Outro' && (
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
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                  Criando perfil...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ArrowRight size={16} />
                  Concluir Cadastro
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPerfil;
