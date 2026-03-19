'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale, Users, Briefcase, FileText, Calendar, LayoutDashboard } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clientes', href: '/clientes', icon: Users },
    { name: 'Processos', href: '/processos', icon: Briefcase },
    { name: 'Documentos', href: '/documentos', icon: FileText },
    { name: 'Agenda', href: '/agenda', icon: Calendar },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center">
          <Scale className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-800">Sistema Adv</span>
        </Link>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Modo Teste
        </div>
      </div>
    </div>
  );
}
