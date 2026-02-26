import React, { useState, useEffect } from 'react';
import { GitBranch, Plus, Edit } from 'lucide-react';
import { Sector, SectorForm } from '../types';

interface SectorFormsModalProps {
  candidateFormId: string;
  sectors: Sector[];
  existingSectorForms: SectorForm[];
  onCreateForm: (sectorId: string, sectorName: string) => void;
  onEditForm: (sectorForm: SectorForm) => void;
  onClose: () => void;
}

export default function SectorFormsModal({
  candidateFormId,
  sectors,
  existingSectorForms,
  onCreateForm,
  onEditForm,
  onClose,
}: SectorFormsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GitBranch className="text-blue-600" size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Formulários por Setor</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {sectors.map((sector) => {
              const existingForm = existingSectorForms.find(
                (sf) => sf.sectorId === sector.id && sf.candidateFormId === candidateFormId
              );

              return (
                <div
                  key={sector.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{sector.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{sector.description}</p>
                      {existingForm && (
                        <span className="inline-block mt-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                          Formulário criado
                        </span>
                      )}
                    </div>
                    <div>
                      {existingForm ? (
                        <button
                          onClick={() => onEditForm(existingForm)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <Edit size={16} />
                          <span>Editar Formulário</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onCreateForm(sector.id, sector.name)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                        >
                          <Plus size={16} />
                          <span>Criar Formulário</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {sectors.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <GitBranch size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhum setor cadastrado ainda.</p>
              <p className="text-sm">Cadastre setores primeiro na tela de Setores.</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
