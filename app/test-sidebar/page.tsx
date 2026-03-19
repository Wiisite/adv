import Layout from '@/components/Layout';

export default function TestSidebarPage() {
  return (
    <Layout>
      <main className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Teste do Sidebar</h1>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p className="font-bold">✅ Se você está vendo esta página com o sidebar à esquerda, funcionou!</p>
          <p className="mt-2">O sidebar deve estar visível com os seguintes itens:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Dashboard</li>
            <li>Clientes</li>
            <li>Processos</li>
            <li>Documentos</li>
            <li>Agenda</li>
          </ul>
        </div>
      </main>
    </Layout>
  );
}
