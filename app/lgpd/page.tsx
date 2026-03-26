'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  Shield, CheckCircle, XCircle, Download, Eye, Trash2, 
  FileText, Users, Lock, AlertCircle, Clock, Search, Filter, X
} from 'lucide-react';

interface Consentimento {
  id: string;
  usuario: string;
  email: string;
  tipo: string;
  finalidade: string;
  status: 'ativo' | 'revogado' | 'expirado';
  dataConsentimento: string;
  dataExpiracao?: string;
  ipOrigem: string;
}

interface SolicitacaoDados {
  id: string;
  usuario: string;
  email: string;
  tipo: 'acesso' | 'portabilidade' | 'exclusao' | 'retificacao';
  status: 'pendente' | 'processando' | 'concluido' | 'rejeitado';
  dataSolicitacao: string;
  dataConclusao?: string;
  observacoes?: string;
}

export default function LGPDPage() {
  const [activeTab, setActiveTab] = useState<'consentimentos' | 'solicitacoes' | 'politicas' | 'auditoria'>('consentimentos');
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  
  const [consentimentos] = useState<Consentimento[]>([
    {
      id: '1',
      usuario: 'João Silva',
      email: 'joao.silva@email.com',
      tipo: 'Dados Pessoais',
      finalidade: 'Prestação de serviços jurídicos',
      status: 'ativo',
      dataConsentimento: '2026-01-15',
      dataExpiracao: '2027-01-15',
      ipOrigem: '192.168.1.100',
    },
    {
      id: '2',
      usuario: 'Maria Santos',
      email: 'maria.santos@email.com',
      tipo: 'Comunicação',
      finalidade: 'Envio de newsletters e atualizações',
      status: 'ativo',
      dataConsentimento: '2026-02-20',
      ipOrigem: '192.168.1.101',
    },
    {
      id: '3',
      usuario: 'Pedro Oliveira',
      email: 'pedro.oliveira@email.com',
      tipo: 'Dados Pessoais',
      finalidade: 'Prestação de serviços jurídicos',
      status: 'revogado',
      dataConsentimento: '2025-12-10',
      dataExpiracao: '2026-12-10',
      ipOrigem: '192.168.1.102',
    },
  ]);

  const [solicitacoes] = useState<SolicitacaoDados[]>([
    {
      id: '1',
      usuario: 'Ana Paula',
      email: 'ana.paula@email.com',
      tipo: 'acesso',
      status: 'concluido',
      dataSolicitacao: '2026-03-20',
      dataConclusao: '2026-03-21',
      observacoes: 'Dados enviados por email',
    },
    {
      id: '2',
      usuario: 'Carlos Souza',
      email: 'carlos.souza@email.com',
      tipo: 'exclusao',
      status: 'pendente',
      dataSolicitacao: new Date().toISOString(),
    },
    {
      id: '3',
      usuario: 'Juliana Costa',
      email: 'juliana.costa@email.com',
      tipo: 'portabilidade',
      status: 'processando',
      dataSolicitacao: '2026-03-24',
    },
  ]);

  const getStatusBadge = (status: string) => {
    const badges = {
      ativo: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      revogado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      expirado: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      pendente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      processando: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      concluido: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      rejeitado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return badges[status as keyof typeof badges];
  };

  const getTipoSolicitacaoLabel = (tipo: string) => {
    const labels = {
      acesso: 'Acesso aos Dados',
      portabilidade: 'Portabilidade',
      exclusao: 'Exclusão de Dados',
      retificacao: 'Retificação',
    };
    return labels[tipo as keyof typeof labels];
  };

  const handleRevokeConsent = (id: string) => {
    if (confirm('Deseja realmente revogar este consentimento?')) {
      alert(`Consentimento ${id} revogado`);
    }
  };

  const handleProcessRequest = (id: string, action: string) => {
    alert(`Processando solicitação ${id}: ${action}`);
  };

  const handleExportData = (userId: string) => {
    alert(`Exportando dados do usuário ${userId} em formato JSON`);
  };

  const handleDeleteData = (userId: string) => {
    if (confirm('ATENÇÃO: Esta ação é irreversível. Deseja realmente excluir todos os dados deste usuário?')) {
      alert(`Dados do usuário ${userId} serão anonimizados conforme LGPD`);
    }
  };

  const consentimentosAtivos = consentimentos.filter(c => c.status === 'ativo').length;
  const consentimentosRevogados = consentimentos.filter(c => c.status === 'revogado').length;
  const solicitacoesPendentes = solicitacoes.filter(s => s.status === 'pendente').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">LGPD / Compliance</h1>
            <p className="text-gray-600 dark:text-gray-400">Gestão de conformidade com a Lei 13.709/2018</p>
          </div>
          <button
            onClick={() => setShowConsentModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Shield className="w-5 h-5" />
            Novo Consentimento
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Consentimentos Ativos</h3>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{consentimentosAtivos}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Em vigor</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Revogados</h3>
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{consentimentosRevogados}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Cancelados</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Solicitações</h3>
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{solicitacoesPendentes}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Pendentes</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Conformidade</h3>
              <Shield className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">98%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Score LGPD</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-2 p-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('consentimentos')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'consentimentos'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Consentimentos
              </button>
              <button
                onClick={() => setActiveTab('solicitacoes')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'solicitacoes'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Users className="w-4 h-4" />
                Solicitações de Dados
              </button>
              <button
                onClick={() => setActiveTab('politicas')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'politicas'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <FileText className="w-4 h-4" />
                Políticas
              </button>
              <button
                onClick={() => setActiveTab('auditoria')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'auditoria'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Clock className="w-4 h-4" />
                Auditoria
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'consentimentos' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Gestão de Consentimentos
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Usuário</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Tipo</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Finalidade</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Data</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Status</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {consentimentos.map((consent) => (
                        <tr key={consent.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{consent.usuario}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{consent.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{consent.tipo}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{consent.finalidade}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                            {new Date(consent.dataConsentimento).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadge(consent.status)}`}>
                              {consent.status.charAt(0).toUpperCase() + consent.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleExportData(consent.id)}
                                className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                                title="Exportar dados"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              {consent.status === 'ativo' && (
                                <button
                                  onClick={() => handleRevokeConsent(consent.id)}
                                  className="p-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                                  title="Revogar"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'solicitacoes' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Solicitações de Titulares de Dados
                </h3>
                <div className="space-y-3">
                  {solicitacoes.map((solicitacao) => (
                    <div
                      key={solicitacao.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {solicitacao.usuario}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{solicitacao.email}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadge(solicitacao.status)}`}>
                          {solicitacao.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Tipo de Solicitação</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {getTipoSolicitacaoLabel(solicitacao.tipo)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Data da Solicitação</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {new Date(solicitacao.dataSolicitacao).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      {solicitacao.observacoes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {solicitacao.observacoes}
                        </p>
                      )}
                      {solicitacao.status === 'pendente' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleProcessRequest(solicitacao.id, 'aprovar')}
                            className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                          >
                            Processar
                          </button>
                          <button
                            onClick={() => handleProcessRequest(solicitacao.id, 'rejeitar')}
                            className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                          >
                            Rejeitar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'politicas' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Políticas e Termos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          Política de Privacidade
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Última atualização: 01/03/2026
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowPolicyModal(true)}
                        className="flex-1 px-3 py-2 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700 transition-colors"
                      >
                        Visualizar
                      </button>
                      <button className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        Editar
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                        <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          Termos de Uso
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Última atualização: 01/03/2026
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700 transition-colors">
                        Visualizar
                      </button>
                      <button className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        Editar
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          Política de Cookies
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Última atualização: 01/03/2026
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700 transition-colors">
                        Visualizar
                      </button>
                      <button className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        Editar
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                        <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          Relatório de Conformidade
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Gerado em: {new Date().toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <button className="w-full px-3 py-2 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700 transition-colors">
                      Gerar Relatório
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'auditoria' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Registro de Auditoria
                </h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded mb-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Registro de Acessos
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Todos os acessos a dados pessoais são registrados conforme Art. 37 da LGPD.
                        Logs mantidos por 6 meses.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Logs de auditoria disponíveis</p>
                  <button className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                    Visualizar Logs Completos
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPolicyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center sticky top-0">
              <h2 className="text-xl font-semibold">Política de Privacidade</h2>
              <button
                onClick={() => setShowPolicyModal(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 prose dark:prose-invert max-w-none">
              <h3>1. Introdução</h3>
              <p>
                Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais
                em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).
              </p>

              <h3>2. Dados Coletados</h3>
              <p>Coletamos os seguintes tipos de dados:</p>
              <ul>
                <li>Dados de identificação (nome, CPF, RG)</li>
                <li>Dados de contato (email, telefone, endereço)</li>
                <li>Dados profissionais</li>
                <li>Dados processuais</li>
              </ul>

              <h3>3. Finalidade do Tratamento</h3>
              <p>Seus dados são utilizados para:</p>
              <ul>
                <li>Prestação de serviços jurídicos</li>
                <li>Comunicação sobre processos e prazos</li>
                <li>Cumprimento de obrigações legais</li>
                <li>Melhoria dos nossos serviços</li>
              </ul>

              <h3>4. Compartilhamento de Dados</h3>
              <p>
                Seus dados podem ser compartilhados com tribunais, órgãos públicos e outras partes
                envolvidas nos processos jurídicos, sempre respeitando o sigilo profissional.
              </p>

              <h3>5. Seus Direitos</h3>
              <p>Você tem direito a:</p>
              <ul>
                <li>Confirmação da existência de tratamento</li>
                <li>Acesso aos dados</li>
                <li>Correção de dados incompletos ou desatualizados</li>
                <li>Anonimização, bloqueio ou eliminação</li>
                <li>Portabilidade dos dados</li>
                <li>Revogação do consentimento</li>
              </ul>

              <h3>6. Segurança</h3>
              <p>
                Implementamos medidas técnicas e organizacionais para proteger seus dados contra
                acessos não autorizados, perda ou destruição.
              </p>

              <h3>7. Contato</h3>
              <p>
                Para exercer seus direitos ou esclarecer dúvidas, entre em contato através do email:
                lgpd@escritorio.com.br
              </p>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
              <button
                onClick={() => setShowPolicyModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Fechar
              </button>
              <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                Baixar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
