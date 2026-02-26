import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  GitBranch, 
  FileText, 
  Users, 
  Building2, 
  UserCog, 
  BarChart3,
  Briefcase,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ActiveView } from '../App';
import ProfileModal from './ProfileModal';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

// ✅ Mantivemos toda a estrutura, apenas ajustamos a posição do "Perfil de Acesso"
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'workflow', label: 'Fluxos de Etapas', icon: GitBranch },
  { id: 'forms', label: 'Formulários', icon: FileText },
  { id: 'admissions', label: 'Admissões', icon: Users },
  { id: 'jobs', label: 'Publicar Vagas', icon: Briefcase },
  { id: 'candidates', label: 'Candidatos', icon: UserCheck },
  { id: 'sectors', label: 'Setores', icon: Building2 },
  { id: 'users', label: 'Usuários', icon: UserCog },

  // 👇 Adicionado logo abaixo de "Usuários"
  { id: 'access-profiles', label: 'Perfil de Acesso', icon: Shield },

  { id: 'reports', label: 'Relatórios', icon: BarChart3 },
];

export default function Sidebar({ activeView, setActiveView, isCollapsed, setIsCollapsed }: SidebarProps) {
  const { currentUser, logout, updatePassword, hasMenuAccess } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Filtra itens do menu conforme as permissões
  const visibleMenuItems = menuItems.filter(item => hasMenuAccess(item.id));

  return (
    <>
      <div
        className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-30
          ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {!isCollapsed && (
            <div>
              <h2 className="text-xl font-bold text-blue-400">Admissão Digital</h2>
              <p className="text-xs text-slate-400 mt-1">
                {currentUser?.name} ({currentUser?.sector})
              </p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Menu lateral */}
        <nav className="mt-6 space-y-1 overflow-y-auto">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as ActiveView)}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-slate-800 transition-colors
                  ${isActive ? 'bg-blue-600 border-r-4 border-blue-400' : ''}
                  ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Botão do perfil */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={() => setShowProfileModal(true)}
              className="w-full flex items-center px-4 py-3 text-left hover:bg-slate-800 transition-colors rounded-lg text-slate-300"
            >
              <UserIcon size={20} className="flex-shrink-0" />
              <span className="ml-3 font-medium">Perfil</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal do perfil */}
      {showProfileModal && currentUser && (
        <ProfileModal
          user={currentUser}
          onClose={() => setShowProfileModal(false)}
          onUpdatePassword={updatePassword}
          onLogout={logout}
        />
      )}
    </>
  );
}
