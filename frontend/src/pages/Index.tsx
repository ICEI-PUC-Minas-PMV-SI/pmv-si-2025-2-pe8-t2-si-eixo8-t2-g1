
import Layout from "@/components/Layout/Layout";
import AppointmentOverview from "@/components/Dashboard/AppointmentOverview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Activity, Users, ClipboardCheck } from "lucide-react";

const Index = () => {
  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Painel Inicial</h1>
        <p className="text-sm text-muted-foreground">Hoje é {today}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Agendamentos Hoje</p>
              <p className="text-2xl font-bold text-card-foreground">12</p>
            </div>
            <div className="p-2 rounded-full bg-clinic-blue/10">
              <CalendarDays className="h-6 w-6 text-clinic-blue" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Atendimentos Realizados</p>
              <p className="text-2xl font-bold text-card-foreground">5</p>
            </div>
            <div className="p-2 rounded-full bg-clinic-green/10">
              <ClipboardCheck className="h-6 w-6 text-clinic-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pacientes Ativos</p>
              <p className="text-2xl font-bold text-card-foreground">142</p>
            </div>
            <div className="p-2 rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Progresso do Dia</p>
              <p className="text-2xl font-bold text-card-foreground">78%</p>
            </div>
            <div className="p-2 rounded-full bg-clinic-yellow/10">
              <Activity className="h-6 w-6 text-clinic-yellow" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AppointmentOverview />
      </div>
    </Layout>
  );
};

export default Index;
