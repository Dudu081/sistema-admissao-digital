import React, { useState } from 'react';
import { Building2, MapPin, Calendar, Users, FileText, User, Phone, Mail, Upload, LogIn, UserPlus } from 'lucide-react';

// Mock data - em produção viria de uma API
const mockJobs = [
  {
    id: '1',
    title: 'Desenvolvedor Frontend React',
    position: 'Desenvolvedor Jr',
    department: 'TI',
    location: 'São Paulo - SP',
    role: 'Desenvolvedor Frontend',
    education: 'Superior Completo em Tecnologia',
    description: 'Buscamos desenvolvedor com experiência em React, TypeScript e Tailwind CSS para integrar nossa equipe de desenvolvimento. Você trabalhará em projetos inovadores e terá oportunidade de crescimento profissional.',
    required: 'Experiência com React e TypeScript, conhecimento em Tailwind CSS, versionamento com Git, inglês intermediário',
    desired: 'Next.js, Node.js, GraphQL, experiência com testes automatizados',
    salary: 'R$ 4.000 - R$ 6.000',
    quantity: 2,
    expirationDate: new Date('2024-12-31'),
    status: 'active',
  },
  {
    id: '2',
    title: 'Analista de RH',
    position: 'Analista Pleno',
    department: 'Recursos Humanos',
    location: 'São Paulo - SP',
    role: 'Analista de Recursos Humanos',
    education: 'Superior Completo em Psicologia ou RH',
    description: 'Profissional para atuar com recrutamento, seleção e desenvolvimento de pessoas. Buscamos alguém proativo e com experiência em gestão de pessoas.',
    required: 'Formação em Psicologia ou RH, experiência em recrutamento, conhecimento em legislação trabalhista, boa comunicação',
    desired: 'Certificações em RH, inglês intermediário, experiência com sistemas de RH',
    salary: 'R$ 3.500 - R$ 5.000',
    quantity: 1,
    expirationDate: new Date('2024-11-30'),
    status: 'active',
  },
  {
    id: '3',
    title: 'Assistente Administrativo',
    position: 'Assistente Jr',
    department: 'Administrativo',
    location: 'São Paulo - SP',
    role: 'Assistente Administrativo',
    education: 'Ensino Médio Completo',
    description: 'Oportunidade para atuar na área administrativa, realizando atividades de apoio aos diversos departamentos da empresa. Ideal para quem busca crescimento profissional.',
    required: 'Ensino médio completo, conhecimento em pacote Office, boa comunicação, organização',
    desired: 'Experiência anterior em área administrativa, conhecimento em sistemas ERP',
    salary: 'R$ 2.500 - R$ 3.200',
    quantity: 3,
    expirationDate: new Date('2024-12-15'),
    status: 'active',
  },
  {
    id: '4',
    title: 'Vendedor Externo',
    position: 'Vendedor Pleno',
    department: 'Vendas',
    location: 'São Paulo - SP',
    role: 'Vendedor Externo',
    education: 'Ensino Médio Completo',
    description: 'Vaga para vendedor externo com foco em prospecção de novos clientes e manutenção da carteira existente. Oferecemos comissões atrativas e plano de carreira.',
    required: 'Experiência em vendas, CNH categoria B, disponibilidade para viagens, boa comunicação',
    desired: 'Experiência no segmento, conhecimento em CRM, cursos na área comercial',
    salary: 'R$ 2.800 + Comissões',
    quantity: 2,
    expirationDate: new Date('2025-01-10'),
    status: 'active',
  },
  {
    id: '5',
    title: 'Designer Gráfico',
    position: 'Designer Jr',
    department: 'Marketing',
    location: 'São Paulo - SP',
    role: 'Designer Gráfico',
    education: 'Superior em Design ou áreas afins',
    description: 'Buscamos designer criativo para desenvolver materiais gráficos para campanhas de marketing, redes sociais e materiais institucionais.',
    required: 'Domínio do Adobe Creative Suite, portfolio atualizado, criatividade, conhecimento em redes sociais',
    desired: 'Experiência com motion graphics, conhecimento em UX/UI, inglês básico',
    salary: 'R$ 3.000 - R$ 4.500',
    quantity: 1,
    expirationDate: new Date('2024-11-20'),
    status: 'active',
  }
];

export default function CandidatePortal() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [applicationData, setApplicationData] = useState({
    fullName: '',
    birthDate: '',
    phone: '',
    email: '',
    resume: null as File | null
  });

  // Mock user applications data
  const [userApplications] = useState([
    {
      id: '1',
      jobTitle: 'Desenvolvedor Frontend React',
      appliedDate: new Date('2024-01-20'),
      status: 'pending',
      currentStep: 'Análise de Currículo',
      progress: 25
    },
    {
      id: '2',
      jobTitle: 'Analista de RH',
      appliedDate: new Date('2024-01-18'),
      status: 'in-progress',
      currentStep: 'Entrevista RH',
      progress: 60
    }
  ]);

  const activeJobs = mockJobs.filter(job => 
    job.status === 'active' && new Date(job.expirationDate) > new Date()
  );

  const handleJobDetails = (job: any) => {
    setSelectedJob(job);
  };

  const handleApply = (job: any) => {
    if (!isLoggedIn) {
      alert('Você precisa estar logado para se candidatar. Clique em "Área do Candidato" para fazer login.');
      return;
    }
    setSelectedJob(job);
    setShowApplicationForm(true);
  };

  const handleLogin = (credentials: { username: string; password: string }) => {
    // Validação master
    if (credentials.username === 'MASTER' && credentials.password === '12345') {
      const masterUser = {
        id: 'master',
        name: 'Candidato Master',
        email: 'master@candidato.com'
      };
      setCurrentUser(masterUser);
      setIsLoggedIn(true);
      setShowLoginModal(false);
      return true;
    }
    return false;
  };

  const handleRegister = (userData: any) => {
    const newUser = {
      id: Date.now().toString(),
      ...userData
    };
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setShowRegisterModal(false);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!applicationData.fullName || !applicationData.birthDate || 
        !applicationData.phone || !applicationData.email) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    console.log('Candidatura enviada:', {
      ...applicationData,
      jobId: selectedJob.id,
      jobTitle: selectedJob.title
    });

    alert('Candidatura enviada com sucesso! Você pode acompanhar o status na sua área do candidato.');
    
    setApplicationData({
      fullName: '',
      birthDate: '',
      phone: '',
      email: '',
      resume: null
    });
    setShowApplicationForm(false);
    setSelectedJob(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setApplicationData({ ...applicationData, resume: file });
    }
  };

  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in-progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in-progress': return 'Em Andamento';
      case 'completed': return 'Concluído';
      case 'rejected': return 'Rejeitado';
      default: return 'Desconhecido';
    }
  };

  // Se logado, mostra área do candidato
  if (isLoggedIn && currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Building2 className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">MobCode</h1>
                  <p className="text-sm text-gray-600">Área do Candidato</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Olá, {currentUser.name}</span>
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setCurrentUser(null);
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Minhas Candidaturas</h2>
            <p className="text-gray-600">Acompanhe o status das suas candidaturas</p>
          </div>

          {/* Applications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {userApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {application.jobTitle}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Candidatura enviada em {application.appliedDate.toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Status: {getStatusText(application.status)}</span>
                    <span>{application.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(application.status)}`}
                      style={{ width: `${application.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Etapa atual: {application.currentStep}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Available Jobs */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vagas Disponíveis</h2>
            <p className="text-gray-600">Candidate-se a novas oportunidades</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">{job.position}</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {job.department}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {truncateDescription(job.description)}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users size={16} className="mr-2" />
                      {job.quantity} {job.quantity === 1 ? 'vaga' : 'vagas'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={16} className="mr-2" />
                      Até {job.expirationDate.toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleJobDetails(job)}
                      className="flex-1 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                    >
                      Ver Detalhes
                    </button>
                    <button
                      onClick={() => handleApply(job)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Candidatar-se
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Building2 className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MobCode</h1>
                <p className="text-sm text-gray-600">Portal de Vagas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <LogIn size={16} />
                <span>Área do Candidato</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedJob ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Encontre sua próxima oportunidade
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Junte-se à nossa equipe e faça parte de uma empresa inovadora que valoriza o crescimento profissional e pessoal.
              </p>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">{job.position}</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {job.department}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {truncateDescription(job.description)}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users size={16} className="mr-2" />
                        {job.quantity} {job.quantity === 1 ? 'vaga' : 'vagas'}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-2" />
                        Até {job.expirationDate.toLocaleDateString('pt-BR')}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleJobDetails(job)}
                        className="flex-1 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                      >
                        Informações
                      </button>
                      <button
                        onClick={() => handleApply(job)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Se Candidatar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {activeJobs.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>Nenhuma vaga disponível no momento.</p>
              </div>
            )}
          </>
        ) : showApplicationForm ? (
          /* Application Form */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <button
                  onClick={() => setShowApplicationForm(false)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
                >
                  ← Voltar aos detalhes
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Candidatar-se à vaga</h2>
                <p className="text-gray-600">{selectedJob.title} - {selectedJob.position}</p>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={applicationData.fullName}
                      onChange={(e) => setApplicationData({ ...applicationData, fullName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Digite seu nome completo"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Nascimento <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="date"
                      value={applicationData.birthDate}
                      onChange={(e) => setApplicationData({ ...applicationData, birthDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="tel"
                      value={applicationData.phone}
                      onChange={(e) => setApplicationData({ ...applicationData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={applicationData.email}
                      onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currículo (opcional)
                  </label>
                  <div className="relative">
                    <Upload className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      accept=".pdf,.doc,.docx"
                    />
                  </div>
                  {applicationData.resume && (
                    <p className="text-sm text-gray-600 mt-2">
                      Arquivo selecionado: {applicationData.resume.name}
                    </p>
                  )}
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Enviar Candidatura
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Job Details */
          <JobDetailsModal 
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onApply={() => handleApply(selectedJob)}
            isLoggedIn={isLoggedIn}
          />
        )}
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onLogin={handleLogin}
          onClose={() => setShowLoginModal(false)}
          onRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <RegisterModal
          onRegister={handleRegister}
          onClose={() => setShowRegisterModal(false)}
          onLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      )}

      {/* Footer */}
      
    </div>
  );
}

interface JobDetailsModalProps {
  job: any;
  onClose: () => void;
  onApply: () => void;
  isLoggedIn: boolean;
}

function JobDetailsModal({ job, onClose, onApply, isLoggedIn }: JobDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Detalhes da Vaga</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Job Title and Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <p className="text-lg text-gray-600 mb-3">{job.position}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Building2 size={16} className="mr-1" />
                      {job.department}
                    </span>
                    <span className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <Users size={16} className="mr-1" />
                      {job.quantity} {job.quantity === 1 ? 'vaga' : 'vagas'}
                    </span>
                    <span className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      Até {job.expirationDate.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Descrição da Vaga</h3>
                  <p className="text-gray-700 leading-relaxed">{job.description}</p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Requisitos Obrigatórios</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{job.required}</p>
                </div>

                {job.desired && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Requisitos Desejáveis</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{job.desired}</p>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Informações da Vaga</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Função:</span>
                      <span className="font-medium text-gray-900">{job.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Escolaridade:</span>
                      <span className="font-medium text-gray-900">{job.education}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Localidade:</span>
                      <span className="font-medium text-gray-900">{job.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Departamento:</span>
                      <span className="font-medium text-gray-900">{job.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vagas:</span>
                      <span className="font-medium text-gray-900">{job.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prazo:</span>
                      <span className="font-medium text-gray-900">{job.expirationDate.toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                {job.salary && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Remuneração</h3>
                    <p className="text-lg font-bold text-green-700">{job.salary}</p>
                  </div>
                )}

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Benefícios</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2"></span>
                      Vale alimentação
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2"></span>
                      Plano de saúde
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2"></span>
                      Vale transporte
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2"></span>
                      Participação nos lucros
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    alert('Você precisa estar logado para se candidatar. Clique em "Área do Candidato" para fazer login.');
                    return;
                  }
                  onApply();
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Se Candidatar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LoginModalProps {
  onLogin: (credentials: { username: string; password: string }) => boolean;
  onClose: () => void;
  onRegister: () => void;
}

function LoginModal({ onLogin, onClose, onRegister }: LoginModalProps) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(credentials);
    if (!success) {
      setError('Usuário ou senha incorretos');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Área do Candidato</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Entrar
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={onRegister}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Não tem conta? Cadastre-se
          </button>
        </div>
      </div>
    </div>
  );
}

interface RegisterModalProps {
  onRegister: (userData: any) => void;
  onClose: () => void;
  onLogin: () => void;
}

function RegisterModal({ onRegister, onClose, onLogin }: RegisterModalProps) {
  const [userData, setUserData] = useState({
    name: '',
    birthDate: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userData.password !== userData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (userData.password.length < 5) {
      setError('A senha deve ter pelo menos 5 caracteres');
      return;
    }

    onRegister(userData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Criar Conta</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
            <input
              type="date"
              value={userData.birthDate}
              onChange={(e) => setUserData({ ...userData, birthDate: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              type="tel"
              value={userData.phone}
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="(11) 99999-9999"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
            <input
              type="password"
              value={userData.confirmPassword}
              onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Cadastrar
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={onLogin}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Já tem conta? Faça login
          </button>
        </div>
      </div>
    </div>
  );
}