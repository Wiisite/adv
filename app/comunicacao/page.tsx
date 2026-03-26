'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  Mail, MessageCircle, MessageSquare, Send, Inbox, 
  FileText, Users, Clock, CheckCircle, X, Plus,
  Phone, Smartphone, AtSign, Filter, Search
} from 'lucide-react';

interface Mensagem {
  id: string;
  canal: 'email' | 'whatsapp' | 'sms';
  tipo: 'enviada' | 'recebida';
  destinatario?: string;
  remetente?: string;
  assunto?: string;
  mensagem: string;
  data: string;
  status: 'enviado' | 'entregue' | 'lido' | 'erro';
  anexos?: string[];
}

export default function ComunicacaoPage() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'email' | 'whatsapp' | 'sms' | 'templates'>('inbox');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [selectedCanal, setSelectedCanal] = useState<'email' | 'whatsapp' | 'sms'>('email');
  
  const [mensagens] = useState<Mensagem[]>([
    {
      id: '1',
      canal: 'email',
      tipo: 'recebida',
      remetente: 'joao.silva@email.com',
      assunto: 'Dúvida sobre processo trabalhista',
      mensagem: 'Prezado Dr., gostaria de saber sobre o andamento do meu processo...',
      data: new Date().toISOString(),
      status: 'lido',
    },
    {
      id: '2',
      canal: 'whatsapp',
      tipo: 'enviada',
      destinatario: '11999999999',
      mensagem: 'Olá! Sua audiência está agendada para amanhã às 14h.',
      data: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'lido',
    },
    {
      id: '3',
      canal: 'sms',
      tipo: 'enviada',
      destinatario: '11988888888',
      mensagem: 'Lembrete: Prazo processual vence em 2 dias.',
      data: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: 'entregue',
    },
    {
      id: '4',
      canal: 'email',
      tipo: 'enviada',
      destinatario: 'maria.santos@email.com',
      assunto: 'Documentos para assinatura',
      mensagem: 'Prezada Maria, segue em anexo os documentos para sua assinatura...',
      data: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'enviado',
      anexos: ['contrato.pdf', 'procuracao.pdf'],
    },
  ]);

  const [templates] = useState([
    {
      id: '1',
      nome: 'Lembrete de Audiência',
      canal: 'whatsapp',
      conteudo: 'Olá {nome}! Sua audiência está agendada para {data} às {hora}. Local: {local}.',
    },
    {
      id: '2',
      nome: 'Prazo Processual',
      canal: 'sms',
      conteudo: 'Lembrete: Prazo processual do processo {numero} vence em {dias} dias.',
    },
    {
      id: '3',
      nome: 'Solicitação de Documentos',
      canal: 'email',
      conteudo: 'Prezado(a) {nome},\n\nSolicitamos o envio dos seguintes documentos:\n{lista}\n\nAtenciosamente,\n{advogado}',
    },
  ]);

  const [composeForm, setComposeForm] = useState({
    destinatario: '',
    assunto: '',
    mensagem: '',
    template: '',
  });

  const getCanalIcon = (canal: string) => {
    switch (canal) {
      case 'email':
        return <Mail className="w-5 h-5 text-blue-500" />;
      case 'whatsapp':
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case 'sms':
        return <MessageSquare className="w-5 h-5 text-purple-500" />;
      default:
        return <Mail className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      enviado: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      entregue: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      lido: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      erro: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return badges[status as keyof typeof badges];
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Enviando ${selectedCanal} para ${composeForm.destinatario}`);
    setShowComposeModal(false);
    setComposeForm({ destinatario: '', assunto: '', mensagem: '', template: '' });
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setComposeForm({ ...composeForm, mensagem: template.conteudo });
    }
  };

  const emailCount = mensagens.filter(m => m.canal === 'email').length;
  const whatsappCount = mensagens.filter(m => m.canal === 'whatsapp').length;
  const smsCount = mensagens.filter(m => m.canal === 'sms').length;
  const unreadCount = mensagens.filter(m => m.tipo === 'recebida' && m.status !== 'lido').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Comunicação Integrada</h1>
            <p className="text-gray-600 dark:text-gray-400">Email, WhatsApp e SMS em um só lugar</p>
          </div>
          <button
            onClick={() => setShowComposeModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Mensagem
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Emails</h3>
              <Mail className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{emailCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Mensagens</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">WhatsApp</h3>
              <MessageCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{whatsappCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Mensagens</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">SMS</h3>
              <MessageSquare className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{smsCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Mensagens</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Não Lidas</h3>
              <Inbox className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{unreadCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Pendentes</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-2 p-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('inbox')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'inbox'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Inbox className="w-4 h-4" />
                Caixa de Entrada
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'email'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'whatsapp'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
              <button
                onClick={() => setActiveTab('sms')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'sms'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                SMS
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'templates'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <FileText className="w-4 h-4" />
                Templates
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'templates' ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Templates de Mensagens
                  </h3>
                  <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                    Novo Template
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getCanalIcon(template.canal)}
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {template.nome}
                          </h4>
                        </div>
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                          {template.canal}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                        {template.conteudo}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button className="flex-1 px-3 py-1 text-sm bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors">
                          Usar
                        </button>
                        <button className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                          Editar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {mensagens
                  .filter(m => activeTab === 'inbox' || m.canal === activeTab)
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow ${
                        msg.tipo === 'recebida' && msg.status !== 'lido' ? 'bg-cyan-50 dark:bg-cyan-900/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getCanalIcon(msg.canal)}
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {msg.tipo === 'enviada' ? msg.destinatario : msg.remetente}
                            </h4>
                            {msg.assunto && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">{msg.assunto}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadge(msg.status)}`}>
                            {msg.status}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(msg.data).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{msg.mensagem}</p>
                      {msg.anexos && msg.anexos.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {msg.anexos.map((anexo, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" />
                              {anexo}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showComposeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="bg-cyan-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Nova Mensagem</h2>
              <button
                onClick={() => setShowComposeModal(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSend} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Canal de Comunicação
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCanal('email')}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                        selectedCanal === 'email'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <Mail className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">Email</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCanal('whatsapp')}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                        selectedCanal === 'whatsapp'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <MessageCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium">WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCanal('sms')}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                        selectedCanal === 'sms'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <MessageSquare className="w-5 h-5 text-purple-500" />
                      <span className="font-medium">SMS</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {selectedCanal === 'email' ? 'Email' : 'Telefone'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={selectedCanal === 'email' ? 'email' : 'tel'}
                    required
                    value={composeForm.destinatario}
                    onChange={(e) => setComposeForm({ ...composeForm, destinatario: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder={selectedCanal === 'email' ? 'email@exemplo.com' : '(11) 99999-9999'}
                  />
                </div>

                {selectedCanal === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Assunto <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={composeForm.assunto}
                      onChange={(e) => setComposeForm({ ...composeForm, assunto: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                      placeholder="Assunto da mensagem"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Template (opcional)
                  </label>
                  <select
                    value={composeForm.template}
                    onChange={(e) => {
                      setComposeForm({ ...composeForm, template: e.target.value });
                      handleTemplateSelect(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="">Selecione um template...</option>
                    {templates
                      .filter(t => t.canal === selectedCanal)
                      .map(t => (
                        <option key={t.id} value={t.id}>{t.nome}</option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mensagem <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={composeForm.mensagem}
                    onChange={(e) => setComposeForm({ ...composeForm, mensagem: e.target.value })}
                    rows={selectedCanal === 'email' ? 8 : 4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Digite sua mensagem..."
                    maxLength={selectedCanal === 'sms' ? 160 : undefined}
                  />
                  {selectedCanal === 'sms' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {composeForm.mensagem.length}/160 caracteres
                    </p>
                  )}
                </div>

                {selectedCanal === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Anexos
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Clique para adicionar anexos
                      </p>
                      <input type="file" multiple className="hidden" />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
