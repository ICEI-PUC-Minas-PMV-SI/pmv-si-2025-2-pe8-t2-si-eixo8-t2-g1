import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/Layout/Layout";
import CalendarView from "@/components/Scheduler/CalendarView";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  getAgendamentos,
  createAgendamento,
  updateAgendamento,
  getAgendamentoById,
} from "@/services/agendamentoService";
import { getPacientes } from "@/services/pacienteService";
import { getProfissionais } from "@/services/profissionalService";
import { AgendamentoDto, PacienteDto, ProfissionalDto, EnumTipoAtendimento } from "@/types/api";

const agendamentoSchema = z.object({
  pacienteId: z.string().nonempty({ message: "Paciente é obrigatório" }),
  profissionalId: z.string().nonempty({ message: "Profissional é obrigatório" }),
  dataHora: z.string().nonempty({ message: "Data e hora são obrigatórios" }),
  tipoAtendimento: z.nativeEnum(EnumTipoAtendimento),
  observacoes: z.string().optional(),
});

type AgendamentoFormData = z.infer<typeof agendamentoSchema>;

const Agendamento = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"new" | "edit">("new");
  const [agendamentos, setAgendamentos] = useState<AgendamentoDto[]>([]);
  const [pacientes, setPacientes] = useState<PacienteDto[]>([]);
  const [profissionais, setProfissionais] = useState<ProfissionalDto[]>([]);
  const [selectedAgendamento, setSelectedAgendamento] = useState<AgendamentoDto | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AgendamentoFormData>({
    resolver: zodResolver(agendamentoSchema),
  });

  const fetchData = async () => {
    try {
      const [agendamentosData, pacientesData, profissionaisData] = await Promise.all([
        getAgendamentos(),
        getPacientes(),
        getProfissionais(),
      ]);
      setAgendamentos(agendamentosData);
      setPacientes(pacientesData);
      setProfissionais(profissionaisData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao buscar dados",
        description: "Não foi possível buscar os dados necessários para a página.",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAppointmentClick = async (appointmentId: string | null, date: Date) => {
    if (appointmentId) {
      try {
        const agendamento = await getAgendamentoById(appointmentId);
        setSelectedAgendamento(agendamento);
        setDialogType("edit");
        reset(agendamento);
        setIsDialogOpen(true);
      } catch (error) {
        toast({ variant: "destructive", title: "Erro", description: "Agendamento não encontrado" });
      }
    } else {
      setDialogType("new");
      setSelectedAgendamento(null);
      reset({ pacienteId: '', profissionalId: '', dataHora: date.toISOString(), tipoAtendimento: EnumTipoAtendimento.CONSULTA, observacoes: '' });
      setIsDialogOpen(true);
    }
  };
  
  const onSubmit = async (data: AgendamentoFormData) => {
    try {
      if (dialogType === "new") {
        await createAgendamento(data);
        toast({ title: "Agendamento criado com sucesso" });
      } else if (selectedAgendamento) {
        await updateAgendamento({ ...selectedAgendamento, ...data });
        toast({ title: "Agendamento atualizado com sucesso" });
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar agendamento",
        description: "Não foi possível salvar os dados do agendamento.",
      });
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agendamento</h1>
          <p className="text-muted-foreground">Gerencie os agendamentos da clínica</p>
        </div>
        <Button onClick={() => handleAppointmentClick(null, new Date())}>
          Novo Agendamento
        </Button>
      </div>

      <CalendarView 
        appointments={agendamentos}
        professionals={profissionais}
        onAppointmentClick={handleAppointmentClick} 
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {dialogType === "new" ? "Novo Agendamento" : "Editar Agendamento"}
            </DialogTitle>
            <DialogDescription>
              {dialogType === "new" 
                ? "Preencha os dados para criar um novo agendamento" 
                : "Modifique os dados do agendamento existente"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="pacienteId" className="text-sm font-medium">Paciente</label>
              <Select onValueChange={(value) => setValue('pacienteId', value)} defaultValue={selectedAgendamento?.pacienteId}>
                <SelectTrigger><SelectValue placeholder="Selecione o paciente" /></SelectTrigger>
                <SelectContent>
                  {pacientes.map(p => <SelectItem key={p.id} value={p.id!}>{p.nomeCompleto}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.pacienteId && <p className="text-destructive">{errors.pacienteId.message}</p>}
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="profissionalId" className="text-sm font-medium">Profissional</label>
              <Select onValueChange={(value) => setValue('profissionalId', value)} defaultValue={selectedAgendamento?.profissionalId}>
                <SelectTrigger><SelectValue placeholder="Selecione o profissional" /></SelectTrigger>
                <SelectContent>
                  {profissionais.map(p => <SelectItem key={p.id} value={p.id!}>{p.nomeCompleto}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.profissionalId && <p className="text-destructive">{errors.profissionalId.message}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm font-medium">Data</label>
                <Input type="datetime-local" {...register("dataHora")} />
                {errors.dataHora && <p className="text-destructive">{errors.dataHora.message}</p>}
              </div>
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm font-medium">Tipo de Atendimento</label>
                <Select onValueChange={(value) => setValue('tipoAtendimento', Number(value) as EnumTipoAtendimento)} defaultValue={selectedAgendamento?.tipoAtendimento?.toString()}>
                  <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                  <SelectContent>
                    {Object.values(EnumTipoAtendimento).filter(v => typeof v === 'string').map((v, i) => <SelectItem key={i} value={i.toString()}>{v as string}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.tipoAtendimento && <p className="text-destructive">{errors.tipoAtendimento.message}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-medium">Observações</label>
              <Textarea placeholder="Adicione informações importantes sobre o agendamento" {...register("observacoes")} />
            </div>
          
            <DialogFooter>
              {dialogType === "edit" && (
                <Button variant="outline" className="mr-auto">Cancelar Agendamento</Button>
              )}
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Agendamento;