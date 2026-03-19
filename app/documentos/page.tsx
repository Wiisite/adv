'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, X, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Document {
  id: string;
  process_id: string;
  process_title: string;
  process_number: string;
  title: string;
  file_type: string;
  created_at: string;
}

interface Process {
  id: string;
  title: string;
  process_number: string;
}

export default function DocumentosPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    process_id: '',
    title: '',
    file_type: 'PDF'
  });

  useEffect(() => {
    loadDocuments();
    loadProcesses();
  }, []);

  const loadDocuments = async () => {
    const res = await fetch('/api/documents');
    const data = await res.json();
    setDocuments(data);
  };

  const loadProcesses = async () => {
    const res = await fetch('/api/processes');
    const data = await res.json();
    setProcesses(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    setShowModal(false);
    setFormData({ process_id: '', title: '', file_type: 'PDF' });
    loadDocuments();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir este documento?')) {
      await fetch(`/api/documents?id=${id}`, { method: 'DELETE' });
      loadDocuments();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Documentos</h1>
            <p className="text-gray-600 mt-2">Gerencie documentos dos processos</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Documento
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <FileText className="h-10 w-10 text-purple-600" />
                <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-900">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.title}</h3>
              <p className="text-sm text-gray-600 mb-1">Processo: {doc.process_number}</p>
              <p className="text-sm text-gray-500 mb-2">{doc.process_title}</p>
              <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                {doc.file_type}
              </span>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Novo Documento</h2>
                <button onClick={() => setShowModal(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Processo</label>
                  <select
                    required
                    value={formData.process_id}
                    onChange={(e) => setFormData({ ...formData, process_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Selecione um processo</option>
                    {processes.map(process => (
                      <option key={process.id} value={process.id}>
                        {process.process_number} - {process.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título do Documento</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Arquivo</label>
                  <select
                    value={formData.file_type}
                    onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="XLSX">XLSX</option>
                    <option value="IMG">Imagem</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Cadastrar
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
