import Link from 'next/link';
import { Scale } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center">
            <Scale className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">Sistema de Advocacia</span>
          </Link>
          
          <div className="flex space-x-4">
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/clientes" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Clientes
            </Link>
            <Link href="/processos" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Processos
            </Link>
            <Link href="/documentos" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Documentos
            </Link>
            <Link href="/agenda" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Agenda
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
