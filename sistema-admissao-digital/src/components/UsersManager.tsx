import React, { useState } from 'react';
import { Plus, CreditCard as Edit, Trash2, UserCog } from 'lucide-react';

// Perfis de acesso disponíveis
const availableAccessProfiles: AccessProfile[] = [
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
];

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  sector: string;
  accessProfileId: string;
  createdAt: Date;
}

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Administrador Seleção', email: 'selecao@mobcode.com', password: '12345', sector: 'Seleção', createdAt: new Date('2024-01-08') },
    { id: '2', name: 'Ana Costa Silva', email: 'ana.costa@mobcode.com', password: '12345', sector: 'RH', createdAt: new Date('2024-01-10') },
    { id: '3', name: 'Dr. Carlos Santos', email: 'carlos.santos@mobcode.com', password: '12345', sector: 'Médico', createdAt: new Date('2024-01-12') },
    { id: '4', name: 'Maria Oliveira Santos', email: 'maria.oliveira@mobcode.com', password: '12345', sector: 'DP', createdAt: new Date('2024-01-15') },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const sectors = ['Seleção', 'RH', 'Médico', 'DP'];

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleSaveUser = (userData: { name: string; email: string; password: string; sector: string; accessProfileId: string }) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        sector: userData.sector,
        accessProfileId: userData.accessProfileId,
        createdAt: new Date(),
      };
      setUsers([...users, newUser]);
    }
    setShowModal(false);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
        <button 
          onClick={handleAddUser}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Adicionar Novo Usuário</span>
        </button>
      </div>

      {/* Grid de Usuários */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-mail</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Senha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Setor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Perfil de Acesso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cadastrado em</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <UserCog className="text-blue-600" size={20} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">********</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user.sector}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {availableAccessProfiles.find(profile => profile.id === user.accessProfileId)?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.createdAt.toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="p-2 text-gray-500 hover:text-blue-600"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-gray-500 hover:text-red-600"
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

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <UserCog size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhum usuário cadastrado ainda.</p>
            <p className="text-sm">Clique em "Adicionar Novo Usuário" para começar.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <UserModal 
          user={editingUser}
          sectors={sectors}
          onSave={handleSaveUser}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

interface UserModalProps {
  user: User | null;
  sectors: string[];
  onSave: (user: { name: string; email: string; password: string; sector: string; accessProfileId: string }) => void;
  onClose: () => void;
}

function UserModal({ user, sectors, onSave, onClose }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: user?.password || '',
    sector: user?.sector || sectors[0],
    accessProfileId: user?.accessProfileId || availableAccessProfiles[0]?.id || '',
  });

  const selectedAccessProfile = availableAccessProfiles.find(profile => profile.id === formData.accessProfileId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.email.trim() && formData.password.trim()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {user ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
        </h3>

        <div className="max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuário *</label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nome de usuário"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
              <input 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="email@exemplo.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha *</label>
              <input 
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Digite uma senha"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Setor *</label>
              <select 
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                {sectors.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Perfil de Acesso *</label>
              <select 
                value={formData.accessProfileId}
                onChange={(e) => setFormData({ ...formData, accessProfileId: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                {availableAccessProfiles.map(profile => (
                  <option key={profile.id} value={profile.id}>{profile.name}</option>
                ))}
              </select>
              {selectedAccessProfile && (
                <p className="text-xs text-gray-500 mt-1">{selectedAccessProfile.description}</p>
              )}
            </div>
          </form>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-4">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              if (formData.name.trim() && formData.email.trim() && formData.password.trim() && formData.accessProfileId) {
                onSave(formData);
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}