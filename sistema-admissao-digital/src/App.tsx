import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WorkflowBuilder from './components/WorkflowBuilder';
import FormBuilder from './components/FormBuilder';
import AdmissionsManager from './components/AdmissionsManager';
import SectorsManager from './components/SectorsManager';
import UsersManager from './components/UsersManager';
import Reports from './components/Reports';
import JobPostings from './components/JobPostings';
import CandidatesManager from './components/CandidatesManager';
import CandidatePortal from './components/CandidatePortal';
import AccessProfilesManager from './components/AccessProfilesManager';

export type ActiveView = 'dashboard' | 'workflow' | 'forms' | 'admissions' | 'sectors' | 'users' | 'access-profiles' | 'reports' | 'jobs' | 'candidates';

function AppContent() {
  const { isAuthenticated, login } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Verificar se é o portal do candidato
  const isPortalRoute = window.location.pathname === '/PortalCandidato';
  
  if (isPortalRoute) {
    return <CandidatePortal />;
  }
  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'workflow':
        return <WorkflowBuilder />;
      case 'forms':
        return <FormBuilder />;
      case 'admissions':
        return <AdmissionsManager />;
      case 'sectors':
        return <SectorsManager />;
      case 'users':
        return <UsersManager />;
      case 'access-profiles':
        return <AccessProfilesManager />;
      case 'reports':
        return <Reports />;
      case 'jobs':
        return <JobPostings />;
      case 'candidates':
        return <CandidatesManager />;
     
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <main className={`flex-1 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <div className="p-6">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;