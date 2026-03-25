'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Edit, Trash2, X, Search, Eye, FileText, CheckCircle } from 'lucide-react';

interface Beneficio {
  id: string;
  client_name: string;
  benefit_type: string;
  protocol_number: string;
  request_date: string;
  status: 'em_analise' | 'deferido' | 'indeferido' | 'recurso';
  value?: string;
  notes: string;
  created_at: string;
}

export default function BeneficiosPage() {
  const [beneficios, setBeneficios] = useState<Beneficio[]>([
    {
      id: '1',
      client_name: 'Maria Santos',
      benefit_type: 'Auxílio-Doença',
      protocol_number: 'NB123456789',
      request_date: new Date().toISOString().split('T')[0],
      status: 'em_analise',
      value: '1412',
      notes: 'Aguardando perícia médica do INSS',
      created_at: new Date().toISOString(),
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingBeneficio, setEditingBeneficio] = useState<Beneficio | null>(null);
  const [viewingBeneficio, setViewingBeneficio] = useState<Beneficio | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'em_analise' | 'deferido' | 'indeferido' | 'recurso'>('all');
  const [formData, setFormData] = useState({
    client_name: '',
    benefit_type: 'Auxílio-Doença',
    protocol_number: '',
    request_date: new Date().toISOString().split('T')[0],
    status: 'em_analise' as 'em_analise' | 'deferido' | 'indeferido' | 'recurso',
    value: '',
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      client_name: '',
      benefit_type: 'Auxílio-Doença',
      protocol_number: '',
      request_date: new Date().toISOString().split('T')[0],
      status: 'em_analise',
      value: '',
      notes: '',
    });
    setEditingBeneficio(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBeneficio: Beneficio = {
      id: editingBeneficio?.id || Date.now().toString(),
      client_name: formData.client_name,
      benefit_type: formData.benefit_type,
      protocol_number: formData.protocol_number,
      request_date: formData.request_date,
      status: formData.status,
      value: formData.value,
      notes: formData.notes,
      created_at: editingBeneficio?.created_at || new Date().toISOString(),
    };

    if (editingBeneficio) {
      setBeneficios(beneficios.map(b => b.id === editingBeneficio.id ? newBeneficio : b));
    } else {
      setBeneficios([...beneficios, newBeneficio]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (beneficio: Beneficio) => {
    setEditingBeneficio(beneficio);
    setFormData({
      client_name: beneficio.client_name,
      benefit_type: beneficio.benefit_type,
      protocol_number: beneficio.protocol_number,
      request_date: beneficio.request_date,
      status: beneficio.status,
      value: beneficio.value || '',
      notes: beneficio.notes,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este benefício?')) {
      setBeneficios(beneficios.filter(b => b.id !== id));
    }
  };

  const handleView = (beneficio: Beneficio) => {
    setViewingBeneficio(beneficio);
    setShowViewModal(true);
  };

  const filteredBeneficios = beneficios.filter(beneficio => {
    const matchSearch = beneficio.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       beneficio.protocol_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || beneficio.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const beneficiosEmAnalise = beneficios.filter(b => b.status === 'em_analise').length;
  const beneficiosDeferidos = beneficios.filter(b => b.status === 'deferido').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Benefícios / OCB</h1>
            <p className="text-gray-600">Gerencie os benefícios previdenciários</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Benefício
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Em Análise</p>
                <p className="text-2xl font-bold text-yellow-600">{beneficiosEmAnalise}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Deferidos</p>
                <p className="text-2xl font-bold text-green-600">{beneficiosDeferidos}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-blue-600">{beneficios.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por cliente ou protocolo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">Todos os Status</option>
                <option value="em_analise">Em Análise</option>
                <option value="deferido">Deferido</option>
                <option value="indeferido">Indeferido</option>
                <option value="recurso">Recurso</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyan-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tipo de Benefício</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Protocolo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Data</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Valor</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBeneficios.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Nenhum benefício encontrado
                    </td>
                  </tr>
                ) : (
                  filteredBeneficios.map((beneficio) => (
                    <tr key={beneficio.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{beneficio.client_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{beneficio.benefit_type}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{beneficio.protocol_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(beneficio.request_date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {beneficio.value ? `R$ ${parseFloat(beneficio.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          beneficio.status === 'deferido' 
                            ? 'bg-green-100 text-green-800'
                            : beneficio.status === 'indeferido'
                            ? 'bg-red-100 text-red-800'
                            : beneficio.status === 'recurso'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {beneficio.status === 'em_analise' ? 'Em Análise' : beneficio.status.charAt(0).toUpperCase() + beneficio.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleView(beneficio)}
                            className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(beneficio)}
                            className="p-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(beneficio.id)}
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
                {editingBeneficio ? 'Editar Benefício' : 'Novo Benefício'}
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
                    Cliente <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Nome do cliente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Benefício <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.benefit_type}
                    onChange={(e) => setFormData({ ...formData, benefit_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Auxílio-Doença">Auxílio-Doença</option>
                    <option value="Aposentadoria por Idade">Aposentadoria por Idade</option>
                    <option value="Aposentadoria por Invalidez">Aposentadoria por Invalidez</option>
                    <option value="Aposentadoria por Tempo de Contribuição">Aposentadoria por Tempo de Contribuição</option>
                    <option value="Pensão por Morte">Pensão por Morte</option>
                    <option value="Salário-Maternidade">Salário-Maternidade</option>
                    <option value="BPC/LOAS">BPC/LOAS</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número do Protocolo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.protocol_number}
                    onChange={(e) => setFormData({ ...formData, protocol_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="NB000000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data do Requerimento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.request_date}
                    onChange={(e) => setFormData({ ...formData, request_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="0,00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="em_analise">Em Análise</option>
                    <option value="deferido">Deferido</option>
                    <option value="indeferido">Indeferido</option>
                    <option value="recurso">Recurso</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Observações sobre o benefício..."
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

      {showViewModal && viewingBeneficio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Detalhes do Benefício</h2>
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
                  <label className="block text-sm font-medium text-gray-500 mb-1">Cliente</label>
                  <p className="text-gray-900 font-medium">{viewingBeneficio.client_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    viewingBeneficio.status === 'deferido' 
                      ? 'bg-green-100 text-green-800'
                      : viewingBeneficio.status === 'indeferido'
                      ? 'bg-red-100 text-red-800'
                      : viewingBeneficio.status === 'recurso'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {viewingBeneficio.status === 'em_analise' ? 'Em Análise' : viewingBeneficio.status.charAt(0).toUpperCase() + viewingBeneficio.status.slice(1)}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Tipo de Benefício</label>
                  <p className="text-gray-900">{viewingBeneficio.benefit_type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Protocolo</label>
                  <p className="text-gray-900 font-medium">{viewingBeneficio.protocol_number}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Data do Requerimento</label>
                  <p className="text-gray-900">{new Date(viewingBeneficio.request_date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Valor</label>
                  <p className="text-gray-900 font-medium">
                    {viewingBeneficio.value ? `R$ ${parseFloat(viewingBeneficio.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Observações</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{viewingBeneficio.notes || '-'}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(viewingBeneficio);
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
