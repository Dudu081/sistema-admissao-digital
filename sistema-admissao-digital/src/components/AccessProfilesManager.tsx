import React, { useState } from 'react';
import { Plus, CreditCard as Edit, Copy, Shield, Search } from 'lucide-react';
import { AccessProfile } from '../types';

// Menu items disponíveis no sistema
const availableMenuItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'workflow', label: 'Fluxos de Etapas' },
  { id: 'forms', label: 'Formulários' },
  { id: 'admissions', label: 'Admissões' },
  { id: 'jobs', label: 'Publicar Vagas' },
  { id: 'candidates', label: 'Candidatos' },
  { id: 'sectors', label: 'Setores' },
  { id: 'users', label: 'Usuários' },
  { id: 'access-profiles', label: 'Perfil de Acesso' },
  { id: 'reports', label: 'Relatórios' },
];

export default function AccessProfilesManager() {
  const [profiles, setProfiles] = useState<AccessProfile[]>([
    {
      id: '1',
      name: 'Administrador Master',
      description: 'Acesso completo a todas as funcionalidades do sistema',
      permissions: ['dashboard', 'workflow', 'forms', 'admissions', 'jobs', 'candidates', 'sectors', 'users', 'access-profiles', 'reports'],
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Setor RH',
      description: 'Acesso limitado apenas às admissões',
      permissions: ['admissions'],
      createdAt: new Date('2024-01-02'),
    },
    {
      id: '3',
      name: 'Setor Médico',
      description: 'Acesso limitado apenas às admissões',
      permissions: ['admissions'],
      createdAt: new Date('2024-01-03'),
    },
    {
      id: '4',
      name: 'Setor DP',
      description: 'Acesso limitado apenas às admissões',
      permissions: ['admissions'],
      createdAt: new Date('2024-01-04'),
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState<AccessProfile | null>(null);

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProfile = () => {
    setEditingProfile(null);
    setShowModal(true);
  };

  const handleEditProfile = (profile: AccessProfile) => {
    setEditingProfile(profile);
    setShowModal(true);
  };

  const handleDuplicateProfile = (profile: AccessProfile) => {
    const duplicatedProfile: AccessProfile = {
      ...profile,
      id: Date.now().toString(),
      name: `${profile.name} (Cópia)`,
      createdAt: new Date(),
    };
    setProfiles([...profiles, duplicatedProfile]);
  };

  const handleSaveProfile = (profileData: { name: string; description: string; permissions: string[] }) => {
    if (editingProfile) {
      setProfiles(profiles.map(profile =>
        profile.id === editingProfile.id
          ? { ...profile, ...profileData }
          : profile
      ));
    } else {
      const newProfile: AccessProfile = {
        id: Date.now().toString(),
        name: profileData.name,
        description: profileData.description,
        permissions: profileData.permissions,
        createdAt: new Date(),
      };
      setProfiles([...profiles, newProfile]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Perfil de Acesso</h1>
        <button
          onClick={handleAddProfile}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          <span>Adicionar Perfil de Acesso</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar perfis pelo nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome do Perfil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissões Ativas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProfiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <Shield className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{profile.name}</div>
                        <div className="text-xs text-gray-500">
                          Criado em {profile.createdAt.toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{profile.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {profile.permissions.length} permissões
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditProfile(profile)}
                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Editar Perfil"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDuplicateProfile(profile)}
                        className="p-2 text-gray-500 hover:text-green-600 transition-colors"
                        title="Duplicar Perfil"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProfiles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Shield size={48} className="mx-auto mb-4 opacity-50" />
            <p>
              {searchTerm ? 'Nenhum perfil encontrado.' : 'Nenhum perfil de acesso criado ainda.'}
            </p>
            <p className="text-sm">
              {searchTerm ? 'Tente ajustar os termos de busca.' : 'Clique em "Adicionar Perfil de Acesso" para começar.'}
            </p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden space-y-4">
        {filteredProfiles.map((profile) => (
          <div key={profile.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Shield className="text-blue-600" size={20} />
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-gray-900">{profile.name}</div>
                <div className="text-xs text-gray-500">
                  Criado em {profile.createdAt.toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 mb-3">{profile.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {profile.permissions.length} permissões
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditProfile(profile)}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Editar Perfil"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDuplicateProfile(profile)}
                  className="p-2 text-gray-500 hover:text-green-600 transition-colors"
                  title="Duplicar Perfil"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredProfiles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Shield size={48} className="mx-auto mb-4 opacity-50" />
            <p>
              {searchTerm ? 'Nenhum perfil encontrado.' : 'Nenhum perfil de acesso criado ainda.'}
            </p>
            <p className="text-sm">
              {searchTerm ? 'Tente ajustar os termos de busca.' : 'Clique em "Adicionar Perfil de Acesso" para começar.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ProfileModal
          profile={editingProfile}
          availableMenuItems={availableMenuItems}
          onSave={handleSaveProfile}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

interface ProfileModalProps {
  profile: AccessProfile | null;
  availableMenuItems: { id: string; label: string }[];
  onSave: (profile: { name: string; description: string; permissions: string[] }) => void;
  onClose: () => void;
}

function ProfileModal({ profile, availableMenuItems, onSave, onClose }: ProfileModalProps) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    description: profile?.description || '',
    permissions: profile?.permissions || [],
  });

  const handlePermissionToggle = (menuId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(menuId)
        ? prev.permissions.filter(id => id !== menuId)
        : [...prev.permissions, menuId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {profile ? 'Editar Perfil de Acesso' : 'Adicionar Perfil de Acesso'}
          </h3>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Perfil <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Administrador Geral"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Breve descrição do perfil de acesso..."
              />
            </div>

            {/* Seção de Permissões */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Permissões de Acesso
              </label>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3 max-h-64 overflow-y-auto">
                <p className="text-xs text-gray-600 mb-3">
                  Selecione quais seções do sistema este perfil pode acessar:
                </p>
                <div className="space-y-2">
                  {availableMenuItems.map((menuItem) => (
                    <div key={menuItem.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                      <span className="text-sm text-gray-700">{menuItem.label}</span>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(menuItem.id)}
                          onChange={() => handlePermissionToggle(menuItem.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-xs text-gray-500">
                          {formData.permissions.includes(menuItem.id) ? 'Permitido' : 'Negado'}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              if (formData.name.trim()) {
                onSave(formData);
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}