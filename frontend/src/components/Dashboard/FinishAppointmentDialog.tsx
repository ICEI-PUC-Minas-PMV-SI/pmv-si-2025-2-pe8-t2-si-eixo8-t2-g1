import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

type Appointment = {
  id: number;
  time: string;
  patientName: string;
  appointmentType: "Visita" | "Anamnese" | "Atendimento Externo" | "Sessão de Terapia" | "Reunião";
  status: "Agendado" | "Desmarcado" | "Cancelado";
};

interface FinishAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

const statusOptions = [
  { value: "Agendado", label: "Agendado" },
  { value: "Desmarcado com Antecedência", label: "Desmarcado com Antecedência" },
  { value: "Desmarcado sem Antecedência", label: "Desmarcado sem Antecedência" },
  { value: "Cancelado", label: "Cancelado" }
];

const FinishAppointmentDialog = ({ isOpen, onClose, appointment }: FinishAppointmentDialogProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const handleConfirm = () => {
    // Aqui você implementaria a lógica para finalizar o agendamento
    console.log("Finalizando agendamento:", appointment?.id, "com status:", selectedStatus);
    onClose();
    setSelectedStatus("");
  };

  const handleCancel = () => {
    onClose();
    setSelectedStatus("");
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Finalizar Atendimento</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Paciente</Label>
            <div className="p-2 border rounded-md bg-muted">
              {appointment.patientName}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Horário</Label>
            <div className="p-2 border rounded-md bg-muted">
              {appointment.time}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status do Atendimento</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedStatus}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FinishAppointmentDialog;