'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Edit, Trash2, X, DollarSign, Send, CheckCircle, AlertCircle, Filter, FileText, Printer } from 'lucide-react';

interface ContaReceber {
  id: string;
  cliente: string;
  descricao: string;
  tipo: string;
  valor: number;
  dataVencimento: string;
  dataRecebimento?: string;
  status: 'pendente' | 'recebido' | 'vencido' | 'parcial';
  formaPagamento?: string;
  observacoes?: string;
  parcela?: string;
  numeroRecibo?: string;
}

export default function ContasReceberPage() {
  const [contas, setContas] = useState<ContaReceber[]>([
    {
      id: '1',
      cliente: 'João Silva',
      descricao: 'Honorários - Processo Trabalhista',
      tipo: 'Honorários',
      valor: 15000.00,
      dataVencimento: '2026-04-10',
      status: 'pendente',
      parcela: '1/3',
    },
    {
      id: '2',
      cliente: 'Maria Santos',
      descricao: 'Consultoria Jurídica',
      tipo: 'Consultoria',
      valor: 3500.00,
      dataVencimento: '2026-03-25',
      status: 'vencido',
    },
    {
      id: '3',
      cliente: 'Pedro Oliveira',
      descricao: 'Honorários - Ação de Despejo',
      tipo: 'Honorários',
      valor: 8000.00,
      dataVencimento: '2026-03-15',
      dataRecebimento: '2026-03-14',
      status: 'recebido',
      formaPagamento: 'PIX',
      numeroRecibo: 'REC-2026-001',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showReciboModal, setShowReciboModal] = useState(false);
  const [editingConta, setEditingConta] = useState<ContaReceber | null>(null);
  const [selectedConta, setSelectedConta] = useState<ContaReceber | null>(null);
  const [filter, setFilter] = useState({
    status: 'all',
    tipo: 'all',
    mes: new Date().toISOString().slice(0, 7),
  });

  const [formData, setFormData] = useState({
    cliente: '',
    descricao: '',
    tipo: 'Honorários',
    valor: '',
    dataVencimento: '',
    dataRecebimento: '',
    formaPagamento: '',
    observacoes: '',
    parcela: '',
  });

  const tipos = ['Honorários', 'Consultoria', 'Êxito', 'Contrato', 'Outros'];
  const formasPagamento = ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'PIX', 'Transferência', 'Boleto', 'Cheque'];

  const resetForm = () => {
    setFormData({
      cliente: '',
      descricao: '',
      tipo: 'Honorários',
      valor: '',
      dataVencimento: '',
      dataRecebimento: '',
      formaPagamento: '',
      observacoes: '',
      parcela: '',
    });
    setEditingConta(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novaConta: ContaReceber = {
      id: editingConta?.id || Date.now().toString(),
      cliente: formData.cliente,
      descricao: formData.descricao,
      tipo: formData.tipo,
      valor: parseFloat(formData.valor),
      dataVencimento: formData.dataVencimento,
      dataRecebimento: formData.dataRecebimento || undefined,
      status: formData.dataRecebimento ? 'recebido' : 
              new Date(formData.dataVencimento) < new Date() ? 'vencido' : 'pendente',
      formaPagamento: formData.formaPagamento || undefined,
      observacoes: formData.observacoes || undefined,
      parcela: formData.parcela || undefined,
      numeroRecibo: formData.dataRecebimento ? `REC-${new Date().getFullYear()}-${String(contas.length + 1).padStart(3, '0')}` : undefined,
    };

    if (editingConta) {
      setContas(contas.map(c => c.id === editingConta.id ? novaConta : c));
    } else {
      setContas([...contas, novaConta]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (conta: ContaReceber) => {
    setEditingConta(conta);
    setFormData({
      cliente: conta.cliente,
      descricao: conta.descricao,
      tipo: conta.tipo,
      valor: conta.valor.toString(),
      dataVencimento: conta.dataVencimento,
      dataRecebimento: conta.dataRecebimento || '',
      formaPagamento: conta.formaPagamento || '',
      observacoes: conta.observacoes || '',
      parcela: conta.parcela || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir esta conta?')) {
      setContas(contas.filter(c => c.id !== id));
    }
  };

  const handleReceber = (id: string) => {
    const hoje = new Date().toISOString().split('T')[0];
    const numeroRecibo = `REC-${new Date().getFullYear()}-${String(contas.length + 1).padStart(3, '0')}`;
    setContas(contas.map(c => 
      c.id === id ? { ...c, status: 'recebido', dataRecebimento: hoje, numeroRecibo } : c
    ));
  };

  const handleEnviarCobranca = (conta: ContaReceber) => {
    alert(`Enviando cobrança para ${conta.cliente}\nValor: R$ ${conta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\nVencimento: ${new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}`);
  };

  const handleGerarRecibo = (conta: ContaReceber) => {
    setSelectedConta(conta);
    setShowReciboModal(true);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pendente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      recebido: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      vencido: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      parcial: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    };
    return badges[status as keyof typeof badges];
  };

  const filteredContas = contas.filter(conta => {
    if (filter.status !== 'all' && conta.status !== filter.status) return false;
    if (filter.tipo !== 'all' && conta.tipo !== filter.tipo) return false;
    if (filter.mes && !conta.dataVencimento.startsWith(filter.mes)) return false;
    return true;
  });

  const totalPendente = contas.filter(c => c.status === 'pendente').reduce((sum, c) => sum + c.valor, 0);
  const totalVencido = contas.filter(c => c.status === 'vencido').reduce((sum, c) => sum + c.valor, 0);
  const totalRecebido = contas.filter(c => c.status === 'recebido').reduce((sum, c) => sum + c.valor, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Contas a Receber</h1>
            <p className="text-gray-600 dark:text-gray-400">Gerencie seus recebimentos e honorários</p>
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
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">A Receber</h3>
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
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Recebidas</h3>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              R$ {totalRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {contas.filter(c => c.status === 'recebido').length} contas
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
                <option value="recebido">Recebidas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo
              </label>
              <select
                value={filter.tipo}
                onChange={(e) => setFilter({ ...filter, tipo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="all">Todos</option>
                {tipos.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
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
                  <th className="px-6 py-3 text-left text-sm font-semibold">Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Descrição</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tipo</th>
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
                        {conta.cliente}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {conta.descricao}
                        {conta.parcela && <span className="ml-1 text-xs">({conta.parcela})</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {conta.tipo}
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
                          {conta.status !== 'recebido' && (
                            <>
                              <button
                                onClick={() => handleReceber(conta.id)}
                                className="p-2 text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
                                title="Marcar como recebido"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEnviarCobranca(conta)}
                                className="p-2 text-white bg-orange-500 rounded hover:bg-orange-600 transition-colors"
                                title="Enviar cobrança"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {conta.status === 'recebido' && (
                            <button
                              onClick={() => handleGerarRecibo(conta)}
                              className="p-2 text-white bg-purple-500 rounded hover:bg-purple-600 transition-colors"
                              title="Gerar recibo"
                            >
                              <FileText className="w-4 h-4" />
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
                {editingConta ? 'Editar Conta' : 'Nova Conta a Receber'}
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
                    Cliente <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cliente}
                    onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Nome do cliente"
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
                    placeholder="Descrição do serviço"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    {tipos.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
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
                    Data Recebimento
                  </label>
                  <input
                    type="date"
                    value={formData.dataRecebimento}
                    onChange={(e) => setFormData({ ...formData, dataRecebimento: e.target.value })}
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
                    placeholder="Ex: 1/3"
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

      {showReciboModal && selectedConta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="bg-purple-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recibo de Pagamento</h2>
              <button
                onClick={() => setShowReciboModal(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">RECIBO</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Nº {selectedConta.numeroRecibo}</p>
                </div>

                <div className="space-y-4 text-gray-900 dark:text-gray-100">
                  <p>
                    <strong>Valor:</strong> R$ {selectedConta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p>
                    <strong>Recebi de:</strong> {selectedConta.cliente}
                  </p>
                  <p>
                    <strong>Referente a:</strong> {selectedConta.descricao}
                  </p>
                  <p>
                    <strong>Forma de pagamento:</strong> {selectedConta.formaPagamento}
                  </p>
                  <p>
                    <strong>Data:</strong> {selectedConta.dataRecebimento ? new Date(selectedConta.dataRecebimento).toLocaleDateString('pt-BR') : ''}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Escritório de Advocacia<br />
                    CNPJ: 00.000.000/0001-00<br />
                    OAB/SP 123456
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Printer className="w-5 h-5" />
                  Imprimir
                </button>
                <button
                  onClick={() => setShowReciboModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
