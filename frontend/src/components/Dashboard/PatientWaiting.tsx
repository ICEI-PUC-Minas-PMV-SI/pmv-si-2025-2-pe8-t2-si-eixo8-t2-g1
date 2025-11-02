
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

type WaitingPatient = {
  id: number;
  name: string;
  professional: string;
  arrivalTime: string;
  waitTime: string;
};

const waitingPatients: WaitingPatient[] = [
  {
    id: 1,
    name: "Roberto Ferreira",
    professional: "Dr. Marcos Oliveira",
    arrivalTime: "09:45",
    waitTime: "15 min"
  },
  {
    id: 2,
    name: "Camila Rodrigues",
    professional: "Dra. Carla Santos",
    arrivalTime: "10:15",
    waitTime: "5 min"
  }
];

const PatientWaiting = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Pacientes Aguardando</CardTitle>
      </CardHeader>
      <CardContent>
        {waitingPatients.length > 0 ? (
          <div className="space-y-4">
            {waitingPatients.map((patient) => (
              <div key={patient.id} className="flex justify-between items-center border-b border-border pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">{patient.professional}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                    <Clock size={14} />
                    <span>{patient.waitTime}</span>
                  </div>
                  <Button size="sm" className="bg-clinic-teal hover:bg-clinic-teal/90">
                    Iniciar Atendimento
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Nenhum paciente aguardando no momento
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientWaiting;
