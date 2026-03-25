'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Edit, Trash2, X, FileText } from 'lucide-react';

interface ModeloContrato {
  id: string;
  title: string;
  content: string;
  category?: string;
  created_at: string;
}

export default function ModelosContratosPage() {
  const [modelos, setModelos] = useState<ModeloContrato[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingModelo, setEditingModelo] = useState<ModeloContrato | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  });

  const resetForm = () => {
    setFormData({ title: '', content: '', category: '' });
    setEditingModelo(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newModelo: ModeloContrato = {
      id: editingModelo?.id || Date.now().toString(),
      title: formData.title,
      content: formData.content,
      category: formData.category,
      created_at: editingModelo?.created_at || new Date().toISOString(),
    };

    if (editingModelo) {
      setModelos(modelos.map(m => m.id === editingModelo.id ? newModelo : m));
    } else {
      setModelos([...modelos, newModelo]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (modelo: ModeloContrato) => {
    setEditingModelo(modelo);
    setFormData({ 
      title: modelo.title,
      content: modelo.content,
      category: modelo.category || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este modelo de contrato?')) {
      setModelos(modelos.filter(m => m.id !== id));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modelos de Contratos</h1>
            <p className="text-gray-600">Gerencie os modelos de contratos</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Adicionar Modelo
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Título</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Categoria</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Data Criação</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {modelos.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Nenhum modelo de contrato cadastrado
                    </td>
                  </tr>
                ) : (
                  modelos.map((modelo) => (
                    <tr key={modelo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-600" />
                        {modelo.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{modelo.category || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(modelo.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(modelo)}
                            className="p-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(modelo.id)}
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editingModelo ? 'Editar Modelo' : 'Novo Modelo de Contrato'}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      placeholder="Ex: Contrato de Prestação de Serviços"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Selecionar</option>
                      <option>Trabalhista</option>
                      <option>Civil</option>
                      <option>Empresarial</option>
                      <option>Imobiliário</option>
                      <option>Outros</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conteúdo do Contrato <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
                    placeholder="Digite o conteúdo do modelo de contrato..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Você pode usar variáveis como [NOME_CLIENTE], [CPF], [ENDERECO], etc.
                  </p>
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
