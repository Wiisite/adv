'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Edit, Trash2, X, Search, Eye, TrendingUp, Target } from 'lucide-react';

interface Campanha {
  id: string;
  name: string;
  type: string;
  platform: string;
  start_date: string;
  end_date?: string;
  budget: string;
  status: 'planejada' | 'ativa' | 'pausada' | 'concluida';
  results?: string;
  notes: string;
  created_at: string;
}

export default function MarketingPage() {
  const [campanhas, setCampanhas] = useState<Campanha[]>([
    {
      id: '1',
      name: 'Campanha Google Ads - Direito Trabalhista',
      type: 'Anúncios Pagos',
      platform: 'Google Ads',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget: '2000',
      status: 'ativa',
      results: '150 cliques, 12 conversões',
      notes: 'Foco em palavras-chave de direito trabalhista',
      created_at: new Date().toISOString(),
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingCampanha, setEditingCampanha] = useState<Campanha | null>(null);
  const [viewingCampanha, setViewingCampanha] = useState<Campanha | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'planejada' | 'ativa' | 'pausada' | 'concluida'>('all');
  const [formData, setFormData] = useState({
    name: '',
    type: 'Anúncios Pagos',
    platform: 'Google Ads',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    budget: '',
    status: 'planejada' as 'planejada' | 'ativa' | 'pausada' | 'concluida',
    results: '',
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Anúncios Pagos',
      platform: 'Google Ads',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      budget: '',
      status: 'planejada',
      results: '',
      notes: '',
    });
    setEditingCampanha(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCampanha: Campanha = {
      id: editingCampanha?.id || Date.now().toString(),
      name: formData.name,
      type: formData.type,
      platform: formData.platform,
      start_date: formData.start_date,
      end_date: formData.end_date,
      budget: formData.budget,
      status: formData.status,
      results: formData.results,
      notes: formData.notes,
      created_at: editingCampanha?.created_at || new Date().toISOString(),
    };

    if (editingCampanha) {
      setCampanhas(campanhas.map(c => c.id === editingCampanha.id ? newCampanha : c));
    } else {
      setCampanhas([...campanhas, newCampanha]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (campanha: Campanha) => {
    setEditingCampanha(campanha);
    setFormData({
      name: campanha.name,
      type: campanha.type,
      platform: campanha.platform,
      start_date: campanha.start_date,
      end_date: campanha.end_date || '',
      budget: campanha.budget,
      status: campanha.status,
      results: campanha.results || '',
      notes: campanha.notes,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir esta campanha?')) {
      setCampanhas(campanhas.filter(c => c.id !== id));
    }
  };

  const handleView = (campanha: Campanha) => {
    setViewingCampanha(campanha);
    setShowViewModal(true);
  };

  const filteredCampanhas = campanhas.filter(campanha => {
    const matchSearch = campanha.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       campanha.platform.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || campanha.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const campanhasAtivas = campanhas.filter(c => c.status === 'ativa').length;
  const totalInvestido = campanhas.reduce((sum, c) => sum + parseFloat(c.budget || '0'), 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Marketing</h1>
            <p className="text-gray-600">Gerencie as campanhas de marketing</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Campanha
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Campanhas Ativas</p>
                <p className="text-2xl font-bold text-green-600">{campanhasAtivas}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Investido</p>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Campanhas</p>
                <p className="text-2xl font-bold text-gray-900">{campanhas.length}</p>
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
                  placeholder="Buscar campanha..."
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
                <option value="planejada">Planejada</option>
                <option value="ativa">Ativa</option>
                <option value="pausada">Pausada</option>
                <option value="concluida">Concluída</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyan-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Campanha</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Plataforma</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Período</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Orçamento</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCampanhas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Nenhuma campanha encontrada
                    </td>
                  </tr>
                ) : (
                  filteredCampanhas.map((campanha) => (
                    <tr key={campanha.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{campanha.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-800">
                          {campanha.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{campanha.platform}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(campanha.start_date).toLocaleDateString('pt-BR')}
                        {campanha.end_date && ` - ${new Date(campanha.end_date).toLocaleDateString('pt-BR')}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        R$ {parseFloat(campanha.budget).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          campanha.status === 'ativa' 
                            ? 'bg-green-100 text-green-800'
                            : campanha.status === 'pausada'
                            ? 'bg-yellow-100 text-yellow-800'
                            : campanha.status === 'concluida'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {campanha.status.charAt(0).toUpperCase() + campanha.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleView(campanha)}
                            className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(campanha)}
                            className="p-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(campanha.id)}
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
                {editingCampanha ? 'Editar Campanha' : 'Nova Campanha'}
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
                    Nome da Campanha <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Nome da campanha"
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
                    <option value="Anúncios Pagos">Anúncios Pagos</option>
                    <option value="Redes Sociais">Redes Sociais</option>
                    <option value="Email Marketing">Email Marketing</option>
                    <option value="SEO">SEO</option>
                    <option value="Conteúdo">Conteúdo</option>
                    <option value="Eventos">Eventos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plataforma <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Google Ads">Google Ads</option>
                    <option value="Facebook Ads">Facebook Ads</option>
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Email">Email</option>
                    <option value="Site">Site</option>
                    <option value="Outros">Outros</option>
                  </select>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orçamento (R$) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
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
                    <option value="planejada">Planejada</option>
                    <option value="ativa">Ativa</option>
                    <option value="pausada">Pausada</option>
                    <option value="concluida">Concluída</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resultados</label>
                  <input
                    type="text"
                    value={formData.results}
                    onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Ex: 150 cliques, 12 conversões"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Observações sobre a campanha..."
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

      {showViewModal && viewingCampanha && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Detalhes da Campanha</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Nome da Campanha</label>
                  <p className="text-gray-900 font-medium">{viewingCampanha.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Tipo</label>
                  <p className="text-gray-900">{viewingCampanha.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Plataforma</label>
                  <p className="text-gray-900">{viewingCampanha.platform}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Data de Início</label>
                  <p className="text-gray-900">{new Date(viewingCampanha.start_date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Data de Término</label>
                  <p className="text-gray-900">
                    {viewingCampanha.end_date ? new Date(viewingCampanha.end_date).toLocaleDateString('pt-BR') : '-'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Orçamento</label>
                  <p className="text-gray-900 font-medium">
                    R$ {parseFloat(viewingCampanha.budget).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    viewingCampanha.status === 'ativa' 
                      ? 'bg-green-100 text-green-800'
                      : viewingCampanha.status === 'pausada'
                      ? 'bg-yellow-100 text-yellow-800'
                      : viewingCampanha.status === 'concluida'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {viewingCampanha.status.charAt(0).toUpperCase() + viewingCampanha.status.slice(1)}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Resultados</label>
                  <p className="text-gray-900">{viewingCampanha.results || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Observações</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{viewingCampanha.notes || '-'}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(viewingCampanha);
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
