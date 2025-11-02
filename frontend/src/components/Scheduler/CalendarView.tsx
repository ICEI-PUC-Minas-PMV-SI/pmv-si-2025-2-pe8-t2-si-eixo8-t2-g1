import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AgendamentoDto, ProfissionalDto } from "@/types/api";

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // 8am to 5pm
const DAYS_OF_WEEK = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

type CalendarViewProps = {
  appointments: AgendamentoDto[];
  professionals: ProfissionalDto[];
  onAppointmentClick: (appointmentId: string | null, date: Date) => void;
};

const CalendarView = ({ appointments, professionals, onAppointmentClick }: CalendarViewProps) => {
  const [selectedProfessional, setSelectedProfessional] = useState("Todos");
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const getWeekDates = () => {
    const dates = [];
    const firstDayOfWeek = new Date(currentWeek);
    const dayOfWeek = firstDayOfWeek.getDay();
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - dayOfWeek);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDayOfWeek);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };
  
  const weekDates = getWeekDates();
  
  const changeWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };
  
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };
  
  const getAppointmentForSlot = (day: number, hour: number) => {
    const date = weekDates[day];
    return appointments.find(app => {
      const appDate = new Date(app.dataHora);
      return appDate.getFullYear() === date.getFullYear() &&
             appDate.getMonth() === date.getMonth() &&
             appDate.getDate() === date.getDate() &&
             appDate.getHours() === hour &&
             (selectedProfessional === "Todos" || app.profissionalId === selectedProfessional);
    });
  };

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => changeWeek('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="font-medium">
              {formatMonthYear(weekDates[0])}
            </span>
          </div>
          <Button variant="outline" size="icon" onClick={() => changeWeek('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="w-full sm:w-auto">
          <Select
            value={selectedProfessional}
            onValueChange={setSelectedProfessional}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Profissional" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              {professionals.map((prof) => (
                <SelectItem key={prof.id} value={prof.id!}>
                  {prof.nomeCompleto}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-[768px]">
          {/* Calendar header with days */}
          <div className="grid grid-cols-8 border-b">
            <div className="py-2 px-4 text-center font-medium text-muted-foreground"></div>
            {weekDates.map((date, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "py-2 px-4 text-center border-l",
                  date.toDateString() === new Date().toDateString() ? "bg-primary/10" : ""
                )}
              >
                <div className="font-medium">{DAYS_OF_WEEK[idx]}</div>
                <div className="text-sm text-muted-foreground">
                  {date.getDate().toString().padStart(2, '0')}/{(date.getMonth() + 1).toString().padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
          
          {/* Time slots */}
          <div>
            {HOURS.map((hour) => (
              <div key={hour} className="grid grid-cols-8 border-b">
                <div className="py-3 px-4 text-center text-sm text-muted-foreground border-r flex items-center justify-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {hour}:00
                </div>
                
                {Array.from({ length: 7 }, (_, day) => {
                  const appointment = getAppointmentForSlot(day, hour);
                  const date = new Date(weekDates[day]);
                  date.setHours(hour);

                  return (
                    <div 
                      key={day}
                      className={cn(
                        "p-1 min-h-16 border-l relative",
                        weekDates[day].toDateString() === new Date().toDateString() ? "bg-primary/10" : ""
                      )}
                      onClick={() => onAppointmentClick(appointment?.id || null, date)}
                    >
                      {appointment ? (
                        <div 
                          className={cn(
                            "h-full rounded p-1 text-xs cursor-pointer hover:opacity-80",
                            "bg-clinic-blue/10 text-clinic-blue dark:bg-clinic-blue/20"
                          )}
                        >
                          <div className="font-medium">{appointment.pacienteId}</div>
                          <div className="text-xs opacity-80">{appointment.profissionalId}</div>
                        </div>
                      ) : (
                        <div className="h-full rounded p-1 text-xs border border-dashed border-border cursor-pointer hover:bg-muted/50 flex items-center justify-center">
                          <span className="sr-only">Novo agendamento</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;