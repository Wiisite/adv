import Link from 'next/link';
import { Scale, Shield, Users, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Scale className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">Sistema de Advocacia</span>
            </div>
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Entrar
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Sistema de Gestão para Advocacia
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gerencie clientes, processos, documentos e compromissos de forma eficiente e organizada.
          </p>
          <div className="mt-8">
            <Link
              href="/login"
              className="inline-block px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors"
            >
              Começar Agora
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <Users className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestão de Clientes</h3>
            <p className="text-gray-600 text-sm">
              Cadastre e gerencie todos os seus clientes em um só lugar.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <Scale className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Controle de Processos</h3>
            <p className="text-gray-600 text-sm">
              Acompanhe todos os processos jurídicos de forma organizada.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <FileText className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Documentos</h3>
            <p className="text-gray-600 text-sm">
              Armazene e organize todos os documentos importantes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Segurança</h3>
            <p className="text-gray-600 text-sm">
              Seus dados protegidos com autenticação e criptografia.
            </p>
          </div>
        </div>

        <div className="mt-16 bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            ✅ Sistema Pronto para Uso
          </h2>
          <div className="text-center text-gray-600">
            <p className="mb-2">Deploy realizado com sucesso no Easypanel</p>
            <p className="mb-4">Banco de dados PostgreSQL conectado e funcionando</p>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg inline-block">
              <p className="text-sm text-blue-900 font-semibold">Credenciais de teste:</p>
              <p className="text-sm text-blue-700 font-mono mt-1">admin@sistema.com / admin123</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>© 2026 Sistema de Advocacia - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}
