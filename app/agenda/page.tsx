'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Edit, Trash2, X, Search, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Tarefa {
  id: string;
  title: string;
  description: string;
  client?: string;
  process?: string;
  date: string;
  time: string;
  type: 'reuniao' | 'audiencia' | 'prazo' | 'tarefa' | 'outro';
  priority: 'baixa' | 'media' | 'alta';
  status: 'pendente' | 'concluida' | 'cancelada';
  created_at: string;
}

export default function AgendaPage() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([
    {
      id: '1',
      title: 'Reunião com Cliente João Silva',
      description: 'Discutir andamento do processo trabalhista',
      client: 'João Silva',
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      type: 'reuniao',
      priority: 'alta',
      status: 'pendente',
      created_at: new Date().toISOString(),
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingTarefa, setEditingTarefa] = useState<Tarefa | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pendente' | 'concluida' | 'cancelada'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client: '',
    process: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    type: 'tarefa' as 'reuniao' | 'audiencia' | 'prazo' | 'tarefa' | 'outro',
    priority: 'media' as 'baixa' | 'media' | 'alta',
    status: 'pendente' as 'pendente' | 'concluida' | 'cancelada',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      client: '',
      process: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      type: 'tarefa',
      priority: 'media',
      status: 'pendente',
    });
    setEditingTarefa(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTarefa: Tarefa = {
      id: editingTarefa?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      client: formData.client,
      process: formData.process,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      priority: formData.priority,
      status: formData.status,
      created_at: editingTarefa?.created_at || new Date().toISOString(),
    };

    if (editingTarefa) {
      setTarefas(tarefas.map(t => t.id === editingTarefa.id ? newTarefa : t));
    } else {
      setTarefas([...tarefas, newTarefa]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (tarefa: Tarefa) => {
    setEditingTarefa(tarefa);
    setFormData({
      title: tarefa.title,
      description: tarefa.description,
      client: tarefa.client || '',
      process: tarefa.process || '',
      date: tarefa.date,
      time: tarefa.time,
      type: tarefa.type,
      priority: tarefa.priority,
      status: tarefa.status,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir esta tarefa?')) {
      setTarefas(tarefas.filter(t => t.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setTarefas(tarefas.map(t => 
      t.id === id 
        ? { ...t, status: t.status === 'pendente' ? 'concluida' : 'pendente' }
        : t
    ));
  };

  const filteredTarefas = tarefas
    .filter(tarefa => {
      const matchSearch = tarefa.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tarefa.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === 'all' || tarefa.status === filterStatus;
      const matchType = filterType === 'all' || tarefa.type === filterType;
      const matchDate = tarefa.date === selectedDate;
      return matchSearch && matchStatus && matchType && matchDate;
    })
    .sort((a, b) => {
      if (a.time && b.time) return a.time.localeCompare(b.time);
      return 0;
    });

  const tarefasPendentes = tarefas.filter(t => t.status === 'pendente').length;
  const tarefasConcluidas = tarefas.filter(t => t.status === 'concluida').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tarefas / Agenda</h1>
            <p className="text-gray-600">Gerencie suas tarefas e compromissos</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Tarefa
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{tarefasPendentes}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">{tarefasConcluidas}</p>
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
                <p className="text-2xl font-bold text-blue-600">{tarefas.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="all">Todos</option>
                  <option value="reuniao">Reunião</option>
                  <option value="audiencia">Audiência</option>
                  <option value="prazo">Prazo</option>
                  <option value="tarefa">Tarefa</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="all">Todos</option>
                  <option value="pendente">Pendente</option>
                  <option value="concluida">Concluída</option>
                  <option value="cancelada">Cancelada</option>
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
                  <th className="px-6 py-3 text-left text-sm font-semibold">Título</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Prioridade</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTarefas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Nenhuma tarefa encontrada para esta data
                    </td>
                  </tr>
                ) : (
                  filteredTarefas.map((tarefa) => (
                    <tr key={tarefa.id} className={`hover:bg-gray-50 ${tarefa.status === 'concluida' ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {tarefa.time || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                          {tarefa.type.charAt(0).toUpperCase() + tarefa.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{tarefa.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{tarefa.client || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          tarefa.priority === 'alta' 
                            ? 'bg-red-100 text-red-800'
                            : tarefa.priority === 'media'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {tarefa.priority.charAt(0).toUpperCase() + tarefa.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          tarefa.status === 'concluida' 
                            ? 'bg-green-100 text-green-800'
                            : tarefa.status === 'cancelada'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tarefa.status.charAt(0).toUpperCase() + tarefa.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => toggleStatus(tarefa.id)}
                            className={`p-2 text-white rounded transition-colors ${
                              tarefa.status === 'pendente' ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'
                            }`}
                            title={tarefa.status === 'pendente' ? 'Marcar como concluída' : 'Marcar como pendente'}
                          >
                            {tarefa.status === 'pendente' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleEdit(tarefa)}
                            className="p-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tarefa.id)}
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
                {editingTarefa ? 'Editar Tarefa' : 'Nova Tarefa'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Título da tarefa"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="tarefa">Tarefa</option>
                    <option value="reuniao">Reunião</option>
                    <option value="audiencia">Audiência</option>
                    <option value="prazo">Prazo</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Processo</label>
                  <input
                    type="text"
                    value={formData.process}
                    onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Número do processo"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Descrição da tarefa..."
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
