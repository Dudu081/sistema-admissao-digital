import React, { useState } from 'react';
import { Plus, CreditCard as Edit, Trash2, Eye, Briefcase } from 'lucide-react';
import { JobPosting } from '../types';

export default function JobPostings() {
  const [jobs, setJobs] = useState<JobPosting[]>([
    {
      id: '1',
      title: 'Desenvolvedor Frontend React',
      position: 'Desenvolvedor Jr',
      department: 'TI',
      location: 'São Paulo - SP',
      role: 'Desenvolvedor Frontend',
      education: 'Superior Completo',
      description: 'Buscamos desenvolvedor com experiência em React, TypeScript e Tailwind CSS para integrar nossa equipe de desenvolvimento.',
      required: 'React, TypeScript, JavaScript, HTML, CSS',
      desired: 'Next.js, Node.js, GraphQL',
      salary: 'R$ 4.000 - R$ 6.000',
      quantity: 2,
      expirationDate: new Date('2024-12-31'),
      status: 'active',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      title: 'Analista de RH',
      position: 'Analista Pleno',
      department: 'Recursos Humanos',
      location: 'São Paulo - SP',
      role: 'Analista de Recursos Humanos',
      education: 'Superior Completo em Psicologia ou RH',
      description: 'Profissional para atuar com recrutamento, seleção e desenvolvimento de pessoas.',
      required: 'Experiência em recrutamento, conhecimento em legislação trabalhista',
      desired: 'Certificações em RH, inglês intermediário',
      salary: 'R$ 3.500 - R$ 5.000',
      quantity: 1,
      expirationDate: new Date('2024-11-30'),
      status: 'active',
      createdAt: new Date('2024-01-10'),
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);

  const sectors = ['TI', 'Recursos Humanos', 'Financeiro', 'Vendas', 'Marketing', 'Operacional'];

  const handleAddJob = () => {
    setEditingJob(null);
    setShowModal(true);
  };

  const handleEditJob = (job: JobPosting) => {
    setEditingJob(job);
    setShowModal(true);
  };

  const handleSaveJob = (jobData: Omit<JobPosting, 'id' | 'status' | 'createdAt'>) => {
    if (editingJob) {
      setJobs(jobs.map(job =>
        job.id === editingJob.id
          ? { ...job, ...jobData, status: new Date(jobData.expirationDate) > new Date() ? 'active' : 'expired' }
          : job
      ));
    } else {
      const newJob: JobPosting = {
        id: Date.now().toString(),
        ...jobData,
        status: new Date(jobData.expirationDate) > new Date() ? 'active' : 'expired',
        createdAt: new Date(),
      };
      setJobs([...jobs, newJob]);
    }
    setShowModal(false);
  };

  const handleDeleteJob = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta vaga?')) {
      setJobs(jobs.filter(job => job.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Publicar Vagas</h1>
        <button
          onClick={handleAddJob}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          <span>Nova Vaga</span>
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Expiração</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <Briefcase className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                        <div className="text-xs text-gray-500">
                          Criada em {job.createdAt.toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{job.position}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {job.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{job.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{job.expirationDate.toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status === 'active' ? 'Ativa' : 'Expirada'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors"><Eye size={16} /></button>
                      <button onClick={() => handleEditJob(job)} className="p-2 text-gray-500 hover:text-green-600 transition-colors"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteJob(job.id)} className="p-2 text-gray-500 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhuma vaga publicada ainda.</p>
            <p className="text-sm">Clique em "Nova Vaga" para começar.</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-2">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Briefcase className="text-blue-600" size={20} />
              </div>
              <div>
                <div className="text-base font-semibold text-gray-900">{job.title}</div>
                <div className="text-xs text-gray-500">Criada em {job.createdAt.toLocaleDateString('pt-BR')}</div>
              </div>
            </div>
            <p className="text-sm text-gray-700"><span className="font-medium">Cargo:</span> {job.position}</p>
            <p className="text-sm text-gray-700"><span className="font-medium">Departamento:</span> {job.department}</p>
            <p className="text-sm text-gray-700"><span className="font-medium">Quantidade:</span> {job.quantity}</p>
            <p className="text-sm text-gray-700"><span className="font-medium">Expira:</span> {job.expirationDate.toLocaleDateString('pt-BR')}</p>
            <div className="flex items-center justify-between mt-2">
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(job.status)}`}>
                {job.status === 'active' ? 'Ativa' : 'Expirada'}
              </span>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-blue-600"><Eye size={16} /></button>
                <button onClick={() => handleEditJob(job)} className="p-2 text-gray-500 hover:text-green-600"><Edit size={16} /></button>
                <button onClick={() => handleDeleteJob(job.id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <JobModal
          job={editingJob}
          sectors={sectors}
          onSave={handleSaveJob}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

interface JobModalProps {
  job: JobPosting | null;
  sectors: string[];
  onSave: (job: Omit<JobPosting, 'id' | 'status' | 'createdAt'>) => void;
  onClose: () => void;
}

function JobModal({ job, sectors, onSave, onClose }: JobModalProps) {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    position: job?.position || '',
    department: job?.department || sectors[0],
    location: job?.location || '',
    role: job?.role || '',
    education: job?.education || '',
    description: job?.description || '',
    required: job?.required || '',
    desired: job?.desired || '',
    salary: job?.salary || '',
    quantity: job?.quantity || 1,
    expirationDate: job?.expirationDate ? job.expirationDate.toISOString().split('T')[0] : '',
    attachment: job?.attachment || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.position.trim() && formData.description.trim()) {
      onSave({
        ...formData,
        expirationDate: new Date(formData.expirationDate),
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData({ ...formData, attachment: file.name });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {job ? 'Editar Vaga' : 'Nova Vaga'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Inputs responsivos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título da Vaga *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo *</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {sectors.map(sector => <option key={sector}>{sector}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Localidade *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: São Paulo - SP"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Função *</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Desenvolvedor Frontend"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grau de Instrução *</label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Superior Completo"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva a vaga e responsabilidades..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exigido *</label>
              <textarea
                rows={3}
                value={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Requisitos obrigatórios para a vaga..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Desejável</label>
              <textarea
                rows={3}
                value={formData.desired}
                onChange={(e) => setFormData({ ...formData, desired: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Requisitos desejáveis (não obrigatórios)..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remuneração</label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: R$ 3.000 - R$ 5.000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Expiração *</label>
                <input
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Anexo (opcional)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  accept=".pdf,.doc,.docx"
                />
                {formData.attachment && <p className="text-xs text-gray-500 mt-1">Arquivo: {formData.attachment}</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
              <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50 w-full sm:w-auto">
                Cancelar
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto">
                Salvar Vaga 
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}