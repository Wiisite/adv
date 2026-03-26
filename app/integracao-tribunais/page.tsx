'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  Search, Download, Eye, RefreshCw, Bell, FileText, 
  AlertCircle, CheckCircle, Clock, ExternalLink, Filter,
  Gavel, Building, Calendar, User, X, Play, Pause
} from 'lucide-react';

interface Processo {
  id: string;
  numero: string;
  tribunal: 'PJe' | 'ESAJ' | 'CNJ';
  instancia: '1º Grau' | '2º Grau' | 'Superior';
  comarca: string;
  vara: string;
  classe: string;
  assunto: string;
  autor: string;
  reu: string;
  status: string;
  dataDistribuicao: string;
  ultimaMovimentacao: string;
  movimentacoes: number;
  intimacoes: number;
  documentos: number;
  monitoramento: boolean;
}

interface Movimentacao {
  id: string;
  data: string;
  descricao: string;
  tipo: 'movimentacao' | 'intimacao' | 'sentenca' | 'despacho';
  lida: boolean;
  documentos?: string[];
}

export default function IntegracaoTribunaisPage() {
  const [activeTab, setActiveTab] = useState<'consulta' | 'monitorados' | 'intimacoes' | 'config'>('consulta');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProcesso, setSelectedProcesso] = useState<Processo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTribunal, setSelectedTribunal] = useState<'all' | 'PJe' | 'ESAJ' | 'CNJ'>('all');
  
  const [processos] = useState<Processo[]>([
    {
      id: '1',
      numero: '0001234-56.2024.8.26.0100',
      tribunal: 'ESAJ',
      instancia: '1º Grau',
      comarca: 'São Paulo',
      vara: '1ª Vara Cível',
      classe: 'Procedimento Comum',
      assunto: 'Indenização por Danos Morais',
      autor: 'João Silva',
      reu: 'Empresa XYZ Ltda',
      status: 'Em andamento',
      dataDistribuicao: '2024-01-15',
      ultimaMovimentacao: new Date().toISOString(),
      movimentacoes: 15,
      intimacoes: 3,
      documentos: 8,
      monitoramento: true,
    },
    {
      id: '2',
      numero: '0002345-67.2024.5.02.0001',
      tribunal: 'PJe',
      instancia: '1º Grau',
      comarca: 'São Paulo',
      vara: '2ª Vara do Trabalho',
      classe: 'Reclamação Trabalhista',
      assunto: 'Rescisão Indireta',
      autor: 'Maria Santos',
      reu: 'ABC Serviços S.A.',
      status: 'Aguardando sentença',
      dataDistribuicao: '2024-02-20',
      ultimaMovimentacao: '2024-03-20',
      movimentacoes: 8,
      intimacoes: 1,
      documentos: 5,
      monitoramento: true,
    },
    {
      id: '3',
      numero: '0003456-78.2023.8.26.0000',
      tribunal: 'ESAJ',
      instancia: '2º Grau',
      comarca: 'São Paulo',
      vara: '5ª Câmara de Direito Privado',
      classe: 'Apelação',
      assunto: 'Contrato de Compra e Venda',
      autor: 'Pedro Oliveira',
      reu: 'Construtora DEF',
      status: 'Aguardando julgamento',
      dataDistribuicao: '2023-11-10',
      ultimaMovimentacao: '2024-03-15',
      movimentacoes: 22,
      intimacoes: 5,
      documentos: 12,
      monitoramento: false,
    },
  ]);

  const [movimentacoes] = useState<Movimentacao[]>([
    {
      id: '1',
      data: new Date().toISOString(),
      descricao: 'Juntada de petição - Contestação',
      tipo: 'movimentacao',
      lida: false,
      documentos: ['contestacao.pdf'],
    },
    {
      id: '2',
      data: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      descricao: 'Intimação para manifestação em 5 dias',
      tipo: 'intimacao',
      lida: false,
    },
    {
      id: '3',
      data: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      descricao: 'Despacho - Determina produção de provas',
      tipo: 'despacho',
      lida: true,
      documentos: ['despacho_001.pdf'],
    },
  ]);

  const getTribunalBadge = (tribunal: string) => {
    const badges = {
      PJe: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      ESAJ: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      CNJ: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    };
    return badges[tribunal as keyof typeof badges];
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'intimacao':
        return <Bell className="w-5 h-5 text-red-500" />;
      case 'sentenca':
        return <Gavel className="w-5 h-5 text-purple-500" />;
      case 'despacho':
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleConsultar = () => {
    alert('Consultando tribunais...\nEsta funcionalidade requer integração com APIs oficiais dos tribunais.');
  };

  const handleDownloadDoc = (doc: string) => {
    alert(`Baixando documento: ${doc}`);
  };

  const handleToggleMonitoring = (id: string) => {
    alert(`Monitoramento ${id} alternado`);
  };

  const handleViewDetails = (processo: Processo) => {
    setSelectedProcesso(processo);
    setShowDetailsModal(true);
  };

  const filteredProcessos = processos.filter(p => {
    if (selectedTribunal !== 'all' && p.tribunal !== selectedTribunal) return false;
    if (searchTerm && !p.numero.includes(searchTerm) && 
        !p.autor.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !p.reu.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const processosMonitorados = processos.filter(p => p.monitoramento).length;
  const intimacoesNaoLidas = movimentacoes.filter(m => m.tipo === 'intimacao' && !m.lida).length;
  const totalProcessos = processos.length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Integração com Tribunais</h1>
            <p className="text-gray-600 dark:text-gray-400">PJe, ESAJ e CNJ - Consulta e monitoramento automatizado</p>
          </div>
          <button
            onClick={handleConsultar}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Atualizar Todos
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Processos</h3>
              <Gavel className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalProcessos}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Cadastrados</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Monitorados</h3>
              <Eye className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{processosMonitorados}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Ativos</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Intimações</h3>
              <Bell className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-red-600">{intimacoesNaoLidas}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Não lidas</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Última Atualização</h3>
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">Agora</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Automático</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-2 p-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('consulta')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'consulta'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Search className="w-4 h-4" />
                Consulta de Processos
              </button>
              <button
                onClick={() => setActiveTab('monitorados')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'monitorados'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Eye className="w-4 h-4" />
                Processos Monitorados
              </button>
              <button
                onClick={() => setActiveTab('intimacoes')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'intimacoes'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Bell className="w-4 h-4" />
                Intimações
                {intimacoesNaoLidas > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                    {intimacoesNaoLidas}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('config')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'config'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Building className="w-4 h-4" />
                Configurações
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'consulta' && (
              <div className="space-y-4">
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar por número, autor ou réu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                  </div>
                  <select
                    value={selectedTribunal}
                    onChange={(e) => setSelectedTribunal(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="all">Todos os Tribunais</option>
                    <option value="PJe">PJe</option>
                    <option value="ESAJ">ESAJ</option>
                    <option value="CNJ">CNJ</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {filteredProcessos.map((processo) => (
                    <div
                      key={processo.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {processo.numero}
                            </h4>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded ${getTribunalBadge(processo.tribunal)}`}>
                              {processo.tribunal}
                            </span>
                            <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                              {processo.instancia}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            <strong>Classe:</strong> {processo.classe} - {processo.assunto}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Autor:</strong> {processo.autor} <strong>x</strong> <strong>Réu:</strong> {processo.reu}
                          </p>
                        </div>
                        <button
                          onClick={() => handleToggleMonitoring(processo.id)}
                          className={`p-2 rounded transition-colors ${
                            processo.monitoramento
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                          title={processo.monitoramento ? 'Monitoramento ativo' : 'Ativar monitoramento'}
                        >
                          {processo.monitoramento ? <Eye className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Comarca/Vara</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{processo.comarca}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{processo.vara}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Status</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{processo.status}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Distribuição</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {new Date(processo.dataDistribuicao).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Última Mov.</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {new Date(processo.ultimaMovimentacao).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {processo.movimentacoes} movimentações
                        </span>
                        <span className="flex items-center gap-1">
                          <Bell className="w-4 h-4" />
                          {processo.intimacoes} intimações
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {processo.documentos} documentos
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(processo)}
                          className="flex-1 px-3 py-2 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700 transition-colors"
                        >
                          Ver Detalhes
                        </button>
                        <button
                          onClick={handleConsultar}
                          className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'intimacoes' && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Intimações e Movimentações Recentes
                </h3>
                {movimentacoes.map((mov) => (
                  <div
                    key={mov.id}
                    className={`border rounded-lg p-4 ${
                      !mov.lida && mov.tipo === 'intimacao'
                        ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getTipoIcon(mov.tipo)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {mov.descricao}
                          </h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(mov.data).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        {mov.documentos && mov.documentos.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {mov.documentos.map((doc, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleDownloadDoc(doc)}
                                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                              >
                                <Download className="w-3 h-3" />
                                {doc}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'config' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Configurações de Integração
                </h3>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Certificado Digital Necessário
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        Para acessar os sistemas PJe e ESAJ, é necessário configurar um certificado digital válido (e-CPF ou e-CNPJ).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <Building className="w-5 h-5 text-blue-500" />
                      PJe - Processo Judicial Eletrônico
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          URL do Tribunal
                        </label>
                        <input
                          type="text"
                          placeholder="https://pje.tjsp.jus.br"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-cyan-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Monitoramento automático ativo
                          </span>
                        </label>
                      </div>
                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Testar Conexão
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <Building className="w-5 h-5 text-green-500" />
                      ESAJ - Sistema de Automação da Justiça
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          URL do Tribunal
                        </label>
                        <input
                          type="text"
                          placeholder="https://esaj.tjsp.jus.br"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-cyan-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Monitoramento automático ativo
                          </span>
                        </label>
                      </div>
                      <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Testar Conexão
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Configurações de Monitoramento
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Frequência de Atualização
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100">
                        <option>A cada 1 hora</option>
                        <option>A cada 2 horas</option>
                        <option>A cada 4 horas</option>
                        <option>A cada 6 horas</option>
                        <option>Diariamente</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Horário de Verificação
                      </label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-cyan-600 rounded" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Notificar sobre novas movimentações
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-cyan-600 rounded" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Notificar sobre intimações
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-cyan-600 rounded" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Download automático de documentos
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDetailsModal && selectedProcesso && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center sticky top-0">
              <h2 className="text-xl font-semibold">Detalhes do Processo</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {selectedProcesso.numero}
                </h3>
                <div className="flex gap-2 mb-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded ${getTribunalBadge(selectedProcesso.tribunal)}`}>
                    {selectedProcesso.tribunal}
                  </span>
                  <span className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                    {selectedProcesso.instancia}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Informações do Processo</h4>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Classe:</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-100">{selectedProcesso.classe}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Assunto:</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-100">{selectedProcesso.assunto}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Comarca:</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-100">{selectedProcesso.comarca}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Vara:</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-100">{selectedProcesso.vara}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Partes</h4>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Autor:</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-100">{selectedProcesso.autor}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Réu:</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-100">{selectedProcesso.reu}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Status:</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-100">{selectedProcesso.status}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Distribuição:</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-100">
                        {new Date(selectedProcesso.dataDistribuicao).toLocaleDateString('pt-BR')}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Últimas Movimentações</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Funcionalidade completa disponível após integração com APIs dos tribunais.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Fechar
              </button>
              <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                Acessar no Tribunal
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
