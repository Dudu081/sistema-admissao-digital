import React from 'react';
import { Users, FileText, CheckCircle, Clock, TrendingUp, Building2 } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Admissões Ativas', value: '24', icon: Users, color: 'bg-blue-500', change: '+12%' },
    { label: 'Formulários Criados', value: '8', icon: FileText, color: 'bg-green-500', change: '+3' },
    { label: 'Concluídas Este Mês', value: '156', icon: CheckCircle, color: 'bg-emerald-500', change: '+18%' },
    { label: 'Tempo Médio', value: '3.2 dias', icon: Clock, color: 'bg-orange-500', change: '-0.5 dias' },
  ];

  const recentActivity = [
    { name: 'João Silva', action: 'Concluiu etapa RH', time: '2min atrás', status: 'success' },
    { name: 'Maria Santos', action: 'Iniciou admissão', time: '15min atrás', status: 'info' },
    { name: 'Carlos Lima', action: 'Pendente assinatura', time: '1h atrás', status: 'warning' },
    { name: 'Ana Costa', action: 'Admissão finalizada', time: '2h atrás', status: 'success' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Última atualização: {new Date().toLocaleString('pt-BR')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Admissões por Etapa</h3>
          <div className="space-y-4">
            {[
              { stage: 'RH', count: 8, total: 24, color: 'bg-blue-500' },
              { stage: 'Médico', count: 6, total: 24, color: 'bg-green-500' },
              { stage: 'DP', count: 5, total: 24, color: 'bg-purple-500' },
              { stage: 'Finalização', count: 5, total: 24, color: 'bg-orange-500' },
            ].map((item) => (
              <div key={item.stage} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.stage}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${(item.count / item.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{item.count}/{item.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.name}</p>
                    <p className="text-xs text-gray-500">{activity.action}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}