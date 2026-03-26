'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  Upload, FileText, Download, Eye, Edit, Trash2, X, Filter, 
  Folder, Tag, Clock, User, Search, File, FileImage, 
  FileSpreadsheet, Archive, Share2, Lock, Unlock 
} from 'lucide-react';

interface Documento {
  id: string;
  nome: string;
  tipo: string;
  categoria: string;
  tamanho: number;
  versao: number;
  dataUpload: string;
  uploadPor: string;
  tags: string[];
  processo?: string;
  cliente?: string;
  privado: boolean;
  versoes: {
    numero: number;
    data: string;
    usuario: string;
    observacao: string;
  }[];
}

export default function GestaoDocumentosPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([
    {
      id: '1',
      nome: 'Petição Inicial - João Silva.pdf',
      tipo: 'pdf',
      categoria: 'Petições',
      tamanho: 2500000,
      versao: 2,
      dataUpload: new Date().toISOString(),
      uploadPor: 'Dr. Pedro Santos',
      tags: ['urgente', 'trabalhista'],
      processo: '0001234-56.2024',
      cliente: 'João Silva',
      privado: false,
      versoes: [
        { numero: 1, data: '2026-03-20', usuario: 'Dr. Pedro Santos', observacao: 'Versão inicial' },
        { numero: 2, data: new Date().toISOString(), usuario: 'Dr. Pedro Santos', observacao: 'Correções solicitadas' },
      ],
    },
    {
      id: '2',
      nome: 'Contrato de Prestação de Serviços.docx',
      tipo: 'docx',
      categoria: 'Contratos',
      tamanho: 850000,
      versao: 1,
      dataUpload: '2026-03-22',
      uploadPor: 'Maria Oliveira',
      tags: ['contrato', 'consultoria'],
      cliente: 'Maria Santos',
      privado: true,
      versoes: [
        { numero: 1, data: '2026-03-22', usuario: 'Maria Oliveira', observacao: 'Versão inicial' },
      ],
    },
    {
      id: '3',
      nome: 'Comprovante de Pagamento.jpg',
      tipo: 'jpg',
      categoria: 'Comprovantes',
      tamanho: 450000,
      versao: 1,
      dataUpload: '2026-03-25',
      uploadPor: 'Admin',
      tags: ['financeiro'],
      cliente: 'Pedro Oliveira',
      privado: false,
      versoes: [
        { numero: 1, data: '2026-03-25', usuario: 'Admin', observacao: 'Upload inicial' },
      ],
    },
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Documento | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  const [filter, setFilter] = useState({
    categoria: 'all',
    tipo: 'all',
    search: '',
    privado: 'all',
  });

  const [uploadForm, setUploadForm] = useState({
    categoria: 'Petições',
    tags: '',
    processo: '',
    cliente: '',
    privado: false,
    observacao: '',
  });

  const categorias = ['Petições', 'Contratos', 'Comprovantes', 'Procurações', 'Sentenças', 'Recursos', 'Documentos Pessoais', 'Outros'];

  const getFileIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="w-8 h-8 text-blue-500" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileImage className="w-8 h-8 text-purple-500" />;
      case 'zip':
      case 'rar':
        return <Archive className="w-8 h-8 text-orange-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Funcionalidade de upload será implementada com backend');
    setShowUploadModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este documento?')) {
      setDocumentos(documentos.filter(d => d.id !== id));
    }
  };

  const handleDownload = (doc: Documento) => {
    alert(`Baixando: ${doc.nome}`);
  };

  const handlePreview = (doc: Documento) => {
    alert(`Visualizando: ${doc.nome}`);
  };

  const handleShare = (doc: Documento) => {
    setSelectedDoc(doc);
    setShowShareModal(true);
  };

  const handleVersions = (doc: Documento) => {
    setSelectedDoc(doc);
    setShowVersionModal(true);
  };

  const togglePrivacy = (id: string) => {
    setDocumentos(documentos.map(d => 
      d.id === id ? { ...d, privado: !d.privado } : d
    ));
  };

  const filteredDocs = documentos.filter(doc => {
    if (filter.categoria !== 'all' && doc.categoria !== filter.categoria) return false;
    if (filter.tipo !== 'all' && doc.tipo !== filter.tipo) return false;
    if (filter.privado !== 'all' && doc.privado !== (filter.privado === 'true')) return false;
    if (filter.search && !doc.nome.toLowerCase().includes(filter.search.toLowerCase()) &&
        !doc.tags.some(tag => tag.toLowerCase().includes(filter.search.toLowerCase()))) return false;
    return true;
  });

  const totalSize = documentos.reduce((sum, doc) => sum + doc.tamanho, 0);
  const totalDocs = documentos.length;
  const privateDocsCount = documentos.filter(d => d.privado).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Gestão de Documentos</h1>
            <p className="text-gray-600 dark:text-gray-400">Upload, versionamento e organização de arquivos</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Upload Documento
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Documentos</h3>
              <Folder className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalDocs}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Arquivos armazenados</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Espaço Utilizado</h3>
              <Archive className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{formatFileSize(totalSize)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">de 10 GB disponíveis</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Documentos Privados</h3>
              <Lock className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{privateDocsCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Acesso restrito</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Filter className="w-5 h-5 text-cyan-500" />
              Filtros e Busca
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                Lista
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                Grade
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoria
              </label>
              <select
                value={filter.categoria}
                onChange={(e) => setFilter({ ...filter, categoria: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="all">Todas</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Arquivo
              </label>
              <select
                value={filter.tipo}
                onChange={(e) => setFilter({ ...filter, tipo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="all">Todos</option>
                <option value="pdf">PDF</option>
                <option value="docx">Word</option>
                <option value="xlsx">Excel</option>
                <option value="jpg">Imagem</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Privacidade
              </label>
              <select
                value={filter.privado}
                onChange={(e) => setFilter({ ...filter, privado: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="all">Todos</option>
                <option value="false">Públicos</option>
                <option value="true">Privados</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nome ou tag..."
                  value={filter.search}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-cyan-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Documento</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Categoria</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Tamanho</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Versão</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Upload</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Tags</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDocs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        Nenhum documento encontrado
                      </td>
                    </tr>
                  ) : (
                    filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {getFileIcon(doc.tipo)}
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{doc.nome}</p>
                              {doc.processo && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">Processo: {doc.processo}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {doc.categoria}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {formatFileSize(doc.tamanho)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleVersions(doc)}
                            className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
                          >
                            v{doc.versao}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          <div>
                            <p>{new Date(doc.dataUpload).toLocaleDateString('pt-BR')}</p>
                            <p className="text-xs text-gray-500">{doc.uploadPor}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {doc.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handlePreview(doc)}
                              className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                              title="Visualizar"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownload(doc)}
                              className="p-2 text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleShare(doc)}
                              className="p-2 text-white bg-purple-500 rounded hover:bg-purple-600 transition-colors"
                              title="Compartilhar"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => togglePrivacy(doc.id)}
                              className={`p-2 text-white rounded transition-colors ${
                                doc.privado ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'
                              }`}
                              title={doc.privado ? 'Privado' : 'Público'}
                            >
                              {doc.privado ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDelete(doc.id)}
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-3">
                  {getFileIcon(doc.tipo)}
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate mb-2">
                  {doc.nome}
                </h3>
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400 mb-3">
                  <p>{doc.categoria}</p>
                  <p>{formatFileSize(doc.tamanho)}</p>
                  <p>Versão {doc.versao}</p>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {doc.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handlePreview(doc)}
                    className="flex-1 p-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                    title="Visualizar"
                  >
                    <Eye className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => handleDownload(doc)}
                    className="flex-1 p-2 text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="flex-1 p-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Upload de Documento</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Arquivo <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Clique para selecionar ou arraste o arquivo aqui
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      PDF, Word, Excel, Imagens (máx. 10MB)
                    </p>
                    <input type="file" className="hidden" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Categoria <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={uploadForm.categoria}
                      onChange={(e) => setUploadForm({ ...uploadForm, categoria: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                    >
                      {categorias.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={uploadForm.tags}
                      onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                      placeholder="urgente, trabalhista"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Processo
                    </label>
                    <input
                      type="text"
                      value={uploadForm.processo}
                      onChange={(e) => setUploadForm({ ...uploadForm, processo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                      placeholder="0001234-56.2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Cliente
                    </label>
                    <input
                      type="text"
                      value={uploadForm.cliente}
                      onChange={(e) => setUploadForm({ ...uploadForm, cliente: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                      placeholder="Nome do cliente"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={uploadForm.observacao}
                    onChange={(e) => setUploadForm({ ...uploadForm, observacao: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Observações sobre este documento"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uploadForm.privado}
                      onChange={(e) => setUploadForm({ ...uploadForm, privado: e.target.checked })}
                      className="w-4 h-4 text-cyan-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Documento privado (acesso restrito)
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showVersionModal && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="bg-purple-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Histórico de Versões</h2>
              <button
                onClick={() => setShowVersionModal(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">{selectedDoc.nome}</h3>
              <div className="space-y-3">
                {selectedDoc.versoes.map((versao) => (
                  <div
                    key={versao.numero}
                    className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full">
                      <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          Versão {versao.numero}
                        </h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(versao.data).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {versao.observacao}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Por: {versao.usuario}
                      </p>
                    </div>
                    <button className="px-3 py-1 text-sm bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors">
                      Restaurar
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowVersionModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showShareModal && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Compartilhar Documento</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">{selectedDoc.nome}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Compartilhar com:
                  </label>
                  <input
                    type="email"
                    placeholder="email@exemplo.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Permissão:
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100">
                    <option>Visualizar</option>
                    <option>Editar</option>
                    <option>Download</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Link de compartilhamento:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value="https://sistema.com/docs/share/abc123"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
                    />
                    <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                      Copiar
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancelar
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
