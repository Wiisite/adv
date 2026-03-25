'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Edit, Trash2, X, Search, Eye, CheckCircle, XCircle } from 'lucide-react';

interface CasoSolicitado {
  id: string;
  client_name: string;
  phone: string;
  email: string;
  subject: string;
  description: string;
  urgency: 'baixa' | 'media' | 'alta';
  status: 'pendente' | 'em_analise' | 'aprovado' | 'recusado';
  date: string;
  created_at: string;
}

export default function CasosSolicitadosPage() {
  const [casos, setCasos] = useState<CasoSolicitado[]>([
    {
      id: '1',
      client_name: 'Maria Santos',
      phone: '(11) 98765-4321',
      email: 'maria@email.com',
      subject: 'Ação Trabalhista',
      description: 'Solicitação de consultoria para ação de horas extras não pagas',
      urgency: 'alta',
      status: 'pendente',
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingCaso, setEditingCaso] = useState<CasoSolicitado | null>(null);
  const [viewingCaso, setViewingCaso] = useState<CasoSolicitado | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pendente' | 'em_analise' | 'aprovado' | 'recusado'>('all');
  const [formData, setFormData] = useState({
    client_name: '',
    phone: '',
    email: '',
    subject: '',
    description: '',
    urgency: 'media' as 'baixa' | 'media' | 'alta',
    status: 'pendente' as 'pendente' | 'em_analise' | 'aprovado' | 'recusado',
    date: new Date().toISOString().split('T')[0],
  });

  const resetForm = () => {
    setFormData({
      client_name: '',
      phone: '',
      email: '',
      subject: '',
      description: '',
      urgency: 'media',
      status: 'pendente',
      date: new Date().toISOString().split('T')[0],
    });
    setEditingCaso(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCaso: CasoSolicitado = {
      id: editingCaso?.id || Date.now().toString(),
      client_name: formData.client_name,
      phone: formData.phone,
      email: formData.email,
      subject: formData.subject,
      description: formData.description,
      urgency: formData.urgency,
      status: formData.status,
      date: formData.date,
      created_at: editingCaso?.created_at || new Date().toISOString(),
    };

    if (editingCaso) {
      setCasos(casos.map(c => c.id === editingCaso.id ? newCaso : c));
    } else {
      setCasos([...casos, newCaso]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (caso: CasoSolicitado) => {
    setEditingCaso(caso);
    setFormData({
      client_name: caso.client_name,
      phone: caso.phone,
      email: caso.email,
      subject: caso.subject,
      description: caso.description,
      urgency: caso.urgency,
      status: caso.status,
      date: caso.date,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este caso?')) {
      setCasos(casos.filter(c => c.id !== id));
    }
  };

  const handleView = (caso: CasoSolicitado) => {
    setViewingCaso(caso);
    setShowViewModal(true);
  };

  const handleApprove = (id: string) => {
    setCasos(casos.map(c => c.id === id ? { ...c, status: 'aprovado' } : c));
  };

  const handleReject = (id: string) => {
    if (confirm('Deseja realmente recusar este caso?')) {
      setCasos(casos.map(c => c.id === id ? { ...c, status: 'recusado' } : c));
    }
  };

  const filteredCasos = casos.filter(caso => {
    const matchSearch = caso.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       caso.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || caso.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const casosPendentes = casos.filter(c => c.status === 'pendente').length;
  const casosAprovados = casos.filter(c => c.status === 'aprovado').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Casos Solicitados</h1>
            <p className="text-gray-600">Gerencie as solicitações de novos casos</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Solicitação
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{casosPendentes}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <XCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aprovados</p>
                <p className="text-2xl font-bold text-green-600">{casosAprovados}</p>
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
                <p className="text-2xl font-bold text-blue-600">{casos.length}</p>
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
                  placeholder="Buscar por cliente ou assunto..."
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
                <option value="pendente">Pendente</option>
                <option value="em_analise">Em Análise</option>
                <option value="aprovado">Aprovado</option>
                <option value="recusado">Recusado</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyan-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Data</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Contato</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Assunto</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Urgência</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCasos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Nenhum caso encontrado
                    </td>
                  </tr>
                ) : (
                  filteredCasos.map((caso) => (
                    <tr key={caso.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(caso.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{caso.client_name}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{caso.phone}</div>
                        <div className="text-xs text-gray-500">{caso.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{caso.subject}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          caso.urgency === 'alta' 
                            ? 'bg-red-100 text-red-800'
                            : caso.urgency === 'media'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {caso.urgency.charAt(0).toUpperCase() + caso.urgency.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          caso.status === 'aprovado' 
                            ? 'bg-green-100 text-green-800'
                            : caso.status === 'recusado'
                            ? 'bg-red-100 text-red-800'
                            : caso.status === 'em_analise'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {caso.status === 'em_analise' ? 'Em Análise' : caso.status.charAt(0).toUpperCase() + caso.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          {caso.status === 'pendente' && (
                            <>
                              <button
                                onClick={() => handleApprove(caso.id)}
                                className="p-2 text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
                                title="Aprovar"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(caso.id)}
                                className="p-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                                title="Recusar"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleView(caso)}
                            className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(caso)}
                            className="p-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(caso.id)}
                            className="p-2 text-white bg-gray-500 rounded hover:bg-gray-600 transition-colors"
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
                {editingCaso ? 'Editar Caso' : 'Nova Solicitação'}
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
                    Nome do Cliente <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assunto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Assunto do caso"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urgência</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em_analise">Em Análise</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="recusado">Recusado</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Descreva o caso solicitado..."
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

      {showViewModal && viewingCaso && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Detalhes do Caso</h2>
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
                  <p className="text-gray-900 font-medium">{viewingCaso.client_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Data</label>
                  <p className="text-gray-900">{new Date(viewingCaso.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Telefone</label>
                  <p className="text-gray-900">{viewingCaso.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <p className="text-gray-900">{viewingCaso.email}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Assunto</label>
                  <p className="text-gray-900 font-medium">{viewingCaso.subject}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Urgência</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    viewingCaso.urgency === 'alta' 
                      ? 'bg-red-100 text-red-800'
                      : viewingCaso.urgency === 'media'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {viewingCaso.urgency.charAt(0).toUpperCase() + viewingCaso.urgency.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    viewingCaso.status === 'aprovado' 
                      ? 'bg-green-100 text-green-800'
                      : viewingCaso.status === 'recusado'
                      ? 'bg-red-100 text-red-800'
                      : viewingCaso.status === 'em_analise'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {viewingCaso.status === 'em_analise' ? 'Em Análise' : viewingCaso.status.charAt(0).toUpperCase() + viewingCaso.status.slice(1)}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Descrição</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{viewingCaso.description}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                {viewingCaso.status === 'pendente' && (
                  <>
                    <button
                      onClick={() => {
                        handleApprove(viewingCaso.id);
                        setShowViewModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => {
                        handleReject(viewingCaso.id);
                        setShowViewModal(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Recusar
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(viewingCaso);
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
