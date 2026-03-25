'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Edit, Trash2, Eye, X, Search } from 'lucide-react';

interface Profissional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  specialization?: string;
  cargo?: string;
  created_at: string;
}

export default function ProfissionaisPage() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingProfissional, setEditingProfissional] = useState<Profissional | null>(null);
  const [viewingProfissional, setViewingProfissional] = useState<Profissional | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: 'Advogado',
    cargo: '',
    estado_civil: 'Solteiro(a)',
    nacionalidade: 'Brasileiro',
    endereco: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialization: 'Advogado',
      cargo: '',
      estado_civil: 'Solteiro(a)',
      nacionalidade: 'Brasileiro',
      endereco: '',
    });
    setEditingProfissional(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProfissional: Profissional = {
      id: editingProfissional?.id || Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      specialization: formData.specialization,
      cargo: formData.cargo,
      created_at: editingProfissional?.created_at || new Date().toISOString(),
    };

    if (editingProfissional) {
      setProfissionais(profissionais.map(p => p.id === editingProfissional.id ? newProfissional : p));
    } else {
      setProfissionais([...profissionais, newProfissional]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (profissional: Profissional) => {
    setEditingProfissional(profissional);
    setFormData({
      name: profissional.name,
      email: profissional.email || '',
      phone: profissional.phone || '',
      specialization: profissional.specialization || 'Advogado',
      cargo: profissional.cargo || '',
      estado_civil: 'Solteiro(a)',
      nacionalidade: 'Brasileiro',
      endereco: '',
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este profissional?')) {
      setProfissionais(profissionais.filter(p => p.id !== id));
    }
  };

  const handleViewProfissional = (profissional: Profissional) => {
    setViewingProfissional(profissional);
    setShowViewModal(true);
  };

  const filteredProfissionais = profissionais.filter(prof =>
    prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profissionais</h1>
            <p className="text-gray-600">Gerencie os profissionais</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Adicionar Profissional
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyan-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Número</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Nome</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Telefone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Cargo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Especialidade</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Carregando...
                    </td>
                  </tr>
                ) : filteredProfissionais.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Nenhum profissional encontrado
                    </td>
                  </tr>
                ) : (
                  filteredProfissionais.map((profissional, index) => (
                    <tr key={profissional.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{profissional.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{profissional.phone || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{profissional.email || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{profissional.cargo || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{profissional.specialization || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(profissional)}
                            className="p-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(profissional.id)}
                            className="p-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleViewProfissional(profissional)}
                            className="p-2 text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
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
                {editingProfissional ? 'Editar Registro' : 'Inserir Registro'}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                  <select
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Selecionar</option>
                    <option>Advogado</option>
                    <option>Estagiário</option>
                    <option>Secretário</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade Advogado</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Especialidade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nacionalidade</label>
                  <input
                    type="text"
                    value={formData.nacionalidade}
                    onChange={(e) => setFormData({ ...formData, nacionalidade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Nacionalidade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil</label>
                  <select
                    value={formData.estado_civil}
                    onChange={(e) => setFormData({ ...formData, estado_civil: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option>Solteiro(a)</option>
                    <option>Casado(a)</option>
                    <option>Divorciado(a)</option>
                    <option>Viúvo(a)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Residencial</label>
                  <input
                    type="text"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Endereço"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visto Por</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option>Todo Escritório</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && viewingProfissional && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Detalhes do Profissional</h2>
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
                  <label className="block text-sm font-medium text-gray-500">Nome</label>
                  <p className="text-gray-900 font-medium">{viewingProfissional.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{viewingProfissional.email || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Telefone</label>
                  <p className="text-gray-900">{viewingProfissional.phone || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Cargo</label>
                  <p className="text-gray-900">{viewingProfissional.cargo || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Especialidade</label>
                  <p className="text-gray-900">{viewingProfissional.specialization || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Data de Cadastro</label>
                  <p className="text-gray-900">{new Date(viewingProfissional.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(viewingProfissional);
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
