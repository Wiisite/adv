'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Settings, Save, Building, Mail, Phone, MapPin, Globe, DollarSign, Bell, Shield, Database } from 'lucide-react';

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('geral');

  const [config, setConfig] = useState({
    nomeEscritorio: 'Escritório de Advocacia',
    cnpj: '00.000.000/0001-00',
    oab: 'OAB/SP 123456',
    email: 'contato@escritorio.com.br',
    telefone: '(11) 99999-9999',
    endereco: 'Rua Exemplo, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
    website: 'www.escritorio.com.br',
    valorHoraPadrao: '300',
    moeda: 'BRL',
    notificacoesPrazo: true,
    notificacoesAudiencia: true,
    notificacoesPagamento: true,
    notificacoesEmail: true,
    backupAutomatico: true,
    frequenciaBackup: 'diario',
  });

  const handleSave = () => {
    alert('Configurações salvas com sucesso!');
  };

  const tabs = [
    { id: 'geral', label: 'Geral', icon: Settings },
    { id: 'escritorio', label: 'Escritório', icon: Building },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
    { id: 'backup', label: 'Backup', icon: Database },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Configurações</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie as configurações do sistema</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {activeTab === 'geral' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Configurações Gerais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome do Sistema
                  </label>
                  <input
                    type="text"
                    value="Sistema de Advocacia"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Idioma
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100">
                    <option>Português (Brasil)</option>
                    <option>English</option>
                    <option>Español</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fuso Horário
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100">
                    <option>America/Sao_Paulo (GMT-3)</option>
                    <option>America/New_York (GMT-5)</option>
                    <option>Europe/London (GMT+0)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Formato de Data
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'escritorio' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Dados do Escritório</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome do Escritório
                  </label>
                  <input
                    type="text"
                    value={config.nomeEscritorio}
                    onChange={(e) => setConfig({ ...config, nomeEscritorio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    value={config.cnpj}
                    onChange={(e) => setConfig({ ...config, cnpj: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    OAB
                  </label>
                  <input
                    type="text"
                    value={config.oab}
                    onChange={(e) => setConfig({ ...config, oab: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={config.email}
                    onChange={(e) => setConfig({ ...config, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={config.telefone}
                    onChange={(e) => setConfig({ ...config, telefone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Endereço
                  </label>
                  <input
                    type="text"
                    value={config.endereco}
                    onChange={(e) => setConfig({ ...config, endereco: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={config.cidade}
                    onChange={(e) => setConfig({ ...config, cidade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estado
                  </label>
                  <input
                    type="text"
                    value={config.estado}
                    onChange={(e) => setConfig({ ...config, estado: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    value={config.cep}
                    onChange={(e) => setConfig({ ...config, cep: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Website
                  </label>
                  <input
                    type="text"
                    value={config.website}
                    onChange={(e) => setConfig({ ...config, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'financeiro' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Configurações Financeiras</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor/Hora Padrão (R$)
                  </label>
                  <input
                    type="number"
                    value={config.valorHoraPadrao}
                    onChange={(e) => setConfig({ ...config, valorHoraPadrao: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Moeda
                  </label>
                  <select 
                    value={config.moeda}
                    onChange={(e) => setConfig({ ...config, moeda: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="BRL">Real (R$)</option>
                    <option value="USD">Dólar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notificacoes' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Notificações</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                  <input
                    type="checkbox"
                    checked={config.notificacoesPrazo}
                    onChange={(e) => setConfig({ ...config, notificacoesPrazo: e.target.checked })}
                    className="w-5 h-5 text-cyan-600 rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Prazos Processuais</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receber alertas sobre prazos vencendo</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                  <input
                    type="checkbox"
                    checked={config.notificacoesAudiencia}
                    onChange={(e) => setConfig({ ...config, notificacoesAudiencia: e.target.checked })}
                    className="w-5 h-5 text-cyan-600 rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Audiências</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receber lembretes de audiências agendadas</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                  <input
                    type="checkbox"
                    checked={config.notificacoesPagamento}
                    onChange={(e) => setConfig({ ...config, notificacoesPagamento: e.target.checked })}
                    className="w-5 h-5 text-cyan-600 rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Pagamentos</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Notificações sobre recebimentos e despesas</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                  <input
                    type="checkbox"
                    checked={config.notificacoesEmail}
                    onChange={(e) => setConfig({ ...config, notificacoesEmail: e.target.checked })}
                    className="w-5 h-5 text-cyan-600 rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Notificações por Email</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receber cópias das notificações por email</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'seguranca' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Segurança</h2>
              <div className="space-y-4">
                <button className="w-full md:w-auto px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                  Alterar Senha
                </button>
                <button className="w-full md:w-auto px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ml-0 md:ml-2">
                  Ativar Autenticação em 2 Fatores
                </button>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Backup e Restauração</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                  <input
                    type="checkbox"
                    checked={config.backupAutomatico}
                    onChange={(e) => setConfig({ ...config, backupAutomatico: e.target.checked })}
                    className="w-5 h-5 text-cyan-600 rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Backup Automático</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Realizar backups automáticos do sistema</p>
                  </div>
                </label>
                {config.backupAutomatico && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Frequência
                    </label>
                    <select 
                      value={config.frequenciaBackup}
                      onChange={(e) => setConfig({ ...config, frequenciaBackup: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-100"
                    >
                      <option value="diario">Diário</option>
                      <option value="semanal">Semanal</option>
                      <option value="mensal">Mensal</option>
                    </select>
                  </div>
                )}
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                    Fazer Backup Agora
                  </button>
                  <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    Restaurar Backup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Save className="w-5 h-5" />
            Salvar Configurações
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
