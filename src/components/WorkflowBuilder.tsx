import React, { useState } from 'react';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  sector: string;
  required: boolean;
  order: number;
}

export default function WorkflowBuilder() {
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { id: '1', name: 'Entrevista RH', description: 'Entrevista inicial com RH', sector: 'Recursos Humanos', required: true, order: 1 },
    { id: '2', name: 'Exame Médico', description: 'Exame médico admissional', sector: 'Médico', required: true, order: 2 },
    { id: '3', name: 'Documentação', description: 'Entrega de documentos', sector: 'DP', required: true, order: 3 },
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);

  const sectors = ['Recursos Humanos', 'Médico', 'DP', 'TI', 'Financeiro'];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update order numbers
        return newItems.map((item, index) => ({
          ...item,
          order: index + 1
        }));
      });
    }
  };

  const handleAddStep = () => {
    setEditingStep(null);
    setShowModal(true);
  };

  const handleEditStep = (step: WorkflowStep) => {
    setEditingStep(step);
    setShowModal(true);
  };

  const handleSaveStep = (stepData: Partial<WorkflowStep>) => {
    if (editingStep) {
      setSteps(steps.map(step => 
        step.id === editingStep.id ? { ...step, ...stepData } : step
      ));
    } else {
      const newStep: WorkflowStep = {
        id: Date.now().toString(),
        name: stepData.name || '',
        description: stepData.description || '',
        sector: stepData.sector || sectors[0],
        required: stepData.required || false,
        order: steps.length + 1,
      };
      setSteps([...steps, newStep]);
    }
    setShowModal(false);
  };

  const handleDeleteStep = (id: string) => {
    const updatedSteps = steps
      .filter(step => step.id !== id)
      .map((step, index) => ({ ...step, order: index + 1 }));
    setSteps(updatedSteps);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Fluxos de Etapas</h1>
        <button 
          onClick={handleAddStep}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Adicionar Etapa</span>
        </button>
      </div>

      {/* Workflow Canvas */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Fluxo de Admissão</h2>
          <div className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
            💡 Arraste e solte para reordenar as etapas
          </div>
        </div>
        
        {steps.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Settings size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhuma etapa criada ainda.</p>
            <p className="text-sm">Clique em "Adicionar Etapa" para começar.</p>
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={steps.map(step => step.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <SortableStepItem
                    key={step.id}
                    step={step}
                    index={index}
                    onEdit={() => handleEditStep(step)}
                    onDelete={() => handleDeleteStep(step.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <StepModal 
          step={editingStep}
          sectors={sectors}
          onSave={handleSaveStep}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

interface SortableStepItemProps {
  step: WorkflowStep;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableStepItem({ step, index, onEdit, onDelete }: SortableStepItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-200 ${
        isDragging ? 'opacity-50 shadow-lg scale-105 border-blue-500 bg-blue-50' : ''
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 rounded-lg hover:bg-gray-200 transition-colors"
        title="Arraste para reordenar"
      >
        <div className="flex flex-col space-y-1">
          <div className="w-4 h-0.5 bg-gray-400 rounded"></div>
          <div className="w-4 h-0.5 bg-gray-400 rounded"></div>
          <div className="w-4 h-0.5 bg-gray-400 rounded"></div>
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
            {index + 1}
          </span>
          <h3 className="font-semibold text-gray-900">{step.name}</h3>
          {step.required && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
              Obrigatória
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
        <p className="text-xs text-gray-500 mt-1">Setor: {step.sector}</p>
      </div>

      <div className="flex items-center space-x-2">
        <button 
          onClick={onEdit}
          className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
          title="Editar etapa"
        >
          <Edit size={16} />
        </button>
        <button 
          onClick={onDelete}
          className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
          title="Excluir etapa"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

interface StepModalProps {
  step: WorkflowStep | null;
  sectors: string[];
  onSave: (step: Partial<WorkflowStep>) => void;
  onClose: () => void;
}

function StepModal({ step, sectors, onSave, onClose }: StepModalProps) {
  const [formData, setFormData] = useState({
    name: step?.name || '',
    description: step?.description || '',
    sector: step?.sector || sectors[0],
    required: step?.required || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {step ? 'Editar Etapa' : 'Adicionar Etapa'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Setor
            </label>
            <select 
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Etapa
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
              Descrição da Etapa
            </label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox"
                checked={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Etapa Obrigatória</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}