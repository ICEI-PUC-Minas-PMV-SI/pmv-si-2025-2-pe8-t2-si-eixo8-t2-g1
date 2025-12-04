import { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Role, PerfilDto, PacienteDto, AgendamentoDto, EnumTipoAtendimento } from "@/types/api";
import { getPerfis, getMeuPerfil } from "@/services/profissionalService";
import { getPacientes } from "@/services/pacienteService";
import { getAgendamentos, createAgendamento, updateAgendamento } from "@/services/agendamentoService";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const getStatusBadge = (status: string | undefined) => {
  switch (status) {
    case "Agendado":
      return <Badge variant="outline" className="bg-clinic-blue/10 text-clinic-blue dark:bg-clinic-blue/20 hover:bg-clinic-blue/10">Agendado</Badge>;
    case "Chegou":
      return <Badge variant="outline" className="bg-clinic-yellow/10 text-clinic-yellow dark:bg-clinic-yellow/20 hover:bg-clinic-yellow/10">Chegou</Badge>;
    case "Em Atendimento":
      return <Badge variant="outline" className="bg-primary/10 text-primary dark:bg-primary/20 hover:bg-primary/10">Em Atendimento</Badge>;
    case "Finalizado":
      return <Badge variant="outline" className="bg-clinic-green/10 text-clinic-green dark:bg-clinic-green/20 hover:bg-clinic-green/10">Finalizado</Badge>;
    case "Atendido":
      return <Badge variant="outline" className="bg-clinic-green/10 text-clinic-green dark:bg-clinic-green/20 hover:bg-clinic-green/10">Atendido</Badge>;
    case "Faltou":
      return <Badge variant="outline" className="bg-clinic-red/10 text-clinic-red dark:bg-clinic-red/20 hover:bg-clinic-red/10">Faltou</Badge>;
    case "Desmarcado":
      return <Badge variant="outline" className="bg-muted text-muted-foreground hover:bg-muted">Desmarcado</Badge>;
    default:
      return <Badge variant="outline">{status || "Desconhecido"}</Badge>;
  }
};

const getTipoAtendimentoLabel = (tipo: EnumTipoAtendimento | undefined) => {
  switch (tipo) {
    case EnumTipoAtendimento.Visita: return "Visita";
    case EnumTipoAtendimento.Anamnese: return "Anamnese";
    case EnumTipoAtendimento.AtendimentoExterno: return "Atendimento Externo";
    case EnumTipoAtendimento.SessaoTerapia: return "Sessão Terapia";
    case EnumTipoAtendimento.Reuniao: return "Reunião";
    default: return "Outro";
  }
};

const Atendimento = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointmentsList, setAppointmentsList] = useState<AgendamentoDto[]>([]);
  const [profissionais, setProfissionais] = useState<PerfilDto[]>([]);
  const [pacientes, setPacientes] = useState<PacienteDto[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [meuPerfil, setMeuPerfil] = useState<PerfilDto | null>(null);

  // New Appointment State
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState<{
    patientId: string;
    perfilId: string;
    time: string;
    tipoAtendimento: string;
    local: string;
  }>({
    patientId: "",
    perfilId: "",
    time: "",
    tipoAtendimento: EnumTipoAtendimento.SessaoTerapia.toString(),
    local: "Consultório 1"
  });

  // Batch Action State
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const [batchAction, setBatchAction] = useState<string>("");
  const [batchReason, setBatchReason] = useState<string>("");
  const [batchNotes, setBatchNotes] = useState<string>("");

  const fetchAppointments = async () => {
    try {
      const data = await getAgendamentos();
      setAppointmentsList(data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao buscar agendamentos."
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const pacientesData = await getPacientes();
        setPacientes(pacientesData);

        if (user?.role === Role.Gerencia) {
          const profissionaisData = await getPerfis();
          const filteredProfissionais = profissionaisData.filter(p => p.tipo !== 'ger');
          setProfissionais(filteredProfissionais);
        } else if (user?.role === Role.Profissional) {
          const perfil = await getMeuPerfil();
          setMeuPerfil(perfil);
        }

        await fetchAppointments();
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao carregar dados iniciais."
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user, toast]);

  const handleCreateAppointment = async () => {
    try {
      if (user?.role === Role.Gerencia && !newAppointment.perfilId) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Selecione um profissional."
        });
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const dataHora = `${today}T${newAppointment.time}:00Z`;

      const agendamento: AgendamentoDto = {
        pacienteId: newAppointment.patientId,
        perfilId: newAppointment.perfilId || meuPerfil?.id,
        dataHora: dataHora,
        tipoAtendimento: parseInt(newAppointment.tipoAtendimento) as EnumTipoAtendimento,
        status: "Agendado",
        observacoes: newAppointment.local // Using observacoes for local for now
      };

      console.log("Creating appointment with data:", agendamento);
      await createAgendamento(agendamento);

      setIsNewAppointmentOpen(false);
      setNewAppointment({
        patientId: "",
        perfilId: "",
        time: "",
        tipoAtendimento: EnumTipoAtendimento.SessaoTerapia.toString(),
        local: "Consultório 1"
      });
      toast({ title: "Atendimento criado com sucesso!" });
      fetchAppointments();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao criar atendimento."
      });
    }
  };

  const filteredAppointments = appointmentsList.filter(apt => {
    if (user?.role === Role.Gerencia) return true;
    if (user?.role === Role.Profissional && meuPerfil) {
      return !apt.perfilId || apt.perfilId === meuPerfil.id;
    }
    return true;
  });

  const handleCheckboxChange = (appointmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedAppointments(prev => [...prev, appointmentId]);
    } else {
      setSelectedAppointments(prev => prev.filter(id => id !== appointmentId));
    }
  };

  const handleFinalizarClick = () => {
    setShowBatchDialog(true);
  };

  const handleBatchSubmit = async () => {
    try {
      const promises = selectedAppointments.map(async (id) => {
        const appointment = appointmentsList.find(a => a.id === id);
        if (appointment) {
          let newStatus = appointment.status;
          let observacoes = appointment.observacoes;

          if (batchAction === "Atendido") {
            newStatus = "Atendido";
          } else if (batchAction === "Desmarcado") {
            newStatus = "Desmarcado";
            observacoes = `${observacoes || ''} | Motivo: ${batchReason} ${batchNotes ? '- ' + batchNotes : ''}`;
          } else if (batchAction === "Falta") {
            newStatus = "Faltou";
            observacoes = `${observacoes || ''} | Motivo: ${batchReason} ${batchNotes ? '- ' + batchNotes : ''}`;
          }

          return updateAgendamento({
            ...appointment,
            status: newStatus,
            observacoes: observacoes
          });
        }
        return Promise.resolve();
      });

      await Promise.all(promises);

      setSelectedAppointments([]);
      setShowBatchDialog(false);
      setBatchAction("");
      setBatchReason("");
      setBatchNotes("");
      toast({ title: "Atendimentos atualizados com sucesso!" });
      fetchAppointments();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao atualizar atendimentos."
      });
    }
  };

  const getSelectedAppointments = () => {
    return appointmentsList.filter(apt => apt.id && selectedAppointments.includes(apt.id));
  };

  const getPatientName = (id: string | undefined) => {
    if (!id) return "Desconhecido";
    const patient = pacientes.find(p => p.id === id);
    return patient ? patient.nomeCompleto : "Desconhecido";
  };

  const formatTime = (dataHora: string | undefined) => {
    if (!dataHora) return "--:--";
    try {
      return new Date(dataHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dataHora;
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Atendimento</h1>
          <p className="text-sm text-muted-foreground">Gerenciamento dos atendimentos do dia</p>
        </div>
        <Button onClick={() => setIsNewAppointmentOpen(true)} className="bg-primary">
          <Plus className="mr-2 h-4 w-4" />
          Novo Atendimento
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-lg overflow-hidden bg-card">
          <div className="p-3 sm:p-4 border-b flex items-center gap-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-clinic-teal" />
            <h2 className="text-sm sm:text-base font-semibold">Atendimentos de Hoje</h2>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[80px] sm:w-[100px] text-xs sm:text-sm">Horário</TableHead>
                  <TableHead className="text-xs sm:text-sm">Paciente</TableHead>
                  <TableHead className="text-xs sm:text-sm">Local</TableHead>
                  <TableHead className="text-xs sm:text-sm">Tipo de Atendimento</TableHead>
                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <Checkbox
                        checked={appointment.id ? selectedAppointments.includes(appointment.id) : false}
                        onCheckedChange={(checked) => appointment.id && handleCheckboxChange(appointment.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-xs sm:text-sm">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                        {formatTime(appointment.dataHora)}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">{getPatientName(appointment.pacienteId)}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{appointment.observacoes || "Consultório 1"}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{getTipoAtendimentoLabel(appointment.tipoAtendimento)}</TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  </TableRow>
                ))}
                {filteredAppointments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                      Nenhum atendimento encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleFinalizarClick}
            disabled={selectedAppointments.length === 0}
            className="bg-clinic-teal hover:bg-clinic-teal/90 w-full sm:w-auto"
          >
            Finalizar ({selectedAppointments.length})
          </Button>
        </div>
      </div>

      <Dialog open={showBatchDialog} onOpenChange={setShowBatchDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Finalizar Atendimentos</DialogTitle>
            <DialogDescription>
              Selecione a ação para os atendimentos selecionados
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Atendimentos Selecionados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getSelectedAppointments().map(apt => (
                    <div key={apt.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <span className="font-medium">{getPatientName(apt.pacienteId)}</span>
                      <span className="text-sm text-muted-foreground">{formatTime(apt.dataHora)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid w-full gap-1.5">
              <label className="text-sm font-medium">Ação Desejada</label>
              <Select value={batchAction} onValueChange={setBatchAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Atendido">Atendido</SelectItem>
                  <SelectItem value="Desmarcado">Desmarcado</SelectItem>
                  <SelectItem value="Falta">Falta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(batchAction === "Desmarcado" || batchAction === "Falta") && (
              <div className="grid w-full gap-1.5">
                <label className="text-sm font-medium">Motivo</label>
                <Select value={batchReason} onValueChange={setBatchReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sem Notificação Prévia">Sem Notificação Prévia</SelectItem>
                    <SelectItem value="Problema de Saúde">Problema de Saúde</SelectItem>
                    <SelectItem value="Problema de Transporte">Problema de Transporte</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {batchReason === "Outros" && (
              <div className="grid w-full gap-1.5">
                <label className="text-sm font-medium">Especifique o motivo</label>
                <Textarea
                  value={batchNotes}
                  onChange={(e) => setBatchNotes(e.target.value)}
                  placeholder="Descreva o motivo..."
                />
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowBatchDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleBatchSubmit}
              disabled={!batchAction || ((batchAction === "Desmarcado" || batchAction === "Falta") && !batchReason)}
              className="w-full sm:w-auto"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Atendimento</DialogTitle>
            <DialogDescription>Preencha os dados do novo atendimento.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="patient">Paciente</Label>
              <Select
                value={newAppointment.patientId}
                onValueChange={(val) => setNewAppointment({ ...newAppointment, patientId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>
                <SelectContent>
                  {pacientes.map(p => (
                    <SelectItem key={p.id} value={p.id!}>{p.nomeCompleto}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {user?.role === Role.Gerencia && (
              <div className="grid gap-2">
                <Label htmlFor="professional">Profissional</Label>
                <Select
                  value={newAppointment.perfilId}
                  onValueChange={(val) => setNewAppointment({ ...newAppointment, perfilId: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {profissionais.map(p => (
                      <SelectItem key={p.id} value={p.id!}>{p.nomeCompleto}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="time">Horário</Label>
              <Input
                id="time"
                type="time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={newAppointment.tipoAtendimento}
                onValueChange={(val) => setNewAppointment({ ...newAppointment, tipoAtendimento: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EnumTipoAtendimento.SessaoTerapia.toString()}>Sessão Terapia</SelectItem>
                  <SelectItem value={EnumTipoAtendimento.Visita.toString()}>Visita</SelectItem>
                  <SelectItem value={EnumTipoAtendimento.Anamnese.toString()}>Anamnese</SelectItem>
                  <SelectItem value={EnumTipoAtendimento.AtendimentoExterno.toString()}>Atendimento Externo</SelectItem>
                  <SelectItem value={EnumTipoAtendimento.Reuniao.toString()}>Reunião</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewAppointmentOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateAppointment}>Criar Atendimento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Atendimento;