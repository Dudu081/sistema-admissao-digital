import React, { useState } from 'react';
import { Eye, Trash2, UserCheck, Calendar, Mail, Phone, FileText } from 'lucide-react';
import { Candidate } from '../types';

export default function CandidatesManager() {
  const [candidates, setCandidates] = useState<Candidate[]>([
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
  ]);

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  const handleDeleteCandidate = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este candidato?')) {
      setCandidates(candidates.filter(c => c.id !== id));
    }
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Candidatos</h1>
        <div className="text-sm text-gray-500">
          {candidates.length} candidatos cadastrados
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome Completo
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Nascimento
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-mail
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vaga Escolhida
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Cadastro
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <UserCheck className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{candidate.fullName}</div>
                        <div className="text-xs text-gray-500">
                          {calculateAge(candidate.birthDate)} anos
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                    {candidate.birthDate.toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{candidate.phone}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{candidate.email}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {candidate.jobTitle}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                    {candidate.createdAt.toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewCandidate(candidate)}
                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Visualizar"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCandidate(candidate.id)}
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {candidates.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <UserCheck size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhum candidato cadastrado ainda.</p>
            <p className="text-sm">Os candidatos aparecerão aqui quando se candidatarem às vagas.</p>
          </div>
        )}
      </div>

      {/* Candidate Details Modal */}
      {showModal && selectedCandidate && (
        <CandidateModal 
          candidate={selectedCandidate}
          onClose={() => {
            setShowModal(false);
            setSelectedCandidate(null);
          }}
        />
      )}
    </div>
  );
}

interface CandidateModalProps {
  candidate: Candidate;
  onClose: () => void;
}

function CandidateModal({ candidate, onClose }: CandidateModalProps) {
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleDownloadResume = () => {
    if (candidate.resume) {
      alert(`Download do currículo: ${candidate.resume}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Detalhes do Candidato</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Personal Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Informações Pessoais</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <UserCheck className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Nome Completo</p>
                    <p className="font-medium text-gray-900">{candidate.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Data de Nascimento</p>
                    <p className="font-medium text-gray-900">
                      {candidate.birthDate.toLocaleDateString('pt-BR')} ({calculateAge(candidate.birthDate)} anos)
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Telefone</p>
                    <p className="font-medium text-gray-900">{candidate.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">E-mail</p>
                    <p className="font-medium text-gray-900">{candidate.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Vaga de Interesse</h4>
              <div className="space-y-2">
                <p className="text-lg font-medium text-blue-900">{candidate.jobTitle}</p>
                <p className="text-sm text-gray-600">
                  Candidatura realizada em {candidate.createdAt.toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Resume */}
            {candidate.resume && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Currículo</h4>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <FileText className="text-green-600" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">{candidate.resume}</p>
                      <p className="text-sm text-gray-600">Arquivo anexado</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadResume}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Download
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-2 sm:space-y-0 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  alert('Funcionalidade de criar admissão será implementada');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Criar Admissão
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
