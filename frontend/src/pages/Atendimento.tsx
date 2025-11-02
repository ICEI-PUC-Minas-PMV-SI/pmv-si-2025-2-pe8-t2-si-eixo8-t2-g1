import { useState } from "react";
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
import { Calendar, Clock } from "lucide-react";

type Appointment = {
  id: number;
  time: string;
  patientName: string;
  local: string;
  tipoAtendimento: string;
  status: "Agendado" | "Chegou" | "Em Atendimento" | "Finalizado" | "Faltou" | "Desmarcado" | "Atendido";
};

const appointments: Appointment[] = [
  {
    id: 1,
    time: "09:00",
    patientName: "Ana Silva",
    local: "Consultório 1",
    tipoAtendimento: "Psicologia",
    status: "Agendado"
  },
  {
    id: 2,
    time: "10:00",
    patientName: "Roberto Ferreira",
    local: "Consultório 2",
    tipoAtendimento: "Fisioterapia",
    status: "Chegou"
  },
  {
    id: 3,
    time: "11:00",
    patientName: "Juliana Martins",
    local: "Consultório 1",
    tipoAtendimento: "Psicologia",
    status: "Em Atendimento"
  },
  {
    id: 4,
    time: "13:30",
    patientName: "Pedro Costa",
    local: "Consultório 3",
    tipoAtendimento: "Nutrição",
    status: "Agendado"
  },
  {
    id: 5,
    time: "15:00",
    patientName: "Maria Souza",
    local: "Consultório 1",
    tipoAtendimento: "Psicologia",
    status: "Agendado"
  }
];

const getStatusBadge = (status: Appointment["status"]) => {
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
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

const Atendimento = () => {
  const [selectedAppointments, setSelectedAppointments] = useState<number[]>([]);
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const [batchAction, setBatchAction] = useState<string>("");
  const [batchReason, setBatchReason] = useState<string>("");
  const [batchNotes, setBatchNotes] = useState<string>("");
  const [appointmentStatuses, setAppointmentStatuses] = useState<Record<number, Appointment["status"]>>(
    appointments.reduce((acc, apt) => ({ ...acc, [apt.id]: apt.status }), {})
  );

  const handleCheckboxChange = (appointmentId: number, checked: boolean) => {
    if (checked) {
      setSelectedAppointments(prev => [...prev, appointmentId]);
    } else {
      setSelectedAppointments(prev => prev.filter(id => id !== appointmentId));
    }
  };

  const handleFinalizarClick = () => {
    setShowBatchDialog(true);
  };

  const handleBatchSubmit = () => {
    const newStatuses = { ...appointmentStatuses };
    
    selectedAppointments.forEach(id => {
      if (batchAction === "Atendido") {
        newStatuses[id] = "Atendido";
      } else if (batchAction === "Desmarcado") {
        newStatuses[id] = "Desmarcado";
      } else if (batchAction === "Falta") {
        newStatuses[id] = "Faltou";
      }
    });

    setAppointmentStatuses(newStatuses);
    setSelectedAppointments([]);
    setShowBatchDialog(false);
    setBatchAction("");
    setBatchReason("");
    setBatchNotes("");
  };

  const getSelectedAppointments = () => {
    return appointments.filter(apt => selectedAppointments.includes(apt.id));
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Atendimento</h1>
        <p className="text-sm text-muted-foreground">Gerenciamento dos atendimentos do dia</p>
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
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedAppointments.includes(appointment.id)}
                      onCheckedChange={(checked) => handleCheckboxChange(appointment.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-xs sm:text-sm">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                      {appointment.time}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">{appointment.patientName}</TableCell>
                  <TableCell className="text-xs sm:text-sm">{appointment.local}</TableCell>
                  <TableCell className="text-xs sm:text-sm">{appointment.tipoAtendimento}</TableCell>
                  <TableCell>{getStatusBadge(appointmentStatuses[appointment.id] || appointment.status)}</TableCell>
                </TableRow>
              ))}
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
                      <span className="font-medium">{apt.patientName}</span>
                      <span className="text-sm text-muted-foreground">{apt.time}</span>
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
    </Layout>
  );
};

export default Atendimento;