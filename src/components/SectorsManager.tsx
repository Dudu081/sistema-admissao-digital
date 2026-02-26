import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Building2 } from 'lucide-react';

interface Sector {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export default function SectorsManager() {
  const [sectors, setSectors] = useState<Sector[]>([]);

  useEffect(() => {
    const savedSectors = localStorage.getItem('sectors');
    if (savedSectors) {
      const parsed = JSON.parse(savedSectors);
      setSectors(parsed.map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt)
      })));
    } else {
      const defaultSectors = [
        {
          id: '1',
          name: 'Seleção',
          description: 'Setor master com acesso completo',
          createdAt: new Date('2024-01-10')
        },
        {
          id: '2',
          name: 'RH',
          description: 'Recursos Humanos - Gestão de pessoas',
          createdAt: new Date('2024-01-12')
        },
        {
          id: '3',
          name: 'Médico',
          description: 'Setor médico - Exames admissionais',
          createdAt: new Date('2024-01-13')
        },
        {
          id: '4',
          name: 'DP',
          description: 'Departamento Pessoal - Documentação',
          createdAt: new Date('2024-01-15')
        },
      ];
      setSectors(defaultSectors);
      localStorage.setItem('sectors', JSON.stringify(defaultSectors));
    }
  }, []);

  useEffect(() => {
    if (sectors.length > 0) {
      localStorage.setItem('sectors', JSON.stringify(sectors));
    }
  }, [sectors]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);

  const handleAddSector = () => {
    setEditingSector(null);
    setShowModal(true);
  };

  const handleEditSector = (sector: Sector) => {
    setEditingSector(sector);
    setShowModal(true);
  };

  const handleSaveSector = (sectorData: { name: string; description: string }) => {
    if (editingSector) {
      const updatedSectors = sectors.map(sector =>
        sector.id === editingSector.id
          ? { ...sector, ...sectorData }
          : sector
      );
      setSectors(updatedSectors);
    } else {
      const newSector: Sector = {
        id: Date.now().toString(),
        name: sectorData.name,
        description: sectorData.description,
        createdAt: new Date(),
      };
      setSectors([...sectors, newSector]);
    }
    setShowModal(false);
  };

  const handleDeleteSector = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este setor?')) {
      setSectors(sectors.filter(sector => sector.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Setores</h1> 
        <button 
          onClick={handleAddSector}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Adicionar Novo Setor</span>
        </button>
      </div>

      {/* Sectors Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome do Setor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado em
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sectors.map((sector) => (
                <tr key={sector.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <Building2 className="text-blue-600" size={20} />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{sector.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{sector.description || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {sector.createdAt.toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEditSector(sector)}
                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteSector(sector.id)}
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

        {sectors.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Building2 size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhum setor cadastrado ainda.</p>
            <p className="text-sm">Clique em "Adicionar Novo Setor" para começar.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <SectorModal 
          sector={editingSector}
          onSave={handleSaveSector}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

interface SectorModalProps {
  sector: Sector | null;
  onSave: (sector: { name: string; description: string }) => void;
  onClose: () => void;
}

function SectorModal({ sector, onSave, onClose }: SectorModalProps) {
  const [formData, setFormData] = useState({
    name: sector?.name || '',
    description: sector?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {sector ? 'Editar Setor' : 'Adicionar Novo Setor'}
        </h3>

        <div className="max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Setor <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Recursos Humanos"
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
                placeholder="Breve descrição do setor..."
              />
            </div>
          </form>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-4">
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