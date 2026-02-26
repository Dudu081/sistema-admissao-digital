import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

// Usuários pré-cadastrados para teste com permissões por setor
const testUsers = [
  {
    id: 'selecao',
    name: 'Administrador Seleção',
    email: 'selecao@mobcode.com',
    sector: 'Seleção',
    role: 'admin' as const,
    username: 'SELEÇÃO',
    password: '12345',
    accessProfileId: '1',
    createdAt: new Date(),
    // ✅ Permissões completas (admin total)
    permissions: [
      'dashboard',
      'workflow',
      'forms',
      'admissions',
      'jobs',
      'candidates',
      'sectors',
      'users',
      'access-profiles', // ← corrigido
      'reports',
    ],
  },
  {
    id: 'rh',
    name: 'Ana Costa Silva',
    email: 'ana.costa@mobcode.com',
    sector: 'RH',
    role: 'sector_user' as const,
    username: 'RH',
    password: '12345',
    accessProfileId: '2',
    createdAt: new Date(),
    // RH tem acesso apenas a Admissões
    permissions: ['admissions'],
  },
  {
    id: 'medico',
    name: 'Dr. Carlos Santos',
    email: 'carlos.santos@mobcode.com',
    sector: 'Médico',
    role: 'sector_user' as const,
    username: 'MÉDICO',
    password: '12345',
    accessProfileId: '3',
    createdAt: new Date(),
    // Médico tem acesso apenas a Admissões
    permissions: ['admissions'],
  },
  {
    id: 'dp',
    name: 'Maria Oliveira Santos',
    email: 'maria.oliveira@mobcode.com',
    sector: 'DP',
    role: 'sector_user' as const,
    username: 'DP',
    password: '12345',
    accessProfileId: '4',
    createdAt: new Date(),
    // DP tem acesso apenas a Admissões
    permissions: ['admissions'],
  },
];

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAdmin: boolean;
  isMaster: boolean;
  isAuthenticated: boolean;
  login: (credentials: { ambiente: string; usuario: string; senha: string }) => boolean;
  logout: () => void;
  updatePassword: (newPassword: string) => void;
  hasMenuAccess: (menuItem: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isAdmin = currentUser?.role === 'admin';
  const isMaster = currentUser?.sector === 'Seleção';

  const login = (credentials: { ambiente: string; usuario: string; senha: string }) => {
    if (credentials.ambiente !== 'MOBCODE') {
      return false;
    }

    const user = testUsers.find(
      (u) => u.username === credentials.usuario && u.password === credentials.senha
    );

    if (user) {
      const loggedUser: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        sector: user.sector,
        role: user.role,
        createdAt: user.createdAt,
      };

      setCurrentUser(loggedUser);
      setIsAuthenticated(true);

      // Persistência local
      localStorage.setItem('currentUser', JSON.stringify(loggedUser));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userPermissions', JSON.stringify(user.permissions));

      return true;
    }

    return false;
  };

 const hasMenuAccess = (menuItem: string) => {
  if (!currentUser) return false;

  // 1️⃣ Libera tudo para o setor "Seleção" (admin)
  if (currentUser.sector === 'Seleção') {
    return true;
  }

  // 2️⃣ Pega as permissões do localStorage (vindas do perfil de acesso)
  const savedPermissions = localStorage.getItem('userPermissions');
  if (!savedPermissions) return false;

  const permissions = JSON.parse(savedPermissions);

  // 3️⃣ Retorna true apenas se o item estiver na lista de permissões
  return Array.isArray(permissions) && permissions.includes(menuItem);
};



  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userPermissions');
  };

  const updatePassword = (newPassword: string) => {
    console.log('Senha atualizada para:', newPassword);
  };

  React.useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedAuth = localStorage.getItem('isAuthenticated');

    if (savedUser && savedAuth === 'true') {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAdmin,
        isMaster,
        isAuthenticated,
        login,
        logout,
        updatePassword,
        hasMenuAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
