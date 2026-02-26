import React, { useState } from "react";
import { Plus, ArrowLeft, Eye, MessageCircle, Mail, Users, Copy, Link, CheckSquare } from "lucide-react";
import AdmissionModal from "./AdmissionModal";
import { Admission, FormField } from "../types";
import { Candidate } from "../types";
import { useAuth } from "../contexts/AuthContext";

// Interfaces herdadas da tela Templates
interface FormTemplate {
  id: string;
  name: string;
  description: string;
  department: string;
  fields: FormField[];
  createdAt: Date;
}

interface AdmissionRecord {
  id: string;
  name: string;
  template: FormTemplate;
  candidates: Candidate[];
  expiresAt: Date;
}

interface AdmissionCandidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  currentStepIndex: number;
  totalSteps: number;
  status: 'in-progress' | 'completed' | 'rejected';
  admission: Admission;
}

// Mock candidates data - em produção viria da tela de candidatos
const mockCandidates: Candidate[] = [
  {
    id: '1',
    fullName: 'João Silva Santos',
    birthDate: new Date('1990-05-15'),
    phone: '(11) 99999-9999',
    email: 'joao.silva@email.com',
    jobPostingId: '1',
    jobTitle: 'Desenvolvedor Frontend React',
    resume: 'curriculo_joao_silva.pdf',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    fullName: 'Maria Oliveira Costa',
    birthDate: new Date('1985-08-22'),
    phone: '(11) 88888-8888',
    email: 'maria.oliveira@email.com',
    jobPostingId: '2',
    jobTitle: 'Analista de RH',
    createdAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    fullName: 'Carlos Eduardo Lima',
    birthDate: new Date('1992-12-10'),
    phone: '(11) 77777-7777',
    email: 'carlos.lima@email.com',
    jobPostingId: '1',
    jobTitle: 'Desenvolvedor Frontend React',
    resume: 'curriculo_carlos_lima.pdf',
    createdAt: new Date('2024-01-16'),
  },
];

export default function AdmissionsManager() {
  const { currentUser, isMaster } = useAuth();

  const [templates] = useState<FormTemplate[]>([
    {
      id: "1",
      name: "Formulário RH",
      description: "Coleta de dados pessoais e profissionais",
      department: "Recursos Humanos",
      fields: [
        { id: '1', type: 'text', label: 'Nome Completo', required: true },
        { id: '2', type: 'text', label: 'CPF', required: true },
        { id: '3', type: 'date', label: 'Data de Nascimento', required: true },
        { id: '4', type: 'file', label: 'Foto 3x4', required: false },
      ],
      createdAt: new Date(),
    },
  ]);

  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([
    {
      id: "1",
      name: "Admissão Operacional - Setembro",
      template: {
        id: "1",
        name: "Formulário RH",
        description: "Coleta de dados pessoais e profissionais",
        department: "Recursos Humanos",
        fields: [
          { id: '1', type: 'text', label: 'Nome Completo', required: true },
          { id: '2', type: 'text', label: 'CPF', required: true },
          { id: '3', type: 'date', label: 'Data de Nascimento', required: true },
          { id: '4', type: 'file', label: 'Foto 3x4', required: false },
        ],
        createdAt: new Date(),
      },
      candidates: [
        {
          id: '1',
          name: 'João Silva Santos',
          email: 'joao.silva@email.com',
          phone: '(11) 99999-9999',
          position: 'Operador de Produção',
          department: 'Operacional',
          currentStepIndex: 0,
          totalSteps: 4,
          status: 'in-progress',
          admission: {
            id: '1',
            candidateName: 'João Silva Santos',
            candidateEmail: 'joao.silva@email.com',
            candidatePhone: '(11) 99999-9999',
            position: 'Operador de Produção',
            department: 'Operacional',
            templateId: '1',
            templateName: 'Formulário RH',
            formResponses: [
              { fieldId: '1', value: 'João Silva Santos' },
              { fieldId: '2', value: '123.456.789-00' },
              { fieldId: '3', value: '1990-05-15' },
            ],
            steps: [
              { stepId: '1', stepName: 'RH', sector: 'RH', status: 'pending', order: 1 },
              { stepId: '2', stepName: 'Médico', sector: 'Médico', status: 'pending', order: 2 },
              { stepId: '3', stepName: 'DP', sector: 'DP', status: 'pending', order: 3 },
              { stepId: '4', stepName: 'Finalização', sector: 'Seleção', status: 'pending', order: 4 },
            ],
            currentStepIndex: 0,
            status: 'in-progress',
            createdAt: new Date('2024-01-15'),
            lastActivity: new Date(),
          }
        },
        {
          id: '2',
          name: 'Maria Oliveira Costa',
          email: 'maria.oliveira@email.com',
          phone: '(11) 88888-8888',
          position: 'Assistente de Produção',
          department: 'Operacional',
          currentStepIndex: 1,
          totalSteps: 4,
          status: 'in-progress',
          admission: {
            id: '2',
            candidateName: 'Maria Oliveira Costa',
            candidateEmail: 'maria.oliveira@email.com',
            candidatePhone: '(11) 88888-8888',
            position: 'Assistente de Produção',
            department: 'Operacional',
            templateId: '1',
            templateName: 'Formulário RH',
            formResponses: [
              { fieldId: '1', value: 'Maria Oliveira Costa' },
              { fieldId: '2', value: '987.654.321-00' },
              { fieldId: '3', value: '1985-08-22' },
            ],
            steps: [
              { stepId: '1', stepName: 'RH', sector: 'RH', status: 'approved', approvedBy: 'Ana Costa', approvedAt: new Date(), order: 1 },
              { stepId: '2', stepName: 'Médico', sector: 'Médico', status: 'pending', order: 2 },
              { stepId: '3', stepName: 'DP', sector: 'DP', status: 'pending', order: 3 },
              { stepId: '4', stepName: 'Finalização', sector: 'Seleção', status: 'pending', order: 4 },
            ],
            currentStepIndex: 1,
            status: 'in-progress',
            createdAt: new Date('2024-01-16'),
            lastActivity: new Date(),
          }
        }
      ],
      expiresAt: new Date("2025-09-30"),
    },
    {
      id: "2",
      name: "Admissão TI - Outubro",
      template: {
        id: "1",
        name: "Formulário RH",
        description: "Coleta de dados pessoais e profissionais",
        department: "Recursos Humanos",
        fields: [
          { id: '1', type: 'text', label: 'Nome Completo', required: true },
          { id: '2', type: 'text', label: 'CPF', required: true },
          { id: '3', type: 'date', label: 'Data de Nascimento', required: true },
          { id: '4', type: 'file', label: 'Foto 3x4', required: false },
        ],
        createdAt: new Date(),
      },
      candidates: [
        {
          id: '3',
          name: 'Carlos Eduardo Lima',
          email: 'carlos.lima@email.com',
          phone: '(11) 77777-7777',
          position: 'Desenvolvedor Jr',
          department: 'TI',
          currentStepIndex: 2,
          totalSteps: 4,
          status: 'in-progress',
          admission: {
            id: '3',
            candidateName: 'Carlos Eduardo Lima',
            candidateEmail: 'carlos.lima@email.com',
            candidatePhone: '(11) 77777-7777',
            position: 'Desenvolvedor Jr',
            department: 'TI',
            templateId: '1',
            templateName: 'Formulário RH',
            formResponses: [
              { fieldId: '1', value: 'Carlos Eduardo Lima' },
              { fieldId: '2', value: '456.789.123-00' },
              { fieldId: '3', value: '1992-12-10' },
            ],
            steps: [
              { stepId: '1', stepName: 'RH', sector: 'RH', status: 'approved', approvedBy: 'Ana Costa', approvedAt: new Date(), order: 1 },
              { stepId: '2', stepName: 'Médico', sector: 'Médico', status: 'approved', approvedBy: 'Dr. Carlos', approvedAt: new Date(), order: 2 },
              { stepId: '3', stepName: 'DP', sector: 'DP', status: 'pending', order: 3 },
              { stepId: '4', stepName: 'Finalização', sector: 'Seleção', status: 'pending', order: 4 },
            ],
            currentStepIndex: 2,
            status: 'in-progress',
            createdAt: new Date('2024-01-10'),
            lastActivity: new Date(),
          }
        }
      ],
      expiresAt: new Date("2025-10-15"),
    },
  ]);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [showCandidateSelection, setShowCandidateSelection] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [newAdmissionName, setNewAdmissionName] = useState("");
  const [newAdmissionDate, setNewAdmissionDate] = useState("");
  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionRecord | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<AdmissionCandidate | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleTemplateSelected = (template: FormTemplate) => {
    setSelectedTemplate(template);
    setShowCandidateSelection(true);
  };

  const handleCandidateToggle = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleCandidateSelectionNext = () => {
    if (selectedCandidates.length === 0) {
      alert('Selecione pelo menos um candidato');
      return;
    }
    setShowCandidateSelection(false);
  };

  const handleCreateAdmission = () => {
    if (!selectedTemplate || !newAdmissionName || !newAdmissionDate || selectedCandidates.length === 0) return;

    // Criar candidatos baseados na seleção
    const admissionCandidates: AdmissionCandidate[] = selectedCandidates.map(candidateId => {
      const candidate = mockCandidates.find(c => c.id === candidateId);
      if (!candidate) return null;
      
      return {
        id: candidate.id,
        name: candidate.fullName,
        email: candidate.email,
        phone: candidate.phone,
        position: candidate.jobTitle,
        department: 'Operacional', // Em produção, pegar do job posting
        currentStepIndex: 0,
        totalSteps: 4,
        status: 'in-progress' as const,
        admission: {
          id: candidate.id,
          candidateName: candidate.fullName,
          candidateEmail: candidate.email,
          candidatePhone: candidate.phone,
          position: candidate.jobTitle,
          department: 'Operacional',
          templateId: selectedTemplate.id,
          templateName: selectedTemplate.name,
          formResponses: [
            { fieldId: '1', value: candidate.fullName },
            { fieldId: '2', value: '000.000.000-00' },
            { fieldId: '3', value: candidate.birthDate.toISOString().split('T')[0] },
          ],
          steps: [
            { stepId: '1', stepName: 'RH', sector: 'RH', status: 'pending', order: 1 },
            { stepId: '2', stepName: 'Médico', sector: 'Médico', status: 'pending', order: 2 },
            { stepId: '3', stepName: 'DP', sector: 'DP', status: 'pending', order: 3 },
            { stepId: '4', stepName: 'Finalização', sector: 'TI', status: 'pending', order: 4 },
          ],
          currentStepIndex: 0,
          status: 'in-progress',
          createdAt: new Date(),
          lastActivity: new Date(),
        }
      };
    }).filter(Boolean) as AdmissionCandidate[];

    const newAdmission: AdmissionRecord = {
      id: Date.now().toString(),
      name: newAdmissionName,
      template: selectedTemplate,
      candidates: admissionCandidates,
      expiresAt: new Date(newAdmissionDate),
    };

    setAdmissions([newAdmission, ...admissions]);
    setShowPopup(false);
    setShowCandidateSelection(false);
    setSelectedTemplate(null);
    setSelectedCandidates([]);
    setNewAdmissionName("");
    setNewAdmissionDate("");
  };

  const handleDeleteAdmission = (id: string) => {
    setAdmissions(admissions.filter((a) => a.id !== id));
  };

  const handleViewCandidate = (candidate: AdmissionCandidate) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  const handleSendWhatsApp = (candidate: AdmissionCandidate) => {
    const message = `Olá ${candidate.name}, sua admissão para o cargo de ${candidate.position} está em andamento. Status atual: ${Math.round(((candidate.currentStepIndex + 1) / candidate.totalSteps) * 100)}% concluído.`;
    const whatsappUrl = `https://wa.me/${candidate.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSendEmail = (candidate: AdmissionCandidate) => {
    const subject = `Atualização da sua admissão - ${candidate.position}`;
    const body = `Olá ${candidate.name},\n\nSua admissão para o cargo de ${candidate.position} está em andamento.\n\nStatus atual: ${Math.round(((candidate.currentStepIndex + 1) / candidate.totalSteps) * 100)}% concluído.\n\nEm breve entraremos em contato com mais informações.\n\nAtenciosamente,\nEquipe de RH`;
    const mailtoUrl = `mailto:${candidate.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const handleCopyLink = (admissionId: string) => {
    const formLink = `${window.location.origin}/formulario/${admissionId}`;
    navigator.clipboard.writeText(formLink).then(() => {
      alert('Link copiado para a área de transferência!');
    }).catch(() => {
      // Fallback para navegadores mais antigos
      const textArea = document.createElement('textarea');
      textArea.value = formLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copiado para a área de transferência!');
    });
  };

  const handleApproveCandidate = (admissionId: string, notes?: string) => {
    // Encontrar a admissão e candidato
    const admission = admissions.find(a => 
      a.candidates.some(c => c.admission.id === admissionId)
    );
    
    if (!admission) return;
    
    const updatedAdmissions = admissions.map(adm => {
      if (adm.id === admission.id) {
        const updatedCandidates = adm.candidates.map(candidate => {
          if (candidate.admission.id === admissionId) {
            const updatedAdmission = { ...candidate.admission };
            
            // Aprovar etapa atual
            updatedAdmission.steps[updatedAdmission.currentStepIndex] = {
              ...updatedAdmission.steps[updatedAdmission.currentStepIndex],
              status: 'approved',
              approvedBy: 'Usuário Atual', // Em produção, pegar do contexto
              approvedAt: new Date()
            };
            
            // Avançar para próxima etapa se não for a última
            if (updatedAdmission.currentStepIndex < updatedAdmission.steps.length - 1) {
              updatedAdmission.currentStepIndex += 1;
            } else {
              // Se for a última etapa, marcar como concluída
              updatedAdmission.status = 'completed';
            }
            
            updatedAdmission.lastActivity = new Date();
            
            return {
              ...candidate,
              admission: updatedAdmission,
              currentStepIndex: updatedAdmission.currentStepIndex,
              status: updatedAdmission.status
            };
          }
          return candidate;
        });
        
        return { ...adm, candidates: updatedCandidates };
      }
      return adm;
    });
    
    setAdmissions(updatedAdmissions);
  };

  const handleRejectCandidate = (admissionId: string, reason: string) => {
    const admission = admissions.find(a => 
      a.candidates.some(c => c.admission.id === admissionId)
    );
    
    if (!admission) return;
    
    const updatedAdmissions = admissions.map(adm => {
      if (adm.id === admission.id) {
        const updatedCandidates = adm.candidates.map(candidate => {
          if (candidate.admission.id === admissionId) {
            const updatedAdmission = { ...candidate.admission };
            
            // Reprovar etapa atual
            updatedAdmission.steps[updatedAdmission.currentStepIndex] = {
              ...updatedAdmission.steps[updatedAdmission.currentStepIndex],
              status: 'rejected',
              rejectionReason: reason
            };
            
            updatedAdmission.status = 'rejected';
            updatedAdmission.lastActivity = new Date();
            
            return {
              ...candidate,
              admission: updatedAdmission,
              status: 'rejected'
            };
          }
          return candidate;
        });
        
        return { ...adm, candidates: updatedCandidates };
      }
      return adm;
    });
    
    setAdmissions(updatedAdmissions);
  };
  const getProgressPercentage = (currentStep: number, totalSteps: number) => {
    return Math.round(((currentStep + 1) / totalSteps) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Filtrar candidatos baseado no setor do usuário logado
  const filterCandidatesBySector = (candidates: AdmissionCandidate[]) => {
    if (!currentUser || isMaster) {
      return candidates; // Master vê todos
    }

    return candidates.filter(candidate => {
      const currentStep = candidate.admission.steps[candidate.admission.currentStepIndex];
      return currentStep && currentStep.sector === currentUser.sector;
    });
  };

  // Se uma admissão está selecionada, mostra os candidatos
  if (selectedAdmission) {
    const filteredCandidates = filterCandidatesBySector(selectedAdmission.candidates);

    return (
      <div className="space-y-6">
        {/* Header com botão voltar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedAdmission(null)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedAdmission.name}</h1>
              <p className="text-sm text-gray-600">
                Template: {selectedAdmission.template.name} • {filteredCandidates.length} candidatos
                {!isMaster && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Setor: {currentUser?.sector}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Candidatos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>
                {isMaster 
                  ? "Nenhum candidato nesta admissão ainda." 
                  : `Nenhum candidato na etapa ${currentUser?.sector} no momento.`
                }
              </p>
              <p className="text-sm">
                {isMaster 
                  ? "Os candidatos aparecerão aqui quando preencherem o formulário."
                  : "Os candidatos aparecerão aqui quando chegarem na sua etapa."
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidato
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Departamento
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCandidates.map((candidate) => {
                    const progressPercentage = getProgressPercentage(candidate.currentStepIndex, candidate.totalSteps);
                    
                    return (
                      <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 sm:px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                            <div className="text-sm text-gray-500">{candidate.email}</div>
                            {candidate.phone && (
                              <div className="text-xs text-gray-400">{candidate.phone}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="text-sm text-gray-900">{candidate.position}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {candidate.department}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1">
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Progresso</span>
                                <span>{progressPercentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(candidate.status)}`}
                                  style={{ width: `${progressPercentage}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Etapa {candidate.currentStepIndex + 1} de {candidate.totalSteps}
                                {!isMaster && (
                                  <span className="ml-2 text-blue-600 font-medium">
                                    ({candidate.admission.steps[candidate.admission.currentStepIndex]?.stepName})
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleViewCandidate(candidate)}
                              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                              title="Visualizar detalhes"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handleSendWhatsApp(candidate)}
                              className="p-2 text-gray-500 hover:text-green-600 transition-colors"
                              title="Enviar WhatsApp"
                            >
                              <MessageCircle size={16} />
                            </button>
                            <button 
                              onClick={() => handleSendEmail(candidate)}
                              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                              title="Enviar E-mail"
                            >
                              <Mail size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de visualização do candidato */}
        {showModal && selectedCandidate && (
          <AdmissionModal
            admission={selectedCandidate.admission}
            formFields={selectedAdmission.template.fields}
            onApprove={handleApproveCandidate}
            onReject={handleRejectCandidate}
            onClose={() => {
              setShowModal(false);
              setSelectedCandidate(null);
            }}
          />
        )}
      </div>
    );
  }

  // Tela principal de admissões
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admissões</h1>
          {!isMaster && (
            <p className="text-sm text-gray-600 mt-1">
              Visualizando candidatos do setor: <span className="font-medium text-blue-600">{currentUser?.sector}</span>
            </p>
          )}
        </div>
        {isMaster && (
          <button
            onClick={() => setShowPopup(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nova Admissão</span>
          </button>
        )}
      </div>

      {/* Grid de Admissões */}
      <div className="grid grid-cols-1 gap-6">
        {admissions.map((admission) => {
          const filteredCandidates = filterCandidatesBySector(admission.candidates);
          
          // Se não é master e não tem candidatos na etapa, não mostrar a admissão
          if (!isMaster && filteredCandidates.length === 0) {
            return null;
          }
          
          return (
            <div
              key={admission.id}
              onClick={() => setSelectedAdmission(admission)}
              className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {admission.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Template: {admission.template.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Expira em {admission.expiresAt.toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-3 sm:gap-0">
                  <div className="text-center">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users size={16} className="mr-2" />
                      {isMaster ? admission.candidates.length : filteredCandidates.length} candidatos
                      {!isMaster && (
                        <span className="ml-1 text-xs text-blue-600">({currentUser?.sector})</span>
                      )}
                    </div>
                  </div>
                  
                  {isMaster && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLink(admission.id);
                      }}
                      className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm w-full sm:w-auto"
                      title="Copiar link do formulário"
                    >
                      <Link size={16} />
                      <span>Copiar Link</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {admissions.filter(admission => isMaster || filterCandidatesBySector(admission.candidates).length > 0).length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Users size={48} className="mx-auto mb-4 opacity-50" />
          <p>
            {isMaster 
              ? "Nenhuma admissão criada ainda." 
              : `Nenhuma admissão com candidatos na etapa ${currentUser?.sector} no momento.`
            }
          </p>
          <p className="text-sm">
            {isMaster 
              ? "Clique em \"Nova Admissão\" para começar."
              : "As admissões aparecerão aqui quando houver candidatos na sua etapa."
            }
          </p>
        </div>
      )}

      {/* Popup Nova Admissão */}
      {showPopup && isMaster && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 space-y-6">
            {!selectedTemplate ? (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Escolha um Template
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="border rounded-lg p-4 hover:border-blue-400 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-800">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {template.description}
                      </p>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mt-2">
                        {template.department}
                      </span>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleTemplateSelected(template)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          Selecionar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : showCandidateSelection ? (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Selecionar Candidatos ({selectedTemplate.name})
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {mockCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedCandidates.includes(candidate.id) 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleCandidateToggle(candidate.id)}
                    >
                      <div className="flex-shrink-0">
                        <CheckSquare 
                          className={`${
                            selectedCandidates.includes(candidate.id) 
                              ? 'text-blue-600' 
                              : 'text-gray-400'
                          }`} 
                          size={20} 
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{candidate.fullName}</h4>
                        <p className="text-sm text-gray-600">{candidate.email}</p>
                        <p className="text-xs text-gray-500">{candidate.jobTitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-6">
                  <p className="text-sm text-gray-600">
                    {selectedCandidates.length} candidatos selecionados
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowCandidateSelection(false);
                        setSelectedCandidates([]);
                      }}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleCandidateSelectionNext}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </>
            ) : selectedTemplate && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Nova Admissão ({selectedTemplate.name})
                </h2>
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    {selectedCandidates.length} candidatos selecionados para esta admissão
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome da Admissão
                    </label>
                    <input
                      type="text"
                      value={newAdmissionName}
                      onChange={(e) => setNewAdmissionName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Expiração
                    </label>
                    <input
                      type="date"
                      value={newAdmissionDate}
                      onChange={(e) => setNewAdmissionDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowCandidateSelection(true);
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleCreateAdmission}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Criar Admissão
                  </button>
                </div>
              </>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setShowPopup(false);
                  setShowCandidateSelection(false);
                  setSelectedTemplate(null); 
                  setSelectedCandidates([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}