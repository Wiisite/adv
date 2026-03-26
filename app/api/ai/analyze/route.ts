import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, context, type } = await request.json();

    // NOTA: Para funcionar, você precisa:
    // 1. Criar conta em https://platform.openai.com/
    // 2. Obter API Key
    // 3. Adicionar no arquivo .env.local:
    //    OPENAI_API_KEY=sk-sua-chave-aqui

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'API Key do OpenAI não configurada. Adicione OPENAI_API_KEY no arquivo .env.local' 
        },
        { status: 500 }
      );
    }

    let systemPrompt = '';
    
    switch (type) {
      case 'analyze_process':
        systemPrompt = `Você é um assistente jurídico especializado em análise processual.
        Analise o processo fornecido e extraia:
        - Resumo executivo
        - Partes envolvidas
        - Prazos importantes
        - Próximos passos recomendados
        - Pontos de atenção`;
        break;
        
      case 'create_petition':
        systemPrompt = `Você é um advogado especializado em redação de petições.
        Crie uma petição inicial profissional seguindo as normas do CPC.
        Inclua: cabeçalho, qualificação das partes, dos fatos, do direito, dos pedidos e requerimentos.
        Use linguagem jurídica formal e adequada.`;
        break;
        
      case 'create_contract':
        systemPrompt = `Você é um advogado especializado em contratos.
        Elabore um contrato completo e juridicamente válido.
        Inclua todas as cláusulas necessárias, proteções legais e termos adequados.`;
        break;

      case 'legal_advice':
        systemPrompt = `Você é um assistente jurídico especializado.
        Forneça orientação jurídica clara e fundamentada.
        Cite artigos de lei quando relevante.
        Seja objetivo e profissional.`;
        break;
        
      default:
        systemPrompt = 'Você é um assistente jurídico especializado. Ajude de forma clara e profissional.';
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `${context ? context + '\n\n' : ''}${prompt}` }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Erro ao chamar API do OpenAI');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      response: data.choices[0].message.content,
      usage: data.usage,
    });
    
  } catch (error: any) {
    console.error('OpenAI Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
