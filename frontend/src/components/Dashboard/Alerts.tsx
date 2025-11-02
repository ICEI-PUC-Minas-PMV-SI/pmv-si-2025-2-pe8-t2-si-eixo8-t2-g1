
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertTriangle, CreditCard, FileWarning } from "lucide-react";

type Alert = {
  id: number;
  type: "invoice" | "document" | "appointment";
  message: string;
  severity: "high" | "medium" | "low";
};

const alerts: Alert[] = [
  {
    id: 1,
    type: "invoice",
    message: "3 faturas vencidas precisam de atenção",
    severity: "high"
  },
  {
    id: 2,
    type: "document",
    message: "5 documentos pendentes de pacientes",
    severity: "medium"
  },
  {
    id: 3,
    type: "appointment",
    message: "2 confirmações de agendamento pendentes",
    severity: "low"
  }
];

const getAlertIcon = (type: Alert["type"]) => {
  switch (type) {
    case "invoice":
      return <CreditCard className="h-5 w-5" />;
    case "document":
      return <FileWarning className="h-5 w-5" />;
    case "appointment":
      return <AlertTriangle className="h-5 w-5" />;
    default:
      return <AlertTriangle className="h-5 w-5" />;
  }
};

const getSeverityClass = (severity: Alert["severity"]) => {
  switch (severity) {
    case "high":
      return "bg-clinic-red/10 text-clinic-red dark:bg-clinic-red/20";
    case "medium":
      return "bg-clinic-yellow/10 text-clinic-yellow dark:bg-clinic-yellow/20";
    case "low":
      return "bg-clinic-blue/10 text-clinic-blue dark:bg-clinic-blue/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const Alerts = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Alertas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-md",
                getSeverityClass(alert.severity)
              )}
            >
              {getAlertIcon(alert.type)}
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Alerts;
