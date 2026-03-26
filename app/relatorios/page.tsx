'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { FileText, Download, Filter, Calendar, Users, DollarSign, Scale, TrendingUp, Printer, Mail } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  description: string;
  category: 'financeiro' | 'processos' | 'clientes' | 'geral';
  icon: any;
}

export default function RelatoriosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const reports: Report[] = [
    {
      id: '1',
      name: 'Receitas e Despesas',
      description: 'Relatório completo de movimentações financeiras',
      category: 'financeiro',
      icon: DollarSign,
    },
    {
      id: '2',
      name: 'Fluxo de Caixa',
      description: 'Análise detalhada do fluxo de caixa por período',
      category: 'financeiro',
      icon: TrendingUp,
    },
    {
      id: '3',
      name: 'Contas a Receber',
      description: 'Listagem de valores pendentes de recebimento',
      category: 'financeiro',
      icon: DollarSign,
    },
    {
      id: '4',
      name: 'Contas a Pagar',
      description: 'Listagem de despesas pendentes',
      category: 'financeiro',
      icon: DollarSign,
    },
    {
      id: '5',
      name: 'Processos em Andamento',
      description: 'Lista completa de processos ativos',
      category: 'processos',
      icon: Scale,
    },
    {
      id: '6',
      name: 'Processos por Status',
      description: 'Análise de processos agrupados por status',
      category: 'processos',
      icon: Scale,
    },
    {
      id: '7',
      name: 'Prazos Processuais',
      description: 'Relatório de prazos vencidos e a vencer',
      category: 'processos',
      icon: Calendar,
    },
    {
      id: '8',
      name: 'Audiências Agendadas',
      description: 'Calendário de audiências por período',
      category: 'processos',
      icon: Calendar,
    },
    {
      id: '9',
      name: 'Clientes Ativos',
      description: 'Lista de clientes com processos ativos',
      category: 'clientes',
      icon: Users,
    },
    {
      id: '10',
      name: 'Novos Clientes',
      description: 'Clientes cadastrados no período',
      category: 'clientes',
      icon: Users,
    },
    {
      id: '11',
      name: 'Honorários por Cliente',
      description: 'Análise de honorários recebidos por cliente',
      category: 'clientes',
      icon: DollarSign,
    },
    {
      id: '12',
      name: 'Produtividade',
      description: 'Relatório de horas trabalhadas e produtividade',
      category: 'geral',
      icon: TrendingUp,
    },
    {
      id: '13',
      name: 'Atividades Realizadas',
      description: 'Histórico de atividades e tarefas concluídas',
      category: 'geral',
      icon: FileText,
    },
    {
      id: '14',
      name: 'Contratos Gerados',
      description: 'Lista de contratos criados no período',
      category: 'geral',
      icon: FileText,
    },
  ];

  const categories = [
    { id: 'all', label: 'Todos', icon: FileText },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'processos', label: 'Processos', icon: Scale },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'geral', label: 'Geral', icon: TrendingUp },
  ];

  const filteredReports = selectedCategory === 'all'
    ? reports
    : reports.filter(r => r.category === selectedCategory);

  const handleGenerateReport = (reportId: string) => {
    alert(`Gerando relatório ${reportId}...\nPeríodo: ${dateRange.start} a ${dateRange.end}`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Relatórios</h1>
          <p className="text-gray-600 dark:text-gray-400">Gere relatórios personalizados do sistema</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-cyan-500" />
            Filtros
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data Início
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data Fim
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => {
            const Icon = report.icon;
            return (
              <div
                key={report.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
                    <Icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {report.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {report.description}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleGenerateReport(report.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Gerar PDF
                      </button>
                      <button
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        title="Imprimir"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        title="Enviar por email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredReports.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
            <p className="text-gray-500 dark:text-gray-400">Nenhum relatório encontrado nesta categoria</p>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded">
          <div className="flex items-start">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Dica</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Os relatórios são gerados em tempo real com base nos dados do sistema. 
                Use os filtros de data para personalizar o período desejado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
