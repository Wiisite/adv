'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Edit, Trash2, X, Search, Eye, FileText, CheckCircle } from 'lucide-react';

interface Pericia {
  id: string;
  process_number: string;
  process_title: string;
  type: string;
  expert_name: string;
  appointment_date: string;
  deadline: string;
  status: 'agendada' | 'em_andamento' | 'concluida' | 'cancelada';
  value?: string;
  notes: string;
  created_at: string;
}

export default function PericiasPage() {
  const [pericias, setPericias] = useState<Pericia[]>([
    {
      id: '1',
      process_number: '0001234-56.2024.8.26.0100',
      process_title: 'Ação Trabalhista - Horas Extras',
      type: 'Perícia Contábil',
      expert_name: 'Dr. Roberto Pereira',
      appointment_date: new Date().toISOString().split('T')[0],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'em_andamento',
      value: '3000',
      notes: 'Perícia para apuração de horas extras',
      created_at: new Date().toISOString(),
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingPericia, setEditingPericia] = useState<Pericia | null>(null);
  const [viewingPericia, setViewingPericia] = useState<Pericia | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'agendada' | 'em_andamento' | 'concluida' | 'cancelada'>('all');
  const [formData, setFormData] = useState({
    process_number: '',
    process_title: '',
    type: 'Perícia Contábil',
    expert_name: '',
    appointment_date: new Date().toISOString().split('T')[0],
    deadline: '',
    status: 'agendada' as 'agendada' | 'em_andamento' | 'concluida' | 'cancelada',
    value: '',
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      process_number: '',
      process_title: '',
      type: 'Perícia Contábil',
      expert_name: '',
      appointment_date: new Date().toISOString().split('T')[0],
      deadline: '',
      status: 'agendada',
      value: '',
      notes: '',
    });
    setEditingPericia(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPericia: Pericia = {
      id: editingPericia?.id || Date.now().toString(),
      process_number: formData.process_number,
      process_title: formData.process_title,
      type: formData.type,
      expert_name: formData.expert_name,
      appointment_date: formData.appointment_date,
      deadline: formData.deadline,
      status: formData.status,
      value: formData.value,
      notes: formData.notes,
      created_at: editingPericia?.created_at || new Date().toISOString(),
    };

    if (editingPericia) {
      setPericias(pericias.map(p => p.id === editingPericia.id ? newPericia : p));
    } else {
      setPericias([...pericias, newPericia]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (pericia: Pericia) => {
    setEditingPericia(pericia);
    setFormData({
      process_number: pericia.process_number,
      process_title: pericia.process_title,
      type: pericia.type,
      expert_name: pericia.expert_name,
      appointment_date: pericia.appointment_date,
      deadline: pericia.deadline,
      status: pericia.status,
      value: pericia.value || '',
      notes: pericia.notes,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir esta perícia?')) {
      setPericias(pericias.filter(p => p.id !== id));
    }
  };

  const handleView = (pericia: Pericia) => {
    setViewingPericia(pericia);
    setShowViewModal(true);
  };

  const filteredPericias = pericias.filter(pericia => {
    const matchSearch = pericia.process_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       pericia.process_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       pericia.expert_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || pericia.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const periciasEmAndamento = pericias.filter(p => p.status === 'em_andamento').length;
  const periciasConcluidas = pericias.filter(p => p.status === 'concluida').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Perícias</h1>
            <p className="text-gray-600">Gerencie as perícias processuais</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Perícia
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-blue-600">{periciasEmAndamento}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">{periciasConcluidas}</p>
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
                <p className="text-2xl font-bold text-gray-900">{pericias.length}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <Eye className="w-6 h-6 text-gray-600" />
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
                  placeholder="Buscar por processo, perito..."
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
                <option value="agendada">Agendada</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluida">Concluída</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyan-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Processo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Perito</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Prazo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Valor</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPericias.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Nenhuma perícia encontrada
                    </td>
                  </tr>
                ) : (
                  filteredPericias.map((pericia) => (
                    <tr key={pericia.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">{pericia.process_number}</div>
                        <div className="text-xs text-gray-500">{pericia.process_title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-800">
                          {pericia.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{pericia.expert_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(pericia.deadline).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {pericia.value ? `R$ ${parseFloat(pericia.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          pericia.status === 'concluida' 
                            ? 'bg-green-100 text-green-800'
                            : pericia.status === 'em_andamento'
                            ? 'bg-blue-100 text-blue-800'
                            : pericia.status === 'agendada'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {pericia.status === 'em_andamento' ? 'Em Andamento' : pericia.status.charAt(0).toUpperCase() + pericia.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleView(pericia)}
                            className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(pericia)}
                            className="p-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(pericia.id)}
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
                {editingPericia ? 'Editar Perícia' : 'Nova Perícia'}
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
                    Número do Processo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.process_number}
                    onChange={(e) => setFormData({ ...formData, process_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="0000000-00.0000.0.00.0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Perícia <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Perícia Contábil">Perícia Contábil</option>
                    <option value="Perícia Médica">Perícia Médica</option>
                    <option value="Perícia Grafotécnica">Perícia Grafotécnica</option>
                    <option value="Perícia de Engenharia">Perícia de Engenharia</option>
                    <option value="Perícia Trabalhista">Perícia Trabalhista</option>
                    <option value="Outras">Outras</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título do Processo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.process_title}
                    onChange={(e) => setFormData({ ...formData, process_title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Título do processo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Perito <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.expert_name}
                    onChange={(e) => setFormData({ ...formData, expert_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Nome do perito"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="agendada">Agendada</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluida">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Nomeação <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.appointment_date}
                    onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prazo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Observações sobre a perícia..."
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

      {showViewModal && viewingPericia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Detalhes da Perícia</h2>
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
                  <label className="block text-sm font-medium text-gray-500 mb-1">Processo</label>
                  <p className="text-gray-900 font-medium">{viewingPericia.process_number}</p>
                  <p className="text-sm text-gray-600">{viewingPericia.process_title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    viewingPericia.status === 'concluida' 
                      ? 'bg-green-100 text-green-800'
                      : viewingPericia.status === 'em_andamento'
                      ? 'bg-blue-100 text-blue-800'
                      : viewingPericia.status === 'agendada'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {viewingPericia.status === 'em_andamento' ? 'Em Andamento' : viewingPericia.status.charAt(0).toUpperCase() + viewingPericia.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Tipo</label>
                  <p className="text-gray-900">{viewingPericia.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Perito</label>
                  <p className="text-gray-900">{viewingPericia.expert_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Data de Nomeação</label>
                  <p className="text-gray-900">{new Date(viewingPericia.appointment_date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Prazo</label>
                  <p className="text-gray-900">{new Date(viewingPericia.deadline).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Valor</label>
                  <p className="text-gray-900 font-medium">
                    {viewingPericia.value ? `R$ ${parseFloat(viewingPericia.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Observações</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{viewingPericia.notes || '-'}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(viewingPericia);
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
