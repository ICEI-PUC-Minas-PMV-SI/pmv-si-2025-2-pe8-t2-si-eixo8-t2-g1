import { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { FileText, Upload, Sparkles, Calendar, User, Clock, Eye, Edit, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface PendingDocument {
  id: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  status: "pending" | "completed";
  documentType: "evolution" | "report";
}

interface SavedDocument {
  id: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  evolutionText: string;
  nextSteps: string;
  attachments: string[];
  createdAt: string;
}

// Mock data for pending documents
const mockPendingDocuments: PendingDocument[] = [
  {
    id: "1",
    patientName: "Maria Silva",
    appointmentDate: "2024-01-15",
    appointmentTime: "09:00",
    appointmentType: "Fisioterapia",
    status: "pending",
    documentType: "evolution"
  },
  {
    id: "2",
    patientName: "João Santos",
    appointmentDate: "2024-01-15",
    appointmentTime: "10:30",
    appointmentType: "Fonoaudiologia",
    status: "pending",
    documentType: "evolution"
  },
  {
    id: "3",
    patientName: "Ana Costa",
    appointmentDate: "2024-01-14",
    appointmentTime: "14:00",
    appointmentType: "Terapia Ocupacional",
    status: "pending",
    documentType: "report"
  }
];

const Documentos = () => {
  const [pendingDocuments, setPendingDocuments] = useState<PendingDocument[]>(mockPendingDocuments);
  const [savedDocuments, setSavedDocuments] = useState<SavedDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<PendingDocument | null>(null);
  const [viewDocument, setViewDocument] = useState<SavedDocument | null>(null);
  const [editDocument, setEditDocument] = useState<SavedDocument | null>(null);
  const [evolutionText, setEvolutionText] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { token } = useAuth();

  // Fetch documents from API (placeholder for now)
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!token) return;

      try {
        // Placeholder: Em produção, buscar documentos da API
        // const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Documents`, {
        //   headers: {
        //     "Authorization": `Bearer ${token}`
        //   }
        // });
        // const data = await response.json();
        // setSavedDocuments(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, [token]);

  // Filter and sort documents
  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = savedDocuments;

    // Filter by patient name
    if (searchTerm.trim()) {
      filtered = filtered.filter(doc => 
        doc.patientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by date (descending)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [savedDocuments, searchTerm]);

  const handleGenerateAIEvolution = async () => {
    if (!evolutionText.trim()) {
      toast({
        title: "Erro",
        description: "Digite algumas palavras-chave antes de gerar a evolução com IA",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingAI(true);
    
    try {
      // Simulate AI generation - in real implementation, this would call the AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiGeneratedText = `
EVOLUÇÃO CLÍNICA

Baseado nas palavras-chave fornecidas: "${evolutionText}"

OBSERVAÇÕES DA SESSÃO:
O paciente apresentou boa participação durante a sessão. Foram observados progressos significativos nas atividades propostas, demonstrando maior coordenação e precisão nos movimentos. A motivação manteve-se elevada ao longo do atendimento.

OBJETIVOS TRABALHADOS:
- Fortalecimento muscular
- Coordenação motora
- Equilíbrio postural
- Funcionalidade nas atividades de vida diária

RESPOSTA AO TRATAMENTO:
Paciente respondeu positivamente às intervenções propostas, apresentando melhora gradual na execução das tarefas. Demonstrou compreensão das orientações e execução adequada dos exercícios.

ORIENTAÇÕES:
Continuidade do protocolo estabelecido com progressão gradual das atividades conforme tolerância e evolução apresentada.
      `.trim();
      
      setEvolutionText(aiGeneratedText);
      
      toast({
        title: "Sucesso",
        description: "Evolução gerada com IA com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar evolução com IA",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "Arquivo Selecionado",
        description: `${file.name} foi selecionado para anexo`
      });
    }
  };

  const handleSaveDocument = () => {
    if (!selectedDocument) return;

    if (!evolutionText.trim()) {
      toast({
        title: "Erro",
        description: "A evolução não pode estar vazia",
        variant: "destructive"
      });
      return;
    }

    // Create saved document
    const newSavedDocument: SavedDocument = {
      id: selectedDocument.id + "-saved",
      patientName: selectedDocument.patientName,
      appointmentDate: selectedDocument.appointmentDate,
      appointmentTime: selectedDocument.appointmentTime,
      appointmentType: selectedDocument.appointmentType,
      evolutionText,
      nextSteps,
      attachments: selectedFile ? [selectedFile.name] : [],
      createdAt: new Date().toISOString()
    };

    setSavedDocuments(prev => [...prev, newSavedDocument]);

    // Update document status
    setPendingDocuments(prev => 
      prev.map(doc => 
        doc.id === selectedDocument.id 
          ? { ...doc, status: "completed" as const }
          : doc
      )
    );

    toast({
      title: "Documento Salvo",
      description: "Evolução salva com sucesso!"
    });

    // Reset form
    setSelectedDocument(null);
    setEvolutionText("");
    setNextSteps("");
    setSelectedFile(null);
  };

  const handleEditSave = () => {
    if (!editDocument) return;

    setSavedDocuments(prev => 
      prev.map(doc => 
        doc.id === editDocument.id 
          ? editDocument
          : doc
      )
    );

    toast({
      title: "Documento Atualizado",
      description: "Alterações salvas com sucesso!"
    });

    setEditDocument(null);
  };

  const getStatusBadge = (status: PendingDocument["status"]) => {
    if (status === "pending") {
      return <Badge variant="destructive">Pendente</Badge>;
    }
    return <Badge variant="default">Concluído</Badge>;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Documentos</h1>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {pendingDocuments.filter(doc => doc.status === "pending").length} pendentes
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Documentos Pendentes por Paciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 gap-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm sm:text-base">{document.patientName}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{document.appointmentDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{document.appointmentTime}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{document.appointmentType}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(document.status)}
                    {document.status === "pending" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => setSelectedDocument(document)}
                            className="w-full sm:w-auto"
                          >
                            Criar Documento
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Documento de Evolução - {document.patientName}
                            </DialogTitle>
                          </DialogHeader>
                          
                          <Tabs defaultValue="evolution" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="evolution">Evolução</TabsTrigger>
                              <TabsTrigger value="attachments">Anexos</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="evolution" className="space-y-4">
                              <div className="grid gap-4">
                                <div>
                                  <Label htmlFor="evolution">Evolução/Notas da Sessão</Label>
                                  <div className="flex gap-2 mt-1">
                                    <Textarea
                                      id="evolution"
                                      placeholder="Digite as observações da sessão ou palavras-chave para gerar com IA..."
                                      value={evolutionText}
                                      onChange={(e) => setEvolutionText(e.target.value)}
                                      rows={8}
                                      className="flex-1"
                                    />
                                  </div>
                                   <Button
                                     variant="outline"
                                     onClick={handleGenerateAIEvolution}
                                     disabled={isGeneratingAI}
                                     className="mt-2 w-full sm:w-auto"
                                   >
                                     <Sparkles className="h-4 w-4 mr-2" />
                                     {isGeneratingAI ? "Gerando..." : "Gerar com IA"}
                                   </Button>
                                </div>
                                
                                <div>
                                  <Label htmlFor="next-steps">Próximos Passos</Label>
                                  <Textarea
                                    id="next-steps"
                                    placeholder="Descreva os próximos passos do tratamento..."
                                    value={nextSteps}
                                    onChange={(e) => setNextSteps(e.target.value)}
                                    rows={4}
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="attachments" className="space-y-4">
                              <div>
                                <Label htmlFor="file-upload">Anexar Documento</Label>
                                <div className="mt-1">
                                  <Input
                                    id="file-upload"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                  />
                                </div>
                                {selectedFile && (
                                  <div className="mt-2 p-2 bg-muted rounded flex items-center gap-2">
                                    <Upload className="h-4 w-4" />
                                    <span className="text-sm">{selectedFile.name}</span>
                                  </div>
                                )}
                              </div>
                            </TabsContent>
                          </Tabs>
                          
                          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
                            <Button 
                              variant="outline" 
                              onClick={() => setSelectedDocument(null)}
                              className="w-full sm:w-auto"
                            >
                              Cancelar
                            </Button>
                            <Button 
                              onClick={handleSaveDocument}
                              className="w-full sm:w-auto"
                            >
                              Salvar Documento
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              ))}
              
              {pendingDocuments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum documento pendente encontrado.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Saved Documents Section */}
        {savedDocuments.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle>Documentos Salvos</CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Buscar por paciente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAndSortedDocuments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "Nenhum documento encontrado para esta busca." : "Nenhum documento salvo encontrado."}
                  </div>
                ) : (
                  filteredAndSortedDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 gap-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm sm:text-base">{document.patientName}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{document.appointmentDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{document.appointmentTime}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{document.appointmentType}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewDocument(document)}
                        className="flex-1 sm:flex-none"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Visualizar
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setEditDocument(document)}
                        className="flex-1 sm:flex-none"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Document Dialog */}
      <Dialog open={!!viewDocument} onOpenChange={() => setViewDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Visualizar Documento - {viewDocument?.patientName}
            </DialogTitle>
          </DialogHeader>
          
          {viewDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground">Paciente</Label>
                  <p className="font-medium">{viewDocument.patientName}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Data</Label>
                  <p className="font-medium">{viewDocument.appointmentDate}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Horário</Label>
                  <p className="font-medium">{viewDocument.appointmentTime}</p>
                </div>
              </div>

              <div>
                <Label>Evolução Clínica</Label>
                <div className="mt-2 p-4 bg-muted rounded-lg whitespace-pre-wrap">
                  {viewDocument.evolutionText}
                </div>
              </div>

              {viewDocument.nextSteps && (
                <div>
                  <Label>Próximos Passos</Label>
                  <div className="mt-2 p-4 bg-muted rounded-lg whitespace-pre-wrap">
                    {viewDocument.nextSteps}
                  </div>
                </div>
              )}

              {viewDocument.attachments.length > 0 && (
                <div>
                  <Label>Anexos</Label>
                  <div className="mt-2 space-y-2">
                    {viewDocument.attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={() => setViewDocument(null)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={!!editDocument} onOpenChange={() => setEditDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Editar Documento - {editDocument?.patientName}
            </DialogTitle>
          </DialogHeader>
          
          {editDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground">Paciente</Label>
                  <p className="font-medium">{editDocument.patientName}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Data</Label>
                  <p className="font-medium">{editDocument.appointmentDate}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Horário</Label>
                  <p className="font-medium">{editDocument.appointmentTime}</p>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-evolution">Evolução Clínica</Label>
                <Textarea
                  id="edit-evolution"
                  value={editDocument.evolutionText}
                  onChange={(e) => setEditDocument({ ...editDocument, evolutionText: e.target.value })}
                  rows={10}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="edit-next-steps">Próximos Passos</Label>
                <Textarea
                  id="edit-next-steps"
                  value={editDocument.nextSteps}
                  onChange={(e) => setEditDocument({ ...editDocument, nextSteps: e.target.value })}
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setEditDocument(null)}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleEditSave}
                  className="w-full sm:w-auto"
                >
                  Salvar Alterações
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Documentos;