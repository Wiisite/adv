'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Edit, Trash2, X, Search, FileText, Pin, Calendar } from 'lucide-react';

interface Anotacao {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: 'baixa' | 'media' | 'alta';
  pinned: boolean;
  client?: string;
  process?: string;
  created_at: string;
  updated_at: string;
}

export default function AnotacoesPage() {
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([
    {
      id: '1',
      title: 'Reunião com Cliente João Silva',
      content: 'Discutir estratégia para o processo trabalhista. Cliente mencionou novos documentos.',
      category: 'Reunião',
      priority: 'alta',
      pinned: true,
      client: 'João Silva',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingAnotacao, setEditingAnotacao] = useState<Anotacao | null>(null);
  const [viewingAnotacao, setViewingAnotacao] = useState<Anotacao | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Geral',
    priority: 'media' as 'baixa' | 'media' | 'alta',
    pinned: false,
    client: '',
    process: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'Geral',
      priority: 'media',
      pinned: false,
      client: '',
      process: '',
    });
    setEditingAnotacao(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAnotacao: Anotacao = {
      id: editingAnotacao?.id || Date.now().toString(),
      title: formData.title,
      content: formData.content,
      category: formData.category,
      priority: formData.priority,
      pinned: formData.pinned,
      client: formData.client,
      process: formData.process,
      created_at: editingAnotacao?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (editingAnotacao) {
      setAnotacoes(anotacoes.map(a => a.id === editingAnotacao.id ? newAnotacao : a));
    } else {
      setAnotacoes([...anotacoes, newAnotacao]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (anotacao: Anotacao) => {
    setEditingAnotacao(anotacao);
    setFormData({
      title: anotacao.title,
      content: anotacao.content,
      category: anotacao.category,
      priority: anotacao.priority,
      pinned: anotacao.pinned,
      client: anotacao.client || '',
      process: anotacao.process || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir esta anotação?')) {
      setAnotacoes(anotacoes.filter(a => a.id !== id));
    }
  };

  const handleView = (anotacao: Anotacao) => {
    setViewingAnotacao(anotacao);
    setShowViewModal(true);
  };

  const togglePin = (id: string) => {
    setAnotacoes(anotacoes.map(a => 
      a.id === id ? { ...a, pinned: !a.pinned } : a
    ));
  };

  const filteredAnotacoes = anotacoes
    .filter(anotacao => {
      const matchSearch = anotacao.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         anotacao.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = filterCategory === 'all' || anotacao.category === filterCategory;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Anotações</h1>
            <p className="text-gray-600">Gerencie suas anotações e lembretes</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Anotação
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar anotações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">Todas as Categorias</option>
                <option value="Geral">Geral</option>
                <option value="Reunião">Reunião</option>
                <option value="Processo">Processo</option>
                <option value="Cliente">Cliente</option>
                <option value="Lembrete">Lembrete</option>
              </select>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAnotacoes.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Nenhuma anotação encontrada</p>
                </div>
              ) : (
                filteredAnotacoes.map((anotacao) => (
                  <div
                    key={anotacao.id}
                    className={`bg-white border-2 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                      anotacao.pinned ? 'border-cyan-500' : 'border-gray-200'
                    }`}
                    onClick={() => handleView(anotacao)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {anotacao.pinned && (
                          <Pin className="w-4 h-4 text-cyan-600" />
                        )}
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          anotacao.priority === 'alta' 
                            ? 'bg-red-100 text-red-800'
                            : anotacao.priority === 'media'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {anotacao.priority.charAt(0).toUpperCase() + anotacao.priority.slice(1)}
                        </span>
                      </div>
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => togglePin(anotacao.id)}
                          className={`p-1 rounded hover:bg-gray-100 ${
                            anotacao.pinned ? 'text-cyan-600' : 'text-gray-400'
                          }`}
                          title={anotacao.pinned ? 'Desafixar' : 'Fixar'}
                        >
                          <Pin className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(anotacao)}
                          className="p-1 text-blue-600 rounded hover:bg-blue-50"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(anotacao.id)}
                          className="p-1 text-red-600 rounded hover:bg-red-50"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {anotacao.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {anotacao.content}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        {anotacao.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(anotacao.updated_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>

                    {anotacao.client && (
                      <div className="mt-2 text-xs text-gray-600">
                        Cliente: {anotacao.client}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editingAnotacao ? 'Editar Anotação' : 'Nova Anotação'}
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Título da anotação"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conteúdo <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Escreva sua anotação..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option>Geral</option>
                      <option>Reunião</option>
                      <option>Processo</option>
                      <option>Cliente</option>
                      <option>Lembrete</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prioridade
                    </label>
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

                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.pinned}
                        onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                        className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                      />
                      <span className="text-sm text-gray-700">Fixar anotação</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cliente
                    </label>
                    <input
                      type="text"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Nome do cliente"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Processo
                    </label>
                    <input
                      type="text"
                      value={formData.process}
                      onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Número do processo"
                    />
                  </div>
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

      {showViewModal && viewingAnotacao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">{viewingAnotacao.title}</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 text-sm font-medium rounded ${
                  viewingAnotacao.priority === 'alta' 
                    ? 'bg-red-100 text-red-800'
                    : viewingAnotacao.priority === 'media'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  Prioridade: {viewingAnotacao.priority.charAt(0).toUpperCase() + viewingAnotacao.priority.slice(1)}
                </span>
                <span className="px-3 py-1 text-sm bg-gray-100 rounded">
                  {viewingAnotacao.category}
                </span>
                {viewingAnotacao.pinned && (
                  <span className="px-3 py-1 text-sm bg-cyan-100 text-cyan-800 rounded flex items-center gap-1">
                    <Pin className="w-3 h-3" />
                    Fixada
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Conteúdo</label>
                <p className="text-gray-900 whitespace-pre-wrap">{viewingAnotacao.content}</p>
              </div>

              {viewingAnotacao.client && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Cliente</label>
                  <p className="text-gray-900">{viewingAnotacao.client}</p>
                </div>
              )}

              {viewingAnotacao.process && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Processo</label>
                  <p className="text-gray-900">{viewingAnotacao.process}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Criado em</label>
                  <p className="text-gray-900 text-sm">
                    {new Date(viewingAnotacao.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Atualizado em</label>
                  <p className="text-gray-900 text-sm">
                    {new Date(viewingAnotacao.updated_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(viewingAnotacao);
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
