import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search, UserPlus } from "lucide-react";
import { PacienteDto } from "@/types/api";

type PatientListProps = {
  patients: PacienteDto[];
  onAddPatient: () => void;
  onEditPatient: (patientId: string) => void;
};

const PatientList = ({ patients, onAddPatient, onEditPatient }: PatientListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPatients = patients.filter(
    patient => 
      (patient.nomeCompleto && patient.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.telefone && patient.telefone.includes(searchTerm))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Buscar paciente..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="w-full sm:w-auto" onClick={onAddPatient}>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Paciente
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.nomeCompleto}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.telefone}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditPatient(patient.id!)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>Ver histórico</DropdownMenuItem>
                        <DropdownMenuItem>Agendar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Inativar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  Nenhum paciente encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PatientList;