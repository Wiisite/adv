'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Edit, Trash2, X, Search, Eye, Globe, Image as ImageIcon } from 'lucide-react';

interface ConteudoSite {
  id: string;
  section: string;
  title: string;
  content: string;
  image_url?: string;
  published: boolean;
  order: number;
  created_at: string;
}

export default function SitePage() {
  const [conteudos, setConteudos] = useState<ConteudoSite[]>([
    {
      id: '1',
      section: 'Banner Principal',
      title: 'Escritório de Advocacia Especializado',
      content: 'Mais de 20 anos de experiência em direito trabalhista, civil e previdenciário',
      image_url: '/images/banner.jpg',
      published: true,
      order: 1,
      created_at: new Date().toISOString(),
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingConteudo, setEditingConteudo] = useState<ConteudoSite | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSection, setFilterSection] = useState<string>('all');
  const [formData, setFormData] = useState({
    section: 'Banner Principal',
    title: '',
    content: '',
    image_url: '',
    published: true,
    order: 1,
  });

  const resetForm = () => {
    setFormData({
      section: 'Banner Principal',
      title: '',
      content: '',
      image_url: '',
      published: true,
      order: 1,
    });
    setEditingConteudo(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newConteudo: ConteudoSite = {
      id: editingConteudo?.id || Date.now().toString(),
      section: formData.section,
      title: formData.title,
      content: formData.content,
      image_url: formData.image_url,
      published: formData.published,
      order: formData.order,
      created_at: editingConteudo?.created_at || new Date().toISOString(),
    };

    if (editingConteudo) {
      setConteudos(conteudos.map(c => c.id === editingConteudo.id ? newConteudo : c));
    } else {
      setConteudos([...conteudos, newConteudo]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (conteudo: ConteudoSite) => {
    setEditingConteudo(conteudo);
    setFormData({
      section: conteudo.section,
      title: conteudo.title,
      content: conteudo.content,
      image_url: conteudo.image_url || '',
      published: conteudo.published,
      order: conteudo.order,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este conteúdo?')) {
      setConteudos(conteudos.filter(c => c.id !== id));
    }
  };

  const togglePublished = (id: string) => {
    setConteudos(conteudos.map(c => 
      c.id === id ? { ...c, published: !c.published } : c
    ));
  };

  const filteredConteudos = conteudos.filter(conteudo => {
    const matchSearch = conteudo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       conteudo.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSection = filterSection === 'all' || conteudo.section === filterSection;
    return matchSearch && matchSection;
  }).sort((a, b) => a.order - b.order);

  const conteudosPublicados = conteudos.filter(c => c.published).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gerenciamento do Site</h1>
            <p className="text-gray-600">Gerencie o conteúdo do site institucional</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Conteúdo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Publicados</p>
                <p className="text-2xl font-bold text-green-600">{conteudosPublicados}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rascunhos</p>
                <p className="text-2xl font-bold text-yellow-600">{conteudos.length - conteudosPublicados}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Edit className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-blue-600">{conteudos.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ImageIcon className="w-6 h-6 text-blue-600" />
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
                  placeholder="Buscar conteúdo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">Todas as Seções</option>
                <option value="Banner Principal">Banner Principal</option>
                <option value="Sobre Nós">Sobre Nós</option>
                <option value="Áreas de Atuação">Áreas de Atuação</option>
                <option value="Equipe">Equipe</option>
                <option value="Depoimentos">Depoimentos</option>
                <option value="Contato">Contato</option>
                <option value="Blog">Blog</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyan-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Ordem</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Seção</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Título</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Conteúdo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredConteudos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Nenhum conteúdo encontrado
                    </td>
                  </tr>
                ) : (
                  filteredConteudos.map((conteudo) => (
                    <tr key={conteudo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{conteudo.order}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-800">
                          {conteudo.section}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{conteudo.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                        {conteudo.content}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => togglePublished(conteudo.id)}
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            conteudo.published 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {conteudo.published ? 'Publicado' : 'Rascunho'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(conteudo)}
                            className="p-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(conteudo.id)}
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
                {editingConteudo ? 'Editar Conteúdo' : 'Novo Conteúdo'}
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
                    Seção <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Banner Principal">Banner Principal</option>
                    <option value="Sobre Nós">Sobre Nós</option>
                    <option value="Áreas de Atuação">Áreas de Atuação</option>
                    <option value="Equipe">Equipe</option>
                    <option value="Depoimentos">Depoimentos</option>
                    <option value="Contato">Contato</option>
                    <option value="Blog">Blog</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ordem</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    min="1"
                  />
                </div>

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
                    placeholder="Título do conteúdo"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="/images/exemplo.jpg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conteúdo <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Conteúdo da seção..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Publicar no site</span>
                  </label>
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
