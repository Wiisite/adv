'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { FileText, Download, Eye, X } from 'lucide-react';

export default function GerarContratoPage() {
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    template: '',
    client_name: '',
    client_cpf: '',
    client_address: '',
    client_city: '',
    client_state: '',
    service_description: '',
    value: '',
    payment_method: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
  });

  const templates = [
    'Contrato de Prestação de Serviços Jurídicos',
    'Contrato de Honorários Advocatícios',
    'Contrato de Consultoria Jurídica',
    'Procuração',
    'Substabelecimento',
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleDownload = () => {
    alert('Função de download em desenvolvimento. O contrato será gerado em PDF.');
  };

  const generateContractPreview = () => {
    return `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS JURÍDICOS

Por este instrumento particular de contrato de prestação de serviços jurídicos, de um lado:

CONTRATANTE: ${formData.client_name || '[NOME DO CLIENTE]'}
CPF: ${formData.client_cpf || '[CPF]'}
Endereço: ${formData.client_address || '[ENDEREÇO]'}, ${formData.client_city || '[CIDADE]'} - ${formData.client_state || '[ESTADO]'}

E de outro lado:

CONTRATADO: [NOME DO ESCRITÓRIO]
[DADOS DO ESCRITÓRIO]

Têm entre si justo e contratado o seguinte:

CLÁUSULA PRIMEIRA - DO OBJETO
O presente contrato tem por objeto a prestação de serviços jurídicos consistentes em: ${formData.service_description || '[DESCRIÇÃO DOS SERVIÇOS]'}

CLÁUSULA SEGUNDA - DO VALOR E FORMA DE PAGAMENTO
Pelos serviços prestados, o CONTRATANTE pagará ao CONTRATADO o valor de R$ ${formData.value || '[VALOR]'}, através de ${formData.payment_method || '[FORMA DE PAGAMENTO]'}.

CLÁUSULA TERCEIRA - DA VIGÊNCIA
O presente contrato terá vigência a partir de ${formData.start_date ? new Date(formData.start_date).toLocaleDateString('pt-BR') : '[DATA INÍCIO]'}${formData.end_date ? ` até ${new Date(formData.end_date).toLocaleDateString('pt-BR')}` : ''}.

CLÁUSULA QUARTA - DAS OBRIGAÇÕES DO CONTRATADO
São obrigações do CONTRATADO:
a) Prestar os serviços com zelo, diligência e ética profissional;
b) Manter o CONTRATANTE informado sobre o andamento dos trabalhos;
c) Guardar sigilo sobre as informações obtidas.

CLÁUSULA QUINTA - DAS OBRIGAÇÕES DO CONTRATANTE
São obrigações do CONTRATANTE:
a) Fornecer todas as informações e documentos necessários;
b) Efetuar o pagamento conforme estipulado;
c) Comunicar qualquer alteração relevante.

CLÁUSULA SEXTA - DA RESCISÃO
O presente contrato poderá ser rescindido por qualquer das partes, mediante comunicação prévia de 30 dias.

E por estarem assim justos e contratados, assinam o presente instrumento em duas vias de igual teor e forma.

[CIDADE], ${new Date().toLocaleDateString('pt-BR')}


_______________________________          _______________________________
      CONTRATANTE                              CONTRATADO
    `;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gerar Contrato</h1>
            <p className="text-gray-600">Gere contratos personalizados automaticamente</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-600" />
              Dados do Contrato
            </h2>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modelo de Contrato <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.template}
                  onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Selecione um modelo</option>
                  {templates.map((template, index) => (
                    <option key={index} value={template}>{template}</option>
                  ))}
                </select>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Dados do Cliente</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Nome do cliente"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                      <input
                        type="text"
                        value={formData.client_cpf}
                        onChange={(e) => setFormData({ ...formData, client_cpf: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="000.000.000-00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <input
                        type="text"
                        value={formData.client_state}
                        onChange={(e) => setFormData({ ...formData, client_state: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="SP"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                    <input
                      type="text"
                      value={formData.client_address}
                      onChange={(e) => setFormData({ ...formData, client_address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Rua, número, bairro"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                    <input
                      type="text"
                      value={formData.client_city}
                      onChange={(e) => setFormData({ ...formData, client_city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Cidade"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Dados do Serviço</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição dos Serviços <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.service_description}
                      onChange={(e) => setFormData({ ...formData, service_description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Descreva os serviços a serem prestados..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valor (R$) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                      <select
                        value={formData.payment_method}
                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="">Selecionar</option>
                        <option>Mensal</option>
                        <option>Parcela Única</option>
                        <option>Parcelado</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                      <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
                      <input
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  Visualizar Contrato
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pré-visualização</h2>
            
            {showPreview ? (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-h-[600px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                  {generateContractPreview()}
                </pre>
              </div>
            ) : (
              <div className="bg-gray-50 p-12 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Preencha os dados e clique em &quot;Visualizar Contrato&quot; para ver a pré-visualização
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
