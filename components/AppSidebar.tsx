'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus,
  FolderOpen,
  DollarSign,
  FileText,
  Calendar,
  FileCheck,
  Scale,
  Gavel,
  Briefcase,
  ClipboardList,
  UserCheck,
  Award,
  Globe,
  Building,
  TrendingUp,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

interface MenuItem {
  label: string;
  icon: any;
  href?: string;
  submenu?: { label: string; href: string }[];
}

export default function AppSidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>(['Pessoas']);

  const menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    {
      label: 'Pessoas',
      icon: Users,
      submenu: [
        { label: 'Clientes', href: '/clientes' },
        { label: 'Usuários', href: '/usuarios' },
        { label: 'Profissionais', href: '/profissionais' },
        { label: 'Fornecedores', href: '/fornecedores' },
      ]
    },
    {
      label: 'Cadastros',
      icon: FolderOpen,
      submenu: [
        { label: 'Prompts', href: '/cadastros/prompts' },
        { label: 'Formas Pgto', href: '/cadastros/formas-pgto' },
        { label: 'Frequências', href: '/cadastros/frequencias' },
        { label: 'Cargos', href: '/cadastros/cargos' },
        { label: 'Serviços Prestados', href: '/cadastros/servicos' },
        { label: 'Modelos de Contratos', href: '/cadastros/modelos-contratos' },
        { label: 'Grupos', href: '/cadastros/grupos' },
        { label: 'Assuntos', href: '/cadastros/assuntos' },
      ]
    },
    { label: 'Financeiro', icon: DollarSign, href: '/financeiro' },
    { label: 'Anotações', icon: FileText, href: '/anotacoes' },
    { label: 'Caixas', icon: Building, href: '/caixas' },
    { label: 'Calendário', icon: Calendar, href: '/calendario' },
    { label: 'Tarefas / Agenda', icon: Calendar, href: '/agenda' },
    { label: 'Abertura de Contratos', icon: FileCheck, href: '/contratos' },
    { label: 'Gerar Contrato', icon: Scale, href: '/gerar-contrato' },
    { label: 'Processos', icon: Gavel, href: '/processos' },
    { label: 'Processos Andamento', icon: Briefcase, href: '/processos-andamento' },
    { label: 'Casos Solicitados', icon: ClipboardList, href: '/casos-solicitados' },
    { label: 'Audiências', icon: UserCheck, href: '/audiencias' },
    { label: 'Perícias', icon: Award, href: '/pericias' },
    { label: 'Benefícios / OCB', icon: Award, href: '/beneficios' },
    { label: 'Site', icon: Globe, href: '/site' },
    { label: 'RH', icon: Users, href: '/rh' },
    { label: 'Marketing', icon: TrendingUp, href: '/marketing' },
  ];

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 bg-gray-900 dark:bg-gray-950 text-white h-screen overflow-y-auto">
      <div className="p-4 border-b border-gray-800 dark:border-gray-700">
        <h1 className="text-xl font-bold text-cyan-400">Sistema Advocacia</h1>
      </div>
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <div key={item.label}>
            {item.submenu ? (
              <div>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {openMenus.includes(item.label) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {openMenus.includes(item.label) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`block px-3 py-2 rounded text-sm transition-colors ${
                          isActive(subItem.href)
                            ? 'bg-cyan-600 text-white'
                            : 'hover:bg-gray-800'
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href!}
                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                  isActive(item.href!)
                    ? 'bg-cyan-600 text-white'
                    : 'hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
