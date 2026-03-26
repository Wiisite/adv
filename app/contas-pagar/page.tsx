'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Edit, Trash2, X, DollarSign, Calendar, CheckCircle, AlertCircle, Filter, Download } from 'lucide-react';

interface ContaPagar {
  id: string;
  fornecedor: string;
  descricao: string;
  categoria: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'pendente' | 'pago' | 'vencido' | 'parcial';
  formaPagamento?: string;
  observacoes?: string;
  parcela?: string;
  recorrente: boolean;
}

export default function ContasPagarPage() {
  const [contas, setContas] = useState<ContaPagar[]>([
    {
      id: '1',
      fornecedor: 'Escritório Virtual Ltda',
      descricao: 'Aluguel do escritório',
      categoria: 'Infraestrutura',
      valor: 3500.00,
      dataVencimento: '2026-04-05',
      status: 'pendente',
      recorrente: true,
    },
    {
      id: '2',
      fornecedor: 'TechSoft Sistemas',
      descricao: 'Licença de software jurídico',
      categoria: 'Software',
      valor: 890.00,
      dataVencimento: '2026-03-28',
      status: 'vencido',
      recorrente: true,
    },
    {
      id: '3',
      fornecedor: 'Papelaria Central',
      descricao: 'Material de escritório',
      categoria: 'Material',
      valor: 450.00,
      dataVencimento: '2026-03-20',
      dataPagamento: '2026-03-19',
      status: 'pago',
      formaPagamento: 'Cartão de Crédito',
      recorrente: false,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingConta, setEditingConta] = useState<ContaPagar | null>(null);
  const [filter, setFilter] = useState({
    status: 'all',
    categoria: 'all',
    mes: new Date().toISOString().slice(0, 7),
  });

  const [formData, setFormData] = useState({
    fornecedor: '',
    descricao: '',
    categoria: 'Infraestrutura',
    valor: '',
    dataVencimento: '',
    dataPagamento: '',
    formaPagamento: '',
    observacoes: '',
    parcela: '',
    recorrente: false,
  });

  const categorias = ['Infraestrutura', 'Software', 'Material', 'Serviços', 'Impostos', 'Salários', 'Marketing', 'Outros'];
  const formasPagamento = ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'PIX', 'Transferência', 'Boleto', 'Cheque'];

  const resetForm = () => {
    setFormData({
      fornecedor: '',
      descricao: '',
      categoria: 'Infraestrutura',
      valor: '',
      dataVencimento: '',
      dataPagamento: '',
      formaPagamento: '',
      observacoes: '',
      parcela: '',
      recorrente: false,
    });
    setEditingConta(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novaConta: ContaPagar = {
      id: editingConta?.id || Date.now().toString(),
      fornecedor: formData.fornecedor,
      descricao: formData.descricao,
      categoria: formData.categoria,
      valor: parseFloat(formData.valor),
      dataVencimento: formData.dataVencimento,
      dataPagamento: formData.dataPagamento || undefined,
      status: formData.dataPagamento ? 'pago' : 
              new Date(formData.dataVencimento) < new Date() ? 'vencido' : 'pendente',
      formaPagamento: formData.formaPagamento || undefined,
      observacoes: formData.observacoes || undefined,
      parcela: formData.parcela || undefined,
      recorrente: formData.recorrente,
    };

    if (editingConta) {
      setContas(contas.map(c => c.id === editingConta.id ? novaConta : c));
    } else {
      setContas([...contas, novaConta]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (conta: ContaPagar) => {
    setEditingConta(conta);
    setFormData({
      fornecedor: conta.fornecedor,
      descricao: conta.descricao,
      categoria: conta.categoria,
      valor: conta.valor.toString(),
      dataVencimento: conta.dataVencimento,
      dataPagamento: conta.dataPagamento || '',
      formaPagamento: conta.formaPagamento || '',
      observacoes: conta.observacoes || '',
      parcela: conta.parcela || '',
      recorrente: conta.recorrente,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir esta conta?')) {
      setContas(contas.filter(c => c.id !== id));
    }
  };

  const handlePagar = (id: string) => {
    const hoje = new Date().toISOString().split('T')[0];
    setContas(contas.map(c => 
      c.id === id ? { ...c, status: 'pago', dataPagamento: hoje } : c
    ));
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pendente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      pago: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      vencido: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      parcial: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    };
    return badges[status as keyof typeof badges];
  };

  const filteredContas = contas.filter(conta => {
    if (filter.status !== 'all' && conta.status !== filter.status) return false;
    if (filter.categoria !== 'all' && conta.categoria !== filter.categoria) return false;
    if (filter.mes && !conta.dataVencimento.startsWith(filter.mes)) return false;
    return true;
  });

  const totalPendente = contas.filter(c => c.status === 'pendente').reduce((sum, c) => sum + c.valor, 0);
  const totalVencido = contas.filter(c => c.status === 'vencido').reduce((sum, c) => sum + c.valor, 0);
  const totalPago = contas.filter(c => c.status === 'pago').reduce((sum, c) => sum + c.valor, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Contas a Pagar</h1>
            <p className="text-gray-600 dark:text-gray-400">Gerencie suas despesas e pagamentos</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Conta
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendentes</h3>
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {contas.filter(c => c.status === 'pendente').length} contas
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Vencidas</h3>
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-red-600">
              R$ {totalVencido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {contas.filter(c => c.status === 'vencido').length} contas
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Pagas</h3>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {contas.filter(c => c.status === 'pago').length} contas
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-cyan-500" />
            Filtros
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="all">Todos</option>
                <option value="pendente">Pendentes</option>
                <option value="vencido">Vencidas</option>
                <option value="pago">Pagas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoria
              </label>
              <select
                value={filter.categoria}
                onChange={(e) => setFilter({ ...filter, categoria: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="all">Todas</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mês
              </label>
              <input
                type="month"
                value={filter.mes}
                onChange={(e) => setFilter({ ...filter, mes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyan-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Fornecedor</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Descrição</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Categoria</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Valor</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Vencimento</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredContas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      Nenhuma conta encontrada
                    </td>
                  </tr>
                ) : (
                  filteredContas.map((conta) => (
                    <tr key={conta.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {conta.fornecedor}
                        {conta.recorrente && (
                          <span className="ml-2 text-xs text-cyan-600 dark:text-cyan-400">🔄</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {conta.descricao}
                        {conta.parcela && <span className="ml-1 text-xs">({conta.parcela})</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {conta.categoria}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                        R$ {conta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadge(conta.status)}`}>
                          {conta.status.charAt(0).toUpperCase() + conta.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          {conta.status !== 'pago' && (
                            <button
                              onClick={() => handlePagar(conta.id)}
                              className="p-2 text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
                              title="Marcar como pago"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(conta)}
                            className="p-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(conta.id)}
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center sticky top-0">
              <h2 className="text-xl font-semibold">
                {editingConta ? 'Editar Conta' : 'Nova Conta a Pagar'}
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fornecedor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fornecedor}
                    onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Nome do fornecedor"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Descrição da despesa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoria <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor (R$) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data Vencimento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dataVencimento}
                    onChange={(e) => setFormData({ ...formData, dataVencimento: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data Pagamento
                  </label>
                  <input
                    type="date"
                    value={formData.dataPagamento}
                    onChange={(e) => setFormData({ ...formData, dataPagamento: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    value={formData.formaPagamento}
                    onChange={(e) => setFormData({ ...formData, formaPagamento: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="">Selecione...</option>
                    {formasPagamento.map(forma => (
                      <option key={forma} value={forma}>{forma}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Parcela
                  </label>
                  <input
                    type="text"
                    value={formData.parcela}
                    onChange={(e) => setFormData({ ...formData, parcela: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Ex: 1/12"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Observações adicionais"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.recorrente}
                      onChange={(e) => setFormData({ ...formData, recorrente: e.target.checked })}
                      className="w-4 h-4 text-cyan-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Despesa recorrente (mensal)
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
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
