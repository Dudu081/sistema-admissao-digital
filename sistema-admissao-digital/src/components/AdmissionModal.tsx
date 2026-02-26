import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Clock, User, Mail, Phone, Briefcase, Building2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Admission, FormField } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface AdmissionModalProps {
  admission: Admission;
  formFields: FormField[];
  onClose: () => void;
  onApprove?: (admissionId: string, notes?: string) => void;
  onReject?: (admissionId: string, reason: string) => void;
}

export default function AdmissionModal({ 
  admission, 
  formFields, 
  onClose, 
  onApprove, 
  onReject 
}: AdmissionModalProps) {
  const { isAdmin, currentUser } = useAuth();
  const [actionNotes, setActionNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const currentStep = admission.steps[admission.currentStepIndex];
  const canTakeAction = !isAdmin && currentUser?.sector === currentStep?.sector && currentStep?.status === 'pending';

  const canGoBack = admission.currentStepIndex > 0;
  const canGoForward = admission.currentStepIndex < admission.steps.length - 1;
  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-yellow-500" size={20} />;
    }
  };

  const getFieldResponse = (fieldId: string) => {
    const response = admission.formResponses.find(r => r.fieldId === fieldId);
    if (!response) return '-';
    
    if (Array.isArray(response.value)) {
      return response.value.join(', ');
    }
    
    if (typeof response.value === 'boolean') {
      return response.value ? 'Sim' : 'Não';
    }
    
    return response.value.toString();
  };

  const handleApprove = () => {
    if (onApprove) {
      onApprove(admission.id, actionNotes);
      onClose();
    }
  };

  const handleReject = () => {
    if (onReject && rejectionReason.trim()) {
      onReject(admission.id, rejectionReason);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isAdmin ? 'Visão Geral da Admissão' : 'Revisar Admissão'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {admission.candidateName} - {admission.position}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-full max-h-[calc(90vh-80px)]">
          {/* Timeline/Steps - Admin View */}
          {isAdmin && (
            <div className="lg:w-1/3 p-6 border-r border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-4">Timeline do Processo</h3>
              <div className="space-y-4">
                {admission.steps.map((step, index) => (
                  <div key={step.stepId} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getStepStatusIcon(step.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${
                          index === admission.currentStepIndex ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {step.stepName}
                        </p>
                        {index === admission.currentStepIndex && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            Atual
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{step.sector}</p>
                      {step.approvedBy && (
                        <p className="text-xs text-gray-400 mt-1">
                          Aprovado por {step.approvedBy} em {step.approvedAt?.toLocaleDateString('pt-BR')}
                        </p>
                      )}
                      {step.rejectionReason && (
                        <p className="text-xs text-red-600 mt-1">
                          Rejeitado: {step.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Candidate Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Informações do Candidato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">Nome:</span>
                    <span className="text-sm font-medium text-gray-900">{admission.candidateName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">E-mail:</span>
                    <span className="text-sm font-medium text-gray-900">{admission.candidateEmail}</span>
                  </div>
                  {admission.candidatePhone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="text-gray-400" size={16} />
                      <span className="text-sm text-gray-600">Telefone:</span>
                      <span className="text-sm font-medium text-gray-900">{admission.candidatePhone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Briefcase className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">Cargo:</span>
                    <span className="text-sm font-medium text-gray-900">{admission.position}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building2 className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">Departamento:</span>
                    <span className="text-sm font-medium text-gray-900">{admission.department}</span>
                  </div>
                </div>
              </div>

              {/* Form Responses */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Respostas do Formulário</h3>
                <div className="space-y-4">
                  {formFields.map((field) => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {field.type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded border">
                        {getFieldResponse(field.id)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons - Only for sector users on their step */}
              {canTakeAction && !showRejectForm && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Ações</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Observações (opcional)
                      </label>
                      <textarea
                        value={actionNotes}
                        onChange={(e) => setActionNotes(e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Adicione observações sobre a análise..."
                      />
                    </div>
                    <div className="flex space-x-3">
                      {canGoBack && (
                        <button
                          onClick={() => {
                            // Implementar lógica para voltar etapa
                            alert('Funcionalidade de voltar etapa será implementada');
                          }}
                          className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <ArrowLeft size={16} />
                          <span>Voltar Etapa</span>
                        </button>
                      )}
                      <button
                        onClick={handleApprove}
                        className={`${canGoBack ? 'flex-1' : 'flex-1'} bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2`}
                      >
                        <ArrowRight size={16} />
                        <span>
                          {admission.currentStepIndex === admission.steps.length - 1 
                            ? 'Finalizar Admissão' 
                            : 'Próxima Etapa'
                          }
                        </span>
                      </button>
                      <button
                        onClick={() => setShowRejectForm(true)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <XCircle size={16} />
                        <span>Reprovar</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Rejection Form */}
              {showRejectForm && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Motivo da Reprovação</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descreva o motivo da reprovação <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Explique os motivos da reprovação e o que precisa ser ajustado..."
                        required
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowRejectForm(false)}
                        className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={!rejectionReason.trim()}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Confirmar Reprovação
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Controls - Only for admins */}
              {isAdmin && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Controles Administrativos</h3>
                  <div className="flex space-x-3">
                    {canGoBack && (
                      <button
                        onClick={() => {
                          // Implementar lógica para admin voltar etapa
                          alert('Admin: Voltar etapa será implementado');
                        }}
                        className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <ArrowLeft size={16} />
                        <span>Voltar Etapa</span>
                      </button>
                    )}
                    {canGoForward && (
                      <button
                        onClick={() => {
                          // Implementar lógica para admin avançar etapa
                          alert('Admin: Avançar etapa será implementado');
                        }}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <ArrowRight size={16} />
                        <span>Avançar Etapa</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}