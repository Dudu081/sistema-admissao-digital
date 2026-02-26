import React, { useState } from 'react';
import { Building2, User, Lock, Eye, EyeOff, HelpCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (credentials: { ambiente: string; usuario: string; senha: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [formData, setFormData] = useState({
    ambiente: '',
    usuario: '',
    senha: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.toUpperCase()
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular delay de autenticação
    setTimeout(() => {
      const success = onLogin(formData);
      if (!success) {
        setError('Credenciais inválidas. Verifique os dados e tente novamente.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setTimeout(() => {
      alert('Entre em contato com o administrador do sistema para recuperar sua senha.');
      setShowForgotPassword(false);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="text-blue-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Sistema de Admissão Digital</h1>
          <p className="text-blue-100 text-sm">Acesso Digital No-Code</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ambiente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ambiente
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  value={formData.ambiente}
                  onChange={(e) => handleInputChange('ambiente', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors uppercase placeholder-gray-400"
                  placeholder="DIGITE O AMBIENTE"
                  required
                />
              </div>
            </div>

            {/* Usuário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  value={formData.usuario}
                  onChange={(e) => handleInputChange('usuario', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors uppercase placeholder-gray-400"
                  placeholder="DIGITE SEU USUÁRIO"
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-400" size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.senha}
                  onChange={(e) => handleInputChange('senha', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors uppercase placeholder-gray-400"
                  placeholder="DIGITE SUA SENHA"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                'Entrar no Sistema'
              )}
            </button>

            {/* Forgot Password */}

        {/* Portal Button */}
        <div className="text-center">
          <button
            onClick={() => window.location.href = '/PortalCandidato'}
            className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors w-full"
          >
            Acessar Portal
          </button>
        </div>
            <div className="text-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={showForgotPassword}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors flex items-center justify-center space-x-1 mx-auto"
              >
                <HelpCircle size={16} />
                <span>Esqueceu a senha?</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center">
          {/* Acessos de Teste */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg text-left">
            <p className="text-xs font-medium text-gray-700 mb-2">Acessos de teste (ambiente: MOBCODE):</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><span className="font-medium">Seleção</span> → usuário: <span className="font-mono bg-white px-1 rounded">SELEÇÃO</span> | senha: <span className="font-mono bg-white px-1 rounded">12345</span></p>
              <p><span className="font-medium">RH</span> → usuário: <span className="font-mono bg-white px-1 rounded">RH</span> | senha: <span className="font-mono bg-white px-1 rounded">12345</span></p>
              <p><span className="font-medium">Médico</span> → usuário: <span className="font-mono bg-white px-1 rounded">MÉDICO</span> | senha: <span className="font-mono bg-white px-1 rounded">12345</span></p>
              <p><span className="font-medium">DP</span> → usuário: <span className="font-mono bg-white px-1 rounded">DP</span> | senha: <span className="font-mono bg-white px-1 rounded">12345</span></p>
            </div>
          </div>
          
          <p className="text-xs text-gray-500">
            © 2024 Sistema de Admissão Digital. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}