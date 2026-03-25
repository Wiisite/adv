'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Edit, Trash2, X, Search, Eye, FileText } from 'lucide-react';

interface Andamento {
  id: string;
  process_number: string;
  process_title: string;
  date: string;
  type: string;
  description: string;
  responsible: string;
  created_at: string;
}

export default function ProcessosAndamentoPage() {
  const [andamentos, setAndamentos] = useState<Andamento[]>([
    {
      id: '1',
      process_number: '0001234-56.2024.8.26.0100',
      process_title: 'Ação Trabalhista - Horas Extras',
      date: new Date().toISOString().split('T')[0],
      type: 'Audiência',
      description: 'Audiência de conciliação realizada. Partes não chegaram a acordo.',
      responsible: 'Dr. João Silva',
      created_at: new Date().toISOString(),
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingAndamento, setEditingAndamento] = useState<Andamento | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [formData, setFormData] = useState({
    process_number: '',
    process_title: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Movimentação',
    description: '',
    responsible: '',
  });

  const resetForm = () => {
    setFormData({
      process_number: '',
      process_title: '',
      date: new Date().toISOString().split('T')[0],
      type: 'Movimentação',
      description: '',
      responsible: '',
    });
    setEditingAndamento(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAndamento: Andamento = {
      id: editingAndamento?.id || Date.now().toString(),
      process_number: formData.process_number,
      process_title: formData.process_title,
      date: formData.date,
      type: formData.type,
      description: formData.description,
      responsible: formData.responsible,
      created_at: editingAndamento?.created_at || new Date().toISOString(),
    };

    if (editingAndamento) {
      setAndamentos(andamentos.map(a => a.id === editingAndamento.id ? newAndamento : a));
    } else {
      setAndamentos([...andamentos, newAndamento]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (andamento: Andamento) => {
    setEditingAndamento(andamento);
    setFormData({
      process_number: andamento.process_number,
      process_title: andamento.process_title,
      date: andamento.date,
      type: andamento.type,
      description: andamento.description,
      responsible: andamento.responsible,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este andamento?')) {
      setAndamentos(andamentos.filter(a => a.id !== id));
    }
  };

  const filteredAndamentos = andamentos.filter(andamento => {
    const matchSearch = andamento.process_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       andamento.process_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       andamento.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || andamento.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Processos em Andamento</h1>
            <p className="text-gray-600">Acompanhe as movimentações processuais</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Andamento
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por número do processo, título ou descrição..."
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
                <option value="Movimentação">Movimentação</option>
                <option value="Audiência">Audiência</option>
                <option value="Sentença">Sentença</option>
                <option value="Recurso">Recurso</option>
                <option value="Despacho">Despacho</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyan-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Data</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Processo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Descrição</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Responsável</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndamentos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Nenhum andamento encontrado
                    </td>
                  </tr>
                ) : (
                  filteredAndamentos.map((andamento) => (
                    <tr key={andamento.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {new Date(andamento.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">{andamento.process_number}</div>
                        <div className="text-xs text-gray-500">{andamento.process_title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                          {andamento.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                        {andamento.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{andamento.responsible}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(andamento)}
                            className="p-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(andamento.id)}
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
                {editingAndamento ? 'Editar Andamento' : 'Novo Andamento'}
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
                    Tipo de Andamento <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Movimentação">Movimentação</option>
                    <option value="Audiência">Audiência</option>
                    <option value="Sentença">Sentença</option>
                    <option value="Recurso">Recurso</option>
                    <option value="Despacho">Despacho</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                  <input
                    type="text"
                    value={formData.responsible}
                    onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Nome do responsável"
                  />
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
                    placeholder="Descreva o andamento processual..."
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
