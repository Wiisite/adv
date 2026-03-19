'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import Layout from '@/components/Layout';

interface Process {
  id: string;
  client_id: string;
  client_name: string;
  process_number: string;
  title: string;
  category: string;
  status: string;
  description: string;
}

interface Client {
  id: string;
  full_name: string;
}

export default function ProcessosPage() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);
  const [formData, setFormData] = useState({
    client_id: '',
    process_number: '',
    title: '',
    category: '',
    status: 'active',
    description: ''
  });

  useEffect(() => {
    loadProcesses();
    loadClients();
  }, []);

  const loadProcesses = async () => {
    const res = await fetch('/api/processes');
    const data = await res.json();
    setProcesses(data);
  };

  const loadClients = async () => {
    const res = await fetch('/api/clients');
    const data = await res.json();
    setClients(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProcess) {
      await fetch('/api/processes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: editingProcess.id })
      });
    } else {
      await fetch('/api/processes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    }

    setShowModal(false);
    setEditingProcess(null);
    setFormData({ client_id: '', process_number: '', title: '', category: '', status: 'active', description: '' });
    loadProcesses();
  };

  const handleEdit = (process: Process) => {
    setEditingProcess(process);
    setFormData({
      client_id: process.client_id,
      process_number: process.process_number,
      title: process.title,
      category: process.category,
      status: process.status,
      description: process.description
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir este processo?')) {
      await fetch(`/api/processes?id=${id}`, { method: 'DELETE' });
      loadProcesses();
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center">
              <Scale className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">Sistema de Advocacia</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Processos</h1>
            <p className="text-gray-600 mt-2">Gerencie seus processos jurídicos</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Processo
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processes.map((process) => (
                <tr key={process.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{process.process_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{process.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{process.client_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{process.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(process.status)}`}>
                      {process.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(process)} className="text-blue-600 hover:text-blue-900 mr-4">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(process.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{editingProcess ? 'Editar Processo' : 'Novo Processo'}</h2>
                <button onClick={() => { setShowModal(false); setEditingProcess(null); }}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número do Processo</label>
                    <input
                      type="text"
                      required
                      value={formData.process_number}
                      onChange={(e) => setFormData({ ...formData, process_number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                      <option value="active">Ativo</option>
                      <option value="pending">Pendente</option>
                      <option value="closed">Encerrado</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={4}
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  {editingProcess ? 'Atualizar' : 'Cadastrar'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}
