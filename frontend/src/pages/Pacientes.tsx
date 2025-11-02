import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/Layout/Layout";
import PatientList from "@/components/Patients/PatientList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  getPacientes,
  createPaciente,
  updatePaciente,
  getPacienteById,
} from "@/services/pacienteService";
import { PacienteDto } from "@/types/api";

const pacienteSchema = z.object({
  nomeCompleto: z.string().nonempty({ message: "Nome é obrigatório" }),
  dataNascimento: z.string().nonempty({ message: "Data de nascimento é obrigatória" }),
  telefone: z.string().nonempty({ message: "Telefone é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
});

type PacienteFormData = z.infer<typeof pacienteSchema>;

const Pacientes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"new" | "edit">("new");
  const [patients, setPatients] = useState<PacienteDto[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PacienteDto | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PacienteFormData>({
    resolver: zodResolver(pacienteSchema),
  });

  const fetchPatients = async () => {
    try {
      const data = await getPacientes();
      setPatients(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao buscar pacientes",
        description: "Não foi possível buscar a lista de pacientes.",
      });
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddPatient = () => {
    setDialogType("new");
    setSelectedPatient(null);
    reset({ nomeCompleto: '', dataNascimento: '', telefone: '', email: '' });
    setIsDialogOpen(true);
  };

  const handleEditPatient = async (patientId: string) => {
    try {
      const patient = await getPacienteById(patientId);
      setSelectedPatient(patient);
      setDialogType("edit");
      reset(patient);
      setIsDialogOpen(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao buscar paciente",
        description: "Não foi possível buscar os dados do paciente.",
      });
    }
  };

  const onSubmit = async (data: PacienteFormData) => {
    try {
      const dataToSend = {
        ...data,
        dataNascimento: data.dataNascimento ? new Date(data.dataNascimento + 'T00:00:00Z').toISOString() : data.dataNascimento
      };

      if (dialogType === "new") {
        await createPaciente(dataToSend);
        toast({ title: "Paciente criado com sucesso" });
      } else if (selectedPatient) {
        await updatePaciente({ ...selectedPatient, ...dataToSend });
        toast({ title: "Paciente atualizado com sucesso" });
      }
      setIsDialogOpen(false);
      fetchPatients();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar paciente",
        description: "Não foi possível salvar os dados do paciente.",
      });
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Pacientes</h1>
        <p className="text-muted-foreground">Gerencie os pacientes da clínica</p>
      </div>

      <PatientList
        patients={patients}
        onAddPatient={handleAddPatient}
        onEditPatient={handleEditPatient}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>
              {dialogType === "new" ? "Novo Paciente" : "Editar Paciente"}
            </DialogTitle>
            <DialogDescription>
              {dialogType === "new"
                ? "Preencha os dados para cadastrar um novo paciente"
                : "Modifique os dados do paciente"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nomeCompleto">Nome Completo</Label>
                <Input id="nomeCompleto" {...register("nomeCompleto")} />
                {errors.nomeCompleto && <p className="text-destructive">{errors.nomeCompleto.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input id="dataNascimento" type="date" {...register("dataNascimento")} />
                {errors.dataNascimento && <p className="text-destructive">{errors.dataNascimento.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" {...register("telefone")} />
                {errors.telefone && <p className="text-destructive">{errors.telefone.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-destructive">{errors.email.message}</p>}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Pacientes;