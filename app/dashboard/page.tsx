'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { TrendingUp, TrendingDown, DollarSign, Users, FileText, Calendar } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    clientes: 14,
    despesas: 350.00,
    receber: 83356.00,
    saldo: 0.00
  });

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Clientes Cadastrados</h3>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.clientes}</p>
            <p className="text-sm text-gray-500 mt-2">Total de clientes</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Despesas Vencidas</h3>
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-red-600">R$ {stats.despesas.toFixed(2)}</p>
            <p className="text-sm text-red-500 mt-2">Pagos Vencidos: R$ 0,00</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Receber Vencidos</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">R$ {stats.receber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="text-sm text-green-500 mt-2">Recebido Vencidos: R$ 0,00</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Saldo no Mês</h3>
              <DollarSign className="w-5 h-5 text-cyan-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">R$ {stats.saldo.toFixed(2)}</p>
            <p className="text-sm text-cyan-500 mt-2 bg-cyan-50 px-2 py-1 rounded inline-block">Saldo Mês</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">RECEBIMENTOS / DESPESAS 2026</h2>
          <div className="h-64 flex items-end justify-between gap-4">
            {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((month, index) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col gap-1">
                  {index === 1 && (
                    <div className="w-full bg-green-500 rounded" style={{ height: '120px' }}></div>
                  )}
                  {index !== 1 && (
                    <div className="w-full bg-gray-200 rounded" style={{ height: '20px' }}></div>
                  )}
                </div>
                <span className="text-xs text-gray-600">{month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Total Recebido</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Total Pago</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
