import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Appointment = {
  id: number;
  time: string;
  patientName: string;
  appointmentType: "Visita" | "Anamnese" | "Atendimento Externo" | "Sessão de Terapia" | "Reunião";
  status: "Agendado" | "Desmarcado" | "Cancelado";
};

interface EditAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

const EditAppointmentDialog = ({ isOpen, onClose, appointment }: EditAppointmentDialogProps) => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState(appointment?.time || "");

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar as alterações
    console.log("Salvando alterações do agendamento:", appointment?.id);
    onClose();
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Agendamento</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Paciente</Label>
            <Input value={appointment.patientName} disabled />
          </div>
          <div className="space-y-2">
            <Label>Tipo de Atendimento</Label>
            <Input value={appointment.appointmentType} disabled />
          </div>
          <div className="space-y-2">
            <Label>Nova Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy") : <span>Selecionar data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Novo Horário</Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAppointmentDialog;