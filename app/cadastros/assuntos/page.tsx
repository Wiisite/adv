'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Edit, Trash2, X } from 'lucide-react';

interface Assunto {
  id: string;
  description: string;
  category?: string;
  created_at: string;
}

export default function AssuntosPage() {
  const [assuntos, setAssuntos] = useState<Assunto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAssunto, setEditingAssunto] = useState<Assunto | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    category: '',
  });

  const resetForm = () => {
    setFormData({ description: '', category: '' });
    setEditingAssunto(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAssunto: Assunto = {
      id: editingAssunto?.id || Date.now().toString(),
      description: formData.description,
      category: formData.category,
      created_at: editingAssunto?.created_at || new Date().toISOString(),
    };

    if (editingAssunto) {
      setAssuntos(assuntos.map(a => a.id === editingAssunto.id ? newAssunto : a));
    } else {
      setAssuntos([...assuntos, newAssunto]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (assunto: Assunto) => {
    setEditingAssunto(assunto);
    setFormData({ 
      description: assunto.description,
      category: assunto.category || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este assunto?')) {
      setAssuntos(assuntos.filter(a => a.id !== id));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assuntos</h1>
            <p className="text-gray-600">Gerencie os assuntos jurídicos</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Adicionar
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Descrição</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Categoria</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {assuntos.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      Nenhum assunto cadastrado
                    </td>
                  </tr>
                ) : (
                  assuntos.map((assunto) => (
                    <tr key={assunto.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{assunto.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{assunto.category || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(assunto)}
                            className="p-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(assunto.id)}
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editingAssunto ? 'Editar Assunto' : 'Novo Assunto'}
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
                    Descrição <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Ex: Divórcio, Inventário, Ação Trabalhista, etc"
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
                    <option>Civil</option>
                    <option>Trabalhista</option>
                    <option>Criminal</option>
                    <option>Família</option>
                    <option>Empresarial</option>
                    <option>Tributário</option>
                    <option>Outros</option>
                  </select>
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
