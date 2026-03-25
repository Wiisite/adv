'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { TrendingUp, TrendingDown, DollarSign, Users, FileText, Calendar, AlertCircle, CheckCircle, Clock, Scale } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    clientes: 14,
    despesas: 350.00,
    receber: 83356.00,
    saldo: 0.00,
    processos: 8,
    audiencias: 3,
    prazos: 5,
    tarefas: 12
  });

  const monthlyData = [
    { month: 'Jan', receitas: 0, despesas: 0 },
    { month: 'Fev', receitas: 85000, despesas: 12000 },
    { month: 'Mar', receitas: 45000, despesas: 8000 },
    { month: 'Abr', receitas: 0, despesas: 0 },
    { month: 'Mai', receitas: 0, despesas: 0 },
    { month: 'Jun', receitas: 0, despesas: 0 },
    { month: 'Jul', receitas: 0, despesas: 0 },
    { month: 'Ago', receitas: 0, despesas: 0 },
    { month: 'Set', receitas: 0, despesas: 0 },
    { month: 'Out', receitas: 0, despesas: 0 },
    { month: 'Nov', receitas: 0, despesas: 0 },
    { month: 'Dez', receitas: 0, despesas: 0 },
  ];

  const maxValue = Math.max(...monthlyData.map(d => Math.max(d.receitas, d.despesas)));

  const alerts = [
    { id: 1, type: 'warning', message: 'Prazo processual vence em 2 dias', link: '/processos' },
    { id: 2, type: 'info', message: 'Audiência agendada para amanhã às 14h', link: '/audiencias' },
    { id: 3, type: 'success', message: 'Pagamento de R$ 5.000 recebido', link: '/financeiro' },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (!response.ok) {
          router.push('/login');
          return;
        }
        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Visão geral do sistema</p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Última atualização: {new Date().toLocaleString('pt-BR')}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Clientes</h3>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.clientes}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Total cadastrados</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Processos</h3>
              <Scale className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.processos}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Em andamento</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Audiências</h3>
              <Calendar className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.audiencias}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Próximos 7 dias</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Prazos</h3>
              <Clock className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.prazos}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Vencendo em breve</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Despesas Vencidas</h3>
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-600">R$ {stats.despesas.toFixed(2)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Pagos: R$ 0,00</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">A Receber</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">R$ {stats.receber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Recebido: R$ 0,00</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Saldo do Mês</h3>
              <DollarSign className="w-5 h-5 text-cyan-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">R$ {stats.saldo.toFixed(2)}</p>
            <p className="text-xs text-cyan-500 mt-2">Março 2026</p>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Alertas Importantes</h3>
              <div className="mt-2 space-y-2">
                {alerts.map(alert => (
                  <div key={alert.id} className="flex items-center justify-between">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">{alert.message}</p>
                    <a href={alert.link} className="text-xs text-yellow-600 dark:text-yellow-400 hover:underline">Ver</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Receitas vs Despesas 2026</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {monthlyData.map((data, index) => {
              const receitaHeight = maxValue > 0 ? (data.receitas / maxValue) * 100 : 0;
              const despesaHeight = maxValue > 0 ? (data.despesas / maxValue) * 100 : 0;
              
              return (
                <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col gap-1 items-center">
                    {data.receitas > 0 && (
                      <div 
                        className="w-full bg-green-500 rounded hover:bg-green-600 transition-colors cursor-pointer" 
                        style={{ height: `${receitaHeight}%`, minHeight: receitaHeight > 0 ? '8px' : '0' }}
                        title={`Receitas: R$ ${data.receitas.toLocaleString('pt-BR')}`}
                      ></div>
                    )}
                    {data.despesas > 0 && (
                      <div 
                        className="w-full bg-red-500 rounded hover:bg-red-600 transition-colors cursor-pointer" 
                        style={{ height: `${despesaHeight}%`, minHeight: despesaHeight > 0 ? '8px' : '0' }}
                        title={`Despesas: R$ ${data.despesas.toLocaleString('pt-BR')}`}
                      ></div>
                    )}
                    {data.receitas === 0 && data.despesas === 0 && (
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded" style={{ height: '8px' }}></div>
                    )}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{data.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Receitas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Despesas</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Atividades Recentes</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-gray-100">Novo cliente cadastrado</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Há 2 horas</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-gray-100">Contrato gerado</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Há 5 horas</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-gray-100">Audiência agendada</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ontem</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Tarefas Pendentes</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-900 dark:text-gray-100">Revisar petição inicial</span>
                </div>
                <span className="text-xs text-red-500">Urgente</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-900 dark:text-gray-100">Ligar para cliente</span>
                </div>
                <span className="text-xs text-yellow-500">Hoje</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-900 dark:text-gray-100">Preparar documentos</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Amanhã</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
