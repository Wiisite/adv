'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Edit, Trash2, X, Search, Eye, FileText, Download } from 'lucide-react';

interface Contrato {
  id: string;
  contract_number: string;
  title: string;
  client: string;
  type: string;
  value: string;
  start_date: string;
  end_date?: string;
  status: 'ativo' | 'vencido' | 'cancelado';
  description: string;
  created_at: string;
}

export default function ContratosPage() {
  const [contratos, setContratos] = useState<Contrato[]>([
    {
      id: '1',
      contract_number: 'CONT-2024-001',
      title: 'Contrato de Prestação de Serviços Jurídicos',
      client: 'João Silva',
      type: 'Prestação de Serviços',
      value: '5000',
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      status: 'ativo',
      description: 'Contrato de prestação de serviços jurídicos mensais',
      created_at: new Date().toISOString(),
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingContrato, setEditingContrato] = useState<Contrato | null>(null);
  const [viewingContrato, setViewingContrato] = useState<Contrato | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ativo' | 'vencido' | 'cancelado'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [formData, setFormData] = useState({
    contract_number: '',
    title: '',
    client: '',
    type: 'Prestação de Serviços',
    value: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    status: 'ativo' as 'ativo' | 'vencido' | 'cancelado',
    description: '',
  });

  const resetForm = () => {
    setFormData({
      contract_number: '',
      title: '',
      client: '',
      type: 'Prestação de Serviços',
      value: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      status: 'ativo',
      description: '',
    });
    setEditingContrato(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newContrato: Contrato = {
      id: editingContrato?.id || Date.now().toString(),
      contract_number: formData.contract_number,
      title: formData.title,
      client: formData.client,
      type: formData.type,
      value: formData.value,
      start_date: formData.start_date,
      end_date: formData.end_date,
      status: formData.status,
      description: formData.description,
      created_at: editingContrato?.created_at || new Date().toISOString(),
    };

    if (editingContrato) {
      setContratos(contratos.map(c => c.id === editingContrato.id ? newContrato : c));
    } else {
      setContratos([...contratos, newContrato]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (contrato: Contrato) => {
    setEditingContrato(contrato);
    setFormData({
      contract_number: contrato.contract_number,
      title: contrato.title,
      client: contrato.client,
      type: contrato.type,
      value: contrato.value,
      start_date: contrato.start_date,
      end_date: contrato.end_date || '',
      status: contrato.status,
      description: contrato.description,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este contrato?')) {
      setContratos(contratos.filter(c => c.id !== id));
    }
  };

  const handleView = (contrato: Contrato) => {
    setViewingContrato(contrato);
    setShowViewModal(true);
  };

  const filteredContratos = contratos.filter(contrato => {
    const matchSearch = contrato.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       contrato.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       contrato.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || contrato.status === filterStatus;
    const matchType = filterType === 'all' || contrato.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const contratosAtivos = contratos.filter(c => c.status === 'ativo').length;
  const contratosVencidos = contratos.filter(c => c.status === 'vencido').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Abertura de Contratos</h1>
            <p className="text-gray-600">Gerencie os contratos do escritório</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Contrato
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contratos Ativos</p>
                <p className="text-2xl font-bold text-green-600">{contratosAtivos}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contratos Vencidos</p>
                <p className="text-2xl font-bold text-red-600">{contratosVencidos}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Contratos</p>
                <p className="text-2xl font-bold text-blue-600">{contratos.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por número, título ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">Todos os Tipos</option>
                <option value="Prestação de Serviços">Prestação de Serviços</option>
                <option value="Honorários">Honorários</option>
                <option value="Consultoria">Consultoria</option>
                <option value="Outros">Outros</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">Todos os Status</option>
                <option value="ativo">Ativo</option>
                <option value="vencido">Vencido</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyan-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Número</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Título</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Valor</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContratos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Nenhum contrato encontrado
                    </td>
                  </tr>
                ) : (
                  filteredContratos.map((contrato) => (
                    <tr key={contrato.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{contrato.contract_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{contrato.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{contrato.client}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{contrato.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        R$ {parseFloat(contrato.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          contrato.status === 'ativo' 
                            ? 'bg-green-100 text-green-800'
                            : contrato.status === 'vencido'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {contrato.status.charAt(0).toUpperCase() + contrato.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleView(contrato)}
                            className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => alert('Função de download em desenvolvimento')}
                            className="p-2 text-white bg-purple-500 rounded hover:bg-purple-600 transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(contrato)}
                            className="p-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(contrato.id)}
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
                {editingContrato ? 'Editar Contrato' : 'Novo Contrato'}
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
                    Número do Contrato <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contract_number}
                    onChange={(e) => setFormData({ ...formData, contract_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="CONT-2024-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Nome do cliente"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Título do contrato"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Prestação de Serviços">Prestação de Serviços</option>
                    <option value="Honorários">Honorários</option>
                    <option value="Consultoria">Consultoria</option>
                    <option value="Outros">Outros</option>
                  </select>
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
                    Data de Início <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="vencido">Vencido</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Descrição do contrato..."
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

      {showViewModal && viewingContrato && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Detalhes do Contrato</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Número do Contrato</label>
                  <p className="text-gray-900 font-medium">{viewingContrato.contract_number}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    viewingContrato.status === 'ativo' 
                      ? 'bg-green-100 text-green-800'
                      : viewingContrato.status === 'vencido'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {viewingContrato.status.charAt(0).toUpperCase() + viewingContrato.status.slice(1)}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Título</label>
                  <p className="text-gray-900">{viewingContrato.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Cliente</label>
                  <p className="text-gray-900">{viewingContrato.client}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Tipo</label>
                  <p className="text-gray-900">{viewingContrato.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Valor</label>
                  <p className="text-gray-900 font-medium">
                    R$ {parseFloat(viewingContrato.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Data de Início</label>
                  <p className="text-gray-900">{new Date(viewingContrato.start_date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Data de Término</label>
                  <p className="text-gray-900">
                    {viewingContrato.end_date ? new Date(viewingContrato.end_date).toLocaleDateString('pt-BR') : '-'}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Descrição</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{viewingContrato.description}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(viewingContrato);
                  }}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
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
