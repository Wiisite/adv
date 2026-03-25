'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Edit, Trash2, X, Search, DollarSign, TrendingUp, TrendingDown, Calendar, Building } from 'lucide-react';

interface Movimento {
  id: string;
  type: 'entrada' | 'saida';
  description: string;
  value: number;
  category: string;
  payment_method: string;
  date: string;
  user?: string;
  created_at: string;
}

export default function CaixasPage() {
  const [movimentos, setMovimentos] = useState<Movimento[]>([
    {
      id: '1',
      type: 'entrada',
      description: 'Abertura de Caixa',
      value: 1000,
      category: 'Abertura',
      payment_method: 'Dinheiro',
      date: new Date().toISOString().split('T')[0],
      user: 'Admin',
      created_at: new Date().toISOString(),
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingMovimento, setEditingMovimento] = useState<Movimento | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'entrada' | 'saida'>('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    type: 'entrada' as 'entrada' | 'saida',
    description: '',
    value: '',
    category: '',
    payment_method: 'Dinheiro',
    date: new Date().toISOString().split('T')[0],
    user: '',
  });

  const resetForm = () => {
    setFormData({
      type: 'entrada',
      description: '',
      value: '',
      category: '',
      payment_method: 'Dinheiro',
      date: new Date().toISOString().split('T')[0],
      user: '',
    });
    setEditingMovimento(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMovimento: Movimento = {
      id: editingMovimento?.id || Date.now().toString(),
      type: formData.type,
      description: formData.description,
      value: parseFloat(formData.value),
      category: formData.category,
      payment_method: formData.payment_method,
      date: formData.date,
      user: formData.user,
      created_at: editingMovimento?.created_at || new Date().toISOString(),
    };

    if (editingMovimento) {
      setMovimentos(movimentos.map(m => m.id === editingMovimento.id ? newMovimento : m));
    } else {
      setMovimentos([...movimentos, newMovimento]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (movimento: Movimento) => {
    setEditingMovimento(movimento);
    setFormData({
      type: movimento.type,
      description: movimento.description,
      value: movimento.value.toString(),
      category: movimento.category,
      payment_method: movimento.payment_method,
      date: movimento.date,
      user: movimento.user || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este movimento?')) {
      setMovimentos(movimentos.filter(m => m.id !== id));
    }
  };

  const filteredMovimentos = movimentos.filter(movimento => {
    const matchSearch = movimento.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || movimento.type === filterType;
    const matchDate = movimento.date === selectedDate;
    return matchSearch && matchType && matchDate;
  });

  const totalEntradas = movimentos
    .filter(m => m.type === 'entrada' && m.date === selectedDate)
    .reduce((sum, m) => sum + m.value, 0);

  const totalSaidas = movimentos
    .filter(m => m.type === 'saida' && m.date === selectedDate)
    .reduce((sum, m) => sum + m.value, 0);

  const saldoCaixa = totalEntradas - totalSaidas;

  const handleFecharCaixa = () => {
    if (confirm(`Deseja fechar o caixa do dia ${new Date(selectedDate).toLocaleDateString('pt-BR')}?\n\nSaldo: R$ ${saldoCaixa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)) {
      alert('Caixa fechado com sucesso!');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Caixas</h1>
            <p className="text-gray-600">Controle de caixa diário</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleFecharCaixa}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Building className="w-5 h-5" />
              Fechar Caixa
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Novo Movimento
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entradas</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                <p className="text-sm text-gray-600">Saídas</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                <p className="text-sm text-gray-600">Saldo do Dia</p>
                <p className={`text-2xl font-bold ${saldoCaixa >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  R$ {saldoCaixa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                <p className="text-sm text-gray-600">Movimentos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredMovimentos.length}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <Calendar className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                <Search className="absolute left-3 bottom-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="all">Todos</option>
                  <option value="entrada">Entradas</option>
                  <option value="saida">Saídas</option>
                </select>
              </div>

              <div className="flex items-end">
                <button className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                  Filtrar
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyan-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Hora</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Descrição</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Categoria</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Forma Pgto</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Usuário</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Valor</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMovimentos.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      Nenhum movimento encontrado para esta data
                    </td>
                  </tr>
                ) : (
                  filteredMovimentos.map((movimento) => (
                    <tr key={movimento.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(movimento.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          movimento.type === 'entrada' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {movimento.type === 'entrada' ? 'Entrada' : 'Saída'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{movimento.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{movimento.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{movimento.payment_method}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{movimento.user || '-'}</td>
                      <td className={`px-6 py-4 text-sm font-semibold ${
                        movimento.type === 'entrada' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {movimento.type === 'entrada' ? '+' : '-'} R$ {movimento.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(movimento)}
                            className="p-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(movimento.id)}
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

          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Total de movimentos: <span className="font-semibold">{filteredMovimentos.length}</span>
              </div>
              <div className="text-lg font-bold">
                Saldo do Dia: <span className={saldoCaixa >= 0 ? 'text-green-600' : 'text-red-600'}>
                  R$ {saldoCaixa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editingMovimento ? 'Editar Movimento' : 'Novo Movimento'}
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
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'entrada' | 'saida' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
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
                    placeholder="Descrição do movimento"
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
                    {formData.type === 'entrada' ? (
                      <>
                        <option>Abertura</option>
                        <option>Pagamento Cliente</option>
                        <option>Reforço</option>
                        <option>Outros</option>
                      </>
                    ) : (
                      <>
                        <option>Sangria</option>
                        <option>Despesa</option>
                        <option>Troco</option>
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
                    <option>Dinheiro</option>
                    <option>PIX</option>
                    <option>Cartão de Crédito</option>
                    <option>Cartão de Débito</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
                  <input
                    type="text"
                    value={formData.user}
                    onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Nome do usuário"
                  />
                </div>
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
