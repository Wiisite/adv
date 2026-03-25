'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Edit, Trash2, Eye, X, Search, Phone, Mail } from 'lucide-react';

interface Fornecedor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  cnpj?: string;
  address?: string;
  city?: string;
  state?: string;
  category?: string;
  created_at: string;
}

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<Fornecedor | null>(null);
  const [viewingFornecedor, setViewingFornecedor] = useState<Fornecedor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cnpj: '',
    address: '',
    city: '',
    state: '',
    category: '',
    contact_person: '',
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      cnpj: '',
      address: '',
      city: '',
      state: '',
      category: '',
      contact_person: '',
      notes: '',
    });
    setEditingFornecedor(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newFornecedor: Fornecedor = {
      id: editingFornecedor?.id || Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      cnpj: formData.cnpj,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      category: formData.category,
      created_at: editingFornecedor?.created_at || new Date().toISOString(),
    };

    if (editingFornecedor) {
      setFornecedores(fornecedores.map(f => f.id === editingFornecedor.id ? newFornecedor : f));
    } else {
      setFornecedores([...fornecedores, newFornecedor]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (fornecedor: Fornecedor) => {
    setEditingFornecedor(fornecedor);
    setFormData({
      name: fornecedor.name,
      email: fornecedor.email || '',
      phone: fornecedor.phone || '',
      cnpj: fornecedor.cnpj || '',
      address: fornecedor.address || '',
      city: fornecedor.city || '',
      state: fornecedor.state || '',
      category: fornecedor.category || '',
      contact_person: '',
      notes: '',
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este fornecedor?')) {
      setFornecedores(fornecedores.filter(f => f.id !== id));
    }
  };

  const handleViewFornecedor = (fornecedor: Fornecedor) => {
    setViewingFornecedor(fornecedor);
    setShowViewModal(true);
  };

  const handleWhatsApp = (phone: string) => {
    if (!phone) {
      alert('Fornecedor não possui telefone cadastrado');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
  };

  const handleEmail = (email: string) => {
    if (!email) {
      alert('Fornecedor não possui email cadastrado');
      return;
    }
    window.location.href = `mailto:${email}`;
  };

  const filteredFornecedores = fornecedores.filter(fornecedor =>
    fornecedor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.cnpj?.includes(searchTerm)
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fornecedores</h1>
            <p className="text-gray-600">Gerencie os fornecedores</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Adicionar Fornecedor
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
                  <th className="px-6 py-3 text-left text-sm font-semibold">CNPJ</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Categoria</th>
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
                ) : filteredFornecedores.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Nenhum fornecedor encontrado
                    </td>
                  </tr>
                ) : (
                  filteredFornecedores.map((fornecedor, index) => (
                    <tr key={fornecedor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{fornecedor.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{fornecedor.phone || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{fornecedor.email || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{fornecedor.cnpj || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{fornecedor.category || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(fornecedor)}
                            className="p-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(fornecedor.id)}
                            className="p-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleWhatsApp(fornecedor.phone || '')}
                            className="p-2 text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
                            title="WhatsApp"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEmail(fornecedor.email || '')}
                            className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                            title="Email"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleViewFornecedor(fornecedor)}
                            className="p-2 text-white bg-gray-700 rounded hover:bg-gray-800 transition-colors"
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
                {editingFornecedor ? 'Editar Fornecedor' : 'Novo Fornecedor'}
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
                    Nome / Razão Social <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Nome do fornecedor"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                  <input
                    type="text"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="00.000.000/0000-00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Selecionar</option>
                    <option>Papelaria</option>
                    <option>Tecnologia</option>
                    <option>Serviços</option>
                    <option>Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pessoa de Contato</label>
                  <input
                    type="text"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Nome do contato"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Endereço"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Cidade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Selecionar</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Observações sobre o fornecedor..."
                  />
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

      {showViewModal && viewingFornecedor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Detalhes do Fornecedor</h2>
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
                  <label className="block text-sm font-medium text-gray-500">Nome / Razão Social</label>
                  <p className="text-gray-900 font-medium">{viewingFornecedor.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{viewingFornecedor.email || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Telefone</label>
                  <p className="text-gray-900">{viewingFornecedor.phone || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">CNPJ</label>
                  <p className="text-gray-900">{viewingFornecedor.cnpj || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Categoria</label>
                  <p className="text-gray-900">{viewingFornecedor.category || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Data de Cadastro</label>
                  <p className="text-gray-900">{new Date(viewingFornecedor.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500">Endereço</label>
                  <p className="text-gray-900">{viewingFornecedor.address || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Cidade</label>
                  <p className="text-gray-900">{viewingFornecedor.city || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Estado</label>
                  <p className="text-gray-900">{viewingFornecedor.state || '-'}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(viewingFornecedor);
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
