import React, { useState } from 'react';
import { Download, Filter, Calendar, TrendingUp, TrendingDown, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function Reports() {
  const [dateRange, setDateRange] = useState('30days');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = ['all', 'TI', 'RH', 'Financeiro', 'Vendas', 'Marketing'];

  const kpis = [
    {
      label: 'Taxa de Conclusão',
      value: '87.5%',
      trend: 'up',
      change: '+5.2%',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Tempo Médio',
      value: '3.2 dias',
      trend: 'down',
      change: '-0.8 dias',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Admissões Ativas',
      value: '24',
      trend: 'up',
      change: '+8',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Taxa de Abandono',
      value: '12.5%',
      trend: 'down',
      change: '-2.1%',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  const stageData = [
    { stage: 'RH', inProgress: 8, completed: 15, avgTime: '1.2 dias' },
    { stage: 'Médico', inProgress: 6, completed: 12, avgTime: '2.1 dias' },
    { stage: 'DP', inProgress: 5, completed: 18, avgTime: '0.8 dias' },
    { stage: 'TI', inProgress: 3, completed: 7, avgTime: '1.5 dias' },
    { stage: 'Finalização', inProgress: 2, completed: 22, avgTime: '0.5 dias' },
  ];

  const departmentStats = [
    { name: 'TI', admissions: 12, avgTime: '3.8 dias', completion: '92%' },
    { name: 'RH', admissions: 8, avgTime: '2.1 dias', completion: '96%' },
    { name: 'Financeiro', admissions: 15, avgTime: '2.8 dias', completion: '88%' },
    { name: 'Vendas', admissions: 18, avgTime: '4.2 dias', completion: '78%' },
    { name: 'Marketing', admissions: 6, avgTime: '3.1 dias', completion: '83%' },
  ];

  const exportData = (format: 'csv' | 'excel') => {
    alert(`Exportando relatório em formato ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        
        <div className="flex items-center space-x-3">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7days">Últimos 7 dias</option>
            <option value="30days">Últimos 30 dias</option>
            <option value="90days">Últimos 3 meses</option>
            <option value="1year">Último ano</option>
          </select>

          <select 
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos os departamentos</option>
            {departments.slice(1).map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <button
            onClick={() => exportData('csv')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download size={16} />
            <span>CSV</span>
          </button>

          <button
            onClick={() => exportData('excel')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <div key={kpi.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                  <Icon className={kpi.color} size={24} />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon size={16} />
                  <span>{kpi.change}</span>
                </div>
              </div>
              
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</p>
                <p className="text-sm text-gray-600">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stage Progress */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status por Etapa</h3>
          
          <div className="space-y-4">
            {stageData.map((item) => (
              <div key={item.stage} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{item.stage}</span>
                  <span className="text-xs text-gray-500">Tempo médio: {item.avgTime}</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Em andamento: {item.inProgress}</span>
                      <span>Concluídas: {item.completed}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="h-full flex">
                        <div 
                          className="bg-yellow-500"
                          style={{ width: `${(item.inProgress / (item.inProgress + item.completed)) * 100}%` }}
                        ></div>
                        <div 
                          className="bg-green-500"
                          style={{ width: `${(item.completed / (item.inProgress + item.completed)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance por Departamento</h3>
          
          <div className="space-y-4">
            {departmentStats.map((dept) => (
              <div key={dept.name} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{dept.name}</h4>
                  <span className="text-sm text-green-600 font-medium">{dept.completion}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="block">Admissões:</span>
                    <span className="font-semibold text-gray-900">{dept.admissions}</span>
                  </div>
                  <div>
                    <span className="block">Tempo médio:</span>
                    <span className="font-semibold text-gray-900">{dept.avgTime}</span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: dept.completion }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
        
        <div className="space-y-4">
          {[
            { time: '2h atrás', action: 'João Silva finalizou admissão', status: 'success' },
            { time: '4h atrás', action: 'Maria Santos iniciou etapa Médico', status: 'info' },
            { time: '1 dia atrás', action: 'Carlos Lima aprovado no RH', status: 'success' },
            { time: '2 dias atrás', action: 'Ana Costa pendente documentação', status: 'warning' },
            { time: '3 dias atrás', action: 'Bruno Santos iniciou admissão', status: 'info' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                activity.status === 'success' ? 'bg-green-500' :
                activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.action}</p>
              </div>
              <div className="text-xs text-gray-500 flex-shrink-0">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}