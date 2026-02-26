import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Copy, Eye, GripVertical, GitBranch, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import SectorFormsModal from './SectorFormsModal';
import type { Sector, SectorForm } from '../types';

interface FormField {
  id: string;
  type: 'text' | 'number' | 'date' | 'file' | 'select' | 'checkbox' | 'signature';
  label: string;
  required: boolean;
  options?: string[];
}

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  department: string;
  fields: FormField[];
  createdAt: Date;
  createdBy: string;
}

export default function FormBuilder() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<FormTemplate | null>(null);

  const fieldTypes = [
    { value: 'text', label: 'Texto' },
    { value: 'number', label: 'Número' },
    { value: 'date', label: 'Data' },
    { value: 'file', label: 'Upload de arquivo' },
    { value: 'select', label: 'Lista de opções' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'signature', label: 'Assinatura digital' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: formsData } = await supabase
        .from('candidate_forms')
        .select('*')
        .order('created_at', { ascending: false });

      if (formsData) {
        setTemplates(formsData.map(form => ({
          id: form.id,
          name: form.name,
          description: form.description || '',
          department: form.department,
          fields: form.fields as FormField[],
          createdAt: new Date(form.created_at),
          createdBy: form.created_by,
        })));
      }

      const sectorsFromStorage = localStorage.getItem('sectors');
      if (sectorsFromStorage) {
        setSectors(JSON.parse(sectorsFromStorage));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewTemplate = () => {
    setEditingTemplate(null);
    setShowBuilder(true);
  };

  const handleEditTemplate = (template: FormTemplate) => {
    setEditingTemplate(template);
    setShowBuilder(true);
  };

  const handleDuplicateTemplate = async (template: FormTemplate) => {
    try {
      const { data, error } = await supabase
        .from('candidate_forms')
        .insert({
          name: `${template.name} - Cópia`,
          department: template.department,
          description: template.description,
          fields: template.fields,
          created_by: user?.email || 'admin',
        })
        .select()
        .single();

      if (data) {
        const newTemplate: FormTemplate = {
          id: data.id,
          name: data.name,
          description: data.description || '',
          department: data.department,
          fields: data.fields as FormField[],
          createdAt: new Date(data.created_at),
          createdBy: data.created_by,
        };
        setTemplates([newTemplate, ...templates]);
      }
    } catch (error) {
      console.error('Erro ao duplicar formulário:', error);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este formulário?')) return;

    try {
      await supabase.from('candidate_forms').delete().eq('id', id);
      setTemplates(templates.filter(t => t.id !== id));
    } catch (error) {
      console.error('Erro ao excluir formulário:', error);
    }
  };

  if (showBuilder) {
    return (
      <FormBuilderEditor
        template={editingTemplate}
        fieldTypes={fieldTypes}
        sectors={sectors}
        onSave={async (template) => {
          try {
            if (editingTemplate) {
              await supabase
                .from('candidate_forms')
                .update({
                  name: template.name,
                  department: template.department,
                  description: template.description,
                  fields: template.fields,
                })
                .eq('id', editingTemplate.id);
              setTemplates(templates.map(t =>
                t.id === editingTemplate.id ? template : t
              ));
            } else {
              const { data, error } = await supabase
                .from('candidate_forms')
                .insert({
                  name: template.name,
                  department: template.department,
                  description: template.description,
                  fields: template.fields,
                  created_by: user?.email || 'admin',
                })
                .select()
                .single();

              if (data) {
                setTemplates([{
                  ...template,
                  id: data.id,
                  createdAt: new Date(data.created_at),
                  createdBy: data.created_by,
                }, ...templates]);
              }
            }
            setShowBuilder(false);
          } catch (error) {
            console.error('Erro ao salvar formulário:', error);
          }
        }}
        onCancel={() => setShowBuilder(false)}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Formulários</h1>
        <button
          onClick={handleNewTemplate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Novo Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mt-2">
                  {template.department}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500">{template.fields.length} campos</p>
              <p className="text-xs text-gray-400">
                Criado em {template.createdAt.toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Visualizar"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="p-2 text-gray-500 hover:text-green-600 transition-colors"
                  title="Editar"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDuplicateTemplate(template)}
                  className="p-2 text-gray-500 hover:text-yellow-600 transition-colors"
                  title="Duplicar"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Plus size={48} className="mx-auto mb-4 opacity-50" />
          <p>Nenhum template criado ainda.</p>
          <p className="text-sm">Clique em "Novo Template" para começar.</p>
        </div>
      )}
    </div>
  );
}

interface FormBuilderEditorProps {
  template: FormTemplate | null;
  fieldTypes: { value: string; label: string; }[];
  sectors: Sector[];
  onSave: (template: FormTemplate) => void;
  onCancel: () => void;
}

function FormBuilderEditor({ template, fieldTypes, sectors, onSave, onCancel }: FormBuilderEditorProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    department: template?.department || '',
  });

  const [fields, setFields] = useState<FormField[]>(template?.fields || []);
  const [showSectorFormsModal, setShowSectorFormsModal] = useState(false);
  const [sectorForms, setSectorForms] = useState<SectorForm[]>([]);
  const [editingSectorForm, setEditingSectorForm] = useState<SectorForm | null>(null);
  const [activeTab, setActiveTab] = useState<'main' | string>('main');
  const [localSectors, setLocalSectors] = useState<Sector[]>(sectors || []);

  useEffect(() => {
    // Se template tem id -> carrega do supabase, caso contrário adiciona mocks para visualização
    if (template?.id) {
      loadSectorForms();
      // mantém setores vindos da prop (ou storage)
      setLocalSectors((prev) => (prev.length ? prev : sectors));
    } else {
      // Mock para visualização das abas (quando for novo template)
      const mockSectors: Sector[] = [
        { id: "1", name: "Financeiro" } as Sector,
        { id: "2", name: "Operacional" } as Sector,
      ];
      const mockSectorForms: SectorForm[] = mockSectors.map((s) => ({
        id: `mock-${s.id}`,
        candidateFormId: "mock",
        sectorId: s.id,
        name: `Formulário Setor: ${s.name}`,
        description: `Exemplo de formulário para o setor ${s.name}`,
        fields: [
          {
            id: `${s.id}-1`,
            type: "text",
            label: "Nome do Responsável",
            required: true,
          },
          {
            id: `${s.id}-2`,
            type: "date",
            label: "Data de Registro",
            required: false,
          },
        ],
        createdAt: new Date(),
        createdBy: user?.email || 'admin',
      }));

      setLocalSectors(mockSectors);
      setSectorForms(mockSectorForms);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template?.id]);

  const loadSectorForms = async () => {
    if (!template?.id) return;

    try {
      const { data } = await supabase
        .from('sector_forms')
        .select('*')
        .eq('candidate_form_id', template.id);

      if (data) {
        setSectorForms(data.map(sf => ({
          id: sf.id,
          candidateFormId: sf.candidate_form_id,
          sectorId: sf.sector_id,
          name: sf.name,
          description: sf.description || '',
          fields: sf.fields as FormField[],
          createdAt: new Date(sf.created_at),
          createdBy: sf.created_by,
        })));
      }
      // tenta carregar setores do localStorage (se você usar isso)
      const sectorsFromStorage = localStorage.getItem('sectors');
      if (sectorsFromStorage) {
        setLocalSectors(JSON.parse(sectorsFromStorage));
      }
    } catch (error) {
      console.error('Erro ao carregar formulários setoriais:', error);
    }
  };

  const addField = (type: string) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: type as FormField['type'],
      label: `Novo ${fieldTypes.find(ft => ft.value === type)?.label || type}`,
      required: false,
      options: type === 'select' ? ['Opção 1', 'Opção 2'] : undefined,
    };

    if (activeTab === 'main') {
      setFields(prev => [...prev, newField]);
    } else if (editingSectorForm) {
      setEditingSectorForm({
        ...editingSectorForm,
        fields: [...editingSectorForm.fields, newField],
      });
    }
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    if (activeTab === 'main') {
      setFields(fields.map(field =>
        field.id === id ? { ...field, ...updates } : field
      ));
    } else if (editingSectorForm) {
      setEditingSectorForm({
        ...editingSectorForm,
        fields: editingSectorForm.fields.map(field =>
          field.id === id ? { ...field, ...updates } : field
        ),
      });
    }
  };

  const deleteField = (id: string) => {
    if (activeTab === 'main') {
      setFields(fields.filter(field => field.id !== id));
    } else if (editingSectorForm) {
      setEditingSectorForm({
        ...editingSectorForm,
        fields: editingSectorForm.fields.filter(field => field.id !== id),
      });
    }
  };

  const handleSave = async () => {
    if (activeTab === 'main') {
      const templateData: FormTemplate = {
        id: template?.id || '',
        ...formData,
        fields,
        createdAt: template?.createdAt || new Date(),
        createdBy: template?.createdBy || user?.email || 'admin',
      };
      onSave(templateData);
    } else if (editingSectorForm) {
      await saveSectorForm(editingSectorForm);
    }
  };

  const saveSectorForm = async (sectorForm: SectorForm) => {
    try {
      if (sectorForm.id) {
        await supabase
          .from('sector_forms')
          .update({
            name: sectorForm.name,
            description: sectorForm.description,
            fields: sectorForm.fields,
          })
          .eq('id', sectorForm.id);

        setSectorForms(prev => prev.map(sf =>
          sf.id === sectorForm.id ? sectorForm : sf
        ));
      } else {
        const { data } = await supabase
          .from('sector_forms')
          .insert({
            candidate_form_id: template?.id,
            sector_id: sectorForm.sectorId,
            name: sectorForm.name,
            description: sectorForm.description,
            fields: sectorForm.fields,
            created_by: user?.email || 'admin',
          })
          .select()
          .single();

        if (data) {
          const newSectorForm: SectorForm = {
            id: data.id,
            candidateFormId: data.candidate_form_id,
            sectorId: data.sector_id,
            name: data.name,
            description: data.description || '',
            fields: data.fields as FormField[],
            createdAt: new Date(data.created_at),
            createdBy: data.created_by,
          };
          setSectorForms(prev => [...prev, newSectorForm]);
        }
      }
      setEditingSectorForm(null);
      setActiveTab('main');
    } catch (error) {
      console.error('Erro ao salvar formulário setorial:', error);
    }
  };

  const handleCreateSectorForm = (sectorId: string, sectorName: string) => {
    const newSectorForm: SectorForm = {
      id: '',
      candidateFormId: template?.id || '',
      sectorId,
      name: `Formulário Setor: ${sectorName}`,
      description: '',
      fields: [],
      createdAt: new Date(),
      createdBy: user?.email || 'admin',
    };
    setEditingSectorForm(newSectorForm);
    setActiveTab(`sector-${sectorId}`);
    setShowSectorFormsModal(false);
  };

  const handleEditSectorForm = (sectorForm: SectorForm) => {
    setEditingSectorForm(sectorForm);
    setActiveTab(`sector-${sectorForm.sectorId}`);
    setShowSectorFormsModal(false);
  };

  const getCurrentFields = () => {
    if (activeTab === 'main') return fields;
    if (editingSectorForm) return editingSectorForm.fields;
    const sf = sectorForms.find(s => `sector-${s.sectorId}` === activeTab || s.sectorId === activeTab);
    return sf ? sf.fields : [];
  };

  const getCurrentTitle = () => {
    if (activeTab === 'main') return template ? 'Editar Template' : 'Novo Template';
    const sf = sectorForms.find(s => `sector-${s.sectorId}` === activeTab || s.sectorId === activeTab);
    if (sf) {
      const sector = localSectors.find(s => s.id === sf.sectorId);
      return sector ? `Formulário Setor: ${sector.name}` : sf.name;
    }
    if (editingSectorForm) {
      const sector = localSectors.find(s => s.id === editingSectorForm.sectorId);
      return `Formulário Setor: ${sector?.name || ''}`;
    }
    return '';
  };

  // Mock do formulário principal do candidato para visualização, caso não haja campos
  const candidatePreviewFields: FormField[] = [
    { id: 'p1', type: 'text', label: 'Nome Completo', required: true },
    { id: 'p2', type: 'text', label: 'CPF', required: true },
    { id: 'p3', type: 'date', label: 'Data de Nascimento', required: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{getCurrentTitle()}</h1>
        <div className="flex items-center space-x-3">
          {activeTab === 'main' && (
            <button
              onClick={() => setShowSectorFormsModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <GitBranch size={18} />
              <span>Formulário Setores</span>
            </button>
          )}

          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Salvar Template
          </button>
        </div>
      </div>

      {(sectorForms.length > 0 || editingSectorForm) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <button
              onClick={() => {
                setActiveTab('main');
                setEditingSectorForm(null);
              }}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'main'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Formulário Candidato
            </button>

            {/* Abas dos formulários setoriais */}
            {sectorForms.map((sf) => {
              const sector = localSectors.find(s => s.id === sf.sectorId);
              const tabId = `sector-${sf.sectorId}`;
              return (
                <button
                  key={sf.id}
                  onClick={() => {
                    setEditingSectorForm(sf);
                    setActiveTab(tabId);
                  }}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tabId
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sector?.name || sf.name || 'Setor'}
                </button>
              );
            })}

            {/* Se estiver criando um novo setor (sem id) mostra a aba temporária */}
            {editingSectorForm && !editingSectorForm.id && (
              <button
                onClick={() => setActiveTab(`sector-${editingSectorForm.sectorId}`)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === `sector-${editingSectorForm.sectorId}`
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {localSectors.find(s => s.id === editingSectorForm.sectorId)?.name || 'Novo Setor'}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Adicionar Campos</h3>
          <div className="space-y-2">
            {fieldTypes.map((fieldType) => (
              <button
                key={fieldType.value}
                onClick={() => addField(fieldType.value)}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">{fieldType.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'main' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Informações do Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Template
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departamento
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Campos do Formulário</h3>

            {getCurrentFields().length === 0 && activeTab === 'main' && (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum campo adicionado ainda — mostraremos um preview:</p>
                <div className="mt-4 space-y-2">
                  {candidatePreviewFields.map((f) => (
                    <div key={f.id} className="p-3 border border-gray-200 rounded">
                      <div className="text-sm font-medium">{f.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {getCurrentFields().length === 0 && activeTab !== 'main' && (
              <div className="text-center py-8 text-gray-500">
                <p>Não há campos nesse formulário setorial ainda.</p>
                <p className="text-sm">Adicione campos usando a coluna à esquerda.</p>
              </div>
            )}

            <div className="space-y-4">
              {getCurrentFields().map((field) => (
                <FieldEditor
                  key={field.id}
                  field={field}
                  onUpdate={(updates) => updateField(field.id, updates)}
                  onDelete={() => deleteField(field.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {showSectorFormsModal && (
        <SectorFormsModal
          candidateFormId={template?.id || ''}
          sectors={localSectors}
          existingSectorForms={sectorForms}
          onCreateForm={handleCreateSectorForm}
          onEditForm={handleEditSectorForm}
          onClose={() => setShowSectorFormsModal(false)}
        />
      )}
    </div>
  );
}


interface FieldEditorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  onDelete: () => void;
}

function FieldEditor({ field, onUpdate, onDelete }: FieldEditorProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <GripVertical className="text-gray-400 cursor-move" size={16} />
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
            {field.type}
          </span>
        </div>
        <button
          onClick={onDelete}
          className="text-gray-500 hover:text-red-600 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Label do Campo
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center justify-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => onUpdate({ required: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Campo Obrigatório</span>
          </label>
        </div>
      </div>

      {field.type === 'select' && field.options && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Opções (uma por linha)
          </label>
          <textarea
            value={field.options.join('\n')}
            onChange={(e) => onUpdate({ options: e.target.value.split('\n').filter(Boolean) })}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}
    </div>
  ); 
}