import React, { useState } from 'react';
import { X, User, Lock, LogOut, Building2, Mail } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileModalProps {
  user: UserType;
  onClose: () => void;
  onUpdatePassword: (newPassword: string) => void;
  onLogout: () => void;
}

export default function ProfileModal({ user, onClose, onUpdatePassword, onLogout }: ProfileModalProps) {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }

    if (passwordData.newPassword.length < 5) {
      setPasswordError('A senha deve ter pelo menos 5 caracteres');
      return;
    }

    onUpdatePassword(passwordData.newPassword);
    setShowChangePassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Senha alterada com sucesso!');
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const handleInputChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value.toUpperCase()
    }));
    setPasswordError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <h2 className="text-lg font-semibold text-white">Perfil</h2>
          <button
            onClick={onClose}
            className="p-1 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* User Info */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.role === 'admin' ? 'Administrador' : user.sector}</p>
          </div>

          {/* User Details */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
              <Mail className="text-gray-400" size={16} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-700">E-mail</p>
                <p className="text-sm text-gray-600 truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
              <Building2 className="text-gray-400" size={16} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-700">Setor</p>
                <p className="text-sm text-gray-600 truncate">{user.sector}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={() => setShowChangePassword(true)}
              className="w-full flex items-center justify-center space-x-2 p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Lock size={16} />
              <span>Alterar Senha</span>
            </button>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center space-x-2 p-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <LogOut size={16} />
              <span>Sair do Sistema</span>
            </button>
          </div>
        </div>

        {/* Change Password Modal */}
        {showChangePassword && (
          <div className="absolute inset-0 bg-white rounded-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Alterar Senha</h3>
              <button
                onClick={() => setShowChangePassword(false)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha Atual
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase text-sm"
                  placeholder="DIGITE SUA SENHA ATUAL"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nova Senha
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase text-sm"
                  placeholder="DIGITE A NOVA SENHA"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase text-sm"
                  placeholder="CONFIRME A NOVA SENHA"
                  required
                />
              </div>

              {passwordError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                  <p className="text-red-600 text-sm">{passwordError}</p>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="flex-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Alterar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Logout Confirmation */}
        {showLogoutConfirm && (
          <div className="absolute inset-0 bg-white rounded-xl flex items-center justify-center">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <LogOut className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Saída</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Tem certeza que deseja sair do sistema?
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}