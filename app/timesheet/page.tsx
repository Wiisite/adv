'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Edit, Trash2, X, Clock, Play, Pause, Calendar, DollarSign } from 'lucide-react';

interface TimeEntry {
  id: string;
  client: string;
  process: string;
  activity: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  hourlyRate: number;
  total: number;
  status: 'em_andamento' | 'pausado' | 'concluido';
}

export default function TimesheetPage() {
  const [entries, setEntries] = useState<TimeEntry[]>([
    {
      id: '1',
      client: 'João Silva',
      process: '0001234-56.2024',
      activity: 'Elaboração de petição inicial',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '11:30',
      duration: 2.5,
      hourlyRate: 300,
      total: 750,
      status: 'concluido',
    },
    {
      id: '2',
      client: 'Maria Santos',
      process: '0002345-67.2024',
      activity: 'Reunião com cliente',
      date: new Date().toISOString().split('T')[0],
      startTime: '14:00',
      endTime: '15:00',
      duration: 1,
      hourlyRate: 300,
      total: 300,
      status: 'concluido',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const [formData, setFormData] = useState({
    client: '',
    process: '',
    activity: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    hourlyRate: '300',
  });

  const resetForm = () => {
    setFormData({
      client: '',
      process: '',
      activity: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      hourlyRate: '300',
    });
    setEditingEntry(null);
  };

  const calculateDuration = (start: string, end: string) => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return (endMinutes - startMinutes) / 60;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const duration = calculateDuration(formData.startTime, formData.endTime);
    const hourlyRate = parseFloat(formData.hourlyRate);
    const total = duration * hourlyRate;

    const newEntry: TimeEntry = {
      id: editingEntry?.id || Date.now().toString(),
      client: formData.client,
      process: formData.process,
      activity: formData.activity,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      duration,
      hourlyRate,
      total,
      status: 'concluido',
    };

    if (editingEntry) {
      setEntries(entries.map(e => e.id === editingEntry.id ? newEntry : e));
    } else {
      setEntries([...entries, newEntry]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setFormData({
      client: entry.client,
      process: entry.process,
      activity: entry.activity,
      date: entry.date,
      startTime: entry.startTime,
      endTime: entry.endTime,
      hourlyRate: entry.hourlyRate.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este registro?')) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const totalHours = entries.reduce((sum, e) => sum + e.duration, 0);
  const totalValue = entries.reduce((sum, e) => sum + e.total, 0);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Controle de Horas</h1>
            <p className="text-gray-600 dark:text-gray-400">Registre e gerencie suas horas trabalhadas</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Registro
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Horas</h3>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalHours.toFixed(1)}h</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Este mês</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Valor Total</h3>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Faturável</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Timer Ativo</h3>
              <Play className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{formatTime(timerSeconds)}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`flex-1 px-3 py-1 text-sm rounded ${
                  isTimerRunning
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isTimerRunning ? 'Pausar' : 'Iniciar'}
              </button>
              <button
                onClick={() => setTimerSeconds(0)}
                className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Resetar
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyan-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Data</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Processo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Atividade</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Horário</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Duração</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Valor</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      Nenhum registro encontrado
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {new Date(entry.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                        {entry.client}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{entry.process}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{entry.activity}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {entry.startTime} - {entry.endTime}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                        {entry.duration.toFixed(1)}h
                      </td>
                      <td className="px-6 py-4 text-sm text-green-600 dark:text-green-400 font-medium">
                        R$ {entry.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(entry)}
                            className="p-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editingEntry ? 'Editar Registro' : 'Novo Registro de Horas'}
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cliente <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Nome do cliente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Processo
                  </label>
                  <input
                    type="text"
                    value={formData.process}
                    onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Número do processo"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Atividade <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.activity}
                    onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Descrição da atividade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor/Hora (R$) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hora Início <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hora Fim <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
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
    </AppLayout>
  );
}
