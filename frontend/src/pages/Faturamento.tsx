import { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, Filter, Search, DollarSign, TrendingUp, Receipt, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
    getFaturamentos,
    getFaturamentoPorPeriodo,
    calcularEstatisticas,
    emitirFaturamento,
    cancelarFaturamento
} from "@/services/faturamentoService";
import { FaturamentoDto, EnumStatusFaturamento } from "@/types/api";
import { useNavigate } from "react-router-dom";

const Faturamento = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [faturamentos, setFaturamentos] = useState<FaturamentoDto[]>([]);
    const [filtroData, setFiltroData] = useState<Date | undefined>();
    const [filtroStatus, setFiltroStatus] = useState<string>("todos");
    const [busca, setBusca] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState({
        totalFaturado: 0,
        totalPago: 0,
        totalPendente: 0,
        taxaRecebimento: 0
    });

    const fetchFaturamentos = async () => {
        try {
            setIsLoading(true);

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Usuário não autenticado. Faça login para acessar os faturamentos.');
            }

            const faturamentosData = await getFaturamentos();

            setFaturamentos(Array.isArray(faturamentosData) ? faturamentosData : []);

            const statsCalculadas = calcularEstatisticas(faturamentosData || []);
            setStats(statsCalculadas);
        } catch (error) {
            console.error('Erro ao carregar dados de faturamento:', error);

            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            toast({
                variant: "destructive",
                title: "Erro ao carregar faturamentos",
                description: errorMessage,
            });
            const dadosMockados: FaturamentoDto[] = [
                {
                    id: "1",
                    dataFaturamento: "2024-01-15T10:00:00Z",
                    dataInicio: "2024-01-15T00:00:00Z",
                    dataFim: "2024-01-15T23:59:59Z",
                    profissionalId: "fcb9a240-255e-4fde-8ba5-d13c1c249f0e",
                    profissionalNome: "Dr. Ana Silva",
                    valorTotal: 250.00,
                    totalAtendimentos: 1,
                    status: EnumStatusFaturamento.Pago,
                    observacoes: "Consulta realizada com sucesso",
                    itens: []
                },
                {
                    id: "2",
                    dataFaturamento: "2024-01-14T14:30:00Z",
                    dataInicio: "2024-01-14T00:00:00Z",
                    dataFim: "2024-01-14T23:59:59Z",
                    profissionalId: "fcb9a240-255e-4fde-8ba5-d13c1c249f0e",
                    profissionalNome: "Dr. Ana Silva",
                    valorTotal: 400.00,
                    totalAtendimentos: 1,
                    status: EnumStatusFaturamento.Rascunho,
                    observacoes: "Aguardando pagamento",
                    itens: []
                },
                {
                    id: "3",
                    dataFaturamento: "2024-01-13T09:15:00Z",
                    dataInicio: "2024-01-13T00:00:00Z",
                    dataFim: "2024-01-13T23:59:59Z",
                    profissionalId: "fcb9a240-255e-4fde-8ba5-d13c1c249f0e",
                    profissionalNome: "Dr. Ana Silva",
                    valorTotal: 180.00,
                    totalAtendimentos: 1,
                    status: EnumStatusFaturamento.Emitido,
                    observacoes: "Faturamento emitido",
                    itens: []
                }
            ];

            setFaturamentos(dadosMockados);
            const statsCalculadas = calcularEstatisticas(dadosMockados);
            setStats(statsCalculadas);

            toast({
                variant: "destructive",
                title: "Erro na API",
                description: "Usando dados de demonstração. A tabela 'Faturamentos' não existe no banco de dados.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmitirFaturamento = async (id: string) => {
        try {
            await emitirFaturamento(id);
            toast({
                title: "Faturamento emitido",
                description: "O faturamento foi emitido com sucesso.",
            });
            fetchFaturamentos(); // Recarregar dados
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao emitir",
                description: "Não foi possível emitir o faturamento.",
            });
        }
    };

    const handleCancelarFaturamento = async (id: string) => {
        try {
            await cancelarFaturamento(id);
            toast({
                title: "Faturamento cancelado",
                description: "O faturamento foi cancelado com sucesso.",
            });
            fetchFaturamentos(); // Recarregar dados
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao cancelar",
                description: "Não foi possível cancelar o faturamento.",
            });
        }
    };

    useEffect(() => {
        fetchFaturamentos();
    }, []);

    const faturamentosFiltrados = faturamentos.filter(item => {
        const matchBusca = (item.profissionalNome?.toLowerCase() || '').includes(busca.toLowerCase()) ||
            (item.observacoes?.toLowerCase() || '').includes(busca.toLowerCase());
        const matchStatus = filtroStatus === "todos" || item.status.toString() === filtroStatus;
        const matchData = !filtroData || item.dataFaturamento.startsWith(format(filtroData, "yyyy-MM-dd"));

        return matchBusca && matchStatus && matchData;
    });

    // Usar dados da API ou calcular localmente se não disponível
    const totalFaturamento = stats.totalFaturado || faturamentosFiltrados.reduce((acc, item) => acc + item.valorTotal, 0);
    const totalPago = stats.totalPago || faturamentosFiltrados
        .filter(item => item.status === EnumStatusFaturamento.Pago)
        .reduce((acc, item) => acc + item.valorTotal, 0);
    const totalPendente = stats.totalPendente || faturamentosFiltrados
        .filter(item => item.status === EnumStatusFaturamento.Rascunho)
        .reduce((acc, item) => acc + item.valorTotal, 0);

    const getStatusBadge = (status: EnumStatusFaturamento) => {
        const statusMap = {
            [EnumStatusFaturamento.Rascunho]: { label: "Rascunho", variant: "secondary" as const },
            [EnumStatusFaturamento.Emitido]: { label: "Emitido", variant: "outline" as const },
            [EnumStatusFaturamento.Pago]: { label: "Pago", variant: "default" as const },
            [EnumStatusFaturamento.Cancelado]: { label: "Cancelado", variant: "destructive" as const }
        };

        const statusInfo = statusMap[status] || { label: "Desconhecido", variant: "secondary" as const };

        return (
            <Badge variant={statusInfo.variant}>
                {statusInfo.label}
            </Badge>
        );
    };

    const formatCurrency = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    return (
        <Layout>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Faturamento</h1>
                    <p className="text-muted-foreground">Gerencie os pagamentos e faturamentos</p>
                </div>
                <Button onClick={() => navigate('/faturamento/novo')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Faturamento
                </Button>
            </div>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Faturado</p>
                                <p className="text-2xl font-bold">{formatCurrency(totalFaturamento)}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Valor Pago</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPago)}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pendente</p>
                                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPendente)}</p>
                            </div>
                            <Receipt className="h-8 w-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Taxa de Recebimento</p>
                                <p className="text-2xl font-bold">
                                    {stats.taxaRecebimento || (totalFaturamento > 0 ? Math.round((totalPago / totalFaturamento) * 100) : 0)}%
                                </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="busca">Buscar</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                                <Input
                                    id="busca"
                                    placeholder="Paciente ou serviço..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos os status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos</SelectItem>
                                    <SelectItem value="0">Rascunho</SelectItem>
                                    <SelectItem value="1">Emitido</SelectItem>
                                    <SelectItem value="2">Pago</SelectItem>
                                    <SelectItem value="3">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Data</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !filtroData && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {filtroData ? format(filtroData, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={filtroData}
                                        onSelect={setFiltroData}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>&nbsp;</Label>
                            <Button variant="outline" className="w-full">
                                <Download className="mr-2 h-4 w-4" />
                                Exportar
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabela de Faturamentos */}
            <Card>
                <CardHeader>
                    <CardTitle>Faturamentos</CardTitle>
                    <CardDescription>
                        Lista de todos os faturamentos e pagamentos
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Profissional</TableHead>
                                    <TableHead>Data Faturamento</TableHead>
                                    <TableHead>Valor Total</TableHead>
                                    <TableHead>Total Atendimentos</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Observações</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {faturamentosFiltrados.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.profissionalNome || "-"}</TableCell>
                                        <TableCell>
                                            {item.dataFaturamento ? (() => {
                                                try {
                                                    return format(new Date(item.dataFaturamento), "dd/MM/yyyy", { locale: ptBR });
                                                } catch (error) {
                                                    return item.dataFaturamento; // Fallback para mostrar a data original
                                                }
                                            })() : "-"}
                                        </TableCell>
                                        <TableCell className="font-medium">{formatCurrency(item.valorTotal)}</TableCell>
                                        <TableCell>{item.totalAtendimentos}</TableCell>
                                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                                        <TableCell>{item.observacoes || "-"}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Button variant="ghost" size="sm">
                                                    Ver Detalhes
                                                </Button>
                                                {item.status === EnumStatusFaturamento.Rascunho && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEmitirFaturamento(item.id)}
                                                    >
                                                        Emitir
                                                    </Button>
                                                )}
                                                {(item.status === EnumStatusFaturamento.Rascunho || item.status === EnumStatusFaturamento.Emitido) && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleCancelarFaturamento(item.id)}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </Layout>
    );
};

export default Faturamento;
