
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit, CheckCircle } from "lucide-react";
import { useState } from "react";
import EditAppointmentDialog from "./EditAppointmentDialog";
import FinishAppointmentDialog from "./FinishAppointmentDialog";

type Appointment = {
  id: number;
  time: string;
  patientName: string;
  appointmentType: "Visita" | "Anamnese" | "Atendimento Externo" | "Sessão de Terapia" | "Reunião";
  status: "Agendado" | "Desmarcado" | "Cancelado";
};

const appointments: Appointment[] = [
  {
    id: 1,
    time: "09:00",
    patientName: "Ana Silva",
    appointmentType: "Visita",
    status: "Agendado"
  },
  {
    id: 2,
    time: "10:00",
    patientName: "Roberto Ferreira",
    appointmentType: "Anamnese",
    status: "Desmarcado"
  },
  {
    id: 3,
    time: "11:00",
    patientName: "Juliana Martins",
    appointmentType: "Sessão de Terapia",
    status: "Cancelado"
  },
  {
    id: 4,
    time: "13:30",
    patientName: "Pedro Costa",
    appointmentType: "Atendimento Externo",
    status: "Desmarcado"
  },
  {
    id: 5,
    time: "15:00",
    patientName: "Maria Souza",
    appointmentType: "Reunião",
    status: "Agendado"
  }
];

const getStatusClass = (status: Appointment["status"]): string => {
  switch (status) {
    case "Agendado":
      return "status-agendado";
    case "Desmarcado":
      return "status-desmarcado";
    case "Cancelado":
      return "status-cancelado";
    default:
      return "";
  }
};

const AppointmentOverview = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Filtrar apenas agendamentos com status "Agendado"
  const scheduledAppointments = appointments.filter(appointment => appointment.status === "Agendado");

  const handleEditClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setEditDialogOpen(true);
  };

  const handleFinishClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setFinishDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Próximos Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledAppointments.map((appointment) => (
            <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0 gap-3">
              <div className="flex items-center gap-4 flex-1">
                <div className="text-center min-w-14">
                  <span className="font-bold text-primary">{appointment.time}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{appointment.patientName}</p>
                  <p className="text-sm text-muted-foreground">{appointment.appointmentType}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:ml-4">
                <Button size="sm" variant="outline" onClick={() => handleEditClick(appointment)} className="w-full sm:w-auto">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar Data
                </Button>
                <Button size="sm" variant="default" onClick={() => handleFinishClick(appointment)} className="w-full sm:w-auto">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Finalizar
                </Button>
              </div>
            </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <EditAppointmentDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        appointment={selectedAppointment}
      />

      <FinishAppointmentDialog
        isOpen={finishDialogOpen}
        onClose={() => setFinishDialogOpen(false)}
        appointment={selectedAppointment}
      />
    </>
  );
};

export default AppointmentOverview;
