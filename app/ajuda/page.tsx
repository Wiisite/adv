'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { HelpCircle, Book, Video, MessageCircle, Mail, Phone, Search, ChevronDown, ChevronRight } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function AjudaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'Como cadastrar um novo cliente?',
      answer: 'Acesse o menu "Clientes" e clique no botão "Novo Cliente". Preencha todos os campos obrigatórios (nome, CPF/CNPJ, email, telefone) e clique em "Salvar".',
      category: 'clientes',
    },
    {
      id: '2',
      question: 'Como criar um novo processo?',
      answer: 'Vá em "Processos" > "Novo Processo". Selecione o cliente, preencha o número do processo, comarca, vara e outras informações relevantes.',
      category: 'processos',
    },
    {
      id: '3',
      question: 'Como gerar um contrato?',
      answer: 'Acesse "Gerar Contrato", selecione o modelo desejado, preencha os dados do cliente e do contrato. O sistema irá gerar automaticamente o documento com as informações fornecidas.',
      category: 'contratos',
    },
    {
      id: '4',
      question: 'Como registrar horas trabalhadas?',
      answer: 'No menu "Controle de Horas", clique em "Novo Registro". Informe o cliente, atividade realizada, horário de início e fim. O sistema calculará automaticamente o valor baseado na sua taxa horária.',
      category: 'timesheet',
    },
    {
      id: '5',
      question: 'Como configurar notificações?',
      answer: 'Vá em "Configurações" > aba "Notificações". Marque as opções desejadas: prazos processuais, audiências, pagamentos, etc. Você também pode ativar notificações por email.',
      category: 'configuracoes',
    },
    {
      id: '6',
      question: 'Como fazer backup dos dados?',
      answer: 'Em "Configurações" > aba "Backup", você pode configurar backups automáticos (diário, semanal ou mensal) ou fazer um backup manual clicando em "Fazer Backup Agora".',
      category: 'configuracoes',
    },
    {
      id: '7',
      question: 'Como gerar relatórios?',
      answer: 'Acesse "Relatórios", selecione o tipo desejado (financeiro, processos, clientes, etc.), defina o período e clique em "Gerar PDF". Você também pode imprimir ou enviar por email.',
      category: 'relatorios',
    },
    {
      id: '8',
      question: 'Como usar o chat interno?',
      answer: 'Clique em "Chat" no menu lateral. Selecione uma conversa existente ou inicie uma nova. Você pode enviar mensagens, criar grupos e ver o status online dos usuários.',
      category: 'chat',
    },
  ];

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'clientes', label: 'Clientes' },
    { id: 'processos', label: 'Processos' },
    { id: 'contratos', label: 'Contratos' },
    { id: 'timesheet', label: 'Controle de Horas' },
    { id: 'configuracoes', label: 'Configurações' },
    { id: 'relatorios', label: 'Relatórios' },
    { id: 'chat', label: 'Chat' },
  ];

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Central de Ajuda</h1>
          <p className="text-gray-600 dark:text-gray-400">Encontre respostas e aprenda a usar o sistema</p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar ajuda..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100 text-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Book className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Documentação</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Guias completos sobre todas as funcionalidades do sistema
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Video className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Vídeo Tutoriais</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Aprenda visualmente com nossos tutoriais em vídeo
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Suporte Online</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Converse com nossa equipe de suporte em tempo real
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Perguntas Frequentes</h2>
          
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <HelpCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma pergunta encontrada</p>
              </div>
            ) : (
              filteredFAQs.map(faq => (
                <div
                  key={faq.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100 text-left">
                      {faq.question}
                    </span>
                    {expandedFAQ.includes(faq.id) ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {expandedFAQ.includes(faq.id) && (
                    <div className="px-4 py-3 bg-white dark:bg-gray-800">
                      <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-cyan-50 dark:bg-cyan-900/20 border-l-4 border-cyan-400 p-6 rounded">
          <h3 className="text-lg font-semibold text-cyan-900 dark:text-cyan-100 mb-3">
            Precisa de mais ajuda?
          </h3>
          <p className="text-cyan-800 dark:text-cyan-200 mb-4">
            Nossa equipe de suporte está pronta para ajudar você!
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:suporte@sistema.com.br"
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              <Mail className="w-5 h-5" />
              suporte@sistema.com.br
            </a>
            <a
              href="tel:+5511999999999"
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 text-cyan-600 dark:text-cyan-400 border border-cyan-600 rounded-lg hover:bg-cyan-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Phone className="w-5 h-5" />
              (11) 99999-9999
            </a>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
