'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Activity, Filter, Download, Search, User, FileText, Trash2, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  details: string;
  type: 'info' | 'warning' | 'error' | 'success';
  ip: string;
}

export default function LogsPage() {
  const [filter, setFilter] = useState({
    type: 'all',
    module: 'all',
    search: '',
    dateStart: '',
    dateEnd: '',
  });

  const [logs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      user: 'Admin',
      action: 'Login realizado',
      module: 'Autenticação',
      details: 'Login bem-sucedido no sistema',
      type: 'success',
      ip: '192.168.1.100',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      user: 'Dr. Pedro Santos',
      action: 'Cliente cadastrado',
      module: 'Clientes',
      details: 'Novo cliente: João Silva (CPF: 123.456.789-00)',
      type: 'info',
      ip: '192.168.1.101',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      user: 'Maria Oliveira',
      action: 'Processo atualizado',
      module: 'Processos',
      details: 'Processo 0001234-56.2024 - Status alterado para "Em andamento"',
      type: 'info',
      ip: '192.168.1.102',
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      user: 'Sistema',
      action: 'Backup automático',
      module: 'Sistema',
      details: 'Backup realizado com sucesso - 2.5 GB',
      type: 'success',
      ip: 'localhost',
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
      user: 'Admin',
      action: 'Tentativa de login falhou',
      module: 'Autenticação',
      details: 'Senha incorreta - 3 tentativas',
      type: 'warning',
      ip: '192.168.1.105',
    },
    {
      id: '6',
      timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
      user: 'Sistema',
      action: 'Erro ao enviar email',
      module: 'Notificações',
      details: 'Falha ao enviar notificação para cliente@email.com',
      type: 'error',
      ip: 'localhost',
    },
  ]);

  const modules = ['all', 'Autenticação', 'Clientes', 'Processos', 'Financeiro', 'Sistema', 'Notificações'];
  const types = ['all', 'info', 'success', 'warning', 'error'];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR');
  };

  const filteredLogs = logs.filter(log => {
    if (filter.type !== 'all' && log.type !== filter.type) return false;
    if (filter.module !== 'all' && log.module !== filter.module) return false;
    if (filter.search && !log.details.toLowerCase().includes(filter.search.toLowerCase()) &&
        !log.action.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const handleExport = () => {
    alert('Exportando logs...');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Logs do Sistema</h1>
            <p className="text-gray-600 dark:text-gray-400">Auditoria e histórico de atividades</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Exportar Logs
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-cyan-500" />
            Filtros
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo
              </label>
              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'Todos' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Módulo
              </label>
              <select
                value={filter.module}
                onChange={(e) => setFilter({ ...filter, module: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
              >
                {modules.map(module => (
                  <option key={module} value={module}>
                    {module === 'all' ? 'Todos' : module}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data Início
              </label>
              <input
                type="date"
                value={filter.dateStart}
                onChange={(e) => setFilter({ ...filter, dateStart: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data Fim
              </label>
              <input
                type="date"
                value={filter.dateEnd}
                onChange={(e) => setFilter({ ...filter, dateEnd: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar nos logs..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyan-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Data/Hora</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Usuário</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Módulo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Ação</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Detalhes</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      Nenhum log encontrado
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(log.type)}
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeBadge(log.type)}`}>
                            {log.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          {log.user}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {log.module}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-md truncate">
                        {log.details}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono">
                        {log.ip}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
                <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Info</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {logs.filter(l => l.type === 'info').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sucesso</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {logs.filter(l => l.type === 'success').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avisos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {logs.filter(l => l.type === 'warning').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Erros</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {logs.filter(l => l.type === 'error').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
