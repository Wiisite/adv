'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Calendar as CalendarIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Appointment {
  id: string;
  client_id: string;
  client_name: string;
  title: string;
  description: string;
  appointment_date: string;
  status: string;
}

interface Client {
  id: string;
  full_name: string;
}

export default function AgendaPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    client_id: '',
    title: '',
    description: '',
    appointment_date: '',
    status: 'scheduled'
  });

  useEffect(() => {
    loadAppointments();
    loadClients();
  }, []);

  const loadAppointments = async () => {
    const res = await fetch('/api/appointments');
    const data = await res.json();
    setAppointments(data);
  };

  const loadClients = async () => {
    const res = await fetch('/api/clients');
    const data = await res.json();
    setClients(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAppointment) {
      await fetch('/api/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: editingAppointment.id })
      });
    } else {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    }

    setShowModal(false);
    setEditingAppointment(null);
    setFormData({ client_id: '', title: '', description: '', appointment_date: '', status: 'scheduled' });
    loadAppointments();
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    const date = new Date(appointment.appointment_date);
    const formattedDate = date.toISOString().slice(0, 16);
    setFormData({
      client_id: appointment.client_id,
      title: appointment.title,
      description: appointment.description,
      appointment_date: formattedDate,
      status: appointment.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir este compromisso?')) {
      await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' });
      loadAppointments();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.scheduled;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
            <p className="text-gray-600 mt-2">Gerencie seus compromissos</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Compromisso
          </button>
        </div>

        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <CalendarIcon className="h-10 w-10 text-orange-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{appointment.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">Cliente: {appointment.client_name}</p>
                    <p className="text-sm text-gray-500 mt-1">{appointment.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-600">{formatDate(appointment.appointment_date)}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(appointment)} className="text-blue-600 hover:text-blue-900">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDelete(appointment.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{editingAppointment ? 'Editar Compromisso' : 'Novo Compromisso'}</h2>
                <button onClick={() => { setShowModal(false); setEditingAppointment(null); }}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                  <select
                    required
                    value={formData.client_id}
                    onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Selecione um cliente</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.full_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.appointment_date}
                    onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="scheduled">Agendado</option>
                    <option value="completed">Concluído</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  {editingAppointment ? 'Atualizar' : 'Cadastrar'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
