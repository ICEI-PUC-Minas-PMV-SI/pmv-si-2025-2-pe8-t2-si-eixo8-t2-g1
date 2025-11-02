import { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
    User,
    Lock,
    Save,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const perfilSchema = z.object({
    nomeCompleto: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    especialidade: z.string().min(2, "Especialidade deve ter pelo menos 2 caracteres"),
});

const senhaSchema = z.object({
    senhaAtual: z.string().min(1, "Senha atual é obrigatória"),
    novaSenha: z.string().min(6, "Nova senha deve ter pelo menos 6 caracteres"),
    confirmarSenha: z.string().min(6, "Confirmação de senha é obrigatória"),
}).refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "Senhas não coincidem",
    path: ["confirmarSenha"],
});

type PerfilFormData = z.infer<typeof perfilSchema>;
type SenhaFormData = z.infer<typeof senhaSchema>;

const Configuracoes = () => {
    const [loading, setLoading] = useState(false);
    const [loadingDados, setLoadingDados] = useState(true);
    const [showSenhaAtual, setShowSenhaAtual] = useState(false);
    const [showNovaSenha, setShowNovaSenha] = useState(false);
    const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
    const { toast } = useToast();

    const perfilForm = useForm<PerfilFormData>({
        resolver: zodResolver(perfilSchema),
        defaultValues: {
            nomeCompleto: "",
            email: "",
            especialidade: "",
        }
    });

    const senhaForm = useForm<SenhaFormData>({
        resolver: zodResolver(senhaSchema),
        defaultValues: {
            senhaAtual: "",
            novaSenha: "",
            confirmarSenha: "",
        }
    });

    useEffect(() => {
        carregarDadosUsuario();
    }, []);

    const carregarDadosUsuario = async () => {
        try {
            setLoadingDados(true);
            const token = localStorage.getItem('token');
            if (!token) {
                toast({
                    variant: "destructive",
                    title: "Erro",
                    description: "Usuário não autenticado.",
                });
                return;
            }

            console.log('Token encontrado:', token.substring(0, 50) + '...');

            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('Payload do token:', payload);

            const emailClaim = payload.email
                || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]
                || payload["unique_name"]
                || "";

            console.log('Email extraído do token:', emailClaim);

            const response = await fetch(`https://localhost:7084/api/Profissional/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Status da resposta:', response.status);

            if (response.ok) {
                const profissional = await response.json();
                console.log('Dados do profissional da API:', profissional);

                const dadosUsuario = {
                    nomeCompleto: profissional.nomeCompleto || "",
                    email: emailClaim,
                    especialidade: profissional.especialidade || "",
                };

                perfilForm.reset(dadosUsuario);
                console.log('Dados carregados:', dadosUsuario);
            } else {
                const errorText = await response.text();
                console.error('Erro na resposta da API:', response.status, errorText);
                toast({
                    variant: "destructive",
                    title: "Erro",
                    description: `Erro ao carregar dados do profissional: ${response.status}`,
                });
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao carregar dados do usuário.",
            });
        } finally {
            setLoadingDados(false);
        }
    };

    const onSubmitPerfil = async (data: PerfilFormData) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast({
                    variant: "destructive",
                    title: "Erro",
                    description: "Usuário não autenticado.",
                });
                return;
            }

            const response = await fetch(`https://localhost:7084/api/Profissional`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nomeCompleto: data.nomeCompleto,
                    especialidade: data.especialidade,
                }),
            });

            if (response.ok) {
                toast({
                    title: "Sucesso",
                    description: "Dados do perfil atualizados com sucesso.",
                });
            } else {
                throw new Error('Erro ao atualizar perfil');
            }
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao atualizar dados do perfil.",
            });
        } finally {
            setLoading(false);
        }
    };

    const onSubmitSenha = async (data: SenhaFormData) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast({
                    variant: "destructive",
                    title: "Erro",
                    description: "Usuário não autenticado.",
                });
                return;
            }

            const response = await fetch(`https://localhost:7084/api/Auth/change-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: data.senhaAtual,
                    newPassword: data.novaSenha,
                }),
            });

            if (response.ok) {
                toast({
                    title: "Sucesso",
                    description: "Senha alterada com sucesso.",
                });
                senhaForm.reset();
            } else {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao alterar senha');
            }
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao alterar senha. Verifique a senha atual.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <Card>
                    <CardContent className="py-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground">Usuário logado</p>
                                <p className="text-lg font-semibold">{perfilForm.watch("nomeCompleto") || ""}</p>
                                <p className="text-sm text-muted-foreground">{perfilForm.watch("email") || ""}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
                    <p className="text-muted-foreground">
                        Gerencie suas informações pessoais e configurações de conta
                    </p>
                </div>

                <Tabs defaultValue="perfil" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="perfil">Perfil</TabsTrigger>
                        <TabsTrigger value="senha">Segurança</TabsTrigger>
                    </TabsList>

                    <TabsContent value="perfil" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Informações Pessoais
                                </CardTitle>
                                <CardDescription>
                                    Atualize suas informações pessoais e profissionais
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={perfilForm.handleSubmit(onSubmitPerfil)} className="space-y-4">
                                    {loadingDados ? (
                                        <div className="flex items-center justify-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            <span className="ml-2 text-muted-foreground">Carregando dados...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="nomeCompleto">Nome Completo</Label>
                                                    <Input
                                                        id="nomeCompleto"
                                                        {...perfilForm.register("nomeCompleto")}
                                                        placeholder="Seu nome completo"
                                                    />
                                                    {perfilForm.formState.errors.nomeCompleto && (
                                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                                            <AlertCircle className="h-4 w-4" />
                                                            {perfilForm.formState.errors.nomeCompleto.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input
                                                        id="email"
                                                        {...perfilForm.register("email")}
                                                        type="email"
                                                        disabled
                                                        className="bg-muted"
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        O email não pode ser alterado
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="especialidade">Especialidade</Label>
                                                    <Input
                                                        id="especialidade"
                                                        {...perfilForm.register("especialidade")}
                                                        placeholder="Sua especialidade profissional"
                                                    />
                                                    {perfilForm.formState.errors.especialidade && (
                                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                                            <AlertCircle className="h-4 w-4" />
                                                            {perfilForm.formState.errors.especialidade.message}
                                                        </p>
                                                    )}
                                                </div>


                                            </div>

                                            <Separator />

                                            <div className="flex justify-end">
                                                <Button type="submit" disabled={loading} className="flex items-center gap-2">
                                                    {loading ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    ) : (
                                                        <Save className="h-4 w-4" />
                                                    )}
                                                    Salvar Alterações
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="senha" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="h-5 w-5" />
                                    Alterar Senha
                                </CardTitle>
                                <CardDescription>
                                    Mantenha sua conta segura alterando sua senha regularmente
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={senhaForm.handleSubmit(onSubmitSenha)} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="senhaAtual">Senha Atual</Label>
                                        <div className="relative">
                                            <Input
                                                id="senhaAtual"
                                                type={showSenhaAtual ? "text" : "password"}
                                                {...senhaForm.register("senhaAtual")}
                                                placeholder="Digite sua senha atual"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                                            >
                                                {showSenhaAtual ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        {senhaForm.formState.errors.senhaAtual && (
                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                {senhaForm.formState.errors.senhaAtual.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="novaSenha">Nova Senha</Label>
                                        <div className="relative">
                                            <Input
                                                id="novaSenha"
                                                type={showNovaSenha ? "text" : "password"}
                                                {...senhaForm.register("novaSenha")}
                                                placeholder="Digite sua nova senha"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowNovaSenha(!showNovaSenha)}
                                            >
                                                {showNovaSenha ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        {senhaForm.formState.errors.novaSenha && (
                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                {senhaForm.formState.errors.novaSenha.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmarSenha"
                                                type={showConfirmarSenha ? "text" : "password"}
                                                {...senhaForm.register("confirmarSenha")}
                                                placeholder="Confirme sua nova senha"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                                            >
                                                {showConfirmarSenha ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        {senhaForm.formState.errors.confirmarSenha && (
                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                {senhaForm.formState.errors.confirmarSenha.message}
                                            </p>
                                        )}
                                    </div>

                                    <Separator />

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={loading} className="flex items-center gap-2">
                                            {loading ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            ) : (
                                                <CheckCircle className="h-4 w-4" />
                                            )}
                                            Alterar Senha
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
};

export default Configuracoes;
