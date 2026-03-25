'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Edit, Trash2, X, Search } from 'lucide-react';

interface Prompt {
  id: string;
  title: string;
  text: string;
  created_at: string;
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([
    { id: '1', title: 'CRIMINAL', text: 'Caso Mais Detalhado', created_at: new Date().toISOString() },
    { id: '2', title: 'Caso Resumido', text: '', created_at: new Date().toISOString() },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    text: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      text: '',
    });
    setEditingPrompt(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPrompt: Prompt = {
      id: editingPrompt?.id || Date.now().toString(),
      title: formData.title,
      text: formData.text,
      created_at: editingPrompt?.created_at || new Date().toISOString(),
    };

    if (editingPrompt) {
      setPrompts(prompts.map(p => p.id === editingPrompt.id ? newPrompt : p));
    } else {
      setPrompts([...prompts, newPrompt]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setFormData({
      title: prompt.title,
      text: prompt.text,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este prompt?')) {
      setPrompts(prompts.filter(p => p.id !== id));
    }
  };

  const filteredPrompts = prompts.filter(prompt =>
    prompt.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Listar Prompts</h1>
            <p className="text-gray-600">Gerencie os prompts do sistema</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowInstructionsModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Instruções para editar o Prompt
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Adicionar Novo Contrato
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Título</label>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                Buscar
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Descrição</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPrompts.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                      Nenhum prompt encontrado
                    </td>
                  </tr>
                ) : (
                  filteredPrompts.map((prompt) => (
                    <tr key={prompt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{prompt.title}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(prompt)}
                            className="p-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prompt.id)}
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
                {editingPrompt ? 'Editar Prompt' : 'Adicionar Novo Contrato'}
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
                    placeholder="Título do prompt"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Texto <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    rows={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Digite o texto do prompt..."
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
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
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

      {showInstructionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Instruções para editar o Prompt</h2>
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">📝 Instruções para editar o Prompt</h3>
                <p className="text-gray-700 mb-4">
                  Você pode adicionar variáveis que o sistema preencherá com as informações específicas de cada caso. 
                  Você pode editar livremente e adicionar as informações que achar necessário.
                </p>
                
                <div className="space-y-2">
                  <p className="text-gray-700">Essas chaves representam variáveis que o sistema preencherá com os dados do caso:</p>
                  
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-mono text-sm text-gray-800"><strong>[tipo_acao]</strong> - Tipo de ação jurídica (ex: Ação de Cobrança, Divórcio, Inventário, etc)</p>
                  </div>
                  
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-mono text-sm text-gray-800"><strong>[descricao]</strong> - Descrição detalhada do caso informada pelo cliente ou advogado</p>
                  </div>
                  
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-mono text-sm text-gray-800"><strong>[partes]</strong> - Partes envolvidas no processo (ex: Autor, Réu, Reclamante, etc)</p>
                  </div>
                  
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-mono text-sm text-gray-800"><strong>[processo_existente]</strong> - Informações sobre o processo anterior (se existir)</p>
                  </div>
                  
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-mono text-sm text-gray-800"><strong>[objetivo]</strong> - Objetivo ou expectativa do cliente com o processo</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-gray-700">
                    <strong>💡 Exemplo de prompt correto:</strong><br/>
                    Você é um advogado especialista em <span className="font-mono bg-gray-100 px-1">[tipo_acao]</span>. 
                    Analise o caso: <span className="font-mono bg-gray-100 px-1">[descricao]</span>. 
                    As partes envolvidas são: <span className="font-mono bg-gray-100 px-1">[partes]</span>. 
                    Forneça uma análise jurídica detalhada.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">❌ O que não fazer:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Não copiar variáveis dentro dos colchetes (ex: tipo_acao)</li>
                  <li>Não repetir variáveis sem necessidade</li>
                  <li>Não alterar o nome das variáveis entre colchetes</li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">✅ O que pode fazer:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Adicionar o texto livre que desejar entre as variáveis</li>
                  <li>Adicionar instruções extras à IA</li>
                  <li>Modificar a ordem das variáveis</li>
                  <li>Adicionar contexto jurídico relevante</li>
                </ul>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={() => setShowInstructionsModal(false)}
                  className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Entendi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
