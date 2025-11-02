import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, Save, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { createFaturamento, gerarFaturamento } from "@/services/faturamentoService";
import { CriarFaturamentoAvulsoDto, CriarFaturamentoDto } from "@/types/api";
import { getPacientes } from "@/services/pacienteService";
import { getAgendamentos } from "@/services/agendamentoService";
import { getProfissionais } from "@/services/profissionalService";
import { PacienteDto } from "@/types/api";

// Função para obter um profissionalId válido
const getValidProfissionalId = async (): Promise<string | null> => {
    try {
        // Extrai o ID do token JWT diretamente
        const token = localStorage.getItem('token');
        if (!token) {
            return null;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const tokenProfissionalId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

        // Usar diretamente o ID do token sem tentar criar profissional
        return tokenProfissionalId || null;

    } catch (error) {
        console.error('Erro geral ao obter profissionalId:', error);
        return null;
    }
};

const faturamentoSchema = z.object({
    pacienteId: z.string().min(1, "Selecione um paciente"),
    servico: z.string().min(1, "Serviço é obrigatório"),
    data: z.string().min(1, "Data é obrigatória"),
    valor: z.number().min(0.01, "Valor deve ser maior que zero"),
    formaPagamento: z.string().optional(),
    observacoes: z.string().optional(),
    agendamentoId: z.string().optional(),
    // Campos para geração por período
    dataInicio: z.string().optional(),
    dataFim: z.string().optional(),
    valorPorAtendimento: z.number().optional()
});

type FaturamentoFormData = z.infer<typeof faturamentoSchema>;

const NovoFaturamento = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [pacientes, setPacientes] = useState<PacienteDto[]>([]);
    const [agendamentos, setAgendamentos] = useState<any[]>([]);
    const [dataSelecionada, setDataSelecionada] = useState<Date>();
    const [tipoFaturamento, setTipoFaturamento] = useState<"manual" | "gerar">("manual");

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm<FaturamentoFormData>({
        resolver: zodResolver(faturamentoSchema),
    });

    const pacienteId = watch("pacienteId");

    useEffect(() => {
        fetchPacientes();
        fetchAgendamentos();
    }, []);

    const fetchPacientes = async () => {
        try {
            const data = await getPacientes();
            setPacientes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Erro ao carregar pacientes:', error);
        }
    };

    const fetchAgendamentos = async () => {
        try {
            const data = await getAgendamentos();
            setAgendamentos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Erro ao carregar agendamentos:', error);
        }
    };

    // Filtrar agendamentos do paciente selecionado
    const agendamentosPaciente = agendamentos.filter(ag =>
        ag.pacienteId === pacienteId && ag.status === "Realizado"
    );

    const onSubmit = async (data: FaturamentoFormData) => {
        setIsLoading(true);

        try {
            if (tipoFaturamento === "manual") {
                // Obter profissionalId válido
                const profissionalId = await getValidProfissionalId();
                if (!profissionalId) {
                    toast({
                        variant: "destructive",
                        title: "Erro de autenticação",
                        description: "Não foi possível identificar um profissional válido.",
                    });
                    return;
                }

                // Criar faturamento manual - enviar dados no formato correto
                const faturamentoData: CriarFaturamentoAvulsoDto = {
                    paciente: pacientes.find(p => p.id === data.pacienteId)?.nomeCompleto || "",
                    servico: data.servico,
                    data: new Date(data.data),
                    valor: data.valor,
                    status: "Rascunho",
                    formaPagamento: data.formaPagamento || "",
                    observacoes: data.observacoes,
                    pacienteId: data.pacienteId,
                    agendamentoId: data.agendamentoId || "00000000-0000-0000-0000-000000000000",
                    profissionalId: profissionalId
                };

                console.log('Dados do faturamento:', faturamentoData);
                console.log('ProfissionalId extraído:', profissionalId);

                await createFaturamento(faturamentoData);

                toast({
                    title: "Faturamento criado",
                    description: "O faturamento foi criado com sucesso.",
                });
            } else {
                // Obter profissionalId válido
                const profissionalId = await getValidProfissionalId();
                if (!profissionalId) {
                    toast({
                        variant: "destructive",
                        title: "Erro de autenticação",
                        description: "Não foi possível identificar um profissional válido.",
                    });
                    return;
                }

                // Gerar faturamento por período
                const gerarData: CriarFaturamentoDto = {
                    dataInicio: new Date(data.dataInicio + 'T00:00:00Z').toISOString(),
                    dataFim: new Date(data.dataFim + 'T23:59:59Z').toISOString(),
                    profissionalId: profissionalId,
                    valorPorAtendimento: data.valorPorAtendimento,
                    observacoes: data.observacoes
                };

                await gerarFaturamento(gerarData);

                toast({
                    title: "Faturamento gerado",
                    description: "Os faturamentos foram gerados com sucesso.",
                });
            }

            navigate("/faturamento");
        } catch (error) {
            console.error('Erro ao criar faturamento:', error);
            toast({
                variant: "destructive",
                title: "Erro ao criar faturamento",
                description: "Não foi possível criar o faturamento.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDataChange = (date: Date | undefined) => {
        setDataSelecionada(date);
        if (date) {
            setValue("data", format(date, "yyyy-MM-dd"));
        }
    };

    const handleAgendamentoSelect = (agendamentoId: string) => {
        const agendamento = agendamentos.find(ag => ag.id === agendamentoId);
        if (agendamento) {
            setValue("servico", agendamento.tipoAtendimento || "");
            setValue("data", agendamento.dataHora.split('T')[0]);
            setValue("agendamentoId", agendamentoId);
        }
    };

    return (
        <Layout>
            <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/faturamento")}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Novo Faturamento</h1>
                        <p className="text-muted-foreground">Crie um novo faturamento ou gere por período</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulário Principal */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Dados do Faturamento
                            </CardTitle>
                            <CardDescription>
                                Preencha os dados para criar o faturamento
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Tipo de Faturamento */}
                                <div className="space-y-2">
                                    <Label>Tipo de Faturamento</Label>
                                    <Select value={tipoFaturamento} onValueChange={(value: "manual" | "gerar") => setTipoFaturamento(value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="manual">Faturamento Manual</SelectItem>
                                            <SelectItem value="gerar">Gerar por Período</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Paciente */}
                                <div className="space-y-2">
                                    <Label htmlFor="pacienteId">Paciente *</Label>
                                    <Select onValueChange={(value) => setValue("pacienteId", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um paciente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {pacientes.map((paciente) => (
                                                <SelectItem key={paciente.id} value={paciente.id || ""}>
                                                    {paciente.nomeCompleto}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.pacienteId && (
                                        <p className="text-sm text-destructive">{errors.pacienteId.message}</p>
                                    )}
                                </div>

                                {/* Agendamento (apenas para faturamento manual) */}
                                {tipoFaturamento === "manual" && agendamentosPaciente.length > 0 && (
                                    <div className="space-y-2">
                                        <Label htmlFor="agendamentoId">Agendamento Realizado (opcional)</Label>
                                        <Select onValueChange={handleAgendamentoSelect}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione um agendamento" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {agendamentosPaciente.map((agendamento) => (
                                                    <SelectItem key={agendamento.id} value={agendamento.id}>
                                                        {format(new Date(agendamento.dataHora), "dd/MM/yyyy HH:mm")} - {agendamento.tipoAtendimento}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {/* Serviço */}
                                <div className="space-y-2">
                                    <Label htmlFor="servico">Serviço *</Label>
                                    <Input
                                        id="servico"
                                        placeholder="Ex: Consulta Neurológica, Avaliação Neuropsicológica..."
                                        {...register("servico")}
                                    />
                                    {errors.servico && (
                                        <p className="text-sm text-destructive">{errors.servico.message}</p>
                                    )}
                                </div>

                                {/* Data */}
                                <div className="space-y-2">
                                    <Label>Data *</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !dataSelecionada && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {dataSelecionada ? format(dataSelecionada, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={dataSelecionada}
                                                onSelect={handleDataChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.data && (
                                        <p className="text-sm text-destructive">{errors.data.message}</p>
                                    )}
                                </div>

                                {/* Valor */}
                                <div className="space-y-2">
                                    <Label htmlFor="valor">Valor (R$) *</Label>
                                    <Input
                                        id="valor"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0,00"
                                        {...register("valor", { valueAsNumber: true })}
                                    />
                                    {errors.valor && (
                                        <p className="text-sm text-destructive">{errors.valor.message}</p>
                                    )}
                                </div>

                                {/* Forma de Pagamento */}
                                <div className="space-y-2">
                                    <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
                                    <Select onValueChange={(value) => setValue("formaPagamento", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a forma de pagamento" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PIX">PIX</SelectItem>
                                            <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                                            <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                                            <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                                            <SelectItem value="Transferência">Transferência Bancária</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Observações */}
                                <div className="space-y-2">
                                    <Label htmlFor="observacoes">Observações</Label>
                                    <Textarea
                                        id="observacoes"
                                        placeholder="Observações adicionais sobre o faturamento..."
                                        {...register("observacoes")}
                                    />
                                </div>

                                {/* Botões */}
                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate("/faturamento")}
                                        className="flex-1"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                                                Salvando...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Save className="h-4 w-4" />
                                                {tipoFaturamento === "manual" ? "Criar Faturamento" : "Gerar Faturamentos"}
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Informações Adicionais */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium mb-2">Faturamento Manual</h4>
                                <p className="text-sm text-muted-foreground">
                                    Crie um faturamento individual para um paciente específico.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">Gerar por Período</h4>
                                <p className="text-sm text-muted-foreground">
                                    Gera automaticamente faturamentos para todos os agendamentos realizados no período.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Status do Faturamento</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <span className="text-sm">Pendente - Aguardando pagamento</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm">Emitido - Faturamento emitido</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm">Pago - Pagamento confirmado</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default NovoFaturamento;
