'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  Send, Sparkles, FileText, Scale, MessageSquare, 
  Loader2, Copy, Download, Trash2, AlertCircle 
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: string;
}

export default function AssistenteIAPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('');
  const [selectedType, setSelectedType] = useState<'analyze_process' | 'create_petition' | 'create_contract' | 'legal_advice'>('legal_advice');
  const [loading, setLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const types = [
    { value: 'legal_advice', label: 'Consulta Jurídica', icon: MessageSquare, color: 'blue' },
    { value: 'analyze_process', label: 'Analisar Processo', icon: FileText, color: 'green' },
    { value: 'create_petition', label: 'Criar Petição', icon: Scale, color: 'purple' },
    { value: 'create_contract', label: 'Elaborar Contrato', icon: FileText, color: 'orange' },
  ];

  const templates = {
    analyze_process: 'Analise o processo nº [número] e forneça um resumo executivo com os principais pontos, prazos e próximos passos.',
    create_petition: 'Crie uma petição inicial de [tipo de ação] onde [autor] move ação contra [réu] pelos seguintes fatos: [descrever fatos].',
    create_contract: 'Elabore um contrato de [tipo] entre [parte 1] e [parte 2] com as seguintes cláusulas: [descrever cláusulas].',
    legal_advice: 'Preciso de orientação sobre [assunto jurídico]. Contexto: [descrever situação].',
  };

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date(),
      type: selectedType,
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          context: context,
          prompt: prompt,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setPrompt('');
      } else {
        alert('Erro: ' + data.error);
      }
    } catch (error: any) {
      alert('Erro ao processar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    alert('Copiado para a área de transferência!');
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm('Deseja limpar todo o histórico de conversas?')) {
      setMessages([]);
    }
  };

  const useTemplate = () => {
    setPrompt(templates[selectedType]);
  };

  return (
    <AppLayout>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-cyan-500" />
              Assistente IA Jurídico
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Powered by ChatGPT - OpenAI</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {showConfig ? 'Ocultar' : 'Configurar'}
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Limpar
            </button>
          </div>
        </div>

        {showConfig && (
          <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  Configuração Necessária
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                  Para usar o Assistente IA, você precisa configurar a API Key do OpenAI:
                </p>
                <ol className="text-sm text-yellow-700 dark:text-yellow-300 list-decimal list-inside space-y-1">
                  <li>Acesse <a href="https://platform.openai.com/" target="_blank" className="underline">platform.openai.com</a></li>
                  <li>Crie uma conta ou faça login</li>
                  <li>Vá em &quot;API Keys&quot; e crie uma nova chave</li>
                  <li>Adicione no arquivo <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">.env.local</code>:</li>
                </ol>
                <pre className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900 rounded text-xs">
OPENAI_API_KEY=sk-sua-chave-aqui
                </pre>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                  Custo estimado: $50-100/mês para uso moderado
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-2 mb-4">
          {types.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.value;
            return (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value as any)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? `border-${type.color}-500 bg-${type.color}-50 dark:bg-${type.color}-900/20`
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? `text-${type.color}-600` : 'text-gray-600 dark:text-gray-400'}`} />
                <p className={`text-xs font-medium ${isSelected ? `text-${type.color}-700 dark:text-${type.color}-300` : 'text-gray-700 dark:text-gray-300'}`}>
                  {type.label}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Como posso ajudar?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Escolha um tipo de assistência acima e comece a conversar
                </p>
                <button
                  onClick={useTemplate}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Usar Template
                </button>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3xl rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-xs opacity-75">
                        {message.role === 'user' ? 'Você' : 'Assistente IA'}
                      </p>
                      <p className="text-xs opacity-75">
                        {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    {message.role === 'assistant' && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                        <button
                          onClick={() => handleCopy(message.content)}
                          className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          Copiar
                        </button>
                        <button
                          onClick={() => handleDownload(message.content, `resposta-ia-${Date.now()}.txt`)}
                          className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          Baixar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-cyan-600" />
                    <span className="text-gray-600 dark:text-gray-400">Processando...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="mb-2">
              <input
                type="text"
                placeholder="Contexto adicional (opcional) - Ex: Processo nº 123, Cliente: João Silva"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div className="flex gap-2">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Digite sua solicitação... (Shift+Enter para nova linha)"
                rows={3}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
              />
              <button
                onClick={handleSend}
                disabled={loading || !prompt.trim()}
                className="px-6 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Pressione Enter para enviar, Shift+Enter para nova linha
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
