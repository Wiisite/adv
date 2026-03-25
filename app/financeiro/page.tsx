'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Edit, Trash2, X, Search, DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface Lancamento {
  id: string;
  type: 'receita' | 'despesa';
  description: string;
  value: number;
  category: string;
  payment_method: string;
  date: string;
  client?: string;
  status: 'pago' | 'pendente' | 'atrasado';
  created_at: string;
}

export default function FinanceiroPage() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([
    {
      id: '1',
      type: 'receita',
      description: 'Honorários - Processo Trabalhista',
      value: 5000,
      category: 'Honorários',
      payment_method: 'PIX',
      date: '2024-03-20',
      client: 'João Silva',
      status: 'pago',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'despesa',
      description: 'Aluguel do Escritório',
      value: 3000,
      category: 'Despesas Fixas',
      payment_method: 'Boleto',
      date: '2024-03-15',
      status: 'pago',
      created_at: new Date().toISOString(),
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingLancamento, setEditingLancamento] = useState<Lancamento | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'receita' | 'despesa'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pago' | 'pendente' | 'atrasado'>('all');
  const [formData, setFormData] = useState({
    type: 'receita' as 'receita' | 'despesa',
    description: '',
    value: '',
    category: '',
    payment_method: '',
    date: new Date().toISOString().split('T')[0],
    client: '',
    status: 'pendente' as 'pago' | 'pendente' | 'atrasado',
  });

  const resetForm = () => {
    setFormData({
      type: 'receita',
      description: '',
      value: '',
      category: '',
      payment_method: '',
      date: new Date().toISOString().split('T')[0],
      client: '',
      status: 'pendente',
    });
    setEditingLancamento(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLancamento: Lancamento = {
      id: editingLancamento?.id || Date.now().toString(),
      type: formData.type,
      description: formData.description,
      value: parseFloat(formData.value),
      category: formData.category,
      payment_method: formData.payment_method,
      date: formData.date,
      client: formData.client,
      status: formData.status,
      created_at: editingLancamento?.created_at || new Date().toISOString(),
    };

    if (editingLancamento) {
      setLancamentos(lancamentos.map(l => l.id === editingLancamento.id ? newLancamento : l));
    } else {
      setLancamentos([...lancamentos, newLancamento]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (lancamento: Lancamento) => {
    setEditingLancamento(lancamento);
    setFormData({
      type: lancamento.type,
      description: lancamento.description,
      value: lancamento.value.toString(),
      category: lancamento.category,
      payment_method: lancamento.payment_method,
      date: lancamento.date,
      client: lancamento.client || '',
      status: lancamento.status,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este lançamento?')) {
      setLancamentos(lancamentos.filter(l => l.id !== id));
    }
  };

  const filteredLancamentos = lancamentos.filter(lancamento => {
    const matchSearch = lancamento.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       lancamento.client?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || lancamento.type === filterType;
    const matchStatus = filterStatus === 'all' || lancamento.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const totalReceitas = lancamentos
    .filter(l => l.type === 'receita' && l.status === 'pago')
    .reduce((sum, l) => sum + l.value, 0);

  const totalDespesas = lancamentos
    .filter(l => l.type === 'despesa' && l.status === 'pago')
    .reduce((sum, l) => sum + l.value, 0);

  const saldo = totalReceitas - totalDespesas;

  const receitasPendentes = lancamentos
    .filter(l => l.type === 'receita' && l.status === 'pendente')
    .reduce((sum, l) => sum + l.value, 0);

  const despesasPendentes = lancamentos
    .filter(l => l.type === 'despesa' && l.status === 'pendente')
    .reduce((sum, l) => sum + l.value, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
            <p className="text-gray-600">Gerencie receitas e despesas</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Lançamento
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Receitas</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Despesas</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saldo</p>
                <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">A Receber</p>
                <p className="text-2xl font-bold text-yellow-600">
                  R$ {receitasPendentes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">A Pagar</p>
                <p className="text-2xl font-bold text-orange-600">
                  R$ {despesasPendentes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">Todos os Tipos</option>
                <option value="receita">Receitas</option>
                <option value="despesa">Despesas</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">Todos os Status</option>
                <option value="pago">Pago</option>
                <option value="pendente">Pendente</option>
                <option value="atrasado">Atrasado</option>
              </select>

              <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                Filtrar
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyan-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Data</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Descrição</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Categoria</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Forma Pgto</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Valor</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLancamentos.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                      Nenhum lançamento encontrado
                    </td>
                  </tr>
                ) : (
                  filteredLancamentos.map((lancamento) => (
                    <tr key={lancamento.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(lancamento.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          lancamento.type === 'receita' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {lancamento.type === 'receita' ? 'Receita' : 'Despesa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{lancamento.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{lancamento.client || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{lancamento.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{lancamento.payment_method}</td>
                      <td className={`px-6 py-4 text-sm font-semibold ${
                        lancamento.type === 'receita' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {lancamento.type === 'receita' ? '+' : '-'} R$ {lancamento.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          lancamento.status === 'pago' 
                            ? 'bg-green-100 text-green-800' 
                            : lancamento.status === 'pendente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {lancamento.status.charAt(0).toUpperCase() + lancamento.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(lancamento)}
                            className="p-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(lancamento.id)}
                            className="p-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editingLancamento ? 'Editar Lançamento' : 'Novo Lançamento'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'receita' | 'despesa' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="receita">Receita</option>
                    <option value="despesa">Despesa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Descrição do lançamento"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor (R$) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="0,00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Selecionar</option>
                    {formData.type === 'receita' ? (
                      <>
                        <option>Honorários</option>
                        <option>Consultoria</option>
                        <option>Outros Serviços</option>
                      </>
                    ) : (
                      <>
                        <option>Despesas Fixas</option>
                        <option>Salários</option>
                        <option>Impostos</option>
                        <option>Material de Escritório</option>
                        <option>Outros</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Forma de Pagamento <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Selecionar</option>
                    <option>Dinheiro</option>
                    <option>PIX</option>
                    <option>Cartão de Crédito</option>
                    <option>Cartão de Débito</option>
                    <option>Boleto</option>
                    <option>Transferência</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="pago">Pago</option>
                    <option value="pendente">Pendente</option>
                    <option value="atrasado">Atrasado</option>
                  </select>
                </div>

                {formData.type === 'receita' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                    <input
                      type="text"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Nome do cliente"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
