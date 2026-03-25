'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Edit, Trash2, X } from 'lucide-react';

interface FormaPgto {
  id: string;
  description: string;
  created_at: string;
}

export default function FormasPgtoPage() {
  const [formas, setFormas] = useState<FormaPgto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingForma, setEditingForma] = useState<FormaPgto | null>(null);
  const [formData, setFormData] = useState({
    description: '',
  });

  const resetForm = () => {
    setFormData({ description: '' });
    setEditingForma(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newForma: FormaPgto = {
      id: editingForma?.id || Date.now().toString(),
      description: formData.description,
      created_at: editingForma?.created_at || new Date().toISOString(),
    };

    if (editingForma) {
      setFormas(formas.map(f => f.id === editingForma.id ? newForma : f));
    } else {
      setFormas([...formas, newForma]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (forma: FormaPgto) => {
    setEditingForma(forma);
    setFormData({ description: forma.description });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir esta forma de pagamento?')) {
      setFormas(formas.filter(f => f.id !== id));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Formas de Pagamento</h1>
            <p className="text-gray-600">Gerencie as formas de pagamento</p>
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
                  <th className="px-6 py-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {formas.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                      Nenhuma forma de pagamento cadastrada
                    </td>
                  </tr>
                ) : (
                  formas.map((forma) => (
                    <tr key={forma.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{forma.description}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(forma)}
                            className="p-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(forma.id)}
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
                {editingForma ? 'Editar Forma de Pagamento' : 'Nova Forma de Pagamento'}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Ex: Dinheiro, Cartão, PIX, etc"
                />
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
