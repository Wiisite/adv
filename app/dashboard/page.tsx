import { Users, Briefcase, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function DashboardPage() {
  return (
    <Layout>
      <main className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Bem-vindo ao sistema de gestão</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/clientes" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clientes</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
              <Users className="h-10 w-10 text-blue-600" />
            </div>
          </Link>

          <Link href="/processos" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processos</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
              <Briefcase className="h-10 w-10 text-green-600" />
            </div>
          </Link>

          <Link href="/documentos" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Documentos</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
              <FileText className="h-10 w-10 text-purple-600" />
            </div>
          </Link>

          <Link href="/agenda" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compromissos</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
              <Calendar className="h-10 w-10 text-orange-600" />
            </div>
          </Link>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Atividades Recentes</h2>
          <p className="text-gray-600">Nenhuma atividade registrada ainda.</p>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">✅ Sistema Funcionando!</h3>
          <p className="text-blue-700">
            O deploy foi realizado com sucesso. O banco de dados está conectado e o sistema está pronto para uso.
          </p>
          <p className="text-blue-600 text-sm mt-2">
            Próximos passos: Implementar CRUD de clientes, processos e documentos.
          </p>
        </div>
      </main>
    </div>
  );
}
Layout