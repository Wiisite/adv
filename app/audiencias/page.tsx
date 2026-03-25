'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Edit, Trash2, X, Search, Eye, Calendar, Clock } from 'lucide-react';

interface Audiencia {
  id: string;
  process_number: string;
  process_title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  judge: string;
  client: string;
  lawyer: string;
  notes: string;
  status: 'agendada' | 'realizada' | 'cancelada' | 'adiada';
  created_at: string;
}

export default function AudienciasPage() {
  const [audiencias, setAudiencias] = useState<Audiencia[]>([
    {
      id: '1',
      process_number: '0001234-56.2024.8.26.0100',
      process_title: 'Ação Trabalhista - Horas Extras',
      type: 'Conciliação',
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      location: 'Fórum Trabalhista - Sala 301',
      judge: 'Dr. Carlos Silva',
      client: 'João Silva',
      lawyer: 'Dr. Pedro Santos',
      notes: 'Levar documentos comprobatórios de horas extras',
      status: 'agendada',
      created_at: new Date().toISOString(),
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingAudiencia, setEditingAudiencia] = useState<Audiencia | null>(null);
  const [viewingAudiencia, setViewingAudiencia] = useState<Audiencia | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'agendada' | 'realizada' | 'cancelada' | 'adiada'>('all');
  const [formData, setFormData] = useState({
    process_number: '',
    process_title: '',
    type: 'Conciliação',
    date: new Date().toISOString().split('T')[0],
    time: '',
    location: '',
    judge: '',
    client: '',
    lawyer: '',
    notes: '',
    status: 'agendada' as 'agendada' | 'realizada' | 'cancelada' | 'adiada',
  });

  const resetForm = () => {
    setFormData({
      process_number: '',
      process_title: '',
      type: 'Conciliação',
      date: new Date().toISOString().split('T')[0],
      time: '',
      location: '',
      judge: '',
      client: '',
      lawyer: '',
      notes: '',
      status: 'agendada',
    });
    setEditingAudiencia(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAudiencia: Audiencia = {
      id: editingAudiencia?.id || Date.now().toString(),
      process_number: formData.process_number,
      process_title: formData.process_title,
      type: formData.type,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      judge: formData.judge,
      client: formData.client,
      lawyer: formData.lawyer,
      notes: formData.notes,
      status: formData.status,
      created_at: editingAudiencia?.created_at || new Date().toISOString(),
    };

    if (editingAudiencia) {
      setAudiencias(audiencias.map(a => a.id === editingAudiencia.id ? newAudiencia : a));
    } else {
      setAudiencias([...audiencias, newAudiencia]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (audiencia: Audiencia) => {
    setEditingAudiencia(audiencia);
    setFormData({
      process_number: audiencia.process_number,
      process_title: audiencia.process_title,
      type: audiencia.type,
      date: audiencia.date,
      time: audiencia.time,
      location: audiencia.location,
      judge: audiencia.judge,
      client: audiencia.client,
      lawyer: audiencia.lawyer,
      notes: audiencia.notes,
      status: audiencia.status,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir esta audiência?')) {
      setAudiencias(audiencias.filter(a => a.id !== id));
    }
  };

  const handleView = (audiencia: Audiencia) => {
    setViewingAudiencia(audiencia);
    setShowViewModal(true);
  };

  const filteredAudiencias = audiencias.filter(audiencia => {
    const matchSearch = audiencia.process_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       audiencia.process_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       audiencia.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || audiencia.status === filterStatus;
    return matchSearch && matchStatus;
  }).sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`).getTime();
    const dateB = new Date(`${b.date} ${b.time}`).getTime();
    return dateA - dateB;
  });

  const audienciasAgendadas = audiencias.filter(a => a.status === 'agendada').length;
  const audienciasRealizadas = audiencias.filter(a => a.status === 'realizada').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Audiências</h1>
            <p className="text-gray-600">Gerencie as audiências processuais</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Audiência
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Agendadas</p>
                <p className="text-2xl font-bold text-blue-600">{audienciasAgendadas}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Realizadas</p>
                <p className="text-2xl font-bold text-green-600">{audienciasRealizadas}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{audiencias.length}</p>
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
                  placeholder="Buscar por processo, cliente..."
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
                <option value="realizada">Realizada</option>
                <option value="cancelada">Cancelada</option>
                <option value="adiada">Adiada</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyan-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Data/Hora</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Processo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Local</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAudiencias.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Nenhuma audiência encontrada
                    </td>
                  </tr>
                ) : (
                  filteredAudiencias.map((audiencia) => (
                    <tr key={audiencia.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">
                          {new Date(audiencia.date).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-xs text-gray-500">{audiencia.time}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">{audiencia.process_number}</div>
                        <div className="text-xs text-gray-500">{audiencia.process_title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-800">
                          {audiencia.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{audiencia.location}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{audiencia.client}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          audiencia.status === 'agendada' 
                            ? 'bg-blue-100 text-blue-800'
                            : audiencia.status === 'realizada'
                            ? 'bg-green-100 text-green-800'
                            : audiencia.status === 'adiada'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {audiencia.status.charAt(0).toUpperCase() + audiencia.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleView(audiencia)}
                            className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(audiencia)}
                            className="p-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(audiencia.id)}
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
                {editingAudiencia ? 'Editar Audiência' : 'Nova Audiência'}
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
                    Tipo <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Conciliação">Conciliação</option>
                    <option value="Instrução">Instrução</option>
                    <option value="Julgamento">Julgamento</option>
                    <option value="Inicial">Inicial</option>
                    <option value="Outros">Outros</option>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Fórum, sala, etc"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Juiz</label>
                  <input
                    type="text"
                    value={formData.judge}
                    onChange={(e) => setFormData({ ...formData, judge: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Nome do juiz"
                  />
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Advogado Responsável</label>
                  <input
                    type="text"
                    value={formData.lawyer}
                    onChange={(e) => setFormData({ ...formData, lawyer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Nome do advogado"
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
                    <option value="realizada">Realizada</option>
                    <option value="adiada">Adiada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Observações sobre a audiência..."
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

      {showViewModal && viewingAudiencia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Detalhes da Audiência</h2>
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
                  <p className="text-gray-900 font-medium">{viewingAudiencia.process_number}</p>
                  <p className="text-sm text-gray-600">{viewingAudiencia.process_title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    viewingAudiencia.status === 'agendada' 
                      ? 'bg-blue-100 text-blue-800'
                      : viewingAudiencia.status === 'realizada'
                      ? 'bg-green-100 text-green-800'
                      : viewingAudiencia.status === 'adiada'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {viewingAudiencia.status.charAt(0).toUpperCase() + viewingAudiencia.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Data e Hora</label>
                  <p className="text-gray-900">
                    {new Date(viewingAudiencia.date).toLocaleDateString('pt-BR')} às {viewingAudiencia.time}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Tipo</label>
                  <p className="text-gray-900">{viewingAudiencia.type}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Local</label>
                  <p className="text-gray-900">{viewingAudiencia.location || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Cliente</label>
                  <p className="text-gray-900">{viewingAudiencia.client || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Advogado</label>
                  <p className="text-gray-900">{viewingAudiencia.lawyer || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Juiz</label>
                  <p className="text-gray-900">{viewingAudiencia.judge || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Observações</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{viewingAudiencia.notes || '-'}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(viewingAudiencia);
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
