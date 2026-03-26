# 🤖 Integrações: ChatGPT + WhatsApp

Este documento explica como integrar o ChatGPT (OpenAI) e WhatsApp ao sistema de advocacia.

---

## 📋 ÍNDICE

1. [Integração ChatGPT/OpenAI](#integração-chatgptopenai)
2. [Integração WhatsApp](#integração-whatsapp)
3. [Custos e Considerações](#custos-e-considerações)

---

## 🤖 INTEGRAÇÃO CHATGPT/OPENAI

### **O que é possível fazer:**

✅ **Análise de Processos**
- Resumir processos longos
- Identificar prazos importantes
- Extrair informações relevantes

✅ **Criação de Documentos Jurídicos**
- Gerar petições iniciais
- Criar contestações
- Elaborar recursos
- Redigir contratos

✅ **Assistente Jurídico**
- Responder dúvidas jurídicas
- Sugerir estratégias processuais
- Analisar jurisprudência

✅ **Automação de Tarefas**
- Classificar documentos
- Gerar resumos executivos
- Criar relatórios

---

### **PASSO 1: Obter API Key da OpenAI**

1. Acesse: https://platform.openai.com/
2. Crie uma conta ou faça login
3. Vá em **API Keys**
4. Clique em **Create new secret key**
5. Copie a chave (começa com `sk-...`)

**⚠️ IMPORTANTE:** Guarde essa chave em local seguro!

---

### **PASSO 2: Configurar no Sistema**

Adicione a chave no arquivo `.env.local`:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-sua-chave-aqui
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=4000
```

---

### **PASSO 3: Instalar Biblioteca**

```bash
npm install openai
```

---

### **PASSO 4: Criar API Route**

Crie o arquivo: `app/api/ai/analyze/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, context, type } = await request.json();

    let systemPrompt = '';
    
    switch (type) {
      case 'analyze_process':
        systemPrompt = `Você é um assistente jurídico especializado em análise processual.
        Analise o processo fornecido e extraia:
        - Resumo executivo
        - Partes envolvidas
        - Prazos importantes
        - Próximos passos recomendados`;
        break;
        
      case 'create_petition':
        systemPrompt = `Você é um advogado especializado em redação de petições.
        Crie uma petição inicial profissional seguindo as normas do CPC.
        Inclua: cabeçalho, qualificação das partes, dos fatos, do direito, dos pedidos.`;
        break;
        
      case 'create_contract':
        systemPrompt = `Você é um advogado especializado em contratos.
        Elabore um contrato completo e juridicamente válido.
        Inclua todas as cláusulas necessárias e proteções legais.`;
        break;
        
      default:
        systemPrompt = 'Você é um assistente jurídico especializado.';
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `${context}\n\n${prompt}` }
      ],
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000'),
      temperature: 0.7,
    });

    return NextResponse.json({
      success: true,
      response: completion.choices[0].message.content,
      usage: completion.usage,
    });
    
  } catch (error: any) {
    console.error('OpenAI Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

### **PASSO 5: Usar no Frontend**

Exemplo de uso em uma página:

```typescript
'use client';

import { useState } from 'react';

export default function AIAssistantPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const analyzeProcess = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'analyze_process',
          context: 'Processo nº 0001234-56.2024.8.26.0100',
          prompt: prompt,
        }),
      });
      
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assistente IA</h1>
      
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full p-3 border rounded-lg mb-4"
        rows={5}
        placeholder="Digite sua solicitação..."
      />
      
      <button
        onClick={analyzeProcess}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        {loading ? 'Processando...' : 'Analisar'}
      </button>
      
      {response && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold mb-2">Resposta:</h3>
          <div className="whitespace-pre-wrap">{response}</div>
        </div>
      )}
    </div>
  );
}
```

---

## 📱 INTEGRAÇÃO WHATSAPP

### **Opções de Integração:**

#### **OPÇÃO 1: WhatsApp Business API (Oficial)**

**Vantagens:**
- ✅ Oficial e confiável
- ✅ Suporte a múltiplos atendentes
- ✅ Mensagens em massa
- ✅ Templates aprovados

**Desvantagens:**
- ❌ Requer aprovação do Meta
- ❌ Custo por mensagem
- ❌ Processo de setup complexo

**Como fazer:**
1. Acesse: https://business.facebook.com/
2. Configure WhatsApp Business API
3. Use provedor como Twilio, MessageBird ou 360dialog

---

#### **OPÇÃO 2: Evolution API (Recomendado)**

**Vantagens:**
- ✅ Gratuito e open-source
- ✅ Fácil instalação
- ✅ Suporta múltiplas instâncias
- ✅ Webhooks para integração

**Desvantagens:**
- ⚠️ Não oficial (risco de bloqueio)
- ⚠️ Requer servidor próprio

**Instalação:**

```bash
# Via Docker
docker run -d \
  --name evolution-api \
  -p 8080:8080 \
  -e AUTHENTICATION_API_KEY=sua-chave-secreta \
  atendai/evolution-api:latest
```

**Configuração no Sistema:**

Adicione no `.env.local`:

```env
# Evolution API Configuration
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=sua-chave-secreta
EVOLUTION_INSTANCE_NAME=escritorio-adv
```

---

### **PASSO 1: Criar API Route para WhatsApp**

Crie: `app/api/whatsapp/send/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phone, message } = await request.json();

    const response = await fetch(
      `${process.env.EVOLUTION_API_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE_NAME}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.EVOLUTION_API_KEY || '',
        },
        body: JSON.stringify({
          number: phone.replace(/\D/g, ''), // Remove formatação
          text: message,
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      success: true,
      messageId: data.key?.id,
    });
    
  } catch (error: any) {
    console.error('WhatsApp Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

### **PASSO 2: Receber Mensagens (Webhook)**

Crie: `app/api/whatsapp/webhook/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const webhook = await request.json();

    // Processar mensagem recebida
    if (webhook.event === 'messages.upsert') {
      const message = webhook.data;
      const from = message.key.remoteJid;
      const text = message.message?.conversation || 
                   message.message?.extendedTextMessage?.text;

      console.log(`Mensagem de ${from}: ${text}`);

      // Aqui você pode:
      // 1. Salvar no banco de dados
      // 2. Processar com ChatGPT
      // 3. Responder automaticamente
      // 4. Criar notificação no sistema

      // Exemplo: Resposta automática
      if (text?.toLowerCase().includes('processo')) {
        await fetch(`${process.env.EVOLUTION_API_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE_NAME}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.EVOLUTION_API_KEY || '',
          },
          body: JSON.stringify({
            number: from.replace('@s.whatsapp.net', ''),
            text: 'Olá! Para consultar seu processo, acesse nosso sistema ou aguarde o retorno de nosso advogado.',
          }),
        });
      }
    }

    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

### **PASSO 3: Configurar Webhook na Evolution API**

```bash
curl -X POST http://localhost:8080/webhook/set/escritorio-adv \
  -H "apikey: sua-chave-secreta" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://seu-dominio.com/api/whatsapp/webhook",
    "webhook_by_events": true,
    "events": ["messages.upsert"]
  }'
```

---

## 🔗 INTEGRAÇÃO CHATGPT + WHATSAPP

Combine as duas integrações para criar um assistente jurídico via WhatsApp!

**Exemplo:**

```typescript
// app/api/whatsapp/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const webhook = await request.json();

    if (webhook.event === 'messages.upsert') {
      const message = webhook.data;
      const from = message.key.remoteJid;
      const text = message.message?.conversation || 
                   message.message?.extendedTextMessage?.text;

      // Processar com ChatGPT
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente jurídico. Responda de forma clara e objetiva.'
          },
          {
            role: 'user',
            content: text || ''
          }
        ],
        max_tokens: 500,
      });

      const aiResponse = completion.choices[0].message.content;

      // Enviar resposta via WhatsApp
      await fetch(
        `${process.env.EVOLUTION_API_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE_NAME}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.EVOLUTION_API_KEY || '',
          },
          body: JSON.stringify({
            number: from.replace('@s.whatsapp.net', ''),
            text: aiResponse,
          }),
        }
      );
    }

    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## 💰 CUSTOS E CONSIDERAÇÕES

### **ChatGPT/OpenAI:**

| Modelo | Custo (por 1M tokens) | Recomendação |
|--------|----------------------|--------------|
| GPT-4o | $5.00 input / $15.00 output | ⭐ Melhor custo-benefício |
| GPT-4 Turbo | $10.00 input / $30.00 output | Para tarefas complexas |
| GPT-3.5 Turbo | $0.50 input / $1.50 output | Tarefas simples |

**Estimativa mensal:**
- 1000 análises de processos ≈ $50-100
- 500 criações de documentos ≈ $30-60

---

### **WhatsApp:**

| Opção | Custo | Observação |
|-------|-------|------------|
| Evolution API | Grátis | Servidor próprio necessário |
| WhatsApp Business API | $0.005-0.05/msg | Depende do país |
| Twilio | $0.005/msg | + custos de infraestrutura |

---

## 🚀 PRÓXIMOS PASSOS

1. **Criar página de Assistente IA** no sistema
2. **Implementar análise de processos** com ChatGPT
3. **Configurar Evolution API** para WhatsApp
4. **Testar integração** ChatGPT + WhatsApp
5. **Criar comandos** personalizados via WhatsApp
6. **Monitorar custos** e uso da API

---

## 📚 RECURSOS ÚTEIS

- **OpenAI Docs:** https://platform.openai.com/docs
- **Evolution API:** https://github.com/EvolutionAPI/evolution-api
- **WhatsApp Business API:** https://developers.facebook.com/docs/whatsapp
- **Twilio WhatsApp:** https://www.twilio.com/whatsapp

---

## ⚠️ AVISOS IMPORTANTES

1. **Segurança:** Nunca exponha suas API keys no frontend
2. **LGPD:** Garanta consentimento para processar dados via IA
3. **Custos:** Monitore o uso para evitar gastos excessivos
4. **WhatsApp:** Evolution API não é oficial (risco de bloqueio)
5. **Backup:** Sempre tenha backup das conversas importantes

---

**Quer que eu implemente alguma dessas integrações agora?** 🚀
